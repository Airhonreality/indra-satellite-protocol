/**
 * =============================================================================
 * ARTEFACTO: IndraKernel.js
 * CAPA: Orquestación (Soberanía Central)
 * AXIOMA: Desvanecimiento Tecnológico (v15.0)
 * =============================================================================
 */
import { appState } from './app_state.js';
import { AgnosticVault } from './logic/AgnosticVault.js';

export class IndraKernel {
    constructor(bridge) {
        this.bridge = bridge;
        this.vault = new AgnosticVault(bridge);
        this.bridge.vault = this.vault; // Vinculación simbiótica
        
        console.log("💎 [IndraKernel] El núcleo inteligente ha despertado.");
        this._setupSilentSync();
    }

    /**
     * @dharma Escucha los cambios del Bridge e hidrata el Vault sin intervención.
     */
    _setupSilentSync() {
        // 1. Resonancia de Estado: Cuando el Bridge cambia de fase, el Kernel reacciona.
        window.addEventListener('indra-resonance-sync', async (e) => {
            const { mode } = e.detail;
            if (mode === 'STABLE' || mode === 'READY') {
                console.log("🌊 [IndraKernel] Resonancia estable detectada. Iniciando autohidratación...");
                await this.hydrateAll();
            }
        });
    }

    /**
     * @dharma Escanea el contrato local y descarga materia para cada esquema definido.
     */
    async hydrateAll() {
        const schemas = this.bridge.contract.schemas || [];
        for (const schema of schemas) {
            const alias = schema.handle?.alias;
            if (alias) {
                console.log(`📥 [IndraKernel:AutoSync] Hidratando materia para: ${alias}`);
                try {
                    // Resolución automática vía Bridge resolveSilo que creamos antes
                    const silo = this.bridge.resolveSilo(alias);
                    const response = await this.bridge.execute({
                        protocol: 'TABULAR_STREAM',
                        provider: silo.provider,
                        context_id: silo.id
                    });
                    
                    if (response.items) {
                        this.vault.commit(alias, response.items);
                        appState.resonateWithCore(response.items, alias);
                    }
                } catch (e) {
                    console.warn(`⚠️ [IndraKernel] No se pudo hidratar ${alias}: ${e.message}`);
                }
            }
        }
    }
}
