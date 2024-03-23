'use client';

import { useThree } from '@/app/lib/three/three-fiber-exporter';
import * as THREE from 'three';
import { CameraControls } from '@/app/lib/three/three-drei-exporter';
import {
  useEffect,
  forwardRef,
  useImperativeHandle,
  MutableRefObject,
  RefObject,
} from 'react';

function CanvasSetting() {
  const setSize = useThree((state) => state.setSize);
  const renderer = useThree((state) => state.gl);
  setSize(600, 400);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  return <></>;
}

function PositionSwitchCamera({ isEditMode }: { isEditMode: boolean }) {
  const scene = useThree((state) => state.scene);

  useEffect(() => {
    const changeView = async () => {
      const controls = (scene as any).cameraControls;
      if (isEditMode) {
        controls.enabled = true;
        await controls.setLookAt(0, 5, 0, 0, 0, 0, true);
      } else {
        await controls.setLookAt(-5, 5, 5, 0, 0, 0, true);
        controls.enabled = false;
      }
      controls.saveState();
    };
    changeView().then();
  }, [isEditMode, scene]);
  return <></>;
}

export interface SceneMethod {
  reset: () => void;
}

const Scene = ({ isEditMode }: { isEditMode: boolean }, ref: any) => {
  const scene = useThree((state) => state.scene);

  useImperativeHandle(ref, () => ({
    reset() {
      (scene as any).cameraControls.reset(true);
    },
  }));

  return (
    <>
      <CanvasSetting />
      <ambientLight intensity={0.1} />
      <directionalLight
        color="white"
        position={[0, 5, 0]}
        rotation={[-(Math.PI / 2), 0, 0]}
      />
      <mesh position={[1, 0, 0.5]}>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial />
      </mesh>

      <mesh position={[-1, 0, 0]}>
        <boxGeometry args={[1, 0.1, 2]} />
        <meshStandardMaterial color="red" />
      </mesh>

      <CameraControls makeDefault attach="cameraControls" />
      <PositionSwitchCamera isEditMode={isEditMode} />

      <gridHelper args={[200, 20]} />
    </>
  );
};

export default forwardRef(Scene);
