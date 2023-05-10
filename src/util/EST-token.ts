import EventEmitter from 'node:events';

import TwitchOAuth2 from './TwitchOAuth2';

import redis from '@model/redis';

import { env } from 'process';

const { twitch_identity_client, twitch_identity_secret } = env;

export const twitchOAuth2 = new TwitchOAuth2(
    `${twitch_identity_client}`,
    `${twitch_identity_secret}`,
    /////////////////////////////////////////////
    'channel:read:subscriptions',
    'user:read:email'
);
