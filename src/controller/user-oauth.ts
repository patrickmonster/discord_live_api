'use strict';
import { Strategy as discordStrategy } from 'passport-discord';
import { Profile as TwitchProfile } from '@util/passport-twitch';

import { QUERY } from '@model/connection';

import jwt from '@util/jwt-create';
/**
 * 디스코드 로그인
 */
export const loginDiscord = async (
    profile: discordStrategy.Profile,
    refreshToken: string
) => {
    const { id, username, avatar, discriminator, email } = profile;

    console.log(profile);

    return QUERY(
        `select func_auth_token('discord', '', ?, ?, ?, ?, ?, ?, ?) as user_type`,
        id,
        id,
        username,
        discriminator,
        email,
        avatar,
        refreshToken
    ).then(([{ user_type }]) =>
        jwt({
            id,
            nickname: username,
            type: user_type,
            refreshToken,
        })
    );
};

export const loginTwitch = async (
    profile: TwitchProfile,
    refreshToken: string
) => {
    const {
        id,
        login,
        displayName,
        profileImageUrl,
        email,
        broadcasterType,
        provider,
    } = profile;

    console.log(profile);

    // TODO:쿼리 개선 - 비효율 적임
    return await QUERY(
        `select func_auth_token(?, ?, ?, NULL, ?, ?, ?, ?, ?) as user_type`,
        provider,
        broadcasterType || '',
        id,
        login,
        displayName || '',
        email || '',
        profileImageUrl || '',
        refreshToken
    );
};
