'use client';

import { useThree } from '@/app/lib/three/three-fiber-exporter';
import * as THREE from 'three';
import {
  useEffect,
  useRef,
} from 'react';
import { DragControls } from 'three-stdlib';


function Draggable({
  children,
  isEditMode,
}: {
  children: React.ReactNode;
  isEditMode: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  const { camera, gl, scene } = useThree();
  const controls = useRef<DragControls | null>(null);

  useEffect(() => {
    let dragControls = controls.current;
    if (!dragControls) {
      dragControls = new DragControls(
        ref.current!.children,
        camera,
        gl.domElement,
      );
      controls.current = dragControls;

      const cameraControls = (scene as any).cameraControls;

      dragControls.addEventListener('dragstart', () => {
        cameraControls.enabled = false;
      });

      dragControls.addEventListener('dragend', () => {
        cameraControls.enabled = isEditMode;
      });
    }
    dragControls.enabled = isEditMode;
    dragControls.transformGroup = true;
  }, [ref, camera, gl, scene, isEditMode, controls]);
  return <group ref={ref}>{children}</group>;
}