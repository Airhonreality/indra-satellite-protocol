# Plan de Evolución Digital: Veta de Oro (V3)

Este documento define la arquitectura técnica y el plan de ejecución para migrar de Wix a una infraestructura soberana basada en **Indra OS** y **GitHub Pages**. No es una copia, es una evolución basada en axiomas de eficiencia y estética premium.

---

## 1. Arquitectura del Sistema (Plano Geométrico)

### Backend: Indra OS (`system_core`)
Indra actuará como la "Sinfonía de Datos". No solo almacenará contenido, sino que gestionará la lógica de negocio.
- **Provider de Portafolio:** Un esquema JSON que defina: `ID`, `Ubicación`, `Materiales_Usados`, `Categoría` y `Galería_HD`.
- **Módulo de Leads:** Captura de datos desde la web directamente al `system_core`.
- **Axioma de Integridad:** Cada lead generado se vincula a una "Sesión de Interés" para analizar qué proyectos del portafolio vio el cliente antes de contactar.

### Frontend: GitHub Pages (Arquitectura MCA)
Usaremos una arquitectura de **Micro-Contenedores (MCA)** para garantizar modularidad y carga instantánea.
- **SSG (Static Site Generation):** Generación de HTML estático para SEO máximo.
- **CSS Variable System:** Un sistema de diseño basado en tokens (colores HSL, tipografía fluida, espaciado áureo).
- **Consumo Asíncrono:** La web consulta a Indra (vía API segura o mediante actualización de artefactos) para mantener el portafolio vivo.

---

## 2. Estrategia de Portafolio Dinámico (Estructura MD)

El portafolio dejará de ser una galería estática para ser un **activo comercial interactivo**.

### Estructura de Datos Definida:
Cada proyecto en el portafolio se estructurará como un "Átomo de Datos":
```json
{
  "handle": "cocina-calacatta-salitre",
  "metadata": {
    "title": "Cocina Integral Vidrio Templado",
    "location": "Ciudad Salitre, Bogotá",
    "date": "2024-08",
    "category": "cocinas",
    "metrics": {
      "area": "12m2",
      "materials": ["Piedra Sinterizada Calacatta", "Vidrio Blanco", "Aluminio"]
    }
  },
  "content": {
    "problem": "Descripción del reto del espacio.",
    "solution": "Cómo el diseño de Veta de Oro resolvió la funcionalidad.",
    "images": ["url_hd_1", "url_hd_2"]
  },
  "conversion": {
    "cta_label": "Cotizar diseño similar",
    "whatsapp_prefill": "Hola Veta de Oro, me interesa un proyecto como el de Ciudad Salitre..."
  }
}
```

---

## 3. Plan de Desarrollo (Fases Evolutivas)

### Fase 1: Cimentación Axiomática y Design System (Semana 1)
- **Benchmarking de Datos:** Análisis de sitios líderes en diseño de lujo (ej. Porcelanosa, Poggenpohl) para extraer patrones de interacción que convierten.
- **Wireframing de Baja Fidelidad:** Definición de flujos de usuario hacia el WhatsApp y formularios.
- **Definición de Variables CSS:** Creación del sistema de diseño (tokens de color, escalas tipográficas legibles en 4K y móviles).

### Fase 2: Construcción del Núcleo en Indra (Semana 2)
- **Configuración de Proveedores:** Crear los esquemas en `system_core`.
- **Módulo de Administración:** Interfaz simple dentro de Indra para que puedas subir fotos y textos sin tocar código en el futuro.
- **Módulo de Estadísticas:** Implementar un logger privado que rastree qué proyectos son más vistos.

### Fase 3: Desarrollo Front-End y SEO (Semana 3)
- **Desarrollo MCA:** Programación de componentes (Header, Hero animado, Grid de Portafolio, Detalle de Proyecto).
- **Optimización de Conversión:** Implementación de los "Lead Magnets" y Cotizador dinámico discutidos en el DOFA.
- **SEO On-Page:** Marcado `LD+JSON` para fragmentos enriquecidos en Google, optimización de meta-tags por cada URL.

### Fase 4: Twin Digital e Indexación (Semana 4)
- **Deployment en URL temporal:** Validar funcionamiento, velocidad (Lighthouse > 90/100) y flujos de leads.
- **Migración de Dominio:** Cambio de DNS hacia GitHub Pages.
- **Configuración de Google Ads:** Ajuste de las nuevas URLs en las campañas actuales para no perder historial de calidad.

---

## 4. Decisiones Basadas en Datos (Benchmarking)

1. **Velocidad de Respuesta:** Los datos indican que si una web de remodelaciones tarda más de 3s en cargar, el 40% de los leads se pierden. **Decisión:** Uso de imágenes con formato `WebP` progresivo y eliminación de librerías JS pesadas.
2. **Jerarquía Visual:** El ojo del cliente busca primero: 1. Foto Impactante, 2. Ubicación (Confianza), 3. Botón de contacto. **Decisión:** Layout tipo "Inmersivo" con CTAs flotantes que no obstruyan la vista.
3. **Indexación:** Wix oculta gran parte del contenido tras scripts. **Decisión:** HTML semántico puro para que Google indexe cada término técnico (ej. "cocinas con piedra sinterizada") de forma inmediata.

---

## 5. Garantía de Continuidad
Para mantener la solidez técnica, cada módulo desarrollado contará con su propia documentación en la carpeta de la web, vinculada a los principios de Indra, asegurando que cualquier cambio futuro sea predecible y no rompa el sistema.
