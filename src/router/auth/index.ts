'use strict';
import { Router, Request, Response, NextFunction } from 'express';

import discord from './discord';
import twitch from './twitch';
import cookieParser from 'cookie-parser';

const router: Router = Router();

import jwt from '@middleware/auth/jwt';
import { cookieOption, cookiNames } from '@util/jwt-create';

router.use(cookieParser(process.env.KEY));

router.use((req: Request, res: Response, next: NextFunction) => {
    if (cookiNames.token in req.signedCookies) {
        req.headers.authorization = `Bearer ${
            req.signedCookies[cookiNames.token]
        }`;
    }
    next();
});

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('?');
});

router.use('/success', (req: Request, res: Response, next: NextFunction) => {
    if (cookiNames.redirect in req.signedCookies) {
        const nextUrl = req.signedCookies[cookiNames.redirect];
        res.clearCookie(cookiNames.redirect).redirect(nextUrl);
        console.log('AUTH] success ', nextUrl);
    } else {
        res.send(`
<script type="text/javascript >
alert('로그인 성공! 매인화면으로 이동합니다...');
localtion.replace('/');
</script>
       `);
    }
});

/**
 * API 매인 라우팅 지정
 */
router.use(
    `/discord`,
    (req: Request, res: Response, next: NextFunction) => {
        // 요청에 리다이렉션 요청이 있는경우
        const { redirect } = req.query;
        if (redirect) {
            res.cookie(cookiNames.redirect, redirect, cookieOption).redirect(
                '/auth/discord'
            );
        } else next();
    },
    discord
);

router.use(
    `/twitch`,
    jwt((req: Request, res: Response, next: NextFunction) => {
        // 요청에 토큰이 없는 경우
        console.log('req.signedCookies', req.signedCookies);

        res.redirect(`/auth/discord?redirect=${req.baseUrl}`);
    }),
    twitch
);

export default router;
