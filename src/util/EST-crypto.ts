import crypto from 'crypto';
import { Request, Response } from 'express';
import { IncomingHttpHeaders } from 'http';

export const twitchEventSub = (
    secret: string,
    headers: IncomingHttpHeaders,
    body: any
) => {
    if (Buffer.isBuffer(body)) body = JSON.parse(body.toString());
    else if (typeof body === 'string')
        body = JSON.parse(decodeURIComponent(body));
    //////////////////////////////////////////////////////////////////////
    if (!headers.hasOwnProperty('twitch-eventsub-message-signature'))
        return false;

    const id = headers['twitch-eventsub-message-id'] + '';
    const timestamp = headers['twitch-eventsub-message-timestamp'] + '';
    const [hash, secret_value] =
        `${headers['twitch-eventsub-message-signature']}`.split('=');
    const buf = Buffer.from(body);
    const calculated_singnature = crypto
        .createHmac(hash, secret)
        .update(id + timestamp + buf)
        .digest('hex');

    return calculated_singnature == secret_value;
};
