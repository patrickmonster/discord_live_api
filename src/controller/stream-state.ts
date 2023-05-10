'use strict';
import getConnection, { QUERY } from '@model/connection';

import est, { Event, Subscription } from '@util/EST-router';

// event: Event,
// sub: Subscription
export const addEvent = async (event: Event, sub: Subscription) => {
    const { client_id, user_id, broadcaster_user_id } = sub.condition;
    return await QUERY(
        ` select func_event(?, ?, ?, ?) as type_idx `,
        sub.type,
        broadcaster_user_id || user_id || client_id,
        sub.id,
        JSON.stringify(event)
    );
};

/**
 * 온라인
 */
export const onlineLive = async (
    type: 14,
    id: string,
    broadcaster_user_id: string,
    broadcaster_user_login: string,
    broadcaster_user_name: string,
    started_at: string
): Promise<boolean> => {
    //
    return QUERY(
        `
insert into event_online (event_id, \`type\`, auth_id, create_at, title, game_id)
select ? as event_id
    , ? as \`type\`
    , user_id as auth_id
    , ? as create_at
    , JSON_UNQUOTE(json_extract(ei.\`data\`, '$.title')) as title
    , JSON_UNQUOTE(json_extract(ei.\`data\`, '$.category_id')) as game_id
from event_id ei
where \`type\` = 16
and user_id = ?
and \`data\` is not null
    `,
        id,
        type,
        started_at,
        broadcaster_user_id
    )
        .then(() => {
            console.log(
                `온라인 - ${broadcaster_user_name}(${broadcaster_user_login})`
            );
            return true;
        })
        .catch(e => {
            return false;
        });
};

/**
 * 온라인
 */
export const offlineLive = async (
    type: 14,
    broadcaster_user_id: string,
    broadcaster_user_login: string,
    broadcaster_user_name: string
): Promise<boolean> =>
    getConnection(async QUERY => {
        //
        try {
            await QUERY(
                `
UPDATE discord.event_online a, (
    select event_id, el.type
    from event_live el 
    where el.auth_id = ? and el.type = 14
) b
SET end_at=CURRENT_TIMESTAMP
WHERE a.type = b.type
and a.event_id = b.event_id
            `,
                broadcaster_user_id
            );

            await QUERY(
                `DELETE FROM discord.event_live WHERE \`type\`=? AND event_id= ?`,
                type,
                broadcaster_user_id
            );

            const list = await QUERY(
                `select * from event_channel ec where 1=1 and ec.type = ? and user_id = ? and delete_yn = 'N'`,
                type,
                broadcaster_user_id
            );
            if (list.length) {
                return true;
            }
        } catch (e) {
            return false;
        } finally {
            console.info(
                `오프라인 - ${broadcaster_user_name}(${broadcaster_user_login})`
            );
        }

        return false;
    });

export const registerEvent = async (event: Subscription) => {
    const { type, id, condition } = event;
    //
    return await QUERY(
        `
INSERT INTO discord.event_id
(\`type\`, user_id, token, \`data\`)
VALUES((select idx from types t  where t.key = 3 and value = ?), ?, ?, '{}')
on duplicate key update update_at = CURRENT_TIMESTAMP, use_yn = 'Y', token = ? -- 이벤트 업데이트 (재등록)
    `,
        type,
        condition.broadcaster_user_id ||
            condition.user_id ||
            condition.client_id,
        id,
        id
    );
};
