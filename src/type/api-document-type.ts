'use strict';

import httpStatus from '@home/src/type/http-status';
import jwtStatus from '@home/src/type/jwt';
import { name, description } from '../../package.json';

import { host } from '@util/env';

export default {
    info: { title: name, description },
    servers: [{ url: host, description: 'api test' }],
    schemes: ['http'],
    components: {
        // 타입 사전정의
        '@schemas': {
            ...httpStatus,
            ...jwtStatus,
        }, // http 응답 타입
    },
    securityDefinitions: {
        bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            in: 'header',
            bearerFormat: 'JWT',
        },
    },
};
