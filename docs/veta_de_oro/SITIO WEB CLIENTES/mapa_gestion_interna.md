# MAPA DE GESTIÓN INTERNA: Ecosistema Veta de Oro
## Gestión Operativa, Técnica y Financiera (Indra v3.0)

**Audiencia:** Equipo interno de Veta de Oro y Terceros autorizados.  
**Objetivo:** Centralizar la inteligencia de fabricación, el control financiero y el seguimiento de proyectos.  
**Acceso:** Google OAuth --> Base de datos de permisos Indra.

---

## 🧭 Arquitectura de Módulos (Core)

### 1. Definidor de Proyectos (Entidad Sol)
Es el centro de gravedad del sistema. Se hidrata de una cotización aprobada y evoluciona hasta la entrega.
- **Metadatos:** ID de proyecto, cliente, fechas clave, estado contractual.
- **Configuración Espacial:** Lista de espacios (ej: Cocina, Baño, Vestier).
- **Levantamiento Técnico:** Información de medidas, registro fotográfico de obra y notas de campo.
- **Cotizacion detalle:** Ítems de cotización vinculados, modelos 3D asociados y especificaciones de contrato.
- **Vista de Cliente:** Dashboard simplificado para que el cliente final vea el avance real sin datos técnicos sensibles.

### 2. Directorio de Entidades (Personas y Terceros)
Base de datos unificada de todos los actores que interactúan con la empresa.
- **Proveedores:** Perfiles, catálogos asociados, tiempos de entrega y condiciones de crédito.
- **Terceros/Maquila:** Talleres externos, instaladores y servicios de transporte.
- **Empleados:** Perfil técnico, roles de acceso y registro de desempeño.

### 3. Administrador de Catálogo Maestro
El "Almacén Digital" de la empresa.
- **Productos y Materiales:** Tableros, herrajes, adhesivos, etc.
- **Servicios:** Mano de obra, transporte, diseño.
- **Gestión de Precios:** Listas de precios dinámicas, costos base y márgenes de utilidad.

### 4. Herramienta de Producción Integral (El Taller Digital)
Módulo de alta complejidad donde reside el "Know-How" de carpintería de la marca.
- **Biblioteca de Prácticas:** Documentación técnica sobre métodos de fabricación propios.
- **Modulador Interno:** Herramienta para configurar muebles predefinidos a medida.
- **Gestor de "Recetas":** Combinaciones lógicas de ítems del catálogo (ej: Módulo Base = Madera A + Bisagra B + Tornillo C).
- **Repositorio 3D:** Vinculación de modelos y renders a las recetas y espacios.
- **Nomenclatura de Partes:** Esquema estandarizado de marcado de piezas para ensamblaje.
- **Optimizador de Corte:** Integración de herramientas para el aprovechamiento de materiales.

### 5. Log Master (Tareas y Eventos)
El sistema nervioso del ERP. Nada sucede sin ser registrado.
- **Database de Tareas:** Lista de tareas autogenerada por ítem (Comprar, Fabricar, Mandar a hacer).
- **Historial de Acciones:** Registro cronológico (Logs) de quién hizo qué y cuándo en cada proyecto.

### 6. Central de Inteligencia (KPIs)
Visualización de la salud del negocio.
- **Indicadores de Producción:** Tiempos de fabricación, cuellos de botella.
- **Indicadores de Eficiencia:** Desperdicio de material, cumplimiento de fechas.
- **Dashboard Gerencial:** Resumen de alto nivel para toma de decisiones.

### 7. Administrador Financiero y Contable
La verdad económica del ecosistema.
- **Gestión de Saldos:** Control de anticipos, saldos pendientes por proyecto y cuentas por pagar.
- **Facturación y Nómina:** Emisión de documentos legales e impuestos asociados.
- **Contabilidad Técnica:** Registro de costos reales vs costos estimados.

---

## 🛠️ Lógica de Ítems e Interacción
Un **Ítem** no es solo una línea en una factura; es una unidad con naturaleza propia:
1. **Atributos:** Tiene una "Receta" (elementos del catálogo), una "Tarea" (compra/fabricación) y un "Modelo 3D".
2. **Ciclo de Vida:** Desde que se cotiza hasta que se instala, el ítem reporta su estado al Log Master.
3. **Contrato:** Los términos del contrato definen cómo y cuándo se cobra lo vinculado a estos ítems.

---
> [!NOTE]
> Este mapa reemplaza cualquier versión anterior y sirve como **blueprint** para la generación de esquemas en Indra.
