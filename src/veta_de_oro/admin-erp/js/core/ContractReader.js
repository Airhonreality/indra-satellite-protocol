/**
 * =============================================================================
 * INDRA CONTRACT READER
 * =============================================================================
 * Responsabilidad: Leer y validar el contrato local (indra_contract.json).
 * Permite al satélite conocer sus capacidades sin consultar al Core.
 * =============================================================================
 */

export default class ContractReader {
    constructor(contractData) {
        this.contract = contractData || { capabilities: { protocols: [], providers: [] }, schemas: [] };
    }

    /**
     * Verifica si un protocolo existe en el contrato asimilado.
     */
    supports(protocol) {
        return this.contract.capabilities.protocols.includes(protocol.toUpperCase());
    }

    /**
     * Obtiene la metadata (inputs, descripción) de un protocolo.
     */
    getProtocolMeta(protocol) {
        const p = protocol.toUpperCase();
        const schema = this.contract.schemas.find(s => s.protocols && s.protocols.includes(p));
        if (schema) return schema;

        // Búsqueda profunda en metadatos de providers (si el contrato lo permite)
        return null;
    }

    /**
     * Lista todos los Silos (Providers) disponibles.
     */
    getSilos() {
        return this.contract.capabilities.providers || [];
    }

    /**
     * Valida un objeto de datos contra la definición del contrato.
     * (Implementación simplificada para el hito 1)
     */
    validate(protocol, data) {
        if (!this.supports(protocol)) {
            return { valid: false, error: `Protocolo [${protocol}] no soportado por este Core.` };
        }
        // Aquí se puede expandir con validación de tipos basada enschemas
        return { valid: true };
    }

    static async loadLocal(path = './core/indra_contract.json') {
        try {
            const response = await fetch(path);
            const data = await response.json();
            return new ContractReader(data);
        } catch (e) {
            console.error('[ContractReader] Error cargando contrato local:', e);
            return new ContractReader();
        }
    }
}
