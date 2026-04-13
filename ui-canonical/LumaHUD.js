/**
 * =============================================================================
 * LUMA HUD (Indra Satellite Control Panel)
 * =============================================================================
 * Responsabilidad: Interfaz de control y diagnóstico para el Arquitecto.
 * Estética: Indra Premium (Glassmorphism, Dark Mode, Micro-animaciones).
 * =============================================================================
 */

class LumaHUD extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isOpen = false;
        this.driftResults = null;
        this.indra = null; // Instancia de IndraBridge
        this.toasts = [];
        this.isOnline = true;
    }

    connectedCallback() {
        this.render();
        this._startPulseCheck();
    }

    setIndraInstance(indra) {
        this.indra = indra;
        this.render();
    }

    setDriftResults(results) {
        this.driftResults = results;
        this.render();
    }

    /**
     * SISTEMA DE TOASTS (Aduana Visual)
     */
    toast(message, type = 'info', traceId = null) {
        const id = Date.now();
        this.toasts.push({ id, message, type, traceId });
        this.render();

        // Autodestrucción
        setTimeout(() => {
            this.toasts = this.toasts.filter(t => t.id !== id);
            this.render();
        }, 5000);
    }

    toggle() {
        this.isOpen = !this.isOpen;
        this.render();
    }

    async handleIgnite(alias) {
        const schema = this.driftResults.missing_remote.find(s => s.handle.alias === alias);
        if (schema && this.indra) {
            try {
                this.toast(`Iniciando ignición de ${alias}...`, 'info');
                await this.indra.ignitor.ignite(schema);
                this.toast(`¡Esquema '${alias}' ignitado!`, 'success');
                setTimeout(() => window.location.reload(), 1500);
            } catch (e) {
                this.toast(e.message, 'error', e.traceId);
            }
        }
    }

    async _startPulseCheck() {
        setInterval(async () => {
            if (this.indra) {
                const status = await this.indra.ping();
                if (this.isOnline !== status.online) {
                    this.isOnline = status.online;
                    this.render();
                }
            }
        }, 30000); // Cada 30 segs
    }

    render() {
        const hasDrift = this.driftResults && (this.driftResults.missing_remote.length > 0 || this.driftResults.drifted.length > 0);

        this.shadowRoot.innerHTML = `
        <style>
            :host {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 999999;
                font-family: 'Inter', system-ui, sans-serif;
                color: white;
            }

            /* LUMA ICON */
            .luma-trigger {
                width: 56px;
                height: 56px;
                background: linear-gradient(135deg, #00f2ff, #0066ff);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 10px 20px rgba(0, 102, 255, 0.3);
                transition: 0.3s;
                border: 2px solid rgba(255, 255, 255, 0.2);
                position: relative;
            }

            .luma-trigger:hover { transform: scale(1.1) rotate(5deg); }

            .luma-trigger svg { width: 28px; fill: white; }

            .pulse-dot {
                position: absolute;
                bottom: 2px;
                right: 2px;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: ${this.isOnline ? '#2ecc71' : '#ff3b30'};
                border: 2px solid #0f0f0f;
                box-shadow: 0 0 10px ${this.isOnline ? '#2ecc71' : '#ff3b30'};
            }

            .badge {
                position: absolute;
                top: -5px;
                right: -5px;
                background: #ff3b30;
                padding: 2px 6px;
                border-radius: 10px;
                font-size: 10px;
                font-weight: bold;
                display: ${hasDrift ? 'block' : 'none'};
            }

            /* TOASTS */
            .toast-container {
                position: absolute;
                bottom: 80px;
                right: 0;
                display: flex;
                flex-direction: column-reverse;
                gap: 10px;
                pointer-events: none;
            }

            .toast {
                width: 280px;
                padding: 12px 16px;
                border-radius: 12px;
                background: rgba(30, 30, 30, 0.9);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                animation: toastIn 0.3s ease-out;
                font-size: 13px;
                pointer-events: all;
            }

            @keyframes toastIn {
                from { opacity: 0; transform: translateX(20px); }
                to { opacity: 1; transform: translateX(0); }
            }

            .toast-error { border-left: 4px solid #ff3b30; }
            .toast-success { border-left: 4px solid #2ecc71; }
            .toast-info { border-left: 4px solid #00f2ff; }

            .trace-id { font-family: monospace; font-size: 9px; opacity: 0.5; margin-top: 5px; }

            /* PANEL */
            .panel {
                position: absolute;
                bottom: 70px;
                right: 0;
                width: 320px;
                background: rgba(15, 15, 15, 0.9);
                backdrop-filter: blur(25px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                padding: 20px;
                display: ${this.isOpen ? 'block' : 'none'};
                animation: slideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1);
            }

            @keyframes slideUp {
                from { opacity: 0; transform: translateY(20px) scale(0.9); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }

            h2 { font-size: 14px; color: #00f2ff; margin-bottom: 20px; letter-spacing: 2px; }

            .section-title { font-size: 10px; color: #666; text-transform: uppercase; margin-bottom: 15px; }

            .drift-item {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 12px;
                padding: 12px;
                margin-bottom: 10px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .btn-ignite {
                background: #0066ff;
                border: none;
                color: white;
                font-size: 10px;
                padding: 6px 12px;
                border-radius: 6px;
                cursor: pointer;
            }

            .footer {
                margin-top: 20px;
                padding-top: 15px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                font-size: 11px;
                color: #555;
                display: flex;
                justify-content: space-between;
            }
        </style>

        <div class="toast-container">
            ${this.toasts.map(t => `
                <div class="toast toast-${t.type}">
                    ${t.message}
                    ${t.traceId ? `<div class="trace-id">Trace: ${t.traceId}</div>` : ''}
                </div>
            `).join('')}
        </div>

        <div class="luma-trigger" id="trigger">
            <svg viewBox="0 0 24 24"><path d="M12,2L4.5,20.29L5.21,21L12,18L18.79,21L19.5,20.29L12,2Z"/></svg>
            <div class="pulse-dot"></div>
            <div class="badge">${this.driftResults?.missing_remote.length || ''}</div>
        </div>

        <div class="panel">
            <h2>FORJA DE INDRA</h2>
            
            <div class="section">
                <div class="section-title">Sinceridad de ADN (Deriva)</div>
                ${this._renderDriftItems()}
            </div>

            <div class="section">
                <div class="section-title">Jurisdicción</div>
                <div style="font-size: 11px;">${this.indra?.identity?.currentUser?.email || 'Desconocido'}</div>
            </div>

            <div class="footer">
                <span>Core v${this.indra?.coreVersion || '4.1'}</span>
                <span style="color:#00f2ff; cursor:pointer;" onclick="window.open('https://indra-os.pages.dev')">Indra Designer</span>
            </div>
        </div>
        `;

        this.shadowRoot.getElementById('trigger').onclick = () => this.toggle();
        this.shadowRoot.querySelectorAll('.btn-ignite').forEach(btn => {
            btn.onclick = () => this.handleIgnite(btn.dataset.alias);
        });
    }

    _renderDriftItems() {
        if (!this.driftResults) return '<div style="font-size:11px; opacity:0.5;">Analizando...</div>';
        
        const missing = this.driftResults.missing_remote.map(s => `
            <div class="drift-item">
                <div style="font-size:12px;">${s.handle.label} <span style="color:#ff3b30; font-size:9px; display:block;">SIN MATERIA</span></div>
                <button class="btn-ignite" data-alias="${s.handle.alias}">IGNITAR</button>
            </div>
        `).join('');

        if (missing === '' && this.driftResults.drifted.length === 0) {
            return '<div style="font-size:11px; color:#2ecc71;">✓ Materia sincronizada con el código.</div>';
        }

        return missing;
    }
}

customElements.define('indra-luma-hud', LumaHUD);
export default LumaHUD;
