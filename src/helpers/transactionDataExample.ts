import { processXLSX, validateXLSXStructure, TransactionData } from './handlingXLSX';

/**
 * Ejemplo que demuestra el uso correcto de la interfaz TransactionData
 */

// Función que procesa y retorna datos tipados
export const procesarTransaccionesTipadas = async (fileBuffer: Buffer): Promise<{
  success: boolean;
  data?: TransactionData[];
  error?: string;
}> => {
  try {
    console.log('🏦 PROCESANDO TRANSACCIONES CON TIPADO CORRECTO');
    console.log('=' .repeat(50));
    
    // Validar estructura
    const columnasRequeridas = ['FECHA', 'HORA', 'CONCEPTO', 'RETIRO', 'DEPOSITO', 'MONEDA'];
    const validacion = await validateXLSXStructure(fileBuffer, columnasRequeridas);
    
    if (!validacion.isValid) {
      return {
        success: false,
        error: `Validación fallida: ${validacion.message}`
      };
    }
    
    // Procesar con mapeo correcto
    const resultado = await processXLSX(fileBuffer, {
      skipFirstRow: true,
      columnMapping: {
        'FECHA': 'fecha',
        'HORA': 'hora',
        'CONCEPTO': 'concepto',
        'RETIRO': 'retiro',
        'DEPOSITO': 'deposito',
        'MONEDA': 'moneda'
      }
    });
    
    if (!resultado.success || !resultado.data) {
      return {
        success: false,
        error: resultado.message
      };
    }
    
    // Los datos ya están tipados como TransactionData[]
    const transacciones: TransactionData[] = resultado.data;
    
    // Ahora podemos usar las propiedades con tipos correctos
    console.log('✅ Datos procesados con tipos correctos:');
    console.log(`📊 Total de transacciones: ${transacciones.length}`);
    
    // Ejemplo de uso con tipos seguros
    const transaccionesConRetiro = transacciones.filter(t => t.retiro && t.retiro > 0);
    const transaccionesConDeposito = transacciones.filter(t => t.deposito && t.deposito > 0);
    
    console.log(`💰 Transacciones con retiro: ${transaccionesConRetiro.length}`);
    console.log(`💰 Transacciones con depósito: ${transaccionesConDeposito.length}`);
    
    // Calcular totales con tipos seguros
    const totalRetiros = transaccionesConRetiro.reduce((sum, t) => sum + (t.retiro || 0), 0);
    const totalDepositos = transaccionesConDeposito.reduce((sum, t) => sum + (t.deposito || 0), 0);
    
    console.log(`💵 Total retiros: $${totalRetiros.toFixed(2)}`);
    console.log(`💵 Total depósitos: $${totalDepositos.toFixed(2)}`);
    console.log(`💵 Balance neto: $${(totalDepositos - totalRetiros).toFixed(2)}`);
    
    // Mostrar ejemplo de transacción tipada
    if (transacciones.length > 0) {
      const ejemplo = transacciones[0];
      console.log('\n👀 Ejemplo de transacción tipada:');
      console.log(`  Fecha: ${ejemplo.fecha} (tipo: ${typeof ejemplo.fecha})`);
      console.log(`  Hora: ${ejemplo.hora} (tipo: ${typeof ejemplo.hora})`);
      console.log(`  Concepto: ${ejemplo.concepto} (tipo: ${typeof ejemplo.concepto})`);
      console.log(`  Retiro: ${ejemplo.retiro} (tipo: ${typeof ejemplo.retiro})`);
      console.log(`  Depósito: ${ejemplo.deposito} (tipo: ${typeof ejemplo.deposito})`);
      console.log(`  Moneda: ${ejemplo.moneda} (tipo: ${typeof ejemplo.moneda})`);
    }
    
    return {
      success: true,
      data: transacciones
    };
    
  } catch (error) {
    return {
      success: false,
      error: `Error procesando transacciones: ${error instanceof Error ? error.message : 'Error desconocido'}`
    };
  }
};

// Función que demuestra el uso de tipos en análisis financiero
export const analizarTransacciones = (transacciones: TransactionData[]) => {
  console.log('📈 ANÁLISIS FINANCIERO CON TIPOS SEGUROS');
  console.log('=' .repeat(40));
  
  // Agrupar por moneda
  const porMoneda = new Map<string, TransactionData[]>();
  
  transacciones.forEach(t => {
    const moneda = t.moneda || 'MXN';
    if (!porMoneda.has(moneda)) {
      porMoneda.set(moneda, []);
    }
    porMoneda.get(moneda)!.push(t);
  });
  
  // Análisis por moneda
  porMoneda.forEach((transaccionesMoneda, moneda) => {
    const totalRetiros = transaccionesMoneda
      .filter(t => t.retiro && t.retiro > 0)
      .reduce((sum, t) => sum + (t.retiro || 0), 0);
    
    const totalDepositos = transaccionesMoneda
      .filter(t => t.deposito && t.deposito > 0)
      .reduce((sum, t) => sum + (t.deposito || 0), 0);
    
    console.log(`\n💱 Moneda: ${moneda}`);
    console.log(`   - Total retiros: ${totalRetiros.toFixed(2)}`);
    console.log(`   - Total depósitos: ${totalDepositos.toFixed(2)}`);
    console.log(`   - Balance: ${(totalDepositos - totalRetiros).toFixed(2)}`);
    console.log(`   - Transacciones: ${transaccionesMoneda.length}`);
  });
  
  // Análisis por fechas
  const fechas = transacciones.map(t => t.fecha).filter(Boolean);
  if (fechas.length > 0) {
    const fechasOrdenadas = fechas.sort();
    console.log(`\n📅 Rango de fechas: ${fechasOrdenadas[0]} a ${fechasOrdenadas[fechasOrdenadas.length - 1]}`);
  }
};

// Función que prepara datos para inserción en BD con tipos correctos
export const prepararParaBD = (transacciones: TransactionData[]) => {
  console.log('🗄️ PREPARANDO DATOS PARA BASE DE DATOS');
  console.log('=' .repeat(40));
  
  const datosParaBD = transacciones.map(t => ({
    fecha: t.fecha,
    hora: t.hora,
    concepto: t.concepto,
    retiro: t.retiro || 0,
    deposito: t.deposito || 0,
    moneda: t.moneda || 'MXN'
  }));
  
  console.log(`📊 Registros preparados: ${datosParaBD.length}`);
  console.log('✅ Datos con tipos correctos para inserción en BD');
  
  return datosParaBD;
}; 