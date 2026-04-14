/**
 * =============================================================================
 * INDRA BRIDGE HUD (Blueprint Standard v2.0)
 * =============================================================================
 * Responsabilidad: Interfaz de control estricta y profesional.
 * Nomenclatura: Basada 100% en el Blueprint de Veta de Oro.
 * Estética: Minimalista, sin elementos superfluos (emojis).
 * =============================================================================
 */

const TEMPLATE = `
<style>
    :host {
        display: block;
        font-family: var(--indra-font, 'Inter', system-ui, sans-serif);
        --accent: #1A73E8;
        --bg: #FFFFFF;
        --surface: #F8F9FA;
        --text: #3C4043;
        --border: #DADCE0;
        color: var(--text);
    }

    .hud-container {
        display: flex;
        flex-direction: column;
        background: var(--bg);
        border: 1px solid var(--border);
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    /* --- HEADER: IDENTIDAD Y ACCESO --- */
    .hud-header {
        background: #FFFFFF;
        border-bottom: 2px solid var(--surface);
        padding: 20px 30px;
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
        font-size: 11px;
        color: #70757a;
        margin-top: 4px;
    }

    .sat-label {
        font-weight: 700;
        font-size: 13px;
        color: #202124;
        letter-spacing: 0.2px;
    }

    .btn-google {
        display: flex;
        align-items: center;
        gap: 12px;
        background: #FFFFFF;
        color: #3C4043;
        border: 1px solid var(--border);
        padding: 10px 18px;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.2s;
    }

    .btn-google:hover { background: #f8f9fa; border-color: #bcc1c8; }
    .btn-google svg { width: 18px; height: 18px; }

    /* --- GRID DE CARDS --- */
    .hud-body {
        display: grid;
        grid-template-columns: 340px 1fr;
        gap: 1px;
        background: var(--border);
    }

    .card {
        background: #FFFFFF;
        padding: 25px;
    }

    .card-title {
        font-size: 11px;
        color: #5f6368;
        text-transform: uppercase;
        letter-spacing: 0.8px;
        font-weight: 700;
        margin-bottom: 20px;
        border-bottom: 1px solid var(--surface);
        padding-bottom: 8px;
    }

    /* --- CARD 1: CONFIGURACIÓN DEL WORKSPACE --- */
    .workspace-selector {
        background: var(--surface);
        border: 1px solid var(--border);
        padding: 12px;
        width: 100%;
        border-radius: 4px;
        margin-bottom: 15px;
        font-size: 13px;
    }

    .btn-action {
        width: 100%;
        background: #F1F3F4;
        border: none;
        color: #3C4043;
        padding: 10px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        border-radius: 4px;
    }

    .btn-action:hover { background: #E8EAED; }

    /* --- CARD 2: PANEL DE ESQUEMAS --- */
    .resonance-tree {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .schema-node {
        border: 1px solid #f1f3f4;
        border-radius: 6px;
        overflow: hidden;
        background: #fff;
    }

    .schema-header {
        background: var(--surface);
        padding: 10px 15px;
        border-bottom: 1px solid var(--border);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .schema-title { font-weight: 700; font-size: 13px; color: #202124; }
    .status-badge { 
        font-size: 9px; 
        padding: 2px 6px; 
        border-radius: 10px; 
        font-weight: 700;
        background: #e8f0fe;
        color: var(--accent);
    }

    .schema-body {
        padding: 15px;
        font-size: 12px;
    }

    .meta-row {
        display: flex;
        gap: 20px;
        margin-bottom: 12px;
        color: #70757a;
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
    }

    .property-list {
        background: #f8f9fa;
        border-radius: 4px;
        padding: 8px;
    }

    .prop-item {
        display: flex;
        justify-content: space-between;
        padding: 6px 0;
        border-bottom: 1px solid rgba(0,0,0,0.03);
    }

    .prop-silo { color: #188038; font-weight: 600; font-size: 9px; }

    /* --- CARD 3: WORKFLOW & AUTOMATION DESIGNER --- */
    .workflow-panel {
        display: grid;
        grid-template-columns: 260px 1fr;
        gap: 30px;
        min-height: 450px;
    }

    .flow-list {
        border-right: 1px solid var(--surface);
    }

    .flow-item {
        padding: 12px;
        font-size: 13px;
        color: #5f6368;
        cursor: pointer;
        border-radius: 4px;
    }

    .flow-item.active { background: #E8F0FE; color: var(--accent); font-weight: 700; }

    .empty-designer {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #BDC1C6;
        text-align: center;
    }
</style>

<div class="hud-container">
    <header class="hud-header">
        <div class="core-identity">
            <span class="sat-label" id="sat-name">IDENTIFICACIÓN: DESCONOCIDO</span>
            <span class="core-id" id="core-id">GOOGLE_CORE: PENDIENTE DE SESIÓN</span>
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
        <div style="display: flex; flex-direction: column; background: var(--border); gap: 1px;">
            <!-- CARD I -->
            <section class="card">
                <h3 class="card-title">CONFIGURACIÓN DEL WORKSPACE</h3>
                <select class="workspace-selector" id="ws-select">
                    <option value="">SIN ENTORNOS</option>
                </select>
                <button class="btn-action">CREAR NUEVO WORKSPACE</button>
            </section>

            <!-- CARD II -->
            <section class="card">
                <h3 class="card-title">PANEL DE ESQUEMAS</h3>
                <div class="resonance-tree" id="res-tree">
                    <div style="opacity: 0.3; font-size: 11px;">ESPERANDO HANDSHAKE...</div>
                </div>
            </section>
        </div>

        <!-- CARD III -->
        <section class="card" style="border-left: 1px solid var(--border);">
            <h3 class="card-title">WORKFLOW & AUTOMATION DESIGNER</h3>
            <div class="workflow-panel">
                <div class="flow-list" id="flow-list">
                    <div class="flow-item active">Nuevo Flujo Local...</div>
                </div>
                <div class="empty-designer" id="flow-content">
                    <div style="color: #dadce0; font-size: 32px; font-weight: 300;">PROYECTOR LÓGICO</div>
                    <div style="font-size: 12px; margin-top: 15px;">Seleccione un esquema para iniciar el diseño de flujo.</div>
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
        if (this._config) this.applyConfig(this._config);
    }

    set config(data) {
        this._config = data;
        if (this.shadowRoot && this.shadowRoot.getElementById('core-id')) {
            this.applyConfig(data);
        }
    }

    applyConfig(data) {
        if (data.contract) this.updateResonanceTree(data.contract);
        if (data.workspaces) this.updateWorkspaces(data.workspaces);
        if (data.core) {
            const coreIdEl = this.shadowRoot.getElementById('core-id');
            const satNameEl = this.shadowRoot.getElementById('sat-name');
            if (coreIdEl) coreIdEl.innerText = `STATUS: ${data.core.status || 'CONECTADO'} | ID: ${data.core.id}`;
            if (satNameEl) satNameEl.innerText = `INSTANCIA: ${data.core.sat_name || 'INDRA'}`;
        }
    }

    updateWorkspaces(workspaces) {
        const select = this.shadowRoot.getElementById('ws-select');
        if (!select || workspaces.length === 0) return;
        select.innerHTML = workspaces.map(ws => `<option value="${ws.id}">${ws.name}</option>`).join('');
    }

    updateResonanceTree(contract) {
        const tree = this.shadowRoot.getElementById('res-tree');
        if (!contract) return;
        const schemas = contract.schemas || (contract.raw?.metadata?.items?.filter(i => i.class === 'SCHEMA')) || [];
        
        if (schemas.length === 0) {
            tree.innerHTML = '<div style="opacity:0.3; font-size:11px;">SIN ESQUEMAS DISPONIBLES</div>';
            return;
        }

        tree.innerHTML = schemas.map(schema => `
            <div class="schema-node">
                <div class="schema-header">
                    <span class="schema-title">${schema.handle?.alias || schema.id}</span>
                    <span class="status-badge">RESONANDO</span>
                </div>
                <div class="schema-body">
                    <div class="meta-row">
                        <span>UBICACIÓN: ${schema.handle?.location || 'src/components/Form.js'}</span>
                        <span>SELECTOR: ${schema.handle?.selector || '#' + schema.id}</span>
                    </div>
                    <div class="property-list">
                        ${(schema.properties || []).map(prop => `
                            <div class="prop-item">
                                <span>${prop.name} <small style="opacity:0.5">${prop.type}</small></span>
                                <span class="prop-silo">VÍNCULO: ${prop.silo_mapping || 'GOOGLE_SHEETS'}</span>
                            </div>
                        `).join('') || '<div style="opacity:0.5">Sin propiedades definidas</div>'}
                    </div>
                </div>
            </div>
        `).join('');
    }

    render() {
        this.shadowRoot.innerHTML = TEMPLATE;
        this.shadowRoot.getElementById('login-trigger').onclick = () => {
             alert("Redirigiendo a Google Auth...");
             this.dispatchEvent(new CustomEvent('indra-login', { bubbles: true, composed: true }));
        };
    }
}

customElements.define('indra-bridge-hud', IndraBridgeHUD);
