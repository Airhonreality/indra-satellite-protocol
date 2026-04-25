# 🔐 SOVEREIGN AUTH & IDENTITY — LEY DE IDENTIDAD DEL SATÉLITE
> **Categoría:** Ley Axial de Seguridad  
> **Versión:** 1.1 — Abril 2026 (Patch: Sinceridad Atómica)
> **Estándar:** OMEGA_V17 / ISP v3.0  
> **Aplica a:** Todo Satélite Indra con sistemas de usuarios propios

> *"El `indra_identity.js` es la llave del Chasis. El login del usuario es el ADN del Pasajero. Gracias al Parche de Sinceridad, el Core ahora entiende que el Pasajero puede conducir el Chasis sin perder la soberanía."*

---

## ⚠️ EL AXIOMA DE LA DOBLE IDENTIDAD

Un Satélite opera bajo dos identidades simultáneas pero en planos distintos:

1.  **Identidad de Nodo (Infraestructura):** Definida en `indra_identity.js`. Identifica al software.
2.  **Identidad de Sujeto (Usuario):** Generada tras el login. Identifica a la persona.

**El Gran Hallazgo:** En Indra, un usuario es técnicamente un **Satélite Humano**. Su sesión no es un simple ID, es un **Token Escopado (Scoped Token)** registrado en el Llavero del Core.

---

## 🏛️ PARTE 1: ARQUITECTURA DE CAPAS Y EL CAMPO UNIVERSAL

Tras la mutación del `AuthService`, el sistema utiliza un **Campo de Entrada Universal** para la identidad: el campo `password`.

```
┌─────────────────────────────────────────────────────────┐
│              CAPA 0 — INFRAESTRUCTURA (L0)              │
│  indra_identity.js → password: satelliteToken           │
│  Uso: Ignición del sistema y carga de ADN (Schemas).    │
├─────────────────────────────────────────────────────────┤
│           CAPA 1 — AUTENTICACIÓN SOCIAL (L1)            │
│  Google OAuth → id_token                                │
│  Uso: Intercambio único por identidad soberana.         │
├─────────────────────────────────────────────────────────┤
│            CAPA 2 — SESIÓN SOBERANA (L2)                │
│  Session Token → password: userToken (vía Keychain)     │
│  Uso: Operación diaria. Inyecta 'subject_id' en el Core.│
└─────────────────────────────────────────────────────────┘
```

**Evolución del Transporte:** El Satélite no necesita campos extra. Simplemente sustituye en su memoria RAM el valor de `password` por el Token del Usuario tras el login.

---

## 🧬 PARTE 2: INYECCIÓN DE SUJETO (AUTOMAGIC)

Gracias al **Parche de Sinceridad**, cuando envías un Token de Usuario en el campo `password`, el Core realiza lo siguiente de forma automática:

1.  **Valida el Token** contra el Llavero Maestro.
2.  **Identifica el Vínculo Atómico** (ej: el usuario `u_javier`).
3.  **Inyecta el Sujeto:** Añade `subject_id: 'u_javier'` y `is_user_session: true` al objeto `uqo`.
4.  **Habilita la Lógica:** Tus Workflows ahora pueden leer `uqo.subject_id` directamente para filtrar datos de forma soberana.

---

## 🔑 PARTE 3: RITUAL CANÓNICO DE LOGIN

### Fase 1: El Intercambio (Workflow: `LOGIN_OAUTH_MATCH`)
No crees un sistema de usuarios en una base de datos. Pídele al Core que emita una identidad:

```javascript
// Llamada desde AuthProvider.js
const res = await bridge.execute({
    protocol: 'WORKFLOW_EXECUTE',
    data: {
        workflow_alias: 'LOGIN_OAUTH_MATCH',
        id_token: idToken // JWT de Google
    }
});

// El Core valida el id_token y ejecuta SYSTEM_KEYCHAIN_GENERATE internamente
// devolviendo un nuevo token vinculado al átomo IDENTITY del usuario.
const userToken = res.items[0].token; 
```

### Fase 2: Mutación de Identidad en el Satélite
Una vez obtenido el token, el satélite "cambia de piel":

```javascript
// El Bridge ahora usará el Token de Usuario para todas las peticiones
bridge.setSessionToken(userToken); 
```

---

## ⚡ PARTE 4: IMPLEMENTACIÓN DEL PROVIDER (CANÓNICO)

**Ruta:** `src/score/logic/AuthProvider.js`

```javascript
export const AuthProvider = {
    async login(bridge, googleIdToken) {
        // 1. Intercambio Soberano
        const res = await bridge.execute({
            protocol: 'WORKFLOW_EXECUTE',
            data: { workflow_alias: 'LOGIN_OAUTH_MATCH', id_token: googleIdToken }
        });

        const session = res.items?.[0]; // Contiene { token, profile }
        
        // 2. Persistencia en Vault Local
        localStorage.setItem('indra_user_token', session.token);
        localStorage.setItem('indra_user_profile', JSON.stringify(session.profile));

        // 3. Mutación del Bridge (Sincronización de password)
        bridge.setSessionToken(session.token);

        return session.profile;
    },

    logout(bridge) {
        localStorage.clear();
        // Volvemos al token de Infraestructura (el de indra_identity.js)
        bridge.restoreInfrastructureToken();
        window.dispatchEvent(new CustomEvent('indra-auth-logout'));
    }
};
```

---

## 🔇 PARTE 5: HIGIENE DE CONSOLA Y SEGURIDAD AXIOMÁTICA

Tras la mutación, el Core y el Satélite protegen la identidad:

*   **Logs Limpios:** El `TransportLayer` del Satélite y el `Gateway` del Core ocultan el contenido de `password` en los logs de depuración.
*   **No Exposición:** Nunca imprimas `uqo.subject_id` en logs públicos. El Core lo usa internamente para seguridad.
*   **Aislamiento:** El archivo `indra_identity.js` nunca debe ser modificado por el código de la aplicación. Se mantiene como la "Llave de Chasis" inmutable.

---

## ⛔ ANTIPATRONES (Vectores de Esquizofrenia)

1.  **Dualidad de Verdad:** Tener un `user_id` en el satélite que no coincida con el `subject_id` que ve el Core. **Solución:** Confía siempre en el `subject_id` inyectado por el Core.
2.  **Manual Handshake:** Intentar validar el token del usuario en cada componente. **Solución:** Deja que el Core lo valide de forma implícita en cada petición de datos.
3.  **Fuga de Identidad:** Loguear el objeto `uqo` completo en desarrollo. **Solución:** Usa el `Bridge.execute` que ya viene sanitizado.

---

## ✅ CHECKLIST DE SOBERANÍA V1.1

- [ ] El Core tiene aplicado el **Sincerity Patch** en `AuthService.gs`.
- [ ] El Satélite usa el campo `password` para enviar tanto el token de Infra como el de Usuario.
- [ ] Los Workflows del Core usan `uqo.subject_id` para filtrar registros.
- [ ] El satélite vuelve a su Identidad de Infra al hacer Logout.
- [ ] No existe código en el Satélite que haga `TABULAR_STREAM` a una tabla de usuarios para "validar" el login manualmente.

---

*Indra OS — Ley de Identidad Soberana v1.1 | Sincerity Standard* 🛰️🔐🏛️💎🔥
