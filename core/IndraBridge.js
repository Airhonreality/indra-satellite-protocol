/**
 * =============================================================================
 * INDRA SATELLITE BRIDGE (v1.6) - SOLAR PUNK EDITION
 * =============================================================================
 * Responsabilidad: Gestión soberana, resiliente y autogestionada (Discovery).
 * Axioma: Ningún satélite debe pedirle a un usuario una URL o una Key.
 * =============================================================================
 */

const ADR_ERROR_MAP = {
    'IDENTITY_VIOLATION': 'El ID del recurso es inválido o fue eliminado.',
    'NOT_FOUND': 'El recurso fue movido o borrado del almacenamiento.',
    'AUTH_REQUIRED': 'Se requiere una sesión activa o ticket válido.',
    'CONTRACT_VIOLATION': 'Error de integridad en los datos (viola el ADR-001).',
    'GENESIS_FAILED': 'No se pudo crear la infraestructura física. Revisa permisos.',
    'LOCK_TIMEOUT': 'El Core está ocupado procesando otra solicitud.',
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
        this.sessionSecret = null;
        this.logger = config.logger || console;
        this.capabilities = { providers: [], core_version: '0.0' };

        // CONCURRENCIA
        this.MAX_CONCURRENT = config.maxConcurrent || 5;
        this.activeRequests = 0;
        this.requestQueue = [];
    }

    /**
     * PROTOCOLO DISCOVERY (Zero-Touch)
     * Busca en el Drive del usuario logueado el manifiesto de Indra.
     * @param {string} googleAccessToken - Token de acceso de Google OAuth2.
     */
    async discover(googleAccessToken) {
        if (!googleAccessToken) throw new Error("DISCOVERY_REQUIRES_GOOGLE_TOKEN");

        try {
            this.logger.info("[IndraBridge] Iniciando Protocolo de Descubrimiento...");
            
            // 1. Buscar el Manifiesto en Drive
            const q = encodeURIComponent(`name = '${MANIFEST_FILENAME}' and trashed = false`);
            const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name)`, {
                headers: { 'Authorization': `Bearer ${googleAccessToken}` }
            });
            const searchData = await searchRes.json();

            if (!searchData.files || searchData.files.length === 0) {
                throw new Error("INDRA_MANIFEST_NOT_FOUND_IN_DRIVE");
            }

            const manifestFileId = searchData.files[0].id;

            // 2. Descargar el contenido del Manifiesto
            const downloadRes = await fetch(`https://www.googleapis.com/drive/v3/files/${manifestFileId}?alt=media`, {
                headers: { 'Authorization': `Bearer ${googleAccessToken}` }
            });
            const manifest = await downloadRes.json();

            // 3. Auto-configuración
            this.coreUrl = manifest.core_url;
            this.satelliteToken = manifest.satellite_key; // La materia se vincula
            this.coreVersion = manifest.core_version;

            this.logger.info(`[IndraBridge] Core descubierto satisfactoriamente: ${this.coreUrl}`);
            
            // 4. Handshake de capacidades para finalizar ignición
            await this.init(); 
            
            return { ok: true, coreUrl: this.coreUrl, coreVersion: this.coreVersion };
        } catch (error) {
            this.logger.error("[IndraBridge] Fallo en el Descubrimiento:", error.message);
            throw error;
        }
    }

    /**
     * INICIALIZACIÓN (Handshake de Capacidades)
     * Puede llamarse manualmente si ya se conoce la URL o automáticamente tras el discovery.
     */
    async init(config = {}) {
        this.coreUrl = config.coreUrl || this.coreUrl || window.INDRA_CORE_URL;
        this.satelliteToken = config.satelliteToken || this.satelliteToken || window.INDRA_SATELLITE_TOKEN;

        if (!this.coreUrl || !this.satelliteToken) {
            this.logger.warn("[IndraBridge] Inicialización incompleta. Se requiere coreUrl y satelliteToken o ejecutar discover().");
            return false;
        }

        try {
            const handshake = await this.execute({ protocol: 'SYSTEM_INSTALL_HANDSHAKE' });
            this.capabilities.core_version = handshake.metadata?.core_version || '4.0';
            this.coreVersion = this.capabilities.core_version;
            
            const manifest = await this.execute({ protocol: 'SYSTEM_MANIFEST' });
            this.capabilities.providers = manifest.items.map(p => p.handle?.alias || p.id);

            this.logger.info(`[IndraBridge] Handshake exitoso. Core v${this.capabilities.core_version}. Providers: ${this.capabilities.providers.join(', ')}`);
            
            if (parseFloat(this.capabilities.core_version) < parseFloat(MIN_CORE_VERSION)) {
                this.logger.error(`[IndraBridge] ERROR: Versión del Core insuficiente (v${this.capabilities.core_version}). Se requiere v${MIN_CORE_VERSION}.`);
            }
            return true;
        } catch (err) {
            this.logger.error("[IndraBridge] Fallo en Handshake:", err);
            return false;
        }
    }

    async execute(uqo, options = {}) {
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
                const isFinalAttempt = attempt === maxRetries;
                const retriable = RETRIABLE_CODES.includes(error.code) || error.message.includes('fetch');
                if (isFinalAttempt || !retriable) throw error;
                const delay = Math.pow(2, attempt) * 1000 + (Math.random() * 500);
                await new Promise(r => setTimeout(r, delay));
            }
        }
    }

    async _rawFetch(uqo) {
        if (!this.coreUrl) throw new Error("CORE_NOT_INITIALIZED");

        const envelope = {
            satellite_token: this.satelliteToken,
            ...uqo
        };
        if (this.shareTicket) envelope.share_ticket = this.shareTicket;

        try {
            const response = await fetch(this.coreUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify(envelope)
            });

            if (!response.ok) {
                const error = new Error(`HTTP_${response.status}`);
                error.code = 'NETWORK_ERROR';
                throw error;
            }

            const result = await response.json();
            if (!result.metadata) throw new Error("INVALID_CORE_RESPONSE");
            if (result.metadata.status === 'ERROR') {
                const error = new Error(this._mapError(result.metadata.error));
                error.code = result.metadata.error;
                throw error;
            }
            return result;
        } catch (e) {
            if (!e.code) e.code = 'NETWORK_ERROR';
            throw e;
        }
    }

    _mapError(coreCode) {
        return ADR_ERROR_MAP[coreCode] || `Error desconocido del Core: ${coreCode}`;
    }
}

export default IndraBridge;
