'use client';

import { useRef, useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { loadGLTF } from '@/app/lib/three/scene-store';
import Image from 'next/image';
import * as THREE from 'three';
import CameraFitter from '@/app/lib/three/camera-fitter';
import { createEditorAsset } from '@/app/lib/actions';
import { CreateEditorAssetButton } from '@/app/ui/buttons-client';
import { redirect } from 'next/navigation';
import { EditorAsset } from './editor-asset-list';

export default function CreateEditorAssetForm({
  onCreate,
  redirectUrl,
  handleRevalidate,
}: {
  onCreate?: (editorAsset: EditorAsset) => void;
  redirectUrl?: string;
  handleRevalidate?: () => void;
}) {
  const thumbnailInput = useRef<HTMLInputElement>(null);
  const topImageInput = useRef<HTMLInputElement>(null);
  const [formState, formDispatch] = useFormState(createEditorAsset, {
    error: { message: '' },
  });
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    if (formState.result) {
      setImageSrc('');
      onCreate?.(formState.result);
      handleRevalidate?.();
      if (redirectUrl) {
        redirect(redirectUrl);
      }
    }
  }, [formState.result, onCreate, setImageSrc, redirectUrl, handleRevalidate]);

  const captureThumbnail = async (assetPath: string) => {
    const gltfModel = await loadGLTF(assetPath);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const light = new THREE.DirectionalLight('white');
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const boundingBox = new THREE.Box3();

    scene.add(gltfModel);
    scene.add(light);

    camera.position.set(-5, 5, 5);
    camera.lookAt(0, 0, 0);

    light.position.set(0, 5, 0);
    light.lookAt(0, 0, 0);

    const fitter = new CameraFitter(camera);
    boundingBox.setFromObject(gltfModel);
    fitter.targetBox = boundingBox;
    fitter.fitCamera();

    const size = 150;

    renderer.setSize(size, size);

    renderer.render(scene, camera);
    return await exportImage(renderer);
  };

  const captureTop = async (assetPath: string) => {
    const gltfModel = await loadGLTF(assetPath);
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera();
    const light = new THREE.DirectionalLight('white');
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const boundingBox = new THREE.Box3();

    scene.add(gltfModel);
    scene.add(light);

    camera.position.set(0, 5, 0);
    camera.lookAt(0, 0, 0);

    light.position.set(0, 5, 0);
    light.lookAt(0, 0, 0);

    boundingBox.setFromObject(gltfModel);
    camera.left = boundingBox.min.x;
    camera.right = boundingBox.max.x;
    camera.top = boundingBox.max.z;
    camera.bottom = boundingBox.min.z;
    camera.updateProjectionMatrix();

    renderer.setSize(
      250 * (boundingBox.max.x - boundingBox.min.x),
      250 * (boundingBox.max.z - boundingBox.min.z),
    );

    renderer.render(scene, camera);

    return await exportImage(renderer);
  };

  const exportImage = async (
    renderer: THREE.WebGLRenderer,
  ): Promise<string> => {
    return await new Promise<string>((resolve, reject) => {
      renderer.domElement.toBlob((blob) => {
        if (blob) {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onload = () => {
            if (typeof reader.result === 'string') {
              resolve(reader.result);
            } else {
              reject("can't read");
            }
          };
        } else {
          reject("can't extract blob");
        }
      });
    });
  };

  return (
    <div className="w-[600px]">
      <form action={formDispatch} className="grid grid-cols-6">
        <label className="col-start-1 col-end-3 row-start-1 row-end-3 mr-4 self-center justify-self-end">
          Asset
        </label>
        <div className="col-start-3 col-end-4 row-start-1 row-end-3 aspect-square h-20 items-center self-center">
          {imageSrc && (
            <Image
              src={imageSrc}
              width={80}
              height={80}
              className="aspect-square h-20"
              alt="thumbnail"
            />
          )}
        </div>
        <input type="hidden" name="thumbnail" ref={thumbnailInput} />
        <input type="hidden" name="topImage" ref={topImageInput} />
        <label
          htmlFor="asset"
          className="relative col-start-4 col-end-7 row-start-1 row-end-3 flex items-center justify-center rounded-lg border-2 border-red-400"
        >
          <span>
            <span className="font-medium text-gray-600">
              Drop files to Attach, or
              <span className="text-blue-600 underline">browse</span>
            </span>
          </span>
          <input
            id="asset"
            type="file"
            name="asset"
            className="absolute h-full w-full opacity-0"
            accept=".glb"
            onChange={async (e) => {
              if (e.target.files?.length === 0) {
                setImageSrc('');
              } else {
                const dataURL = await captureThumbnail(
                  URL.createObjectURL(e.target.files![0]),
                );
                thumbnailInput.current!.value = dataURL;
                setImageSrc(dataURL);
                const topImageDataURL = await captureTop(
                  URL.createObjectURL(e.target.files![0]),
                );
                topImageInput.current!.value = topImageDataURL;
              }
            }}
          />
        </label>
        <label className="col-start-1 col-end-3 row-start-3 row-end-4 mr-4 mt-4 self-center justify-self-end">
          Is Chair
        </label>
        <input
          type="checkbox"
          name="isChair"
          className="mt-4 cursor-pointer self-center justify-self-start"
        />
        <CreateEditorAssetButton />
      </form>
    </div>
  );
}
