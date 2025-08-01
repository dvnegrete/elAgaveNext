import * as XLSX from 'xlsx';
import { db } from '../database/mysql';

export interface XLSXProcessingOptions {
  sheetName?: string;
  tableName?: string;
  skipFirstRow?: boolean;
  columnMapping?: Record<string, string>;
}

// Interfaz para los datos de transacciones financieras
export interface TransactionData {
  fecha: string;
  hora: string;
  concepto: string;
  retiro: number | null;
  deposito: number | null;
  moneda: string;
}

export const processXLSX = async (
  fileBuffer: Buffer,
  options: XLSXProcessingOptions = {}
): Promise<{ success: boolean; message: string; data?: TransactionData[] }> => {
  try {
    console.log('🔄 Iniciando procesamiento de archivo XLSX...');
    
    // Leer el archivo XLSX
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    
    // Obtener la primera hoja si no se especifica una
    const sheetName = options.sheetName || workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    if (!worksheet) {
      throw new Error(`No se encontró la hoja: ${sheetName}`);
    }
    
    console.log(`📊 Procesando hoja: ${sheetName}`);
    
    // Convertir a JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
      header: 1,
      defval: null 
    });
    
    if (!jsonData || jsonData.length === 0) {
      throw new Error('El archivo XLSX está vacío');
    }
    
    // Obtener headers (primera fila)
    const headers = jsonData[0] as string[];
    console.log('📋 Headers encontrados:', headers);
    
    // Procesar datos (saltar la primera fila si se especifica)
    const startIndex = options.skipFirstRow ? 1 : 0;
    const dataRows = jsonData.slice(startIndex) as any[][];
    
    console.log(`📈 Total de filas de datos: ${dataRows.length}`);
    
    // Convertir filas a objetos TransactionData
    const processedData: TransactionData[] = dataRows.map((row, index) => {
      const rowObject: Record<string, any> = {};
      
      headers.forEach((header, colIndex) => {
        if (header && row[colIndex] !== undefined) {
          const mappedKey = options.columnMapping?.[header] || header;
          rowObject[mappedKey] = row[colIndex];
        }
      });
      
      // Convertir a TransactionData con tipos correctos
      const transaction: TransactionData = {
        fecha: String(rowObject.fecha || rowObject.FECHA || ''),
        hora: String(rowObject.hora || rowObject.HORA || ''),
        concepto: String(rowObject.concepto || rowObject.CONCEPTO || ''),
        retiro: rowObject.retiro || rowObject.RETIRO ? parseFloat(String(rowObject.retiro || rowObject.RETIRO)) || null : null,
        deposito: rowObject.deposito || rowObject.DEPOSITO ? parseFloat(String(rowObject.deposito || rowObject.DEPOSITO)) || null : null,
        moneda: String(rowObject.moneda || rowObject.MONEDA || 'MXN')
      };
      
      return transaction;
    });
    
    // Mostrar los primeros 5 registros como preview
    console.log('👀 Preview de los primeros 5 registros:');
    processedData.slice(0, 5).forEach((row, index) => {
      console.log(`Registro ${index + 1}:`, JSON.stringify(row, null, 2));
    });
    
    if (processedData.length > 5) {
      console.log(`... y ${processedData.length - 5} registros más`);
    }
    
    // Log de estadísticas específicas para transacciones
    console.log('📊 Estadísticas del archivo de transacciones:');
    console.log(`- Total de columnas: ${headers.length}`);
    console.log(`- Total de filas de datos: ${processedData.length}`);
    console.log(`- Headers: ${headers.join(', ')}`);
    
    // Análisis específico de transacciones
    if (processedData.length > 0) {
      const totalRetiros = processedData.reduce((sum, row) => {
        const retiro = row.retiro || 0;
        return sum + retiro;
      }, 0);
      
      const totalDepositos = processedData.reduce((sum, row) => {
        const deposito = row.deposito || 0;
        return sum + deposito;
      }, 0);
      
      const monedas = Array.from(new Set(processedData.map(row => row.moneda || 'N/A')));
      
      console.log('💰 Análisis financiero:');
      console.log(`- Total de retiros: $${totalRetiros.toFixed(2)}`);
      console.log(`- Total de depósitos: $${totalDepositos.toFixed(2)}`);
      console.log(`- Balance neto: $${(totalDepositos - totalRetiros).toFixed(2)}`);
      console.log(`- Monedas encontradas: ${monedas.join(', ')}`);
      
      // Mostrar fechas de rango
      const fechas = processedData.map(row => row.fecha).filter(Boolean);
      if (fechas.length > 0) {
        const fechasOrdenadas = fechas.sort();
        console.log(`- Rango de fechas: ${fechasOrdenadas[0]} a ${fechasOrdenadas[fechasOrdenadas.length - 1]}`);
      }
    }
    
    // Si se especifica una tabla, proceder con la inserción en BD
    if (options.tableName) {
      console.log(`🗄️ Preparando inserción en tabla: ${options.tableName}`);
      
      // Aquí puedes agregar la lógica de inserción en la base de datos
      // Por ahora solo retornamos los datos procesados
      console.log('⚠️ Función de inserción en BD comentada - revisar antes de activar');
      
      // Ejemplo de cómo sería la inserción:
      /*
      for (const row of processedData) {
        const columns = Object.keys(row).join(', ');
        const values = Object.values(row).map(() => '?').join(', ');
        const query = `INSERT INTO ${options.tableName} (${columns}) VALUES (${values})`;
        
        await db.execute(query, Object.values(row));
      }
      */
    }
    
    return {
      success: true,
      message: `Archivo XLSX procesado exitosamente. ${processedData.length} registros encontrados.`,
      data: processedData
    };
    
  } catch (error) {
    console.error('❌ Error procesando archivo XLSX:', error);
    return {
      success: false,
      message: `Error procesando archivo XLSX: ${error instanceof Error ? error.message : 'Error desconocido'}`
    };
  }
};

// Función auxiliar para validar estructura del archivo
export const validateXLSXStructure = (
  fileBuffer: Buffer,
  requiredColumns?: string[]
): Promise<{ isValid: boolean; message: string; headers?: string[] }> => {
  return new Promise((resolve) => {
    try {
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      if (!jsonData || jsonData.length === 0) {
        resolve({ isValid: false, message: 'El archivo está vacío' });
        return;
      }
      
      const headers = jsonData[0] as string[];
      
      if (requiredColumns) {
        const missingColumns = requiredColumns.filter(col => !headers.includes(col));
        if (missingColumns.length > 0) {
          resolve({
            isValid: false,
            message: `Columnas requeridas faltantes: ${missingColumns.join(', ')}`,
            headers
          });
          return;
        }
      }
      
      resolve({
        isValid: true,
        message: 'Estructura del archivo válida',
        headers
      });
      
    } catch (error) {
      resolve({
        isValid: false,
        message: `Error validando archivo: ${error instanceof Error ? error.message : 'Error desconocido'}`
      });
    }
  });
}; 