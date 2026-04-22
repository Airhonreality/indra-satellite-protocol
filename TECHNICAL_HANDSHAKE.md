# 🤝 TECHNICAL HANDSHAKE: Guía de Programación Industrial (v15.0)

Este documento es el manual de operaciones tácticas para desarrolladores de Satélites Indra. Aquí termina la filosofía y empieza el determinismo.

---

## 1. El Ciclo de Vida de la Identidad
Un Satélite NO ES SOBERANO si no conoce sus silos físicos. Nunca asumas que el Core resolverá un nombre por ti en caliente de forma eficiente.

### ❌ Lo que NO debes hacer (Enrutamiento Perezoso)
```javascript
// Malo: Fuerza al Core a buscar en el Ledger Global (Lento y propenso a errores de contexto)
bridge.execute({ 
    protocol: 'TABULAR_STREAM', 
    schema_id: 'master_inventory' 
});
```

### ✅ El Estándar Industrial (Enrutamiento por Identidad)
Usa el método `resolveSilo()` para obtener la dirección física antes de llamar al Core.

```javascript
// 1. Obtener la llave maestra desde el contrato local
const silo = bridge.resolveSilo('master_inventory');

// 2. Ejecutar con puntería láser
const response = await bridge.execute({
    protocol: 'TABULAR_STREAM',
    provider: silo.provider, // 'sheets'
    context_id: silo.id      // '1ABC_ID_REAL_DE_LA_HOJA'
});
```

---

## 2. Ignición de Materia (Silos)
Cuando exportas un esquema desde el Satélite al Core, debes ser explícito sobre quién materializará la materia tabular.

### El Protocolo `SYSTEM_SCHEMA_IGNITE`
*   **Axioma**: Drive es el bibliotecario (carpetas), Sheets es el escriba (tablas).
*   **Regla**: Todo esquema tabular DEBE ser ignitado en el motor de `sheets`.

```javascript
await bridge.execute({
    protocol: 'SYSTEM_SCHEMA_IGNITE',
    provider: 'system',
    context_id: schema_atom_id,
    data: { 
        target_provider: 'sheets', // OBLIGATORIO para crear Spreadsheets
        workspace_id: activeWorkspaceId 
    }
});
```

---

## 3. Ingesta Industrial (Peristalsis)
Para grandes volúmenes de datos (>100 filas), NO uses `execute` de forma manual. Usa el motor peristáltico para evitar colapsos de red.

```javascript
const sync = bridge.synergize({
    source: { provider: 'notion', id: '...' },
    target: { provider: 'sheets', id: '...' },
    chunkSize: 50,
    onProgress: (p) => console.log(`Progreso: ${p.percent}%`)
});

await sync.start();
```

---

## 4. Los 3 Pilares del Éxito del Satélite
1.  **Detección de Drift**: Antes de guardar, usa `ResonanceSync` para verificar si el ADN local coincide con el ADN remoto.
2.  **Sinceridad UI (Skeletons)**: No muestres datos vacíos. Usa estados de carga basados en `bridge.status`.
3.  **Falla Ruidosa**: Si `resolveSilo` falla, no sigas. Informa al usuario que el anclaje de resonancia ha fallado.

---
⚡🌞 **Indra OS: La Malla es el Mensaje.** 🌞⚡
