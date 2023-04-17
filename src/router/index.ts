import { Router, Request, Response } from 'express';

import kako from './auth/kako';

const router: Router = Router();

/**
 * API 매인 라우팅 지정
 */

router.use(
    `/api/auth/kakao`,
    kako
    /* 
    #swagger.security = [{
        "apiKeyAuth": []
    }]
    */
);

export default router;
