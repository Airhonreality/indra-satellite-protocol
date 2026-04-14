/**
 * =============================================================================
 * MAIN SATELLITE ENTRY POINT (Consolidated v2.3)
 * =============================================================================
 */
import IndraBridge from '../_INDRA_PROTOCOL_/core/IndraBridge.js';
import '../_INDRA_PROTOCOL_/ui/IndraBridgeHUD.js';

async function ignite() {
    console.log("🚀 Ignición Axial...");

    // 1. Un solo motor: El Bridge consolidado
    const bridge = new IndraBridge({
        // coreUrl: '...', // Opcional para resonancia remota
        // satelliteToken: '...' // Opcional para identidad soberana
    });

    // 2. Inicialización Automática (Carga ADN local y busca Core remoto)
    await bridge.init();

    // 3. Emparejamiento Directo con el HUD
    const hud = document.getElementById('main-hud');
    if (hud) hud.bridge = bridge;

    // Reporte Técnico Instantáneo (Power User)
    bridge.audit();
}

ignite().catch(err => console.error("❌ ERROR EN IGNICIÓN:", err));
