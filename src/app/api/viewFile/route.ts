import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

import { getListFiles, getFile } from '@/libs/CloudStorageGcp';
import { verifyToken } from '@/helpers/jwt';
import { error401 } from '@/utils/reponseAPI';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get('name');

    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    if (!token || !verifyToken(token)) {
        return error401()
    }

    if (!fileName) {
        const response = await getListFiles();
        return new NextResponse(JSON.stringify(response));
    }

    const response = await getFile(fileName);
    return new NextResponse(JSON.stringify(response));
}