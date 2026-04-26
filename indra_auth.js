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

        // Inyección de Jurisdicción (Vector F)
        const workspaceId = this.bridge.config?.workspace_id;

        const response = await this.bridge.execute({
            protocol: 'SYSTEM_IDENTITY_SYNC',
            workspace_id: workspaceId,
            data: { id_token: idToken }
        });

        if (response.metadata.status === 'OK') {
            const session = response.items[0];
            
            // Mutación del ContractCortex vía Bridge (Persistiendo Perfil L2)
            this.bridge.setSessionToken(session.token, session.profile);
            
            console.log(`✅ Soberanía reconocida: ${session.profile.email} [${session.profile.role}]`);
            return session.profile;
        } else {
            throw new Error(response.metadata.error || "Sujeto no reconocido por el Core.");
        }
    }

    /**
     * Purgado de la membrana de sesión con revocación física en el Core.
     */
    async logout() {
        try {
            // Cierre de Sesión Asíncrono (Vector G)
            await this.bridge.execute({ protocol: 'SYSTEM_SESSION_REVOKE' });
        } catch (e) {
            console.warn("⚠️ No se pudo revocar la sesión en el Core, procediendo con limpieza local.", e.message);
        }
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
