/**
 * APP.JS — VETA DE ORO — CANON v21.0 (LA ARQUITECTURA DESACOPLADA TGS)
 * Componente Pegamento (UI Adapter). Solo renderiza lo que el Motor le ordena.
 */
console.log("%c >>> VETA ORO: DESCOPLADO v21.0 (UI ADAPTER) <<< ", "background: #1a1a1a; color: #d4af37; font-size: 16px; font-weight: bold; padding: 10px; border: 2px solid #d4af37;");

import { QuotationEngine } from './QuotationEngine.js';
import { AgnosticPortalPicker } from './AgnosticPortalPicker.js';
import { MOCK_CATALOGO, MOCK_CLIENTES } from './mocks.js';

class VetaOroApp {
  constructor() {
    this.engine = new QuotationEngine();
    this.ui_state = { editing_scenario_id: null, is_adding_scenario: false };
    this.pickers = []; // Para limpiar instancias de portales si es necesario

    this.cacheDOM();
    this.bindStaticEvents();
    
    // Suscripción Reactiva al Motor
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
      // Destruye portales anteriores para evitar fugas de memoria DOM
      this.pickers.forEach(p => p.destroy());
      this.pickers = [];
  }

  render(state) {
    const mainScenario = state.escenarios['main'];
    const currentScenario = state.escenarios[state.escenario_activo];
    
    // 1. Identidad Principal
    if (this.dom.proposalTitle && this.dom.proposalTitle.value !== state.etiqueta_propuesta) {
        this.dom.proposalTitle.value = state.etiqueta_propuesta;
    }
    
    if (this.dom.clientPicker && !this.dom.clientPicker.querySelector('.smart-picker-anchor')) {
      const cliPicker = new AgnosticPortalPicker({
        container: this.dom.clientPicker, dataSource: MOCK_CLIENTES, filterKey: 'tipo', placeholder: 'Seleccionar Cliente...',
        initialValue: state.cliente.nombre,
        onSelect: (c) => this.engine.setCliente(c)
      });
    }

    // 2. Control de Versiones (Scenario Switcher)
    this.renderScenarioSwitcher(state);

    // 3. Distribución de Espacios (Menú Lateral)
    if (this.dom.spacesList) {
        this.dom.spacesList.innerHTML = currentScenario.espacios.map(esp => `
            <div class="nav-item animate-entrance" style="padding: 10px 0; border-bottom: 1px solid var(--color-canvas); font-size: 0.8rem;">
                <div class="nav-dot"></div><strong style="color:var(--color-ink);">${esp.etiqueta}</strong>
            </div>
        `).join('') || '<small style="color:var(--color-ink-faint);">Añade un espacio para comenzar (Ej: Cocina, Master Suite)...</small>';
    }

    // 4. Area de Canvas Principal (Limpiamos Portales Viejos)
    this.cleanPortals();
    const totalCurrent = currentScenario.espacios.reduce((a,e) => a + e.items_tecnicos.reduce((b,i)=> b+i.subtotal,0), 0);
    
    let htmlCanvas = '';
    if (state.flags.pending_sync_uuid) {
        htmlCanvas += `
            <div class="sync-banner animate-entrance">
                <span>⚠️ Cambio estructural en Base detectado. ¿Propagar este espacio a todas las alternativas?</span>
                <div>
                   <button id="btn-do-sync" class="btn-sync-action">Sincronizar</button>
                   <button id="btn-cancel-sync" class="btn-sync-cancel">Omitir</button>
                </div>
            </div>`;
    }

    htmlCanvas += `
        <div class="canvas-context-info">
            <span>Branch/Versión Activa: <strong style="color:var(--color-ink);">${currentScenario.etiqueta}</strong></span>
            <span>Total Escenario: <strong>$ ${Math.round(totalCurrent).toLocaleString()}</strong></span>
        </div>
        <div id="items-grid-target"></div>
    `;
    this.dom.canvas.innerHTML = htmlCanvas;

    // Listeners del Sync Banner
    if (state.flags.pending_sync_uuid) {
        document.getElementById('btn-do-sync').onclick = () => this.engine.propagateSpaceToBranches(state.flags.pending_sync_uuid);
        document.getElementById('btn-cancel-sync').onclick = () => this.engine.dismissPropagate();
    }

    this.renderSpaces(currentScenario);
    this.renderDashboard(state, mainScenario, currentScenario, totalCurrent);
  }

