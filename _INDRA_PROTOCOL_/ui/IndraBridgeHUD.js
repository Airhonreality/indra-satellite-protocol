/**
 * =============================================================================
 * INDRA BRIDGE HUD (Sovereign Host v2.5)
 * =============================================================================
 * AXIOMA: Es un Cascarón Vacío. Su única misión es proveer el chasis (Layout)
 * y la comunicación con el Bridge. La funcionalidad reside en lso WIDGETS.
 * =============================================================================
 */

import './widgets/IndraSchemaProjector.js';
import './widgets/IndraUniversalPicker.js';
import './widgets/IndraWorkflowRibbon.js';

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
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        color: var(--text);
    }

    .hud-header {
        background: #FFFFFF;
        border-bottom: 2px solid var(--surface);
        padding: 15px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .status-group { display: flex; gap: 10px; align-items: center; }
    .badge { font-size: 8px; padding: 3px 8px; border-radius: 4px; font-weight: 700; text-transform: uppercase; }
    .badge-core { background: #f1f3f4; color: #5f6368; }
    .badge-auth { background: #e6f4ea; color: #137333; }

    .hud-body { display: grid; grid-template-columns: 320px 1fr; gap: 1px; background: var(--border); }
    .panel { background: #FFFFFF; padding: 20px; }
    .panel-title { 
        font-size: 10px; 
        color: #5f6368; 
        text-transform: uppercase; 
        letter-spacing: 0.8px; 
        font-weight: 700; 
        margin-bottom: 15px; 
        border-bottom: 1px solid var(--surface); 
        padding-bottom: 6px; 
    }

    .main-stage { display: flex; flex-direction: column; gap: 1px; background: var(--border); }
</style>

<div class="hud-container">
    <header class="hud-header">
        <div class="core-identity">
            <span style="font-weight:700; font-size:12px; color:var(--accent);">INDRA SATELLITE HUD</span>
            <div class="status-group" style="margin-top:4px;">
                 <span class="badge badge-core" id="core-status">CORE: V2.5</span>
                 <span class="badge badge-auth" id="auth-status">RESONANCIA ACTIVA</span>
            </div>
        </div>
    </header>

    <div class="hud-body">
        { /* SIDEBAR: ESPINA DORSAL (SCHEMAS) */ }
        <div class="panel">
            <h3 class="panel-title">Espina Dorsal (Schemas)</h3>
            <indra-schema-projector id="schema-projector"></indra-schema-projector>
        </div>

        { /* MAIN STAGE: PICKER & WORKFLOWS */ }
        <div class="main-stage">
            <section class="panel">
                <h3 class="panel-title">Universal Picker</h3>
                <indra-universal-picker id="universal-picker"></indra-universal-picker>
            </section>
            
            <section class="panel" style="flex-grow: 1;">
                <h3 class="panel-title">Cinta Magnetofónica (Workflows)</h3>
                <indra-workflow-ribbon id="workflow-ribbon"></indra-workflow-ribbon>
            </section>
        </div>
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
        this._bridge.onStateChange = () => this.updateUI();
        this.updateUI();
    }

    updateUI() {
        if (!this.shadowRoot || !this._bridge) return;

        const { contract, capabilities } = this._bridge;

        // Proyectar a los Widgets
        const projector = this.shadowRoot.getElementById('schema-projector');
        if (projector) projector.schemas = contract.schemas || [];

        const picker = this.shadowRoot.getElementById('universal-picker');
        if (picker) picker.providers = contract.capabilities?.providers || [];

        const ribbon = this.shadowRoot.getElementById('workflow-ribbon');
        if (ribbon) ribbon.workflows = contract.workflows || [];

        // 4. Alertas de Resonancia (Trazabilidad)
        const authStatus = this.shadowRoot.getElementById('auth-status');
        if (this._bridge.resonanceWarnings?.length > 0) {
            authStatus.innerText = "ALERTA DE INTEGRIDAD";
            authStatus.style.background = "#FEF7E0";
            authStatus.style.color = "#B06000";
        }
    }

    render() {
        this.shadowRoot.innerHTML = TEMPLATE;
    }
}

customElements.define('indra-bridge-hud', IndraBridgeHUD);
