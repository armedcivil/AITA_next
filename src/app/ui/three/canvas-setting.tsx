'use client';

import * as THREE from 'three';
import { useThree } from '@/app/lib/three/three-fiber-exporter';
import { useEffect } from 'react';

export default function CanvasSetting() {
  const setSize = useThree((state) => state.setSize);
  const renderer = useThree((state) => state.gl);

  useEffect(() => {
    setSize(600, 400);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
  }, [setSize, renderer]);

  return <></>;
}
