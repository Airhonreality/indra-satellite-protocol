# ADR-003: Motor 3D y Arquitectura de Visualización Espacial para Veta de Oro

**Estado:** APROBADO (v2.1 - Enfoque UI Técnico)  
**Fecha:** 2026-04-12  

---

## 1. Contexto

El Dashboard de Indra requiere un módulo de visualización 3D para inspeccionar modelos de carpintería exportados desde SketchUp. El objetivo es proporcionar una herramienta de alta fidelidad para operarios y clientes, permitiendo explorar la estructura técnica del diseño sin salir de la interfaz.

---

## 2. Decisión: Arquitectura de Visualización Desacoplada

Se implementará un **Módulo de Visualización Independiente** basado en **Babylon.js**. El Dashboard actuará exclusivamente como un **Visor (Read-Only)** de activos producidos externamente.

### Especificaciones Técnicas:
- **Motor:** Babylon.js (para escenas complejas y picking avanzado).
- **Interacción:** Órbita, zoom, encuadre de selección y control de visibilidad de grupos/etiquetas.
- **Eficiencia:** Renderizado bajo demanda (Invalidate frame) para minimizar consumo de recursos.
- **Agnosticismo:** El componente debe ser importable tanto en el ERP (Admin) como en el Site Público.

---

## 3. Contrato de Metadatos glTF (Sólo Identificación)

Para que el visor pueda interactuar con los elementos del modelo (resaltar piezas, mostrar nombres), los archivos `.glb` deben incluir los siguientes metadatos en la propiedad `extras`:

```json
{
  "extras": {
    "indra_id": "ID_UNICO_PIEZA",
    "material": "Nombre del Material",
    "skp_tag": "Etiqueta Original SKP"
  }
}
```

---

## 4. Consecuencias

- **Robustez:** El visor es un módulo estanco. Si la lógica de negocio cambia, el visor no se ve afectado.
- **Rendimiento:** Al ser un visor pasivo, la carga computacional es predecible y optimizable.
- **Mantenibilidad:** El código 3D está aislado del resto de los servicios de Indra.

---

## 5. Referencias

- `veta_designer/doc/0_master_plan.md` — Fases de desarrollo del plugin SketchUp
- `veta_designer/pipes/melamine/NestingEngine.js` — Akkira Engine (Bin Packing)
- `veta_designer/adapters/sketchup/main_adapter.rb` — Puente Ruby ↔ JS
- `logica_negocio/0_archivo/Investigaciones/gestion de modelos 3d.md` — Investigación de motores (Indra)
- `logica_negocio/02_BASES_DE_DATOS/indice_databases.md` — Esquemas BD-10, BD-11, BD-15
