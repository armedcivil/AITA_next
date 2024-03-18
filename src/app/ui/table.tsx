import { fetchUsers } from '../lib/data';

export default async function Table({
  companyId,
  query,
  page,
}: {
  companyId: number;
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
              <td className="px-4 py-2">{user.id.toString()}</td>
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