  renderScenarioSwitcher(state) {
    this.dom.scSwitch.innerHTML = '';
    
    // Formulario Inline de Nueva Rama (Desde Base)
    if (this.ui_state.is_adding_scenario) {
        const inp = document.createElement('input'); inp.className = 'input-scenario-inline'; inp.placeholder = 'Nombre de nueva Variante...';
        inp.onkeydown = (e) => {
            if(e.key === 'Enter' && e.target.value) {
                // TGS: Siempre instancia desde main la nueva rama "global"
                this.engine.createVariant('main', e.target.value);
                this.ui_state.is_adding_scenario = false;
                this.render(this.engine.state);
            }
            if(e.key === 'Escape') { this.ui_state.is_adding_scenario = false; this.render(this.engine.state); }
        };
        this.dom.scSwitch.appendChild(inp); setTimeout(() => inp.focus(), 10);
    }

    // Pestañas
    Object.keys(state.escenarios).forEach(id => {
        const div = document.createElement('div'); div.className = 'scenario-tab-group';
        
        if (this.ui_state.editing_scenario_id === id) {
            const edit = document.createElement('input'); edit.className = 'input-scenario-inline'; edit.value = state.escenarios[id].etiqueta;
            edit.onkeydown = (e) => {
                if(e.key === 'Enter') { this.engine.renameVariant(id, e.target.value); this.ui_state.editing_scenario_id = null; this.render(this.engine.state); }
                if(e.key === 'Escape') { this.ui_state.editing_scenario_id = null; this.render(this.engine.state); }
            };
            div.appendChild(edit); setTimeout(() => edit.focus(), 10);
        } else {
            const tab = document.createElement('div'); tab.className = `scenario-tab ${id === state.escenario_activo ? 'active' : ''}`;
            tab.textContent = state.escenarios[id].etiqueta;
            tab.onclick = () => this.engine.switchScenario(id);
            tab.ondblclick = () => { this.ui_state.editing_scenario_id = id; this.render(this.engine.state); };
            div.appendChild(tab);

            // Botones TGS por Rama (Duplicar Rama y Borrar)
            if(id !== 'main') {
                const btnDup = document.createElement('button'); btnDup.className='btn-del-mini'; btnDup.title="Duplicar esta versión"; btnDup.style.color="var(--color-ink-faint)"; btnDup.textContent='❐';
                btnDup.onclick = (e) => { e.stopPropagation(); this.engine.createVariant(id, state.escenarios[id].etiqueta + ' (Copia)'); };
                div.appendChild(btnDup);

                const btnDel = document.createElement('button'); btnDel.className='btn-del-mini'; btnDel.title="Borrar"; btnDel.textContent='✕';
                btnDel.onclick = (e) => { e.stopPropagation(); if(confirm("¿Eliminar Versión?")) this.engine.deleteVariant(id); };
                div.appendChild(btnDel);
            }
        }
        this.dom.scSwitch.appendChild(div);
    });
  }

