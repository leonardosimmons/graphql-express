import Express from 'express';
import { PermissionLevel } from '../config/enums';

export function minimumPermissionLevelRequired(
  required_permission_level: string,
) {
  return async function (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction,
  ) {
    const user_permission_level = parseInt(
      res.locals.jwt.permissionLevel as string,
    );
    if (user_permission_level >= parseInt(required_permission_level)) {
      return next();
    } else {
      return res.status(403).json({
        message: 'Invalid permssions',
      });
    }
  };
}

// ----------------------------------------------------------------

export async function onlySameUserOrAdmin(
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction,
) {
  const user_permission_level = parseInt(res.locals.jwt.permissionLevel);
  const userId: string = res.locals.jwt.userId;
  if (req.params && req.params.userId && userId === req.params.userId) {
    return next();
  } else {
    if (user_permission_level & PermissionLevel.ADMIN) {
      return next();
    } else {
      return res.status(403).json({
        message: 'Invalid permissions',
      });
    }
  }
}

// ----------------------------------------------------------------

export async function sameUserCantDo(
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction,
) {
  const userId: string = res.locals.jwt.userId;
  if (req.params.userId !== userId) {
    return next();
  } else {
    return res.status(400).json({});
  }
}
