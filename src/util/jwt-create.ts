'use strict';
import jwt from 'jsonwebtoken';

import { host } from '@util/env';

// jwt발급 관련 유틸 - 생성 및 비밀키

export type Token = {
    id: string;
    type: string;
    accessToken?: string;
    refreshToken?: string;
};

export const key = 'R7RV1Gwgvt1Q4fpQJ8QpVoKieKbR5s';

// 키 발급
export default function (data: Token) {
    const token = jwt.sign(
        {
            ...data,
            issuer: host.split('//')[1],
        },
        key
    );
    console.log('JWT] 신규생성 -', token);
    return token.split('.').slice(1).join('.');
}
