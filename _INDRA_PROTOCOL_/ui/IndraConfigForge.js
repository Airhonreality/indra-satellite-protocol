/**
 * =============================================================================
 * INDRA CONFIG FORGE (Web Component)
 * =============================================================================
 * Responsabilidad: Interfaz agnóstica para visualizar y configurar 
 * flujos de trabajo (Workflows) en el satélite.
 * =============================================================================
 */

const TEMPLATE = `
<style>
    :host {
        display: block;
        font-family: var(--indra-font, 'Inter', system-ui, sans-serif);
        
        /* VARIABLES CON FALLBACK (Personalizables desde el satélite) */
        --accent: var(--indra-accent, #00f2ff);
        --bg: var(--indra-bg, rgba(10, 12, 18, 0.95));
        --border: var(--indra-border, rgba(0, 242, 255, 0.2));
        --text: var(--indra-text, #fff);
        
        color: var(--text);
    }

    .forge-container {
        background: var(--bg);
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 20px;
        backdrop-filter: blur(10px);
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        position: relative;
        overflow: hidden;
    }

    .forge-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        border-bottom: 1px solid var(--border);
        padding-bottom: 15px;
    }

    .forge-title {
        font-family: 'JetBrains Mono', monospace;
        font-size: 14px;
        letter-spacing: 2px;
        color: var(--accent);
        text-transform: uppercase;
        margin: 0;
    }

    .workflow-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 15px;
    }

    .station-card {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 15px;
        border-radius: 6px;
        transition: all 0.3s ease;
        position: relative;
    }

    .station-card:hover {
        border-color: var(--accent);
        background: rgba(0, 242, 255, 0.05);
    }

    .station-badge {
        font-size: 10px;
        background: var(--accent);
        color: #000;
        padding: 2px 6px;
        border-radius: 3px;
        font-weight: bold;
        display: inline-block;
        margin-bottom: 8px;
    }

    .station-label {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 5px;
    }

    .station-desc {
        font-size: 12px;
        opacity: 0.6;
        line-height: 1.4;
    }

    .hud-line {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 2px;
        background: var(--accent);
        width: 0;
        transition: width 0.5s ease;
    }

    .station-card:hover .hud-line {
        width: 100%;
    }

    .btn-execute {
        background: transparent;
        border: 1px solid var(--accent);
        color: var(--accent);
        padding: 8px 16px;
        font-family: inherit;
        cursor: pointer;
        font-weight: bold;
        transition: all 0.2s;
        border-radius: 4px;
    }

    .btn-execute:hover {
        background: var(--accent);
        color: #000;
    }

    .empty-state {
        text-align: center;
        padding: 40px;
        opacity: 0.5;
        font-style: italic;
    }
</style>

<div class="forge-container">
    <header class="forge-header">
        <h2 class="forge-title">Indra Config Forge // v1.0</h2>
        <div id="status-tag" style="font-size: 10px; opacity: 0.5;">SATELLITE_READY</div>
    </header>

    <div id="content" class="workflow-grid">
        <div class="empty-state">No hay estaciones cargadas en la partitura...</div>
    </div>
</div>
`;

class IndraConfigForge extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._workflow = null;
    }

    connectedCallback() {
        this.render();
    }

    set workflow(data) {
        this._workflow = data;
        this.updateUI();
    }

    get workflow() {
        return this._workflow;
    }

    updateUI() {
        const content = this.shadowRoot.getElementById('content');
        if (!this._workflow || !this._workflow.stations) {
            content.innerHTML = '<div class="empty-state">Partitura vacía o inválida.</div>';
            return;
        }

        content.innerHTML = this._workflow.stations.map((station, index) => `
            <div class="station-card">
                <span class="station-badge">STEP ${index + 1}</span>
                <div class="station-label">${station.label || 'Estación sin nombre'}</div>
                <div class="station-desc">${station.protocol || 'Protocolo no definido'}</div>
                <div class="hud-line"></div>
                <div style="margin-top: 15px; display: flex; justify-content: flex-end;">
                     <button class="btn-execute" onclick="this.getRootNode().host.handleTrigger('${station.id}')">EDITAR MAPEO</button>
                </div>
            </div>
        `).join('');
    }

    handleTrigger(stationId) {
        const event = new CustomEvent('indra-forge-edit', {
            detail: { stationId, workflow: this._workflow },
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(event);
    }

    render() {
        this.shadowRoot.innerHTML = TEMPLATE;
        if (this._workflow) this.updateUI();
    }
}

customElements.define('indra-config-forge', IndraConfigForge);
