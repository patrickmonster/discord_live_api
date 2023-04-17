'use strict';
import { Request, Response, NextFunction } from 'express';

// 서버 상태 확인 api
export default function (req: Request, res: Response, next: NextFunction) {
    res.sendStatus(200);
}
