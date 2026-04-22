/**
 * =============================================================================
 * MAIN SATELLITE ENTRY POINT (Zero-Config Ignition v16.0)
 * =============================================================================
 */
import IndraBridge from '../_INDRA_PROTOCOL_/core/IndraBridge.js';
import { IndraKernel } from './score/IndraKernel.js';

import '../_INDRA_PROTOCOL_/ui/IndraBridgeHUD.js';

/**
 * SATÉLITE: Veta de Oro (EntryPoint)
 * CONTRATO: SDK v16.1 (export ignite)
 */

export async function ignite(bridge, kernel) {
    console.log("🧬 [Satélite] Ignición recibida desde el Hub. Iniciando lógica de negocio...");

    // 1. Lógica de UI / Loader
    // Ocultar loader cuando el Bridge reporte READY (o inmediatamente si ya lo está)
    const hideLoader = () => {
        const loader = document.getElementById('indra-loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 500);
        }
    };

    if (bridge.status === 'READY') {
        hideLoader();
    } else {
        window.addEventListener('indra-resonance-sync', (e) => {
            if (e.detail?.mode === 'STABLE' || e.detail?.mode === 'READY' || e.detail?.mode === 'LOCAL_READY') {
                hideLoader();
            }
        });
    }

    // 2. Aquí empieza el código real de tu satélite
    // Ej: Mount React app, start 3D loops, etc.
}

/**
 * Exportamos para debugging manual si es necesario
 */
window.satellite_active = true;
