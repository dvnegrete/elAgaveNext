# API de Carga de Archivos

Esta API permite procesar archivos XLSX con datos de transacciones financieras.

## Endpoint

### POST `/api/upload`

Procesa archivos XLSX de transacciones financieras.

#### Parámetros

- **Content-Type**: `multipart/form-data`
- **Campo**: `file` (archivo XLSX/XLS)

#### Estructura del archivo XLSX

El archivo debe contener las siguientes columnas:

| Columna | Tipo | Descripción |
|---------|------|-------------|
| FECHA | string | Fecha de la transacción |
| HORA | string | Hora de la transacción |
| CONCEPTO | string | Descripción de la transacción |
| RETIRO | number | Monto retirado (opcional) |
| DEPOSITO | number | Monto depositado (opcional) |
| MONEDA | string | Tipo de moneda (ej: MXN, USD) |

#### Ejemplo de uso

```javascript
const formData = new FormData();
formData.append('file', archivoXLSX);

const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
});

const resultado = await response.json();
```

#### Respuesta exitosa

```json
{
    "success": true,
    "message": "Archivo XLSX procesado exitosamente",
    "data": {
        "fileName": "transacciones.xlsx",
        "totalTransacciones": 150,
        "estadisticas": {
            "conRetiro": 45,
            "conDeposito": 80,
            "totalRetiros": "15000.00",
            "totalDepositos": "25000.00",
            "balanceNeto": "10000.00"
        },
        "transacciones": [
            {
                "fecha": "2024-01-15",
                "hora": "09:30",
                "concepto": "Pago de servicios",
                "retiro": 500.00,
                "deposito": null,
                "moneda": "MXN"
            }
        ],
        "preview": true,
        "analisisAvanzado": {
            "monedas": ["MXN", "USD"],
            "rangoFechas": {
                "inicio": "2024-01-01",
                "fin": "2024-12-31"
            }
        },
        "resumenEjecutivo": {
            "resumen": {
                "totalTransacciones": 150,
                "transaccionesConRetiro": 45,
                "transaccionesConDeposito": 80,
                "totalRetiros": "15000.00",
                "totalDepositos": "25000.00",
                "balanceNeto": "10000.00",
                "porcentajeRetiros": "30.0",
                "porcentajeDepositos": "53.3"
            }
        }
    }
}
```

#### Respuesta de error

```json
{
    "success": false,
    "error": "Error procesando archivo XLSX: Validación fallida: Columnas requeridas faltantes: FECHA, HORA"
}
```

### GET `/api/upload`

Obtiene información sobre la API.

#### Respuesta

```json
{
    "message": "Ruta para procesar archivos de transacciones",
    "instrucciones": {
        "metodo": "POST",
        "formato": "multipart/form-data",
        "campo": "file",
        "tiposAceptados": [".xlsx", ".xls", ".csv"],
        "columnasRequeridasXLSX": ["FECHA", "HORA", "CONCEPTO", "RETIRO", "DEPOSITO", "MONEDA"]
    },
    "endpoint": "/api/upload"
}
```

## Estructura del Proyecto

```
src/app/api/upload/
├── route.ts              # Ruta principal
└── README.md             # Esta documentación
```

src/app/controllers/
└── uploadController.ts   # Controlador de carga

src/app/services/
└── uploadService.ts      # Servicio de carga

src/helpers/
├── handlingXLSX.ts       # Funciones de procesamiento XLSX
├── transactionDataExample.ts # Ejemplos de uso
└── README_XLSX.md        # Documentación de helpers
```

## Características

✅ **Validación de archivos**: Verifica tipo y estructura
✅ **Procesamiento XLSX**: Lee y procesa archivos Excel
✅ **Análisis financiero**: Calcula estadísticas automáticamente
✅ **Tipado fuerte**: Usa TypeScript con interfaces definidas
✅ **Manejo de errores**: Captura y reporta errores detallados
✅ **Logs detallados**: Información completa del procesamiento
✅ **Arquitectura limpia**: Separación de responsabilidades

## Validaciones

- ✅ Tipo de archivo (.xlsx, .xls, .csv)
- ✅ Presencia de columnas requeridas
- ✅ Estructura de datos válida
- ✅ Campos obligatorios (fecha, concepto)
- ✅ Lógica de negocio (retiro XOR depósito)

## Próximos Pasos

1. **Inserción en BD**: Activar la inserción en base de datos
2. **Procesamiento CSV**: Implementar soporte completo para CSV
3. **Validaciones adicionales**: Agregar más reglas de negocio
4. **Autenticación**: Proteger la ruta con autenticación
5. **Rate limiting**: Limitar número de peticiones

## Ejemplo de archivo XLSX válido

| FECHA | HORA | CONCEPTO | RETIRO | DEPOSITO | MONEDA |
|-------|------|----------|--------|----------|--------|
| 2024-01-15 | 09:30 | Pago de servicios | 500.00 | | MXN |
| 2024-01-15 | 14:20 | Depósito de nómina | | 5000.00 | MXN |
| 2024-01-16 | 10:15 | Compra en línea | 1200.50 | | MXN | 