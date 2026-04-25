# 🏛️ MANUAL MAESTRO: IDENTIDAD SOBERANA Y SISTEMAS MULTI-USUARIO (v1.3 OMEGA)
> **Dharma**: Separar la materia de conexión (Infra) de la autoridad del sujeto (User) para garantizar soberanía fractal y evitar la entropía de acceso.

---

## 🧬 1. LOS TRES PILARES DE LA IDENTIDAD

En la arquitectura SUH de Indra, la identidad es jerárquica y delegada. Nunca se deben mezclar estas capas:

| Capa | Identidad | Alcance | Origen | Persistencia Física |
| :--- | :--- | :--- | :--- | :--- |
| **L0** | **Infraestructura** | Nodo / Satélite | `indra_identity.js` | Inmutable en disco. Representa a la empresa o dueño del hardware. |
| **L1** | **Social (Handshake)** | Validación | Google OAuth (JWT) | Volátil. Solo sirve para demostrar posesión de un email ante el Core. |
| **L2** | **Sovereign (Session)** | Sujeto Humano | `SYSTEM_IDENTITY_SYNC` | **Persistente en Malla Local** (`localStorage`). Representa la autoridad del usuario. |

---

## 🚀 2. RUTA DE IMPLEMENTACIÓN (PASO A PASO)

### Paso 1: El Registro Atómico y Santuarios Tabulares (En el Core)
Para que un usuario pueda loguearse, debe existir previamente un átomo de clase `IDENTITY` en el Ledger del Core. Tras la reforma v18.0, las identidades **no se mezclan** con la infraestructura.
- **Santuario Tabular**: El usuario debe estar registrado en la pestaña **`Entidades`** del Workspace.
- **Campos Vitales**: `email` (debe coincidir con el de Google), `name` y el campo de metadatos `payload` (JSON con detalles extendidos como el rol).
- **Hidratación de Rango**: El rol definido en el `payload` (ej: `AUDITOR_REAL`) es inyectado directamente en el Ticket de Sesión L2. El Satélite recibe este rango de forma oficial.

#### 📄 Átomo Canónico de Usuario (Template)
Si necesitas sembrar un usuario manualmente en la Sheet `Entidades`, usa esta estructura:
```json
{
  "id": "USR_GENESIS_XXXX",
  "handle": { "alias": "handle-del-usuario", "label": "Nombre Visible" },
  "class": "IDENTITY",
  "payload": {
    "email": "usuario@ejemplo.com", 
    "role": "AUDITOR_REAL",        
    "name": "Nombre Completo",
    "avatar_url": "...",
    "preferences": { "theme": "dark" }
  },
  "status": "VALIDATED",
  "provider": "google"
}
```

### Paso 2: El Intercambio de Soberanía (Login)
El Satélite no "loguea" al usuario; facilita el intercambio de un token social por uno soberano usando el módulo `indra_auth.js`.

```javascript
// Implementación recomendada usando el kit de identidad
import { IndraAuth } from './indra_auth';

const auth = new IndraAuth(bridge);

async function handleLogin(googleIdToken) {
    try {
        const profile = await auth.login(googleIdToken);
        console.log("Bienvenido:", profile.name);
        // El puente ya tiene la sesión guardada para el próximo F5
    } catch (e) {
        console.error("Error de soberanía:", e.message);
    }
}
```

### Paso 3: Gestión de la "Amnesia Post-Refresco"
Gracias a la mutación en `ContractCortex.js`, el Satélite ya no olvida quién es el usuario al pulsar F5.
- **Mecánica**: El `ContractCortex` busca la clave `indra_session_[SATELLITE_ID]` antes de autorizar la conexión. Si la encuentra, el Satélite despierta directamente en Capa L2.

---

## 🔐 3. VECTORES DE ESQUIZOFRENIA (ERRORES A EVITAR)

### ⚠️ Vector A: La Ilusión del Rol en el Cliente
- **Error Común**: El desarrollador guarda `user.role` en un JSON local y lo usa para permitir acciones (ej: `if(user.role == 'admin') deleteItem()`).
- **Consecuencia**: El usuario puede editar su `localStorage`, cambiarse el rol y hackear la UI.
- **Sinceridad Indra**: La seguridad **siempre ocurre en el Core**. El Core ignora el rol del satélite y usa el `subject_id` vinculado al token para validar permisos en el Ledger. El rol en el satélite es SOLO para estética (mostrar/ocultar botones).

### ⚠️ Vector B: El "Token Zombi" (Expiración)
- **Error Común**: Sesiones que duran para siempre sin validación.
- **Sinceridad Indra**: Las sesiones L2 tienen una caducidad de 30 días configurada en el Llavero (`keychain_service.gs`). El `AuthService` purga automáticamente cualquier token que exceda su fecha de vida.

### ⚠️ Vector C: El "Crisis de Personalidad" (Multi-Satélite)
- **Error Común**: Usar una clave de `localStorage` genérica como `"token"`.
- **Consecuencia**: Si el usuario tiene dos satélites Indra abiertos en el mismo dominio, uno podría sobreescribir la sesión del otro.
- **Sinceridad Indra**: El sistema usa **Namespacing Atómico** basado en el `id` del satélite del manifiesto. Cada nodo es una isla de identidad independiente.

---

## 📋 4. CHECKLIST DE INTEGRACIÓN FINAL

1. **Core**: Asegurarse de que `SYSTEM_IDENTITY_SYNC` esté registrado en el router.
2. **Core**: Crear los átomos `IDENTITY` para los usuarios permitidos.
3. **Satélite**: Asegurarse de que `satellite.manifest.json` tenga un `id` único.
4. **Satélite**: Usar `bridge.setSessionToken(token)` para el login y `bridge.logout()` para el cierre.
5. **Satélite**: **NUNCA** manipular `localStorage` directamente para temas de identidad.

---
*Indra OS — Estándar de Identidad Soberana v1.3 | Sincerity Architecture* 🛰️🔐🏛️💎🔥
