import { XMarkIcon } from '@heroicons/react/24/outline';

export default function EditorHelp({ onClose }: { onClose: () => void }) {
  return (
    <div className="relative h-full w-72">
      <div className="absolute left-0 right-0 top-0 z-10 flex h-16 items-center bg-red-400 p-2 text-2xl text-white shadow-lg">
        <span>Editor Help</span>
        <XMarkIcon className="ml-auto h-5 cursor-pointer" onClick={onClose} />
      </div>
      <div className="absolute bottom-0 left-0 right-0 top-16 overflow-y-auto bg-gray-100 p-2">
        <div>
          <span className="text-xl text-red-400">Camera Control</span>
          <ul className="list-inside list-disc pl-3">
            <li className="mt-2">
              <span className="text-lg">Mouse left button & drag</span>
              <p className="pl-3 text-sm">
                Move the camera in a spherical trajectory.
              </p>
            </li>
            <li className="mt-2">
              <span className="text-lg">Mouse right button & drag</span>
              <p className="pl-3 text-sm">Move the camera up/down/left/right</p>
            </li>
            <li className="mt-2">
              <span className="text-lg">Mouse wheel</span>
              <p className="pl-3 text-sm">zoomout/zoomin</p>
            </li>
          </ul>
        </div>
        <div className="mt-4">
          <span className="text-xl text-red-400">Selection</span>

          <ul className="list-inside list-disc pl-3">
            <li className="mt-2">
              <span className="text-lg">
                Press &#39;Shift&#39; + left click object
              </span>
              <p className="pl-3 text-sm">Select an object</p>
            </li>
            <li className="mt-2">
              <span className="text-lg">
                Press &#39;Shift&#39; + mouse left button & drag
              </span>
              <p className="pl-3 text-sm">Select objects</p>
            </li>
            <li className="mt-2">
              <span className="text-lg">
                Press &#39;Shift&#39; + left click selected object
              </span>
              <p className="pl-3 text-sm">Unselect an object</p>
            </li>
            <li className="mt-2">
              <span className="text-lg">
                Press &#39;Shift&#39; + left click anywhare without object
              </span>
              <p className="pl-3 text-sm">Unselect all objects</p>
            </li>
            <li className="mt-2">
              <span className="text-lg">
                Press &#39;Control/Command/Windows&#39; + &#39;a&#39;
              </span>
              <p className="pl-3 text-sm">Select all objects</p>
            </li>
          </ul>
        </div>
        <div className="mt-4">
          <span className="text-xl text-red-400">Keyboard</span>
          <ul className="list-inside list-disc pl-3">
            <li className="mt-2">
              <span className="text-lg">
                Press &#39;Control/Command/Windows&#39; + &#39;c&#39;
              </span>
              <p className="pl-3 text-sm">Copy selected objects to clipboard</p>
            </li>
            <li className="mt-2">
              <span className="text-lg">
                Press &#39;Control/Command/Windows&#39; + &#39;v&#39;
              </span>
              <p className="pl-3 text-sm">Paste objects from clipboard</p>
            </li>
            <li className="mt-2">
              <span className="text-lg">
                Press &#39;Control/Command/Windows&#39; +
                &#39;Delete/Backspace&#39;
              </span>
              <p className="pl-3 text-sm">Delete selected objects</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
