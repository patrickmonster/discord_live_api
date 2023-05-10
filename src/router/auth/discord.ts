'use strict';
import { Router, Request, Response, NextFunction } from 'express';

const router: Router = Router();

import discord, { invite } from '@middleware/auth/discord';
import { jwtFromRequest } from '@middleware/auth/jwt';

import { cookiNames, cookieOption } from '@util/jwt-create';

import { inviteUser } from '@controller/user-oauth';
import { verify } from '@util/jwt-create';

/**
 * 로그인 성공 처리
 * @param req { Request }
 * @param res { Response }
 */
const next = (req: Request, res: Response) => {
    // 토큰 삽입(클라이언트 측)
    const token = `${req.user}`;

    const { state } = req.query;
    const token_data = verify(token);

    console.log('LOGIN]', req.query, token, token_data);

    // 초대함 - 길드
    if (state == 'discord-invite') {
        const { guild_id, permissions } = req.query;
        console.log(guild_id, permissions, token_data);

        inviteUser(
            (<{ id: string }>token_data).id,
            `${guild_id}`,
            `${permissions}`
        ).catch(console.error);
    }

    res.cookie(cookiNames.token, token, cookieOption).send(`
<script>
window.localStorage.setItem('orefinger.token', '${token}');
window.location.replace('/auth/success');
</script>
   `);
};
// http://localhost:3100/auth/discord
router.get('/', discord, next);

// http://localhost:3100/auth/discord/invite
router.get('/invite', invite, next);

export default router;
