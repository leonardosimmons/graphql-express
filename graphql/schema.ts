import {
  intArg,
  makeSchema,
  nonNull,
  nullable,
  objectType,
  stringArg,
} from "nexus";
import { nexusPrisma } from "nexus-plugin-prisma";
import { join } from "path";

export const Contact = objectType({
  name: "Contact",
  definition(t) {
    t.model.id();
    t.model.firstname();
    t.model.lastname();
    t.model.email();
    t.model.avatar();
  },
});

export const Post = objectType({
  name: "Post",
  definition(t) {
    t.model.id();
    t.model.title();
    t.model.content();
    t.model.published();
    t.model.authorId();
    t.field("author", {
      type: "User",
      resolve: (_parent, _, ctx) =>
        ctx.prisma.user.findUnique({
          where: {
            id: Number(_parent.authorId),
          },
        }),
    });
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
      resolve: (_parent, _, ctx) =>
        ctx.prisma.post.findMany({
          where: {
            authorId: Number(_parent.id),
          },
        }),
    });
  },
});

export const Query = objectType({
  name: "Query",
  definition(t) {
    t.list.field("contacts", {
      type: "Contact",
      resolve: (_, __, ctx) => ctx.prisma.contact.findMany(),
    });

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
        authorId: nullable(intArg()),
      },
      resolve: (_, { authorId }, ctx) => {
        if (authorId) {
          return ctx.prisma.post.findMany({
            where: {
              published: true,
              authorId: Number(authorId),
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
  types: [Contact, Query, Post, User],
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
