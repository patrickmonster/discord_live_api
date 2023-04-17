'use strict';
import mysql, {
    Connection,
    ConnectionOptions,
    createPool,
    RowDataPacket,
    OkPacket,
    ResultSetHeader,
    FieldPacket,
    PoolConnection,
} from 'mysql2/promise';

const connectionOptions: ConnectionOptions = {
    host: process.env.db_host,
    user: process.env.db_name,
    password: process.env.db_passwd,
    database: process.env.db_database,
    connectionLimit: 50, // 연결 개수 제한
    port: 3306, // 포트 번호 (기본값: 3306)
};

const pool = createPool(connectionOptions);

export const getConnection = (connectionPool: Function) => {
    return pool.getConnection().then(connect => {
        try {
            return connectionPool((query: string, ...args: any | any[]) =>
                connect.query(query, args).then(([rows]) => rows)
            );
        } catch (e) {
            console.error('SQL]', e);
        } finally {
            connect.release();
        }
    });
};

export interface ResultDataPacket extends RowDataPacket {}
export interface ResultFieldPacket extends FieldPacket {}

export const getQuery = async <U extends RowDataPacket[]>(
    query: string,
    ...args: any | any[]
) =>
    pool.getConnection().then(
        (connect: PoolConnection): Promise<U> =>
            new Promise<U>(
                (
                    resolve: (value: U | PromiseLike<U>) => void,
                    reject: (reason?: any) => void
                ) => {
                    connect
                        .query<U>(query, args)
                        .then(([rows]: [U, FieldPacket[]]): void =>
                            resolve(rows)
                        )
                        .catch((e: FieldPacket[]) => {
                            console.error('SQL]', e);
                            return reject(e);
                        })
                        .finally(() => connect.release());
                }
            )
    );
