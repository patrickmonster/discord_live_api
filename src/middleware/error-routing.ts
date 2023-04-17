'use strict';
import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';

//에러 발생
export default function (req: Request, res: Response, next: NextFunction) {
    next(createError(404));
}
