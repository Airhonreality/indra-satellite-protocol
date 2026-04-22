# 🛰️ INDRA GIT PROTOCOL (Mantenimiento de Órbita)

Este documento define el canon para mantener la sincronía entre el **Satélite** (tu proyecto) y el **Core** (el motor Indra).

## 1. La Arquitectura Dual
Indra OS no vive en tu repositorio principal, vive en un **Submódulo**. Esto permite que el motor evolucione independientemente de tu lógica de negocio.

*   **Tu Repo (Satélite)**: Contiene tu carpeta `/src`, tus estilos y tu configuración.
*   **Carpeta `_INDRA_PROTOCOL_`**: Es un túnel hacia el motor oficial.

## 2. Flujos Canónicos para Humanos e IAs

### A. Actualizar el Motor (Core Pull)
Si sale una nueva versión del Bridge o del Hub, debes traerla sin romper tu código:
```bash
# Desde la raíz del Satélite
git submodule update --remote --merge
```

### B. Guardar Cambios del Satélite
Cuando termines una funcionalidad en tu carpeta `/src`:
```bash
git add .
git commit -m "feat: nueva lógica de cotización en veta"
git push
```

### C. Contribuir al Core (Solo Desarrolladores Senior)
Si encuentras un bug en el motor y quieres arreglarlo para todos:
1. Entra en `_INDRA_PROTOCOL_`.
2. Haz tus cambios.
3. Haz commit y push **dentro** de esa carpeta.
4. Sal a la raíz y haz commit del "pointer" del submódulo.

## 3. Resolución de Conflictos
*   **REGLA DE ORO**: Nunca hagas commit de cambios en `_INDRA_PROTOCOL_` a menos que sepas que estás modificando el motor global.
*   Si un `git pull` falla por archivos en el protocolo, usa `git checkout _INDRA_PROTOCOL_` para resetear el motor a su estado oficial.

---
*Indra OS - Git Protocol v16.3*
