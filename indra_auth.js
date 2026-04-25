/**
 * 👤 INDRA SOVEREIGN AUTH (L2)
 * Dharma: Gestión del Sujeto Humano y la Soberanía de Sesión.
 * 
 * Este módulo facilita el intercambio de tokens sociales por tokens soberanos Indra,
 * gestionando el perfil hidratado y los rangos (roles) del usuario.
 */

export class IndraAuth {
    /**
     * @param {IndraBridge} bridge - Instancia del transporte Indra.
     */
    constructor(bridge) {
        this.bridge = bridge;
    }

    /**
     * Reclama soberanía mediante un token de Google (OAuth).
     * @param {string} idToken - Token de identidad recibido desde Google Auth.
     * @returns {Promise<Object>} Perfil del usuario reconocido por el Core.
     */
    async login(idToken) {
        if (!idToken) throw new Error("idToken es requerido para el login.");

        const response = await this.bridge.execute({
            protocol: 'SYSTEM_IDENTITY_SYNC',
            data: { id_token: idToken }
        });

        if (response.metadata.status === 'OK') {
            const session = response.items[0];
            
            // Mutación del ContractCortex vía Bridge
            // Esto persiste el token L2 en la membrana local
            this.bridge.setSessionToken(session.token);
            
            console.log(`✅ Soberanía reconocida: ${session.profile.email} [${session.profile.role}]`);
            return session.profile;
        } else {
            throw new Error(response.metadata.error || "Sujeto no reconocido por el Core.");
        }
    }

    /**
     * Purgado de la membrana de sesión.
     */
    logout() {
        this.bridge.logout();
        console.log("🔒 Sesión soberana cerrada.");
    }

    /**
     * Recupera el perfil del usuario activo si existe una sesión válida.
     * @returns {Object|null}
     */
    getUserProfile() {
        // El bridge consulta al ContractCortex el estado de la sesión
        const session = this.bridge.getSession();
        return session ? session.profile : null;
    }

    /**
     * Verifica si el usuario tiene un rango/rol específico.
     * @param {string} role - Rol a verificar (ej: 'AUDITOR_REAL').
     */
    hasRole(role) {
        const profile = this.getUserProfile();
        return profile ? profile.role === role : false;
    }
}
