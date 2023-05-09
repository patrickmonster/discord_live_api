import { Router, Request, Response, NextFunction } from 'express';

import user from './user';

const router: Router = Router();
import jwt from '@middleware/auth/jwt';

//////////////////////////////////////////////////////
router.use(`/user`, user);

//////////////////////////////////////////////////////

export default router;
