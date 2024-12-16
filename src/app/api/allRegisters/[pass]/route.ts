import { NextResponse } from 'next/server';
import { db } from '@/database/mysql';
import { error401, error500 } from '@/utils/reponseAPI';

interface Params {
    pass: string;
}

export async function GET(request: Request, { params }: { params: Params }) {
    try {
        const { pass } = params;
        if (pass === process.env.PASS_ONE || pass === process.env.PASS_ADMIN) {
            const query = 'SELECT house, email FROM registers;';
            const [result] = await db.execute(query);
            const queryInsert = `INSERT INTO records (userForPass) VALUES (?);`;
            await db.execute(queryInsert, [`${pass}`]);
            return NextResponse.json(result);
        } else {
            return error401();
        }
    } catch (error) {
        return error500(error);
    }
}