/**
 * =============================================================================
 * INDRA BRIDGE HUD (Soberanía Veta de Oro)
 * =============================================================================
 * Responsabilidad: Orquestador visual del Satélite.
 * Capas: Identidad, Workspace, Esquemas, Flujos.
 * =============================================================================
 */

const TEMPLATE = `
<style>
    :host {
        display: block;
        font-family: var(--indra-font, 'Inter', system-ui, sans-serif);
        --accent: var(--indra-accent, #00f2ff);
        --bg: var(--indra-bg, #0a0c12);
        --card-bg: rgba(255, 255, 255, 0.03);
        --border: rgba(0, 242, 255, 0.15);
        color: #fff;
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
    }

    /* --- HEADER --- */
    .hud-header {
        background: rgba(0, 242, 255, 0.05);
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
        opacity: 0.7;
    }

    .sat-label {
        font-weight: bold;
        font-size: 16px;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .user-auth {
        display: flex;
        align-items: center;
        gap: 15px;
    }

    .btn-login {
        background: var(--accent);
        color: #000;
        border: none;
        padding: 6px 15px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: bold;
        cursor: pointer;
        transition: transform 0.2s;
    }

    .btn-login:hover { transform: scale(1.05); }

    /* --- GRID DE CARDS --- */
    .hud-body {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: 20px;
        padding: 25px;
    }

    .card {
        background: var(--card-bg);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 8px;
        padding: 20px;
    }

    .card-title {
        font-size: 12px;
        color: var(--accent);
        text-transform: uppercase;
        letter-spacing: 1.5px;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    /* --- CARD 1: WORKSPACE --- */
    .workspace-selector {
        background: #000;
        border: 1px solid var(--border);
        color: #fff;
        width: 100%;
        padding: 8px;
        border-radius: 4px;
        margin-bottom: 10px;
    }

    .btn-action {
        width: 100%;
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #fff;
        padding: 7px;
        font-size: 11px;
        cursor: pointer;
        border-radius: 4px;
    }

    .btn-action:hover { border-color: var(--accent); color: var(--accent); }

    /* --- CARD 2: RESONANCIA (Árbol) --- */
    .resonance-tree {
        font-family: 'JetBrains Mono', monospace;
        font-size: 12px;
    }

    .tree-node {
        padding: 5px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.03);
    }

    .node-label { display: flex; justify-content: space-between; }
    .node-meta { font-size: 10px; opacity: 0.4; }

    /* --- CARD 3: WORKFLOW --- */
    .workflow-panel {
        display: grid;
        grid-template-columns: 200px 1fr;
        gap: 20px;
    }

    .flow-list {
        border-right: 1px solid rgba(255, 255, 255, 0.05);
        padding-right: 15px;
    }

    .flow-item {
        padding: 10px;
        font-size: 13px;
        opacity: 0.6;
        cursor: pointer;
        border-radius: 4px;
    }

    .flow-item.active { opacity: 1; background: rgba(0, 242, 255, 0.1); color: var(--accent); }
</style>

<div class="hud-container">
    <header class="hud-header">
        <div class="core-identity">
            <span class="sat-label" id="sat-name">SATELLITE_NAME</span>
            <span class="core-id" id="core-id">CORE: DISCONNECTED</span>
        </div>
        <div class="user-auth">
            <span id="user-info" style="font-size: 11px; opacity: 0.6;">Offline</span>
            <button class="btn-login" id="login-trigger">INGRESAR (GAS)</button>
        </div>
    </header>

    <div class="hud-body">
        <!-- LADO IZQUIERDO: CONFIG Y RESONANCIA -->
        <div style="display: flex; flex-direction: column; gap: 20px;">
            <!-- CARD I: WORKSPACE -->
            <section class="card">
                <h3 class="card-title">🌐 CONFIG. WORKSPACE</h3>
                <select class="workspace-selector" id="ws-select">
                    <option>Default Workspace</option>
                </select>
                <button class="btn-action" id="create-ws">+ CREAR ENTORNO</button>
            </section>

            <!-- CARD II: ÁRBOL DE RESONANCIA -->
            <section class="card">
                <h3 class="card-title">🧬 ÁRBOL DE RESONANCIA</h3>
                <div class="resonance-tree" id="res-tree">
                    <div class="empty-state" style="opacity: 0.3; font-size: 11px;">Esperando sincronización de esquemas...</div>
                </div>
            </section>
        </div>

        <!-- LADO DERECHO: WORKFLOWS -->
        <section class="card">
            <h3 class="card-title">🎼 ORQUESTADOR DE FLUJOS</h3>
            <div class="workflow-panel">
                <div class="flow-list" id="flow-list">
                    <div class="flow-item active">Nuevo Flujo...</div>
                </div>
                <div class="flow-editor" id="flow-content" style="opacity: 0.2; text-align: center; padding-top: 50px;">
                    Editor de Lógica v2.0 <br> [Seleccione un flujo para resonar]
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
        this._contract = null;
        this._user = null;
    }

    connectedCallback() {
        this.render();
    }

    set config(data) {
        if (data.contract) this.updateResonanceTree(data.contract);
        if (data.core) {
            this.shadowRoot.getElementById('core-id').innerText = `CORE: ${data.core.id}`;
            this.shadowRoot.getElementById('sat-name').innerText = data.core.sat_name || 'INDRA SAT';
        }
    }

    updateResonanceTree(contract) {
        const tree = this.shadowRoot.getElementById('res-tree');
        if (!contract || !contract.schemas) return;

        tree.innerHTML = contract.schemas.map(schema => `
            <div class="tree-node">
                <div class="node-label">
                    <span>${schema.handle?.label || schema.id}</span>
                </div>
                <div class="node-meta">ID: ${schema.id} | ${schema.protocols?.join(', ')}</div>
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
