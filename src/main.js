/**
 * =============================================================================
 * MAIN SATELLITE ENTRY POINT (Decoupled Edition)
 * =============================================================================
 * Este es el archivo donde el ERP gestiona su lógica y sus usuarios.
 * El Satélite es el único responsable de obtener el TOKEN de acceso.
 * =============================================================================
 */

import IndraBridge from '../_INDRA_PROTOCOL_/core/IndraBridge.js';
import WorkflowEngine from '../_INDRA_PROTOCOL_/core/WorkflowEngine.js';
import ContractReader from '../_INDRA_PROTOCOL_/core/ContractReader.js';
import '../_INDRA_PROTOCOL_/ui/IndraBridgeHUD.js';

async function ignite() {
    console.log("🚀 Ignición del Satélite Soberano...");

    // 1. Inicializar el Sistema Nervioso (Sin dependencia de UI para Auth)
    const bridge = new IndraBridge({
        coreUrl: 'https://script.google.com/macros/s/AKfycbyhEucpkr6GtpMqQ0LnenhP4SIUXOUJ2M4ycFIVGLBmUuxWYL6hXRTUOBESiC6LlpfA/exec',
        satelliteToken: 'indra_satellite_omega'
    });

    // 2. Handshake con el Core (Infraestructura)
    const coreMeta = await bridge.init();
    console.log(`🔗 Resonancia establecida con el Core v${coreMeta.core_version}`);

    // 3. Cargar la Realidad Local (Contrato mediado por Git)
    const reader = await ContractReader.loadLocal('./_INDRA_PROTOCOL_/indra_contract.json');
    
    // 4. Carga de Workspaces (Acceso de Infraestructura)
    let workspaces = [];
    try {
        workspaces = await bridge.listWorkspaces();
    } catch (e) {
        console.warn("⚠️ Workspaces restringidos. Identidad requerida.");
    }

    // 5. Proyectar en la Estación de Control (HUD Pasivo)
    const hud = document.getElementById('main-hud');
    if (hud) {
        // El HUD solo recibe datos. No inicia procesos.
        hud.config = {
            contract: reader.contract,
            workspaces: workspaces,
            core: {
                sat_name: 'VETA DE ORO ERP'
            },
            // user: { email: 'admin@vetadeoro.com' } // <--- Ejemplo de inyección de identidad
        };
    }

    /**
     * NOTA ARQUITECTÓNICA:
     * El login debe manejarse aquí, en la lógica del ERP.
     * Al obtener el token, se inyectaría al bridge: 
     * bridge.setAuth(googleToken);
     * hud.config = { ...hud.config, user: { email: '...' } };
     */
}

// Iniciar el Proceso
ignite().catch(err => {
    console.error("❌ ERROR CRÍTICO EN IGNICIÓN:", err);
});
