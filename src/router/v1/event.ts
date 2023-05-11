import { Router, Request, Response } from 'express';

import { getUserToken } from '@controller/user-oauth';
import errorRouting from '@middleware/error-routing';

import { twitchOAuth2 } from '@util/EST-token';

const router: Router = Router();

router.get('/user/:idx', async (req, res, next) => {
    /*  #swagger.tags = ['Eventsub']
        #swagger.summary = 'User event list'
        #swagger.description = '로그인된 사용자의 구독중인 이벤트 리스트를 불러옵니다.'
        #swagger.produces = ['application/json']
        #swagger.responses[200] = {
            description: '사용자 정보 조회',
            schema: { $ref : '#/definitions/access-user' }
        }
     */

    if (!req.user) return errorRouting(req, res, next);

    const { user } = req;
    console.log(user);

    getUserToken((<{ id: string }>user).id, 2)
        .then(users => {
            if (!users.length) {
                return res.json({
                    status: 404,
                    message: '가입된 정보가 없음',
                });
            }

            console.log(users);

            const { user_id } =
                users[Number(req.params.idx ? req.params.idx : 0)];

            twitchOAuth2.getClient(
                `eventsub/subscriptions?user_id=${user_id}`,
                (err, events, r) => {
                    if (err) {
                        res.json({
                            status: 401,
                            message: '오류발생',
                        });
                        console.error(err);
                    } else {
                        res.json({
                            user: users[0],
                            events,
                        });
                    }
                }
            );
        })
        .catch(e => {
            console.error(e);
            res.json({
                status: 401,
                message: '오류발생',
            });
        });
});

export default router;
