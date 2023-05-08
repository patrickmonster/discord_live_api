import { Router, Request, Response } from 'express';

const router: Router = Router();

/**
 * API 매인 라우팅 지정
 */
router.get(`/`, (req, res) => {
    /*  #swagger.tags = ['auth']
        #swagger.summary = 'User profile'
        #swagger.description = '현재 로그인된 사용자의 정보를 확인합니다.'
        #swagger.produces = ['application/json']
        #swagger.responses[200] = {
            description: '사용자 정보 조회',
            schema: { $ref : '#/definitions/access-user' }
        }
    */
    res.json(req.user);
});

export default router;
