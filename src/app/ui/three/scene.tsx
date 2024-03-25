'use client';

import { useThree, buildGraph } from '@/app/lib/three/three-fiber-exporter';
import { Select, useSelect } from '@/app/lib/three/three-drei-exporter';
import * as THREE from 'three';
import {
  useEffect,
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
} from 'react';
import CanvasSetting from '@/app/ui/three/canvas-setting';
import PositionSwitchCamera from '@/app/ui/three/position-switch-camera';
import Pivot, { PivotMethod } from '@/app/ui/three/pivot';

export interface SceneMethod {
  reset: () => void;
}

const Scene = ({ isEditMode }: { isEditMode: boolean }, ref: any) => {
  const scene = useThree((state) => state.scene);
  const renderer = useThree((state) => state.gl);

  const allObject = [
    [-1.5, 0.5, 0],
    [1.5, 0.5, 0],
  ].map((value) => {
    const material = new THREE.MeshStandardMaterial();
    const geometory = new THREE.BoxGeometry(1, 1, 1);
    const mesh = new THREE.Mesh(geometory, material);
    mesh.position.set(value[0], value[1], value[2]);
    return mesh;
  });

  useImperativeHandle(ref, () => ({
    reset() {
      (scene as any).cameraControls.reset(true);
    },
  }));

  useEffect(() => {
    const canvas = renderer.domElement;
    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      THREE.Cache.clear();
      renderer.forceContextRestore();
    });
  }, [renderer]);

  return (
    <>
      <CanvasSetting />
      <ambientLight intensity={0.1} />
      <directionalLight
        color="white"
        position={[0, 5, 0]}
        rotation={[-(Math.PI / 2), 0, 0]}
      />

      <PositionSwitchCamera isEditMode={isEditMode} />

      {allObject.map((value, i) => {
        return (
          <Pivot key={i} isEditMode={isEditMode} anchor={[0, -1, 0]}>
            <primitive object={value} />
          </Pivot>
        );
      })}

      <gridHelper args={[200, 20]} />
    </>
  );
};

export default forwardRef(Scene);