  renderSpaces(currentScenario) {
    const grid = document.getElementById('items-grid-target');
    if(!grid) return;

    currentScenario.espacios.forEach(esp => {
        const card = document.createElement('div'); card.className = 'v-card-slot animate-entrance';
        const sub = esp.items_tecnicos.reduce((a,b) => a+b.subtotal,0);
        
        card.innerHTML = `
            <div class="v-card-header">
                <input class="v-input-phantom" value="${esp.etiqueta}">
                <div style="display:flex; gap:10px; align-items:center;">
                    <span style="font-weight:800;">$ ${Math.round(sub).toLocaleString()}</span>
                    <button class="btn-tool" data-action="duplicate" title="Clonar Espacio">❐</button>
                    ${currentScenario.espacios.length > 1 ? `<button class="btn-tool" data-action="delete" title="Borrar Espacio">✕</button>` : ''}
                </div>
            </div>
            <div class="v-card-body">
                <div class="v-row-layout"><span class="v-header-label">Ítem / Producto Técnico</span><span class="v-header-label">Cant.</span><span class="v-header-label">Subtotal</span><span></span></div>
                <div class="items-list"></div>
                <button class="btn-ghost-dash add-i-btn" style="margin-top:20px;">+ Añadir Línea Técnica</button>
            </div>
        `;

        card.querySelector('.v-input-phantom').onchange = (e) => this.engine.renameSpace(esp.uuid, e.target.value);
        card.querySelector('[data-action="duplicate"]').onclick = () => this.engine.cloneSpace(esp.uuid);
        const delBtn = card.querySelector('[data-action="delete"]');
        if(delBtn) delBtn.onclick = () => { if(confirm("¿Eliminar espacio de esta cotización?")) this.engine.deleteSpace(esp.uuid); };
        card.querySelector('.add-i-btn').onclick = () => this.engine.addItem(esp.uuid);

        const list = card.querySelector('.items-list');
        esp.items_tecnicos.forEach(itm => {
            const row = document.createElement('div'); row.className = 'v-row-layout';
            
            // PORTAL PICKER INJECTION
            const pCont = document.createElement('div');
            const picker = new AgnosticPortalPicker({
                container: pCont, dataSource: MOCK_CATALOGO, filterKey: 'categoria', placeholder: 'Búsqueda de Catálogo...', initialValue: itm.descripcion,
                onSelect: (p) => this.engine.updateItem(esp.uuid, itm.sku, p)
            });
            this.pickers.push(picker); // Tracking memory
            row.appendChild(pCont);

            const step = document.createElement('div'); step.className = 'v-stepper';
            step.innerHTML = `<button class="dn">−</button><input value="${itm.cantidad}" readonly><button class="up">+</button>`;
            step.querySelector('.dn').onclick = () => this.engine.updateQty(esp.uuid, itm.sku, itm.cantidad-1);
            step.querySelector('.up').onclick = () => this.engine.updateQty(esp.uuid, itm.sku, itm.cantidad+1);
            row.appendChild(step);
            row.innerHTML += `<span style="font-family:var(--font-mono); font-weight:700; font-size:0.85rem;">$ ${Math.round(itm.subtotal).toLocaleString()}</span>`;
            
            const btnDel = document.createElement('button'); btnDel.className = 'btn-del-circle'; btnDel.textContent = '✕';
            btnDel.onclick = () => this.engine.deleteItem(esp.uuid, itm.sku);
            row.appendChild(btnDel);
            list.appendChild(row);
        });
        grid.appendChild(card);
    });
  }

  renderDashboard(state, mainScenario, currentScenario, totalCurrent) {
    if(this.dom.totalDisplay) this.dom.totalDisplay.textContent = `$ ${Math.round(totalCurrent).toLocaleString()}`;
    const calc = (esp) => esp.reduce((a, e) => a + e.items_tecnicos.reduce((b, i)=> b + i.subtotal, 0), 0);
    const mainTotal = calc(mainScenario.espacios);
    
    const others = Object.keys(state.escenarios).filter(id => id !== 'main');
    if(this.dom.deltasList) {
        this.dom.deltasList.innerHTML = others.map(id => {
            const d = (calc(state.escenarios[id].espacios) - mainTotal);
            return `<div class="stats-row" style="font-size:0.75rem; margin-top:10px;"><span>${state.escenarios[id].etiqueta}</span><span class="delta-pill ${d>=0?'delta-plus':'delta-minus'}">${d>=0?'+':'-'} $ ${Math.abs(Math.round(d)).toLocaleString()}</span></div>`;
        }).join('');
    }
  }
}

window.addEventListener('load', () => { new VetaOroApp(); });
