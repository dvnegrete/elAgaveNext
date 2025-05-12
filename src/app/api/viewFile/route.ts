import { NextResponse } from 'next/server';
import { getCloudStorageGcp } from '@/libs/CloudStorageGcp';

export async function GET() {
    const response = await getCloudStorageGcp();
    return new NextResponse(JSON.stringify(response), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
        },
    });
}