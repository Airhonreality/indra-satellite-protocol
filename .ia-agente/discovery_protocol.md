# 🛰️ Protocolo de Autodescubrimiento de IA (v2.3)

Este protocolo es ejecutado por el Agente (Antigravity) para mapear la Lógica de Negocio del usuario y transformarla en un Satélite Indra funcional.

## 🎤 Etapa 1: Captura de la Voz (Silos y Entorno)
El Agente debe realizar las siguientes preguntas puntuales:
1.  **¿Cuál es el núcleo de tu negocio?** (Producto, Servicio, Gestión).
2.  **¿Dónde viven tus datos hoy?** (Sheets, Notion, Airtable, etc).
3.  **¿Qué "Pantallas" o estaciones de trabajo necesitas?** (Dashboard, Catálogo, Finanzas, etc).
4.  **¿Cuál es tu ADN visual?** (Colores de marca, tipografía, estilo).

## 🧬 Etapa 2: Mapeo de Resonancia (DNA MCEP)
Basado en las respuestas, el Agente desarrollará:
- **Esquemas JSON**: Mapeo de los campos del Silo a propiedades de Indra.
- **Flujos de Trabajo**: Automatizaciones que operarán en el `WorkflowEngine`.
- **Nodos de UI**: Componentes que reaccionarán a los datos inyectados.

## 🚀 Etapa 3: Ignición del Satélite
Una vez aprobado el mapeo, el Agente procederá a:
1.  Actualizar el `indra_contract.json` con los nuevos esquemas.
2.  Crear los archivos en `src/` correspondientes a la lógica capturada.
3.  Validar la ignición mediante el HUD.
