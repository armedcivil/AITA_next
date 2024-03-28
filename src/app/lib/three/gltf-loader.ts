import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

export async function loadGLTF(path: string): Promise<THREE.Object3D> {
  const loader = new GLTFLoader();

  return new Promise((resolve, reject) => {
    loader.load(
      path,
      (gltf) => {
        resolve(gltf.scene.children[0]);
      },
      undefined,
      (error) => {
        reject(error);
      },
    );
  });
}
