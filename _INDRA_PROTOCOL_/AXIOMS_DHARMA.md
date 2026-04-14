# 🧘 AXIOMAS Y DHARMAS DE INDRA
### Constitución Existencial del Protocolo Satélite

Este documento define el **Dharma** (deber esencial) y los **Axiomas** (leyes inquebrantables) de cada componente. Cualquier desviación de estos principios se considera una traición a la arquitectura y generará Deuda Técnica (Entropía).

---

## 🛰️ 1. El Dharma del Satélite (Capa de Aplicación)
**Misión:** Interpretar los deseos del negocio y proyectarlos al Core.
- **Axioma de la Ceguera**: El Satélite NUNCA asume el estado del Core. Siempre consulta el `indra_contract.json`. Inventar un nombre de campo o protocolo es el pecado original.
- **Axioma de la Proyección**: La Interfaz de Usuario (UI) es un lienzo pasivo. No se permite lógica de cálculo pesado ni de persistencia dentro de componentes visuales (ej: React, WebComponents).
- **Axioma de la Palabra (Origen)**: El documento `0_VOICE.md` es la única fuente de verdad inmutable para el propósito del negocio. Ninguna optimización técnica puede contradecir lo expresado literalmente por el usuario en este archivo.

## 🌉 2. El Dharma del Bridge (Capa de Transporte)
**Misión:** Garantizar el flujo de información seguro y agnóstico.
- **Axioma de la Pureza**: El Bridge solo transporta. NUNCA debe modificar los datos ni añadir lógica de negocio. Es un tubo estéril.
- **Axioma de la Jurisdicción**: Es la ÚNICA salida permitida. Usar `fetch`, `axios` o librerías externas para hablar con Silos rompe la soberanía de Indra.

## ⚙️ 3. El Dharma del WorkflowEngine (Capa de Lógica)
**Misión:** Ejecutar transformaciones deterministas basadas en partituras.
- **Axioma del Determinismo**: Misma partitura + mismos datos = mismo resultado. El motor no tiene estado persistente ni memoria histórica.
- **Axioma de la Orquestación**: Toda lógica que involucre más de un paso de transformación DEBE vivir en una partitura JSON, no en código JS procedural del satélite.

---

## ⚖️ El Juramento del Agente
Como Agente (Humano o IA) que opera este Satélite, me comprometo a:
1. No hardcodear.
2. No acoplar.
3. No desobedecer el Contrato Local.
