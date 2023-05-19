'use strict';
import { OAuth2, dataCallback } from 'oauth';
import redis from '@model/redis';

import ConvertBody from '@util/ConvertBody';

class TwitchOAuth2 extends OAuth2 {
    protected _scope: string[];
    constructor(id: string, secret: string, ...scope: string[]) {
        super(
            id,
            secret,
            '',
            `https://id.twitch.tv/oauth2/authorize`,
            `https://id.twitch.tv/oauth2/token`,
            undefined
        );
        this._scope = scope;
    }

    get(url: string, access_token: string, callback: dataCallback) {
        this._request(
            'GET',
            `https://api.twitch.tv/helix/${url}`,
            {
                Authorization: this.buildAuthHeader(access_token),
                'Client-Id': this._clientId,
            },
            '',
            access_token,
            (err, body, r) => callback(err, ConvertBody(body), r)
        );
    }

    post(url: string, access_token: string, body: any, callback: dataCallback) {
        this._request(
            'POST',
            `https://api.twitch.tv/helix/${url}`,
            {
                Authorization: this.buildAuthHeader(access_token),
                'Client-Id': this._clientId,
            },
            body,
            access_token,
            (err, body, r) => callback(err, ConvertBody(body), r)
        );
    }

    async getClientToken(): Promise<string> {
        const { _clientId: id, _clientSecret: secret } = this;
        try {
            const token = await redis.get(id);

            if (token) return token;
        } catch (e) {}

        return new Promise((res, rej) => {
            this._request(
                'POST',
                `https://id.twitch.tv/oauth2/token?client_id=${id}&client_secret=${secret}&grant_type=client_credentials${
                    this._scope && this._scope.length ? '&' : ''
                }${this._scope.join('%20')}`,
                {},
                '',
                '',
                async (err, body, r) => {
                    if (err) {
                        return rej(err);
                    }
                    if (body instanceof Buffer) body = body.toString();
                    const { access_token, expires_in } = JSON.parse(
                        body || '{}'
                    );

                    await redis.set(id, access_token, {
                        EX: expires_in - 20,
                    });

                    res(access_token);
                }
            );
        });
    }

    getClient(url: string, callback: dataCallback) {
        const _this = this;
        _this.getClientToken().then(token => {
            _this.get(url, token, callback);
        });
    }

    postClient(url: string, body: any, callback: dataCallback) {
        const _this = this;
        _this.getClientToken().then(token => {
            _this.post(url, token, body, callback);
        });
    }
}

export default TwitchOAuth2;
