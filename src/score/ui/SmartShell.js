/**
 * =============================================================================
 * ARTEFACTO: SmartShell.js
 * CAPA: UI (Resonancia Visual)
 * AXIOMA: Auto-Generación Determinista (v15.0)
 * =============================================================================
 */

export class SmartShell {
    constructor(bridge) {
        this.bridge = bridge;
        this.container = null;
        this.activeSchema = null;
        this._setupListeners();
    }

    /**
     * @dharma Monta la UI inteligente en un elemento del DOM.
     */
    mount(selector) {
        this.container = document.querySelector(selector);
        if (!this.container) return;
        this.render();
    }

    _setupListeners() {
        // Escuchar cambios en el Vault para refrescar las Cards automáticamente
        window.addEventListener('indra-vault-change:*', () => this.render());
    }

    render() {
        if (!this.container) return;
        
        const schemas = this.bridge.contract.schemas || [];
        
        this.container.innerHTML = `
            <div class="indra-shell" style="display: flex; height: 100vh; background: #000; color: #fff; font-family: 'Outfit', sans-serif;">
                <!-- Sidebar Automático -->
                <aside style="width: 260px; border-right: 1px solid #333; padding: 20px; background: #0a0a0a;">
                    <h2 style="font-size: 14px; color: #888; text-transform: uppercase; letter-spacing: 2px;">Esquemas</h2>
                    <ul style="list-style: none; padding: 0; margin-top: 20px;">
                        ${schemas.map(s => `
                            <li class="nav-item ${this.activeSchema === s.handle.alias ? 'active' : ''}" 
                                style="padding: 12px; margin-bottom: 8px; cursor: pointer; border-radius: 8px; transition: all 0.3s; background: ${this.activeSchema === s.handle.alias ? '#222' : 'transparent'};"
                                onclick="window.dispatchShellEvent('select-schema', '${s.handle.alias}')">
                                <span style="margin-right: 10px;">📦</span> ${s.handle.label || s.handle.alias}
                            </li>
                        `).join('')}
                    </ul>
                </aside>

                <!-- Panel de Datos Automático -->
                <main id="shell-main" style="flex: 1; padding: 40px; overflow-y: auto;">
                    ${this.activeSchema ? this.renderGrid(this.activeSchema) : this.renderEmptyState()}
                </main>
            </div>
        `;

        // Global dispatcher helper
        window.dispatchShellEvent = (type, payload) => {
            if (type === 'select-schema') {
                this.activeSchema = payload;
                this.render();
            }
        };
    }

    renderGrid(alias) {
        const data = this.bridge.vault.get(alias) || [];
        const schema = (this.bridge.contract.schemas || []).find(s => s.handle.alias === alias);
        
        return `
            <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                <h1 style="font-size: 28px; font-weight: 700;">${schema.handle.label}</h1>
                <span style="padding: 6px 12px; background: #00ff8822; color: #00ff88; border: 1px solid #00ff8844; border-radius: 20px; font-size: 12px;">
                    ${data.length} ítems sincronizados
                </span>
            </header>

            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
                ${data.map(item => this.renderCard(item, schema)).join('')}
                ${data.length === 0 ? '<p style="color: #666;">No hay datos en este silo. Hidratando...</p>' : ''}
            </div>
        `;
    }

    renderCard(item, schema) {
        // Lógica de Renderizado Inteligente basada en Campos
        const fields = schema.payload?.fields || [];
        
        return `
            <div class="indra-card" style="background: #111; border: 1px solid #333; border-radius: 12px; padding: 20px; transition: transform 0.3s, border-color 0.3s;" 
                 onmouseover="this.style.borderColor='#555'; this.style.transform='translateY(-5px)'"
                 onmouseout="this.style.borderColor='#333'; this.style.transform='translateY(0)'">
                ${fields.slice(0, 5).map(f => `
                    <div style="margin-bottom: 12px;">
                        <label style="display: block; font-size: 10px; color: #888; text-transform: uppercase;">${f.name}</label>
                        <div style="font-size: 14px; color: #eee;">${item[f.id] || item[f.name] || '---'}</div>
                    </div>
                `).join('')}
                <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #222; display: flex; justify-content: flex-end;">
                     <button style="background: transparent; color: #00ff88; border: none; font-size: 12px; cursor: pointer;">EDITAR ADN</button>
                </div>
            </div>
        `;
    }

    renderEmptyState() {
        return `
            <div style="height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; color: #666;">
                <div style="font-size: 64px; margin-bottom: 20px;">🛰️</div>
                <h2>Selecciona un esquema para proyectar su materia</h2>
                <p>El Kernel está escuchando en segundo plano...</p>
            </div>
        `;
    }
}
