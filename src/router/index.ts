'use strict';
import { Router, Request, Response } from 'express';

import jwt from '@middleware/auth/jwt';

import auth from './auth';
import apiV1 from './v1';

import cookieParser from 'cookie-parser';
import { cookieOption, cookiNames } from '@util/jwt-create';

const router: Router = Router();

/**
 * API 매인 라우팅 지정
 */
router.use(
    `/auth`,
    auth
    /* 
    #swagger.ignore = true
    */
);

router.use(cookieParser(process.env.KEY));
// V1
router.use(
    `/api/v1`,
    jwt(),
    apiV1
    /*
        #swagger.security = [{
            "bearerAuth": []
        }]
    */
);

export default router;
