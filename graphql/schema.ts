import { fieldAuthorizePlugin, makeSchema, queryComplexityPlugin } from 'nexus';
import { join } from 'path';
import { UserSchema } from '../modules/user';

const types = { UserSchema };

export const schema = makeSchema({
  types,
  outputs: {
    schema: join(process.cwd(), 'graphql', 'schema.graphql'),
    typegen: join(
      process.cwd(),
      'node_modules',
      '@types',
      'nexus-typegen',
      'index.d.ts',
    ),
  },
  contextType: {
    export: 'Context',
    module: join(process.cwd(), 'graphql', 'context.ts'),
  },
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma',
      },
    ],
  },
  prettierConfig: join(process.cwd(), '.prettierrc'),
  plugins: [fieldAuthorizePlugin(), queryComplexityPlugin()],
});
