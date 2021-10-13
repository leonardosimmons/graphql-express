import Express from 'express';
import jwt from 'jsonwebtoken';
import { HashController } from '../../../lib/models/HashController';

const { JWT_SECRET } = process.env;

export async function verifyRefreshBodyField(
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction,
) {
  if (res.locals && res.locals.refresh_token) {
    return next();
  } else {
    res.status(400).json({
      Error: 'Need to pass refresh_token field',
    });
  }
}

export async function validRefreshNeeded(
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction,
) {
  const crypto = new HashController();
  const buffer = Buffer.from(res.locals.refresh_token, 'base64');
  const refresh_token = buffer.toString();
  const hash = crypto.hash(
    res.locals.jwt.userId + JWT_SECRET,
    res.locals.jwt.refreshKey,
  );
  if (hash.hash === refresh_token) {
    return next();
  } else {
    return res.status(400).json({
      error: 'Invalid refresh token',
    });
  }
}

export async function validJWTNeeded(
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction,
) {
  if (req.headers['authorization']) {
    try {
      const authorization = req.headers['authorization'].split(' ');
      if (authorization[0] !== 'Bearer') {
        return res.status(401).json({});
      } else {
        res.locals.jwt = jwt.verify(authorization[1], JWT_SECRET as string);
        return next();
      }
    } catch (err) {
      return res.status(403).json({
        message: (err as Error).message,
      });
    }
  } else {
    return res.status(401).json({
      message: 'Invalid request',
    });
  }
}
