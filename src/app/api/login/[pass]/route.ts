import { NextResponse } from 'next/server';
import { error401, error500 } from '@/utils/reponseAPI';

interface Params {
    pass: string;
}

export async function GET(request: Request, { params }: { params: Params }) {
    try {
        const { pass } = params;
        if (pass === process.env.PASS_ONE || pass === process.env.PASS_ADMIN) {
            const host = request.headers.get('host');
            const protocol = request.headers.get('x-forwarded-proto') || 'http';
            const absoluteUrl = `${protocol}://${host}/info`;
            return NextResponse.redirect(absoluteUrl);
        } else {
            return error401();
        }
    } catch (error) {
        return error500(error);
    }
}