import {
  enumType,
  intArg,
  makeSchema,
  nonNull,
  objectType,
  queryType,
  stringArg,
} from "nexus";
import { nexusPrisma } from "nexus-plugin-prisma";
import { join } from "path";

export const Post = objectType({
  name: "Post",
  definition(t) {
    t.model.id();
    t.model.title();
    t.model.content();
    t.model.published();
    t.model.authorId();
  },
});

export const User = objectType({
  name: "User",
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.email();
    t.nullable.list.field("posts", {
      type: "Post",
      resolve: (_parent, __, ctx) =>
        ctx.prisma.post.findMany({
          where: {
            id: Number(_parent.id),
          },
        }),
    });
  },
});

export const Query = objectType({
  name: "Query",
  definition(t) {
    t.list.field("posts", {
      type: "Post",
      resolve: (_, __, ctx) => ctx.prisma.post.findMany(),
    });

    t.field("post", {
      type: "Post",
      args: {
        postId: nonNull(stringArg()),
      },
      resolve: (_, { postId }, ctx) =>
        ctx.prisma.post.findUnique({
          where: {
            id: Number(postId),
          },
        }),
    });

    t.list.field("publishedPosts", {
      type: "Post",
      args: {
        postId: intArg(),
      },
      resolve: (_, { postId }, ctx) => {
        if (postId) {
          return ctx.prisma.post.findMany({
            where: {
              published: true,
              id: Number(postId),
            },
          });
        }

        return ctx.prisma.post.findMany({
          where: {
            published: true,
          },
        });
      },
    });

    t.list.field("users", {
      type: "User",
      resolve: (_, __, ctx) => ctx.prisma.user.findMany(),
    });

    t.field("user", {
      type: "User",
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

export const schema = makeSchema({
  types: [Query, Post, User],
  outputs: {
    schema: join(process.cwd(), "graphql", "schema.graphql"),
    typegen: join(
      process.cwd(),
      "node_modules",
      "@types",
      "nexus-typegen",
      "index.d.ts"
    ),
  },
  contextType: {
    export: "Context",
    module: join(process.cwd(), "graphql", "context.ts"),
  },
  sourceTypes: {
    modules: [
      {
        module: "@prisma/client",
        alias: "prisma",
      },
    ],
  },
  plugins: [nexusPrisma({ experimentalCRUD: true })],
});
