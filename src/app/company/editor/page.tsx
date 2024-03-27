'use client';

import { useEffect, useState, useRef } from 'react';
import Scene, { SceneMethod } from '@/app/ui/three/scene';
import { Canvas, useThree } from '@/app/lib/three/three-fiber-exporter';
import * as THREE from 'three';

export default function Page() {
  const [isEditMode, setEditMode] = useState(true);
  const sceneRef = useRef<SceneMethod | null>(null);
  const [json, setJson] = useState<object>({});

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
          <button onClick={() => sceneRef.current!.resetCamera()}>
            reset camera
          </button>
          <button onClick={() => setJson(sceneRef.current!.toJSON())}>
            to json
          </button>
          <button onClick={() => sceneRef.current!.restore(json)}>
            restore
          </button>
          <button
            onClick={() => sceneRef.current!.changeTransformMode('translate')}
          >
            translate
          </button>
          <button
            onClick={() => sceneRef.current!.changeTransformMode('rotate')}
          >
            rotate
          </button>
          <textarea
            className="h-[100px] w-[600px] whitespace-pre-wrap"
            value={JSON.stringify(json, null, 2)}
            onChange={(event) => {
              setJson(JSON.parse(event.target.value));
            }}
          ></textarea>
        </div>
      </div>
    </div>
  );
}
