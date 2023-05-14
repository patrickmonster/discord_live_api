'use strict';
import { Router, Request, Response, NextFunction } from 'express';

import discord from './discord';
import twitch from './twitch';
import cookieParser from 'cookie-parser';

const router: Router = Router();

import jwt from '@middleware/auth/jwt';
import { cookieOption, cookiNames } from '@util/jwt-create';

router.use(cookieParser(process.env.KEY));

// 중복 작업 처리용 미들웨어
router.use((req: Request, res: Response, next: NextFunction) => {
    if (cookiNames.token in req.signedCookies) {
        req.headers.authorization = `Bearer ${
            req.signedCookies[cookiNames.token]
        }`;
    }
    next();
});

router.use('/success', (req: Request, res: Response, next: NextFunction) => {
    if (cookiNames.redirect in req.signedCookies) {
        const nextUrl = req.signedCookies[cookiNames.redirect];
        res.clearCookie(cookiNames.redirect).redirect(nextUrl);
        console.log('AUTH] success ', nextUrl);
    } else {
        res.send(`<script>
window.addEventListener('load', () => {
    alert('로그인 성공! 매인화면으로 이동합니다...');
    window.location.replace('/')
});
</script>`);
    }
});
router.use('/fail', (req: Request, res: Response, next: NextFunction) => {
    res.send(`<script>
window.addEventListener('load', () => {
    alert('로그인 실패! 다시 시도해주세요...');
    window.location.replace('/')
});
</script>
    `);
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
    jwt((req: Request, res: Response) => {
        res.redirect(`/auth/discord?redirect=${req.baseUrl}`);
    }),
    twitch
);

export default router;
