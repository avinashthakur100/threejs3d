import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Environment, 
  useGLTF,
  ScrollControls,
  Scroll,
  useScroll,
  Sparkles,
  Float
} from '@react-three/drei';
import * as THREE from 'three';

const ARTIFACT_URL = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf';
useGLTF.preload(ARTIFACT_URL);

const ArtifactModel = () => {
  const { scene } = useGLTF(ARTIFACT_URL);
  return <primitive object={scene} scale={1.5} />;
};

const CinematicScroll = () => {
  const scroll = useScroll();
  const groupRef = useRef();

  useFrame((state, delta) => {
    const offset = scroll.offset;
    
    // We can animate BOTH Rotation and Position based on the scroll!
    let targetRotY = 0;
    let targetPosX = 0;
    let targetPosZ = 0;

    // PAGE 1: Top of page
    if (offset < 0.3) {
      targetRotY = Math.PI / 8; 
      targetPosX = 2.5;  // Stay on the RIGHT side of the screen
      targetPosZ = 0;
    } 
    // PAGE 2: Middle of page
    else if (offset < 0.6) {
      targetRotY = Math.PI / 2; 
      targetPosX = -2.5; // Glide across to the LEFT side of the screen!
      targetPosZ = 0;
    } 
    // PAGE 3: Bottom of page
    else {
      targetRotY = Math.PI - 0.5; 
      targetPosX = 0;    // Glide to the CENTER of the screen
      targetPosZ = 2;    // Move CLOSER to the camera!
    }

    // Smoothly glide the Rotation
    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY, 4, delta);
    
    // Smoothly glide the Position across the screen!
    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, targetPosX, 4, delta);
    groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, targetPosZ, 4, delta);

    // Keep camera locked so the environment stays still
    state.camera.position.set(0, 0, 6);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    // We removed the hardcoded position so our useFrame math can fully control it!
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <ArtifactModel />
      </Float>
    </group>
  );
};

const Scene3D = () => {
  return (
    <Canvas shadows camera={{ position: [0, 0, 6], fov: 45 }}>
      <color attach="background" args={['#020202']} />
      
      <ambientLight intensity={0.2} />
      
      {/* Centered wide spotlights so they hit the model no matter what side of the screen it's on */}
      <spotLight position={[0, 5, 0]} intensity={5} angle={1.2} penumbra={0.8} color="#ffd700" />
      <spotLight position={[0, 0, -5]} intensity={2} angle={1.2} penumbra={1} color="#4facfe" />

      <Sparkles count={200} scale={8} size={3} speed={0.2} opacity={0.5} color="#ffcc88" />

      <ScrollControls pages={3} damping={0.1}>
        
        <CinematicScroll />

        <Scroll html style={{ width: '100%' }}>
          
          {/* Page 1: Text on Left, Model on Right */}
          <div className="section left-align" style={{ marginTop: '10vh' }}>
            <h1 className="cinematic-title">The Relic</h1>
            <p className="cinematic-text">Notice the model is on the right. Now scroll down...</p>
          </div>

          {/* Page 2: Text on Right, Model glides to Left */}
          <div className="section right-align">
            <h1 className="cinematic-title">Forged</h1>
            <p className="cinematic-text">The artifact just glided across the screen! You can direct it to go anywhere using X, Y, and Z coordinates.</p>
          </div>

          {/* Page 3: Text Centered, Model moves to Center and gets closer */}
          <div className="section center-align" style={{ alignItems: 'center' }}>
            <h1 className="cinematic-title">Legacy</h1>
            <p className="cinematic-text" style={{ textAlign: 'center' }}>Finally, it parks in the center and pushes forward toward the camera.</p>
          </div>

        </Scroll>
      </ScrollControls>

      <Environment preset="night" />
    </Canvas>
  );
};

export default Scene3D;
