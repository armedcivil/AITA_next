import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { v4 as uuidv4 } from 'uuid';

export type SceneObject = {
  modelPath: string;
  matrix: THREE.Matrix4;
  isChair: boolean;
  id: string;
};

export type Floor = {
  label: string;
  objects: SceneObject[];
};

export const save = (objects: THREE.Object3D[]): SceneObject[] => {
  return objects.map((object) => ({
    modelPath: object.userData.modelPath,
    matrix: object.matrixWorld,
    isChair: object.userData.isChair,
    id: object.userData.id,
  }));
};

export const restore = async (
  sceneObjects: SceneObject[],
): Promise<THREE.Object3D[]> => {
  return await Promise.all(
    sceneObjects.map(async (sceneObject) => {
      try {
        const gltfModel = await loadGLTF(
          sceneObject.modelPath,
          sceneObject.isChair,
          sceneObject.id,
        );
        const originalScale = gltfModel.scale.clone();
        gltfModel.applyMatrix4(sceneObject.matrix);
        gltfModel.scale.set(originalScale.x, originalScale.y, originalScale.z);
        return gltfModel;
      } catch (e) {
        return new THREE.Object3D();
      }
    }),
  );
};

export const loadGLTF = async (
  path: string,
  isChair?: boolean,
  id?: string,
): Promise<THREE.Object3D> => {
  const loader = new GLTFLoader();

  return new Promise((resolve, reject) => {
    loader.load(
      path,
      (gltf) => {
        const model = gltf.scene.children[0];
        model.layers.enable(2);
        model.userData.modelPath = path;
        model.userData.isChair = isChair;
        if (id) {
          model.userData.id = id;
        } else {
          model.userData.id = uuidv4();
        }

        resolve(model);
      },
      undefined,
      reject,
    );
  });
};
