'use strict';
import { Router, Request, Response } from 'express';

import jwt from '@middleware/auth/jwt';

import auth from './auth';
import apiV1 from './v1';

const router: Router = Router();

/**
 * API 매인 라우팅 지정
 */
router.use(`/auth`, auth);

// V1
router.use(
    `/api/v1`,
    jwt,
    apiV1
    /*
        #swagger.security = [{
            "bearerAuth": []
        }]
    */
);

export default router;
