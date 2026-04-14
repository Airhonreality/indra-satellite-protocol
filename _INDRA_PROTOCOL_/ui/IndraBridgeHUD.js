/**
 * =============================================================================
 * INDRA BRIDGE HUD (Soberanía Veta de Oro - LIGHT EDITION)
 * =============================================================================
 * Responsabilidad: Orquestador visual del Satélite.
 * Tematización: Premium Light Mode.
 * Identidad: Google Identity Integrated.
 * =============================================================================
 */

const TEMPLATE = `
<style>
    :host {
        display: block;
        font-family: var(--indra-font, 'Inter', system-ui, sans-serif);
        --accent: var(--indra-accent, #1A73E8);
        --bg: var(--indra-bg, #FFFFFF);
        --surface: var(--indra-surface, #F8F9FA);
        --text: var(--indra-text, #3C4043);
        --border: var(--indra-border, #DADCE0);
        --card-bg: #FFFFFF;
        color: var(--text);
    }

    .hud-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
        background: var(--bg);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 0;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    }

    /* --- HEADER --- */
    .hud-header {
        background: var(--surface);
        border-bottom: 1px solid var(--border);
        padding: 15px 25px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .core-identity {
        display: flex;
        flex-direction: column;
    }

    .core-id {
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        color: var(--accent);
        font-weight: 600;
        opacity: 0.8;
    }

    .sat-label {
        font-weight: 800;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: #202124;
    }

    /* --- GOOGLE LOGIN BUTTON --- */
    .btn-google {
        display: flex;
        align-items: center;
        gap: 10px;
        background: #FFFFFF;
        color: #3C4043;
        border: 1px solid var(--border);
        padding: 8px 16px;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 1px 2px rgba(60,64,67, 0.3), 0 1px 3px 1px rgba(60,64,67, 0.15);
    }

    .btn-google:hover {
        background: #F7F8F8;
        box-shadow: 0 1px 2px rgba(60,64,67, 0.3), 0 2px 6px 2px rgba(60,64,67, 0.15);
    }

    .btn-google:active {
        background: #E8EAED;
        box-shadow: 0 1px 2px rgba(60,64,67, 0.3);
    }

    .btn-google svg {
        width: 18px;
        height: 18px;
    }

    /* --- GRID DE CARDS --- */
    .hud-body {
        display: grid;
        grid-template-columns: 320px 1fr;
        gap: 20px;
        padding: 25px;
        background: var(--surface);
    }

    .card {
        background: var(--card-bg);
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.02);
    }

    .card-title {
        font-size: 11px;
        color: #70757a;
        text-transform: uppercase;
        letter-spacing: 1.2px;
         font-weight: 700;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    /* --- CARD 1: WORKSPACE --- */
    .workspace-selector {
        background: #FFFFFF;
        border: 1px solid var(--border);
        color: var(--text);
        width: 100%;
        padding: 10px;
        border-radius: 4px;
        margin-bottom: 12px;
        font-size: 13px;
        outline: none;
    }

    .workspace-selector:focus { border-color: var(--accent); }

    .btn-action {
        width: 100%;
        background: transparent;
        border: 1px solid var(--accent);
        color: var(--accent);
        padding: 8px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        border-radius: 4px;
        transition: background 0.2s;
    }

    .btn-action:hover { background: rgba(26, 115, 232, 0.04); }

    /* --- CARD 2: RESONANCIA (Árbol) --- */
    .resonance-tree {
        font-family: 'JetBrains Mono', monospace;
        font-size: 12px;
    }

    .tree-node {
        padding: 8px 0;
        border-bottom: 1px solid #f1f3f4;
    }

    .node-label { display: flex; justify-content: space-between; font-weight: 600; color: #202124; }
    .node-meta { font-size: 10px; color: #70757a; margin-top: 2px; }

    /* --- CARD 3: WORKFLOW --- */
    .workflow-panel {
        display: grid;
        grid-template-columns: 240px 1fr;
        gap: 20px;
        min-height: 400px;
    }

    .flow-list {
        border-right: 1px solid #f1f3f4;
        padding-right: 15px;
    }

    .flow-item {
        padding: 12px;
        font-size: 13px;
        color: #5f6368;
        cursor: pointer;
        border-radius: 6px;
        margin-bottom: 4px;
        transition: all 0.2s;
    }

    .flow-item:hover { background: #f1f3f4; }
    .flow-item.active { background: #E8F0FE; color: var(--accent); font-weight: 600; }

    .flow-editor-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #dadce0;
        text-align: center;
    }
</style>

<div class="hud-container">
    <header class="hud-header">
        <div class="core-identity">
            <span class="sat-label" id="sat-name">CARGANDO SATÉLITE...</span>
            <span class="core-id" id="core-id">Sincronizando Core...</span>
        </div>
        <div class="user-auth">
            <button class="btn-google" id="login-trigger">
                <svg viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                <span>Acceder con Google</span>
            </button>
        </div>
    </header>

    <div class="hud-body">
        <div style="display: flex; flex-direction: column; gap: 20px;">
            <section class="card">
                <h3 class="card-title">🌐 Espacio de Trabajo</h3>
                <select class="workspace-selector" id="ws-select">
                    <option>Cargando entornos...</option>
                </select>
                <button class="btn-action" id="create-ws">+ NUEVO ENTORNO</button>
            </section>

            <section class="card">
                <h3 class="card-title">🧬 Árbol de Resonancia</h3>
                <div class="resonance-tree" id="res-tree">
                    <div style="opacity: 0.3; font-size: 11px;">Mapeando realidad local...</div>
                </div>
            </section>
        </div>

        <section class="card">
            <h3 class="card-title">🎼 Orquestador de Flujos</h3>
            <div class="workflow-panel">
                <div class="flow-list" id="flow-list">
                    <div class="flow-item active">Nuevo Flujo de Negocio</div>
                </div>
                <div class="flow-editor-empty" id="flow-content">
                    <div style="font-size: 48px; margin-bottom: 20px;">🎼</div>
                    <div style="font-weight: 600; color: #5f6368;">Diseñador de Flujos v2.2</div>
                    <div style="font-size: 13px; color: #9aa0a6; margin-top: 10px;">Selecciona una partitura para editar la lógica.</div>
                </div>
            </div>
        </section>
    </div>
</div>
`;

