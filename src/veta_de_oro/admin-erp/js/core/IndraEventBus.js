/**
 * INDRA EVENT BUS (The Nervous System)
 * Implementación Axiomática de Suh para Desacoplamiento Total.
 */
class IndraEventBus {
    constructor() {
        this.events = {};
    }

    /**
     * Suscribirse a un evento funcional (FR)
     */
    on(event, callback) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(callback);
        console.log(`[INDRA_CORE] Subscriber added to: ${event}`);
    }

    /**
     * Emitir un Design Parameter (DP) hacia el sistema
     */
    emit(event, data) {
        if (!this.events[event]) return;
        this.events[event].forEach(callback => callback(data));
        console.log(`[INDRA_CORE] Event Emitted: ${event}`, data);
    }
}

export const indraBus = new IndraEventBus();
