# 🧘 AXIOMAS Y DHARMAS DE INDRA (v2.5)
### Constitución Existencial del Protocolo Satélite

Este documento es tu **Ley Primera**. Cualquier desviación genera corrupción de datos y fallo en la sincronización.

---

## 🏛️ AXIOMA 0: La Jerarquía Maestra
**Indra Core (GAS) es el cerebro; el Satélite es la extremidad.**
*   El Satélite no "manda", el Satélite "peticiona".
*   Toda decisión de persistencia, seguridad o filtrado complejo OCURRE en el Core. Si lo intentas hacer en el Satélite, fallarás.

## 🛰️ 1. El Dharma del Satélite (Capa de Soberanía)
**Misión:** Proyectar la voluntad del negocio en interfaces estéticas y funcionales.
*   **Axioma de la Autonomía**: El Satélite es dueño de su `src/`. Nadie más vive ahí.
*   **Axioma de la Ignorancia Útil**: El Satélite no sabe qué hay dentro de Drive o Notion. Solo sabe preguntar al Bridge usando el nombre del esquema (`alias`).
*   **Prohibición de Alucinación**: No inventes campos. Si el campo no está en `indra_contract.json`, no existe en la realidad.
* 5.  **Axioma de la Resonancia Obligatoria**: Ningún satélite operará en el vacío. Durante la ignición (`init`), el Bridge debe proyectar (`crystallize`) su contrato local hacia el Core para sincronizar esquemas y asegurar la integridad de las automatizaciones globales.
6.  **Axioma de la Espina Dorsal**: Toda UI o Automatización debe nacer de un esquema claro en `src/score/schemas/`. La IA tiene prohibido inventar campos que no existan en la espina dorsal. UI (HTML), toda Automatización (Workflow) y toda Lógica de Negocio debe "beber" de los esquemas modularizados allí residentes. El Agente tiene prohibido crear un formulario sin antes citar o definir su esquema en esta carpeta.

## 🌉 2. El Dharma del Bridge (Capa de Infraestructura)
**Misión:** Ser el mensajero estéril y perfecto.
*   **Axioma de la Intocabilidad**: La carpeta `_INDRA_PROTOCOL_` es infraestructura de red. **UN AGENTE TIENE PROHIBIDO MODIFICAR ESTE CÓDIGO.** No inyectes lógica de negocio, botones o variables de aplicación aquí. La corrupción de esta capa destruye el nexo con el Core.
*   **Axioma del Canal Único**: Cualquier `fetch` o `axios` fuera del Bridge es una brecha de seguridad y será revertida.

## ⚙️ 3. El Dharma del Contrato (ADN)
**Misión:** Definir qué es real y qué es posible.
*   Toda entidad de negocio (Cliente, Producto, Cotización) debe tener una entrada en el contrato antes de ser programada en la UI.

---

## ⚖️ El Juramento del Agente
Si eres una IA, al leer esto has "asimilado" la arquitectura. Si hardcodeas, si tocas el Bridge o si ignoras los esquemas, estás actuando contra tu propia programación de integridad.
