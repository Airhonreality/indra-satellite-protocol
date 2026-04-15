# Indra Satellite Protocol: Multitenancy & Jurisdiction (v2.5)

## 🏛️ El Axioma de la Resonancia Única
En Indra, la seguridad multi-usuario no se gestiona mediante "logins" complejos dentro del satélite, sino a través de **Enlaces de Resonancia (Capabilities Links)**.

### 1. ¿Cómo funciona la multi-tenencia?
Un mismo código de satélite (ej: `erp-panaderia`) puede atender a N clientes diferentes. 
*   **Acceso**: El Core genera un Token de Resonancia único para cada combinación de `Usuario + Workspace`.
*   **Aislamiento**: Cuando el Satélite recibe este token vía `INDRA_RESONANCE_GRANT`, el Bridge bloquea la sesión a ese **ID de Contexto** único.

## 🛡️ Ley deJurisdicción (Seguridad en el Gateway)
Para evitar la **Entropía de Datos** (ver `ENTROPY_VECTORS.md`), el sistema sigue la **Ley del Gateway**:

1.  **Paquetes Estériles**: La Shell Core (Madre) filtra el contrato antes de enviarlo al Satélite. 
2.  **Exclusión de Infraestructura**: Los esquemas de tipo `CONFIG_SCHEMA` o `SYSTEM_SCHEMA` (Notion, AI Config, etc.) son eliminados en la fuente.
3.  **Jurisdicción de Negocio**: El Satélite solo recibe esquemas de tipo `DATA_SCHEMA`. Lo que el satélite no ve, no puede ser vulnerado.

## 🚀 Implementación Eficiente (Ignición)
Para instalar un sistema multi-usuario en un nuevo satélite indra-ready:

```javascript
import IndraBridge from './core/IndraBridge.js';
const bridge = new IndraBridge();

// Paso A: Escuchar a la Madre
bridge.listenFromShell();

// Paso B: Actuar solo tras el Handshake
window.addEventListener("indra-ready", (event) => {
    const { workspace_id, label } = event.detail;
    console.log(`🛰️ Satélite resonando con: ${label} [${workspace_id}]`);
    // Toda ejecución de bridge.execute() heredará automáticamente este contexto.
});
```

## ☯️ La Sinceridad del Handshake
Si el Satélite detecta que el `core_checksum` no coincide con su `local_checksum`, ejecutará un **Handshake de Sinceridad**.
*   **Si es Soberano**: Actualiza el Core con sus leyes locales.
*   **Si es Esclavo**: Se actualiza a sí mismo con las leyes del Core.
*   **Determinismo**: En multi-usuario, el Core manda sobre la estructura del satélite para garantizar que todos los nodos hablen el mismo idioma.
