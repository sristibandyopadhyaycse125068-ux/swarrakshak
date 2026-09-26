import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const PARTICLE_COUNT = 9000;

function makeSprite() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;

  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function colorFromY(ny) {
  if (ny >= 0) {
    // Warm gold gradient for the upper hemisphere
    return [1.0, 0.55 + ny * 0.37, ny * 0.63];
  } else {
    // Silver metallic gradient for the lower hemisphere
    const v = 0.38 + -ny * 0.62;
    return [v, v, Math.min(1.0, v + 0.08)];
  }
}

export default function ParticleSphere() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 100);
    camera.position.z = 2.9;

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // transparent background to blend into layouts
    container.appendChild(renderer.domElement);

    // 3. Particle Buffer Allocation
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Spherical uniform distribution
      const u = Math.random();
      const v = Math.random();

      const phi = Math.acos(2 * u - 1); // 0 to PI
      const theta = 2 * Math.PI * v;    // 0 to 2*PI

      // Radial jitter ±0.07 around base unit sphere (r = 1.0)
      const r = 1.0 + (Math.random() - 0.5) * 0.14;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi);
      const z = r * Math.sin(phi) * Math.sin(theta);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Normalized y for dual-hemisphere color distribution
      const ny = y / r;
      const [cr, cg, cb] = colorFromY(ny);

      colors[i * 3] = cr;
      colors[i * 3 + 1] = cg;
      colors[i * 3 + 2] = cb;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // 4. Sprite Texture & Material Setup
    const sprite = makeSprite();

    const material = new THREE.PointsMaterial({
      size: 0.032,
      map: sprite,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const mesh = new THREE.Points(geometry, material);
    mesh.rotation.x = 0.28;
    mesh.rotation.z = 0.08;
    scene.add(mesh);

    // 5. Animation Loop
    let animationFrameId;
    let t = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      t += 0.004;

      mesh.rotation.y = t;
      mesh.rotation.z = 0.08 + Math.sin(t * 0.8) * 0.04; // Gentle dynamic z-axis wobble

      renderer.render(scene, camera);
    };

    animate();

    // 6. Responsive Resize Handling
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 7. Cleanup & Resource Deallocation
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      geometry.dispose();
      material.dispose();
      sprite.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="h-full w-full" />;
}
