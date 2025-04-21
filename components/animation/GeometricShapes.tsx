"use client";

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import styles from './GeometricShapes.module.css';
import ClientOnly from '../common/ClientOnly';

export interface GeometricShapesProps {
  width?: number;
  height?: number;
  color?: string;
  wireframe?: boolean;
  rotation?: boolean;
  backgroundColor?: string;
  autoRotate?: boolean;
  enableZoom?: boolean;
  enablePan?: boolean;
  className?: string;
}

const GeometricShapes: React.FC<GeometricShapesProps> = ({
  width = 300,
  height = 300,
  color = '#00FF84',
  wireframe = false,
  rotation = true,
  backgroundColor = 'transparent',
  autoRotate = true,
  enableZoom = false,
  enablePan = false,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const frameIdRef = useRef<number>(0);
  const [isClient, setIsClient] = useState(false);

  // Fix hydration issues - only render on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !isClient) return;

    // Create scene
    const scene = new THREE.Scene();
    if (backgroundColor !== 'transparent') {
      scene.background = new THREE.Color(backgroundColor);
    }
    sceneRef.current = scene;

    // Create camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: backgroundColor === 'transparent'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    if (backgroundColor === 'transparent') {
      renderer.setClearColor(0x000000, 0);
    }
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = enableZoom;
    controls.enablePan = enablePan;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1.0;
    controlsRef.current = controls;

    // Create geometry: always a torusKnot
    const geometry = new THREE.TorusKnotGeometry(0.7, 0.3, 100, 16);

    // Create material
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      wireframe: wireframe,
      metalness: 0.3,
      roughness: 0.7,
    });

    // Create mesh and add to scene
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);

      if (rotation && meshRef.current) {
        meshRef.current.rotation.x += 0.005;
        meshRef.current.rotation.y += 0.01;
      }

      if (controlsRef.current) {
        controlsRef.current.update();
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameIdRef.current);
      
      if (rendererRef.current && containerRef.current) {
        const domElement = rendererRef.current.domElement;
        if (containerRef.current.contains(domElement)) {
          containerRef.current.removeChild(domElement);
        }
        rendererRef.current.dispose();
      }
    };
  }, [width, height, color, wireframe, backgroundColor, autoRotate, enableZoom, enablePan, rotation, isClient]);

  if (!isClient) {
    return null;
  }

  return (
    <ClientOnly>
      <div 
        ref={containerRef} 
        className={`${styles.container} ${className || ''}`}
        style={{ width, height }}
      />
    </ClientOnly>
  );
};

export default GeometricShapes;
