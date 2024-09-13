import { NextResponse } from 'next/server';
import { db } from '@/app/database/mysql';
import { areHideCharacters } from '@/app/helpers/areHideCharacters';
import { error400, error405, error500 } from '@/app/utils/reponseAPI';

interface RegisterRequestBody {
    id?: number;
    email: string;
    houseNumber: number;
}

export async function POST(request: Request) {
    try {
        const { email, houseNumber }: RegisterRequestBody = await request.json();
        if (!email || !houseNumber) {
            return error400();
        }
        if (!areHideCharacters(email)) {
            return error405();
        }
        const [result] = await db.execute(
            "INSERT INTO registers (email, house) VALUES (?, ?)",
            [email, houseNumber]
        );
        return NextResponse.json({ result });
    } catch (error) {
        error500(error);
    }
}

export async function PUT(request: Request) {
    try {
        const { email, id }: RegisterRequestBody = await request.json();
        if (!email || !id) {
            return error400();
        }
        if (!areHideCharacters(email)) {
            return error405();
        }
        const [result] = await db.execute(
            `UPDATE registers SET email = '${email}' WHERE id = ${Number(id)};`
        );
        return NextResponse.json({ result });
    } catch (error) {
        error500(error);
    }
}
