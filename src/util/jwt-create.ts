'use strict';
import jwt from 'jsonwebtoken';

import { host } from '@util/env';

// jwt발급 관련 유틸 - 생성 및 비밀키

export interface Token {
    id: string;
    nickname: string;
    type: string;
    refreshToken?: string;
}

declare global {
    namespace Express {
        // tslint:disable-next-line:no-empty-interface
        interface AuthInfo {}
        // tslint:disable-next-line:no-empty-interface
        interface User extends Token {}
    }
}

export const key = process.env.KEY;

export const cookiNames = {
    token: 'orefinger.token',
    redirect: 'orefinger.redirect',
};

export const cookieOption = { httpOnly: true, secure: true, signed: true };

// 키 발급
export default function (data: Token) {
    const token = jwt.sign(
        {
            ...data,
            iss: host.split('//')[1], // 발급자
        },
        key || ''
    );
    console.log('JWT] 신규생성 -', token);
    return token.split('.').slice(1).join('.');
}
