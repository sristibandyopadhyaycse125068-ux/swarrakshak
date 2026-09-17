import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function CosmicCanvas({ phase = 1, isScrolling = false }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer Setup
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050508, 0.0015);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 80;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Ambient Deep Space Starfield (Background Dust)
    const starCount = 3000;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 400;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 400;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 400;
      starSizes[i] = Math.random() * 1.5 + 0.5;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));

    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.2,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);

    // 3. Resonant Orb & Neural Double Helix Particles
    const particleCount = 2400;
    const particleGeo = new THREE.BufferGeometry();

    const spherePositions = new Float32Array(particleCount * 3);
    const helixPositions = new Float32Array(particleCount * 3);
    const currentPositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const cyanColor = new THREE.Color(0x00f0ff);
    const magentaColor = new THREE.Color(0xff0055);
    const blueColor = new THREE.Color(0x0072ff);

    for (let i = 0; i < particleCount; i++) {
      // Phase 1: Sphere Positions (Split-Spectrum Cyan/Magenta)
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const radius = 24 + Math.random() * 2.5;

      const sx = radius * Math.sin(phi) * Math.cos(theta);
      const sy = radius * Math.sin(phi) * Math.sin(theta);
      const sz = radius * Math.cos(phi);

      spherePositions[i * 3] = sx;
      spherePositions[i * 3 + 1] = sy;
      spherePositions[i * 3 + 2] = sz;

      currentPositions[i * 3] = sx;
      currentPositions[i * 3 + 1] = sy;
      currentPositions[i * 3 + 2] = sz;

      // Phase 2: Double-Helix Positions
      const strand = i % 2 === 0 ? 0 : Math.PI;
      const hHeight = ((i / particleCount) - 0.5) * 80;
      const hAngle = (i / particleCount) * Math.PI * 12 + strand;
      const hRadius = 12 + Math.sin(i * 0.1) * 2;

      helixPositions[i * 3] = Math.cos(hAngle) * hRadius;
      helixPositions[i * 3 + 1] = hHeight;
      helixPositions[i * 3 + 2] = Math.sin(hAngle) * hRadius;

      // Split Spectrum Colors
      let col = cyanColor;
      if (sx > 0 && i % 2 === 0) {
        col = magentaColor;
      } else if (i % 3 === 0) {
        col = blueColor;
      }

      particleColors[i * 3] = col.r;
      particleColors[i * 3 + 1] = col.g;
      particleColors[i * 3 + 2] = col.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    // Particle Texture & Material
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.4, 'rgba(0,240,255,0.8)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);
    const particleTex = new THREE.CanvasTexture(canvas);

    const particleMat = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      map: particleTex,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const orbSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(orbSystem);

    // 4. Animation Frame Loop
    let animationFrameId;
    let clock = new THREE.Clock();
    let targetPhase = phase;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Rotate Starfield Background
      starPoints.rotation.y = elapsedTime * 0.02;
      starPoints.rotation.x = elapsedTime * 0.01;

      // Morphing Logic between Sphere & Double Helix based on phase prop
      const posAttr = particleGeo.attributes.position;
      const posArr = posAttr.array;
      const isHelixTarget = targetPhase === 2;
      const lerpSpeed = 0.05;

      for (let i = 0; i < particleCount; i++) {
        const tx = isHelixTarget ? helixPositions[i * 3] : spherePositions[i * 3];
        const ty = isHelixTarget ? helixPositions[i * 3 + 1] : spherePositions[i * 3 + 1];
        const tz = isHelixTarget ? helixPositions[i * 3 + 2] : spherePositions[i * 3 + 2];

        // Pulsating Curl Wave Effect
        const wave = Math.sin(elapsedTime * 2 + i * 0.1) * 0.8;

        posArr[i * 3] += (tx - posArr[i * 3] + wave * 0.1) * lerpSpeed;
        posArr[i * 3 + 1] += (ty - posArr[i * 3 + 1] + wave * 0.1) * lerpSpeed;
        posArr[i * 3 + 2] += (tz - posArr[i * 3 + 2] + wave * 0.1) * lerpSpeed;
      }

      posAttr.needsUpdate = true;

      // Rotate Orb / Helix
      orbSystem.rotation.y = elapsedTime * 0.15;
      if (isHelixTarget) {
        orbSystem.rotation.x = Math.sin(elapsedTime * 0.2) * 0.2;
      } else {
        orbSystem.rotation.z = Math.cos(elapsedTime * 0.1) * 0.1;
      }

      // Phase 3 Camera Movement (Zoom towards accretion Horizon)
      if (targetPhase === 3) {
        camera.position.z += (35 - camera.position.z) * 0.04;
        camera.position.y += (-15 - camera.position.y) * 0.04;
      } else {
        camera.position.z += (80 - camera.position.z) * 0.04;
        camera.position.y += (0 - camera.position.y) * 0.04;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 5. Responsive Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || window.innerWidth;
      const newH = container.clientHeight || window.innerHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [phase]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-gradient-to-b from-[#050508] via-[#020205] to-[#000002]"
    />
  );
}
