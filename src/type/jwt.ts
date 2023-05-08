'use strict';
/**
 * 타입형을 지정하는 파일
 */

export default {
    'access-token': {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                format: 'string',
                description: 'user id',
            },
            token: {
                type: 'string',
                format: 'string',
                description: 'user access token',
            },
        },
    },
    'access-user': {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                format: 'string',
                description: 'user id',
            },
            provider: {
                type: 'string',
                format: 'string',
                description: 'user OAuth provider type',
            },
        },
    },
};
