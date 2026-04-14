# 📖 INDRA SATELLITE COOKBOOK
### Recetario de Patrones Industriales para Satélites

Este documento contiene soluciones probadas para problemas comunes de negocio usando el Indra Satellite Protocol.

---

## 1. Persistencia de Documentos (PDF a Drive)
**Problema:** Generar un PDF en el navegador (ERP) y guardarlo de forma automática en una carpeta específica de Google Drive sin intervención del usuario.

### El Patrón Canónico
Indra soporta el transporte de archivos binarios mediante el axioma de **Transporte en Base64**.

#### Implementación:
```javascript
// 1. Genera tu PDF con jspdf o html2pdf
const doc = new jsPDF();
doc.text("Contenido de la propuesta", 10, 10);
const base64Content = doc.output('datauristring').split(',')[1]; // Limpiar prefijo

// 2. Usa el método evolutivo del Bridge
await bridge.uploadFile(
    'Propuesta_Veta_Oro.pdf', 
    base64Content, 
    'ID_CARPETA_CLIENTE' // Opcional
);
```

### Por qué funciona:
El Bridge utiliza el protocolo `ATOM_CREATE` del proveedor `drive`. Al enviar la propiedad `file_base64`, el Core comprende que no debe crear un átomo de metadata, sino un **Archivo Físico** usando el servicio `Utilities.newBlob()` de Google.

---

## 2. Orquestación de Cálculos en Satélite
**Problema:** Necesitas aplicar una fórmula de ingeniería a datos sensibles antes de mostrarlos.

### El Patrón Canónico
Usa el `WorkflowEngine` local con el provider `pipeline` y el protocolo `TRANSFORM_COMPUTE`.

```javascript
const result = await engine.execute({
    stations: [{
        provider: 'pipeline',
        protocol: 'TRANSFORM_COMPUTE',
        mapping: { formula: "price * 1.15", target_field: "price_with_tax" }
    }]
}, { price: 100 });
```

---

*Añade aquí nuevos patrones conforme los satélites colonicen nuevas funcionalidades.*
