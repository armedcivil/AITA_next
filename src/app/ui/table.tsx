'use server';

import Image from 'next/image';
import Link from 'next/link';
import { PencilIcon } from '@heroicons/react/24/outline';
import { fetchUsers } from '../lib/data';
import { DeleteUserButton } from './buttons-server';
import { cookies } from 'next/headers';

export default async function Table({
  companyId,
  query,
  page,
}: {
  companyId: number | bigint;
  query: string;
  page: number;
}) {
  const accessToken = cookies().get('token')!.value;
  const users = await fetchUsers(companyId, page, query);
  return (
    <table className="h-[200px] w-[600px]">
      <thead className="sticky z-20">
        <tr className="text-center">
          <th>ICON</th>
          <th>NAME</th>
          <th>EMAIL</th>
          <th>ACTION</th>
        </tr>
      </thead>
      <tbody className="overflow-scroll">
        {users.map((user) => {
          return (
            <tr
              key={user.id}
              className="mt-2 rounded-lg border-2 border-gray-100"
            >
              <td className="flex justify-center px-4 py-[4px]">
                <div className="h-8 w-8">
                  {user.icon_image_path && (
                    <Image
                      src={`http://aita_nest_app:3001/${user.icon_image_path}`}
                      width={30}
                      height={30}
                      alt="user icon"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  )}
                </div>
              </td>
              <td className="px-4 py-[4px]">{user.name}</td>
              <td className="px-4 py-[4px]">{user.email}</td>
              <td>
                <div className="flex items-center justify-center">
                  <Link
                    href={`/company/users/${user.id}/edit`}
                    className="inline-block h-4 w-4"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Link>
                  <DeleteUserButton
                    accessToken={accessToken}
                    userId={user.id.toString()}
                  />
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
