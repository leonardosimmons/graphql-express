import { PrismaClient } from '.prisma/client';
import { HashController } from '../../../lib/models/HashController';

export async function verifyGraphqlUser(email: string) {
  const prisma = new PrismaClient();
  const crypto = new HashController();

  prisma.user
    .findUnique({
      where: {
        email: String(email),
      },
    })
    .then((user) => {
      if (!user) {
        return false;
      }
    });
}