class IndraBridgeHUD extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._config = null;
    }

    connectedCallback() {
        this.render();
        if (this._config) {
            this.applyConfig(this._config);
        }
    }

    set config(data) {
        this._config = data;
        if (this.shadowRoot && this.shadowRoot.getElementById('core-id')) {
            this.applyConfig(data);
        }
    }

    applyConfig(data) {
        if (data.contract) this.updateResonanceTree(data.contract);
        if (data.core) {
            const coreIdEl = this.shadowRoot.getElementById('core-id');
            const satNameEl = this.shadowRoot.getElementById('sat-name');
            if (coreIdEl) coreIdEl.innerText = `CORE ID: ${data.core.id}`;
            if (satNameEl) satNameEl.innerText = data.core.sat_name || 'INDRA SATELLITE';
        }
    }

    updateResonanceTree(contract) {
        const tree = this.shadowRoot.getElementById('res-tree');
        if (!contract) return;

        const schemas = contract.schemas || (contract.raw?.metadata?.items?.filter(i => i.class === 'SCHEMA')) || [];

        if (schemas.length === 0) {
            tree.innerHTML = '<div style="opacity:0.3; font-size:11px;">No hay esquemas resonando.</div>';
            return;
        }

        tree.innerHTML = schemas.map(schema => `
            <div class="tree-node">
                <div class="node-label">
                    <span>${schema.handle?.alias || schema.id}</span>
                </div>
                <div class="node-meta">${schema.protocols?.join(' • ') || 'Silo Sincronizado'}</div>
            </div>
        `).join('');
    }

    render() {
        this.shadowRoot.innerHTML = TEMPLATE;
        this.shadowRoot.getElementById('login-trigger').onclick = () => {
            this.dispatchEvent(new CustomEvent('indra-login', { bubbles: true, composed: true }));
        };
    }
}

customElements.define('indra-bridge-hud', IndraBridgeHUD);
