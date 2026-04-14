import fs from 'fs';
import path from 'path';

/**
 * =============================================================================
 * INDRA CORE SYNC (Contract Mirror)
 * =============================================================================
 * Responsabilidad: Sincronizar las capacidades estructurales del Core localmente.
 * Objetivo: Proveer rigor técnico para el desarrollo de automatizaciones (LLM-Ready).
 * =============================================================================
 */

// CONFIGURACIÓN (Ajusta estos valores o usa variables de entorno)
const CONFIG = {
    coreUrl: 'https://script.google.com/macros/s/AKfycbyhEucpkr6GtpMqQ0LnenhP4SIUXOUJ2M4ycFIVGLBmUuxWYL6hXRTUOBESiC6LlpfA/exec',
    satelliteToken: 'indra_satellite_omega', // Tu token de acceso
    outputFile: './core/indra_contract.json'
};

async function sync() {
    console.log("🚀 Iniciando sincronización de contrato con el Core...");
    console.log(`🔗 Destino: ${CONFIG.coreUrl}`);

    try {
        // 1. Handshake Inicial
        const manifestRes = await fetch(CONFIG.coreUrl, {
            method: 'POST',
            body: JSON.stringify({
                protocol: 'SYSTEM_MANIFEST',
                provider: 'system',
                satellite_token: CONFIG.satelliteToken
            })
        });
        
        const manifestData = await manifestRes.json();
        console.log("Raw Manifest Response:", JSON.stringify(manifestData, null, 2));

        if (manifestData.metadata?.status !== 'OK' && manifestData.metadata?.status !== 'NEEDS_SETUP') {
            throw new Error(`Error del Core: ${manifestData.metadata?.error || 'Desconocido'}`);
        }

        // 2. Obtener Esquemas de Configuración
        const schemaRes = await fetch(CONFIG.coreUrl, {
            method: 'POST',
            body: JSON.stringify({
                protocol: 'SYSTEM_CONFIG_SCHEMA',
                provider: 'system',
                satellite_token: CONFIG.satelliteToken
            })
        });
        
        const schemaData = await schemaRes.json();

        // 3. Consolidar el CONTRATO (La Verdad Estructural)
        const contract = {
            synced_at: new Date().toISOString(),
            core_id: manifestData.metadata?.core_id || 'unknown',
            core_version: manifestData.metadata?.core_version || 'unknown',
            capabilities: {
                protocols: [...new Set((manifestData.items || []).flatMap(i => i.protocols || []))],
                providers: (manifestData.items || []).filter(i => i.class === 'SILO').map(s => s.id),
                workspaces: (manifestData.items || []).filter(i => i.class === 'WORKSPACE').map(w => ({ id: w.id, label: w.handle?.label }))
            },
            schemas: schemaData.items || []
        };

        // 4. Persistir
        const dir = path.dirname(CONFIG.outputFile);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        
        fs.writeFileSync(CONFIG.outputFile, JSON.stringify(contract, null, 2));

        console.log("✅ ¡Contrato sincronizado con éxito!");
        console.log(`📄 Archivo generado: ${CONFIG.outputFile}`);
        console.log(`📦 Protocolos detectados: ${contract.capabilities.protocols.length}`);
        
    } catch (error) {
        console.error("❌ Fallo en la sincronización:");
        console.error(error.message);
    }
}

sync();
