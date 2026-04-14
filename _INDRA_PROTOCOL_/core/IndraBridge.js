/**
 * =============================================================================
 * INDRA SATELLITE BRIDGE (v2.3) - SOVEREIGN ARCH NODE
 * =============================================================================
 * Responsabilidad: Gestión soberana, orquestada y resiliente.
 * Consolidación: Ahora incluye la lógica del ContractReader de forma nativa.
 * =============================================================================
 */

const ADR_ERROR_MAP = {
    'IDENTITY_VIOLATION': 'El ID del recurso es inválido o fue eliminado.',
    'NOT_FOUND': 'El recurso fue movido o borrado del almacenamiento.',
    'AUTH_REQUIRED': 'Se requiere una sesión activa o ticket válido.',
    'CONTRACT_VIOLATION': 'Error de integridad en los datos (viola el ADR-001).',
    'GENESIS_FAILED': 'No se pudo crear la infraestructura física.',
    'LOCK_TIMEOUT': 'El Core está ocupado. Intenta de nuevo en unos segundos.',
    'SECURITY_VIOLATION': 'Acceso denegado. El token no tiene jurisdicción.',
    'GATEWAY_TIMEOUT': 'El servidor de Google tardó demasiado en responder.',
    'NETWORK_ERROR': 'No se pudo establecer conexión con el Core (Offline?).'
};

const RETRIABLE_CODES = ['LOCK_TIMEOUT', 'GATEWAY_TIMEOUT', 'NETWORK_ERROR'];

class IndraBridge {
    constructor(config = {}) {
        this.coreUrl = config.coreUrl || null;
        this.satelliteToken = config.satelliteToken || null;
        this.shareTicket = config.shareTicket || null;
        this.coreVersion = null;
        this.logger = config.logger || console;
        
        // El Contrato es el ADN cargado localmente
        this.contract = { capabilities: { protocols: [], providers: [] }, schemas: [] };
        // Las capacidades son las dinámicas del Core
        this.capabilities = { protocols: [], providers: [], core_version: '0.0' };

        this.MAX_CONCURRENT = config.maxConcurrent || 5;
        this.activeRequests = 0;
        this.requestQueue = [];
        
        this.workflowEngine = null;
        this.onStateChange = config.onStateChange || null;
    }

    /**
     * @dharma Carga el contrato local (ADN del Satélite).
     */
    async loadContract(path = './_INDRA_PROTOCOL_/indra_contract.json') {
        try {
            const response = await fetch(path);
            this.contract = await response.json();
            this._notify();
            return this.contract;
        } catch (e) {
            this.logger.error('[IndraBridge] Error cargando contrato local:', e);
            return null;
        }
    }

    /**
     * @dharma Inicializar el sistema nervioso completo.
     */
    async init() {
        console.log("[IndraBridge] Handshake iniciado...");
        
        // 1. Carga automática del contrato local como base
        await this.loadContract();

        // 2. Handshake dinámico con el Core (si hay URL)
        if (this.coreUrl) {
            try {
                const manifest = await this.execute({
                    protocol: 'GETMCEPMANIFEST',
                    provider: 'system',
                    data: { mode: 'RAW_MAP' }
                });
                this.capabilities = manifest.metadata;
                this.coreVersion = this.capabilities.core_version;
            } catch (e) {
                this.logger.warn("⚠️ Handshake dinámico fallido. Operando con Contrato Local.");
            }
        }

        this._notify();
        return { 
            core: this.capabilities, 
            contract: this.contract 
        };
    }

    _notify() {
        if (this.onStateChange) this.onStateChange(this);
    }

    /**
     * @dharma Auditoría técnica para el IDE/Terminal.
     */
    audit() {
        const report = {
            id: this.contract.core_id || 'ANONYMOUS',
            status: this.coreUrl ? 'CONNECTED' : 'LOCAL_ONLY',
            protocols: this.contract.capabilities.protocols.length,
            schemas: this.contract.schemas.length,
            auth: this.satelliteToken ? 'PRESENT' : 'MISSING',
            resonance: this.capabilities.core_version !== '0.0'
        };
        console.table(report);
        return report;
    }

    // --- MÉTODOS HEREDADOS DEL CONTRACT READER ---

    supports(protocol) {
        return this.contract.capabilities.protocols.includes(protocol.toUpperCase());
    }

    getSilos() {
        return this.contract.capabilities.providers || [];
    }

    getSchemas() {
        return this.contract.schemas || [];
    }

    // --- SISTEMA DE EJECUCIÓN ---

    async execute(uqo, options = {}) {
        if (!uqo.provider && uqo.protocol !== 'SYSTEM_MANIFEST') {
            uqo.provider = 'system';
        }

        const maxRetries = options.maxRetries ?? 3;
        if (this.activeRequests >= this.MAX_CONCURRENT) {
            await new Promise(resolve => this.requestQueue.push(resolve));
        }
        this.activeRequests++;
        try {
            return await this._executeWithRetry(uqo, maxRetries);
        } finally {
            this.activeRequests--;
            if (this.requestQueue.length > 0) {
                const next = this.requestQueue.shift();
                next();
            }
        }
    }

    async _executeWithRetry(uqo, maxRetries) {
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                return await this._rawFetch(uqo);
            } catch (error) {
                if (attempt === maxRetries || !RETRIABLE_CODES.includes(error.code)) throw error;
                const delay = Math.pow(2, attempt) * 1000 + (Math.random() * 500);
                await new Promise(r => setTimeout(r, delay));
            }
        }
    }

    async _rawFetch(uqo) {
        if (!this.coreUrl) throw new Error("CORE_NOT_INITIALIZED");
        const envelope = { satellite_token: this.satelliteToken, ...uqo };
        if (this.shareTicket) envelope.share_ticket = this.shareTicket;

        const response = await fetch(this.coreUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(envelope)
        });

        const rawText = await response.text();
        const result = JSON.parse(rawText);

        if (result.metadata?.status === 'ERROR') {
            const error = new Error(ADR_ERROR_MAP[result.metadata.error] || result.metadata.error);
            error.code = result.metadata.error;
            throw error;
        }
        return result;
    }

    async runWorkflow(workflowJson, triggerData = {}) {
        if (!this.workflowEngine) {
            const Engine = (await import('./WorkflowEngine.js')).default;
            this.workflowEngine = new Engine(this);
        }
        return await this.workflowEngine.run(workflowJson, triggerData);
    }
}

export default IndraBridge;
