/**
 * =============================================================================
 * INDRA WORKFLOW ENGINE (Hybrid Core v2.0)
 * =============================================================================
 * Responsabilidad: Interpretar y ejecutar secuencias atómicas (JSON Partituras)
 * agnósticamente.
 *
 * DOGMA:
 * - Determinismo: El estado viaja inmutablemente de paso en paso.
 * - Sin Dependencias: JavaScript puro, listo para Satélites.
 * - Desacople UI: Emite eventos para que cualquier UI reaccione.
 * =============================================================================
 */

export default class WorkflowEngine {
    /**
     * @param {Object} bridge - Instancia de IndraBridge (o mock para tests)
     */
    constructor(bridge) {
        this.bridge = bridge;
        this.listeners = new Map();
        
        // Memoria volátil del flujo actual
        this._sharedState = {};
        this._status = 'IDLE'; // IDLE | RUNNING | PAUSED | ERROR | DONE
        this._currentStepId = null;
    }

    // ─── EVENT EMITTER NATIVO ───────────────────────────────────────────────

    /** Suscribirse a eventos (step_start, step_success, flow_end, error) */
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    _emit(event, payload) {
        const cbs = this.listeners.get(event);
        if (cbs) {
            cbs.forEach(cb => cb(payload));
        }
    }

    // ─── RESOLUCIÓN DE VARIABLES (JSON PATHING) ────────────────────────────

    /**
     * Resuelve variables de la forma {stepId.outputKey} utilizando el SharedState.
     */
    _resolveValue(rawValue) {
        if (typeof rawValue !== 'string') return rawValue;

        // Soporte básico para sintaxis tipo template o acceso directo: Ej "{trigger.user_id}"
        const regex = /\{([^}]+)\}/g;
        
        if (!rawValue.includes('{')) return rawValue;

        // Si la cadena exacta es solo un template, mantenemos su tipo de dato original
        if (/^\{[^}]+\}$/.test(rawValue.trim())) {
            const path = rawValue.replace(/[{}]/g, '').trim().split('.');
            let val = this._sharedState;
            for (let prop of path) {
                if (val === undefined || val === null) break;
                val = val[prop];
            }
            return val;
        }

        // Si hay templating de strings: "Hola {trigger.name}"
        return rawValue.replace(regex, (match, pathStr) => {
            const path = pathStr.trim().split('.');
            let val = this._sharedState;
            for (let prop of path) {
                if (val === undefined || val === null) break;
                val = val[prop];
            }
            return val !== undefined ? val : match;
        });
    }

    /** Mapea un objeto completo de configuración operando sobre todos sus valores */
    _resolveConfig(config) {
        if (!config) return {};
        const resolved = {};
        Object.keys(config).forEach(key => {
            resolved[key] = this._resolveValue(config[key]);
        });
        return resolved;
    }

    // ─── OPERADORES NATIVOS (Headless Math & String) ─────────────────────────

    /**
     * Ejecuta operadores simples sincrónicamente sin llamar al Core (Ahorro de red).
     */
    _executeNativeOperator(type, config) {
        const a = parseFloat(config.a) || 0;
        const b = parseFloat(config.b) || 0;
        
        switch (type.toUpperCase()) {
            case 'MATH_ADD': return { result: a + b };
            case 'MATH_SUB': return { result: a - b };
            case 'MATH_MUL': return { result: a * b };
            case 'MATH_DIV': 
                if (b === 0) throw new Error("DivisionByZero");
                return { result: a / b };
            case 'TEXT_CONCAT': 
                return { result: String(config.a || '') + String(config.b || '') };
            default:
                throw new Error(`Operador nativo no soportado: ${type}`);
        }
    }

    // ─── MOTOR DE EJECUCIÓN (ORQUESTADOR) ──────────────────────────────────

    /**
     * Ejeccuta el JSON completo.
     * @param {Object} workflow - El JSON del Workflow (La Partitura).
     * @param {Object} triggerData - Los datos con los que arranca el flujo (El Gatillo).
     */
    async run(workflow, triggerData = {}) {
        if (this._status === 'RUNNING') throw new Error("Workflow is already running");
        
        this._status = 'RUNNING';
        this._sharedState = { trigger: triggerData };
        this._emit('flow_start', { workflow_id: workflow.id, triggerData });

        try {
            const stations = workflow.payload?.stations || [];
            
            for (let i = 0; i < stations.length; i++) {
                const station = stations[i];
                this._currentStepId = station.id;
                // 0. Respetar Retardo de Estación (Axioma de Peristaltismo)
                const delayMs = station.config?.step_delay || 0;
                if (delayMs > 0) await new Promise(r => setTimeout(r, delayMs));

                this._emit('step_start', { step_id: station.id, index: i, type: station.type });

                let stepOutput = null;
                const resolvedConfig = this._resolveConfig(station.config);

                // EJECUCIÓN SEGÚN LA NATURALEZA DE LA ESTACIÓN
                if (station.type.startsWith('OP_')) {
                    // Operación nativa (Rápida, ejecutada en RAM del dispositivo)
                    const pureType = station.type.replace('OP_', '');
                    stepOutput = this._executeNativeOperator(pureType, resolvedConfig);
                } 
                else if (station.type === 'ROUTER') {
                    // Bifurcación Lógica (Fase 2 de desarrollo)
                    // TODO: Evaluar {condicion} y saltar a {rama_true} o {rama_false}
                    stepOutput = { status: 'Routed' };
                }
                else if (station.type === 'PROTOCOL') {
                    // Llamada Pesada a Indra Core
                    if (!this.bridge) throw new Error("IndraBridge is required for PROTOCOL execution");
                    
                    const req = {
                        provider: station.provider || 'system',
                        protocol: station.protocol,
                        context_id: resolvedConfig.context_id,
                        data: resolvedConfig.data,
                        query: resolvedConfig.query
                    };

                    // ADR-036: Reintentos en la capa de transporte (Axioma de Resiliencia)
                    const maxRetries = station.config?.maxRetries ?? 2;
                    stepOutput = await this.bridge.execute(req, { maxRetries });
                    
                    // { items, metadata }
                } else {
                    throw new Error(`Unknown station type: ${station.type}`);
                }

                // Guardar la Salida en el Estado Compartido (El Axioma del Rastro)
                this._sharedState[station.id] = stepOutput;

                this._emit('step_success', { step_id: station.id, output: stepOutput });
            }

            this._status = 'DONE';
            this._currentStepId = null;
            this._emit('flow_end', { status: 'SUCCESS', final_state: this._sharedState });
            
            return { status: 'SUCCESS', state: this._sharedState };

        } catch (error) {
            this._status = 'ERROR';
            this._emit('error', { step_id: this._currentStepId, error: error.message });
            return { status: 'ERROR', step_id: this._currentStepId, message: error.message };
        }
    }

    // ─── CONTROL Y OBSERVABILIDAD ─────────────────────────────────────────

    getStatus() {
        return this._status;
    }

    getSharedState() {
        return this._sharedState;
    }
}
