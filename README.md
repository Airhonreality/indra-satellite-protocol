# 🛰️ INDRA SATELLITE OS (SDK v16.3 Industrial)

> [!IMPORTANT]
> **🤖 AGENCY_BOOTSTRAP (LLM Entry Point)**
> Si eres un agente de IA, sigue esta secuencia lineal para entender e interactuar con este repositorio:
> 1. Leer `satellite.manifest.json` (DNI y Directivas).
> 2. Leer `git_protocol.md` (Mantenimiento de Órbita).
> 3. Consultar `docs/IGNITION_FLOW.md` (Jerarquía de Carga).
> 4. **REGLA DE ORO**: No edites nada dentro de `_INDRA_PROTOCOL_`. Toda personalización ocurre en `/src/` o `indra_config.js`.

## 🧬 El Paradigma de "Resonancia Autónoma"
En la versión 16.3, Indra se consolida como un **SDK Industrial**. El Satélite ya no es una "página con scripts", es una entidad soberana que corre sobre el **Indra Hub (Bootloader)**.

### ⚡ Pilares de la v16.3
1.  **Hub-Centricity**: Un único punto de entrada (`indra_hub.js`) que orquesta el Bridge, el Kernel y el HUD.
2.  **Shadow Isolation**: La interfaz de control (HUD) está blindada en un Shadow DOM, inmune al CSS del satélite.
3.  **Zero-Config Ignition**: Capacidad de arranque automático sin archivos de configuración obligatorios.
4.  **Agentic Discovery**: Arquitectura diseñada para que IAs puedan mantener y escalar el código sin fricción.


---

## 🏗️ Arquitectura Modular (El Nexus v5.0)
El corazón del sistema (`IndraBridge.js`) coordina varias capas autónomas:

*   **`IdentityNode.js`**: Gestión de Handshake y Ciudadanía Soberana.
*   **`ContractCortex.js`**: El cerebro que decide qué ADN cargar (Local vs Global) en tiempo real.
*   **`ResonanceSync.js`**: Orquestación de la Cristalización y cálculo de Drift.
*   **`CapabilitiesResolver.js` (NUEVO)**: El Oráculo que resuelve proveedores y protocolos dinámicamente.

---

## 🛠️ Guía de Desarrollo Agnóstico (Buenas Prácticas)

Para que un Satélite sea verdaderamente soberano, **no debe asumir nada** sobre la infraestructura física y debe ser **Reactivo** ante el estado del motor.

1.  **Chasis Primero**: Renderiza tu UI inmediatamente. No esperes al Bridge para mostrar el Chasis.
2.  **Consulta al Oráculo**: Usa `bridge.capabilitiesOracle.getPreferredProvider('CLASE_ATOMA')`.
3.  **Ignición en 2 Pasos**: Sigue el flujo `ATOM_CREATE` -> `SYSTEM_SCHEMA_IGNITE`.
4.  **Estados de Carga**: Observa `bridge.status` para mostrar Skeletons mientras el motor está en `IGNITING`.

---

## 🏗️ Cómo crear tu Satélite (Contrato de Ignición)

Para que el Hub pueda cargar tu lógica, tu archivo principal (ej. `/src/app.js`) debe exportar una función estándar:

```javascript
/* src/app.js */

export async function ignite(bridge, kernel) {
    console.log("🚀 Motor Indra listo. Iniciando negocio.");
    
    // 1. Usar el Bridge para traer datos
    const data = await bridge.execute({ protocol: 'TABULAR_STREAM', schema_id: 'master_inventory' });

    // 2. Usar el Kernel para hidratar esquemas reactivos
    await kernel.hydrateSchema('ventas');
    
    // 3. Montar tu UI (React, Vanilla, etc.)
}
```


---

## 🏗️ Cómo usar el Oráculo

```javascript
// Dentro de un onReady:
const provider = bridge.capabilitiesOracle.getPreferredProvider('DATA_SCHEMA');
```

---

## 🌀 Invocación de Herramientas (Portales)
Tu satélite puede invocar la potencia bruta de las UIs de Indra como funciones locales:

```javascript
const bridge = new IndraBridge();
const result = await bridge.invokeUI('MEDIA_EXPLORER', { persist: false });
```

---

## 🛂 Archivos de Ciudadanía
*   `_INDRA_PROTOCOL_/indra_config.js`: Tu identidad soberana persistente.
*   `_INDRA_PROTOCOL_/indra_contract.js`: Opcional en desarrollo, obligatorio para despliegues estáticos ("Snapshot").

---
**Axioma de Indra**: *"El ADN no es un dato guardado, es una instrucción latiendo."* 🛰️💎🔥

