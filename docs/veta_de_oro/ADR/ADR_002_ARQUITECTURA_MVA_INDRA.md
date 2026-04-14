# ADR 003: Arquitectura de Datos y Conectividad (Data-Service-UI)

## Contexto Analítico
El escalamiento operativo de Veta de Oro exige que los datos, las vistas y las lógicas estén desacoplados. Para evitar "monolitos de celdas" inmanejables, se implementa una separación estricta entre el almacenamiento, la lógica de servidor y la interfaz de usuario.

## Decisión Técnica: Separación Estricta de Capas

Para todo desarrollo futuro, se exigirá el cumplimiento de la arquitectura de tres capas:

### 1. Capa de Almacenamiento (Data Storage)
- **Regla:** El sistema de registros (actualmente en la nube) actúa estrictamente como un entorno de registros inmutables.
- **Prohibición:** No se permite alojar lógica de negocio o fórmulas complejas dentro de las tablas maestras. Los datos deben ser "puros".
- Todos los objetos complejos deben ser aplanados relacionalmente (`Relational Flattening`) usando identificadores únicos (IDs).

### 2. Capa de Lógica de Negocio (Service Core)
- **Regla:** Los microservicios y scripts de servidor son los únicos orquestadores de reglas de negocio.
- Aquí residen los motores de cálculo financiero, validación de inventario y generación de documentos oficiales (PDFs).
- Esta capa actúa como un **Middleware** que protege la base de datos de errores del Frontend.

### 3. Capa de Interfaz (UI / Execution Layer)
- **Regla:** Las aplicaciones web (Cotizador, ERP, Admin) son terminales pasivas.
- Deben "hidratarse" consumiendo datos de los servicios (`fetch('/api/schemas')`) bajo demanda, evitando valores estáticos en el código.
- Su función es la experiencia de usuario y la captura de datos, emitiendo un `JSON Payload` unificado al Service Core.

### 4. Gestión de Assets Multimedia
- **Regla:** Los recursos visuales (fotos de obra, renders) se gestionan dinámicamente. 
- La UI renderiza recursos basados en IDs proporcionados por el core, sin rutas estáticas a archivos locales.

## Consecuencias
- **Escalabilidad**: El reemplazo del sistema de almacenamiento actual por una base de datos industrial (PostgreSQL) en el futuro se podrá realizar sin reescribir la interfaz de usuario.
- **Integridad**: Se garantiza que la "verdad" del negocio reside en el Core y no en archivos HTML dispersos.
