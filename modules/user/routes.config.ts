import Express from 'express';
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  patchUser,
} from './controllers/user.controller';

const router = Express.Router();

router.post('/create-user', createUser);

router.get('/users', getUsers);

router.get('/:userId', getUserById);

router.put('/:userId', patchUser);

router.delete('/:userId', deleteUser);

export default router;
