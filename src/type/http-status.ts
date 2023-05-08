'use strict';

// 오류 타입 정의
export type responseType = {
    status: number;
    message: string;
};

export default {
    status404: {
        type: 'object',
        properties: {
            status: {
                type: 'number',
                format: 'int32',
            },
            message: {
                type: 'string',
            },
        },
    },
};
