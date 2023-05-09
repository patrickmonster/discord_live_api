'use strict';
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

import { key as secretOrKey, Token } from '@util/jwt-create';
import createError from 'http-errors';

import {
    ExtractJwt,
    Strategy as JwtStrategy,
    VerifyCallback,
} from 'passport-jwt';

import { host } from '@util/env';

const fromAuthHeaderAsBearerToken = ExtractJwt.fromAuthHeaderAsBearerToken();

const { env } = process;

// Express.User

async function strategy(
    jwt_payload: Token,
    done: (error: any, user?: Express.User | false, info?: any) => void
) {
    done(null, jwt_payload);
}

passport.use(
    'jwt',
    new JwtStrategy(
        {
            // 헤더 삽입
            jwtFromRequest: (req: Request) =>
                `${env.JWT_HEADER}.${fromAuthHeaderAsBearerToken(req)}`,
            secretOrKey,
            issuer: host.split('//')[1],
        },
        strategy
    )
);

export default function (
    fallToLogin?: (req: Request, res: Response, next: NextFunction) => void
) {
    return (req: Request, res: Response, next: NextFunction) => {
        return passport.authenticate(
            'jwt',
            { session: false },
            (error: any, user: Express.User) => {
                console.log('JWT]', error, user);

                if (user) {
                    req.user = user;
                    next();
                } else {
                    if (fallToLogin) {
                        fallToLogin(req, res, next);
                    } else {
                        next(
                            createError(
                                401,
                                'Your token has expired or is missing.'
                            )
                        );
                    }
                }
            }
        )(req, res, next);
    };
}
