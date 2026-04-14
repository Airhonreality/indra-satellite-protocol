import { indraBus } from './IndraEventBus.js';

/**
 * INDRA BLUEPRINT CORE
 * Clase base para la gestión de estado determinístico y sincronización de eventos.
 */
export class Blueprint {
    constructor(domainName, initialState = {}) {
        this.domain = domainName;
        this.state = initialState;
        this.isInitialized = false;
    }

    /**
     * Sincroniza el estado y emite evento global.
     */
    sync() {
        console.log(`[Blueprint:${this.domain}] Syncing state...`);
        indraBus.emit(`${this.domain.toUpperCase()}_UPDATED`, { 
            data: this.state,
            timestamp: Date.now()
        });
    }

    /**
     * Reemplaza el estado completo.
     */
    hydrate(newState) {
        this.state = { ...this.state, ...newState };
        this.isInitialized = true;
        this.sync();
    }

    /**
     * Generador de UUIDs simples para la sesión.
     */
    generateId(prefix = 'id') {
        return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
    }
}
