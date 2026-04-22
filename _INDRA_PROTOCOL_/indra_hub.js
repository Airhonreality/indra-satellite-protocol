/**
 * ☢️ INDRA HUB (The Bootloader) - SDK v16.2 Industrial Shield
 * RESPONSABILIDAD: Orquestación axial, aislamiento y carga defensiva.
 * -----------------------------------------------------------------------------
 * ⚠️ ADVERTENCIA: Este es un archivo del Núcleo de Indra OS.
 * Su modificación compromete la estabilidad industrial y las actualizaciones.
 * -----------------------------------------------------------------------------
 */

import IndraBridge from './core/IndraBridge.js';
import { IndraKernel } from './core/IndraKernel.js';

const HUB_VERSION = "16.2.0";

// --- MOTOR DE EMERGENCIA ---
const EMERGENCY_TIMEOUT = 6000;
let bootTimedOut = false;

function showEmergencyUI(errorType, message) {
    bootTimedOut = true;
    const overlay = document.createElement('div');
    overlay.style = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: #000; color: #ff3b30; z-index: 1000000;
        display: flex; flex-direction: column; justify-content: center; align-items: center;
        font-family: 'JetBrains Mono', monospace; padding: 40px; text-align: center;
    `;
    overlay.innerHTML = `
        <div style="font-size: 40px; margin-bottom: 20px;">⚠️</div>
        <div style="font-size: 14px; font-weight: bold; margin-bottom: 15px;">HUB_BOOT_FAILURE: ${errorType}</div>
        <div style="font-size: 11px; color: #fff; max-width: 600px; line-height: 1.6;">${message}</div>
        <button onclick="location.reload()" style="margin-top: 30px; background: #fff; color: #000; border: none; padding: 10px 20px; cursor: pointer; font-weight: bold;">REINTENTAR IGNICIÓN</button>
    `;
    document.body.appendChild(overlay);
}

async function bootstrap() {
    console.log(`%c 💎 INDRA HUB v${HUB_VERSION} `, "background: #000; color: #00ffc8; font-weight: bold; padding: 4px; border-radius: 4px;");

    // 1. Instanciación del Ecosistema
    const bridge = new IndraBridge();
    const kernel = new IndraKernel(bridge);
    window.indra = { bridge, kernel };

    // 2. Inyección Defensiva (Punto 3: Shadow DOM)
    try {
        await import('./ui/IndraBridgeHUD.js');
        const container = document.createElement('div');
        container.id = "indra-os-shield";
        // Aislamos el HUD en un Shadow Root para que el CSS del usuario no lo rompa
        const shadow = container.attachShadow({ mode: 'open' });
        
        // El HUD webcomponent se monta dentro del shadow
        const hud = document.createElement('indra-bridge-hud');
        shadow.appendChild(hud);
        
        // Inyectamos el CSS del HUD dentro del Shadow para aislamiento total
        const styleLink = document.createElement('link');
        styleLink.rel = 'stylesheet';
        styleLink.href = './_INDRA_PROTOCOL_/ui/styles/IndraBridgeHUD.css';
        shadow.appendChild(styleLink);

        document.body.appendChild(container);
        hud.bridge = bridge;
    } catch(e) {
        console.warn("🛡️ [Hub] Fallo en inyección de escudo visual.");
    }

    // 3. Resolución de Órbita (Lógica Inteligente)
    let config = { active_satellite: '../src/app_veta.js' }; 
    const bootTimer = setTimeout(() => {
        if (!bootTimedOut) showEmergencyUI("SATELLITE_TIMEOUT", "El satélite está tardando demasiado en responder. Revisa la ruta en indra_config.js.");
    }, EMERGENCY_TIMEOUT);

    try {
        const customConfig = await import('../indra_config.js');
        config = { ...config, ...customConfig.INDRA_CONFIG };
    } catch (e) {
        console.log("ℹ️ [Hub] Modo Zero-Config.");
    }

    // 4. Ignición y Handshake (Punto 4: Versiones)
    try {
        await bridge.init();
        
        if (config.active_satellite) {
            const satellite = await import(config.active_satellite);
            
            // Handshake de Versión: Exigimos una versión mínima si está definida
            const minCore = satellite.METADATA?.min_core_version || "16.1.0";
            if (minCore > HUB_VERSION) {
                clearTimeout(bootTimer);
                showEmergencyUI("CORE_OUTDATED", `El satélite requiere la versión ${minCore} de Indra Hub. Estás ejecutando la ${HUB_VERSION}. Por favor, haz Git Pull del protocolo.`);
                return;
            }

            if (typeof satellite.ignite === 'function') {
                await satellite.ignite(bridge, kernel);
                clearTimeout(bootTimer); // Ignición exitosa
            } else {
                showEmergencyUI("CONTRACT_VIOLATION", "El satélite no exporta la función 'ignite'.");
            }
        }
    } catch (error) {
        clearTimeout(bootTimer);
        showEmergencyUI("CRITICAL_CRASH", error.message);
    }
}

bootstrap();
