import Express from 'express';
import { consoleText } from '../lib/definitions';
import { HttpError } from '../lib/types';

const router = Express.Router();

router.use(
  '/favicon.ico',
  (_: Express.Request, res: Express.Response): void => {
    res.status(204);
  },
);

router.use((error: HttpError, _: Express.Request, res: Express.Response) => {
  const status: number = error.statusCode!;
  const message: string = error.message;
  const log: string | undefined = error.log;

  console.log(
    consoleText.red,
    `[error] ${error.log ? error.log : error.message}`,
  );

  if (log) {
    res.status(status).json({
      message: message,
      log: log,
    });
  } else {
    res.status(status).json({
      message: message,
    });
  }
});

export default router;
