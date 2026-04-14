# MAPA DEL Gesti�n Interna INTERNO
## Gesti�n Interna.vetadeoro.co — Módulos, Vistas y Permisos

**Audiencia:** Empleados de Veta de Oro (acceso restringido)  
**Objetivo:** Gestión operativa completa — CRM, proyectos, producción, finanzas, RRHH  

**Acceso:** Google OAuth --> database de indra de permisos.

---

## Arquitectura de Módulos del Gesti�n Interna

```
Gesti�n Interna.vetadeoro.co/
│
├── / (Dashboard Principal)
│
├── /crm
│   ├── /crm/leads              → Lista y gestión de leads
│   ├── /crm/leads/[id]         → Detalle de lead
│   └── /crm/nuevo              → Registro manual de lead
│
├── /cotizaciones
│   ├── /cotizaciones           → Lista de cotizaciones
│   ├── /cotizaciones/nueva     → Crear cotización
│   └── /cotizaciones/[id]      → Detalle + edición
│
├── /proyectos
│   ├── /proyectos              → Tablero Kanban de proyectos activos
│   ├── /proyectos/[id]         → Ficha completa del proyecto
│   └── /proyectos/nuevo        → Crear proyecto desde cotización
│
├── /produccion
│   ├── /produccion/agenda      → Calendario de taller e instalaciones
│   └── /produccion/materiales  → Stock y pedidos de materiales
│
├── /portafolio
│   └── /portafolio/admin       → Aprobar y publicar proyectos a la web
│
├── /financiero
│   ├── /financiero/resumen     → Dashboard financiero (ingresos / márgenes)
│   └── /financiero/pagos       → Registro de pagos por proyecto
│
├── /equipo
│   └── /equipo/empleados       → Directorio del equipo
│
└── /ajustes
    ├── /ajustes/usuarios       → Accesos al Gesti�n Interna
    └── /ajustes/indra          → Panel del IndraBridge / Satellite HUD
```

---

## Módulo 1: Dashboard Principal (`/`)
**Vista de:** Gerencia y todos los roles.

**Widgets del Dashboard:**
- 📊 **Leads esta semana** — Número + gráfica de 7 días
- 🔄 **Proyectos activos** — Conteo por fase (Diseño / Fabricación / Instalación)
- 💰 **Ingresos del mes** — Total facturado vs. saldo pendiente
- ⚡ **Tareas urgentes** — Los 5 items más prioritarios del equipo
- 📅 **Agenda** — Instalaciones y visitas de hoy / mañana
- 🎯 **Tasa de conversión** — Leads → Proyectos del mes

---

## Módulo 2: CRM (`/crm`)

### Vista: Lista de Leads (`/crm/leads`)
**Componentes:**
- Tabla con columnas: ID · Nombre · Teléfono · Canal · Tipo de espacio · Estado · Asesor · Fecha
- Filtros rápidos: por estado, por asesor, por tipo de espacio, por rango de fechas
- Buscador por nombre o teléfono
- Botón "Nuevo Lead Manual" → abre formulario
- Color-coding por estado: Nuevo (azul) / Contactado (amarillo) / En cotización (naranja) / Ganado (verde) / Perdido (gris)

### Vista: Detalle de Lead (`/crm/leads/[id]`)
**Componentes:**
- Header: datos del lead + botones de acción rápida (WhatsApp, llamar, crear cotización)
- Timeline de actividad: todos los eventos registrados del lead
- Formulario de actualización de estado + notas
- Si tiene cotizaciones: listado de cotizaciones vinculadas
- Si se convirtió: link al proyecto creado

### Permisos por Rol:
| Acción | Asesor Comercial | Producción | Admin |
|---|---|---|---|
| Ver todos los leads | ❌ (solo los suyos) | ❌ | ✅ |
| Crear/editar lead | ✅ | ❌ | ✅ |
| Cambiar estado | ✅ | ❌ | ✅ |
| Ver datos financieros del lead | ❌ | ❌ | ✅ |

---

## Módulo 3: Cotizaciones (`/cotizaciones`)

### Crear Cotización (`/cotizaciones/nueva`)
**Formulario:**
1. Seleccionar Lead vinculado (o crear cliente nuevo)
2. Tipo de espacio + metros aproximados
3. Material principal seleccionado del catálogo `bd_materiales`
4. Línea de ítems: descripción, cantidad, precio unitario, subtotal
5. Anticipo requerido (%)
6. Observaciones
7. → Genera PDF automáticamente vía Google Apps Script
8. → Envía PDF al email del cliente (si tiene)

