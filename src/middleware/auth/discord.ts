'use strict';
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import * as oauth2 from 'passport-oauth2';
import { Strategy as discordStrategy } from 'passport-discord';

import { host } from '@util/env';

import { loginDiscord } from '@home/src/controller/user-oauth';

const { env } = process;

const discord_options = {
    clientSecret: env.discord_identity_secret || '',
    clientID: env.discord_identity_client || '',
    callbackURL: host + '/auth/discord',
};

const default_token = async (
    accessToken: string,
    refreshToken: string,
    profile: discordStrategy.Profile,
    done: oauth2.VerifyCallback
) => {
    loginDiscord(profile, refreshToken)
        .then(token => done(null, token))
        .catch(e => done(e));
    // TODO:redis를 통한 토큰 관리
    // redis.set(profile.id, accessToken, {
    //     EX: 60 * 60 * 24 * 30,
    // });
};

passport.use(
    'discord',
    new discordStrategy(
        {
            ...discord_options,
            scope: ['identify', 'email'],
        },
        default_token
    )
);

passport.use(
    'discord-invite',
    new discordStrategy(
        {
            ...discord_options,
            scope: [
                'identify',
                'email',
                'bot',
                'applications.commands',
                'guilds',
                'guilds.members.read',
            ],
        },
        default_token
    )
);

export default function (req: Request, res: Response, next: NextFunction) {
    //
    return passport.authenticate('discord', {
        session: false,
        state: 'discord',
    })(req, res, next);
}

export const invite = (req: Request, res: Response, next: NextFunction) => {
    //
    return passport.authenticate('discord-invite', {
        session: false,
        state: 'discord-invite',
    })(req, res, next);
};
