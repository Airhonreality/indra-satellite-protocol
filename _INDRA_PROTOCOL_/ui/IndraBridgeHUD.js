/**
 * =============================================================================
 * INDRA BRIDGE HUD (Sovereign & Agnostic v2.2)
 * =============================================================================
 * AXIOMA DE IDENTIDAD: La interfaz HUD es PURE-STATE. No inicia procesos de 
 * autenticación (Google/MS/etc). Su única responsabilidad es reflejar el 
 * estado del Bridge.
 * 
 * JURISDICCIÓN: La sesión de usuario pertenece al Satélite (ERP). El Bridge 
 * solo consume el token resultante.
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

    /* --- HEADER: ESTADO DE SOBERANÍA --- */
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

    .sat-label {
        font-weight: 700;
        font-size: 13px;
        color: #202124;
        letter-spacing: 0.2px;
    }

    /* Indicadores de Estado Axiomático */
    .status-group {
        display: flex;
        gap: 15px;
        align-items: center;
    }

    .badge {
        font-size: 9px;
        padding: 4px 10px;
        border-radius: 4px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .badge-core { background: #f1f3f4; color: #5f6368; }
    .badge-auth { background: #fce8e6; color: #d93025; }
    .badge-auth.active { background: #e6f4ea; color: #137333; }

    /* --- GRID DE CARDS --- */
    .hud-body {
        display: grid;
        grid-template-columns: 340px 1fr;
        gap: 1px;
        background: var(--border);
    }

    .card { background: #FFFFFF; padding: 25px; }

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

    /* --- COMPONENTES INTERNOS --- */
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

    .schema-node {
        border: 1px solid #f1f3f4;
        border-radius: 6px;
        overflow: hidden;
        background: #fff;
        margin-bottom: 12px;
    }

    .schema-header { background: var(--surface); padding: 10px 15px; border-bottom: 1px solid var(--border); font-weight: 700; font-size: 12px; }
    .schema-body { padding: 15px; font-size: 11px; }

    /* ORQUESTADOR */
    .workflow-panel { display: grid; grid-template-columns: 240px 1fr; min-height: 400px; }
    .flow-list { background: var(--surface); border-right: 1px solid var(--border); padding: 15px; }
    .designer-stage { padding: 30px; }
    
    .designer-toolbar {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        padding: 10px 20px;
        background: var(--surface);
        border-bottom: 1px solid var(--border);
    }

    .btn-soapy { background: #fff; border: 1px solid var(--border); padding: 5px 12px; font-size: 10px; font-weight: 700; cursor: pointer; border-radius: 3px; }
</style>

<div class="hud-container">
    <header class="hud-header">
        <div class="core-identity">
            <span class="sat-label" id="sat-name">SATELLITE INTERFACE</span>
            <div class="status-group">
                 <span class="badge badge-core">CORE: SINCRONIZADO</span>
                 <span class="badge badge-auth" id="auth-status">IDENTIDAD: REQUERIDA</span>
            </div>
        </div>
    </header>

    <div class="hud-body">
        <div style="display: flex; flex-direction: column; background: var(--border); gap: 1px;">
            <section class="card">
                <h3 class="card-title">CONFIGURACIÓN DEL WORKSPACE</h3>
                <select class="workspace-selector" id="ws-select">
                    <option value="">SIN ENTORNOS</option>
                </select>
                <button class="btn-action">CREAR NUEVO WORKSPACE</button>
            </section>

            <section class="card">
                <h3 class="card-title">PANEL DE ESQUEMAS</h3>
                <div id="res-tree">
                    <div style="opacity: 0.3; font-size: 11px;">ESPERANDO RESONANCIA...</div>
                </div>
            </section>
        </div>

        <section class="card" style="padding:0;">
            <div class="designer-toolbar">
                <button class="btn-soapy">IMPORTAR JSON</button>
                <button class="btn-soapy" style="color:var(--accent)">EXPORTAR SOBERANÍA</button>
            </div>
            <div class="workflow-panel">
                <div class="flow-list" id="flow-list">
                    <h1 class="card-title" style="border:none; margin-bottom:10px;">AUTOMATIZACIONES</h1>
                </div>
                <div class="designer-stage" id="flow-content">
                    <h1 class="card-title">DISEÑO DE FLUJO</h1>
                    <div id="steps-container">
                         <div style="opacity: 0.3; font-size: 11px; text-align:center; padding-top:100px;">SELECCIONE UNA AUTOMATIZACIÓN</div>
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
        this._config = null;
    }

    connectedCallback() {
        this.render();
        if (this._config) this.applyConfig(this._config);
    }

    set config(data) {
        this._config = data;
        // El HUD espera a que el contenedor básico exista antes de aplicar la configuración
        if (this.shadowRoot && this.shadowRoot.getElementById('auth-status')) {
            this.applyConfig(data);
        }
    }

    applyConfig(data) {
        if (data.contract) this.updateResonanceTree(data.contract);
        if (data.workspaces) this.updateWorkspaces(data.workspaces);
        if (data.activeWorkflow) this.updateWorkflowDesigner(data.activeWorkflow);
        
        // AXIOMA: Actualización de Identidad mediante inyección externa
        if (data.user) {
            const authStatus = this.shadowRoot.getElementById('auth-status');
            authStatus.innerText = "SESIÓN: " + (data.user.email || 'ACTIVA');
            authStatus.classList.add('active');
        }

        if (data.core) {
            const satNameEl = this.shadowRoot.getElementById('sat-name');
            if (satNameEl) satNameEl.innerText = data.core.sat_name || 'INDRA SATELLITE';
        }
    }

    updateWorkspaces(workspaces) {
        const select = this.shadowRoot.getElementById('ws-select');
        if (!select || !workspaces || workspaces.length === 0) return;
        select.innerHTML = workspaces.map(ws => `<option value="${ws.id}">${ws.name}</option>`).join('');
    }

    updateResonanceTree(contract) {
        const tree = this.shadowRoot.getElementById('res-tree');
        if (!tree || !contract) return;
        const schemas = contract.schemas || (contract.raw?.metadata?.items?.filter(i => i.class === 'SCHEMA')) || [];
        
        tree.innerHTML = schemas.map(schema => `
            <div class="schema-node">
                <div class="schema-header">${schema.handle?.alias || schema.id}</div>
                <div class="schema-body">
                    <div style="margin-bottom:8px; opacity:0.6; font-family:'JetBrains Mono'; font-size:9px;">
                       ${schema.handle?.location || 'src/main.js'}
                    </div>
                    ${(schema.properties || []).map(p => `<div style="padding:2px 0;">${p.name} <small style="color:green; font-size:8px;">• ${p.silo_mapping || 'SISTEMA'}</small></div>`).join('')}
                </div>
            </div>
        `).join('') || '<div style="opacity:0.3; font-size:11px;">SIN ESQUEMAS</div>';
    }

    updateWorkflowDesigner(workflow) {
        const container = this.shadowRoot.getElementById('steps-container');
        if (!container) return;
        const stations = workflow.payload?.stations || [];
        container.innerHTML = stations.map((step, index) => `
            <div style="display:flex; gap:10px; margin-bottom:10px; align-items:center;">
                <div style="width:20px; height:20px; border-radius:50%; background:#f1f3f4; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:700;">${index + 1}</div>
                <div style="font-size:12px;">${step.label || step.id} <small style="opacity:0.5; font-size:9px;">[${step.type}]</small></div>
            </div>
        `).join('') || '<div style="opacity:0.3; font-size:11px; text-align:center; padding-top:100px;">FLUJO VACÍO</div>';
    }

    render() {
        this.shadowRoot.innerHTML = TEMPLATE;
    }
}

customElements.define('indra-bridge-hud', IndraBridgeHUD);
