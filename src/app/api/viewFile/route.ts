import { NextResponse, NextRequest } from 'next/server';
import { getListFiles, getFile } from '@/libs/CloudStorageGcp';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get('name');

    if (!fileName) {
        const response = await getListFiles();
        return new NextResponse(JSON.stringify(response));
    }

    const response = await getFile(fileName);
    return new NextResponse(JSON.stringify(response));
}