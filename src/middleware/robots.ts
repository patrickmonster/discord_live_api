'use strict';
import { Request, Response, NextFunction } from 'express';

// 구글 로봇 - 자동탐색
export default function (req: Request, res: Response, next: NextFunction) {
    res.send(`User-agent: * \nDisallow: /\nAllow : /$ `);
}
