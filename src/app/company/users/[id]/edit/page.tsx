import EditUserForm from '@/app/ui/edit-user-form';
import { cookies } from 'next/headers';
import { fetchUser } from '@/app/lib/data';

export default async function Page({ params }: { params: { id: string } }) {
  const accessToken = cookies().get('token')?.value;
  let user = {};
  if (accessToken) {
    user = await fetchUser(accessToken, params.id);
  }

  return (
    <div className="h-full w-full p-3">
      <h2 className="h-6 text-xl">Edit User</h2>
      <div className="mt-8 flex justify-center">
        <div className="flex w-[636px] flex-col items-center rounded-lg border-2 border-gray-100 p-4 shadow-2xl">
          <EditUserForm userId={params.id} user={user} />
        </div>
      </div>
    </div>
  );
}
