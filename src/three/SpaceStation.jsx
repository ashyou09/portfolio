import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import * as THREE from 'three';
import { useReducedMotion } from 'motion/react';

/*
 * A station adrift above the hole.
 *
 * Why this is its own canvas rather than part of BlackHole: that component is
 * not a Three.js scene. It is a fullscreen fragment shader that integrates
 * photon geodesics and folds each frame into a running average, which is only
 * valid because the camera never moves. There is no depth buffer to rasterise
 * a mesh against, and anything that moved inside that pass would smear across
 * the accumulation. So the station gets a transparent canvas of its own,
 * composited over the top by CSS.
 *
 * The cost of that decision is honest: the station cannot pass behind the
 * horizon or be lensed by it. It is staged in front and to the side, where it
 * never needs to.
 */

const MODEL = '/models/spacestation.glb';

/*
 * The station bakes out of Geometry Nodes at 1.5M triangles. Decimated to 62k
 * and Draco-compressed it is 423 KB, down from 5.5 MB raw — worth the decoder,
 * which is served from /draco rather than a CDN so the page has no third-party
 * runtime dependency.
 */
function withDraco(loader) {
  const draco = new DRACOLoader();
  draco.setDecoderPath('/draco/');
  loader.setDRACOLoader(draco);
}

/**
 * The model arrives in whatever units it was authored in. Rather than hard-code
 * a scale that breaks the moment the asset is re-exported, fit it to a known
 * radius from its own bounding sphere and centre it on its own centroid.
 *
 * The radius is kept well inside the frustum on purpose: this station is tall
 * and thin, so its bounding sphere is set by the mast, and a radius that fills
 * the frame vertically clips the mast off the top of the hero.
 */
function useNormalised(scene, targetRadius) {
  return useMemo(() => {
    const root = scene.clone(true);
    const box = new THREE.Box3().setFromObject(root);
    const sphere = box.getBoundingSphere(new THREE.Sphere());

    root.position.sub(sphere.center);

    const wrapper = new THREE.Group();
    wrapper.add(root);
    wrapper.scale.setScalar(sphere.radius > 0 ? targetRadius / sphere.radius : 1);

    return wrapper;
  }, [scene, targetRadius]);
}

function Station({ animate, targetRadius }) {
  const gltf = useLoader(GLTFLoader, MODEL, withDraco);
  const model = useNormalised(gltf.scene, targetRadius);
  const pivot = useRef(null);

  // The disc below is the only bright thing in this sky, so the hull reads
  // wrong with its authored materials: they assume a neutral studio. Warm the
  // response and drop the roughness so the rim light actually catches.
  useEffect(() => {
    model.traverse((node) => {
      if (!node.isMesh) return;
      node.castShadow = false;
      node.receiveShadow = false;
      const mats = Array.isArray(node.material) ? node.material : [node.material];
      mats.forEach((m) => {
        if (!m) return;
        if ('metalness' in m) m.metalness = Math.min(1, (m.metalness ?? 0.5) * 0.7 + 0.35);
        if ('roughness' in m) m.roughness = THREE.MathUtils.clamp((m.roughness ?? 0.6) * 0.8, 0.18, 0.72);
        if (m.color) m.color.multiplyScalar(0.82);
        // The bake exports the lit panels as white emissive. Warm them a touch
        // so they sit in the same light as the disc instead of reading blue.
        if (m.emissive && m.emissive.getHex() !== 0x000000) {
          m.emissive.setHex(0xffc06a);
          m.emissiveIntensity = 1.35;
        }
        m.envMapIntensity = 0.6;
      });
    });
  }, [model]);

  useFrame((state) => {
    if (!pivot.current || !animate) return;
    const t = state.clock.elapsedTime;
    // A long, shallow drift. Nothing here should read as a flypast: the point
    // is that it is barely holding station against something enormous.
    pivot.current.rotation.y = t * 0.045;
    pivot.current.rotation.z = Math.sin(t * 0.11) * 0.06;
    pivot.current.position.y = Math.sin(t * 0.19) * 0.13;
  });

  return (
    <group ref={pivot}>
      <primitive object={model} />
    </group>
  );
}

/**
 * Lighting is staged to match the plate underneath: the accretion disc is the
 * key, so the warm light comes from below and behind, and the only fill is a
 * cold, weak bounce standing in for starlight.
 */
function Rig() {
  return (
    <>
      <ambientLight intensity={0.16} color="#5a6c8a" />
      <directionalLight position={[-2.6, -1.5, 1.9]} intensity={2.8} color="#f0a22e" />
      {/* A dim back edge keeps it separated from the disc behind it. */}
      <directionalLight position={[-1.2, -0.6, -2.4]} intensity={1.25} color="#ffd9a0" />
      <directionalLight position={[2.4, 1.8, 2.2]} intensity={0.42} color="#8fa6c8" />
      <pointLight position={[-1.4, -1.1, 0.8]} intensity={1.5} color="#ffb851" distance={12} decay={2} />
    </>
  );
}

export default function SpaceStation({ targetRadius = 1.02 }) {
  const reduce = useReducedMotion();

  return (
    <Canvas
      className="hero__ship-canvas"
      // The black hole pass underneath is already the expensive thing on this
      // page. This canvas stays cheap: capped dpr, no shadow map, no tone
      // mapping pass beyond the default.
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      camera={{ position: [0, 0.35, 4.3], fov: 38 }}
      style={{ background: 'transparent' }}
    >
      <Rig />
      <Station animate={!reduce} targetRadius={targetRadius} />
    </Canvas>
  );
}
