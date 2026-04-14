/**
 * APP.JS — Master Technical Designer (Restored + Enhanced)
 */
import { QuotationEngine } from './QuotationEngine.js';
import { AgnosticPortalPicker } from './AgnosticPortalPicker.js';
import { MOCK_CATALOGO, MOCK_CLIENTES } from './mocks.js';
import { indra3D } from '../../../js/core/Indra3DCore.js';

class VetaOroApp {
  constructor() {
    this.engine = new QuotationEngine();
    this.ui_state = { editing_scenario_id: null, is_adding_scenario: false };
    this.pickers = [];

    this.cacheDOM();
    this.bindStaticEvents();
    
    this.engine.subscribe((state) => this.render(state));
    this.render(this.engine.state);
  }

  cacheDOM() {
    this.dom = {
      canvas:        document.getElementById('target-canvas-iterator'),
      scSwitch:      document.getElementById('target-scenario-switcher'),
      btnAddAlt:     document.getElementById('btn-add-alternative'),
      proposalTitle: document.getElementById('input-proposal-name'),
      clientPicker:  document.getElementById('container-client-picker'),
      spacesList:    document.getElementById('target-spaces-list'),
      addSpaceBtn:   document.getElementById('btn-add-space'),
      totalDisplay:  document.getElementById('target-total-base'),
      deltasList:    document.getElementById('target-deltas-list')
    };
  }

  bindStaticEvents() {
    if (this.dom.addSpaceBtn) this.dom.addSpaceBtn.onclick = () => this.engine.addSpace();
    if (this.dom.btnAddAlt) this.dom.btnAddAlt.onclick = () => { this.ui_state.is_adding_scenario = true; this.render(this.engine.state); };
    if (this.dom.proposalTitle) this.dom.proposalTitle.oninput = (e) => this.engine.setPropuestaName(e.target.value);
  }

  cleanPortals() {
      this.pickers.forEach(p => p.destroy());
      this.pickers = [];
  }

  render(state) {
    const currentScenario = state.escenarios[state.escenario_activo];
    
    if (this.dom.proposalTitle && this.dom.proposalTitle.value !== state.etiqueta_propuesta) {
        this.dom.proposalTitle.value = state.etiqueta_propuesta;
    }
    
    if (this.dom.clientPicker && !this.dom.clientPicker.querySelector('.smart-picker-anchor')) {
      new AgnosticPortalPicker({
        container: this.dom.clientPicker, dataSource: MOCK_CLIENTES, filterKey: 'tipo', placeholder: 'Seleccionar Cliente...',
        initialValue: state.cliente.nombre, onSelect: (c) => this.engine.setCliente(c)
      });
    }

    this.renderScenarioSwitcher(state);

    if (this.dom.spacesList) {
                this.dom.spacesList.innerHTML = currentScenario.espacios.map(esp => `
            <div class="nav-item-space" style="padding: 12px; border-radius: 6px; border-bottom: 1px solid #F5F5F5; font-size: 0.75rem; display:flex; align-items:center; gap:10px; transition: 0.2s; cursor: pointer;">
                <i data-lucide="layout" style="width:14px; opacity:0.6; color: var(--color-brass);"></i>
                <div style="display:flex; flex-direction:column;">
                    <strong style="color: var(--color-ink);">${esp.etiqueta}</strong>
                    <span style="font-size: 10px; opacity: 0.5;">${esp.items_tecnicos.length} items</span>
                </div>
            </div>
        `).join('') || '<div style="padding:20px; text-align:center; opacity:0.3; font-size:0.7rem;">No hay espacios técnicos</div>';
    }

    this.cleanPortals();
    this.renderSpaces(currentScenario);
    this.renderDashboard(state, currentScenario);

    // REACTIVAR ICONOS DESPUÉS DE RENDER DINÁMICO
    if (window.lucide) {
        window.lucide.createIcons();
    }
  }

  renderScenarioSwitcher(state) {
    this.dom.scSwitch.innerHTML = '';
    
    // Formulario Inline de Nueva Rama (Agnóstico)
    if (this.ui_state.is_adding_scenario) {
        const inp = document.createElement('input'); 
        inp.className = 'v-input-clean'; 
        inp.placeholder = 'Nombre de variante...';
        inp.style.padding = '5px';
        inp.onkeydown = (e) => {
            if(e.key === 'Enter' && e.target.value) {
                this.engine.createVariant('main', e.target.value);
                this.ui_state.is_adding_scenario = false;
            }
            if(e.key === 'Escape') { 
                this.ui_state.is_adding_scenario = false; 
                this.render(this.engine.state); 
            }
        };
        this.dom.scSwitch.appendChild(inp); 
        setTimeout(() => inp.focus(), 10);
    }

    Object.keys(state.escenarios).forEach(id => {
        const tab = document.createElement('div');
        tab.className = `scenario-tab ${id === state.escenario_activo ? 'active' : ''}`;
        tab.textContent = state.escenarios[id].etiqueta;
        tab.onclick = () => this.engine.switchScenario(id);
        this.dom.scSwitch.appendChild(tab);
    });
  }

