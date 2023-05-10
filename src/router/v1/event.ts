import { Router, Request, Response } from 'express';

import { getUserToken } from '@controller/user-oauth';
import { Token } from '@util/jwt-create';
import errorRouting from '@middleware/error-routing';

import { twitchOAuth2 } from '@util/EST-token';

const router: Router = Router();

/**
 * 이벤트 조회
 */
router.get(`/`, async (req, res, next) => {
    /*  #swagger.tags = ['auth']
        #swagger.summary = 'User token'
        #swagger.description = '현재 로그인된 사용자의 정보를 확인합니다.'
        #swagger.produces = ['application/json']
        #swagger.responses[200] = {
            description: '사용자 정보 조회',
            schema: { $ref : '#/definitions/access-user' }
        }
     */

    if (!req.user) return errorRouting(req, res, next);

    const user: Token = req.user;

    getUserToken(user.id, 2).then(users => {
        if (!users.length) {
            return res.json({
                status: 404,
                message: '가입된 정보가 없음',
            });
        }

        const { user_id } = users[0];

        twitchOAuth2.getClient(
            `eventsub/subscriptions?user_id=${user_id}`,
            (err, body, r) => {
                if (err) {
                    res.json({
                        status: 401,
                        message: '오류발생',
                    });
                    console.error(err);
                } else
                    res.json({
                        user: users[0],
                        body,
                    });
            }
        );
    });
});

/**
 * 이벤트 등록
 */
router.get(`/:type`, async (req, res) => {
    /*  #swagger.tags = ['auth']
        #swagger.summary = 'User token'
        #swagger.description = '현재 로그인된 사용자의 정보를 확인합니다.'
        #swagger.produces = ['application/json']
        #swagger.responses[200] = {
            description: '사용자 정보 조회',
            schema: { $ref : '#/definitions/access-user' }
        }
     */
    const { user } = req;

    // twitchOAuth2.getClient(
    //     'eventsub/subscriptions?user_id=',
    //     {
    //         version: '1',
    //         transport: {
    //             method: 'webhook',
    //             callback: `${env.HOST}/twitch/event`,
    //             secret: env.SECRET,
    //         },
    //     },
    //     (err, body, res) => {}
    // );
});

export default router;
