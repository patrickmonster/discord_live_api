import { Router, Request, Response } from 'express';

import discord from './discord';

const router: Router = Router();

/**
 * API 매인 라우팅 지정
 */
router.use(
    `/discord`,
    discord
    /* 
    #swagger.ignore = false
    */
);

export default router;
