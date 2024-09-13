import { NextResponse } from 'next/server';
import { db } from '@/app/database/mysql';
import { RowDataPacket } from 'mysql2';
import { hideEmail } from '@/app/helpers/hideEmail'
import { error404, error500 } from '@/app/utils/reponseAPI';

interface Register {
    email: string;
}

interface Params {
    numberHouse: string;
}

type QueryResult<T> = T[] & RowDataPacket[];

export async function GET(request: Request, { params }: { params: Params }) {
    try {
        const { numberHouse } = params
        const [result] = await db.execute<QueryResult<Register>>(`SELECT id, email FROM registers WHERE house = '${Number(numberHouse)}'`);
        if (result.length > 0) {
            const email = hideEmail(result[0].email);
            return NextResponse.json({ email, id: result[0].id });
        } else {
            return error404();
        }
    } catch (error) {
        error500(error)
    }
}