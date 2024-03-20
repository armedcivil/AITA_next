import prisma from '@/app/lib/prisma';
import { fetcha, FetchaError } from '@co-labo-hub/fetcha';

const COUNT_PER_PAGE = 10;
const apiHost = process.env.API_HOST;

export async function fetchUsers(
  companyId: number | bigint,
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
      icon_image_path: true,
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

export async function fetchUsersPageCount(
  companyId: number | bigint,
  query: string,
) {
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

export async function fetchUser(accessToken: string, userId: string) {
  try {
    const response = await fetcha(`${apiHost}/user/${userId}`)
      .header('Authorization', `Bearer ${accessToken}`)
      .get();

    const data = await response.toJson<{
      id: bigint;
      name: string;
      email: string;
    }>();
    return data;
  } catch (e: any) {
    return {
      error: {
        message: e.message.toString(),
      },
    };
  }
}
