import express, { Router, Request, Response, NextFunction } from 'express';
import { twitchEventSub } from '@util/EST-crypto';

import redis from '@model/redis';

export interface Emote {
    begin: number;
    end: number;
    id: string;
}

export interface SubscriptionMessage {
    text: string;
    emotes?: Emote[];
}

export interface Image {
    url_1x?: string;
    url_2x?: string;
    url_4x?: string;
}

export interface Stream {
    is_enabled: boolean;
    value: number;
}

export interface GlobalCooldown {
    is_enabled: boolean;
    seconds: number;
}

export interface Reward {
    id: string;
    title: string;
    cost: number;
    prompt: string;
}

export interface Choices {
    id: string;
    title: string;
    bit_votes: number;
    channel_points_votes: number;
    votes: number;
}

export interface Outcomes {
    id: string;
    title: string;
    color: string;
    users: number;
    channel_points: number;
    top_predictors: TopPredictors[];
}
export interface TopPredictors {
    user_id: string;
    user_login: string;
    user_name: string;
    channel_points_won: number;
    channel_points_used: number;
}

export interface BitsVoting {
    is_enabled: boolean;
    amount_per_vote: number;
}

export interface ChannelPointsVoting {
    is_enabled: boolean;
    amount_per_vote: number;
}

export interface Contributions {
    user_id: string;
    user_login: string;
    user_name: string;
    type: 'bits' | 'subscription' | 'other';
    total: number;
}

export interface Amount {
    value: number;
    decimal_places: number;
    currency: string;
}

export interface Product {
    name: string;
    bits: number;
    sku: string; //Unique identifier for the product acquired.
    in_development: boolean;
}

export interface Event {
    id?: string;
    campaign_id?: string;

    user_id?: string;
    user_login?: string;
    user_name?: string;
    ///////////////////////////////
    broadcaster_user_id?: string;
    broadcaster_user_login?: string;
    broadcaster_user_name?: string;
    ///////////////////////////////
    from_broadcaster_user_id?: string;
    from_broadcaster_user_login?: string;
    from_broadcaster_user_name?: string;
    ///////////////////////////////
    to_broadcaster_user_id?: string;
    to_broadcaster_user_login?: string;
    to_broadcaster_user_name?: string;
    ///////////////////////////////
    charity_name?: string;
    charity_description?: string;
    charity_logo?: string;
    charity_website?: string;
    /////////////////////////////////////////////
    language?: 'en' | 'kr';
    category_id?: string;
    category_name?: string;
    reason?: string;
    title?: string;

    tier?: string;
    user_input?: string;

    /////////////////////////////////////
    // 채널 벤

    moderator_user_id?: string;
    moderator_user_login?: string;
    moderator_user_name?: string;

    description?: string;
    client_id?: string;
    email?: string;

    type?: 'live' | 'playlist' | 'watch_party' | 'premiere' | 'rerun';

    message?: SubscriptionMessage | string; // 구독메세지 / 비트 메세지
    image?: Image;
    default_image?: Image;

    max_per_stream?: Stream;
    max_per_user_per_stream?: Stream;
    global_cooldown?: GlobalCooldown;
    reward?: Reward;
    choices?: Choices[];
    bits_voting?: BitsVoting;
    channel_points_voting?: ChannelPointsVoting;
    outcomes?: Outcomes;
    top_contributions?: Contributions[];
    last_contribution?: Contributions;
    amount?: Amount;
    current_amount?: Amount | number;
    target_amount?: Amount | number;
    product?: Product;

    background_color?: string;

    bits?: number;
    tota?: number;
    cumulative_total?: number;
    cumulative_months?: number; // 누적
    streak_months?: number; // 누적
    duration_months?: number; // 연속
    level?: number;
    goal?: number;
    progress?: number;

    is_gift?: boolean;
    is_anonymous?: boolean;
    is_permanent?: boolean;
    is_mature?: boolean;
    is_user_input_required?: boolean;
    should_redemptions_skip_request_queue?: boolean;

    email_verified?: boolean;

    // ?
    cooldown_expires_at?: null | Date;
    redemptions_redeemed_current_stream?: null | string;

    /////////////////////////////////////
    // 채널 레이드
    viewers?: number;

    banned_at?: Date;
    started_at?: Date;
    ends_at?: Date;
    followed_at?: Date;
    redeemed_at?: Date;
    locks_at?: Date;
    expires_at?: Date;
    cooldown_ends_at?: Date; //
    target_cooldown_ends_at?: Date; //

