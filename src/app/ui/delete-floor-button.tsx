import { Button } from '@/app/ui/button';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { TrashIcon } from '@heroicons/react/24/outline';
import ModalContent from '@/app/ui/modal-content';

export default function DeleteFloorButton({
  floorName,
  onConfirmed,
}: {
  floorName: string;
  onConfirmed: () => void;
}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <Button
      className="ml-4"
      onClick={(e) => {
        setShowModal(true);
      }}
    >
      <TrashIcon className="h-5" />
      {showModal &&
        createPortal(
          <ModalContent
            onClose={() => {
              setShowModal(false);
            }}
          >
            {`Delete ${floorName}?`}
            <div className="mt-4">
              <Button
                onClick={(e) => {
                  setShowModal(false);
                  onConfirmed();
                }}
              >
                Delete<TrashIcon className="h-5"></TrashIcon>
              </Button>
            </div>
          </ModalContent>,
          document.body,
        )}
    </Button>
  );
}
