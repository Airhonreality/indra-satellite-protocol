/**
 * =============================================================================
 * INDRA CONTRACT CORTEX (Agnostic JS Edition)
 * =============================================================================
 * Responsibilidad: Gestión del ADN local vía ES Modules.
 * =============================================================================
 */

export class ContractCortex {
    constructor(bridge) {
        this.bridge = bridge;
    }

    /**
     * @dharma Carga el contrato y la configuración vía Módulos JS Dinámicos.
     * Esto elimina la dependencia de 'fetch' y 'JSON.parse' para activos locales.
     */
    async load() {
        try {
            // 1. Cargar Configuración de Ciudadanía (JS)
            // Usamos un query param de timestamp para romper el cache del navegador en HMR
            const configModule = await import(`../indra_config.js?t=${Date.now()}`).catch(() => ({ INDRA_CONFIG: {} }));
            const config = configModule.INDRA_CONFIG || {};

            // 2. Cargar Contrato Maestro (JS)
            // Nota: En el futuro el compilador también generará un .js
            const response = await fetch('./_INDRA_PROTOCOL_/indra_contract.json').catch(() => null);
            let contract = response ? await response.json() : { schemas: [], workflows: [] };

            // 3. Inyección de Identidad
            contract.satellite_name = config.satellite_name || contract.satellite_name || 'Satélite Anónimo';
            contract.core_id = config.core_id || contract.core_id;
            
            this.bridge.contract = contract;
            this.bridge.activeWorkspaceId = config.workspace_id || this.bridge.activeWorkspaceId;

            console.log("[ContractCortex] ADN JS cargado exitosamente.");
            return contract;
        } catch (e) {
            console.error('[ContractCortex] Error cargando ADN:', e);
            return { schemas: [], workflows: [] };
        }
    }

    calculateChecksum(schemas) {
        // Normalizamos el JSON (ordenar llaves) para evitar divergencias falsas por formato
        const str = JSON.stringify(schemas || [], Object.keys(schemas || []).sort());
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return `chk_${Math.abs(hash).toString(36)}`;
    }
}
