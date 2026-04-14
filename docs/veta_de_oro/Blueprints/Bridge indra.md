# BLUEPRINT: INDRA BRIDGE v2.0 — EL ORQUESTADOR SOBERANO

## 🧘 DHARMA (Propósito)
El **Indra Bridge** es el tejido conectivo entre la *Forma* (Satélite/UI) y la *Materia* (Core/Silos). Su misión es permitir la configuración dinámica del espacio de trabajo y la resonancia de esquemas sin intervención manual en la base de datos.

---

## 🏗️ ARQUITECTURA DE LA INTERFAZ (HUD)

### 1. HEADER: IDENTIDAD Y ACCESO
- **Identificación del Core:** Muestra el ID único de la instancia de Indra vinculada.
- **Metadata del Satélite:** Nombre del satélite actual, versión y propietario.
- **Estado de Sesión:** Usuario activo (Google Auth) y botón de Login/Logout centralizado.

### 2. CARD I: CONFIGURACIÓN DEL WORKSPACE
- **Selector de Entorno:** Capacidad de "Seleccionar" un entorno existente o "Crear" uno nuevo.
- **Axioma de Nombramiento:** Sugerencia inteligente de usar el nombre del satélite para el nuevo workspace para mantener la coherencia.
- **Workspace Default:** Definición del entorno raíz para la herramienta actual.

### 3. CARD II: PANEL DE ESQUEMAS (Árbol de Resonancia)
Visualización en vista de árbol donde cada nodo es un Schema interactivo:
- **Metadata del Schema:**
    - Nombre del Schema.
    - **Ubicación HTML:** Referencia al archivo `.html` y el selector CSS del contenedor/form que lo requiere.
    - **Relaciones de Acción:** Botones y disparadores vinculados a este schema.
- **Lista de Propiedades (Sub-cards):**
    - Identidad (Nombre + Tipo de dato).
    - **Vínculo con Silos:** Capacidad de asociar cada propiedad a una columna física (Google Sheets), una base de datos Notion, o una tabla SQL.

### 4. CARD III: WORKFLOW & AUTOMATION DESIGNER
Panel de ancho total para el descubrimiento y diseño de flujos de trabajo en Indra.
- **Lista de Automatizaciones:** Vista lateral de flujos existentes.
- **Editor de Lógica:** Integración de los motores de macro-lógica (`BridgeDesigner` C:\Users\javir\Documents\DEVs\INDRA FRONT END\system_core\client\src\components\macro_engines\BridgeDesigner y `WorkflowDesigner` C:\Users\javir\Documents\DEVs\INDRA FRONT END\system_core\client\src\components\macro_engines\WorkflowDesigner).
- **Sincronización:** Capacidad de importar/exportar la lógica del flujo en formato JSON soberano.

---
REVISAR SIMEPRE EL C:\Users\javir\Documents\DEVs\INDRA FRONT END\system_core\core para tomar las deciciones mas axioamticas, eficientes y compatibles.


## 🛠️ PRÓXIMOS PASOS (ROADMAP)
1.  **Refactor del Bridge:** Actualizar `IndraBridge.js` para permitir la inyección de flujos desde el JSON local del Satélite.
2.  **Módulo Discovery:** Crear el escáner que mapea slots HTML -> Propiedades de Schema.
3.  **UI Bridge HUD:** Implementar la interfaz visual en el ERP siguiendo los tokens de diseño.
