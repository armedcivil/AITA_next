'use client';

import * as THREE from 'three';
import {
  forwardRef,
  useRef,
  useReducer,
  useCallback,
  useImperativeHandle,
  useEffect,
} from 'react';

// Select コンポーネントのメソッドの定義
export interface SelectMethod {
  add: (objects: THREE.Object3D) => void;
  attach: (object: THREE.Object3D) => void;
}

// Select コンポーネントの宣言
// イベントを一括で管理している group へ直接 add, attach できるようにメソッドを用意したため、forwardRef で囲っている
export const Select = forwardRef(function Select(
  {
    isEditMode,
    onSelectionChange,
    children,
  }: {
    isEditMode: boolean;
    onSelectionChange?: (object: THREE.Object3D[]) => void;
    children?: React.ReactNode;
  },
  selectRef,
) {
  // イベントを一括で管理している group への参照
  const groupRef = useRef<THREE.Group<THREE.Object3DEventMap>>(null);
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
  }));

  // 選択状態になった Object3D を親に通知するコールバックを呼び出す useEffect
  // reducer の更新で再レンダリングされたタイミングで発火する
  useEffect(() => {
    onSelectionChange?.(selected);
  });

  // raycast に何も当たらなかった時のコールバック
  const handlePointerMissed = useCallback((event: any) => {
    dispatch({});
  }, []);

  // group がクリックされた時のコールバック
  // event.object で raycast に当たった Object3D が取得できる
  const handleClick = useCallback((event: any) => {
    event.stopPropagation();
    dispatch({ object: event.object, shift: event.shiftKey });
  }, []);

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
