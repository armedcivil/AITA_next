'use client';

import * as THREE from 'three';
import { useThree } from '@/app/lib/three/three-fiber-exporter';
import { PivotControls } from '@/app/lib/three/three-drei-exporter';
import { RefAttributes, forwardRef, useImperativeHandle, useRef } from 'react';

type PivotControlsProps = {
  /** Scale of the gizmo, 1 */
  scale?: number;
  /** Width of the gizmo lines, this is a THREE.Line2 prop, 2.5 */
  lineWidth?: number;
  /** If fixed is true is remains constant in size, scale is now in pixels, false */
  fixed?: boolean;
  /** Pivot does not act as a group, it won't shift contents but can offset in position */
  offset?: [number, number, number];
  /** Starting rotation */
  rotation?: [number, number, number];
  /** Starting matrix */
  matrix?: THREE.Matrix4;
  /** Anchor point, like BBAnchor, each axis can be between -1/0/+1 */
  anchor?: [number, number, number];
  /** If autoTransform is true, automatically apply the local transform on drag, true */
  autoTransform?: boolean;
  /** Allows you to switch individual axes off */
  activeAxes?: [boolean, boolean, boolean];
  /** RGB colors */
  axisColors?: [string | number, string | number, string | number];
  /** Color of the hovered item */
  hoveredColor?: string | number;
  /** HTML value annotations, default: false */
  annotations?: boolean;
  /** CSS Classname applied to the HTML annotations */
  annotationsClass?: string;
  /** Drag start event */
  onDragStart?: () => void;
  /** Drag event */
  onDrag?: (
    l: THREE.Matrix4,
    deltaL: THREE.Matrix4,
    w: THREE.Matrix4,
    deltaW: THREE.Matrix4,
  ) => void;
  /** Drag end event */
  onDragEnd?: () => void;
  /** Set this to false if you want the gizmo to be visible through faces */
  depthTest?: boolean;
  opacity?: number;
  visible?: boolean;
  userData?: { [key: string]: any };
  children?: React.ReactNode;
};

export interface PivotMethod {
  clear: () => void;
  attach: (object: THREE.Object3D) => void;
}

const Pivot = function (
  {
    children,
    isEditMode,
    anchor,
  }: PivotControlsProps & {
    isEditMode: boolean;
  },
  ref: any,
) {
  const scene = useThree((state) => state.scene);
  const groupRef = useRef<THREE.Group<THREE.Object3DEventMap> | null>(null);

  useImperativeHandle(ref, () => ({
    clear() {
      if (groupRef.current) {
        groupRef.current!.clear();
      }
    },
    attach(object: THREE.Object3D) {
      if (groupRef.current) {
        groupRef.current!.attach(object);
      }
    },
  }));

  const handleDragStart = () => {
    (scene as any).cameraControls.enabled = false;
  };

  const handleDragEnd = () => {
    (scene as any).cameraControls.enabled = isEditMode;
  };

  return (
    <PivotControls
      anchor={anchor}
      scale={3}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      activeAxes={[true && isEditMode, false && isEditMode, true && isEditMode]}
    >
      <group ref={groupRef}>{children}</group>
    </PivotControls>
  );
};

export default forwardRef(Pivot);
