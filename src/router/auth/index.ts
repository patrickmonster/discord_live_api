import { Router, Request, Response } from 'express';

import kako from './kako';

const router: Router = Router();

/**
 * API 매인 라우팅 지정
 */

router.use(
    `/kakao`,
    kako
    /* 
    #swagger.security = [{
        "apiKeyAuth": []
    }]
    */
);

export default router;
