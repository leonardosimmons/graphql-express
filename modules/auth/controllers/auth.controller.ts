import Express from 'express';
import { HashController, HashToken } from '../../../lib/models/HashController';
import jwt from 'jsonwebtoken';

const { JWT_SECRET, JWT_EXPIRATION_IN_SECONDS } = process.env;

export async function login(
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction,
): Promise<void> {
  try {
    if (!req.body) {
      res.statusCode = 404;
      res.end('Error: No request body was provided');
      return;
    }

    const crypto = new HashController();
    const refreshId: string = (res.locals.userId + JWT_SECRET) as string;
    const hashToken: HashToken = crypto.hash(refreshId);
    req.body.refreshKey = hashToken.salt;
    const authToken = jwt.sign(res.locals, JWT_SECRET as string, {
      expiresIn: JWT_EXPIRATION_IN_SECONDS as string,
    });
    const buffer = Buffer.from(hashToken.hash);
    const refresh_token = buffer.toString('base64');
    res.status(201).json({
      accessToken: authToken,
      refresh_token: refresh_token,
    });
  } catch (err) {
    res.status(500).json({ errors: err });
  }
}

export async function refresh_token(
  req: Express.Request,
  res: Express.Response,
): Promise<void> {
  try {
    if (!req.body) {
      res.statusCode = 404;
      res.end('Error: No request body was provided');
      return;
    }

    const token = jwt.sign(res.locals.jwt, JWT_SECRET as string, {
      expiresIn: JWT_EXPIRATION_IN_SECONDS,
    });
    res.status(201).json({ id: token });
  } catch (err) {
    res.status(500).json({
      errors: err,
    });
  }
}
