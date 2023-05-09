'use strict';
import passport from 'passport';
import { OAuth2, dataCallback } from 'oauth';
import OAuth2Strategy, { InternalOAuthError } from 'passport-oauth2';

interface TwitchStrategyOptions
    extends Partial<OAuth2Strategy.StrategyOptions> {
    clientID: string;
    clientSecret: string;
    authorizationURL?: string;
    tokenURL?: string;
}

class _OAuth2 extends OAuth2 {
    get(url: string, access_token: string, callback: dataCallback) {
        this._request(
            'GET',
            url,
            {
                Authorization: this.buildAuthHeader(access_token),
                'Client-Id': this._clientId,
            },
            '',
            access_token,
            callback
        );
    }
}

export default class TwitchStrategy extends OAuth2Strategy.Strategy {
    options: TwitchStrategyOptions;
    constructor(
        options: TwitchStrategyOptions,
        verify: OAuth2Strategy.VerifyFunction
    ) {
        const opts: OAuth2Strategy.StrategyOptions = {
            ...options,
            authorizationURL:
                options.authorizationURL ||
                `https://id.twitch.tv/oauth2/authorize`,
            tokenURL: options.tokenURL || `https://id.twitch.tv/oauth2/token`,
        };

        super(opts, verify);
        this.options = options;

        this._oauth2 = new _OAuth2(
            opts.clientID,
            opts.clientSecret,
            '',
            opts.authorizationURL,
            opts.tokenURL,
            opts.customHeaders
        );
    }

    userProfile(
        accessToken: string,
        done: (
            err?: Error | null | undefined,
            profile?: Profile | boolean
        ) => void
    ): void {
        const _this = this;
        this._oauth2.get(
            `https://api.twitch.tv/helix/users`,
            accessToken,
            (err, body, res) => {
                console.log(err, accessToken);

                if (err)
                    return done(
                        new InternalOAuthError(
                            'failed to fetch user profile',
                            err
                        )
                    );
                try {
                    if (body instanceof Buffer) body = body.toString();
                    const json = JSON.parse(body || '{}').data[0];

                    const profile: Profile = {
                        provider: _this.name,
                        id: json.id,
                        username: json.name,
                        displayName: json.display_name,
                        email: json.email,
                        _raw: body,
                        _json: json,
                    };

                    done(null, profile);
                } catch (e) {
                    if (e instanceof Error) done(e, false);
                    else done(new Error('Connection fall'), false);
                }
            }
        );
    }
}

export interface Profile extends passport.Profile {
    provider: string;
    id: string;
    username: string;
    displayName: string;
    email: string;
    _raw: string | Buffer | undefined;
    _json: object;
}
