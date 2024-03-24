'use client';

import { useEffect, useState, useRef } from 'react';
import Scene, { SceneMethod } from '@/app/ui/three/scene';
import { Canvas, useThree } from '@/app/lib/three/three-fiber-exporter';

export default function Page() {
  const [isEditMode, setEditMode] = useState(true);
  const sceneRef = useRef<SceneMethod | null>(null);

  return (
    <div>
      <div className="flex justify-center">
        <div className="h-[400px] w-[600px]">
          <Canvas
            className="bg-gray-300"
            camera={{
              fov: 75,
              near: 0.1,
              far: 800,
              position: [0, 5, 0],
              rotation: [-(Math.PI / 2), 0, 0],
            }}
          >
            <Scene isEditMode={isEditMode} ref={sceneRef} />
          </Canvas>
          <button onClick={() => setEditMode(!isEditMode)}> switch </button>
          <button onClick={() => sceneRef.current!.reset()}>
            reset camera
          </button>
        </div>
      </div>
    </div>
  );
}
