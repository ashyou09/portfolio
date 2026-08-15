import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from 'motion/react';

/*
 * A trimmed, self-contained rebuild of the Visakhapatnam Port digital twin,
 * running inline on this page so the project can be handled rather than
 * described. The full simulator lives in its own repository.
 *
 * Motivation for the motion here: the cranes and trucks are the mechanism the
 * project models, so they have to move for the section to mean anything.
 */

const CARGO = ['#8a4b3a', '#3d4854', '#6b6f56', '#7a6a4f', '#4a5b62', '#5d4a55'];
const QUAY_LENGTH = 46;

function Water({ night, animate }) {
  const mesh = useRef(null);

  useFrame((state) => {
    if (!mesh.current || !animate) return;
    // Slow swell, driven from the material offset rather than vertex work.
    mesh.current.position.y = -0.6 + Math.sin(state.clock.elapsedTime * 0.35) * 0.03;
  });

  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 120]} receiveShadow>
      <planeGeometry args={[420, 300]} />
      <meshStandardMaterial
        color={night ? '#0a1725' : '#17506b'}
        roughness={0.18}
        metalness={0.65}
      />
    </mesh>
  );
}

function Ground({ night }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.55, -118]} receiveShadow>
        <planeGeometry args={[420, 240]} />
        <meshStandardMaterial color={night ? '#15181d' : '#34363a'} roughness={0.96} />
      </mesh>

      {/* Quay wall along the waterline */}
      <mesh position={[0, -0.15, 0]} receiveShadow castShadow>
        <boxGeometry args={[QUAY_LENGTH + 14, 1.1, 5]} />
        <meshStandardMaterial color={night ? '#1b1e23' : '#3a3b3d'} roughness={0.9} />
      </mesh>
    </group>
  );
}

function Crane({ x, phase, night, animate }) {
  const trolley = useRef(null);
  const spreader = useRef(null);

  useFrame((state) => {
    if (!animate) return;
    const t = state.clock.elapsedTime * 0.32 + phase;
    // Trolley tracks out over the water and back; the spreader dips at the ends.
    const travel = Math.sin(t) * 7.5;
    if (trolley.current) trolley.current.position.z = travel;
    if (spreader.current) {
      spreader.current.position.z = travel;
      spreader.current.position.y = 6.2 - (1 - Math.abs(Math.cos(t))) * 4.6;
    }
  });

  const legColor = night ? '#2a2d33' : '#4c4f55';

  return (
    <group position={[x, 0, -1]}>
      {[-2.6, 2.6].map((offset) =>
        [-2.4, 2.4].map((side) => (
          <mesh key={`${offset}-${side}`} position={[offset, 3.6, side]} castShadow>
            <boxGeometry args={[0.42, 8.4, 0.42]} />
            <meshStandardMaterial color={legColor} roughness={0.7} metalness={0.35} />
          </mesh>
        ))
      )}

      {/* Boom reaching out across the berth */}
      <mesh position={[0, 7.9, 1.5]} castShadow>
        <boxGeometry args={[1.5, 0.6, 22]} />
        <meshStandardMaterial color="#c07b26" roughness={0.55} metalness={0.3} />
      </mesh>

      <mesh position={[0, 9.4, -2]} castShadow>
        <boxGeometry args={[2.4, 2.4, 3.4]} />
        <meshStandardMaterial color={legColor} roughness={0.7} metalness={0.35} />
      </mesh>

      <mesh ref={trolley} position={[0, 7.4, 0]} castShadow>
        <boxGeometry args={[1.7, 0.7, 1.7]} />
        <meshStandardMaterial color="#d18f34" roughness={0.5} metalness={0.4} />
      </mesh>

      <mesh ref={spreader} position={[0, 6.2, 0]} castShadow>
        <boxGeometry args={[2.1, 0.35, 2.4]} />
        <meshStandardMaterial color="#8b8f96" roughness={0.6} metalness={0.5} />
      </mesh>

      {night && (
        <>
          <pointLight position={[0, 8.2, 6]} color="#ffb547" intensity={26} distance={26} />
          <mesh position={[0, 10.7, -2]}>
            <sphereGeometry args={[0.22, 10, 10]} />
            <meshBasicMaterial color="#ffcc7a" />
          </mesh>
        </>
      )}
    </group>
  );
}

