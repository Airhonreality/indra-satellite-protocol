/**
 * SYSTEM CONTROLLER — Veta de Oro ERP
 * Gestión automática de infraestructura de datos.
 */

/**
 * Registry dinámico basado en el filesystem.
 * En modo local, usaremos el objeto inyectado.
 */
window.buildRegistry = function() {
    return window.VETA_REGISTRY || {};
}

/**
 * Auditoría: Compara el código local con el estado real del Core.
 */
window.auditInfrastructure = async function(registry) {
    if (!window.DBConnector) return registry;
    
    const coreSchemas = await window.DBConnector.fetchSchemas();
    const coreMap = new Map((coreSchemas || []).map(s => [s.handle?.alias, s]));

    for (const id in registry) {
        const coreMatch = coreMap.get(id);
        if (!coreMatch) {
            registry[id]._status = 'ORPHAN';
        } else {
            registry[id]._status = coreMatch.payload?.silo_id ? 'IGNITED' : 'SYNCED';
            registry[id]._coreId = coreMatch.id;
        }
    }
    return registry;
}

/**
 * Acciones de Administración de Sistemas
 */
window.SystemAdmin = {
    /** Sincroniza la definición del esquema (Model) */
    async sync(schemaId, registry, workspaceId) {
        const schema = registry[schemaId];
        return window.DBConnector.syncSchema(schema, workspaceId);
    },

    /** Inicializa el almacenamiento físico (Table/Silo) */
    async initializeStorage(schemaId, registry, workspaceId) {
        const schema = registry[schemaId];
        if (!schema._coreId) throw new Error('Schema no sincronizado');
        
        const result = await window.DBConnector.initializeStorage(schema._coreId, schema.target_provider, workspaceId);
        
        // AUTO-LINKING TO WORKSPACE
        if (result.metadata?.silo_atom && workspaceId) {
            await window.DBConnector.linkToWorkspace(workspaceId, result.metadata.silo_atom);
        }
        
        return result;
    }
};
