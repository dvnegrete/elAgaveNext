# Procesamiento de Archivos XLSX - Transacciones Financieras

Este módulo proporciona funcionalidades para procesar archivos XLSX con datos de transacciones financieras y cargar la información a una base de datos SQL.

## Estructura de Datos Esperada

El módulo está optimizado para procesar archivos XLSX con las siguientes columnas:

- **FECHA** - Fecha de la transacción
- **HORA** - Hora de la transacción  
- **CONCEPTO** - Descripción de la transacción
- **RETIRO** - Monto retirado (puede estar vacío)
- **DEPOSITO** - Monto depositado (puede estar vacío)
- **MONEDA** - Tipo de moneda (ej: MXN, USD, EUR)

## Archivos

- `handlingXLSX.ts` - Funciones principales para procesar XLSX
- `exampleXLSXUsage.ts` - Ejemplos de uso
- `transactionExample.ts` - Ejemplos específicos para transacciones
- `transactionDataExample.ts` - Ejemplos con uso correcto de tipos
- `README_XLSX.md` - Esta documentación

## Funciones Principales

### `processXLSX(fileBuffer, options)`

Procesa un archivo XLSX y retorna los datos estructurados como `TransactionData[]`.

**Parámetros:**
- `fileBuffer: Buffer` - Buffer del archivo XLSX
- `options: XLSXProcessingOptions` - Opciones de procesamiento

**Opciones disponibles:**
- `sheetName?: string` - Nombre de la hoja a procesar (por defecto: primera hoja)
- `tableName?: string` - Nombre de la tabla para inserción en BD
- `skipFirstRow?: boolean` - Si saltar la primera fila (headers)
- `columnMapping?: Record<string, string>` - Mapeo de nombres de columnas

**Retorna:**
```typescript
{
  success: boolean;
  message: string;
  data?: TransactionData[];
}
```

### Interfaz `TransactionData`

```typescript
interface TransactionData {
  fecha: string;
  hora: string;
  concepto: string;
  retiro: number | null;
  deposito: number | null;
  moneda: string;
}
```

### `validateXLSXStructure(fileBuffer, requiredColumns?)`

Valida la estructura de un archivo XLSX.

**Parámetros:**
- `fileBuffer: Buffer` - Buffer del archivo XLSX
- `requiredColumns?: string[]` - Columnas requeridas

**Retorna:**
```typescript
{
  isValid: boolean;
  message: string;
  headers?: string[];
}
```

## Ejemplos de Uso

### Uso Básico para Transacciones

```typescript
import { processXLSX } from './handlingXLSX';

const fileBuffer = // tu buffer del archivo XLSX
const result = await processXLSX(fileBuffer, {
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
  console.log('Transacciones procesadas:', result.data);
  
  // Los datos están tipados como TransactionData[]
  const transacciones: TransactionData[] = result.data || [];
  
  // Uso seguro con tipos
  const totalRetiros = transacciones
    .filter(t => t.retiro && t.retiro > 0)
    .reduce((sum, t) => sum + (t.retiro || 0), 0);
    
  console.log('Total retiros:', totalRetiros);
} else {
  console.log('Error:', result.message);
}

### Uso con Validación para Transacciones

```typescript
import { processXLSX, validateXLSXStructure } from './handlingXLSX';

// Validar estructura específica para transacciones
const requiredColumns = ['FECHA', 'HORA', 'CONCEPTO', 'RETIRO', 'DEPOSITO', 'MONEDA'];
const validation = await validateXLSXStructure(fileBuffer, requiredColumns);
if (!validation.isValid) {
  console.log('Archivo inválido:', validation.message);
  return;
}

// Procesar con mapeo específico para transacciones
const result = await processXLSX(fileBuffer, {
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
```

### Uso con Base de Datos para Transacciones

```typescript
const result = await processXLSX(fileBuffer, {
  tableName: 'transacciones',
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

// La inserción en BD está comentada por seguridad
// Descomenta el código en handlingXLSX.ts cuando estés listo
```

### Estructura SQL Sugerida

```sql
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
```

## Logs y Debugging

La función `processXLSX` incluye logs detallados que muestran:

- 🔄 Inicio del procesamiento
- 📊 Hoja siendo procesada
- 📋 Headers encontrados
- 📈 Total de filas de datos
- 👀 Preview de los primeros 5 registros
- 📊 Estadísticas del archivo de transacciones
- 💰 Análisis financiero (totales de retiros/depósitos, balance neto, monedas)
- 📅 Rango de fechas de las transacciones
- 🗄️ Preparación para inserción en BD (si aplica)

## Características

✅ **Procesamiento de múltiples hojas**
✅ **Mapeo de columnas personalizable**
✅ **Validación de estructura específica para transacciones**
✅ **Logs detallados con análisis financiero**
✅ **Manejo de errores robusto**
✅ **Preparado para inserción en BD**
✅ **Soporte para archivos grandes**
✅ **Análisis automático de retiros y depósitos**
✅ **Cálculo de balance neto**
✅ **Identificación de monedas utilizadas**
✅ **Rango de fechas de transacciones**
✅ **Tipado fuerte con interfaz TransactionData**
✅ **Uso seguro de tipos en análisis financiero**

## Notas Importantes

1. **Inserción en BD**: La inserción en base de datos está comentada por seguridad. Revisa el código en `handlingXLSX.ts` antes de activarla.

2. **Validación**: Siempre valida la estructura del archivo antes de procesarlo.

3. **Mapeo de columnas**: Usa `columnMapping` para mapear nombres de columnas del XLSX a nombres de columnas de tu BD.

4. **Headers**: Si tu archivo no tiene headers en la primera fila, usa `skipFirstRow: false`.

## Dependencias

- `xlsx` - Para leer archivos XLSX
- `mysql2` - Para conexión a base de datos (ya configurada en el proyecto)

## Próximos Pasos

1. Revisa los logs de la función para verificar que los datos se procesan correctamente
2. Ajusta el mapeo de columnas según tu estructura de datos
3. Descomenta y configura la inserción en BD cuando estés listo
4. Agrega validaciones adicionales según tus necesidades 