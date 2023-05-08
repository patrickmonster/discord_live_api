'use strict';
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import * as oauth2 from 'passport-oauth2';
import { Strategy as discordStrategy } from 'passport-discord';

import jwt from '@util/jwt-create';
import redis from '@src/model/redis';

import { host } from '@util/env';

const { env } = process;

const discord_options = {
    clientSecret: env.discord_identity_secret || '',
    clientID: env.discord_identity_client || '',
    callbackURL: host + '/auth/discord',
};

console.log('discord', discord_options);

const default_token = async (
    accessToken: string,
    refreshToken: string,
    profile: discordStrategy.Profile,
    done: oauth2.VerifyCallback
) => {
    const { id, provider } = profile;

    // 사용자 정보를 레디스 / DB를 통하여 생성 및 저장
    const token = jwt({
        id,
        type: provider,
        accessToken,
        refreshToken,
    });

    try {
        await redis.set(id, JSON.stringify(profile));
        done(null, { id, token });
    } catch (e) {
        if (e instanceof Error) done(e, false);
        else done(new Error('Connection fall'), false);
    }
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
    })(req, res, next);
}

export const invite = (req: Request, res: Response, next: NextFunction) => {
    //
    return passport.authenticate('discord-invite', {
        session: false,
    })(req, res, next);
};
