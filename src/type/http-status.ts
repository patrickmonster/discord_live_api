'use strict';

// 오류 타입 정의
export type responseType = {
    status: number;
    message: string;
};

export default {
    status404: {
        status: 404,
        message: 'Not Found',
    },
};
