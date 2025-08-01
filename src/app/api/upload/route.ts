import { NextRequest, NextResponse } from 'next/server';
import { UploadService } from '@/app/services/uploadService';
import { error400, error500 } from '@/utils/reponseAPI';

export async function POST(request: NextRequest) {
    try {
        console.log('🔄 Iniciando procesamiento de archivo...');
        
        // Verificar que sea una petición POST
        if (request.method !== 'POST') {
            return NextResponse.json(
                { error: 'Método no permitido. Solo se acepta POST.' },
                { status: 405 }
            );
        }

        // Obtener el archivo del formulario
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            console.log('❌ No se encontró archivo en la petición');
            return error400();
        }

        const fileName = file.name.toLowerCase();
        console.log('📁 Archivo recibido:', fileName);
        console.log('📊 Tamaño del archivo:', file.size, 'bytes');

        // Convertir el archivo a Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Procesar archivo usando el servicio
        const resultado = await UploadService.procesarArchivo(buffer, fileName);
        
        if (!resultado.success) {
            console.log('❌ Error procesando archivo:', resultado.error);
            return NextResponse.json(
                { error: resultado.error },
                { status: 400 }
            );
        }

        return NextResponse.json(resultado);

    } catch (error) {
        console.error('❌ Error en la ruta de carga:', error);
        return error500(error);
    }
}

// Método GET para mostrar información sobre la ruta
export async function GET() {
    return NextResponse.json({
        message: 'Ruta para procesar archivos de transacciones',
        instrucciones: {
            metodo: 'POST',
            formato: 'multipart/form-data',
            campo: 'file',
            tiposAceptados: ['.xlsx', '.xls', '.csv'],
            columnasRequeridasXLSX: ['FECHA', 'HORA', 'CONCEPTO', 'RETIRO', 'DEPOSITO', 'MONEDA']
        },
        endpoint: '/api/upload'
    });
}

