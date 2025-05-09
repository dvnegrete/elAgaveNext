import { NextResponse } from 'next/server';
import { getCloudStorageGcp } from '@/app/libs/CloudStorageGcp';

export async function GET() {
    const response = await getCloudStorageGcp();
    return NextResponse.json(response);

}