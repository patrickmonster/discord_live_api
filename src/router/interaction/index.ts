'use strict';
import express, { Router, Request, Response } from 'express';
import {
    InteractionType,
    InteractionResponseType,
    verifyKey,
} from 'discord-interactions';

import { env } from 'process';

const router: Router = Router();

router.use(
    express.json({
        verify: (
            req: Request,
            res: Response,
            buf: Uint8Array | ArrayBuffer | Buffer | string
        ) => {
            const signature = req.get('X-Signature-Ed25519');
            const timestamp = req.get('X-Signature-Timestamp');

            const isValidRequest = verifyKey(
                buf,
                `${signature}`,
                `${timestamp}`,
                `${env.PUBLIC_KEY}`
            );
            if (!isValidRequest) {
                res.status(401).send('Bad request signature');
                throw new Error('Bad request signature');
            }
        },
    })
);
/**
 * PING
 */
router.post(`/`, async (req, res) => {
    /*  #swagger.tags = ['interaction']
        #swagger.summary = 'Discord app'
        #swagger.description = '앱 동작 코드 입니다.'
        #swagger.produces = ['application/json']
        #swagger.responses[200] = {
            description: 'Pong',
        }
     */

    const { type, data } = req.body;

    switch (type) {
        case InteractionType.PING:
            res.send({ type: InteractionResponseType.PONG });
            break;
        case InteractionType.APPLICATION_COMMAND:
            break;
        case InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE:
            break;
        case InteractionType.MESSAGE_COMPONENT:
            break;
        case InteractionType.MODAL_SUBMIT:
            break;
    }
});

export default router;
