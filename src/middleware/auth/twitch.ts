'use strict';
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import OAuth2Strategy from 'passport-oauth2';

import { host } from '@util/env';
import TwitchStrategy, { Profile } from '@util/passport-twitch';

const { env } = process;
///////////////////////////////////////////////////////////////////////////
const twitch_options = {
    clientSecret: env.twitch_identity_secret || '',
    clientID: env.twitch_identity_client || '',
    callbackURL: host + '/auth/twitch',
};

const default_token = async (
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: OAuth2Strategy.VerifyCallback
) => {
    done(null, {
        ...profile,
        refreshToken,
    });
};

passport.use(
    'twitch.stream',
    new TwitchStrategy(
        {
            ...twitch_options,
            scope: [
                'moderator:manage:announcements', // 공지 메세지
                'channel:read:subscriptions', // 구독자 목록
                'user:read:email', // 이메일 - 사용자 정보
            ],
        },
        default_token
    )
);

passport.use(
    'twitch',
    new TwitchStrategy(
        {
            ...twitch_options,
            scope: ['channel:read:subscriptions', 'user:read:email'],
        },
        default_token
    )
);

interface PassportOptions extends passport.AuthenticateOptions {
    callbackURL?: string;
}

export default function (
    name: 'twitch' | 'twitch.stream',
    options: PassportOptions
) {
    return function (req: Request, res: Response, next: NextFunction) {
        console.log('PASSPORT]', name, ' 로그인 요청', req.query);

        return passport.authenticate(name, {
            ...options,
            session: false,
        })(req, res, next);
    };
}
