/**
 * INDRA MAIN ORCHESTRATOR (v5.1 PURE SHELL)
 * Punto de entrada único. Cero persistencia local.
 */

import { indraBus } from './core/IndraEventBus.js';
import { projectService } from './services/ProjectContextService.js';
import { financeService } from './services/FinanceService.js';
import { QuotationEngine } from './services/QuotationEngine.js';
import { DashboardRenderer, QuotationRenderer } from './Renderers.js';

async function initIndraSystem() {
    console.log("🚀 Indra Engine v5.1: Operando en modo 'Cascarón Vacío'...");

    // 1. Instanciación de Motores (Estado Inicial Vacío)
    const qEngine = new QuotationEngine();

    // 2. Inicializar Renderers
    DashboardRenderer.init();
    QuotationRenderer.init(qEngine);

    // EXPOSICIÓN GLOBAL PARA RENDERERS
    window.indraEngine = qEngine;

    // 3. Cargar Datos Iniciales (Tirando del hilo de la matriz)
    await projectService.loadContext('VETA-2024-89');
    
    // El motor se sincroniza solo tras el primer espacio/carga
    qEngine.sync();

    console.log("✅ Proyección de Indra finalizada.");
}

document.addEventListener('DOMContentLoaded', initIndraSystem);
