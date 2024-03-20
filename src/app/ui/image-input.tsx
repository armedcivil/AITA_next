'use client';

import Image from 'next/image';
import { RefObject, useRef } from 'react';

export default function ImageInput() {
  const image = useRef<HTMLImageElement>(null);

  return (
    <>
      <div className="col-start3 col-end-4 row-start-1 row-end-3 h-20 w-20 self-center justify-self-center rounded-full bg-gray-100">
        <Image
          src=""
          alt=""
          width={90}
          height={90}
          ref={image}
          className="hidden h-20 w-20 rounded-full object-cover"
        />
      </div>
      <label
        htmlFor="icon"
        className="relative col-start-4 col-end-7 row-start-1 row-end-3 mb-2 flex h-[110px] cursor-pointer items-center justify-center self-center rounded-lg border-2 border-red-400 p-2 text-sm"
      >
        <span>
          <span className="font-medium text-gray-600">
            Drop files to Attach, or
            <span className="text-blue-600 underline">browse</span>
          </span>
        </span>
        <input
          id="icon"
          type="file"
          name="icon"
          className="absolute h-full w-full opacity-0"
          onChange={(e) => {
            preview(e.target, image);
          }}
        />
      </label>
    </>
  );
}

function preview(target: any, ref: RefObject<HTMLImageElement>) {
  if (target.files.length === 0) {
    if (ref.current) {
      ref.current.src = '';
      ref.current.classList.add('hidden');
    }
  }
  for (let i = 0; i < target.files.length; i++) {
    const objectUrl = URL.createObjectURL(target.files[i]);
    if (ref.current) {
      ref.current.src = objectUrl;
      ref.current.classList.remove('hidden');
    }
  }
}
