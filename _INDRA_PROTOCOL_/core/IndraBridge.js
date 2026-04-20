/**
 * =============================================================================
 * INDRA SATELLITE BRIDGE (v3.3) - BRANCHING NEXUS
 * =============================================================================
 * Responsibilidad: Orquestación modular con separación de ramas de soberanía.
 * =============================================================================
 */

import { TransportLayer } from './bridge_modules/TransportLayer.js';
import { IdentityNode } from './bridge_modules/IdentityNode.js';
import { ContractCortex } from './bridge_modules/ContractCortex.js';
import { ResonanceSync } from './bridge_modules/ResonanceSync.js';

class IndraBridge {
    constructor(config = {}) {
        // --- ESTADO NUCLEO ---
        this.coreUrl = config.coreUrl || "https://airhonreality.github.io/indra-os";
        this.satelliteToken = null;
        this.activeWorkspaceId = null; 
        this.environment = config.environment || 'PRODUCTION';

        // --- DATOS ADN ---
        this.contract = { satellite_name: 'Satélite Anónimo', capabilities: { protocols: [], providers: [] }, schemas: [] };
        this.capabilities = { protocols: [], providers: [], core_version: '0.0', system_state: 0 };
        this.allowedProtocols = []; // Cache of protocols allowed by the Gateway
        
        // --- MODULOS ---
        this.transport = new TransportLayer(this);
        this.identity = new IdentityNode(this);
        this.contractCortex = new ContractCortex(this);
        this.resonanceSync = new ResonanceSync(this);

        // --- SISTEMA DE EVENTOS ---
        this.pendingUIRequests = new Map();
        this._listeners = {};
        this.onStateChange = config.onStateChange || null;
    }

    // --- RAMAS DE SOBERANÍA ---
    async ignite() { 
        this.transport.purgeQueue(); // Limpiar ruidos previos
        return await this.identity.ignite(); 
    }
    
    // RAMA A: Anclaje de nueva identidad
    async anchorCitizenship() { return await this.resonanceSync.anchorCitizenship(); }
    
    // RAMA B: Cristalización Tabular (Soberanía)
    async crystallizeResonance() { return await this.resonanceSync.crystallizeResonance(); }
    
    // @deprecated Usa crystallizeResonance
    async syncDNA() { return await this.resonanceSync.syncDNA(); }

    clearState() {
        this.satelliteToken = null;
        this.activeWorkspaceId = null;
        localStorage.removeItem('INDRA_SATELLITE_LINK');
        window.dispatchEvent(new CustomEvent("indra-resonance-sync", { detail: { mode: 'GHOST' } }));
    }

    async loadContract(path) { return await this.contractCortex.load(path); }
    
    /**
     * @dharma "La Senda de la Eficiencia Suprema".
     * Delega el renderizado de un módulo de alta tecnología al Core de Indra.
     */
    async invokeUI(module, payload = {}) {
        return await this.execute({
            protocol: 'UI_INVOKE',
            module: module,
            payload: payload
        });
    }
    
    async execute(uqo, options) { 
        // --- VALIDACIÓN DE SORDERA (Anti-Patrón) ---
        if (this.allowedProtocols.length > 0 && !this.allowedProtocols.includes(uqo.protocol)) {
            // Bypass para SYSTEM_MANIFEST y SYSTEM_RESONANCE_CRYSTALLIZE que son de infraestructura base
            if (uqo.protocol !== 'SYSTEM_MANIFEST' && uqo.protocol !== 'SYSTEM_RESONANCE_CRYSTALLIZE') {
                console.error(`[IndraBridge:Aduana] El protocolo '${uqo.protocol}' no está permitido en el estado actual del núcleo o para tu tipo de jurisdicción.`);
                throw new Error("PROTOCOL_NOT_ALLOWED_BY_GATEWAY");
            }
        }
        return await this.transport.execute(uqo, options); 
    }

    /**
     * @dharma Inicializar el nexo celular (Identidad y Vínculo).
     * @v4.0 El inicio es pasivo y minimalista. No hay sincronía de ADN automática.
     */
    async init() {
        if (this._initializing) return this._initPromise;
        this._initializing = true;
        
        this._initPromise = (async () => {
            console.log("🚀 [IndraBridge] Iniciando Ignición Síncrona...");
            
            try {
                // PASO 1: Red y Manifiesto Global (Capa 0)
                console.log("🔍 [1/3] Validando Nexo Core...");
                const statusPulse = await this.execute({ protocol: 'SYSTEM_MANIFEST', provider: 'system' });
                this.capabilities = statusPulse.metadata || {};
                this.allowedProtocols = this.capabilities.allowed_protocols || [];
                console.log("✅ [1/3] Nexo Estable.");

                // PASO 2: Identidad (Capa 1)
                // (Ya validada implícitamente por el statusPulse si el Core requiere token)
                console.log("🔍 [2/3] Verificando Identidad...");
                if (!this.satelliteToken) {
                    throw new Error("GHOST_MODE: Sin llave de acceso.");
                }
                console.log("✅ [2/3] Identidad Cristalizada.");

                // PASO 3: Soberanía de Datos (Capa 2 - El Ledger)
                if (this.activeWorkspaceId) {
                    console.log(`🔍 [3/3] Validando Existencia de Célula: ${this.activeWorkspaceId}...`);
                    try {
                        // Intentamos una lectura mínima para validar el Ledger
                        await this.execute({ 
                            protocol: 'ATOM_EXISTS', 
                            context_id: this.activeWorkspaceId, 
                            data: { ids: [this.activeWorkspaceId] } 
                        });
                        console.log("✅ [3/3] Realidad Sincronizada.");
                        window.dispatchEvent(new CustomEvent("indra-resonance-sync", { detail: { mode: 'STABLE' } }));
                    } catch (error) {
                        console.error("🚨 [3/3] FALLO DE REALIDAD: El Ledger no responde.");
                        window.dispatchEvent(new CustomEvent("indra-resonance-sync", { 
                            detail: { mode: 'ERROR_LEDGER', error: error.message, id: this.activeWorkspaceId } 
                        }));
                        // IMPORTANTE: No limpiamos el ID. Dejamos que el usuario vea el fallo.
                    }
                } else {
                    console.log("⚠️ [3/3] Sin espacio asignado. Modo Huérfano.");
                    window.dispatchEvent(new CustomEvent("indra-resonance-sync", { detail: { mode: 'ORPHAN' } }));
                }

            } catch (e) {
                console.warn(`❌ [Bridge] Ignición abortada: ${e.message}`);
                window.dispatchEvent(new CustomEvent("indra-resonance-sync", { detail: { mode: 'GHOST', error: e.message } }));
            } finally {
                this._notify('sync', { status: this.satelliteToken ? 'CONNECTED' : 'DISCONNECTED' });
                this._initializing = false;
            }
        })();

        return this._initPromise;
    }

    _notify(event, data) {
        if (this.onStateChange) this.onStateChange(this, event, data);
        window.dispatchEvent(new CustomEvent(`indra:${event}`, { detail: data }));
        if (event === 'sync') window.dispatchEvent(new CustomEvent('indra-ready', { detail: data }));
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
