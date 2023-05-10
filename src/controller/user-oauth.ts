'use strict';
import { Strategy as discordStrategy } from 'passport-discord';
import { Profile as TwitchProfile } from '@util/passport-twitch';

import { QUERY } from '@model/connection';

import { Event } from '@util/EST-router';

import jwt from '@util/jwt-create';
/**
 * 디스코드 로그인
 */
export const loginDiscord = async (
    profile: discordStrategy.Profile,
    refreshToken: string
) => {
    const { id, username, avatar, discriminator, email } = profile;

    return QUERY<{ user_type: string }>(
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

export const userUpdate = async (event: Event, ...types: number[]) => {
    const { user_login, user_name, email, user_id } = event;
    return await QUERY(
        `
UPDATE discord.auth_token SET 
login = ?, name = ?, email = ?, update_at = CURRENT_TIMESTAMP 
WHERE \`type\` in (?) 
and user_id=?
    `,
        user_login,
        user_name,
        email,
        types,
        user_id
    );
};

/**
 * 사용자 정보 조회
 * @param auth_id
 * @param types
 * @returns
 */
export const getUserToken = async (auth_id: string, ...types: number[]) => {
    return QUERY<{
        user_id: string;
        type: number;
        login: string;
        name: string;
        user_type: number;
        email: string | null;
        avatar: string | null;
        refresh_token: string;
        is_session: 'Y' | 'N';
        create_at: Date;
        update_at: Date;
    }>(
        `
select at2.user_id, at2.type, at2.login, at2.name, at2.user_type, at2.email, at2.avatar, at2.refresh_token, at2.is_session, at2.create_at, at2.update_at 
from auth_conntection ac
left join auth_token at2 using(user_id, \`type\`)
where ac.type in (?)
and at2.user_id is not null
and at2.is_session = 'Y'
and ac.auth_id = ?
    `,
        types,
        auth_id
    );
};
