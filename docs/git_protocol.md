# 🛰️ INDRA GIT PROTOCOL (Handbook Operativo v1.0 SEED)

Este documento es el mapa para que cualquier Arquitecto, desde cualquier rincón de la Malla (incluyendo zonas de baja conectividad como la Patagonia), pueda levantar y mantener su Satélite con total soberanía.

## 1. El Portal de Entrada (Descarga Quirúrgica)
Para no contaminar tu disco y ahorrar ancho de banda, descarga **únicamente** la semilla del Satélite:

```bash
# 1. Clonación del Satélite Semilla (Lanzamiento Independiente)
git clone https://github.com/Airhonreality/indra-satellite-protocol.git MiSatelite

# 2. Entrada al Nodo
cd MiSatelite

# 3. Instalación de Dependencias (Motor Vite)
npm install

# 4. Ignición
npm run dev
```

## 2. El Axioma de la Paz Estructural (Soberanía de Código)
Para que puedas actualizar tu Satélite sin que el motor oficial borre tu lógica de negocio, el sistema se divide en dos dimensiones:

| Dimensión | Carpeta | Regla de Oro |
| :--- | :--- | :--- |
| **EL MOTOR** | `/_INDRA_PROTOCOL_/` | **NO TOCAR.** Esta carpeta pertenece al Núcleo de Indra. Cualquier actualización oficial solo impactará aquí. |
| **EL ALMA** | `/src/` | **TU SOBERANÍA.** Aquí construyes tu flujo, tus pantallas y tus esquemas. Git respetará tus cambios aquí. |

## 3. Protocolo de Actualización (Safe Pull)
Cuando el equipo de Indra lance una mejora en el motor (ej: parches de resiliencia de red), sigue este ritual para actualizarte sin miedo:

1.  **Asegura tu Materia**: Haz un commit de tus cambios en `/src`.
    `git add . && git commit -m "Mi progreso local"`
2.  **Invoca la Actualización**:
    `git pull origin main`
3.  **Resolución de Resonancia**: 
    - Si hay conflictos en `/_INDRA_PROTOCOL_`, prioriza siempre `ours` (lo oficial).
    - Si hay conflictos en `src/app.js` (el punto de encuentro), fúndelos con cuidado. Tu lógica vive en tus Materializadores.

## 4. Despliegue en Producción (GitHub Pages)
Este repositorio está pre-configurado para Producción. 
- Al subirlo a GitHub Pages, el sitio servirá `index.html` (Tu App).
- Conservarás el acceso a `architect.html` para configuración privada.

---
*Indra OS - Git Protocol v1.0 Sovereign Seed* 🛰️💎🔥
