import { Floor } from '@/app/lib/three/scene-store';
import Editor from '@/app/ui/editor';
import { fetchFloors } from '@/app/lib/data';
import { cookies } from 'next/headers';
import { fetchEditorAssets } from '@/app/lib/data';
import { EditorAsset } from '@/app/ui/editor-asset-list';

export default async function Page() {
  const tokenCookie = cookies().get('token');
  let floors: Floor[] = [];
  let editorAssets: EditorAsset[] = [];
  let viewerKey: string = '';
  if (tokenCookie) {
    const data = await fetchFloors(tokenCookie.value);
    if (data.floors) {
      floors = data.floors;
    }
    if (data.viewerKey) {
      viewerKey = data.viewerKey;
    }

    const assets = await fetchEditorAssets(tokenCookie.value);
    if (assets.editorAssets) {
      editorAssets = assets.editorAssets;
    }
  }

  return (
    <div className="h-full p-3">
      <Editor
        defaultFloors={floors}
        editorAssets={editorAssets}
        viewerKey={viewerKey}
      />
    </div>
  );
}
