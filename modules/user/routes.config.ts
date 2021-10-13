import Express from 'express';
import * as UserController from './controllers/user.controller';
import * as PermissionMiddleware from '../common/middlewares/auth.permissions';
import * as ValidationMiddleware from '../common/middlewares/auth.validation';

const USER: string = process.env.USER as string;
const PAID: string = process.env.PAID as string;
const ADMIN: string = process.env.ADMIN as string;

const router = Express.Router();

router.post('/create-user', UserController.createUser);

router.get('/users', [
  ValidationMiddleware.validJWTNeeded,
  PermissionMiddleware.minimumPermissionLevelRequired(USER),
  UserController.getUsers,
]);

router.get('/:userId', [
  ValidationMiddleware.validJWTNeeded,
  PermissionMiddleware.minimumPermissionLevelRequired(USER),
  PermissionMiddleware.onlySameUserOrAdmin,
  UserController.getUserById,
]);

router.patch('/:userId', [
  ValidationMiddleware.validJWTNeeded,
  PermissionMiddleware.minimumPermissionLevelRequired(USER),
  PermissionMiddleware.onlySameUserOrAdmin,
  UserController.patchUser,
]);

router.delete('/:userId', [
  ValidationMiddleware.validJWTNeeded,
  PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
  UserController.deleteUser,
]);

export default router;
