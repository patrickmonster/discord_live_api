'use strict';
import mysql, { Pool, PoolConnection } from 'mysql2/promise';
import { env } from 'process';
interface QueryFunction {
    (query: string, ...params: any[]): Promise<any[]>;
}

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

const getConnection = async (
    connectionPool: (queryFunction: QueryFunction) => Promise<any>
): Promise<any> => {
    let connect: PoolConnection | null = null;
    try {
        connect = await pool.getConnection();
        return await connectionPool(
            (query: string, ...params: any[]): Promise<any> =>
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

export const QUERY = async (query: string, ...params: any[]): Promise<any> =>
    await getConnection(c => c(query, ...params));
