# BLUEPRINT: CARD III — Motor Híbrido de Automatización (Sovereign Hybrid Flow v1.0)

Este documento detalla la ingeniería y el diseño de la tercera pieza del Bridge HUD: el motor que fusiona la orquestación (Workflow) con la transformación de datos (Bridge) en un único lienzo ligero para Satélites Indra.

---

## 🏛️ 1. Filosofía y Arquitectura (Agnosticismo Radical)

El motor abandonará la pesadez de React para adoptar una arquitectura de **Componentes Funcionales Vanilla**. Su mantra es: *"La interfaz es una proyección del JSON, y el JSON es la única verdad"*.

### Concepto de "Doble Capa":
1.  **Macro-Flujo (The Spinal Cord):** El eje vertical que conecta estaciones.
2.  **Micro-Lógica (The Nerve Endings):** Bridges anidables dentro de cada estación para resolver el mapeo de datos local.

---

## 🎨 2. Diseño de la Interfaz (The Hybrid Canvas)

Basado en un diseño de **Tríptico Industrial v1.618** (Proporción Áurea).

### A. Panel Izquierdo: El Índice de Intenciones (38.2%)
- **Explorador de Átomos:** Lista de automatizaciones activas en el satélite.
- **Outline del Flujo:** Una vista "minimizada" y textual de los pasos del flujo seleccionado (ej: `01_TRIGGER > 02_MAP_INVENTORY > 03_CALC_NESTING > 04_POST_TO_NOTION`).
- **Lupa de Diagnóstico:** Mini-consola que muestra el `trace_log` del último handshake.

### B. Gran Panel Derecho: El Lienzo de Manifestación (61.8%)
Un área de scroll infinito que aloja el **Layout de Estaciones**.

#### Estructura de la Estación (La Unidad Atómica):
Cada paso del flujo es una card con tres estados:
1.  **Estado "Ghost":** Solo muestra el nombre y el tipo de acción (Gatillo, Transformación, Salida).
2.  **Estado "Active" (El Híbrido):** Al expandirse, revela su naturaleza:
    -   **Si es una ACCIÓN:** Selector de protocolo (ej: `ATOM_CREATE`) y proveedor.
    -   **Si es un BRIDGE (Sub-paso):** Abre un mini-mapeador de campos (Input -> Operator -> Output). Se incrusta una versión reducida de la "Card 2" aquí.
3.  **Estado "Error/Broken":** Resaltado en `--color-error` si el `IndraDiscovery` detecta que el slot ya no existe en el core.

### C. HUD de Control (Superior):
- **Botón de Handshake:** Fuerza el descubrimiento de slots en el HTML actual.
- **Botón de Ignición:** Sube el nuevo átomo de flujo al Core de Indra.

---

## ⚙️ 3. El Protocolo de Datos (JSON Soberano)

La Card III leerá y escribirá un átomo unificado de clase `HYBRID_FLOW`.

```json
{
  "class": "HYBRID_FLOW",
  "handle": { "alias": "cotizacion_industrial_v2", "label": "Flujo de Cotización Cocinas" },
  "payload": {
    "trigger": { "type": "DOM_ACTION", "element_id": "btn-generate-quote" },
    "pipeline": [
      {
        "id": "st-001",
        "type": "BRIDGE_PROCESSOR",
        "alias": "map_ui_to_internal",
        "config": {
          "operators": [
            { "id": "calc_iva", "type": "MATH", "params": { "op": "*", "val": 1.19 } }
          ],
          "mappings": { "indra-slot-total": "calc_iva.result" }
        }
      },
      {
        "id": "st-002",
        "type": "PROTOCOL_CALL",
        "config": {
          "provider": "drive",
          "protocol": "TABULAR_WRITE",
          "context_id": "silo_finanzas"
        }
      }
    ]
  }
}
```

---

## 🛠️ 4. Reglas de Fabricación para el Agente (SOP)

El agente encargado de implementar este repo semilla debe seguir estas constantes:

1.  **Independencia de DOM:** El motor de lógica debe estar separado del renderizador. Debe poder ejecutarse `simulateFlow(json, input)` sin tener un navegador abierto (para tests).
2.  **Inyección de Temas:** Todos los colores deben ser tokens CSS (`var(--color-brass)`), permitiendo que el satélite herede el tema oscuro/claro automáticamente.
3.  **Discovery Reactivo:** Al cargar la Card 3, el primer paso es **SIEMPRE** llamar a `IndraDiscovery.scanLocal(document)`. Si no hay slots en el HTML, el diseñador se bloquea avisando que "No hay resonancia en este Satélite".

---

## 📋 5. Roadmap de Sincronización

1.  **Fase 1:** Creación del `AgnosticFlowEngine.js` en el repo Semilla (Lógica pura de resolución del JSON).
2.  **Fase 2:** Diseño de los `Web Components` (Vanilla) para las estaciones y conectores en el Satélite.
3.  **Fase 3:** Integración del handshanking vía Git para descargar el `manifest.json`.

---
*Indra: Donde el flujo es fluido y el puente es inquebrantable.*
