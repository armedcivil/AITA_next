'use client';

import { useEffect } from 'react';
import { useThree } from '@/app/lib/three/three-fiber-exporter';
import { CameraControls } from '@/app/lib/three/three-drei-exporter';

export default function PositionSwitchCamera({
  isEditMode,
}: {
  isEditMode: boolean;
}) {
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
  return <CameraControls makeDefault attach="cameraControls" />;
}
