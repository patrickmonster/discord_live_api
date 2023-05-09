'use strict';
import morgan from 'morgan';
import express from 'express';

// swagger 파일 생성
import swaggerAutogen from 'swagger-autogen';

import { config } from 'dotenv';
import { join } from 'path';

const { env } = process;

config({
    path: join(process.env.PWD || __dirname, `/src/env/.env.${env.NODE_ENV}`),
});

// 데이터 베이스 연결
import '@model/connection';

// api document options
import options from '@home/src/type/api-document-type';

// 미들웨어
import pingRouting from '@home/src/middleware/ping';
import robotsRouting from '@home/src/middleware/robots';
import errorRouting from '@home/src/middleware/error-routing';
import errorHandlers from '@home/src/middleware/error-handlers';

// router
import api from '@home/src/router';
import { host } from '@util/env';

// redis server connection
import '@src/model/redis';

// swagger
import swaggerUi from 'swagger-ui-express';

const { version } = require(`${process.env.PWD}/package.json`);

// 포트 설정이 없는 경우, 기본 포트 지정
if (!process.env.PORT) process.env.PORT = '3000';

console.clear();
console.log(`
██████╗ ██╗███████╗ ██████╗ ██████╗ ██████╗ ██████╗ 
██╔══██╗██║██╔════╝██╔════╝██╔═══██╗██╔══██╗██╔══██╗
██║  ██║██║███████╗██║     ██║   ██║██████╔╝██║  ██║
██║  ██║██║╚════██║██║     ██║   ██║██╔══██╗██║  ██║
██████╔╝██║███████║╚██████╗╚██████╔╝██║  ██║██████╔╝
╚═════╝ ╚═╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝ 
██╗     ██╗██╗   ██╗███████╗     █████╗ ██████╗ ██╗ 
██║     ██║██║   ██║██╔════╝    ██╔══██╗██╔══██╗██║ 
██║     ██║██║   ██║█████╗      ███████║██████╔╝██║ 
██║     ██║╚██╗ ██╔╝██╔══╝      ██╔══██║██╔═══╝ ██║ 
███████╗██║ ╚████╔╝ ███████╗    ██║  ██║██║     ██║ 
╚══════╝╚═╝  ╚═══╝  ╚══════╝    ╚═╝  ╚═╝╚═╝     ╚═╝ 
                                            var.${version}
`);

console.log('Server Mode ==== ', process.env.NODE_ENV);

//////////////////////////////////////////////////////////////////////////////////
// 라우팅 정의
const app = express();

// 우선 처리
app.get('/ping', pingRouting); // 핑처리
app.get('/robots.txt', robotsRouting); // 로봇
console.log('====================================');
console.log(`Ping] - ${host}/ping`);
console.log(`Robots] - ${host}/robots.txt`);
console.log(`API Documentation] - ${host}/api-docs`);
console.log('====================================');

// 로그 미들웨어
app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms')
);

app.use(api);

////////////////////////////////////////////////////////////////////////////////////////////////
const target_dirs = [
    `${process.env.PWD}/src/router/*.ts`,
    `${process.env.PWD}/src/type/*.ts`,
];

swaggerAutogen({ openapi: '3.0.0', language: 'ko' })(
    `${process.env.PWD}/api.json`, // api 파일
    target_dirs,
    options
).finally(() => {
    // swagger - api doces
    app.use(
        '/api-docs',
        swaggerUi.serve,
        swaggerUi.setup(require(`${process.env.PWD}/api.json`), {
            explorer: true,
        })
    );

    app.use(errorRouting);
    app.use(errorHandlers);

    app.listen(process.env.PORT, () => {
        console.log(`
################################################
🛡️  Server listening on port: ${process.env.PORT} 🛡️
################################################
    `);
        // 스웨거 빌더
    });
});

// 프로세서 예외처리 오류
process.on('unhandledRejection', error => {
    console.error('unhandledRejection]', error);
});
