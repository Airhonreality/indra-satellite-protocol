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

        this.MAX_CONCURRENT = config.maxConcurrent || 1; // Axioma Peristáltico: 1 a la vez por defecto
        this.activeRequests = 0;
        this.requestQueue = [];
        
        this.workflowEngine = null;
        this.resonanceWarnings = []; 
        this.environment = config.environment || 'PRODUCTION'; // PRODUCTION | SANDBOX
        this.onStateChange = config.onStateChange || null;
    }

    /**
     * @dharma Genera un Checksum ligero del ADN local para validar la sinceridad.
     */
    _generateChecksum(schemas) {
        const str = JSON.stringify(schemas || []);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convertir a 32bit int
        }
        return `chk_${Math.abs(hash).toString(36)}`;
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

        // 2. Handshake y Checksum de Sinceridad
        if (this.coreUrl) {
            try {
                const localChecksum = this._generateChecksum(this.contract.schemas);
                
                // Primero intentamos un pulso ligero para verificar el estado
                const statusPulse = await this.execute({
                    protocol: 'SYSTEM_MANIFEST',
                    provider: 'system'
                });
                
                const coreChecksum = statusPulse.metadata?.schema_checksum;
                
                if (localChecksum !== coreChecksum) {
                    this.logger.warn(`[IndraBridge] Divergencia de ADN detectada (Local: ${localChecksum} vs Core: ${coreChecksum}). Forzando Cristalización...`);
                    // ADR-Resonancia: Empujamos el ADN local para cristalizarlo en el Core
                    const crystalResponse = await this.execute({
                        protocol: 'SYSTEM_RESONANCE_CRYSTALLIZE',
                        provider: 'system',
                        data: { contract: this.contract, checksum: localChecksum }
                    });
                    this.capabilities = crystalResponse.metadata || {};
                    this.resonanceWarnings = crystalResponse.metadata?.integrity_warnings || [];
                } else {
                    console.log("[IndraBridge] Resonancia perfecta. No se requiere cristalización.");
                    this.capabilities = statusPulse.metadata || {};
                }
                
                this.coreVersion = this.capabilities.core_version;
                
                if (this.resonanceWarnings.length > 0) {
                    this.logger.warn("⚠️ Advertencias de Resonancia detectadas:", this.resonanceWarnings);
                }

                console.log("[IndraBridge] Resonancia establecida con el Core.");
            } catch (e) {
                this.logger.warn("⚠️ Fallo en Handshake/Cristalización. Operando en modo Local/Desconectado.", e);
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
        
        // COLUMNA PERISTÁLTICA: Encolado ordenado para evitar asfixiar al Core
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
                next(); // Libera el siguiente pulso en la cola
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
        const envelope = { 
            satellite_token: this.satelliteToken, 
            environment: this.environment,
            ...uqo 
        };
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
