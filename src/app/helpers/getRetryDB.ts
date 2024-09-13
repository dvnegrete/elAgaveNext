import { NextResponse } from 'next/server';
import { db } from '@/app/database/mysql';
import { RowDataPacket } from 'mysql2';
import { hideEmail } from '@/app/helpers/hideEmail'
import { error404, error500 } from '@/app/utils/reponseAPI';

interface Register {
    email: string;
}

type QueryResult<T> = T[] & RowDataPacket[];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getRetryDB(query: string, retries: number = 3, delayMs: number = 2000) {
    try {
        const [result] = await db.execute<QueryResult<Register>>(query);
        if (result.length > 0) {
            const email = hideEmail(result[0].email);
            return NextResponse.json({ email, id: result[0].id });
        } else {
            return error404();
        }
    } catch (error) {
        if (retries > 0) {
            console.error(`Error 500, reintentando en ${delayMs / 1000} segundos...`);
            await delay(delayMs);
            return getRetryDB(query, retries - 1, delayMs);
        } else {
            return error500(error);
        }
    }
}