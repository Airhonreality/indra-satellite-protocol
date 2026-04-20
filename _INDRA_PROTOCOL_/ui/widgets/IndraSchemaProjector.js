/**
 * =============================================================================
 * INDRA SCHEMA PROJECTOR (Standard UI v4.0 - SINCERITY EDITION)
 * =============================================================================
 */

class IndraSchemaProjector extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._schemas = null; 
        this._bridge = null;
    }

    set bridge(val) {
        this._bridge = val;
    }

    set schemas(data) {
        const newData = data || [];
        if (JSON.stringify(this._schemas) === JSON.stringify(newData)) return;
        this._schemas = newData;
        this.render();
    }

    render() {
        const isLoading = this._schemas === null;
        
        this.shadowRoot.innerHTML = `
        <style>
            :host { display: block; font-family: inherit; }
            .projector-container { 
                display: flex; 
                flex-direction: column; 
                gap: 16px; 
                padding: 10px 20px 30px 20px;
                max-height: 80vh; 
                overflow-y: auto; 
            }
            /* Custom Scrollbar Premium */
            .projector-container::-webkit-scrollbar { width: 6px; }
            .projector-container::-webkit-scrollbar-track { background: transparent; }
            .projector-container::-webkit-scrollbar-thumb { background: var(--indra-border); border-radius: 10px; }

            .schema-card { 
                background: white;
                border: 1px solid var(--indra-border); 
                border-radius: 16px; 
                overflow: hidden; 
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 4px 12px rgba(0,0,0,0.03);
            }
            .schema-card:hover { border-color: var(--indra-accent); transform: translateY(-2px); box-shadow: 0 10px 25px rgba(0,0,0,0.06); }

            .header { 
                padding: 16px 20px; 
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid var(--indra-border);
            }
            .schema-title { display: flex; align-items: center; font-size: 11px; font-weight: 800; color: var(--indra-text-main); letter-spacing: 0.05em; }
            
            .body { background: #fafafa; }
            
            summary {
                padding: 12px 20px;
                font-size: 10px;
                font-weight: 700;
                color: var(--indra-text-dim);
                cursor: pointer;
                background: white;
                border-top: 1px solid var(--indra-border);
                display: flex;
                justify-content: space-between;
                align-items: center;
                list-style: none;
            }
            summary:hover { background: #fdfdfd; color: var(--indra-accent); }
            summary::after { content: '↓'; font-size: 12px; opacity: 0.5; transition: transform 0.3s; }
            details[open] summary::after { transform: rotate(180deg); }
            
            .fields-list { 
                padding: 15px 20px; 
                max-height: 200px; 
                overflow-y: auto; 
                background: #fff;
                border-top: 1px solid var(--indra-border);
            }
            .field-row { 
                display: flex; 
                justify-content: space-between; 
                padding: 6px 0;
                border-bottom: 1px solid rgba(0,0,0,0.03);
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
            }
            .field-type { color: var(--indra-accent); font-weight: 600; font-size: 9px; opacity: 0.8; }

            .metadata-box {
                padding: 15px 20px;
                background: #f8f9fa;
                border-top: 1px solid var(--indra-border);
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                overflow: hidden;
            }
            .meta-item { display: flex; gap: 8px; margin-bottom: 6px; overflow-wrap: break-word; word-break: break-all; }
            .meta-key { color: var(--indra-text-dim); font-weight: 800; min-width: 80px; }
            .meta-val { color: #444; flex: 1; }

            .actions-row { display: flex; align-items: center; gap: 8px; }
            .btn-action {
                padding: 8px 16px;
                border-radius: 10px;
                font-size: 10px;
                font-weight: 800;
                cursor: pointer;
                border: none;
                transition: all 0.2s;
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }
            .btn-ignite { background: var(--indra-accent); color: white; box-shadow: 0 4px 12px rgba(0, 122, 255, 0.2); }
            .btn-update { background: white; color: var(--indra-accent); border: 1px solid var(--indra-accent); }
            .btn-unlink { background: transparent; color: var(--indra-danger); border: 1px solid transparent; font-size: 12px; padding: 4px 8px; }
            .btn-unlink:hover { background: rgba(255, 59, 48, 0.1); border-radius: 6px; }
            
            .status-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 12px; position: relative; }
            .status-sync { background: var(--indra-success); box-shadow: 0 0 10px var(--indra-success); }
            .status-local { background: var(--indra-text-dim); opacity: 0.4; }

            .igniting { opacity: 0.6; pointer-events: none; filter: blur(1px); }
            
            .target-selector {
                font-size: 10px;
                padding: 6px 10px;
                border: 1px solid var(--indra-border);
                border-radius: 10px;
                background: #fdfdfd;
                font-weight: 700;
                color: #555;
            }

            .badge-real-time {
                font-size: 8px;
                background: #000;
                color: #fff;
                padding: 2px 6px;
                border-radius: 4px;
                margin-left: 8px;
                vertical-align: middle;
            }
        </style>
        <div class="projector-container">
            ${isLoading ? `<div style="padding:40px; text-align:center; opacity:0.5; font-size:11px;">📡 Sincronizando con el Manifiesto del Universo...</div>` : 
            (this._schemas.map(s => {
                const meta = s.metadata || {};
                const isSynced = !!meta.silo_id;
                
                return `
                <div class="schema-card" id="card-${s.id}">
                    <div class="header">
                        <div class="schema-title">
                            <span class="status-dot ${isSynced ? 'status-sync' : 'status-local'}"></span>
                            <span>${(s.handle?.alias || s.id).toUpperCase()}</span>
                            ${isSynced ? `<span class="badge-real-time">SINCERIDAD: ON</span>` : ''}
                        </div>
                        <div class="actions-row">
                            ${!isSynced ? `
                                <select class="target-selector" id="target-${s.id}">
                                    <option value="drive">Drive (Sheets)</option>
                                    <option value="notion" disabled>Notion</option>
                                </select>
                                <button class="btn-action btn-ignite" onclick="this.getRootNode().host.handleExport('${s.id}')">
                                    Exportar
                                </button>
                            ` : `
                                <button class="btn-unlink" title="Desanclar y Borrar Memoria Falsa" onclick="this.getRootNode().host.handleUnlink('${s.id}')">
                                    ✕
                                </button>
                                <button class="btn-action btn-update" onclick="this.getRootNode().host.handleSync('${s.id}')">
                                    Sincronizar
                                </button>
                            `}
                        </div>
                    </div>
                    <div class="body">
                        <details>
                            <summary>Estructura de Datos</summary>
                            <div class="fields-list">
                                ${(s.fields || s.payload?.fields || []).map(f => `
                                    <div class="field-row">
                                        <span class="field-label">${f.label || f.id}</span>
                                        <span class="field-type">${f.type}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </details>
                        
                        ${isSynced ? `
                        <details>
                            <summary>Metadatos de Soberanía (Core ID)</summary>
                            <div class="metadata-box">
                                <div class="meta-item"><span class="meta-key">SILO_ID:</span> <span class="meta-val">${meta.silo_id}</span></div>
                                <div class="meta-item"><span class="meta-key">BRIDGE_ID:</span> <span class="meta-val" style="color:var(--indra-accent);">${meta.bridge_id || '---'}</span></div>
                                <div class="meta-item"><span class="meta-key">FOLDER:</span> <span class="meta-val">${meta.artifacts_folder || 'Desconocida'}</span></div>
                                <div class="meta-item"><span class="meta-key">DRIVE_ID:</span> <span class="meta-val">${meta.drive_id || '---'}</span></div>
                            </div>
                        </details>
                        ` : ''}
                    </div>
                </div>
                `;
            }).join('') || '<div style="opacity:0.3; font-size:11px; text-align:center; padding: 60px;">No se encontraron leyes de datos en el territorio.</div>')}
        </div>
        `;
    }

    async handleUnlink(schemaId) {
        if (!confirm(`¿Deseas desanclar '${schemaId}'? Esto borrará la memoria de sincronización local.`)) return;
        
        const bridge = this._bridge;
        if (!bridge) return;

        // 1. Borrar de la memoria viva
        const schema = bridge.contract.schemas.find(s => s.id === schemaId);
        if (schema) {
            schema.metadata = {};
        }

        // 2. Borrar de las igniciones persistentes
        if (bridge.ignitions && bridge.ignitions[schemaId]) {
            delete bridge.ignitions[schemaId];
            localStorage.setItem('INDRA_IGNITIONS', JSON.stringify(bridge.ignitions));
        }

        console.log(`[Projector] Memoria de '${schemaId}' purgada.`);
        
        // 3. Notificar refresco de UI
        window.dispatchEvent(new CustomEvent("indra-resonance-sync", { detail: { mode: 'STABLE' } }));
        this.render();
    }

    async handleExport(schemaId) {
        const bridge = this._bridge;
        if (!bridge) return alert("Error: No se detectó conexión con el Bridge.");

        const target = this.shadowRoot.getElementById(`target-${schemaId}`).value;
        const card = this.shadowRoot.getElementById(`card-${schemaId}`);
        card.classList.add('igniting');

        try {
            console.log(`[Projector] Iniciando Ignición Industrial de '${schemaId}'...`);
            await bridge.resonanceSync.materializeSchema(schemaId, { provider: target });
        } catch (e) {
            alert("Error al exportar: " + e.message);
        } finally {
            card.classList.remove('igniting');
            this.render();
        }
    }

    async handleSync(schemaId) {
        const bridge = this._bridge;
        if (!bridge) return;

        const card = this.shadowRoot.getElementById(`card-${schemaId}`);
        card.classList.add('igniting');

        try {
            await bridge.resonanceSync.resonateSchema(schemaId);
        } catch (e) {
            alert("Error de sincronización: " + e.message);
        } finally {
            card.classList.remove('igniting');
            this.render();
        }
    }
}

customElements.define('indra-schema-projector', IndraSchemaProjector);
