import prisma from '@/app/lib/prisma';
const COUNT_PER_PAGE = 10;

export async function fetchUsers(
  companyId: number,
  page: number,
  query: string,
) {
  page = Math.max(page, 1);
  const skip = (page - 1) * COUNT_PER_PAGE;
  const users = await prisma.users.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
    where: {
      company_id: companyId,
      name: {
        contains: query,
      },
      email: {
        contains: query,
      },
    },
    orderBy: {
      id: 'asc',
    },
    skip: skip,
    take: COUNT_PER_PAGE,
  });

  return users;
}

export async function fetchUsersPageCount(companyId: number, query: string) {
  const count = await prisma.users.count({
    where: {
      company_id: companyId,
      name: {
        contains: query,
      },
      email: {
        contains: query,
      },
    },
  });

  return getMaxPage(count);
}

function getMaxPage(count: number): number {
  return count % COUNT_PER_PAGE > 0
    ? Math.floor(count / COUNT_PER_PAGE) + 1
    : Math.floor(count / COUNT_PER_PAGE);
}
