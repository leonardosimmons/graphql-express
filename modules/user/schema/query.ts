import { extendType, nonNull, stringArg } from 'nexus';

const GetUsers = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('users', {
      type: 'User',
      resolve: (_, __, ctx) => ctx.prisma.user.findMany(),
    });
  },
});

const GetUserById = extendType({
  type: 'Query',
  definition(t) {
    t.field('userById', {
      type: 'User',
      args: {
        userId: nonNull(stringArg()),
      },
      resolve: (_, { userId }, ctx) =>
        ctx.prisma.user.findUnique({
          where: {
            id: Number(userId),
          },
        }),
    });
  },
});

export const UserQuery = { GetUsers, GetUserById };
