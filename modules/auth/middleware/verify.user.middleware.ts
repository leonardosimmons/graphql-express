import Express from 'express';
import { PrismaClient } from '.prisma/client';
import { HashController, HashToken } from '../../../lib/models/HashController';

export async function hasAuthValidFields(
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction,
): Promise<any> {
  let errors = [];

  if (req.body) {
    if (!req.body.email) {
      errors.push('Missing email field');
    }
    if (!req.body.password) {
      errors.push('Missing password field');
    }

    if (errors.length) {
      return res.status(400).send({ errors: errors.join(', ') });
    } else {
      return next();
    }
  } else {
    return res
      .status(400)
      .send({ errors: 'Missing email and password fields' });
  }
}

// ----------------------------------------------------------------

export async function verifyUser(
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction,
): Promise<void> {
  if (!req.body) {
    res.statusCode = 404;
    res.end('Error: No request body was provided');
    return;
  }

  new PrismaClient().user
    .findUnique({
      where: {
        email: String(req.body.email),
      },
    })
    .then((user) => {
      if (!user) {
        res.status(404).json({});
        return;
      } else {
        const crypto = new HashController();
        const pwFields: string[] = user.password.split('$');
        const salt: string = pwFields[0];

        const token: HashToken = crypto.hash(req.body.password, salt);
        if (token.hash === pwFields[1]) {
          req.body = {
            userId: user.id,
            email: user.email,
            permissionLevel: user.permissionLevel,
            provider: 'email',
            name: user.firstName + ' ' + user.lastName,
          };
          return next();
        } else {
          return res.status(400).json({ errors: 'Invalid email or password' });
        }
      }
    });
}
