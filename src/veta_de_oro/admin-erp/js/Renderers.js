import { indraBus } from './core/IndraEventBus.js';

/**
 * INDRA AXIOMATIC RENDERER (v8.0)
 * Implementación purista sin estilos inline.
 */

export const DashboardRenderer = {
    init() {
        indraBus.on('PROJECT_LOADED', (data) => this.renderHeader(data.project));
        indraBus.on('FINANCE_UPDATED', (data) => this.renderFinance(data));
    },

    renderHeader(project) {
        const mount = document.getElementById('indra-identity-mount');
        if (!mount) return;
        mount.innerHTML = `
            <div class="header-content">
                <h1 class="axiom-title">${project.name}</h1>
                <span class="axiom-label">REF: ${project.id} | ${project.address}</span>
            </div>
            <div id="indra-finance-mount"></div>
        `;
    },

    renderFinance(f) {
        const mount = document.getElementById('indra-finance-mount');
        if (!mount) return;
        mount.innerHTML = `
            <div class="finance-block">
                <span class="axiom-label">SALDO_PENDIENTE</span>
                <div class="axiom-price">$ ${f.saldo.toLocaleString()}</div>
            </div>
        `;
    }
};

export const QuotationRenderer = {
    init(engine) {
        this.engine = engine;
        indraBus.on('QUOTATION_UPDATED', (payload) => this.render(payload.data));
    },

    render(data) {
        const mount = document.getElementById('indra-quotation-mount');
        if (!mount) return;

        const activeScenario = data.scenarios.find(s => s.uuid === data.activeScenario) || data.scenarios[0];

        mount.innerHTML = `
            <div class="axiom-grid-aureo quotation-container">
                <!-- Panel 1: LISTA RESUMEN -->
                <aside class="quotation-sidebar">
                    <span class="axiom-label">VARIACIONES_BRANCH</span>
                    <div class="variant-list">
                        ${data.scenarios.map(s => `
                            <div class="variant-pill ${s.uuid === data.activeScenario ? 'active' : ''}" data-uuid="${s.uuid}">
                                <h4>${s.name}</h4>
                                <span>$ ${s.total?.toLocaleString() || '0'}</span>
                            </div>
                        `).join('')}
                    </div>
                    <button id="btn-add-variant" class="axiom-btn">+ AÑADIR VARIANTE</button>
                    
                    <hr class="axiom-divider">
                    
                    <span class="axiom-label">ESPACIOS_COTIZADOS</span>
                    <div class="space-summary-list">
                        ${activeScenario.spaces.map(sp => `
                            <div class="space-summary-item">${sp.etiqueta}</div>
                        `).join('')}
                    </div>
                    <button id="btn-add-space" class="axiom-btn axiom-btn-primary">+ AÑADIR ESPACIO</button>
                </aside>

                <!-- Panel 2: DETALLE DE ESPACIOS -->
                <section class="quotation-workspace">
                    <div class="workspace-header">
                        <h2 class="axiom-title-lg">${activeScenario.name}</h2>
                    </div>

                    <div class="spaces-flow">
                        ${activeScenario.spaces.length === 0 ? `
                            <div class="axiom-empty-state">SIN_ESPACIOS_CONFIGURADOS</div>
                        ` : activeScenario.spaces.map(space => this.renderSpaceDetail(space)).join('')}
                    </div>
                </section>
            </div>
        `;

        this.bindEvents();
    },

    renderSpaceDetail(space) {
        return `
            <article class="space-card">
                <header class="space-card-header">
                    <h3>${space.etiqueta}</h3>
                    <div class="axiom-price-sm">$ ${space.subtotal?.toLocaleString() || '0'}</div>
                </header>
                
                <div class="space-card-body">
                    <table class="technical-table">
                        <thead>
                            <tr>
                                <th>CANT</th>
                                <th>DESCRIPCIÓN TÉCNICA</th>
                                <th class="amount">SUBTOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${space.items.length === 0 ? `
                                <tr><td colspan="3" class="axiom-empty-state">ESPERANDO_INGENIERÍA</td></tr>
                            ` : space.items.map(it => `
                                <tr>
                                    <td>${it.cantidad}</td>
                                    <td>${it.nombre}</td>
                                    <td class="amount">$ ${it.subtotal.toLocaleString()}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <footer class="space-card-footer">
                    <button class="axiom-btn-text btn-add-item" data-space-uuid="${space.uuid}">+ AÑADIR LÍNEA TÉCNICA</button>
                </footer>
            </article>
        `;
    },

    bindEvents() {
        // Variante clicks
        document.querySelectorAll('.variant-pill').forEach(pill => {
            pill.addEventListener('click', () => this.engine.switchScenario(pill.getAttribute('data-uuid')));
        });

        // Add Variant
        document.getElementById('btn-add-variant')?.addEventListener('click', () => {
            const name = prompt("Nombre de la variante:", "Nueva variante");
            if (name) this.engine.addVariant(name);
        });

        // Add Space
        document.getElementById('btn-add-space')?.addEventListener('click', () => {
            const label = prompt("Nombre del espacio:", "Nuevo Espacio");
            if (label) this.engine.addSpace(label);
        });

        // Add Item
        document.querySelectorAll('.btn-add-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const spaceUuid = btn.getAttribute('data-space-uuid');
                this.engine.addItem(spaceUuid, { nombre: "Módulo Base Cocina", precio: 850000, cantidad: 1 });
            });
        });
    }
};
