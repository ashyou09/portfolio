import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from 'motion/react';
import { createNetwork, forward, trainStep, sampleGrid, DATASETS } from './mlp';

/*
 * Hero scene: a neural network training in front of you, for real.
 *
 * The plane underneath is the input space. The network above it is a 2-8-8-1
 * MLP, and every edge you see is one weight: amber for positive, slate for
 * negative, brighter as the magnitude grows. The colours on the plane are that
 * same network's output sampled over a grid, so the boundary you watch form is
 * the model actually learning to separate the data.
 *
 * None of it is a canned animation. Switch the dataset and it has to learn the
 * new shape from scratch, and you can watch it struggle with the spiral.
 */

const SPAN_X = 4.9;   // total width the network occupies, whatever its depth
const SPAN_Y = 3.5;    // and the tallest a column may get
const BASE_Y = 0.75;
const GRID_RESOLUTION = 40;
const FLOOR_Y = -2.15;
const FLOOR_SPAN = 5.4;
const EXTENT = 1.15;
const POINT_COUNT = 220;
const FLOW_COUNT = 44;

// Annotations only stay legible on a small network. Past these counts the
// labels are suppressed and the panel says so.
const NODE_LABEL_LIMIT = 18;
const WEIGHT_LABEL_LIMIT = 22;

const POSITIVE = new THREE.Color('#f0a22e');
const NEGATIVE = new THREE.Color('#5c6674');
const CLASS_A = new THREE.Color('#f0a22e');
const CLASS_B = new THREE.Color('#8f9aa8');

/**
 * The network is laid out to a fixed footprint, so adding a hidden layer packs
 * the columns closer instead of running off the edge of the panel.
 */
function makeLayout(sizes) {
  const layerGap = sizes.length > 1 ? SPAN_X / (sizes.length - 1) : 0;
  const widest = Math.max(...sizes);
  const unitGap = Math.min(0.82, SPAN_Y / Math.max(widest - 1, 1));

  return (layer, unit, size) =>
    new THREE.Vector3(
      (layer - (sizes.length - 1) / 2) * layerGap,
      BASE_Y + (unit - (size - 1) / 2) * unitGap,
      0
    );
}

/** World position for a data point: input space maps onto the floor plane. */
const floorPosition = (point) =>
  new THREE.Vector3(
    (point.x / EXTENT) * (FLOOR_SPAN / 2),
    FLOOR_Y + 0.055,
    (point.y / EXTENT) * (FLOOR_SPAN / 2)
  );

/** x1, x2 for the inputs, h for hidden units, y-hat for the output. */
function labelFor(slot, sizes) {
  if (slot.layer === 0) return `x${slot.unit + 1}`;
  if (slot.layer === sizes.length - 1) return 'y';
  return `h${slot.layer}.${slot.unit + 1}`;
}

