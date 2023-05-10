'use strict';
import mysql, { Pool, PoolConnection } from 'mysql2/promise';
import { env } from 'process';

const pool: Pool = mysql.createPool({
    host: env.db_host,
    user: env.db_name,
    password: env.db_passwd,
    database: env.db_database,
    connectionLimit: 2, // 연결 개수 제한
});

pool.on('connection', () => console.log('DB] 연결됨'));

const sqlLogger = (query: string, params: any[], rows: any[] | any) => {
    // if (env.sql_log != 'true') return rows;
    console.log('=======================================================');
    console.log('SQL] ', mysql.format(query, params), rows);
    console.log('=======================================================');
    return rows;
};

type queryFunctionType = <E>(query: string, ...params: any[]) => Promise<E[]>;

const getConnection = async (
    connectionPool: (queryFunction: queryFunctionType) => Promise<any>
): Promise<any> => {
    let connect: PoolConnection | null = null;
    try {
        connect = await pool.getConnection();
        return await connectionPool(
            <E>(query: string, ...params: any[]): Promise<E[]> =>
                connect!
                    .query(query, params)
                    .then(([rows]) => sqlLogger(query, params, rows))
        );
    } catch (e) {
        console.error('SQL]', e);
    } finally {
        if (connect) connect.release();
    }
};

export default getConnection;

export const QUERY = async <E>(query: string, ...params: any[]): Promise<E[]> =>
    await getConnection(async <E>(c: queryFunctionType) =>
        c<E>(query, ...params)
    );
