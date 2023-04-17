'use strict';

import { getQuery, ResultDataPacket } from '@src/model/connection';

export type r_selectUserByType = string[];
interface t_selectUserByType extends ResultDataPacket {
    user_id: string;
}
/**
 * 스트리머 종류별로, 사용자를 불러 옵니다.
 */
export const selectUserByType = (user_type = 37): Promise<r_selectUserByType> =>
    getQuery<t_selectUserByType[]>(
        `
select user_id
from auth_token at2
WHERE at2.type in (2,3)
and user_type = ?
GROUP by user_id 
    `,
        user_type
    ).then(
        (value: t_selectUserByType[]): r_selectUserByType =>
            value.map((user: t_selectUserByType) => user.user_id)
    );