function Scene({ dataset, hidden, learningRate, annotate, resetKey, animate, onStats }) {
  const architecture = hidden.join('-');
  const net = useMemo(
    () => createNetwork(hidden),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [resetKey, dataset, architecture]
  );
  // resetKey is deliberately a dependency: bumping it is how the reset button
  // forces a fresh sample and a fresh initialisation.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const points = useMemo(() => DATASETS[dataset].generate(POINT_COUNT), [dataset, resetKey]);
  const sizes = net.sizes;
  const nodePosition = useMemo(() => makeLayout(sizes), [sizes]);

  const nodeRef = useRef(null);
  const pointRef = useRef(null);
  const flowRef = useRef(null);
  const probeRef = useRef(null);
  const epoch = useRef(0);
  const sinceTexture = useRef(0);
  const sinceStats = useRef(0);

  // --- edges: one line segment per weight ---------------------------------
  const { edgeGeometry, edgeIndex } = useMemo(() => {
    const positions = [];
    const index = [];

    for (let l = 1; l < sizes.length; l += 1) {
      for (let n = 0; n < sizes[l]; n += 1) {
        for (let w = 0; w < sizes[l - 1]; w += 1) {
          const a = nodePosition(l - 1, w, sizes[l - 1]);
          const b = nodePosition(l, n, sizes[l]);
          positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
          index.push({ layer: l - 1, unit: n, weight: w, from: a, to: b });
        }
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    geometry.setAttribute(
      'color',
      new THREE.BufferAttribute(new Float32Array(positions.length), 3)
    );
    return { edgeGeometry: geometry, edgeIndex: index };
  }, [sizes, nodePosition]);

  // --- nodes --------------------------------------------------------------
  const nodeSlots = useMemo(() => {
    const slots = [];
    sizes.forEach((size, layer) => {
      for (let unit = 0; unit < size; unit += 1) {
        slots.push({ layer, unit, position: nodePosition(layer, unit, size) });
      }
    });
    return slots;
  }, [sizes, nodePosition]);

  // --- forward-pass flow: dots riding every edge from input to output -------
  // One arrow per connection, phase-offset so they do not march in lockstep.
  // Any slots beyond the connection count are parked out of sight.
  const flowState = useMemo(
    () =>
      Array.from({ length: FLOW_COUNT }, (_, i) => ({
        edge: i,
        active: i < edgeIndex.length,
        t: (i * 0.37) % 1,
        speed: 0.17 + ((i * 7) % 5) * 0.018,
      })),
    [edgeIndex.length]
  );

  const flowDummy = useMemo(() => new THREE.Object3D(), []);

  // --- decision boundary texture -----------------------------------------
  const boundary = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = GRID_RESOLUTION;
    canvas.height = GRID_RESOLUTION;
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return { canvas, texture, context: canvas.getContext('2d') };
  }, []);

  const paintBoundary = () => {
    const values = sampleGrid(net, GRID_RESOLUTION, EXTENT);
    const image = boundary.context.createImageData(GRID_RESOLUTION, GRID_RESOLUTION);
    const mix = new THREE.Color();

    for (let i = 0; i < values.length; i += 1) {
      mix.copy(CLASS_B).lerp(CLASS_A, values[i]);
      // Confidence, not raw probability: the interesting part is the frontier.
      const strength = 0.16 + Math.abs(values[i] - 0.5) * 0.62;
      image.data[i * 4] = mix.r * 255;
      image.data[i * 4 + 1] = mix.g * 255;
      image.data[i * 4 + 2] = mix.b * 255;
      image.data[i * 4 + 3] = strength * 255;
    }

    boundary.context.putImageData(image, 0, 0);
    boundary.texture.needsUpdate = true;
  };

  useEffect(() => {
    epoch.current = 0;
    paintBoundary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [net, points]);

  // Data points sit on the floor, coloured by their true label.
  useEffect(() => {
    const node = pointRef.current;
    if (!node) return;
    const dummy = new THREE.Object3D();
    points.forEach((point, i) => {
      dummy.position.copy(floorPosition(point));
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      node.setMatrixAt(i, dummy.matrix);
      node.setColorAt(i, point.label ? CLASS_A : CLASS_B);
    });
    node.count = points.length;
    node.instanceMatrix.needsUpdate = true;
    if (node.instanceColor) node.instanceColor.needsUpdate = true;
  }, [points]);

  useFrame((state, delta) => {
    const step = Math.min(delta, 0.05);

    if (animate) {
      // Two SGD steps per frame with a small batch. Fast enough that circles
      // resolve in a few seconds, slow enough that you actually watch the
      // boundary form rather than seeing it appear already solved.
      let last = { loss: 0, accuracy: 0 };
      last = trainStep(net, points, learningRate, 14);
      epoch.current += 1;

      sinceTexture.current += step;
      if (sinceTexture.current > 0.14) {
        sinceTexture.current = 0;
        paintBoundary();
      }

      sinceStats.current += step;
      if (sinceStats.current > 0.25) {
        sinceStats.current = 0;
        onStats({ epoch: epoch.current, loss: last.loss, accuracy: last.accuracy });
      }
    }

    // Edge colour tracks weight sign and magnitude.
    const colors = edgeGeometry.attributes.color.array;
    edgeIndex.forEach((edge, i) => {
      const weight = net.layers[edge.layer].weights[edge.unit][edge.weight];
      const strength = Math.min(Math.abs(weight) / 2.2, 1);
      const tone = weight >= 0 ? POSITIVE : NEGATIVE;
      const value = 0.06 + strength * 0.94;
      for (let v = i * 2; v < i * 2 + 2; v += 1) {
        colors[v * 3] = tone.r * value;
        colors[v * 3 + 1] = tone.g * value;
        colors[v * 3 + 2] = tone.b * value;
      }
    });
    edgeGeometry.attributes.color.needsUpdate = true;

    // Arrowheads ride every edge from input to output, each turned to face the
    // way it is travelling, so the direction of the forward pass is explicit
    // rather than implied.
    if (flowRef.current && edgeIndex.length) {
      for (let i = 0; i < flowState.length; i += 1) {
        const flow = flowState[i];
        if (!flow.active) {
          flowDummy.position.set(0, 0, 0);
          flowDummy.scale.setScalar(0);
          flowDummy.updateMatrix();
          flowRef.current.setMatrixAt(i, flowDummy.matrix);
          continue;
        }
        if (animate) flow.t += flow.speed * step;
        if (flow.t >= 1) flow.t = 0;
        const edge = edgeIndex[flow.edge];
        flowDummy.position.set(
          edge.from.x + (edge.to.x - edge.from.x) * flow.t,
          edge.from.y + (edge.to.y - edge.from.y) * flow.t,
          edge.from.z + (edge.to.z - edge.from.z) * flow.t
        );
        // lookAt aims -Z at the target; a cone points +Y, hence the quarter turn.
        flowDummy.lookAt(edge.to);
        flowDummy.rotateX(Math.PI / 2);
        // Fade in and out at the ends so arrows do not pop at the nodes.
        const fade = Math.sin(flow.t * Math.PI);
        flowDummy.scale.setScalar(0.35 + fade * 0.8);
        flowDummy.updateMatrix();
        flowRef.current.setMatrixAt(i, flowDummy.matrix);
      }
      flowRef.current.instanceMatrix.needsUpdate = true;
    }

    // Node brightness tracks the live activation for one sample, cycled slowly
    // so the whole dataset flows through the network over time.
    const node = nodeRef.current;
    if (node) {
      const probe = points[Math.floor(state.clock.elapsedTime * 1.6) % points.length];
      probeRef.current = probe;
      forward(net, [probe.x, probe.y]);
      const dummy = new THREE.Object3D();
      const tint = new THREE.Color();

      nodeSlots.forEach((slot, i) => {
        let activation;
        if (slot.layer === 0) {
          activation = slot.unit === 0 ? probe.x : probe.y;
        } else {
          activation = net.layers[slot.layer - 1].outputs[slot.unit];
        }
        const magnitude = Math.min(Math.abs(activation), 1);
        dummy.position.copy(slot.position);
        dummy.scale.setScalar(0.9 + magnitude * 0.55);
        dummy.updateMatrix();
        node.setMatrixAt(i, dummy.matrix);
        tint.copy(activation >= 0 ? POSITIVE : NEGATIVE).multiplyScalar(0.3 + magnitude * 0.7);
        node.setColorAt(i, tint);
      });

      node.instanceMatrix.needsUpdate = true;
      if (node.instanceColor) node.instanceColor.needsUpdate = true;
    }
  });

  return (
    <>
      {/* Input space with the network's own decision surface painted on it */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR_Y, 0]}>
        <planeGeometry args={[FLOOR_SPAN, FLOOR_SPAN]} />
        <meshBasicMaterial map={boundary.texture} transparent depthWrite={false} />
      </mesh>

      <instancedMesh ref={pointRef} args={[undefined, undefined, POINT_COUNT]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      <lineSegments geometry={edgeGeometry}>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.85}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* An instanced mesh cannot resize in place, so it remounts on count. */}
      <instancedMesh key={nodeSlots.length} ref={nodeRef} args={[undefined, undefined, nodeSlots.length]}>
        <sphereGeometry args={[0.125, 16, 16]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      <instancedMesh ref={flowRef} args={[undefined, undefined, FLOW_COUNT]}>
        <coneGeometry args={[0.05, 0.16, 7]} />
        <meshBasicMaterial
          color={POSITIVE}
          transparent
          opacity={0.9}
          toneMapped={false}
          depthWrite={false}
        />
      </instancedMesh>

      {annotate === 'nodes' && nodeSlots.length <= NODE_LABEL_LIMIT &&
        nodeSlots.map((slot) => (
          <Html
            key={`label-${slot.layer}-${slot.unit}`}
            position={[slot.position.x, slot.position.y + 0.22, slot.position.z]}
            center
            distanceFactor={9}
            style={{ pointerEvents: 'none' }}
          >
            <span className="scene-tag">{labelFor(slot, sizes)}</span>
          </Html>
        ))}

      {annotate === 'weights' && edgeIndex.length <= WEIGHT_LABEL_LIMIT &&
        edgeIndex.map((edge, i) => (
          <Html
            key={`w-${i}`}
            position={[
              edge.from.x + (edge.to.x - edge.from.x) * 0.74,
              edge.from.y + (edge.to.y - edge.from.y) * 0.74,
              edge.from.z + (edge.to.z - edge.from.z) * 0.74,
            ]}
            center
            distanceFactor={9}
            style={{ pointerEvents: 'none' }}
          >
            <span className="scene-tag scene-tag--weight">
              {net.layers[edge.layer].weights[edge.unit][edge.weight].toFixed(1)}
            </span>
          </Html>
        ))}
    </>
  );
}

