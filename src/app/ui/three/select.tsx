'use client';

import * as THREE from 'three';
import { SelectionBox } from 'three-stdlib';
import {
  forwardRef,
  useRef,
  useReducer,
  useCallback,
  useImperativeHandle,
  useEffect,
} from 'react';
import { useThree } from '@react-three/fiber';

// Select コンポーネントのメソッドの定義
export interface SelectMethod {
  add: (objects: THREE.Object3D) => void;
  attach: (object: THREE.Object3D) => void;
  toJSON: () => object;
  clear: () => void;
  position: () => THREE.Vector3;
  removeSelected: () => void;
}

// Select コンポーネントの宣言
// イベントを一括で管理している group へ直接 add, attach できるようにメソッドを用意したため、forwardRef で囲っている
export const Select = forwardRef(function Select(
  {
    isEditMode,
    onSelectionChange,
    onSelectionStart,
    onSelectionEnd,
    children,
  }: {
    isEditMode: boolean;
    onSelectionChange?: (object: THREE.Object3D[]) => void;
    onSelectionStart?: () => void;
    onSelectionEnd?: () => void;
    children?: React.ReactNode;
  },
  selectRef,
) {
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);
  const renderer = useThree((state) => state.gl);
  const controls = useThree((state) => state.controls);
  const size = useThree((state) => state.size);

  // イベントを一括で管理している group への参照
  const groupRef = useRef<THREE.Group<THREE.Object3DEventMap>>(null);

  const selectionBox = new SelectionBox(camera, scene, camera.far);

  // 選択状態にある Object3D を管理・保持するための reducer
  const [selected, dispatch] = useReducer(
    (
      state: THREE.Object3D[],
      {
        object,
        shift,
      }: { object?: THREE.Object3D | THREE.Object3D[]; shift?: boolean },
    ): THREE.Object3D[] => {
      if (object === undefined || !isEditMode) return [];
      else if (Array.isArray(object)) return object;
      else if (!shift) return [];
      else if (state.includes(object)) return state.filter((o) => o !== object);
      else return [object, ...state];
    },
    [],
  );

  // Select コンポーネントが持つメソッドの宣言
  useImperativeHandle(selectRef, () => ({
    add(object: THREE.Object3D) {
      groupRef.current?.add(object);
    },
    attach(object: THREE.Object3D) {
      groupRef.current?.attach(object);
    },
    toJSON() {
      return groupRef.current?.children
        .filter((child) => child.layers.isEnabled(2))
        .map((child) => child.toJSON());
    },
    clear() {
      groupRef.current?.children
        .filter((child) => child.layers.isEnabled(2))
        .concat()
        .forEach((child) => {
          child.removeFromParent();
        });
      dispatch({});
    },
    position() {
      return groupRef.current?.position;
    },
    removeSelected() {
      dispatch({});
    },
  }));

  // 選択状態になった Object3D を親に通知するコールバックを呼び出す useEffect
  // reducer の更新で再レンダリングされたタイミングで発火する
  useEffect(() => {
    onSelectionChange?.(selected);
  });

  // raycast に何も当たらなかった時のコールバック
  const handlePointerMissed = useCallback((event: any) => {
    renderer.domElement.parentElement
      ?.querySelectorAll('.selectBox')
      .forEach((element, index, parent) => {
        element.parentElement?.removeChild(element);
      });
    dispatch({});
  }, []);

  // クリックされた時のコールバック
  // event.object で raycast に当たった Object3D が取得できる
  const handleClick = useCallback((event: any) => {
    renderer.domElement.parentElement
      ?.querySelectorAll('.selectBox')
      .forEach((element, index, parent) => {
        element.parentElement?.removeChild(element);
      });
    event.stopPropagation();
    dispatch({ object: event.object, shift: event.shiftKey });
  }, []);

  const windowSize = new THREE.Vector2(size.width, size.height);
  const elementStartPoint: THREE.Vector2 = new THREE.Vector2(0, 0);

  // SelectionBox を使うための EventListener 等の登録を行う
  useEffect(() => {
    const element = document.createElement('div');
    element.classList.add('selectBox');

    const oldControlsEnabled = (controls as any)?.enabled;

    function handleDragStart(event: any) {
      if (!event.shiftKey || !isEditMode) {
        return;
      }
      selectionBox.startPoint.set(
        (event.offsetX / windowSize.x) * 2 - 1,
        -(event.offsetY / windowSize.y) * 2 + 1,
        0.3,
      );
      if (controls) {
        (controls as any).enabled = false;
      }
      onSelectionStart?.();

      renderer.domElement.parentElement?.appendChild(element);
      elementStartPoint.x = event.clientX;
      elementStartPoint.y = event.clientY;
      element.style.left = `${event.clientX}px`;
      element.style.top = `${event.clientY}px`;
      element.style.width = '0px';
      element.style.height = '0px';
    }

    function handleDrag(event: any) {
      if (!event.shiftKey || !isEditMode) {
        element.parentElement?.removeChild(element);
        return;
      }
      selectionBox.endPoint.set(
        (event.offsetX / windowSize.x) * 2 - 1,
        -(event.offsetY / windowSize.y) * 2 + 1,
        0.3,
      );
      element.style.width = `${event.clientX - elementStartPoint.x}px`;
      element.style.height = `${event.clientY - elementStartPoint.y}px`;
    }

    function handleDragEnd(event: any) {
      const endPoint = new THREE.Vector2(
        (event.offsetX / windowSize.x) * 2 - 1,
        -(event.offsetY / windowSize.y) * 2 + 1,
      );
      const distance = elementStartPoint.distanceTo(
        new THREE.Vector2(event.clientX, event.clientY),
      );

      if (!event.shiftKey || !isEditMode || distance < 10) {
        element.parentElement?.removeChild(element);
        return;
      }
      if (controls) {
        (controls as any).enabled =
          oldControlsEnabled !== undefined || oldControlsEnabled !== null
            ? oldControlsEnabled
            : true;
      }
      onSelectionEnd?.();

      selectionBox.endPoint.set(endPoint.x, endPoint.y, 0.3);
      var selected = selectionBox.select();
      dispatch({
        object: selected.filter(
          (object) => object.isMesh && object.layers.isEnabled(2),
        ),
      });
      element.style.width = `${event.clientX - elementStartPoint.x}px`;
      element.style.height = `${event.clientY - elementStartPoint.y}px`;
      element.parentElement?.removeChild(element);
    }

    renderer.domElement.addEventListener('pointerdown', handleDragStart, {
      passive: true,
    });
    renderer.domElement.addEventListener('pointermove', handleDrag, {
      passive: true,
      capture: true,
    });
    renderer.domElement.addEventListener('pointerup', handleDragEnd, {
      passive: true,
    });

    return () => {
      renderer.domElement.removeEventListener('pointerdown', handleDragStart);
      renderer.domElement.removeEventListener('pointermove', handleDrag, true);
      renderer.domElement.removeEventListener('pointerup', handleDragEnd);
    };
  });

  return (
    <group
      onClick={handleClick}
      onPointerMissed={handlePointerMissed}
      ref={groupRef}
    >
      {children}
    </group>
  );
});
