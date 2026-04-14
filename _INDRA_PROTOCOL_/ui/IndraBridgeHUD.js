/**
 * =============================================================================
 * INDRA BRIDGE HUD (Reactive v2.3)
 * =============================================================================
 * AXIOMA: Es un observador del Bridge. No almacena estado propio, solo
 * proyecta el estado del objeto bridge que recibe.
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
    }

    .hud-container {
        display: flex;
        flex-direction: column;
        background: var(--bg);
        border: 1px solid var(--border);
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        color: var(--text);
    }

    .hud-header {
        background: #FFFFFF;
        border-bottom: 2px solid var(--surface);
        padding: 20px 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .status-group { display: flex; gap: 15px; align-items: center; }
    .badge { font-size: 9px; padding: 4px 10px; border-radius: 4px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
    .badge-core { background: #f1f3f4; color: #5f6368; }
    .badge-auth { background: #fce8e6; color: #d93025; }
    .badge-auth.active { background: #e6f4ea; color: #137333; }

    .hud-body { display: grid; grid-template-columns: 340px 1fr; gap: 1px; background: var(--border); }
    .card { background: #FFFFFF; padding: 25px; }
    .card-title { font-size: 11px; color: #5f6368; text-transform: uppercase; letter-spacing: 0.8px; font-weight: 700; margin-bottom: 20px; border-bottom: 1px solid var(--surface); padding-bottom: 8px; }

    .workspace-selector { background: var(--surface); border: 1px solid var(--border); padding: 12px; width: 100%; border-radius: 4px; margin-bottom: 15px; font-size: 13px; }
    .btn-action { width: 100%; background: #F1F3F4; border: none; padding: 10px; font-size: 12px; font-weight: 600; cursor: pointer; border-radius: 4px; }

    .schema-node { border: 1px solid #f1f3f4; border-radius: 6px; overflow: hidden; background: #fff; margin-bottom: 12px; }
    .schema-header { background: var(--surface); padding: 10px 15px; border-bottom: 1px solid var(--border); font-weight: 700; font-size: 12px; }
    .schema-body { padding: 15px; font-size: 11px; }

    .workflow-panel { display: grid; grid-template-columns: 240px 1fr; min-height: 400px; }
    .flow-list { background: var(--surface); border-right: 1px solid var(--border); padding: 15px; }
    .designer-stage { padding: 30px; }
    .btn-soapy { background: #fff; border: 1px solid var(--border); padding: 5px 12px; font-size: 10px; font-weight: 700; cursor: pointer; border-radius: 3px; }
</style>

<div class="hud-container">
    <header class="hud-header">
        <div class="core-identity">
            <span style="font-weight:700; font-size:13px;" id="sat-name">LOCALIZANDO...</span>
            <div class="status-group" style="margin-top:4px;">
                 <span class="badge badge-core" id="core-status">CORE: PENDIENTE</span>
                 <span class="badge badge-auth" id="auth-status">ACCESO: REQUERIDO</span>
            </div>
        </div>
    </header>

    <div class="hud-body">
        <div style="display: flex; flex-direction: column; background: var(--border); gap: 1px;">
            <section class="card">
                <h3 class="card-title">WORKSPACES ACTIVOS</h3>
                <select class="workspace-selector" id="ws-select"></select>
                <button class="btn-action">CREAR NUEVO ESPACIO</button>
            </section>

            <section class="card">
                <h3 class="card-title">ARBOL DE RESONANCIA (ESQUEMAS)</h3>
                <div id="res-tree"></div>
            </section>
        </div>

        <section class="card" style="padding:0;">
            <div class="workflow-panel">
                <div class="flow-list">
                    <h1 class="card-title">AUTOMATIZACIONES</h1>
                </div>
                <div class="designer-stage">
                    <h1 class="card-title">DESIGNER v2.0</h1>
                    <div id="designer-content" style="opacity:0.3; text-align:center; padding-top:100px; font-size:11px;">
                        SIN FLUJO ACTIVO
                    </div>
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
        this._bridge = null;
    }

    connectedCallback() {
        this.render();
    }

    set bridge(instance) {
        this._bridge = instance;
        // Suscribirse a los cambios del Bridge para repintar automáticamente
        this._bridge.onStateChange = () => this.updateUI();
        this.updateUI();
    }

    updateUI() {
        if (!this.shadowRoot || !this._bridge) return;

        const { contract, capabilities, coreUrl, satelliteToken } = this._bridge;

        // 1. Estados de Identidad
        const coreStatus = this.shadowRoot.getElementById('core-status');
        const authStatus = this.shadowRoot.getElementById('auth-status');
        
        if (coreUrl) {
            coreStatus.innerText = `CORE: ${capabilities.core_version || 'CONECTADO'}`;
            coreStatus.style.color = '#188038';
        }
        
        if (satelliteToken) {
            authStatus.innerText = "SESIÓN: ACTIVA";
            authStatus.classList.add('active');
        }

        // 2. Esquemas (ADN)
        const tree = this.shadowRoot.getElementById('res-tree');
        const schemas = contract.schemas || [];
        tree.innerHTML = schemas.map(s => `
            <div class="schema-node">
                <div class="schema-header">${s.id.toUpperCase()}</div>
                <div class="schema-body">
                    ${(s.properties || s.fields || []).map(p => `<div>${p.name || p.id} <small style="opacity:0.5">${p.type}</small></div>`).join('')}
                </div>
            </div>
        `).join('') || '<div style="opacity:0.3; font-size:11px;">ESPERANDO CONTRATO...</div>';
    }

    render() {
        this.shadowRoot.innerHTML = TEMPLATE;
    }
}

customElements.define('indra-bridge-hud', IndraBridgeHUD);
