'use client';

import { useState, useRef } from 'react';
import Scene, { SceneMethod } from '@/app/ui/three/scene';
import { Canvas } from '@/app/lib/three/three-fiber-exporter';

export default function Page() {
  const [isEditMode, setEditMode] = useState(true);
  const sceneRef = useRef<SceneMethod | null>(null);

  return (
    <div>
      <div className="flex justify-center">
        <div className="h-[400px] w-[600px]">
          <Canvas className="bg-gray-300">
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
