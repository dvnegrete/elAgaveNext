import { UploadController } from '@/app/controllers/uploadController';
import { TransactionData } from '@/helpers/handlingXLSX';

export interface UploadServiceResponse {
    success: boolean;
    message: string;
    data?: any;
    error?: string;
}

export class UploadService {
    
    /**
     * Procesa un archivo de transacciones
     */
    static async procesarArchivo(fileBuffer: Buffer, fileName: string): Promise<UploadServiceResponse> {
        try {
            console.log('🔄 Servicio: Iniciando procesamiento de archivo...');
            
            // Validar archivo
            const validacion = UploadController.validarTipoArchivo(fileName);
            if (!validacion.esValido) {
                return {
                    success: false,
                    error: validacion.error || 'Archivo no válido'
                };
            }

            // Procesar según el tipo
            if (validacion.tipo === 'xlsx') {
                return await this.procesarArchivoXLSX(fileBuffer, fileName);
            } else if (validacion.tipo === 'csv') {
                return await this.procesarArchivoCSV(fileBuffer, fileName);
            }

            return {
                success: false,
                error: 'Tipo de archivo no soportado'
            };

        } catch (error) {
            console.error('❌ Error en el servicio de carga:', error);
            return {
                success: false,
                error: `Error en el servicio: ${error instanceof Error ? error.message : 'Error desconocido'}`
            };
        }
    }

    /**
     * Procesa específicamente archivos XLSX
     */
    private static async procesarArchivoXLSX(fileBuffer: Buffer, fileName: string): Promise<UploadServiceResponse> {
        try {
            console.log('📊 Servicio: Procesando archivo XLSX...');
            
            // Usar el controlador para procesar
            const resultado = await UploadController.procesarArchivoXLSX(fileBuffer, fileName);
            
            if (!resultado.success) {
                return {
                    success: false,
                    error: resultado.error || 'Error procesando archivo XLSX'
                };
            }

            // Realizar análisis adicional
            if (resultado.data?.transacciones) {
                const analisisAvanzado = UploadController.realizarAnalisisAvanzado(resultado.data.transacciones);
                const resumenEjecutivo = UploadController.generarResumenEjecutivo(resultado.data.transacciones);
                
                // Agregar análisis adicional a la respuesta
                resultado.data = {
                    ...resultado.data,
                    analisisAvanzado,
                    resumenEjecutivo
                };
            }

            return {
                success: true,
                message: resultado.message,
                data: resultado.data
            };

        } catch (error) {
            console.error('❌ Error procesando archivo XLSX:', error);
            return {
                success: false,
                error: `Error procesando archivo XLSX: ${error instanceof Error ? error.message : 'Error desconocido'}`
            };
        }
    }

    /**
     * Procesa archivos CSV (placeholder para futura implementación)
     */
    private static async procesarArchivoCSV(fileBuffer: Buffer, fileName: string): Promise<UploadServiceResponse> {
        try {
            console.log('📊 Servicio: Procesando archivo CSV...');
            
            // TODO: Implementar procesamiento de CSV
            return {
                success: true,
                message: 'Archivo CSV recibido (procesamiento pendiente)',
                data: {
                    fileName,
                    tipo: 'csv',
                    procesado: false
                }
            };

        } catch (error) {
            console.error('❌ Error procesando archivo CSV:', error);
            return {
                success: false,
                error: `Error procesando archivo CSV: ${error instanceof Error ? error.message : 'Error desconocido'}`
            };
        }
    }

    /**
     * Prepara datos para inserción en base de datos
     */
    static prepararParaInsercionBD(transacciones: TransactionData[]) {
        try {
            console.log('🗄️ Servicio: Preparando datos para inserción en BD...');
            
            const datosPreparados = UploadController.prepararDatosParaBD(transacciones);
            
            return {
                success: true,
                message: 'Datos preparados para inserción en BD',
                data: {
                    registrosPreparados: datosPreparados.length,
                    datos: datosPreparados
                }
            };

        } catch (error) {
            console.error('❌ Error preparando datos para BD:', error);
            return {
                success: false,
                error: `Error preparando datos: ${error instanceof Error ? error.message : 'Error desconocido'}`
            };
        }
    }

    /**
     * Valida la estructura de datos antes del procesamiento
     */
    static validarEstructuraDatos(transacciones: TransactionData[]) {
        try {
            console.log('🔍 Servicio: Validando estructura de datos...');
            
            const errores: string[] = [];
            
            transacciones.forEach((transaccion, index) => {
                // Validar campos requeridos
                if (!transaccion.fecha) {
                    errores.push(`Fila ${index + 1}: Fecha requerida`);
                }
                if (!transaccion.concepto) {
                    errores.push(`Fila ${index + 1}: Concepto requerido`);
                }
                
                // Validar que al menos uno de los montos esté presente
                if (!transaccion.retiro && !transaccion.deposito) {
                    errores.push(`Fila ${index + 1}: Al menos un monto (retiro o depósito) debe estar presente`);
                }
                
                // Validar que no ambos montos estén presentes
                if (transaccion.retiro && transaccion.deposito) {
                    errores.push(`Fila ${index + 1}: No puede tener retiro y depósito simultáneamente`);
                }
            });

            if (errores.length > 0) {
                return {
                    success: false,
                    error: 'Errores de validación encontrados',
                    data: {
                        errores,
                        totalErrores: errores.length
                    }
                };
            }

            return {
                success: true,
                message: 'Estructura de datos válida',
                data: {
                    totalTransacciones: transacciones.length,
                    validacionesPasadas: true
                }
            };

        } catch (error) {
            console.error('❌ Error validando estructura:', error);
            return {
                success: false,
                error: `Error en validación: ${error instanceof Error ? error.message : 'Error desconocido'}`
            };
        }
    }
} 