'use strict';
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

import { key as secretOrKey } from '@util/jwt-create';
import createError from 'http-errors';

import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';

import redis from '@src/model/redis';
import { host } from '@util/env';

const fromAuthHeaderAsBearerToken = ExtractJwt.fromAuthHeaderAsBearerToken();

const { env } = process;

passport.use(
    new JwtStrategy(
        {
            // 헤더 삽입
            jwtFromRequest: (req: Request) =>
                `${env.JWT_HEADER}.${fromAuthHeaderAsBearerToken(req)}`,
            secretOrKey,
            issuer: host.split('//')[1],
        },
        async (jwt_payload, done) => {
            const { id } = jwt_payload;
            const user = JSON.parse((await redis.get(id)) || '{}');
            done(null, user);
        }
    )
);

export default function (req: Request, res: Response, next: NextFunction) {
    return passport.authenticate(
        'jwt',
        { session: false },
        (error: any, user: Express.User) => {
            if (user) {
                req.user = user;
                next();
            } else
                next(createError(401, 'Your token has expired or is missing.'));
        }
    )(req, res, next);
}
