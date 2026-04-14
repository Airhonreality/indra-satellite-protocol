/**
 * PROJECT ORCHESTRATOR (v1.0) - Veta OS Satellite
 * Orquestador soberano del Definidor de Proyectos.
 * Siguiendo el ADR_033: Remote Forge Connector.
 */

window.ProjectOrchestrator = (function() {

    // 1. DECLARACIÓN DE INTENCIÓN (Para el Satellite HUD)
    window.INDRA_SCHEMAS = {
        'veta_proyectos_v1': {
            label: 'Definidor de Proyectos',
            requirements: ['project_id', 'fase_actual', 'json_espacios']
        }
    };

    const state = {
        activeProjectId: null,
        activeSpaceId: null,
        data: null
    };

    /**
     * Inicializa el satélite y espera el Handshake de Indra o la Resonancia de la Shell
     */
    async function init() {
        console.log('[VetaOS] Satélite Proyectos: Esperando Handshake o Resonancia...');
        
        // v1.7: ACTIVAR ESCUCHA DE LA SHELL MADRE
        // Esto permite que si abrimos esta herramienta desde la Torre de Control,
        // no necesitemos loguearnos de nuevo.
        window.indra.listenFromShell();

        // Escuchar cuando el Bridge esté listo (ya sea por Discovery o Resonancia)
        window.addEventListener('indra-ready', (e) => {
            console.log('[VetaOS] Resonancia captada. Hidratando herramienta...');
            hydrate(e.detail.payload || {}); // Hidratación con los datos que vengan
        });
    }

    /**
     * HIDRATACIÓN AXIOMÁTICA
     * Mapea el JSON de la Forja hacia los Slots del Layout
     */
    function hydrate(payload) {
        if (!payload) return;
        state.data = payload;

        console.log('[VetaOS] Hidratando Slots con materia de la Forja...');

        // 1. Buscamos todos los slots del DOM
        const slots = document.querySelectorAll('[data-indra-slot]');
        slots.forEach(slot => {
            const key = slot.getAttribute('data-indra-slot');
            if (payload[key]) {
                slot.innerText = payload[key];
                // Si el slot estaba en modo "ghost", quitamos la marca visual
                slot.classList.remove('indra-ghost-slot');
            }
        });

        // 2. Ejecutar Lógica de Listas (Loops)
        renderSpaceList();
    }

    /**
     * RENDER DE ESPACIOS (Panel Lateral)
     */
    function renderSpaceList() {
        const container = document.querySelector('[data-indra-loop="spaces_list"]');
        if (!container || !state.data.json_espacios) return;

        const espacios = JSON.parse(state.data.json_espacios);
        container.innerHTML = '';

        espacios.forEach(esp => {
            const el = document.createElement('div');
            el.className = 'indra-ghost-slot';
            el.style.width = '100%';
            el.style.marginBottom = '5px';
            el.innerText = esp.name.toUpperCase();
            
            // Cambio de Contexto al Click
            el.onclick = () => selectSpace(esp.id);
            
            container.appendChild(el);
        });
    }

    /**
     * SELECCIÓN DE ESPACIO (Cambio de Contexto)
     */
    function selectSpace(spaceId) {
        state.activeSpaceId = spaceId;
        console.log('[VetaOS] Cambio de Espacio:', spaceId);
        
        // Aquí se dispararía la hidratación del Panel B (Workspace)
        const spaceNameSlot = document.querySelector('[data-indra-slot="active_space_name"]');
        if (spaceNameSlot) {
            const espacios = JSON.parse(state.data.json_espacios);
            const current = espacios.find(e => e.id === spaceId);
            spaceNameSlot.innerText = current.name;
        }
    }

    return { init, hydrate };

})();

// Auto-inicio
window.addEventListener('DOMContentLoaded', () => window.ProjectOrchestrator.init());
