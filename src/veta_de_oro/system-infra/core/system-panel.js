/**
 * SYSTEM PANEL — Veta de Oro ERP
 * Interfaz de administración técnica.
 */
window.SystemPanel = class SystemPanel {
    constructor(injectedRegistry = null) {
        this.registry = injectedRegistry;
        this.workspaces = [];
        this.activeWorkspaceId = null;
    }

    async init() {
        // Usar los métodos globales
        if (!this.registry) {
            this.registry = window.buildRegistry();
        }

        try {
            if (window.DBConnector) {
                this.workspaces = await window.DBConnector.fetchWorkspaces();
                if (this.workspaces.length > 0) {
                    this.activeWorkspaceId = this.workspaces[0].id;
                }
            }
        } catch (e) {
            console.error('[SystemPanel] Error cargando entornos:', e);
        }
        await this.refresh();
        this.render();
    }

    async refresh() {
        if (window.auditInfrastructure) {
            await window.auditInfrastructure(this.registry);
        }
    }

    render() {
        this.renderWorkspaceSelector();
        this.renderSchemaGrid();
    }

    renderWorkspaceSelector() {
        const container = document.getElementById('target-workspace-selector');
        if (!container) return;

        container.innerHTML = '';
        const label = document.createElement('div');
        label.className = 'technical-data';
        label.style.marginBottom = '10px';
        label.style.color = '#888';
        label.innerText = 'WORKSPACE_ID_ACTUAL:';
        container.appendChild(label);

        const select = document.createElement('select');
        Object.assign(select.style, {
            background: 'var(--color-surface)',
            color: 'var(--color-ink)',
            border: 'var(--border-hairline)',
            padding: '12px 20px',
            fontFamily: 'var(--font-rational)',
            fontSize: '14px',
            outline: 'none',
            cursor: 'pointer',
            borderRadius: 'var(--radius-arch)',
            boxShadow: 'var(--shadow-sm)'
        });

        this.workspaces.forEach(ws => {
            const opt = document.createElement('option');
            opt.value = ws.id;
            opt.textContent = (ws.handle?.label || ws.id).toUpperCase();
            if (ws.id === this.activeWorkspaceId) opt.selected = true;
            select.appendChild(opt);
        });

        select.onchange = (e) => {
            this.activeWorkspaceId = e.target.value;
            this.refresh().then(() => this.render());
        };
        container.appendChild(select);
    }

    renderSchemaGrid() {
        const grid = document.getElementById('forge-grid');
        if (!grid) return;

        grid.innerHTML = '';

        for (const id in this.registry) {
            const schema = this.registry[id];
            const card = document.createElement('div');
            card.className = 'forge-card';

            const statusTagClass = `tag-${schema._status.toLowerCase()}`;
            const statusLabel = schema._status === 'IGNITED' ? 'STORAGE_INITIALIZED' : (schema._status === 'SYNCED' ? 'DATA_MODEL_SYNCED' : 'CORE_ORPHAN');

            card.innerHTML = `
                <span class="status-pill ${statusTagClass}">${statusLabel}</span>
                <h2 style="font-family: 'Cormorant Garamond', serif; font-style: italic; margin: 10px 0;">${schema.label}</h2>
                <p class="technical-data" style="font-size: 10px; opacity: 0.4; margin-bottom: 30px;">ID: ${id} | VERSION:${schema.version}</p>
            `;

            const actions = document.createElement('div');
            actions.style.display = 'flex';
            actions.style.gap = '10px';

            if (schema._status === 'ORPHAN') {
                actions.appendChild(this.createActionBtn('SYNC DATA MODEL', () => this.handleAction('sync', id)));
            } else if (schema._status === 'SYNCED') {
                actions.appendChild(this.createActionBtn('INITIALIZE STORAGE', () => this.handleAction('ignite', id), true));
            } else if (schema._status === 'IGNITED') {
                const check = document.createElement('div');
                check.className = 'technical-data';
                check.style.color = '#4caf50';
                check.innerText = 'PRODUCTION_READY ✔';
                actions.appendChild(check);
            }

            card.appendChild(actions);
            grid.appendChild(card);
        }
    }

    createActionBtn(text, callback, isPrimary = false) {
        const btn = document.createElement('button');
        btn.className = 'technical-data';
        btn.innerText = text;
        Object.assign(btn.style, {
            background: isPrimary ? 'var(--color-gold)' : '#fff',
            color: isPrimary ? '#fff' : 'var(--color-gold)',
            border: `1px solid var(--color-gold)`,
            padding: '10px 20px',
            fontSize: '10px',
            fontWeight: '700',
            cursor: 'pointer',
            borderRadius: 'var(--radius-arch)',
            transition: 'var(--transition-autor)',
            boxShadow: 'var(--shadow-sm)'
        });
        btn.onmouseover = () => {
            btn.style.transform = 'translateY(-2px)';
            btn.style.boxShadow = 'var(--shadow-md)';
        };
        btn.onmouseout = () => {
            btn.style.transform = 'translateY(0)';
            btn.style.boxShadow = 'var(--shadow-sm)';
        };
        btn.onclick = callback;
        return btn;
    }

    async handleAction(action, id) {
        try {
            if (!this.activeWorkspaceId) throw new Error('SE_REQUIERE_ENTORNO_ACTIVO');
            
            if (action === 'sync') await window.SystemAdmin.sync(id, this.registry, this.activeWorkspaceId);
            if (action === 'ignite') await window.SystemAdmin.initializeStorage(id, this.registry, this.activeWorkspaceId);
            
            // Refrescar automáticamente
            await this.refresh();
            this.render();
        } catch (e) {
            alert('SYSTEM_ERROR: ' + e.message);
        }
    }
}
