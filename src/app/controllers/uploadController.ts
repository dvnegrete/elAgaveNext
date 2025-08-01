import { procesarTransaccionesTipadas, analizarTransacciones, prepararParaBD } from '@/helpers/transactionDataExample';
import { TransactionData } from '@/helpers/handlingXLSX';

export interface UploadResponse {
    success: boolean;
    message: string;
    tipoArchivo?: string;
    data?: {
        fileName: string;
        totalTransacciones: number;
        estadisticas: {
            conRetiro: number;
            conDeposito: number;
            totalRetiros: string;
            totalDepositos: string;
            balanceNeto: string;
        };
        transacciones: TransactionData[];
        preview: boolean;
    };
    error?: string;
}

export class UploadController {
    
    /**
     * Procesa un archivo XLSX de transacciones
     */
    static async procesarArchivoXLSX(fileBuffer: Buffer, fileName: string): Promise<UploadResponse> {
        try {
            console.log('🏦 Procesando archivo XLSX:', fileName);
            
            // Procesar el archivo usando las funciones de los helpers
            const resultado = await procesarTransaccionesTipadas(fileBuffer);

            if (!resultado.success || !resultado.data) {
                return {
                    success: false,
                    error: resultado.error || 'Error procesando archivo XLSX'
                };
            }

            const transacciones = resultado.data;
            const totalTransacciones = transacciones.length;
            
            // Calcular estadísticas
            const conRetiro = transacciones.filter(t => t.retiro && t.retiro > 0).length;
            const conDeposito = transacciones.filter(t => t.deposito && t.deposito > 0).length;
            const totalRetiros = transacciones
                .filter(t => t.retiro && t.retiro > 0)
                .reduce((sum, t) => sum + (t.retiro || 0), 0);
            const totalDepositos = transacciones
                .filter(t => t.deposito && t.deposito > 0)
                .reduce((sum, t) => sum + (t.deposito || 0), 0);

            console.log('✅ Archivo XLSX procesado exitosamente');
            console.log(`📊 Total de transacciones: ${totalTransacciones}`);

            return {
                success: true,
                message: 'Archivo XLSX procesado exitosamente',
                tipoArchivo: 'xlsx',
                data: {
                    fileName,
                    totalTransacciones,
                    estadisticas: {
                        conRetiro,
                        conDeposito,
                        totalRetiros: totalRetiros.toFixed(2),
                        totalDepositos: totalDepositos.toFixed(2),
                        balanceNeto: (totalDepositos - totalRetiros).toFixed(2)
                    },
                    transacciones: transacciones.slice(0, 5), // Solo las primeras 5 para preview
                    preview: true
                }
            };

        } catch (error) {
            console.error('❌ Error en el controlador de carga XLSX:', error);
            return {
                success: false,
                error: `Error procesando archivo XLSX: ${error instanceof Error ? error.message : 'Error desconocido'}`
            };
        }
    }

    /**
     * Valida el tipo de archivo
     */
    static validarTipoArchivo(fileName: string): { esValido: boolean; tipo?: string; error?: string } {
        const fileNameLower = fileName.toLowerCase();
        
        if (fileNameLower.endsWith('.xlsx') || fileNameLower.endsWith('.xls')) {
            return { esValido: true, tipo: 'xlsx' };
        } else if (fileNameLower.endsWith('.csv')) {
            return { esValido: true, tipo: 'csv' };
        } else {
            return { 
                esValido: false, 
                error: 'Tipo de archivo no soportado. Solo se aceptan archivos XLSX, XLS o CSV' 
            };
        }
    }

    /**
     * Prepara los datos para inserción en base de datos
     */
    static prepararDatosParaBD(transacciones: TransactionData[]) {
        console.log('🗄️ Preparando datos para inserción en BD...');
        
        const datosPreparados = prepararParaBD(transacciones);
        
        console.log(`📊 ${datosPreparados.length} registros preparados para BD`);
        
        return datosPreparados;
    }

    /**
     * Realiza análisis adicional de las transacciones
     */
    static realizarAnalisisAvanzado(transacciones: TransactionData[]) {
        console.log('📈 Realizando análisis avanzado...');
        
        analizarTransacciones(transacciones);
        
        // Análisis adicional específico
        const monedas = Array.from(new Set(transacciones.map(t => t.moneda || 'MXN')));
        const fechas = transacciones.map(t => t.fecha).filter(Boolean);
        
        if (fechas.length > 0) {
            const fechasOrdenadas = fechas.sort();
            console.log(`📅 Período de transacciones: ${fechasOrdenadas[0]} a ${fechasOrdenadas[fechasOrdenadas.length - 1]}`);
        }
        
        console.log(`💱 Monedas utilizadas: ${monedas.join(', ')}`);
        
        return {
            monedas,
            rangoFechas: fechas.length > 0 ? {
                inicio: fechas.sort()[0],
                fin: fechas.sort()[fechas.length - 1]
            } : null
        };
    }

    /**
     * Genera un resumen ejecutivo de las transacciones
     */
    static generarResumenEjecutivo(transacciones: TransactionData[]) {
        const totalTransacciones = transacciones.length;
        const conRetiro = transacciones.filter(t => t.retiro && t.retiro > 0).length;
        const conDeposito = transacciones.filter(t => t.deposito && t.deposito > 0).length;
        const totalRetiros = transacciones
            .filter(t => t.retiro && t.retiro > 0)
            .reduce((sum, t) => sum + (t.retiro || 0), 0);
        const totalDepositos = transacciones
            .filter(t => t.deposito && t.deposito > 0)
            .reduce((sum, t) => sum + (t.deposito || 0), 0);

        return {
            resumen: {
                totalTransacciones,
                transaccionesConRetiro: conRetiro,
                transaccionesConDeposito: conDeposito,
                totalRetiros: totalRetiros.toFixed(2),
                totalDepositos: totalDepositos.toFixed(2),
                balanceNeto: (totalDepositos - totalRetiros).toFixed(2),
                porcentajeRetiros: totalTransacciones > 0 ? ((conRetiro / totalTransacciones) * 100).toFixed(1) : '0',
                porcentajeDepositos: totalTransacciones > 0 ? ((conDeposito / totalTransacciones) * 100).toFixed(1) : '0'
            }
        };
    }
} 