// Distance the camera sits from the model on a landscape canvas.
const BASE_RADIUS = 4.86;

/**
 * Owns the orbit radius, and owns it exclusively.
 *
 * The camera must never be driven by writing position.z: as the controls
 * auto-rotate, z shrinks while x grows, so forcing z back to a fixed value
 * inflates the real radius a little every frame and the model walks away to
 * nothing. Distance is set with setLength, and locking min and max distance to
 * the same value means nothing can drift it afterwards.
 *
 * A perspective camera's fov is vertical, so a portrait canvas sees far less
 * width and needs more distance to fit the same model.
 */
function Rig({ animate }) {
  const { camera, size } = useThree();
  const aspect = size.width / Math.max(size.height, 1);
  const radius = BASE_RADIUS * (aspect < 0.85 ? 1.95 : aspect < 1.25 ? 1.42 : 1);

  useEffect(() => {
    camera.position.setLength(radius);
    camera.updateProjectionMatrix();
  }, [radius, camera]);

  return (
    <OrbitControls
      enablePan={false}
      enableZoom={false}
      enableDamping
      dampingFactor={0.07}
      minDistance={radius}
      maxDistance={radius}
      autoRotate={animate}
      autoRotateSpeed={0.3}
      minPolarAngle={Math.PI / 4.6}
      maxPolarAngle={Math.PI / 2.15}
      rotateSpeed={0.45}
    />
  );
}

