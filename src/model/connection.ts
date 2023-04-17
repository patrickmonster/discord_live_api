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

// T extends RowDataPacket[][] | RowDataPacket[] | OkPacket | OkPacket[] | ResultSetHeader

export interface ResultDataPacket extends RowDataPacket {}

export const getQuery = async <U extends RowDataPacket[]>(
    query: string,
    ...args: any | any[]
) =>
    pool.getConnection().then(
        (connect: PoolConnection): Promise<U | FieldPacket[]> =>
            connect
                .query<U>(query, args)
                .then(([rows]: [U, FieldPacket[]]): U => rows)
                .catch((e: FieldPacket[]) => {
                    console.error('SQL]', e);
                    return e;
                })
                .finally(() => connect.release())
    );
