import { Router, Request, Response } from 'express';

import auth from './auth/index';

const router: Router = Router();

/**
 * API 매인 라우팅 지정
 */

router.use(`/api/auth`, auth);

export default router;
