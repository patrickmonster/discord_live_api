'use strict';
import { createClient } from 'redis';

const client = createClient({
    url: process.env.REDIS_URL,
});

client.connect().then(() => {
    console.log('REDIS] client connected');
});

export default client;
