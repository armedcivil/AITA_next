'use client';

import { useThree } from '@/app/lib/three/three-fiber-exporter';
import { TransformControls } from '@/app/lib/three/three-drei-exporter';
import * as THREE from 'three';
import React, {
  useEffect,
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
} from 'react';
import CanvasSetting from '@/app/ui/three/canvas-setting';
import PositionSwitchCamera from '@/app/ui/three/position-switch-camera';
import { Select, SelectMethod } from '@/app/ui/three/select';
import {
  loadGLTF,
  restore,
  save,
  SceneObject,
} from '@/app/lib/three/scene-store';

// Scene コンポーネントのメソッド宣言
export interface SceneMethod {
  resetCamera: () => void;
  toJSON: () => object;
  restore: (json: object) => void;
  changeTransformMode: (mode: 'translate' | 'rotate') => void;
  loadModel: (path: string) => void;
  removeSelected: () => void;
  cloneSelected: () => void;
}

// Scene コンポーネント
const Scene = ({ isEditMode }: { isEditMode: boolean }, ref: any) => {
  const scene = useThree((state) => state.scene);
  const renderer = useThree((state) => state.gl);
  const [initialized, setInitialized] = useState(false);
  const [allObject, setAllObject] = useState<THREE.Object3D[]>([]);
  const [transformMode, setTransformMode] = useState<'translate' | 'rotate'>(
    'translate',
  );

  const selectedGroup = useRef<THREE.Group<THREE.Object3DEventMap>>(null);
  const selectRef = useRef<SelectMethod>(null);

  // Scene コンポーネントの呼び出し可能なメソッドの定義
  useImperativeHandle(ref, () => ({
    resetCamera() {
      (scene as any).cameraControls.reset(true);
    },
    toJSON() {
      attachObjectsToSelectGroup([]);
      return {
        objects: save(
          selectRef
            .current!.children()
            .filter((child) => child.layers.isEnabled(2)),
        ),
      };
    },
    async restore(json: { objects: SceneObject[] }) {
      selectRef.current?.clear();
      selectedGroup.current?.clear();
      setAllObject(await restore(json.objects));
      setInitialized(false);
    },
    changeTransformMode(mode: 'translate' | 'rotate') {
      setTransformMode(mode);
    },
    // TODO: 机・椅子の区別が付けられるように userData に type プロパティをつける
    async loadModel(path: string) {
      const gltfModel = await loadGLTF(path);
      setAllObject([...allObject, gltfModel]);
      selectRef.current?.attach(gltfModel);
    },
    removeSelected() {
      selectRef.current?.removeSelected();
      selectedGroup.current?.clear();
    },
    cloneSelected() {
      clone(selectedGroup.current?.children);
    },
  }));

  // ブラウザの負荷を下げるために WebGL のcontextを強制的に消すことがあるため、復帰処理を仕込む
  useEffect(() => {
    const canvas = renderer.domElement;
    const handler = (e: any) => {
      e.preventDefault();
      THREE.Cache.clear();
      renderer.forceContextRestore();
    };
    canvas.addEventListener('webglcontextlost', handler);
    return () => {
      canvas.removeEventListener('webglcontextlost', handler);
    };
  }, [renderer]);

  // シーンの初期化。restore メソッドが呼ばれて再レンダリングされたときに実行される
  useEffect(() => {
    if (!initialized) {
      allObject.forEach((value: THREE.Object3D) => {
        selectRef.current?.add(value);
      });
      setInitialized(true);
    }
  }, [allObject, initialized]);

  // 選択したオブジェクトのハイライト処理
  const highlight = (mesh: THREE.Mesh) => {
    const setting = { transparent: true, opacity: 0.5, alphaTest: 0.5 };
    if (Array.isArray(mesh.material)) {
      mesh.material.forEach((mat) => {
        mat.setValues(setting);
      });
    } else {
      mesh.material.setValues(setting);
    }
  };

  // 選択したオブジェクトのハイライト解除処理
  const unhighlight = (mesh: THREE.Mesh) => {
    const setting = { transparent: false, opacity: 1 };
    if (Array.isArray(mesh.material)) {
      mesh.material.forEach((mat) => {
        mat.setValues(setting);
      });
    } else {
      mesh.material.setValues(setting);
    }
  };

  // 選択されたオブジェクトたちの重心算出処理
  const calculateGroupCenter = (objectArray: THREE.Object3D[]) => {
    return objectArray
      .map((object) => {
        return object.getWorldPosition(new THREE.Vector3());
      })
      .reduce(
        (pre, cur, ind, arr) => {
          return pre.add(cur.multiplyScalar(1 / arr.length));
        },
        new THREE.Vector3(0, 0, 0),
      );
  };

  // 選択されたオブジェクトを選択中 group に移動する処理
  // groupCenter を元に local position の算出をしている
  // groupQuaternion を各オブジェクトにも適用することで world 座標系での回転が変更されないようにしている
  const attachObjectsToSelectedGroup = (
    objectArray: THREE.Object3D[],
    groupCenter: THREE.Vector3,
    groupQuaternion: THREE.Quaternion,
  ) => {
    objectArray.forEach((object) => {
      if (object.type === 'Mesh') {
        highlight(object as THREE.Mesh);
      }
      const world = object.getWorldPosition(new THREE.Vector3()).clone();
      const local = world.sub(groupCenter.clone());
      selectedGroup.current?.attach(object);
      object.applyQuaternion(groupQuaternion.clone());
      object.position.set(local.x, local.y, local.z);
    });
  };

  // 選択されていたオブジェクトの選択状態を解除する処理
  const attachObjectsToSelectGroup = (objectArray: THREE.Object3D[]) => {
    selectedGroup
      .current!.children.filter(
        (object: THREE.Object3D) => objectArray.indexOf(object) === -1,
      )
      .forEach((object: THREE.Object3D) => {
        if (object.type === 'Mesh') {
          unhighlight(object as THREE.Mesh);
        }
        const world = object.getWorldPosition(new THREE.Vector3()).clone();
        const local = world.sub(selectRef.current!.position().clone());
        selectRef.current?.attach(object);
        object.position.set(local.x, local.y, local.z);
      });
  };

  // FIXME: Clone した物だと透明にならない
  // オブジェクトの複製処理
  const clone = (selectedObjects: THREE.Object3D[] | undefined) => {
    if (!selectedObjects) {
      return;
    }
    const clonedObjects = selectedObjects.map((object) => {
      const cloned = object.clone() as THREE.Mesh;
      if (Array.isArray(cloned.material)) {
        const clonedMaterials = (cloned.material as THREE.Material[]).map(
          (mat) => mat.clone(),
        );
        cloned.material = clonedMaterials;
      } else {
        cloned.material = cloned.material.clone();
      }
      return cloned;
    });
    attachObjectsToSelectGroup([]);
    clonedObjects.forEach((object) => selectedGroup.current?.attach(object));
    setAllObject([...allObject, ...clonedObjects]);
  };

  // コンポーネントが返す JSX
  return (
    <>
      <CanvasSetting />
      <ambientLight intensity={0.1} />
      <directionalLight
        color="white"
        position={[0, 5, 0]}
        rotation={[-(Math.PI / 2), 0, 0]}
      />

      {/* FIXME: 原因は不明だが、何かのタイミングでカメラの移動が出来なくなる。怪しいのは (scene as any).cameraControls で直接アクセスしている箇所 */}
      <PositionSwitchCamera isEditMode={isEditMode} />

      <Select
        ref={selectRef}
        isEditMode={isEditMode}
        onSelectionStart={() => {
          (scene as any).cameraControls.enabled = false;
        }}
        onSelectionEnd={() => {
          (scene as any).cameraControls.enabled = true;
        }}
        onSelectionChange={(objectArray) => {
          const groupQuaternion = selectedGroup.current!.quaternion.clone();
          const groupCenter = calculateGroupCenter(objectArray);
          attachObjectsToSelectedGroup(
            objectArray,
            groupCenter,
            groupQuaternion,
          );
          attachObjectsToSelectGroup(objectArray);

          if (selectedGroup.current) {
            selectedGroup.current.applyQuaternion(
              groupQuaternion.clone().invert(),
            );
            selectedGroup.current.position.set(
              groupCenter.x,
              groupCenter.y,
              groupCenter.z,
            );
          }
        }}
      >
        <group ref={selectedGroup}></group>
      </Select>

      <TransformControls
        attach="transformControls"
        object={selectedGroup.current!}
        showX={transformMode !== 'rotate'}
        showY={transformMode === 'rotate'}
        showZ={transformMode !== 'rotate'}
        enabled={isEditMode}
        mode={transformMode}
        rotationSnap={Math.PI / 36}
        translationSnap={0.05}
      />

      <gridHelper args={[200, 20]} />
    </>
  );
};

export default forwardRef(Scene);
