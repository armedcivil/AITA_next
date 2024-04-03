import { Floor } from '@/app/lib/three/scene-store';
import DeleteFloorButton from '@/app/ui/delete-floor-button';
import { MouseEventHandler, useRef, useState } from 'react';
import { CheckIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function Cell({
  floor,
  index,
  onDelete,
  onLabelChange,
  onSelect,
}: {
  floor: Floor;
  index: number;
  onDelete: (floor: Floor, index: number) => void;
  onLabelChange: (floor: Floor, index: number) => void;
  onSelect: (floor: Floor, index: number) => void;
}) {
  const [isEdit, setIsEdit] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div>
      {isEdit ? (
        <div className="flex flex-row items-center justify-start bg-white">
          <input
            ref={inputRef}
            className="box-border max-w-44 rounded-lg border-2 border-red-400 p-2"
            defaultValue={floor.label}
            onChange={(e) => {
              floor.label = e.target.value;
            }}
          />
          <CheckIcon
            className="ml-auto mr-2 h-5 cursor-pointer text-red-400"
            onClick={(e) => {
              e.stopPropagation();
              setIsEdit(false);
              onLabelChange(floor, index);
            }}
          />
        </div>
      ) : (
        <div className="flex flex-row items-center bg-white p-2 hover:bg-red-200">
          <span
            className="whitespace-no-wrap w-36 max-w-36 cursor-pointer overflow-hidden text-ellipsis"
            onClick={(e) => {
              onSelect(floor, index);
            }}
          >
            {floor.label}
          </span>
          <div className="ml-auto mr-2 cursor-pointer">
            <PencilIcon
              className="h-5 text-red-400"
              onClick={(e) => {
                e.stopPropagation();
                setIsEdit(true);
              }}
            />
          </div>
          <div className="cursor-pointer">
            <DeleteFloorButton
              floorName={floor.label}
              onConfirmed={() => {
                onDelete(floor, index);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
