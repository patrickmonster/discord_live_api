'use strict';
import { Router, Request, Response } from 'express';

const router: Router = Router();

import twitch from '@middleware/auth/twitch';
import { loginTwitch } from '@controller/user-oauth';
import { host } from '@util/env';
import { jwtToData, jwtFromRequest } from '@middleware/auth/jwt';
import { Profile as TwitchProfile } from '@util/passport-twitch';

const next = (req: Request, res: Response) => {
    const { user } = req;

    const jwtData = jwtToData(jwtFromRequest(req));

    loginTwitch((<{ id: string }>jwtData).id, <TwitchProfile>user)
        .then(_ => {
            res.redirect(`${host}/auth/success`);
        })
        .catch(e => {
            res.redirect(`${host}/auth/fail`);
        });
};

// http://localhost:3100/auth/twitch/stream
router.get(
    '/',
    twitch('twitch', {
        callbackURL: `${host}/auth/twitch`,
    }),
    next
);

// http://localhost:3100/auth/twitch
router.get(
    '/stream',
    twitch('twitch.stream', {
        callbackURL: `${host}/auth/twitch/stream`,
    }),
    next
);

export default router;