function ContainerStacks({ count = 190 }) {
  const mesh = useRef(null);

  const instances = useMemo(() => {
    const dummy = new THREE.Object3D();
    const matrices = [];
    const colors = [];

    for (let i = 0; i < count; i += 1) {
      const row = Math.floor(i / 26);
      const column = i % 26;
      const height = Math.floor(Math.random() * 3);
      dummy.position.set(-31 + column * 2.5, -0.1 + height * 1.3, -9 - row * 3.4);
      dummy.rotation.set(0, Math.random() > 0.92 ? Math.PI / 2 : 0, 0);
      dummy.updateMatrix();
      matrices.push(dummy.matrix.clone());
      colors.push(new THREE.Color(CARGO[i % CARGO.length]));
    }

    return { matrices, colors };
  }, [count]);

  // Matrices and colours are written once, on mount, through the ref callback.
  const attach = (node) => {
    mesh.current = node;
    if (!node) return;
    instances.matrices.forEach((matrix, i) => node.setMatrixAt(i, matrix));
    instances.colors.forEach((color, i) => node.setColorAt(i, color));
    node.instanceMatrix.needsUpdate = true;
    if (node.instanceColor) node.instanceColor.needsUpdate = true;
  };

  return (
    <instancedMesh
      ref={attach}
      args={[undefined, undefined, count]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[2.3, 1.25, 1.15]} />
      <meshStandardMaterial roughness={0.85} metalness={0.1} />
    </instancedMesh>
  );
}

function Traffic({ count = 34, night, animate }) {
  const mesh = useRef(null);
  const lanes = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        z: i % 2 === 0 ? -5.4 : -7.4,
        direction: i % 2 === 0 ? 1 : -1,
        offset: (i / count) * 84,
        speed: 3.4 + Math.random() * 2.6,
      })),
    [count]
  );

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    const node = mesh.current;
    if (!node) return;

    lanes.forEach((lane, i) => {
      if (animate) lane.offset += lane.speed * Math.min(delta, 0.05);
      if (lane.offset > 84) lane.offset = 0;
      const x = -42 + lane.offset;
      dummy.position.set(lane.direction > 0 ? x : -x, 0.5, lane.z);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      node.setMatrixAt(i, dummy.matrix);
    });

    node.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} castShadow>
      <boxGeometry args={[2.6, 1.1, 1.2]} />
      <meshStandardMaterial
        color={night ? '#565b63' : '#9aa0a8'}
        roughness={0.7}
        metalness={0.2}
        emissive={night ? '#3a2a10' : '#000000'}
      />
    </instancedMesh>
  );
}

function Warehouses({ night }) {
  const blocks = [
    { x: -26, z: -30, w: 16, h: 5, d: 9 },
    { x: -4, z: -33, w: 20, h: 6.4, d: 10 },
    { x: 22, z: -29, w: 14, h: 4.6, d: 8 },
  ];

  return (
    <group>
      {blocks.map((block) => (
        <mesh key={block.x} position={[block.x, block.h / 2 - 0.5, block.z]} castShadow receiveShadow>
          <boxGeometry args={[block.w, block.h, block.d]} />
          <meshStandardMaterial
            color={night ? '#1d2026' : '#43464b'}
            roughness={0.9}
            emissive={night ? '#241a08' : '#000000'}
            emissiveIntensity={night ? 0.6 : 0}
          />
        </mesh>
      ))}
    </group>
  );
}

function Scene({ night, animate }) {
  return (
    <>
      <color attach="background" args={[night ? '#070a10' : '#0e141b']} />
      <fog attach="fog" args={[night ? '#070a10' : '#101821', 80, 260]} />

      <hemisphereLight
        args={[night ? '#2c3959' : '#a9cde4', night ? '#06080c' : '#303236', night ? 0.5 : 1.35]}
      />
      <directionalLight
        position={[24, 32, 16]}
        intensity={night ? 0.3 : 2.4}
        color={night ? '#7f92c8' : '#ffe4bd'}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      <Ground night={night} />
      <Water night={night} animate={animate} />
      <ContainerStacks />
      <Warehouses night={night} />
      <Traffic night={night} animate={animate} />

      {[-16, 0, 16].map((x, i) => (
        <Crane key={x} x={x} phase={i * 1.9} night={night} animate={animate} />
      ))}

      <OrbitControls
        enablePan={false}
        enableDamping
        dampingFactor={0.06}
        minDistance={30}
        maxDistance={85}
        minPolarAngle={0.45}
        maxPolarAngle={Math.PI / 2.22}
        autoRotate={animate}
        autoRotateSpeed={0.32}
        makeDefault
      />
    </>
  );
}

export default function PortTwin({ night = false }) {
  const reduce = useReducedMotion();

  return (
    <Canvas
      shadows
      dpr={[1, 1.6]}
      camera={{ position: [6, 21, 52], fov: 40 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <Scene night={night} animate={!reduce} />
    </Canvas>
  );
}
