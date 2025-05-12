import { NextResponse } from 'next/server';
import { getCloudStorageGcp } from '@/libs/CloudStorageGcp';

export async function GET() {
    const response = await getCloudStorageGcp();
    console.log('Server time:', new Date().toISOString());
    return NextResponse.json(response);
}