  renderSpaces(currentScenario) {
    this.dom.canvas.innerHTML = '';
    currentScenario.espacios.forEach(esp => {
        const card = document.createElement('div'); card.className = 'v-card-slot';
        const sub = esp.items_tecnicos.reduce((a,b) => a+b.subtotal,0);
        
        card.innerHTML = `
            <div class="v-card-header">
                <input class="v-input-phantom" value="${esp.etiqueta}" onchange="this.dispatchEvent(new CustomEvent('rename-space', {detail: this.value}))">
                <div style="display:flex; gap:10px; align-items:center;">
                    <div class="v-toggle-group">
                        <button class="v-toggle-btn ${esp.viewMode === 'ENGINEERING' ? 'active' : ''}" onclick="this.dispatchEvent(new CustomEvent('switch-view', {detail: 'ENGINEERING'}))">DATOS</button>
                        <button class="v-toggle-btn ${esp.viewMode === 'DESIGN_3D' ? 'active' : ''}" onclick="this.dispatchEvent(new CustomEvent('switch-view', {detail: 'DESIGN_3D'}))">3D</button>
                    </div>
                    <span style="font-weight:600; font-size:1.1rem; margin-left:10px;">$ ${Math.round(sub).toLocaleString()}</span>
                </div>
            </div>

            ${esp.viewMode === 'DESIGN_3D' ? `
                <div id="canvas-container-${esp.uuid}" style="background:#111; height:400px; border-radius:8px; margin-bottom:20px; position:relative; overflow:hidden;">
                    <canvas id="canvas-${esp.uuid}" style="width:100%; height:100%;"></canvas>
                    <button class="btn-attach-3d" style="position:absolute; bottom:15px; right:15px; font-size:9px; background:rgba(0,0,0,0.5); color:white; border:1px solid rgba(255,255,255,0.2); padding:5px 10px; border-radius:4px; cursor:pointer;">
                        + ACTUALIZAR MODELO
                    </button>
                    <div style="position:absolute; top:15px; left:15px; font-family:var(--font-technical); font-size:8px; color:rgba(255,255,255,0.5);">MODO_INSPECCIÓN_3D</div>
                </div>
            ` : ''}
            
            <!-- INTEGRACIÓN BD-15: CHECKLIST DE REQUERIMIENTOS -->
            <div class="requirements-area" style="margin-bottom: 25px; padding: 20px; background: #fffcf5; border: 1px dashed var(--color-brass); border-radius:8px;">
                <span class="panel-title" style="color:var(--color-brass)">
                    <i data-lucide="clipboard-check" style="width:14px; vertical-align:middle; margin-right:5px;"></i>
                    CHECKLIST_DEPENDENCIAS_VÉTA
                </span>
                <div class="req-items" style="margin-top:15px;">
                    ${(esp.requirements || []).map(req => `
                        <div style="display:flex; justify-content:space-between; gap:10px; margin-bottom:12px; align-items:center; border-bottom:1px solid rgba(0,0,0,0.03); padding-bottom:8px; width:100%;">
                            <div style="display:flex; gap:10px; align-items:center; flex:1;">
                                <input type="checkbox" ${req.done?'checked':''} data-req-id="${req.id}" class="req-check">
                                <input type="text" value="${req.desc}" data-req-id="${req.id}" data-field="desc" class="req-input-inline" placeholder="Requerimiento" style="border:none; background:transparent; font-size:0.85rem; width:100%;">
                            </div>
                            <div style="display:flex; gap:10px; align-items:center; flex:1; justify-content:flex-end;">
                                <input type="text" value="${req.spec}" data-req-id="${req.id}" data-field="spec" class="req-input-inline" placeholder="Espec." style="border:none; background:transparent; font-size:0.85rem; font-family:var(--font-technical); color:var(--color-brass); text-align:right; width:60%;">
                                <span style="font-size:10px; font-weight:bold; color:${req.done?'var(--color-success)':'var(--color-warning)'}; min-width:40px; text-align:right;">${req.done?'LISTO':'PEND'}</span>
                            </div>
                        </div>
                    `).join('')}
                    <button class="axiom-btn axiom-btn-sm axiom-btn-ghost btn-add-req" style="margin-top:10px;">
                        <i data-lucide="plus-circle"></i> AÑADIR DEPENDENCIA
                    </button>
                </div>
            </div>

            <div class="v-card-body">
                <div class="items-list"></div>
                <button class="axiom-btn axiom-btn-sm axiom-btn-brass btn-add-item" style="width:100%; margin-top:20px;">
                    <i data-lucide="package-plus"></i> AÑADIR LÍNEA TÉCNICA
                </button>
            </div>
        `;

        // Eventos de Espacio y Requerimientos
        card.addEventListener('rename-space', (e) => this.engine.renameSpace(esp.uuid, e.detail));
        card.addEventListener('switch-view', (e) => this.engine.toggleViewMode(esp.uuid, e.detail));
        
        if (esp.viewMode === 'DESIGN_3D') {
            const btnAttach = card.querySelector('.btn-attach-3d');
            if (btnAttach) {
                btnAttach.onclick = () => {
                   const input = document.createElement('input'); 
                   input.type='file'; input.accept='.glb';
                   input.onchange = (e) => this.handleIngest(esp.uuid, e.target.files[0]);
                   input.click();
                };
            }
            this.init3D(esp);
        }

        card.querySelector('.btn-add-req').onclick = () => this.engine.addRequirement(esp.uuid);
        card.querySelectorAll('.req-check').forEach(ck => ck.onclick = () => this.engine.toggleRequirement(esp.uuid, parseInt(ck.dataset.reqId)));
        card.querySelectorAll('.req-input-inline').forEach(inp => inp.onchange = () => this.engine.updateRequirement(esp.uuid, parseInt(inp.dataset.reqId), inp.dataset.field, inp.value));
        
        card.querySelector('.btn-add-item').onclick = () => this.engine.addItem(esp.uuid);

        const list = card.querySelector('.items-list');
        esp.items_tecnicos.forEach(itm => {
            const row = document.createElement('div'); row.className = 'v-row-layout';
            
            // Columna Principal (Producto)
            const colMain = document.createElement('div'); colMain.className = 'row-col-main';
            const picker = new AgnosticPortalPicker({
                container: colMain, dataSource: MOCK_CATALOGO, filterKey: 'categoria', placeholder: 'Buscar en catálogo...', initialValue: itm.descripcion,
                onSelect: (p) => this.engine.updateItem(esp.uuid, itm.sku, p)
            });
            this.pickers.push(picker);
            row.appendChild(colMain);

            // Columna Cantidad
            const colQty = document.createElement('div'); colQty.className = 'row-col-qty';
            const qty = document.createElement('input'); 
            qty.type='number'; qty.value=itm.cantidad; 
            qty.className = 'v-input-clean'; 
            qty.style.width='100%'; 
            qty.style.textAlign='center';
            qty.onchange = (e) => this.engine.updateQty(esp.uuid, itm.sku, parseInt(e.target.value));
            colQty.appendChild(qty);
            row.appendChild(colQty);

            // Columna Precio/Subtotal
            const colPrice = document.createElement('div'); colPrice.className = 'row-col-price';
            colPrice.innerHTML = `<span style="font-family:var(--font-technical); font-weight:600;">$ ${Math.round(itm.subtotal).toLocaleString()}</span>`;
            row.appendChild(colPrice);
            
            // Columna Acción
            const colAction = document.createElement('div'); colAction.className = 'row-col-action';
            const btnDel = document.createElement('button'); 
            btnDel.className = 'axiom-btn-ghost';
            btnDel.innerHTML = '<i data-lucide="trash-2" style="width:14px; color:var(--color-error)"></i>'; 
            btnDel.onclick = () => { if(confirm("¿Eliminar línea?")) this.engine.deleteItem(esp.uuid, itm.sku); };
            colAction.appendChild(btnDel);
            row.appendChild(colAction);

            list.appendChild(row);
        });
        this.dom.canvas.appendChild(card);
    });
  }

  renderDashboard(state, currentScenario) {
    const total = currentScenario.espacios.reduce((a,e) => a + e.items_tecnicos.reduce((b,i)=> b+i.subtotal,0), 0);
    if(this.dom.totalDisplay) this.dom.totalDisplay.textContent = `$ ${Math.round(total).toLocaleString()}`;
  }

  async init3D(space) {
      if (!space.design?.render) return;
      const canvasId = `canvas-${space.uuid}`;
      try {
          await indra3D.init(canvasId);
          await indra3D.loadAsset(canvasId, space.design.render);
      } catch (e) { console.error("3D_FAIL", e); }
  }

  async handleIngest(uuid, file) {
      if (!file) return;
      const url = URL.createObjectURL(file);
      await this.engine.attachAsset(uuid, { render: url, skp: file.name });
  }
}

window.addEventListener('load', () => { new VetaOroApp(); });
