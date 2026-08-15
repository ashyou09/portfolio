import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from 'motion/react';

/*
 * A transformer block, built as a thing you can turn over in your hands.
 *
 * Eight token columns run up through four layers. The arcs inside each layer
 * are tokens attending to one another, the columns are the residual stream
 * carrying each token upward, and the signals travel with the forward pass.
 *
 * Selecting a part from the list beside it lifts that part and dims the rest,
 * so the model doubles as the diagram.
 *
 * All arc geometry is baked into a single LineSegments buffer, so switching
 * parts is a colour-attribute write rather than a rebuild.
 */

const TOKENS = 8;
const LAYERS = 4;
const ARCS_PER_LAYER = 10;
const ARC_SEGMENTS = 20;
const PULSE_COUNT = 34;

const SPACING = 0.82;
const LAYER_GAP = 1.24;
const BASE_Y = -1.85;

const ACCENT = new THREE.Color('#f0a22e');
const IDLE = new THREE.Color('#8f9aa8');
const DIM = new THREE.Color('#333941');

const tokenX = (index) => (index - (TOKENS - 1) / 2) * SPACING;
const layerY = (index) => BASE_Y + index * LAYER_GAP;

function arcPoint(from, to, y, t, depth) {
  const rise = 0.22 + Math.abs(to - from) * 0.14;
  const x = tokenX(from) + (tokenX(to) - tokenX(from)) * t;
  return new THREE.Vector3(x, y + Math.sin(t * Math.PI) * rise, depth);
}

