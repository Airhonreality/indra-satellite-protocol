/**
 * =============================================================================
 * INDRA SATELLITE BRIDGE (v1.8) - SMART JURISDICTION EDITION
 * =============================================================================
 * Responsabilidad: Gestión soberana, orquestada y resiliente.
 * Mejora: Inteligencia de Jurisdicción (Auto-Provider).
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
const MIN_CORE_VERSION = '4.1';
const MANIFEST_FILENAME = 'INDRA_MANIFEST.json';

class IndraBridge {
    constructor(config = {}) {
        this.coreUrl = config.coreUrl || null;
        this.satelliteToken = config.satelliteToken || null;
        this.shareTicket = config.shareTicket || null;
        this.coreVersion = null;
        this.logger = config.logger || console;
        this.capabilities = { providers: [], core_version: '0.0' };

        this.MAX_CONCURRENT = config.maxConcurrent || 5;
        this.activeRequests = 0;
        this.requestQueue = [];
        
        // MOTOR DE FLUJOS (Blueprint v2.0)
        this.workflow = null; // Se inicializará bajo demanda
    }

    /**
     * AXIOMA DE NOMBRAMIENTO (Card I del Blueprint)
     * Sugiere un nombre de workspace basado en la identidad del satélite.
     */
    suggestWorkspaceName(satelliteName = "Satellite") {
        const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
        return `WS_${satelliteName.toUpperCase().replace(/\s/g, '_')}_${date}`;
    }

    /**
     * Sube un archivo al Core (ej: Drive) de forma canónica.
     * @param {string} fileName - Nombre del archivo con extensión.
     * @param {string} base64Data - Contenido en Base64 (sin el prefijo data:...)
     * @param {string} folderId - ID del contenedor (opcional).
     * @param {string} provider - El silo de destino (default: drive).
     */
    async uploadFile(fileName, base64Data, folderId = null, provider = 'drive') {
        return this.execute({
            protocol: 'ATOM_CREATE',
            provider: provider,
            context_id: folderId,
            data: {
                name: fileName,
                file_base64: base64Data,
                mime_type: this._inferMimeType(fileName)
            }
        });
    }

    _inferMimeType(name) {
        const ext = name.split('.').pop().toLowerCase();
        const map = { pdf: 'application/pdf', png: 'image/png', jpg: 'image/jpeg', json: 'application/json' };
        return map[ext] || 'application/octet-stream';
    }

    /**
     * ORQUESTACIÓN DE FLUJOS (Roadmap Punto 1)
     * Ejecuta una partitura JSON usando el WorkflowEngine interno.
     */
    async runWorkflow(workflowJson, triggerData = {}) {
        if (!this.workflowEngine) {
            const { IndraWorkflowEngine } = await import('./WorkflowEngine.js');
            this.workflowEngine = new IndraWorkflowEngine(this);
        }
        return await this.workflowEngine.run(workflowJson, triggerData);
    }

    /**
     * ESCUCHA DE RESONANCIA
     */
    listenFromShell(allowedOrigin = "*") {
        this.logger.info("[IndraBridge] Escuchando resonancia desde la Shell Madre...");
        window.addEventListener("message", async (event) => {
            if (allowedOrigin !== "*" && event.origin !== allowedOrigin) return;
            const { type, payload } = event.data;
            if (type === "INDRA_RESONANCE_GRANT") {
                this.logger.info("[IndraBridge] Resonancia recibida. Ignitando motor...");
                this.coreUrl = payload.core_url;
                this.satelliteToken = payload.satellite_key;
                if (payload.google_token || payload.core_url) await this.init();
                window.dispatchEvent(new CustomEvent("indra-ready", { detail: this.capabilities }));
            }
        });
    }

    /**
     * PROTOCOLO DISCOVERY
     */
    async discover(googleAccessToken) {
        if (!googleAccessToken) throw new Error("DISCOVERY_REQUIRES_GOOGLE_TOKEN");
        try {
            const q = encodeURIComponent(`name = '${MANIFEST_FILENAME}' and trashed = false`);
            const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name)`, {
                headers: { 'Authorization': `Bearer ${googleAccessToken}` }
            });
            const searchData = await searchRes.json();
            if (!searchData.files || searchData.files.length === 0) throw new Error("INDRA_MANIFEST_NOT_FOUND");
            
            const manifestFileId = searchData.files[0].id;
            const downloadRes = await fetch(`https://www.googleapis.com/drive/v3/files/${manifestFileId}?alt=media`, {
                headers: { 'Authorization': `Bearer ${googleAccessToken}` }
            });
            const manifest = await downloadRes.json();

            this.coreUrl = manifest.core_url;
            this.satelliteToken = manifest.satellite_key;
            await this.init(); 
            return { ok: true, coreUrl: this.coreUrl };
        } catch (error) {
            this.logger.error("[IndraBridge] Fallo en Discovery:", error.message);
            throw error;
        }
    }

    async init(config = {}) {
        this.coreUrl = config.coreUrl || this.coreUrl;
        this.satelliteToken = config.satelliteToken || this.satelliteToken;
        if (!this.coreUrl || !this.satelliteToken) return false;

        try {
            const handshake = await this.execute({ protocol: 'SYSTEM_INSTALL_HANDSHAKE' });
            this.coreVersion = handshake.metadata?.core_version || '4.0';
            const manifest = await this.execute({ protocol: 'SYSTEM_MANIFEST' });
            this.capabilities.providers = manifest.items.map(p => p.handle?.alias || p.id);
            return true;
        } catch (err) {
            this.logger.error("[IndraBridge] Fallo en Handshake:", err);
            return false;
        }
    }

    /**
     * EJECUCIÓN SOBERANA (UQO)
     * Auto-inyecta 'system' como provider si se omite para evitar bloqueos ADR-001.
     */
    async execute(uqo, options = {}) {
        // --- 🛡️ PARCHE DE JURISDICCIÓN (v1.8) ---
        if (!uqo.provider && uqo.protocol !== 'SYSTEM_INSTALL_HANDSHAKE' && uqo.protocol !== 'SYSTEM_MANIFEST') {
            this.logger.warn(`[IndraBridge] Aviso: Protocolo ${uqo.protocol} invocado sin 'provider'. Usando 'system' por defecto.`);
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

        let rawText = '';
        try {
            const response = await fetch(this.coreUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify(envelope)
            });

            rawText = await response.text();
            const result = JSON.parse(rawText);

            if (result.metadata?.status === 'ERROR') {
                const error = new Error(this._mapError(result.metadata.error));
                error.code = result.metadata.error;
                throw error;
            }
            return result;
        } catch (e) {
            if (e instanceof SyntaxError) {
                this.logger.error("[IndraBridge] Error de Parseo. El servidor no devolvió JSON.");
                this.logger.debug("Raw Response Content:", rawText.slice(0, 500));
                
                if (rawText.includes("<!DOCTYPE html>") || rawText.includes("<html")) {
                    throw new Error("ERROR_SERVIDOR: Google devolvió una página de error (posible 403 o sesión expirada).");
                }
            }
            if (!e.code) e.code = 'NETWORK_ERROR';
            throw e;
        }
    }

    _mapError(coreCode) {
        return ADR_ERROR_MAP[coreCode] || `Error desconocido: ${coreCode}`;
    }
}

export default IndraBridge;
