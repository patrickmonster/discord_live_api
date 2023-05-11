'use strict';
import express, { Router, Request, Response } from 'express';
import { InteractionType, InteractionResponseType } from 'discord-interactions';

import { verifyKey } from 'discord-interactions';
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
router.get(`/`, (req, res) => {
    /*  #swagger.tags = ['interaction']
        #swagger.summary = 'Discord app'
        #swagger.description = '앱 동작 코드 입니다.'
        #swagger.produces = ['application/json']
        #swagger.responses[200] = {
            description: 'Pong',
        }
     */
    const { type, data } = req.body;

    if (type === InteractionType.PING)
        return res.send({ type: InteractionResponseType.PONG });

    if (type === InteractionType.APPLICATION_COMMAND) {
        if ((data.name = 'test')) {
            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: { content: 'TEST message' },
            });
        }
    }
});

export default router;
