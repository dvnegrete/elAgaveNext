import { NextResponse } from "next/server";

interface Params {
    pass: string;
}

export async function POST(request: Request, { params }: { params: Params }) {
    try {
        const { pass } = params;
        if (pass === process.env.PASS_ONE || pass === process.env.PASS_ADMIN) {
            const host = request.headers.get('host');
            const protocol = request.headers.get('x-forwarded-proto') || 'http';
            const absoluteUrl = `${protocol}://${host}/info`;
            return NextResponse.redirect(absoluteUrl);
        } 
    } catch (error) {
        return console.log(error);
    }
}