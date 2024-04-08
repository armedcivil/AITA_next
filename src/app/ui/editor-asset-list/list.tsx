'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal, useFormState } from 'react-dom';
import { PlusIcon } from '@heroicons/react/24/outline';
import { EditorAsset } from '.';
import EditorAssetCell from './cell';
import ModalContent from '../modal-content';
import { loadGLTF } from '@/app/lib/three/scene-store';
import Image from 'next/image';
import * as THREE from 'three';
import CameraFitter from '@/app/lib/three/camera-fitter';
import { createEditorAsset } from '@/app/lib/actions';
import { CreateEditorAssetButton } from '../buttons-client';

export default function List({
  editorAssets,
  onSelect,
}: {
  editorAssets: EditorAsset[];
  onSelect: (asset: EditorAsset) => void;
}) {
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const thumbnailInput = useRef<HTMLInputElement>(null);
  const [formState, formDispatch] = useFormState(createEditorAsset, {
    error: { message: '' },
  });
  const [imageSrc, setImageSrc] = useState('');

  const capture = async (assetPath: string) => {
    const gltfModel = await loadGLTF(assetPath);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const light = new THREE.DirectionalLight('white');
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const boundingBox = new THREE.Box3();

    renderer.setSize(80, 80);

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

    renderer.render(scene, camera);
    const dataURL = await new Promise<string>((resolve, reject) => {
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
          reject("can't read");
        }
      });
    });

    thumbnailInput.current!.value = dataURL;
    setImageSrc(dataURL);
  };

  useEffect(() => {
    if (formState.result) {
      editorAssets.push(formState.result);
      setImageSrc('');
      setShowDialog(false);
    }
  }, [editorAssets, setShowDialog, formState.result]);

  return (
    <div
      id="list"
      className="align-center flex flex-row overflow-hidden overflow-x-auto"
    >
      {editorAssets.map((asset, index) => {
        return (
          <EditorAssetCell
            key={index}
            editorAsset={asset}
            onClick={(e) => {
              onSelect(asset);
            }}
          />
        );
      })}
      <div
        className="relative m-2 flex aspect-square h-14 cursor-pointer select-none items-center justify-center rounded-lg bg-red-400"
        onClick={(e) => {
          setShowDialog(true);
        }}
      >
        <PlusIcon className="h-7 text-white" />
      </div>
      {showDialog &&
        createPortal(
          <ModalContent
            onClose={() => {
              setShowDialog(false);
            }}
          >
            <div className="w-[600px]">
              <span className="text-xl">Create Eidtor Asset</span>
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
                    onChange={(e) => {
                      if (e.target.files?.length === 0) {
                        setImageSrc('');
                      } else {
                        capture(URL.createObjectURL(e.target.files![0]));
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
          </ModalContent>,
          document.body,
        )}
    </div>
  );
}
