/**
 * =============================================================================
 * INDRA SCHEMA PROJECTOR (Standard UI v4.5 - STABILITY EDITION)
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
                gap: 12px; 
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
                border-radius: 14px; 
                overflow: hidden; 
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .schema-card:hover { border-color: var(--indra-accent); }

            .header { 
                padding: 10px 16px; 
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid var(--indra-border);
            }
            .schema-title { display: flex; align-items: center; font-size: 10px; font-weight: 800; color: var(--indra-text-main); letter-spacing: 0.05em; }
            
            .body { background: #fafafa; }
            
            summary {
                padding: 10px 16px;
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
                padding: 12px 16px; 
                max-height: 180px; 
                overflow-y: auto; 
                background: #fff;
                border-top: 1px solid var(--indra-border);
            }
            .field-row { 
                display: flex; 
                justify-content: space-between; 
                padding: 4px 0;
                border-bottom: 1px solid rgba(0,0,0,0.03);
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
            }
            .field-type { color: var(--indra-accent); font-weight: 600; font-size: 9px; opacity: 0.8; }

            .metadata-box {
                padding: 12px 16px;
                background: #f8f9fa;
                border-top: 1px solid var(--indra-border);
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
            }
            .meta-item { display: flex; gap: 8px; margin-bottom: 4px; overflow-wrap: break-word; word-break: break-all; }
            .meta-key { color: var(--indra-text-dim); font-weight: 800; min-width: 70px; }
            .meta-val { color: #444; flex: 1; }

            .actions-row { display: flex; align-items: center; gap: 6px; }
            .btn-action {
                padding: 6px 12px;
                border-radius: 8px;
                font-size: 9px;
                font-weight: 800;
                cursor: pointer;
                border: none;
                transition: all 0.2s;
                text-transform: uppercase;
            }
            .btn-ignite { background: var(--indra-accent); color: white; }
            .btn-update { background: white; color: var(--indra-accent); border: 1px solid var(--indra-accent); }
            .btn-unlink { background: transparent; color: var(--indra-danger); border: 1px solid transparent; font-size: 12px; padding: 4px; }
            .btn-unlink:hover { background: rgba(255, 59, 48, 0.1); border-radius: 4px; }
            
            .status-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; margin-right: 10px; position: relative; }
            .status-sync { background: var(--indra-success); box-shadow: 0 0 10px var(--indra-success); }
            .status-local { background: var(--indra-text-dim); opacity: 0.4; }

            .igniting { opacity: 0.6; pointer-events: none; }
            
            .target-selector {
                font-size: 9px;
                padding: 4px 8px;
                border: 1px solid var(--indra-border);
                border-radius: 8px;
                background: #fdfdfd;
                font-weight: 700;
            }

            .badge-real-time {
                font-size: 8px;
                background: #000;
                color: #fff;
                padding: 2px 5px;
                border-radius: 4px;
                margin-left: 8px;
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
                                    <option value="drive">Drive</option>
                                    <option value="notion" disabled>Notion</option>
                                </select>
                                <button class="btn-action btn-ignite" onclick="this.getRootNode().host.handleExport('${s.id}')">
                                    Exportar
                                </button>
                            ` : `
                                <button class="btn-unlink" title="Desanclar Memoria" onclick="this.getRootNode().host.handleUnlink('${s.id}')">
                                    ✕
                                </button>
                                <button class="btn-action btn-update" onclick="this.getRootNode().host.handleSync('${s.id}')">
                                    Sincronizar
                                </button>
                            `}
                        </div>
                    </div>
                    <div class="body">
                        <details name="indra-global-accordion">
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
                        <details name="indra-global-accordion">
                            <summary>Metadatos de Soberanía</summary>
                            <div class="metadata-box">
                                <div class="meta-item"><span class="meta-key">SILO_ID:</span> <span class="meta-val">${meta.silo_id}</span></div>
                                <div class="meta-item"><span class="meta-key">BRIDGE:</span> <span class="meta-val" style="color:var(--indra-accent);">${meta.bridge_id || '---'}</span></div>
                                <div class="meta-item"><span class="meta-key">FOLDER:</span> <span class="meta-val">${meta.artifacts_folder || 'Desconocida'}</span></div>
                            </div>
                        </details>
                        ` : ''}
                    </div>
                </div>
                `;
            }).join('') || '<div style="opacity:0.3; font-size:11px; text-align:center; padding: 60px;">No se encontraron leyes de datos.</div>')}
        </div>
        `;
    }

    async handleUnlink(schemaId) {
        if (!confirm(`¿Deseas desanclar '${schemaId}'? Se borrará la memoria local.`)) return;
        const bridge = this._bridge;
        const schema = bridge.contract.schemas.find(s => s.id === schemaId);
        if (schema) schema.metadata = {};
        if (bridge.ignitions && bridge.ignitions[schemaId]) {
            delete bridge.ignitions[schemaId];
            localStorage.setItem('INDRA_IGNITIONS', JSON.stringify(bridge.ignitions));
        }
        window.dispatchEvent(new CustomEvent("indra-resonance-sync", { detail: { mode: 'STABLE' } }));
        this.render();
    }

    async handleExport(schemaId) {
        const bridge = this._bridge;
        const target = this.shadowRoot.getElementById(`target-${schemaId}`).value;
        const card = this.shadowRoot.getElementById(`card-${schemaId}`);
        card.classList.add('igniting');
        try {
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
