import Image from 'next/image';
import { fetchUsers } from '../lib/data';

export default async function Table({
  companyId,
  query,
  page,
}: {
  companyId: number | bigint;
  query: string;
  page: number;
}) {
  const users = await fetchUsers(companyId, page, query);
  return (
    <table className="w-[600px]">
      <thead>
        <tr className="text-center">
          <th>ICON</th>
          <th>NAME</th>
          <th>EMAIL</th>
          <th>ACTION</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => {
          return (
            <tr
              key={user.id}
              className="mt-2 rounded-lg border-2 border-gray-100 p-2"
            >
              <td className="flex justify-center px-4 py-2">
                {user.icon_image_path && (
                  <Image
                    src={`http://aita_nest_app:3001/${user.icon_image_path}`}
                    width={30}
                    height={30}
                    alt="user icon"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                )}
              </td>
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
