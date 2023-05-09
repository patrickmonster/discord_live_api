'use strict';
import { Router, Request, Response, NextFunction } from 'express';

const router: Router = Router();

import discord, { invite } from '@middleware/auth/discord';

import { cookiNames, cookieOption } from '@util/jwt-create';

/**
 * 로그인 성공 처리
 * @param req { Request }
 * @param res { Response }
 */
const next = (req: Request, res: Response) => {
    // 토큰 삽입(클라이언트 측)
    res.cookie(cookiNames.token, req.user, cookieOption).send(`
<script>
window.localStorage.setItem('orefinger.token', '${req.user}');
window.location.replace('/auth/success');
</script>
   `);
};

// http://localhost:3100/auth/discord
router.get('/', discord, next);

// http://localhost:3100/auth/discord/invite
router.get('/invite', invite, next);

export default router;
