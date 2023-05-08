'use strict';
import { Router, Request, Response, NextFunction } from 'express';

const router: Router = Router();

import discord, { invite } from '@middleware/auth/discord';

// http://localhost:3100/auth/discord
router.get('/', discord, (req, res) => {
    /*  #swagger.tags = ['auth']
        #swagger.summary = 'Passport for discord'
        #swagger.description = 'Discord 인증 Auth 입니다.'
        #swagger.produces = ['application/json']
        #swagger.responses[200] = {
            description: '디스코드 로그인 성공',
            schema: { $ref : '#/definitions/access-token' }
        }
    */
    res.json(req.user);
});

// http://localhost:3100/auth/discord/invite
router.get('/invite', invite, (req, res) => {
    /*  #swagger.tags = ['auth']
        #swagger.summary = 'Passport for discord'
        #swagger.description = 'Discord 인증 Auth 입니다.'
        #swagger.produces = ['application/json']
        #swagger.responses[200] = {
            description: '디스코드 로그인 성공',
            schema: { $ref : '#/definitions/access-token' }
        }
    */
    res.json(req.user);
});

export default router;
