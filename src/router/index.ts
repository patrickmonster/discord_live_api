'use strict';
import { Router } from 'express';

import jwt from '@middleware/auth/jwt';

import cookieParser from 'cookie-parser';

import twitch from './twitch';

import interaction from './interaction';
import auth from './auth';
import apiV1 from './v1';

const router: Router = Router();

/**
 * 이벤트 라우터
 */
router.use(
    `/twitch`,
    twitch
    /* 
    #swagger.ignore = true
    */
);

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

/**
 * 이벤트 라우터
 */
router.use(`/interaction`, interaction);

export default router;
