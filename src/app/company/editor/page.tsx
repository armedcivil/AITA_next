import { Floor } from '@/app/lib/three/scene-store';
import Editor from '@/app/ui/editor';
import { fetchFloors } from '@/app/lib/data';
import { cookies } from 'next/headers';

export default async function Page() {
  const tokenCookie = cookies().get('token');
  let floors: Floor[] = [];
  if (tokenCookie) {
    const data = await fetchFloors(tokenCookie.value);
    if (data.floors) {
      floors = data.floors;
    }
  }

  // TODO: カスタムなモデルの読み込み機能
  return (
    <div className="h-full p-3">
      <Editor defaultFloors={floors} />
    </div>
  );
}
