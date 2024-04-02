'use client';

import { useThree } from '@/app/lib/three/three-fiber-exporter';
import {
  PivotControls,
  TransformControls,
} from '@/app/lib/three/three-drei-exporter';
import * as THREE from 'three';
import React, {
  useEffect,
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
} from 'react';
import { Select, SelectMethod } from '@/app/ui/three/select';
import {
  Floor,
  loadGLTF,
  restore,
  save,
  SceneObject,
} from '@/app/lib/three/scene-store';

// Scene コンポーネントのメソッド宣言
export interface SceneMethod {
  resetCamera: () => void;
  toJSON: () => Floor;
  restore: (json: Floor) => void;
  changeTransformMode: (mode: 'translate' | 'rotate') => void;
  loadModel: (path: string) => void;
  removeSelected: () => void;
  cloneSelected: () => void;
}

// Scene コンポーネント
const Scene = (
  {
    isEditMode,
    onChange,
  }: {
    isEditMode: boolean;
    onChange?: (result: { objects: SceneObject[] }) => void;
  },
  ref: any,
) => {
  const scene = useThree((state) => state.scene);
  const renderer = useThree((state) => state.gl);
  const [initialized, setInitialized] = useState(false);
  const [allObject, setAllObject] = useState<THREE.Object3D[]>([]);
  const [transformMode, setTransformMode] = useState<'translate' | 'rotate'>(
    'translate',
  );

  const selectedGroup = useRef<THREE.Group<THREE.Object3DEventMap>>(null);
  const selectRef = useRef<SelectMethod>(null);
  const pivotRef = useRef<THREE.Group<THREE.Object3DEventMap>>(null);

  const startMatrixRef = useRef<THREE.Matrix4>();
  const pivotMatrixRef = useRef<THREE.Matrix4>(new THREE.Matrix4());

  // Scene の状態を JSON 化する
  const toJSON = (): { objects: SceneObject[] } => {
    const selectedObjects = selectedGroup.current!.children.map((object) => {
      object.updateMatrix();
      object.updateMatrixWorld();
      return object;
    });
    const result = {
      objects: save([
        ...selectRef
          .current!.children()
          .filter((child) => child.layers.isEnabled(2)),
        ...selectedObjects,
      ]),
    };
    return result;
  };

  // Scene コンポーネントの呼び出し可能なメソッドの定義
  useImperativeHandle(ref, () => ({
    resetCamera() {
      (scene as any).cameraControls.reset(true);
    },
    toJSON,
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
      onChange?.(toJSON());
    },
    removeSelected() {
      selectRef.current?.clearCache();
      selectedGroup.current?.clear();
    },
    cloneSelected() {
      clone(selectedGroup.current?.children);
    },
  }));

  // ブラウザの負荷を下げるために WebGL のcontextが強制的に消されることがあるため、復帰処理を仕込む
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
      scene.attach(new THREE.BoxHelper(selectedGroup.current!, '#ff00ff'));
      setInitialized(true);
    }
  }, [allObject, initialized]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'a') {
          e.preventDefault();
          selectRef.current?.selectAll();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

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
  const attachObjectsToSelectGroup = (selectedObjects: THREE.Object3D[]) => {
    selectedGroup
      .current!.children.filter(
        (object: THREE.Object3D) => selectedObjects.indexOf(object) === -1,
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
    onChange?.(toJSON());
  };

  // コンポーネントが返す JSX
  return (
    <>
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
            pivotMatrixRef.current?.setPosition(
              groupCenter.x,
              groupCenter.y,
              groupCenter.z,
            );
          }
        }}
      >
        <group ref={selectedGroup}></group>
      </Select>

      <PivotControls
        ref={pivotRef}
        matrix={pivotMatrixRef.current}
        autoTransform={false}
        depthTest={false}
        activeAxes={[true, false, true]}
        visible={isEditMode}
        disableScaling={true}
        onDragStart={() => {
          startMatrixRef.current = selectedGroup.current?.matrix.clone();
        }}
        onDrag={(
          l: THREE.Matrix4,
          deltaL: THREE.Matrix4,
          w: THREE.Matrix4,
          deltaW: THREE.Matrix4,
        ) => {
          const startQuaternion = new THREE.Quaternion();
          startMatrixRef.current!.decompose(
            new THREE.Vector3(),
            startQuaternion,
            new THREE.Vector3(),
          );

          const position = new THREE.Vector3();
          const quaternion = new THREE.Quaternion();
          l.decompose(position, quaternion, new THREE.Vector3());

          selectedGroup.current?.setRotationFromQuaternion(startQuaternion);
          selectedGroup.current?.applyQuaternion(quaternion);

          const { x, y, z } = position.clone();
          selectedGroup.current?.position.set(x, y, z);

          pivotMatrixRef.current.copyPosition(l);
        }}
        onDragEnd={() => {}}
      />

      <gridHelper args={[200, 100]} />
    </>
  );
};

export default forwardRef(Scene);
