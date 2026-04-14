/**
 * =============================================================================
 * MAIN SATELLITE ENTRY POINT
 * =============================================================================
 * Este es el archivo donde el usuario inicia su lógica de negocio.
 * Importamos todo desde la jurisdicción protegida _INDRA_PROTOCOL_.
 * =============================================================================
 */

import IndraBridge from '../_INDRA_PROTOCOL_/core/IndraBridge.js';
import WorkflowEngine from '../_INDRA_PROTOCOL_/core/WorkflowEngine.js';
import ContractReader from '../_INDRA_PROTOCOL_/core/ContractReader.js';
import '../_INDRA_PROTOCOL_/ui/IndraBridgeHUD.js';

async function ignite() {
    console.log("🚀 Ignición del Satélite...");

    // 1. Inicializar el Sistema Nervioso
    const bridge = new IndraBridge({
        coreUrl: 'https://script.google.com/macros/s/AKfycbyhEucpkr6GtpMqQ0LnenhP4SIUXOUJ2M4ycFIVGLBmUuxWYL6hXRTUOBESiC6LlpfA/exec',
        satelliteToken: 'indra_satellite_omega'
    });

    // 2. Handshake con el Core
    const coreMeta = await bridge.init();
    console.log(`🔗 Resonancia establecida con el Core v${coreMeta.core_version}`);

    // 3. Cargar la Realidad Local (Contrato)
    const reader = await ContractReader.loadLocal('./_INDRA_PROTOCOL_/indra_contract.json');
    console.log(`📦 Capacidades asimiladas: ${reader.contract.capabilities.protocols.length} protocolos.`);

    // 4. Obtener Entornos (Workspaces) reales
    let workspaces = [];
    try {
        workspaces = await bridge.listWorkspaces();
    } catch (e) {
        console.warn("⚠️ No se pudieron cargar los workspaces (¿Sesión activa?).");
    }

    // 5. Proyectar en la Estación de Control (HUD)
    const hud = document.getElementById('main-hud');
    if (hud) {
        hud.config = {
            contract: reader.contract,
            workspaces: workspaces,
            core: {
                id: coreMeta.core_id, 
                sat_name: 'VETA DE ORO ERP',
                status: 'RESONANDO'
            }
        };
    }
}

ignite().catch(err => console.error("❌ Fallo en la ignición:", err));
