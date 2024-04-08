import { XMarkIcon } from '@heroicons/react/24/outline';

export default function ModalContent({
  children,
  className,
  onClose,
}: {
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 flex h-full w-full items-center justify-center bg-gray-600/60">
      <div className="min-w-64 rounded-lg bg-white p-4 shadow-xl">
        <div className="flex w-full justify-end">
          <XMarkIcon
            className="h-5 cursor-pointer"
            onClick={() => {
              onClose?.();
            }}
          />
        </div>
        {children}
      </div>
    </div>
  );
}