    status?: 'completed' | 'archived' | 'terminated' | 'canceled' | 'resolved';

    /////////////////////////////////////
    // Channel Points Custom Reward Add Request Body

    cost?: number;
    prompt?: string;
}

export interface Subscription {
    id: string;
    type: SubscriptionType;
    version: string;
    status: string;
    cost: number;
    condition: {
        user_id?: string;
        broadcaster_user_id?: string;
        moderator_user_id?: string;
        from_broadcaster_user_id?: string;
        to_broadcaster_user_id?: string;
        reward_id?: string;
        organization_id?: string;
        category_id?: string;
        campaign_id?: string;
        extension_client_id?: string;
        client_id?: string;
    };
    created_at: string;
}

export type SubscriptionType =
    | 'channel.update'
    | 'channel.follow'
    | 'channel.subscribe'
    | 'channel.subscription.end'
    | 'channel.subscription.gift'
    | 'channel.subscription.message'
    | 'channel.cheer'
    | 'channel.raid'
    | 'channel.ban'
    | 'channel.unban'
    | 'channel.moderator.add'
    | 'channel.moderator.remove'
    | 'channel.channel_points_custom_reward.add'
    | 'channel.channel_points_custom_reward.update'
    | 'channel.channel_points_custom_reward.remove'
    | 'channel.channel_points_custom_reward_redemption.add'
    | 'channel.channel_points_custom_reward_redemption.update'
    | 'channel.poll.begin'
    | 'channel.poll.progress'
    | 'channel.poll.end'
    | 'channel.prediction.begin'
    | 'channel.prediction.progress'
    | 'channel.prediction.lock'
    | 'channel.prediction.end'
    | 'channel.charity_campaign.donate'
    | 'channel.charity_campaign.start'
    | 'channel.charity_campaign.progress'
    | 'channel.charity_campaign.stop'
    | 'drop.entitlement.grant'
    | 'extension.bits_transaction.create'
    | 'channel.goal.begin'
    | 'channel.goal.progress'
    | 'channel.goal.end'
    | 'channel.hype_train.begin'
    | 'channel.hype_train.progress'
    | 'channel.hype_train.end'
    | 'channel.shield_mode.begin'
    | 'channel.shield_mode.end'
    | 'channel.shoutout.create'
    | 'channel.shoutout.receive'
    | 'stream.online'
    | 'stream.offline'
    | 'user.authorization.grant'
    | 'user.authorization.revoke'
    | 'user.update';

export type Callback = (
    type: 'revocation' | 'event' | 'register' | SubscriptionType,
    event: Event,
    subscription: Subscription
) => void;

const router: Router = Router();

let sc: string;
let cb: Callback;

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router.use((req: Request, res: Response, next: NextFunction) => {
    if (req.headers && twitchEventSub(sc, req.headers, req.body)) next();
    else res.status(401).send('Unauthorized request to EventSub webhook');
});

/**
 * Event subscription
 */
router.use(async (req: Request, res: Response) => {
    const { headers, body } = req;
    if (
        body.hasOwnProperty('challenge') &&
        headers['twitch-eventsub-message-type'] ===
            'webhook_callback_verification'
    ) {
        res.status(200)
            .type('text/plain')
            .send(encodeURIComponent(body.challenge));
        // _this.emit('register', body.evnet, body.subscription);
        const event: Event = body.event;
        const subscription: Subscription = body.subscription;

        cb && cb('register', event, subscription);
        return;
    }
    res.send(200).send('OK');

    const messageId = `${headers['twitch-eventsub-message-id']}`;

    const cnt = await redis.exists(messageId);
    if (cnt) return;

    // 24시간 유효
    redis.set(
        messageId,
        JSON.stringify({
            event: body.event,
            subscription: body.subscription,
        }),
        { EX: 86_400 }
    );

    if (!cb) return;

    // TODO: 오래된 메세지 제거 부분

    const event: Event = body.event;
    const subscription: Subscription = body.subscription;

    switch (headers['twitch-eventsub-message-type']) {
        case 'notification':
            cb(subscription.type, event, subscription);
            cb('event', event, subscription);
            break;
        case 'revocation': // 이벤트 등록 에러
            cb('revocation', event, subscription);
            break;
        default:
            console.log(
                `Received request with unhandled message type ${headers['twitch-eventsub-message-type']}`
            );
            break;
    }
});

export default function (secret: string, callback: Callback) {
    sc = secret;
    cb = callback;

    return router;
}
