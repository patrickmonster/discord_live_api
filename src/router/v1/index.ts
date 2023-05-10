import { Router, Request, Response, NextFunction } from 'express';

import token from './token';
import event from './event';

const router: Router = Router();

//////////////////////////////////////////////////////
router.use(`/token`, token);
router.use(`/event`, event);

//////////////////////////////////////////////////////

export default router;
