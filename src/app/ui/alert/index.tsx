'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import ReactDOM from 'react-dom';
import { clsx } from 'clsx';
import { XMarkIcon } from '@heroicons/react/24/outline';

export type AlertProps = {
  type: 'danger' | 'success';
  message?: string;
};

let setAlertMessageGlobal: Dispatch<SetStateAction<AlertProps | null>>;

export const showSuccessAlert = (message: string) => {
  setAlertMessageGlobal({ type: 'success', message });
};

export const showDangerAlert = (message: string) => {
  setAlertMessageGlobal({ type: 'danger', message });
};

export const Alert = ({ type, message }: AlertProps) => {
  return (
    <div
      className={clsx(
        'absolute left-[50%] top-4 z-50 translate-x-[-50%] rounded-lg px-7 py-4 shadow-lg',
        {
          'bg-red-300 text-red-500': type === 'danger',
          'bg-green-300 text-green-500': type === 'success',
        },
      )}
    >
      {message}
      <XMarkIcon
        className="ml-4 inline-block h-5 cursor-pointer"
        onClick={() => {
          setAlertMessageGlobal(null);
        }}
      />
    </div>
  );
};

export const AlertManager = () => {
  const [alert, setAlert] = useState<AlertProps | null>(null);
  setAlertMessageGlobal = setAlert;
  if (!alert) {
    return null;
  }
  return ReactDOM.createPortal(<Alert {...alert} />, document.body);
};
