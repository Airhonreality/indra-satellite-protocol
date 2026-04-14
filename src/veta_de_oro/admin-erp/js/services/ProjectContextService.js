import { indraBus } from '../core/IndraEventBus.js';
import IndraBridge from '../core/IndraBridge.js';
import { MOCK_PROJECT_CONTEXT } from '../adapters/MockAdapter.js';

/**
 * INDRA PROJECT CONTEXT SERVICE (CASCARÓN VACÍO)
 * Consume MockAdapter en dev, IndraBridge en producción.
 * El DOM no sabe cuál de los dos está activo.
 */
class ProjectContextService {
    constructor() {
        this.project = null;
        this.client = null;
    }

    /**
     * LOAD CONTEXT
     * LOGIC_GAS:
     * 1. Buscar en BD-03 (Proyecto) por ID.
     * 2. Buscar en BD-04 (Terceros) el cliente asociado.
     * 3. Unificar metadatos y retornar JSON canónico.
     */
    async loadContext(projectId) {
        console.log(`[PROJECT_SERVICE] Cargando contexto: ${projectId}`);
        
        // ADAPTER SWITCH: Cambiar 'mock' por 'indra' para conectar al backend real
        const USE_MOCK = true;

        const data = USE_MOCK
            ? MOCK_PROJECT_CONTEXT
            : await IndraBridge.invoke('GET_PROJECT_CONTEXT', { projectId });

        this.project = data.project;
        this.client = data.client;

        indraBus.emit('PROJECT_LOADED', { project: this.project, client: this.client });
        indraBus.emit('PHASE_UPDATED', this.project.phase);
    }
}

export const projectService = new ProjectContextService();
