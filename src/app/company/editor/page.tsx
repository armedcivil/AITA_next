'use client';

import { useState, useRef, useReducer } from 'react';
import Scene, { SceneMethod } from '@/app/ui/three/scene';
import { Canvas } from '@/app/lib/three/three-fiber-exporter';
import CanvasSetting from '@/app/ui/three/canvas-setting';
import PositionSwitchCamera from '@/app/ui/three/position-switch-camera';
import { Button } from '@/app/ui/button';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Floor } from '@/app/lib/three/scene-store';
import SelectFloorSideBar from '@/app/ui/select-floor-sidebar';

interface DeleteAction {
  action: 'delete';
  floor: Floor;
}

interface CreateAction {
  action: 'create';
  label: string;
}

interface UpdateAction {
  action: 'update';
  index: number;
  floor: Floor;
}

type ActionArgs = DeleteAction | CreateAction | UpdateAction;

export default function Page() {
  const [isEditMode, setEditMode] = useState(true);
  const sceneRef = useRef<SceneMethod | null>(null);
  const [currentFloorIndex, setCurrentFloorIndex] = useState<number | null>(
    null,
  );
  const [floors, dispatch] = useReducer(
    (state: Floor[], args: ActionArgs): Floor[] => {
      switch (args.action) {
        case 'create':
          return [...state, { label: args.label, objects: [] }];
        case 'update':
          state[args.index] = args.floor;
          return [...state];
        case 'delete':
          const deleteIndex = state.indexOf(args.floor);
          if (deleteIndex > -1) {
            state.splice(deleteIndex, 1);
          }
          return [...state];
      }
    },
    [],
  );
  const newFloorName = useRef<HTMLInputElement>(null);

  // TODO: キーボード操作で全選択・クリップボードへコピー・クリップボードからペーストを出来るようにする
  // TODO: 操作の UI を作る(マウス操作で出来ることの説明含む)
  // TODO: localStore への一時保存機能(定期実行＆手動実行)
  // TODO: シーンの情報のアップロード
  // TODO: カスタムなモデルの読み込み機能
  return (
    <div className="h-full p-3">
      <div className="mb-2 flex w-full flex-row justify-end">
        <input
          ref={newFloorName}
          className="ml-auto h-10 w-64 rounded-lg border-2 border-red-400 p-2"
          placeholder="Input name of new floor"
        />
        <Button
          className="ml-4"
          onClick={() => {
            if (!newFloorName.current || newFloorName.current.value === '') {
              return;
            }
            dispatch({ action: 'create', label: newFloorName.current.value });
            newFloorName.current.value = '';
          }}
        >
          Create Floor
          <PlusIcon className="h-5 md:ml-4" />
        </Button>
      </div>
      <div className="flex w-full justify-center">
        <div className="relative h-[400px] w-[600px]">
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

            <Scene
              isEditMode={isEditMode}
              ref={sceneRef}
              onChange={(result) => {
                dispatch({
                  action: 'update',
                  index: currentFloorIndex!,
                  floor: {
                    objects: result.objects,
                    label: floors[currentFloorIndex!].label,
                  },
                });
              }}
            />
          </Canvas>
          {currentFloorIndex !== null ? undefined : (
            <div className="absolute left-0 top-0 h-[400px] w-[600px] cursor-not-allowed bg-black opacity-80"></div>
          )}
          {currentFloorIndex !== null && (
            <span className="whitespace-no-wrap absolute left-2 top-0 max-w-48 select-none overflow-hidden text-ellipsis">
              {floors[currentFloorIndex].label}
            </span>
          )}
          <SelectFloorSideBar
            floors={floors}
            onSelect={(floor, index) => {
              setCurrentFloorIndex(index);
              sceneRef.current?.restore(floor);
            }}
            onDelete={(floor, index) => {
              if (currentFloorIndex === index) {
                setCurrentFloorIndex(null);
              }
              dispatch({ action: 'delete', floor });
            }}
            onLabelChange={(floor, index) => {
              dispatch({ action: 'update', floor, index });
            }}
          />
          <div className="flex flex-col">
            <button onClick={() => setEditMode(!isEditMode)}> switch </button>
            <button onClick={() => sceneRef.current!.resetCamera()}>
              reset camera
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
        </div>
      </div>
    </div>
  );
}
