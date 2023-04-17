'use strict';
import { Router, Request, Response, NextFunction } from 'express';

const router: Router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    /*  #swagger.tags = ['auth', 'passport', 'kakao']
        #swagger.summary = '요청시, kakao 로그인 페이지로 이동'
        #swagger.description = '카카오 로그인 url을 발급합니다.'
        #swagger.produces = ['application/json']
        #swagger.responses[200] = {
            description: '카카오 로그인 성공',
            schema: {
                name: 'Jhon Doe',
                age: 29,
                about: ''
            }
        }
        #swagger.responses[400] = {
            description: '카카오 로그인 실패',
            schema: {
                type:'string'
            }
        }
    */
    const { code } = req.query;

    if (code) {
        // 인증완료
        console.log(code);
    }
    res.send(code);
});

router.post('/', (req: Request, res: Response, next: NextFunction) => {
    /* #swagger.tags = ['auth', 'passport', 'kakao']
        #swagger.deprecated = true 
     */
    res.sendStatus(200);
});

export default router;
