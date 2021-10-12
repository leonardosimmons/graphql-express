import { PrismaClient } from '@prisma/client';
import type { UserAuthToken } from '../modules/user';

export interface Context {
  prisma: PrismaClient;
  user: UserAuthToken;
}

const prisma = new PrismaClient();

const authInitialState: UserAuthToken = {
  id: null,
  role: 'guest',
  status: 'not-authorized',
  permissionLevel: 0,
};

export const context: Context = {
  prisma: prisma,
  user: authInitialState,
};
