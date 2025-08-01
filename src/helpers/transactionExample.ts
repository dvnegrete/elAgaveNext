import { processXLSX, validateXLSXStructure, TransactionData } from './handlingXLSX';

/**
 * Ejemplo específico para procesar archivos XLSX con transacciones financieras
 * Columnas esperadas: FECHA, HORA, CONCEPTO, RETIRO, DEPOSITO, MONEDA
 */

// Función principal para procesar transacciones
export const procesarTransacciones = async (fileBuffer: Buffer) => {
  console.log('🏦 PROCESANDO ARCHIVO DE TRANSACCIONES FINANCIERAS');
  console.log('=' .repeat(60));
  
  // 1. Validar estructura del archivo
  const columnasRequeridas = ['FECHA', 'HORA', 'CONCEPTO', 'RETIRO', 'DEPOSITO', 'MONEDA'];
  console.log('🔍 Validando estructura del archivo...');
  
  const validacion = await validateXLSXStructure(fileBuffer, columnasRequeridas);
  
  if (!validacion.isValid) {
    console.log('❌ Error en la validación:');
    console.log('   - Mensaje:', validacion.message);
    console.log('   - Headers encontrados:', validacion.headers);
    console.log('   - Headers requeridos:', columnasRequeridas);
    return { success: false, error: validacion.message };
  }
  
  console.log('✅ Validación exitosa');
  console.log('   - Headers encontrados:', validacion.headers);
  
  // 2. Procesar el archivo
  console.log('\n📊 Procesando datos de transacciones...');
  
  const resultado = await processXLSX(fileBuffer, {
    skipFirstRow: true, // Saltar la fila de headers
    columnMapping: {
      'FECHA': 'fecha',
      'HORA': 'hora', 
      'CONCEPTO': 'concepto',
      'RETIRO': 'retiro',
      'DEPOSITO': 'deposito',
      'MONEDA': 'moneda'
    }
  });
  
  if (!resultado.success) {
    console.log('❌ Error en el procesamiento:', resultado.message);
    return { success: false, error: resultado.message };
  }
  
  console.log('✅ Procesamiento completado exitosamente');
  
  // 3. Análisis adicional de los datos
  if (resultado.data && resultado.data.length > 0) {
    const transacciones = resultado.data;
    
    console.log('\n📈 ANÁLISIS DETALLADO DE TRANSACCIONES');
    console.log('=' .repeat(50));
    
    // Contar tipos de transacciones
    const conRetiro = transacciones.filter(t => {
      const retiro = t.retiro || 0;
      return retiro > 0;
    }).length;
    
    const conDeposito = transacciones.filter(t => {
      const deposito = t.deposito || 0;
      return deposito > 0;
    }).length;
    
    const soloConcepto = transacciones.filter(t => {
      const retiro = t.retiro || 0;
      const deposito = t.deposito || 0;
      return retiro === 0 && deposito === 0;
    }).length;
    
    console.log(`💰 Transacciones con retiro: ${conRetiro}`);
    console.log(`💰 Transacciones con depósito: ${conDeposito}`);
    console.log(`📝 Transacciones solo con concepto: ${soloConcepto}`);
    console.log(`📊 Total de transacciones: ${transacciones.length}`);
    
    // Mostrar algunas transacciones de ejemplo
    console.log('\n👀 EJEMPLOS DE TRANSACCIONES:');
    console.log('-'.repeat(40));
    
    transacciones.slice(0, 3).forEach((t, index) => {
      console.log(`Transacción ${index + 1}:`);
      console.log(`  Fecha: ${t.fecha}`);
      console.log(`  Hora: ${t.hora}`);
      console.log(`  Concepto: ${t.concepto}`);
      console.log(`  Retiro: ${t.retiro || '0'}`);
      console.log(`  Depósito: ${t.deposito || '0'}`);
      console.log(`  Moneda: ${t.moneda}`);
      console.log('');
    });
    
    if (transacciones.length > 3) {
      console.log(`... y ${transacciones.length - 3} transacciones más`);
    }
  }
  
  return {
    success: true,
    data: resultado.data as TransactionData[],
    message: resultado.message
  };
};

// Función para preparar inserción en base de datos
export const prepararInsercionBD = async (fileBuffer: Buffer) => {
  console.log('🗄️ PREPARANDO INSERCIÓN EN BASE DE DATOS');
  console.log('=' .repeat(50));
  
  const resultado = await processXLSX(fileBuffer, {
    tableName: 'transacciones', // Nombre de la tabla en la BD
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
  
  if (resultado.success) {
    console.log('✅ Datos procesados y listos para inserción');
    console.log('⚠️ La inserción en BD está comentada por seguridad');
    console.log('📊 Registros a insertar:', resultado.data?.length);
    
    // Mostrar estructura SQL sugerida
    console.log('\n🗄️ ESTRUCTURA SQL SUGERIDA:');
    console.log('-'.repeat(30));
    console.log(`
CREATE TABLE transacciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fecha DATE NOT NULL,
  hora TIME,
  concepto VARCHAR(255) NOT NULL,
  retiro DECIMAL(10,2) DEFAULT 0,
  deposito DECIMAL(10,2) DEFAULT 0,
  moneda VARCHAR(10) DEFAULT 'MXN',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_fecha (fecha),
  INDEX idx_concepto (concepto)
);
    `);
    
    return {
      success: true,
      recordCount: resultado.data?.length || 0,
      message: 'Datos listos para inserción en BD'
    };
  } else {
    console.log('❌ Error:', resultado.message);
    return { success: false, error: resultado.message };
  }
};

// Función para validar solo la estructura sin procesar
export const validarEstructuraTransacciones = async (fileBuffer: Buffer) => {
  console.log('🔍 VALIDACIÓN DE ESTRUCTURA');
  console.log('=' .repeat(30));
  
  const columnasRequeridas = ['FECHA', 'HORA', 'CONCEPTO', 'RETIRO', 'DEPOSITO', 'MONEDA'];
  const validacion = await validateXLSXStructure(fileBuffer, columnasRequeridas);
  
  if (validacion.isValid) {
    console.log('✅ Archivo válido para procesamiento de transacciones');
    console.log('📋 Columnas encontradas:', validacion.headers);
    return { isValid: true, headers: validacion.headers };
  } else {
    console.log('❌ Archivo no válido');
    console.log('📋 Columnas encontradas:', validacion.headers);
    console.log('📋 Columnas requeridas:', columnasRequeridas);
    return { isValid: false, error: validacion.message };
  }
}; 