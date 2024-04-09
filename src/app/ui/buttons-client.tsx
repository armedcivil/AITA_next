'use client';

import {
  TrashIcon,
  DocumentArrowUpIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { useFormStatus } from 'react-dom';
import { Button } from '@/app/ui/button';
import LoadingIcon from './icons/loading-icon';

export function DeleteUserButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="ml-4">
      Delete
      {pending ? (
        <LoadingIcon className="h-5 animate-spin md:ml-4" fill="white" />
      ) : (
        <TrashIcon className="h-5 text-white" />
      )}
    </Button>
  );
}

export function UploadFloorButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="ml-4" disabled={pending}>
      Upload
      {pending ? (
        <LoadingIcon className="h-5 animate-spin md:ml-4" fill="white" />
      ) : (
        <DocumentArrowUpIcon className="h-5 md:ml-4" />
      )}
    </Button>
  );
}

export function CreateEditorAssetButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      className="col-start-6 col-end-7 row-start-4 justify-self-end"
      disabled={pending}
    >
      Create{' '}
      {pending && (
        <LoadingIcon className="h-5 animate-spin md:ml-4" fill="white" />
      )}
    </Button>
  );
}

export function DeleteEditorAssetButton() {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending}>
      Delete
      {pending ? (
        <LoadingIcon className="h-5 animate-spin md:ml-4" fill="white" />
      ) : (
        <TrashIcon className="h-5"></TrashIcon>
      )}
    </Button>
  );
}
