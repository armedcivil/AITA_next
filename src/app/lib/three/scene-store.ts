import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

export type SceneObject = {
  modelPath: string;
  matrix: THREE.Matrix4;
};

export type Floor = {
  label: string;
  objects: SceneObject[];
};

export const save = (objects: THREE.Object3D[]): SceneObject[] => {
  return objects.map((object) => ({
    modelPath: object.userData.modelPath,
    matrix: object.matrixWorld,
  }));
};

export const restore = async (
  sceneObjects: SceneObject[],
): Promise<THREE.Object3D[]> => {
  return await Promise.all(
    sceneObjects.map(async (sceneObject) => {
      const gltfModel = await loadGLTF(sceneObject.modelPath);
      const originalScale = gltfModel.scale.clone();
      gltfModel.applyMatrix4(sceneObject.matrix);
      gltfModel.scale.set(originalScale.x, originalScale.y, originalScale.z);
      return gltfModel;
    }),
  );
};

export const loadGLTF = async (path: string): Promise<THREE.Object3D> => {
  const loader = new GLTFLoader();

  return new Promise((resolve, reject) => {
    loader.load(
      path,
      (gltf) => {
        const model = gltf.scene.children[0];
        model.layers.enable(2);
        model.userData.modelPath = path;
        resolve(model);
      },
      undefined,
      reject,
    );
  });
};
