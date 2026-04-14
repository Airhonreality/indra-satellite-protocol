# ADR 002: Arquitectura de Tres Capas (Site, ERP, Infra)

**Estado:** VIGENTE (Actualizado v2.1)  
**Contexto:** Separación estricta entre la Web Pública, la Gestión Operativa (ERP) y la Infraestructura del Sistema.

---

## 🌐 Capa 01: Public Site (`public-site`)
**Archivos:** `index.html`.  
**Estética:** Canónica de Marca (Lujo, Minimalismo).  
**Herramientas:** El Cotizador vive aquí como una herramienta de captación.
**Seguridad:** Sin tokens maestros. Unidireccional.

## 💼 Capa 02: Admin ERP (`admin-erp`)
**Archivos:** `index.html` (Antes `business_logic.html`).  
**Estética:** Industrial/Brutalista (`erp-core.css`).  
**Funciones:** CRM, Inventario, Generador de Propuestas Técnicas.
**Seguridad:** Usuario ERP (Acceso restringido).

## ⚙️ Capa 03: System Infra (`system-infra`)
**Archivos:** `index.html` (Antes `admin_forge.html`).  
**Estética:** Terminal Técnico.  
**Componentes:** Gestión de Modelos de Datos (Schemas) y Conectores de Base de Datos.
**Seguridad:** **Llave Maestra (Admin Token).** Permisos de Arquitecto.

---

## 🛠️ Regla de Organización de Archivos

1. **Web para Clientes:** Carpeta `01-public-site/`.
2. **Gestión Interna:** Carpeta `02-admin-erp/`.
3. **Base del Sistema:** Carpeta `03-system-infra/`.
4. **Herramientas:** Siempre dentro de una subcarpeta `tools/` dentro de su capa correspondiente.
