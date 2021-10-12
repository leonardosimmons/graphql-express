import Express from 'express';
import type { User } from '.prisma/client';
import { PrismaClient } from '@prisma/client';
import { httpError } from '../../../lib/functions';
import { HashController, HashToken } from '../../../lib/models/HashController';
import { UserModel } from '../model/user.model';

export async function createUser(
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction,
): Promise<void> {
  if (!req.body) {
    res.statusCode = 404;
    res.end('Error: No request body was provided');
    return;
  }

  const pwHash: HashToken = new HashController().hash(req.body.password);
  const pw: string = pwHash.salt + '$' + pwHash.hash;

  new PrismaClient().user
    .create({
      data: {
        firstName: req.body.firstName,
        lastName: req.body.lastName || '',
        email: req.body.email,
        password: pw,
        employerId: req.body.emoloyerId,
        permissionLevel: 1,
        role: 'user',
        status: 'authorized',
      },
    })
    .then((user) =>
      res.status(201).json({
        message: 'User successfully added to database',
        payload: {
          id: user.id,
        },
      }),
    )
    .catch((err) => {
      const error = httpError(
        err as Error,
        'Unable to add new user to database',
      );
      next(error);
    });
}

// ----------------------------------------------------------------

export async function getUsers(
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction,
): Promise<void> {
  if (req.query.page && req.query.per_page) {
    const model = new UserModel();
    const page: number = parseInt(req.query.page as string);
    const per_page: number = parseInt(req.query.per_page as string);

    new PrismaClient().user
      .findMany({
        skip: per_page * (page - 1),
        take: per_page,
      })
      .then((users) => {
        let info: Partial<User>[] = [];
        users.forEach((user) => {
          info.push(model.filterUserInfo(user));
        });

        res.status(200).json({
          message: 'Users successfully retrieved',
          payload: info,
        });
      })
      .catch((err) => {
        const error = httpError(
          err as Error,
          'Unable to retrieve user from database',
        );
        next(error);
      });
  } else {
    const model = new UserModel();
    new PrismaClient().user
      .findMany()
      .then((users) => {
        let info: Partial<User>[] = [];
        users.forEach((user) => {
          info.push(model.filterUserInfo(user));
        });

        res.status(200).json({
          message: 'Users successfully retrieved',
          payload: info,
        });
      })
      .catch((err) => {
        const error = httpError(
          err as Error,
          'Unable to retrieve user from database',
        );
        next(error);
      });
  }
}

// ----------------------------------------------------------------

export async function getUserById(
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction,
): Promise<void> {
  if (!req.params) {
    res.statusCode = 404;
    res.end('Error: User id was not provided');
    return;
  }

  new PrismaClient().user
    .findUnique({
      where: {
        id: String(req.params.userId),
      },
    })
    .then((user) => {
      const info = new UserModel().filterUserInfo(user as User);
      res.status(200).json({
        message: 'User successfully retrieved',
        payload: {
          user: info,
        },
      });
    })
    .catch((err) => {
      const error = httpError(
        err as Error,
        'Unable to retrieve user from database',
      );
      next(error);
    });
}

// ----------------------------------------------------------------

export async function patchUser(
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
    .update({
      where: {
        id: String(req.params.userId),
      },
      data: {
        firstName: 'Test admin',
        permissionLevel: 10,
        role: 'admin',
      },
    })
    .then((user) =>
      res.status(204).json({
        message: 'User successfully updated',
        payload: {
          id: user.id,
        },
      }),
    )
    .catch((err) => {
      const error = httpError(err as Error, 'Unable to udpate user');
      next(error);
    });
}

// ----------------------------------------------------------------

export async function deleteUser(
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction,
): Promise<void> {
  if (!req.params) {
    res.statusCode = 404;
    res.end('Error: User id was not provided');
    return;
  }

  new PrismaClient().user
    .deleteMany({
      where: {
        id: String(req.params.userId),
      },
    })
    .then((user) =>
      res.status(204).json({
        message: 'User succesfully deleted',
        payload: {
          user,
        },
      }),
    )
    .catch((err) => {
      const error = httpError(err as Error, 'Unable to delete user');
      next(error);
    });
}