/**
 * The settle-in on load and rebuild. Scaling the model is equivalent to moving
 * the camera here and, unlike the camera, nothing else is writing to it.
 */
function Intro({ trigger, animate, children }) {
  const group = useRef(null);
  const scale = useRef(1);

  useEffect(() => {
    scale.current = animate ? 0.84 : 1;
  }, [trigger, animate]);

  useFrame(() => {
    if (!group.current) return;
    scale.current += (1 - scale.current) * 0.035;
    group.current.scale.setScalar(scale.current);
  });

  return <group ref={group}>{children}</group>;
}

export default function LiveNetwork({
  dataset = 'circles',
  hidden = [8, 8],
  learningRate = 0.12,
  annotate = 'off',
  resetKey = 0,
  onStats,
}) {
  const reduce = useReducedMotion();

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 1.7, 4.55], fov: 54 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <Intro trigger={`${dataset}-${hidden.join('-')}-${resetKey}`} animate={!reduce}>
        <group rotation={[0, -0.24, 0]} position={[0, -0.62, 0]}>
          <Scene
            dataset={dataset}
            hidden={hidden}
            learningRate={learningRate}
            annotate={annotate}
            resetKey={resetKey}
            animate={!reduce}
            onStats={onStats}
          />
        </group>
      </Intro>

      <Rig animate={!reduce} />
    </Canvas>
  );
}
