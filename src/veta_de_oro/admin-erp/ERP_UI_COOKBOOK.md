# 📖 Indra Axiomatic UI: ERP Cookbook
Esta guía es el estándar inquebrantable para construir dashboards en el ecosistema Veta de Oro. Si eres un nuevo agente o desarrollador, sigue este flujo secuencial.

---

## 🧭 Filosofía: El Lego Axiomático
Construimos bajo los principios de **Nam P. Suh**: 
1. **Independencia**: Un panel no debe afectar a otro.
2. **Simplicidad**: Si puedes usar un token (`--gap-phi-3`), no uses un número (`34px`).

---

## 🛠️ Paso 1: La Estructura Base (El Contenedor)
Todo dashboard debe iniciar con el namespace `.erp-veta` y el wrapper de layout.

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <!-- 1. Tokens y Base -->
    <link rel="stylesheet" href="../css/variables.css">
    <link rel="stylesheet" href="../css/base.css">
    
    <!-- 2. Módulos Axiomáticos -->
    <link rel="stylesheet" href="../css/erp/layout.css">
    <link rel="stylesheet" href="../css/erp/buttons.css">
    <link rel="stylesheet" href="../css/erp/forms.css">
    <link rel="stylesheet" href="../css/erp/themes.css">
</head>
<body class="erp-veta axiom-dashboard">
    <!-- Tu contenido aquí -->
</body>
</html>
```

---

## 📐 Paso 2: El Layout (Proporción Áurea)
No calcules anchos a mano. Usa el motor de grid:

- **`.axiom-grid-aureo`**: Panel principal grande (61.8%) + Sidebar (38.2%).
- **`.axiom-grid-inverse`**: Sidebar + Panel principal.
- **`.axiom-grid-3col`**: Tres columnas iguales para métricas o cards laterales.

---

## 📦 Paso 3: Los Bloques (El Panel)
El `.axiom-panel` es la unidad atómica. Nunca escribas estilos inline para el fondo o los bordes.

```html
<article class="axiom-panel">
    <span class="axiom-label">CATEGORÍA_TÉCNICA</span>
    <h3>Título del Módulo</h3>
    <p>Descripción breve con opacidad 0.7.</p>
</article>
```

---

## ⌨️ Paso 4: Inputs y Acciones
Usa los componentes canónicos para que el diseño no se rompa en mobile.

- **Botones**: `.axiom-btn` (Neutral) o `.axiom-btn-primary` (Dorado).
- **Inputs**: Siempre envueltos en `.axiom-form-group` con su `.axiom-label`.
- **Multimedia**: Usa `.axiom-dropzone` o `.axiom-3d-canvas` para assets pesados.

---

## 🌓 Paso 5: Validación de Temas
Tu dashboard **debe** verse perfecto en modo oscuro.
**Prueba técnica:** Añade `data-theme="dark"` al tag `body` y verifica que los tokens se inviertan correctamente.

---

## 🚫 Prohibiciones Axiomáticas
1. **NO** uses etiquetas `<style>` dentro del HTML.
2. **NO** uses márgenes externos (`margin`). Usa el `gap` del contenedor.
3. **NO** uses colores hardcodeados (ej: `#000`). Usa `var(--color-ink)`.
4. **NO** uses Materialize, Bootstrap o librerías externas sin permiso del arquitecto.