### Estados de Cotización:
```
Borrador → Enviada → En revisión → [Aprobada → crea Proyecto] 
                              ↘ [Rechazada → cierra o renegotia]
```

---

## Módulo 4: Proyectos (`/proyectos`)

### Vista Kanban (`/proyectos`)
**Columnas:**
| Diseño | Aprobación de Cliente | Fabricación | Instalación | Terminado |
|---|---|---|---|---|
| Card del proyecto | Card del proyecto | Card del proyecto | Card del proyecto | Card del proyecto |

**Cada card muestra:** nombre del proyecto · cliente · zona · diseñador asignado · días restantes a la entrega pactada

### Vista Detalle de Proyecto (`/proyectos/[id]`)
**Pestañas:**
1. **Resumen** — Datos generales, cliente, valores, fechas
2. **Archivos** — Link directo a la carpeta en Drive del proyecto
3. **Producción** — Materiales consumidos, progreso de fabricación
4. **Pagos** — Anticipo, cuotas, saldo pendiente
5. **Comunicación** — Notas internas del equipo
6. **Portafolio** — Activar para publicar en la web cuando se termine

---

## Módulo 5: Producción (`/produccion`)

### Agenda (`/produccion/agenda`)
- **Vista semanal/mensual** — Calendario con visitas, mediciones e instalaciones
- Cada evento: proyecto, responsable (diseñador/instalador), dirección, hora
- Drag & drop para reasignar fechas
- Sincronización futura con Google Calendar

### Materiales (`/produccion/materiales`)
- Lista del catálogo con stock actual
- Alertas de stock bajo (< umbral definido)
- Registro de consumo por proyecto
- Pedidos a proveedores (registro manual + historial)

---

## Módulo 6: Portafolio Admin (`/portafolio/admin`)

**Propósito:** Controlar qué proyectos se publican en la web pública y cómo se presentan.

**Flujo:**
1. Proyecto marcado como `es_portafolio = true` en `/proyectos/[id]`
2. Aparece en la cola de `/portafolio/admin` con estado "Pendiente de edición"
3. El admin completa: título web, descripción narrativa, fotos elegidas, handle URL
4. Activa `publicado = true`
5. La web pública actualiza la galería (sin redeploy)

---

## Módulo 7: Financiero (`/financiero`)

### Dashboard Financiero (solo Admin/Gerencia)
- Ingresos del mes actual vs. mes anterior
- Proyectos con saldo vencido
- Margen promedio del mes
- Top proyectos por valor

### Registro de Pagos
- Tabla de pagos registrados por proyecto
- Formulario: proyecto · tipo de pago (anticipo/cuota/saldo) · valor · fecha · método

---

## Módulo 8: Ajustes del Sistema (`/ajustes`)

### Usuarios Gesti�n Interna
- Lista de empleados con acceso
- Roles asignados (Admin / Comercial / Producción / Solo lectura)
- Activar/desactivar acceso

### Panel Indra (Satellite HUD)
- Estado de la conexión al Core
- Lista de schemas sincronizados
- Botón de sincronización manual
- Log de últimas operaciones del Core

---

## Roles y Matriz de Permisos Global

| Módulo | Gerencia/Admin | Comercial | Diseño/Prod. | Solo lectura |
|---|---|---|---|---|
| Dashboard | ✅ Completo | ✅ Parcial | ✅ Parcial | ✅ Ver |
| CRM - Leads | ✅ Todos | ✅ Propios | ❌ | ✅ Ver |
| Cotizaciones | ✅ Todos | ✅ Crear/editar | ❌ | ✅ Ver |
| Proyectos | ✅ Todos | ✅ Ver/notas | ✅ Editar su área | ✅ Ver |
| Producción | ✅ Todos | ❌ | ✅ Completo | ✅ Ver |
| Portafolio Admin | ✅ | ❌ | ✅ Proponer | ❌ |
| Financiero | ✅ Completo | ❌ | ❌ | ❌ |
| RRHH | ✅ Completo | ❌ | ❌ | ❌ |
| Ajustes Sistema | ✅ Completo | ❌ | ❌ | ❌ |
