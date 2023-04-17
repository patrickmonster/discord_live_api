'use strict';
/**
 * 타입형을 지정하는 파일
 */

/*
    #swagger.deprecated = true
    #swagger.types[Token] = {
        user_id : <string>,

    }
 */
export type Token = {
    user_id: string;
    type: string;
    token: string;
    expire_date: string;
};