function buildArcs() {
  const arcs = [];
  const positions = [];

  for (let layer = 0; layer < LAYERS; layer += 1) {
    const y = layerY(layer);
    const seen = new Set();

    for (let n = 0; n < ARCS_PER_LAYER; n += 1) {
      const from = Math.floor(Math.random() * TOKENS);
      let to = Math.floor(Math.random() * TOKENS);
      if (to === from) to = (to + 1 + Math.floor(Math.random() * 3)) % TOKENS;

      const key = `${layer}:${Math.min(from, to)}:${Math.max(from, to)}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const depth = (Math.random() - 0.5) * 0.85;
      const start = positions.length / 3;
      for (let s = 0; s < ARC_SEGMENTS; s += 1) {
        const a = arcPoint(from, to, y, s / ARC_SEGMENTS, depth);
        const b = arcPoint(from, to, y, (s + 1) / ARC_SEGMENTS, depth);
        positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
      }

      arcs.push({
        layer,
        start,
        count: ARC_SEGMENTS * 2,
        points: Array.from({ length: ARC_SEGMENTS + 1 }, (_, s) =>
          arcPoint(from, to, y, s / ARC_SEGMENTS, depth)
        ),
      });
    }
  }

  return { arcs, positions: new Float32Array(positions) };
}

/** Which pieces each selectable part lights up. */
const EMPHASIS = {
  embed: { input: true },
  attention: { arcs: true },
  ffn: { nodes: true },
  residual: { columns: true },
  output: { output: true },
};

function Stack({ part, animate }) {
  const group = useRef(null);
  const pulses = useRef(null);
  const { arcs, positions } = useMemo(buildArcs, []);
  const focus = EMPHASIS[part] || {};

  const arcGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute(
      'color',
      new THREE.BufferAttribute(new Float32Array(positions.length), 3)
    );
    return geometry;
  }, [positions]);

  useMemo(() => {
    const colors = arcGeometry.attributes.color.array;
    const tone = focus.arcs ? ACCENT : DIM;
    const value = focus.arcs ? 1 : 0.55;
    arcs.forEach((arc) => {
      for (let v = arc.start; v < arc.start + arc.count; v += 1) {
        colors[v * 3] = tone.r * value;
        colors[v * 3 + 1] = tone.g * value;
        colors[v * 3 + 2] = tone.b * value;
      }
    });
    arcGeometry.attributes.color.needsUpdate = true;
  }, [arcs, arcGeometry, focus.arcs]);

  const pulseState = useMemo(
    () =>
      Array.from({ length: PULSE_COUNT }, () => ({
        arc: Math.floor(Math.random() * arcs.length),
        t: Math.random(),
        // Deliberately unhurried: fast signals read as noise.
        speed: 0.09 + Math.random() * 0.11,
      })),
    [arcs.length]
  );

  const pulseGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(PULSE_COUNT * 3), 3)
    );
    return geometry;
  }, []);

  const dot = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 48;
    canvas.height = 48;
    const context = canvas.getContext('2d');
    const gradient = context.createRadialGradient(24, 24, 0, 24, 24, 24);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.42, 'rgba(255,255,255,0.8)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 48, 48);
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state, delta) => {
    if (!animate) return;
    const step = Math.min(delta, 0.05);

    if (group.current) {
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.24) * 0.07;
    }

    if (pulses.current) {
      const array = pulses.current.geometry.attributes.position.array;
      for (let i = 0; i < pulseState.length; i += 1) {
        const pulse = pulseState[i];
        pulse.t += pulse.speed * step;
        if (pulse.t >= 1) {
          pulse.t = 0;
          pulse.arc = Math.floor(Math.random() * arcs.length);
        }
        const arc = arcs[pulse.arc];
        const point = arc.points[Math.min(ARC_SEGMENTS, Math.floor(pulse.t * ARC_SEGMENTS))];
        array[i * 3] = point.x;
        array[i * 3 + 1] = point.y;
        array[i * 3 + 2] = point.z;
      }
      pulses.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const stackHeight = LAYER_GAP * (LAYERS - 1) + 1.4;

  const nodeTone = (layer) => {
    if (focus.output && layer === LAYERS - 1) return ACCENT;
    if (focus.nodes) return ACCENT;
    return IDLE;
  };

  const nodeOpacity = (layer) => {
    if (focus.output) return layer === LAYERS - 1 ? 1 : 0.14;
    if (focus.nodes) return 0.9;
    return 0.32;
  };

  return (
    <group ref={group}>
      {/* Residual stream: one column per token */}
      {Array.from({ length: TOKENS }, (_, i) => (
        <mesh key={i} position={[tokenX(i), BASE_Y + stackHeight / 2 - 0.7, 0]}>
          <boxGeometry args={[0.09, stackHeight, 0.09]} />
          <meshBasicMaterial
            color={focus.columns ? ACCENT : IDLE}
            transparent
            opacity={focus.columns ? 0.75 : 0.1}
          />
        </mesh>
      ))}

      {/* Token embeddings entering at the base */}
      {Array.from({ length: TOKENS }, (_, i) => (
        <mesh key={`in-${i}`} position={[tokenX(i), BASE_Y - 0.62, 0]}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshBasicMaterial
            color={focus.input ? ACCENT : IDLE}
            transparent
            opacity={focus.input ? 1 : 0.22}
          />
        </mesh>
      ))}

      {/* One node per token per layer */}
      {Array.from({ length: LAYERS }, (_, layer) =>
        Array.from({ length: TOKENS }, (_, i) => (
          <mesh key={`${layer}-${i}`} position={[tokenX(i), layerY(layer), 0]}>
            <boxGeometry args={[0.19, 0.19, 0.19]} />
            <meshBasicMaterial
              color={nodeTone(layer)}
              transparent
              opacity={nodeOpacity(layer)}
            />
          </mesh>
        ))
      )}

      <lineSegments geometry={arcGeometry}>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={focus.arcs ? 0.9 : 0.4}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      <points ref={pulses} geometry={pulseGeometry}>
        <pointsMaterial
          map={dot}
          alphaMap={dot}
          color={ACCENT}
          size={0.17}
          sizeAttenuation
          transparent
          opacity={focus.arcs ? 1 : 0.5}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export default function TransformerStack({ part = 'attention' }) {
  const reduce = useReducedMotion();

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.7, 10.6], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <group rotation={[0.06, -0.3, 0]}>
        <Stack part={part} animate={!reduce} />
      </group>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.07}
        autoRotate={!reduce}
        autoRotateSpeed={0.2}
        minPolarAngle={Math.PI / 3.6}
        maxPolarAngle={Math.PI / 1.85}
        rotateSpeed={0.45}
      />
    </Canvas>
  );
}
