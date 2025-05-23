import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { error401, error500 } from '@/utils/reponseAPI';
import { signToken } from '@/helpers/jwt';

interface Params {
    pass: string;
}

export async function GET(request: Request, { params }: { params: Params }) {
    try {
        const { pass } = params;
        if (pass === process.env.PASS_ONE || pass === process.env.PASS_ADMIN) {
            const token = signToken({ pass });
            cookies().set('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 15, // 15 min  //60 * 2, // 2 hrs
                path: '/',
            });

            return NextResponse.json({ success: true })
        } else {
            return error401();
        }
    } catch (error) {
        return error500(error);
    }
}