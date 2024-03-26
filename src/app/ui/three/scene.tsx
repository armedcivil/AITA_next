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

export interface SceneMethod {
  reset: () => void;
}

const Scene = ({ isEditMode }: { isEditMode: boolean }, ref: any) => {
  const scene = useThree((state) => state.scene);
  const renderer = useThree((state) => state.gl);
  const [initialized, setInitialized] = useState(false);
  const allObject = useRef<THREE.Object3D[]>(
    [
      [-1.5, 0.5, 0, '#ffaaaa'],
      [1.5, 0.5, 0, '#aaaaff'],
    ].map((value) => {
      const material = new THREE.MeshStandardMaterial({
        color: value[3],
        format: THREE.RGBAFormat,
      });
      const geometory = new THREE.BoxGeometry(1, 1, 1);
      const mesh = new THREE.Mesh(geometory, material);
      mesh.position.set(Number(value[0]), Number(value[1]), Number(value[2]));
      return mesh;
    }),
  );

  const selectedGroup = useRef<THREE.Group<THREE.Object3DEventMap>>(null);
  const selectRef = useRef<SelectMethod>(null);

  useImperativeHandle(ref, () => ({
    reset() {
      (scene as any).cameraControls.reset(true);
    },
  }));

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

  useEffect(() => {
    if (!initialized) {
      allObject.current?.forEach((value: THREE.Object3D) => {
        selectRef.current?.add(value);
      });
      setInitialized(true);
    }
  }, [initialized]);

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

  return (
    <>
      <CanvasSetting />
      <ambientLight intensity={0.1} />
      <directionalLight
        color="white"
        position={[0, 5, 0]}
        rotation={[-(Math.PI / 2), 0, 0]}
      />

      <PositionSwitchCamera isEditMode={isEditMode} />

      {/* TODO: THREE.selectionBox の利用 */}
      <Select
        ref={selectRef}
        isEditMode={isEditMode}
        onSelectionChange={(objectArray) => {
          objectArray.forEach((object) => {
            if (object.type === 'Mesh') {
              highlight(object as THREE.Mesh);
            }
            selectedGroup.current?.attach(object);
          });
          allObject.current
            ?.filter(
              (object: THREE.Object3D) => objectArray.indexOf(object) === -1,
            )
            .forEach((object: THREE.Object3D) => {
              if (object.type === 'Mesh') {
                unhighlight(object as THREE.Mesh);
              }
              selectRef.current?.attach(object);
            });
        }}
      >
        {/* TODO: group 中心の再計算 */}
        <group name="1" ref={selectedGroup}></group>
      </Select>

      {/* 
        TODO: isEditMode が true の時のみ有効
        TODO: 見た目を PivotControls に近づけたい
      */}
      <TransformControls
        attach="transformControls"
        object={selectedGroup.current!}
        showY={false}
      />

      <gridHelper args={[200, 20]} />
    </>
  );
};

export default forwardRef(Scene);
