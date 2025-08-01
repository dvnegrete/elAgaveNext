import { processXLSX, validateXLSXStructure, TransactionData } from './handlingXLSX';

// Ejemplo de uso básico
export const exampleBasicUsage = async (fileBuffer: Buffer) => {
  console.log('=== EJEMPLO DE USO BÁSICO ===');
  
  const result = await processXLSX(fileBuffer);
  
  if (result.success) {
    console.log('✅ Procesamiento exitoso:', result.message);
    console.log('📊 Datos procesados:', result.data?.length, 'registros');
  } else {
    console.log('❌ Error:', result.message);
  }
};

// Ejemplo específico para transacciones financieras
export const exampleTransactionProcessing = async (fileBuffer: Buffer) => {
  console.log('=== PROCESAMIENTO DE TRANSACCIONES FINANCIERAS ===');
  
  // Validar estructura específica para transacciones
  const requiredColumns = ['FECHA', 'HORA', 'CONCEPTO', 'RETIRO', 'DEPOSITO', 'MONEDA'];
  const validation = await validateXLSXStructure(fileBuffer, requiredColumns);
  
  if (!validation.isValid) {
    console.log('❌ Validación fallida:', validation.message);
    console.log('📋 Headers encontrados:', validation.headers);
    console.log('📋 Headers requeridos:', requiredColumns);
    return;
  }
  
  console.log('✅ Validación exitosa:', validation.message);
  console.log('📋 Headers encontrados:', validation.headers);
  
  // Procesar con mapeo específico para transacciones
  const result = await processXLSX(fileBuffer, {
    skipFirstRow: true, // Saltar la primera fila (headers)
    columnMapping: {
      'FECHA': 'fecha',
      'HORA': 'hora',
      'CONCEPTO': 'concepto',
      'RETIRO': 'retiro',
      'DEPOSITO': 'deposito',
      'MONEDA': 'moneda'
    }
  });
  
  if (result.success) {
    console.log('✅ Procesamiento exitoso:', result.message);
    
    // Mostrar algunos datos procesados
    if (result.data && result.data.length > 0) {
      console.log('👀 Primer registro procesado:');
      console.log(JSON.stringify(result.data[0], null, 2));
      
      // Mostrar resumen de transacciones
      const transacciones = result.data as TransactionData[];
      const conRetiro = transacciones.filter(t => t.retiro && t.retiro > 0).length;
      const conDeposito = transacciones.filter(t => t.deposito && t.deposito > 0).length;
      
      console.log('📊 Resumen de transacciones:');
      console.log(`- Transacciones con retiro: ${conRetiro}`);
      console.log(`- Transacciones con depósito: ${conDeposito}`);
      console.log(`- Total de transacciones: ${transacciones.length}`);
    }
  } else {
    console.log('❌ Error:', result.message);
  }
};

// Ejemplo con inserción en base de datos para transacciones
export const exampleWithDatabase = async (fileBuffer: Buffer) => {
  console.log('=== EJEMPLO CON BASE DE DATOS PARA TRANSACCIONES ===');
  
  const result = await processXLSX(fileBuffer, {
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
  
  if (result.success) {
    console.log('✅ Datos procesados y listos para inserción en BD');
    console.log('⚠️ La inserción en BD está comentada por seguridad');
    console.log('📊 Registros a insertar:', result.data?.length);
    
    // Mostrar estructura SQL sugerida
    console.log('🗄️ Estructura SQL sugerida para la tabla:');
    console.log(`
CREATE TABLE transacciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fecha DATE NOT NULL,
  hora TIME,
  concepto VARCHAR(255) NOT NULL,
  retiro DECIMAL(10,2) DEFAULT 0,
  deposito DECIMAL(10,2) DEFAULT 0,
  moneda VARCHAR(10) DEFAULT 'MXN',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
    `);
  } else {
    console.log('❌ Error:', result.message);
  }
};

// Función para procesar múltiples archivos
export const processMultipleFiles = async (fileBuffers: Buffer[]) => {
  console.log('=== PROCESAMIENTO MÚLTIPLE ===');
  
  const results = [];
  
  for (let i = 0; i < fileBuffers.length; i++) {
    console.log(`\n📁 Procesando archivo ${i + 1}/${fileBuffers.length}`);
    
    const result = await processXLSX(fileBuffers[i], {
      skipFirstRow: true
    });
    
    results.push({
      fileIndex: i + 1,
      success: result.success,
      message: result.message,
      recordCount: result.data?.length || 0
    });
  }
  
  // Resumen final
  console.log('\n📊 RESUMEN FINAL:');
  const successful = results.filter(r => r.success).length;
  const totalRecords = results.reduce((sum, r) => sum + r.recordCount, 0);
  
  console.log(`✅ Archivos procesados exitosamente: ${successful}/${fileBuffers.length}`);
  console.log(`📈 Total de registros procesados: ${totalRecords}`);
  
  return results;
}; 