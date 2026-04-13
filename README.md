# Indra Satellite Protocol (ISP) v1.7 — Orchestration Edition

## 🛰️ Ignición del Satélite

Este protocolo soporta tres modos de inicio, dependiendo de la autonomía del satélite.

### 1. El Modo "Huérfano Orquestado" (Recomendado)
Para satélites que viven dentro de un Iframe o son abiertos desde la Shell Madre oficial de Indra. **No requiere configurar Google Auth ni Client IDs.**

```javascript
import IndraBridge from './core/IndraBridge.js';
const bridge = new IndraBridge();

// El satélite espera a que la Shell Madre le pase el token y la URL
bridge.listenFromShell();

window.addEventListener("indra-ready", (event) => {
  console.log("¡Resonancia establecida!", event.detail);
  // Empieza a operar aquí
});
```

### 2. El Modo "Discovery" (Zero-Touch)
Si el satélite es independiente pero el usuario ya tiene Indra instalado en su Drive.

```javascript
// Tras loguear al usuario en tu propio satélite:
await bridge.discover(googleToken);
```

### 3. El Modo "Manual" (Legacy)
```javascript
await bridge.init({
  coreUrl: 'https://script.google.com/...',
  satelliteToken: 'tu_llave_secreta'
});
```

---

## 🏗️ Cómo la Shell Madre otorga resonancia
Para los desarrolladores de la Shell principal, así se envía el token al satélite (Iframe):

```javascript
const satelliteWindow = document.getElementById('mi-iframe').contentWindow;

satelliteWindow.postMessage({
  type: "INDRA_RESONANCE_GRANT",
  payload: {
    core_url: "https://...",
    satellite_key: "abc_123",
    google_token: "ya_tengo_el_token"
  }
}, "*");
```

---
*Indra: La arquitectura donde la forma es agnóstico y el poder es otorgado.*
