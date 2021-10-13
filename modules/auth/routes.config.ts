import Express from 'express';
import * as VerifyUserMiddleware from './middleware/verify.user.middleware';
import * as AuthorizationController from './controllers/auth.controller';

const router = Express.Router();

router.post('/', [
  VerifyUserMiddleware.hasAuthValidFields,
  VerifyUserMiddleware.verifyUser,
  AuthorizationController.login,
]);

export default router;
