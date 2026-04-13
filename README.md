# Indra Satellite Protocol (ISP) — Starter Kit v1.6

Este es el repositorio **Semilla (Seed)** para la creación de Satélites Indra.

## 🚀 Ignición del Satélite (El Modo Indra)

A diferencia de las aplicaciones tradicionales, un satélite Indra no requiere configurar URLs o Keys manualmente. Utiliza el **Protocolo Discovery** para una experiencia Zero-Touch.

### 1. Flujo de Inicio para Desarrolladores

```javascript
import IndraBridge from './core/IndraBridge.js';

const bridge = new IndraBridge();

// Tras el login de Google en tu satélite:
async function onGoogleLogin(accessToken) {
  try {
    // El Bridge busca el Manifiesto en el Drive del usuario,
    // extrae la Core URL y la Satellite Key automáticamente.
    await bridge.discover(accessToken);
    
    console.log("¡Conexión establecida con el Core de forma automática!");
  } catch (err) {
    console.error("No se encontró un Núcleo Indra en esta cuenta.");
  }
}
```

### 2. ¿Por qué usar Discovery?
- **Soberanía del Usuario**: El usuario solo necesita su cuenta de Google. No necesita saber qué es una URL técnica.
- **Resiliencia**: Si el usuario reinstala su Core o cambia de dirección, el Satélite siempre lo encontrará gracias al Manifiesto en Drive.
- **Seguridad**: La `satellite_key` (el password) se recupera de forma segura desde el Drive del usuario, nunca viaja por canales inseguros.

## 🏗️ Estructura
- **`/core/`**: Biblioteca de transporte soberano (`IndraBridge.js`).
- **`/ui-canonical/`**: Componentes HUD de salud y notificaciones.
- **`/docs/`**: Patrones de diseño (`SATELLITE_PATTERNS.md`).

## 📡 Distribución
Este repositorio debe ser usado como **Template** para nuevos proyectos. 

*Indra: La arquitectura donde la identidad es el acceso y la materia es la soberanía.*
