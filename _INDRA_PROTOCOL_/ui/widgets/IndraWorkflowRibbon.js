/**
 * =============================================================================
 * INDRA WORKFLOW RIBBON (La Cinta Magnetofónica v2.1)
 * =============================================================================
 * Responsabilidad: Proyectar la secuencia de automatizaciones de la Espina Dorsal.
 * DHARMA: Visualizador lineal de estados de ejecución.
 * =============================================================================
 */

class IndraWorkflowRibbon extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._workflows = [];
    }

    set workflows(data) {
        this._workflows = data;
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
        <style>
            :host { display: block; }
            .ribbon-container { display: flex; flex-direction: column; gap: 15px; }
            .workflow-item { background: #FFFFFF; border: 1px solid #DADCE0; border-left: 4px solid #8B5CF6; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
            .wf-header { padding: 12px 15px; border-bottom: 1px solid #F1F3F4; display: flex; justify-content: space-between; align-items: center; }
            .wf-label { font-size: 13px; font-weight: 700; color: #1A1F36; margin: 0; padding: 0; border: none; outline: none; width: 100%; }
            .wf-actions { display: flex; gap: 8px; }
            .btn { font-size: 10px; font-weight: 700; padding: 6px 12px; border-radius: 4px; cursor: pointer; border: 1px solid transparent; background: #F1F3F4; color: #3C4043; }
            .btn-test { background: #E6F4EA; color: #137333; }
            .btn-save { background: #1A73E8; color: #FFFFFF; }
            .station-list { display: flex; flex-direction: column; padding: 10px; gap: 5px; background: #F8F9FA;}
            .station-item { display: grid; grid-template-columns: 20px 1fr 1fr; gap: 10px; align-items: center; padding: 8px; background: #FFF; border: 1px solid #DADCE0; border-radius: 4px; }
            .station-num { font-size: 10px; font-weight: bold; color: #8B5CF6; }
            select { font-size: 11px; padding: 4px; border: 1px solid #DADCE0; border-radius: 3px; outline: none; }
        </style>
        <div class="ribbon-container">
            ${this._workflows.map(wf => `
                <div class="workflow-item">
                    <div class="wf-header">
                        <input type="text" class="wf-label" value="${wf.label || wf.id}" disabled />
                        <div class="wf-actions">
                            <button class="btn btn-test" onclick="try{ document.querySelector('indra-bridge-hud')._bridge.execute({protocol:'TEST'},{maxRetries:0}).then(()=>alert('TEST EXITOSO')).catch(e=>alert('TEST FALLIDO: '+e)) }catch(e){}">TEST</button>
                            <button class="btn btn-save" onclick="fetch('http://localhost:3000/api/save-score',{method:'POST',body:JSON.stringify(${JSON.stringify(wf).replace(/"/g, '&quot;')})}).then(r=>r.json()).then(r=>alert(r.status==='ok'?'GUARDADO':'ERROR'))">GUARDAR</button>
                        </div>
                    </div>
                    <div class="station-list">
                        ${(wf.stations || []).map((st, i) => `
                            <div class="station-item">
                                <span class="station-num">${(i + 1).toString().padStart(2, '0')}</span>
                                <select disabled title="PROVEEDOR">
                                    <option>${st.provider?.toUpperCase() || 'SISTEMA'}</option>
                                </select>
                                <select disabled title="PROTOCOLO">
                                    <option>${st.protocol?.toUpperCase() || 'ACCIÓN_NO_DEFINIDA'}</option>
                                </select>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('') || '<div style="opacity:0.3; font-size:11px; text-align:center;">SIN FLUJOS ACTIVOS</div>'}
        </div>
        `;
    }
}

customElements.define('indra-workflow-ribbon', IndraWorkflowRibbon);
