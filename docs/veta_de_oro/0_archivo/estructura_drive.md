# ORGANIZACIÓN DE ARCHIVOS EN GOOGLE DRIVE
## Veta de Oro — Estructura Maestra y Convención de Nombres

**Último update:** Abril 2026  
**Responsable:** Administración y Sistemas

---

## Principio de Organización

> **"Un proyecto, una carpeta. Todos los archivos del proyecto viven ahí."**  
> La estructura de Drive refleja la estructura operativa de la empresa. Cualquier empleado que sepa cuál es el proyecto puede encontrar sus archivos en < 30 segundos.

---

## Árbol Maestro de Drive

```
📁 VETA DE ORO (raíz compartida del equipo)
│
├── 📁 01 - PROYECTOS
│   ├── 📁 2025
│   │   └── 📁 PROY-2025-XXXX - [Apellido Cliente] - [Tipo] - [Zona]
│   └── 📁 2026
│       └── 📁 PROY-2026-XXXX - [Apellido Cliente] - [Tipo] - [Zona]
│           ├── 📁 01_Planos          ← Planos técnicos y de instalación
│           ├── 📁 02_Renders         ← Imágenes 3D entregadas al cliente
│           ├── 📁 03_Fotos_Proceso   ← Fotos del taller y la obra
│           ├── 📁 04_Fotos_Final     ← Fotos del proyecto terminado (portafolio)
│           └── 📁 05_Documentos      ← Cotización PDF, contrato, actas
│
├── 📁 02 - COMERCIAL
│   ├── 📁 Cotizaciones               ← PDFs generados automáticamente
│   │   └── COT-2026-XXXX_[Apellido].pdf
│   ├── 📁 Contratos                  ← Plantillas y contratos firmados
│   └── 📁 Material_Comercial         ← Catálogos, presentaciones, brochures
│
├── 📁 03 - MATERIALES Y PROVEEDORES
│   ├── 📁 Fichas_Tecnicas            ← PDFs técnicos de materiales
│   ├── 📁 Cotizaciones_Proveedores   ← Propuestas recibidas de proveedores
│   └── 📁 Ordenes_Compra             ← Órdenes emitidas
│
├── 📁 04 - ADMINISTRACION
│   ├── 📁 Contabilidad
│   │   ├── 📁 Facturas_Emitidas
│   │   └── 📁 Gastos_y_Costos
│   ├── 📁 RRHH
│   │   ├── 📁 Contratos_Empleados
│   │   └── 📁 Nomina
│   └── 📁 Legal
│
├── 📁 05 - MARKETING Y PORTAFOLIO
│   ├── 📁 Fotos_Portafolio           ← Fotos curadas para la web (WebP optimizadas)
│   ├── 📁 Contenido_Redes            ← Posts, stories, videos
│   └── 📁 Identidad_Marca            ← Logos, paleta de colores, tipografías
│
└── 📁 06 - SISTEMAS Y TECH
    ├── 📁 Bases_de_Datos             ← Google Sheets del sistema (bd_leads, bd_proyectos, etc.)
    ├── 📁 Documentacion_Tecnica      ← Manuales del Gesti�n Interna, del Core Indra
    └── 📁 Backups                    ← Exportaciones periódicas de datos
```

---

## Convención de Nombres de Archivos

### Proyectos
```
Formato carpeta:   PROY-[AÑO]-[NÚMERO] - [APELLIDO] - [TIPO] - [ZONA]
Ejemplo:           PROY-2026-0042 - Martínez - Cocina - Chicó
```

### Cotizaciones (PDF)
```
Formato:   COT-[AÑO]-[NÚMERO]_[APELLIDO]_v[VERSIÓN].pdf
Ejemplo:   COT-2026-0042_Martínez_v1.pdf
           COT-2026-0042_Martínez_v2.pdf  (si hay revisión)
```

### Planos
```
Formato:   PROY-[ID]_PLANO_[TIPO]_v[VERSIÓN].[ext]
Ejemplo:   PROY-2026-0042_PLANO_COCINA_v3.dwg
           PROY-2026-0042_PLANO_INSTALACION_v1.pdf
```

### Renders / Imágenes 3D
```
Formato:   PROY-[ID]_RENDER_[VISTA]_v[VERSIÓN].[ext]
Ejemplo:   PROY-2026-0042_RENDER_FRONTAL_v2.jpg
           PROY-2026-0042_RENDER_DETALLE_ISLA_v1.jpg
```

### Fotos del Proceso y Terminado
```
Formato:   PROY-[ID]_FOTO_[ETAPA]_[NÚMERO].[ext]
Etapas:    PROCESO / FINAL
Ejemplo:   PROY-2026-0042_FOTO_FINAL_001.jpg
           PROY-2026-0042_FOTO_FINAL_002.jpg
           PROY-2026-0042_FOTO_PROCESO_001.jpg
```

### Fotos para Web / Portafolio (optimizadas)
```
Formato:   [handle-del-proyecto]_[vista]_[número].webp
Ejemplo:   cocina-calacatta-chico-2026_hero.webp
           cocina-calacatta-chico-2026_detalle-isla_01.webp
```

---

## Reglas de Gestión de Drive

1. **La carpeta del proyecto se crea automáticamente** (AUTO-06) cuando se aprueba la cotización. El asesor NO crea carpetas manualmente.
2. **Los planos siempre tienen versión.** Nunca se sobreescriben archivos — se sube la versión nueva con `_v2`, `_v3`, etc.
3. **Las fotos finales las sube el instalador** el mismo día de la entrega.
4. **Las fotos de portafolio** se procesan (recorte, WebP, optimización) antes de subir a la carpeta `05 - MARKETING Y PORTAFOLIO`.
5. **Los Sheets de bases de datos** viven en `06 - SISTEMAS Y TECH / Bases_de_Datos` y NO se editan manualmente — solo a través del Gesti�n Interna o Indra.
6. **Backups mensuales**: el primer día de cada mes, el admin exporta todos los Sheets como XLSX y los guarda en `06 - SISTEMAS Y TECH / Backups / [AÑO-MES]/`.

---

## Permisos de Drive

| Carpeta | Todos | Comercial | Diseño/Prod. | Admin |
|---|---|---|---|---|
| 01 - PROYECTOS | Ver | Ver + editar sus proyectos | Ver + editar sus proyectos | Control total |
| 02 - COMERCIAL | ❌ | Control total | Ver | Control total |
| 03 - MATERIALES | Ver | ❌ | Control total | Control total |
| 04 - ADMINISTRACION | ❌ | ❌ | ❌ | Control total |
| 05 - MARKETING | Ver | Ver | Subir fotos | Control total |
| 06 - SISTEMAS | ❌ | ❌ | ❌ | Control total |
