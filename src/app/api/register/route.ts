import { NextResponse } from 'next/server';
import { db } from '@/database/mysql';
import { areHideCharacters } from '@/helpers/areHideCharacters';
import { error400, error405, error500 } from '@/utils/reponseAPI';
import { validateEmail } from '@/helpers/validateEmail';

interface RegisterRequestBody {
    id?: number;
    email: string;
    phone: string;
    houseNumber: number;
    name: string;
}

export async function POST(request: Request) {
    try {
        const { email, houseNumber, phone, name }: RegisterRequestBody = await request.json();
        if (!validateEmail(email) || !houseNumber || !phone || !name) {
            return error400();
        }
        if (!areHideCharacters(phone)) {
            return error405("phone");
        }
        if (!areHideCharacters(email)) {
            return error405("email");
        }
        const [result] = await db.execute(
            "INSERT INTO registers (email, house, phone, name) VALUES (?, ?, ?, ?)",
            [email, houseNumber, phone, name]
        );
        return NextResponse.json({ result });
    } catch (error) {
        return error500(error);
    }
}

export async function PUT(request: Request) {
    try {

        const { email, id, phone, name }: RegisterRequestBody = await request.json();
        if (!validateEmail(email) || !id || !phone || !name) {
            return error400();
        }
        if (!areHideCharacters(phone)) {
            return error405("phone");
        }
        if (!areHideCharacters(email)) {
            return error405("email");
        }
        const [result] = await db.execute(
            `UPDATE registers SET email = '${email}', phone = '${phone}', name = '${name}' WHERE id = ${Number(id)};`
        );
        return NextResponse.json({ result });
    } catch (error) {
        return error500(error);
    }
}
