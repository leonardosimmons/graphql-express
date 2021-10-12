import { objectType } from 'nexus';

export const UserType = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.int('id');
    t.string('name');
    t.nonNull.string('email');
    t.nullable.list.field('posts', {
      type: 'Post',
      resolve: (parent, _, ctx) =>
        ctx.prisma.post.findMany({
          where: {
            authorId: Number(parent.id),
          },
        }),
    });
  },
});
