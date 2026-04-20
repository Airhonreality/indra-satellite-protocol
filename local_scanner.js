import fs from 'fs';
import path from 'path';

/**
 * =============================================================================
 * INDRA LOCAL SCANNER (v1.0 - OFFLINE FIRST)
 * =============================================================================
 * Responsabilidad: Escanear el ADN local y generar el snapshot del contrato.
 * =============================================================================
 */

const CONFIG = {
    outputFile: './_INDRA_PROTOCOL_/indra_contract.js',
    scorePath: './src/score'
};

async function harvestAssets(folderName) {
    const fullPath = path.join(CONFIG.scorePath, folderName);
    if (!fs.existsSync(fullPath)) return [];
    
    const files = fs.readdirSync(fullPath);
    const assets = [];

    for (const file of files) {
        if (!file.endsWith('.js')) continue;
        const filePath = path.join(fullPath, file);
        try {
            // Importación dinámica para extraer el esquema
            const module = await import('file://' + path.resolve(filePath));
            const data = module.default || module.schema || module.workflow || module;
            assets.push(data);
        } catch (e) {
            console.warn(`[Scanner] Error leyendo archivo: ${file}`, e.message);
        }
    }
    return assets.filter(Boolean);
}

async function runLocalScan() {
    console.log("🔍 [Scanner] Iniciando escaneo de ADN en disco...");

    try {
        const localSchemas = await harvestAssets('schemas');
        const localWorkflows = await harvestAssets('workflows');

        const contract = {
            synced_at: new Date().toISOString(),
            core_id: "local_dev",
            core_version: "5.5.0",
            capabilities: {
                protocols: ["ATOM_READ", "ATOM_UPDATE", "ATOM_PATCH"],
                providers: ["system", "drive"],
                workspaces: []
            },
            schemas: localSchemas,
            workflows: localWorkflows
        };

        const dir = path.dirname(CONFIG.outputFile);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        
        const fileContent = `/** INDRA LOCAL SNAPSHOT */\nexport const INDRA_CONTRACT = ${JSON.stringify(contract, null, 2)};`;
        fs.writeFileSync(CONFIG.outputFile, fileContent);

        console.log(`✅ [Scanner] Éxito: ${localSchemas.length} esquemas y ${localWorkflows.length} workflows detectados.`);
        
    } catch (error) {
        console.error("❌ [Scanner] Fallo crítico durante el escaneo:", error);
        process.exit(1);
    }
}

runLocalScan();
