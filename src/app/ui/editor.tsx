'use client';
import { Canvas } from '@/app/lib/three/three-fiber-exporter';
import CanvasSetting from '@/app/ui/three/canvas-setting';
import PositionSwitchCamera from '@/app/ui/three/position-switch-camera';
import SelectFloorSideBar from '@/app/ui/select-floor-sidebar';
import {
  ArrowPathIcon,
  PencilIcon,
  VideoCameraIcon,
  PlusIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';
import Scene, { SceneMethod } from '@/app/ui/three/scene';
import { useState, useRef, useReducer } from 'react';
import { Floor } from '@/app/lib/three/scene-store';
import { createPortal, useFormState } from 'react-dom';
import EditorHelp from '@/app/ui/editor-help';
import { Button } from '@/app/ui/button';
import { upsertFloors } from '../lib/actions';
import { UploadFloorButton } from '@/app/ui/buttons-client';
import LoadingIcon from './icons/loading-icon';
import EditorAssetList, { EditorAsset } from './editor-asset-list';

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

const Editor = (
  {
    defaultFloors,
    editorAssets,
  }: { defaultFloors: Floor[]; editorAssets: EditorAsset[] },
  ref: any,
) => {
  const [isEditMode, setEditMode] = useState(true);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const sceneRef = useRef<SceneMethod | null>(null);
  const [currentFloorIndex, setCurrentFloorIndex] = useState<number | null>(
    null,
  );
  const floorNameInput = useRef<HTMLInputElement>(null);
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
    defaultFloors,
  );
  const [state, formDispatch] = useFormState(upsertFloors, {
    error: { message: '' },
  });
  const [showLoading, setShowLoading] = useState(false);

  return (
    <>
      <div className="mb-2 flex w-full flex-row items-center justify-end">
        <input
          ref={floorNameInput}
          className="ml-auto h-10 w-64 rounded-lg border-2 border-red-400 p-2"
          placeholder="Input name of new floor"
        />
        <Button
          className="ml-4"
          onClick={() => {
            if (
              !floorNameInput.current ||
              floorNameInput.current.value === ''
            ) {
              return;
            }
            dispatch({ action: 'create', label: floorNameInput.current.value });
            floorNameInput.current.value = '';
          }}
        >
          Create Floor
          <PlusIcon className="h-5 md:ml-4" />
        </Button>
        <form action={formDispatch}>
          <input type="hidden" name="floors" value={JSON.stringify(floors)} />
          <UploadFloorButton />
        </form>
        <QuestionMarkCircleIcon
          className="ml-4 h-5 text-red-400 hover:text-red-200"
          onClick={() => {
            setShowHelp(!showHelp);
          }}
          title="Editor help"
        />
      </div>
      <div className="mt-4 flex w-full justify-center">
        <div className="flex flex-col items-center rounded-lg border-2 border-gray-100 p-4 shadow-2xl">
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

              <PositionSwitchCamera isEditMode={isEditMode} />

              <Scene
                isEditMode={isEditMode}
                ref={sceneRef}
                onChange={(result) => {
                  if (currentFloorIndex !== null) {
                    dispatch({
                      action: 'update',
                      index: currentFloorIndex!,
                      floor: {
                        objects: result.objects,
                        label: floors[currentFloorIndex].label,
                      },
                    });
                  }
                }}
              />
            </Canvas>
            <div className="absolute right-0 top-16 flex w-8 flex-col justify-items-center rounded-l-lg bg-red-400 px-1 py-2 text-white">
              <button
                onClick={() => setEditMode(!isEditMode)}
                className="flex justify-center"
              >
                {isEditMode ? (
                  <VideoCameraIcon
                    className="h-5"
                    title="Switch to preview mode"
                  />
                ) : (
                  <PencilIcon className="h-5" title="Switch to edit mode" />
                )}
              </button>
              <button
                onClick={() => sceneRef.current!.resetCamera()}
                className="mt-2 flex justify-center"
              >
                <ArrowPathIcon className="h-5" title="Reset camera position" />
              </button>
            </div>
            <EditorAssetList
              editorAssets={editorAssets}
              onSelect={async (asset) => {
                setShowLoading(true);
                await sceneRef.current!.loadModel(
                  `http://localhost:3001/${asset.assetPath}`,
                );
                setShowLoading(false);
              }}
            />
            {(currentFloorIndex === null || showLoading) && (
              <div className="absolute left-0 top-0 flex h-[400px] w-[600px] cursor-not-allowed items-center justify-center bg-black opacity-80">
                <LoadingIcon className="h-48 animate-spin" fill="white" />
              </div>
            )}
            {currentFloorIndex !== null && floors[currentFloorIndex] && (
              <span className="whitespace-no-wrap absolute left-2 top-0 max-w-48 select-none overflow-hidden text-ellipsis">
                {floors[currentFloorIndex].label}
              </span>
            )}
            <SelectFloorSideBar
              floors={floors}
              onSelect={async (floor, index) => {
                setCurrentFloorIndex(index);
                setShowLoading(true);
                await sceneRef.current?.restore(floor);
                setShowLoading(false);
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
            {showHelp &&
              createPortal(
                <EditorHelp
                  onClose={() => {
                    setShowHelp(false);
                  }}
                />,
                document.getElementById('help')!,
              )}
          </div>
        </div>
      </div>
    </>
  );
};
Editor.displayName = 'Editor';
export default Editor;
