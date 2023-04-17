'use strict';
import dotenv from 'dotenv';
import path from 'path';
import morgan from 'morgan';
import express from 'express';

// swagger 파일 생성
import swaggerAutogen from 'swagger-autogen';

// 데이터 베이스 연결
import '@home/src/model/connection';

// 미들웨어
import pingRouting from '@home/src/middleware/ping';
import robotsRouting from '@home/src/middleware/robots';
import errorRouting from '@home/src/middleware/error-routing';
import errorHandlers from '@home/src/middleware/error-handlers';

import httpStatus from '@home/src/type/http-status';

// router
import api from '@home/src/router';

// swagger
import swaggerUi from 'swagger-ui-express';
import swaggerFile from '../api.json';
import { name, version, description } from '../package.json';

// 환경변수 설정
// const result = dotenv.config({ path: path.join(__dirname, '..', '.env') });
// if (result.parsed == undefined)
//     throw new Error('Cannot loaded environment variables file.');
// development production

// 포트 설정이 없는 경우, 기본 포트 지정
if (!process.env.PORT) process.env.PORT = '3000';

console.clear();
console.log(`
██████╗ ██████╗  ██████╗ ███╗   ███╗██╗███████╗███████╗
██╔══██╗██╔══██╗██╔═══██╗████╗ ████║██║██╔════╝██╔════╝
██████╔╝██████╔╝██║   ██║██╔████╔██║██║███████╗█████╗  
██╔═══╝ ██╔══██╗██║   ██║██║╚██╔╝██║██║╚════██║██╔══╝  
██║     ██║  ██║╚██████╔╝██║ ╚═╝ ██║██║███████║███████╗
╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚═╝╚══════╝╚══════╝
                                                       
██████╗  █████╗  ██████╗██╗  ██╗                       
██╔══██╗██╔══██╗██╔════╝██║ ██╔╝                       
██████╔╝███████║██║     █████╔╝                        
██╔══██╗██╔══██║██║     ██╔═██╗                        
██████╔╝██║  ██║╚██████╗██║  ██╗                       
╚═════╝ ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝        var.${version}
`);

console.log('Server Mode ==== ', process.env.NODE_ENV);

console.log(httpStatus);

/**
 * swagger 설정 파일
 */
const options = {
    info: { title: name, description },
    servers: [
        { url: 'http://localhost:3000', description: 'local api test' },
        {
            url: 'https://warm-scrubland-63377.herokuapp.com/',
            description: 'dev api test',
        },
    ],
    schemes: ['http'],
    components: {
        // 타입 사전정의
        '@schemas': {
            ...httpStatus,
        }, // http 응답 타입
    },
    securityDefinitions: {
        bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            in: 'header',
            bearerFormat: 'JWT',
        },
    },
};

//////////////////////////////////////////////////////////////////////////////////
// 라우팅 정의
const app = express();

// 우선 처리
app.get('/ping', pingRouting); // 핑처리
app.get('/robots.txt', robotsRouting); // 로봇
// swagger - api doces
app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerFile, { explorer: true })
);
console.log('====================================');
console.log('Ping] - http://localhost:3000/ping');
console.log('Robots] - http://localhost:3000/robots.txt');
console.log('API Documentation] - http://localhost:3000/api-docs');
console.log('====================================');

// 로그 미들웨어
app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms')
);

app.use(api);

////////////////////////////////////////////////////////////////////////////////////////////////
// catch 404 and forward to error handler
// 에러처리
app.use(errorRouting);
app.use(errorHandlers);

app.listen(process.env.PORT, () => {
    console.log(`
################################################
🛡️  Server listening on port: ${process.env.PORT} 🛡️
################################################
    `);
    // 스웨거 빌더
    swaggerAutogen({ openapi: '3.0.0', language: 'ko' })(
        `${__dirname}/../api.json`, // api 파일
        [/*'./app.ts', */ `${__dirname}/router/*.ts`, `${__dirname}/type/*.ts`], // 탐색영역
        options
    );
});

// 프로세서 예외처리 오류
process.on('unhandledRejection', error => {
    console.error('unhandledRejection]', error);
});
