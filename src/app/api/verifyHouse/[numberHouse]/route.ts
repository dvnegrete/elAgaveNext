import { error500 } from '@/app/utils/reponseAPI';
import { getRetryDB } from '@/app/helpers/getRetryDB';

interface Params {
    numberHouse: string;
}

export async function GET(request: Request, { params }: { params: Params }) {
    try {
        const { numberHouse } = params;
        const query = `SELECT id, email FROM registers WHERE house = '${Number(numberHouse)}'`;
        return getRetryDB(query);
    } catch (error) {
        error500(error)
    }
}