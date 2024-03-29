'use client';

import { useState, useRef } from 'react';
import Scene, { SceneMethod } from '@/app/ui/three/scene';
import { Canvas } from '@/app/lib/three/three-fiber-exporter';
import CanvasSetting from '@/app/ui/three/canvas-setting';
import PositionSwitchCamera from '@/app/ui/three/position-switch-camera';

export default function Page() {
  const [isEditMode, setEditMode] = useState(true);
  const sceneRef = useRef<SceneMethod | null>(null);
  const [json, setJson] = useState<object>({});

  // TODO: フロアの追加・削除・切替が出来る様に
  // TODO: 操作の UI を作る(マウス操作で出来ることの説明含む)
  // TODO: localStore への一時保存機能(定期実行＆手動実行)
  // TODO: シーンの情報のアップロード
  // TODO: カスタムなモデルの読み込み機能
  return (
    <div>
      <div className="flex justify-center">
        <div className="h-[400px] w-[600px]">
          <Canvas
            className="bg-gray-300"
            flat
            camera={{
              fov: 75,
              near: 0.1,
              far: 800,
              position: [0, 5, 0],
              rotation: [-(Math.PI / 2), 0, 0],
            }}
          >
            <CanvasSetting />
            <directionalLight
              color="white"
              position={[0, 5, 0]}
              rotation={[-(Math.PI / 2), 0, 0]}
            />

            {/* FIXME: 原因は不明だが、何かのタイミングでカメラの移動が出来なくなる。怪しいのは (scene as any).cameraControls で直接アクセスしている箇所 */}
            <PositionSwitchCamera isEditMode={isEditMode} />

            <Scene isEditMode={isEditMode} ref={sceneRef} />
          </Canvas>
          <div className="flex flex-col">
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
            <div className="flex flex-row justify-center">
              <button
                className="mx-3"
                onClick={() => sceneRef.current!.loadModel('/models/chair.glb')}
              >
                load chair
              </button>
              <button
                className="mx-3"
                onClick={() =>
                  sceneRef.current!.loadModel('/models/circle-desk.glb')
                }
              >
                load circle desk
              </button>
              <button
                className="mx-3"
                onClick={() =>
                  sceneRef.current!.loadModel('/models/square-desk.glb')
                }
              >
                load square desk
              </button>
              <button
                className="mx-3"
                onClick={() =>
                  sceneRef.current!.loadModel('/models/scaled-square-desk.glb')
                }
              >
                load scaled square desk
              </button>
            </div>
            <button onClick={() => sceneRef.current!.removeSelected()}>
              remove selected
            </button>
            <button onClick={() => sceneRef.current!.cloneSelected()}>
              clone selected
            </button>
          </div>

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
