'use strict';
import { createClient } from 'redis';

// redis://:p8450112dc615e1e6314e491889dc9c811e8be7901ff63353029d471460c3e813@ec2-18-204-167-6.compute-1.amazonaws.com:21759
const client = createClient({
    url: process.env.REDIS_URL,
});

client.connect().then(() => {
    console.log('REDIS] client connected');
});

export default client;
