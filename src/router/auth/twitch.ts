'use strict';
import { Router } from 'express';

const router: Router = Router();

import twitch from '@middleware/auth/twitch';
import { host } from '@util/env';

// http://localhost:3100/auth/twitch/stream
router.get(
    '/',
    twitch('twitch', {
        callbackURL: `${host}/auth/twitch`,
    }),
    (req, res) => {
        res.json(req.user);
    }
);

// http://localhost:3100/auth/twitch
router.get(
    '/stream',
    twitch('twitch.stream', {
        callbackURL: `${host}/auth/twitch/stream`,
    })
);

export default router;
