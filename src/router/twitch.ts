'use strict';
import { Router } from 'express';

import {
    addEvent,
    onlineLive,
    offlineLive,
    registerEvent,
} from '@controller/stream-state';
import { userUpdate } from '@controller/user-oauth';
import est, { SubscriptionType, Event, Subscription } from '@util/EST-router';

const router: Router = Router();

router.use(
    '/event',
    est(
        process.env.SECRET || '',
        (
            type: 'revocation' | 'event' | 'register' | SubscriptionType,
            event: Event,
            sub: Subscription
        ) => {
            try {
                switch (type) {
                    case 'revocation':
                        console.error(event, sub);
                        break;
                    case 'event':
                        addEvent(event, sub).catch(console.error);
                        break;
                    case 'register':
                        registerEvent(sub)
                            .then(() => {
                                console.log('EVENT] register', sub);
                            })
                            .catch(e => {
                                console.error('EVENT] register error', sub, e);
                            });
                        break;
                    case 'user.update':
                        userUpdate(event, 2, 3).catch(e => {
                            console.error('USER.UPDATE]', e);
                        });
                        break;
                    case 'user.authorization.grant':
                        // 사용자 재가입
                        break;
                    case 'user.authorization.revoke':
                        // 사용자 탈퇴
                        break;
                    case 'stream.online':
                        onlineLive(
                            14,
                            `${event.id}`,
                            `${event.broadcaster_user_id}`,
                            `${event.broadcaster_user_login}`,
                            `${event.broadcaster_user_name}`,
                            `${event.started_at}`
                        ).then(isSave => {
                            if (isSave) {
                                //온라인 이벤트(저장됨)
                            } else {
                                // 온라인이 아님
                            }
                        });
                        break;
                    case 'stream.offline':
                        offlineLive(
                            14,
                            `${event.broadcaster_user_id}`,
                            `${event.broadcaster_user_login}`,
                            `${event.broadcaster_user_name}`
                        ).then((isSuccess: boolean) => {
                            // 오프라인 알림 전송
                            // if ( isSuccess)
                        });
                        break;
                    default:
                        break;
                }
            } catch (e) {
                //
            }
        }
    )
);

export default router;
