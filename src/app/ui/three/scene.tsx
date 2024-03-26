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
      [-1.5, 0.5, -1.5, '#ffbbaa'],
      [1.5, 0.5, 0, '#aaaaff'],
      [1.5, 0.5, 1.5, '#aabbff'],
    ].map((value) => {
      const material = new THREE.MeshStandardMaterial({
        color: value[3],
        format: THREE.RGBAFormat,
      });
      const geometory = new THREE.BoxGeometry(1, 1, 1);
      const mesh = new THREE.Mesh(geometory, material);
      mesh.layers.enable(2);
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

  const calcurateGroupCenter = (objectArray: THREE.Object3D[]) => {
    return objectArray
      .map((object) => {
        const world = new THREE.Vector3();
        object.getWorldPosition(world);
        return world;
      })
      .reduce(
        (pre, cur, ind, arr) => {
          return pre.add(cur.multiplyScalar(1 / arr.length));
        },
        new THREE.Vector3(0, 0, 0),
      );
  };

  const attachObjectsToSelectedGroup = (
    objectArray: THREE.Object3D[],
    groupCenter: THREE.Vector3,
  ) => {
    objectArray.forEach((object) => {
      if (object.type === 'Mesh') {
        highlight(object as THREE.Mesh);
      }
      const world = new THREE.Vector3();
      object.getWorldPosition(world);
      const local = world.sub(groupCenter);
      selectedGroup.current?.attach(object);
      object.position.set(local.x, local.y, local.z);
    });
  };

  const attachObjectsToSelectGroup = (objectArray: THREE.Object3D[]) => {
    allObject.current
      ?.filter((object: THREE.Object3D) => objectArray.indexOf(object) === -1)
      .forEach((object: THREE.Object3D) => {
        if (object.type === 'Mesh') {
          unhighlight(object as THREE.Mesh);
        }
        selectRef.current?.attach(object);
      });
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
        onSelectionStart={() => {
          (scene as any).cameraControls.enabled = false;
        }}
        onSelectionEnd={() => {
          (scene as any).cameraControls.enabled = true;
        }}
        onSelectionChange={(objectArray) => {
          const groupCenter = calcurateGroupCenter(objectArray);
          attachObjectsToSelectedGroup(objectArray, groupCenter);
          attachObjectsToSelectGroup(objectArray);

          if (selectedGroup.current) {
            selectedGroup.current.position.set(
              groupCenter.x,
              groupCenter.y,
              groupCenter.z,
            );
          }
        }}
      >
        <group name="1" ref={selectedGroup}></group>
      </Select>

      {/* 
        TODO: isEditMode が true の時のみ有効
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
