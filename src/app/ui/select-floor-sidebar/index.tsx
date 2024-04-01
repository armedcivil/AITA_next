import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Floor } from '@/app/lib/three/scene-store';
import Cell from './cell';

export default function SelectFloorSideBar({
  floors,
  onSelect,
  onDelete,
  onLabelChange,
}: {
  floors: Floor[];
  onSelect: (floor: Floor, index: number) => void;
  onDelete: (floor: Floor, index: number) => void;
  onLabelChange: (floor: Floor, index: number) => void;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={clsx('absolute bottom-0 left-0 top-9 flex flex-row', {
        'w-64': isOpen,
        'w-8': !isOpen,
      })}
    >
      <div
        className={clsx('relative  rounded-r-lg bg-white ', {
          'w-56 p-3': isOpen,
          'w-0 p-0': !isOpen,
        })}
      >
        <div
          className={clsx('whitespace-no-wrap overflow-hidden text-xl', {
            'w-0': !isOpen,
          })}
        >
          Select floor
        </div>
        <hr></hr>
        <div
          className={clsx(
            'absolute bottom-0 left-0 right-0 top-12 overflow-y-auto',
            {
              'w-0': !isOpen,
            },
          )}
        >
          <div>
            {floors.map((floor, index) => (
              <Cell
                key={index}
                floor={floor}
                index={index}
                onLabelChange={onLabelChange}
                onDelete={onDelete}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
      </div>
      <div
        className="mt-8 flex h-9 w-8 items-center justify-center rounded-r-lg bg-white shadow-xl"
        onClick={(e) => {
          setIsOpen(!isOpen);
        }}
      >
        {isOpen ? (
          <ChevronLeftIcon className="h-5" />
        ) : (
          <ChevronRightIcon className="h-5" />
        )}
      </div>
    </div>
  );
}
