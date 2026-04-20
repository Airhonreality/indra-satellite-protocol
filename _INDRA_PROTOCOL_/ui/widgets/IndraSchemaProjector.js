/**
 * =============================================================================
 * INDRA SCHEMA PROJECTOR (SINCERITY EDITION v5.5 - GENOME EXPLORER)
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

        // AXIOMA: Sondeo Pasivo de Realidades (Señales del Core)
        this._autoDiscoverRemoteSignals();
    }

    _autoDiscoverRemoteSignals() {
        if (!this._bridge || !this._schemas) return;
        this._schemas.forEach(s => {
            if (s.metadata?.drive_id && !s._remoteState) {
                this.handleRefreshRemote(s.id);
            }
        });
    }

    /**
     * Compara Atómicamente las definiciones (Metadata de campos)
     */
    diffField(localField, remoteField) {
        if (!remoteField) return 'NEW';
        if (localField.type !== remoteField.type || localField.label !== remoteField.label) return 'DIVERGENT';
        return 'STABLE';
    }

    render() {
        if (this._schemas === null) {
            this.shadowRoot.innerHTML = `<div style="padding:40px; text-align:center; opacity:0.5; font-size:11px;">📡 Buscando ADN Local...</div>`;
            return;
        }

        this.shadowRoot.innerHTML = `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=JetBrains+Mono&display=swap');
            
            :host { display: block; font-family: 'Inter', sans-serif; --indra-accent: #007AFF; --indra-border: rgba(0,0,0,0.1); }
            
            .projector-container { display: flex; flex-direction: column; gap: 15px; padding: 10px 0 40px 0; }
            
            .projector-header { 
                display: flex; justify-content: space-between; align-items: center; 
                margin-bottom: 5px; padding: 0 5px;
            }
            .header-title { font-size: 10px; font-weight: 800; opacity: 0.5; text-transform: uppercase; letter-spacing: 1px; }
            
            .btn-refresh {
                background: none; border: 1px solid var(--indra-border); border-radius: 8px;
                padding: 6px 12px; font-size: 9px; font-weight: 800; cursor: pointer; color: var(--indra-text-dim);
                transition: all 0.2s; text-transform: uppercase;
            }
            .btn-refresh:hover { background: var(--indra-accent); color: white; border-color: var(--indra-accent); }

            .schema-card { 
                background: white; border: 1px solid var(--indra-border); border-radius: 16px; 
                overflow: hidden; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.03);
            }
            
            .card-header { 
                padding: 15px 20px; display: flex; justify-content: space-between; align-items: center;
                border-bottom: 1px solid var(--indra-border); background: #fff;
            }
            
            .schema-id { font-size: 11px; font-weight: 800; display: flex; align-items: center; gap: 10px; }
            .status-dot { width: 8px; height: 8px; border-radius: 50%; background: #ccc; }
            .status--synced { background: #32d74b; box-shadow: 0 0 10px #32d74b; }
            .status--divergent { background: #ff9f0a; box-shadow: 0 0 10px #ff9f0a; }

            .btn-main-sync {
                padding: 8px 16px; border-radius: 10px; font-size: 9px; font-weight: 800; 
                cursor: pointer; border: 1px solid var(--indra-accent); background: white; 
                color: var(--indra-accent); text-transform: uppercase; transition: 0.2s;
            }
            .btn-main-sync:hover { background: var(--indra-accent); color: white; }
            .btn-main-sync.divergent { background: #ff9f0a; color: white; border-color: #ff9f0a; }

            summary {
                padding: 12px 20px; font-size: 9px; font-weight: 800; color: #8e8e93;
                cursor: pointer; background: #fafafa; border-top: 1px solid var(--indra-border);
                display: flex; justify-content: space-between; align-items: center; text-transform: uppercase;
                list-style: none;
            }
            summary:hover { color: var(--indra-accent); }
            
            .fields-list { padding: 10px 20px; background: white; }
            
            .field-row { 
                display: flex; align-items: center; padding: 10px 0;
                border-bottom: 1px solid rgba(0,0,0,0.03); gap: 12px;
            }
            .field-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
            .field-label { font-size: 11px; font-weight: 600; color: #1c1c1e; }
            .field-meta { font-family: 'JetBrains Mono', monospace; font-size: 9px; opacity: 0.5; }
            
            .field-actions { display: flex; gap: 6px; }
            
            .btn-atomic {
                width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;
                border-radius: 6px; border: 1px solid var(--indra-border); background: white;
                font-size: 10px; cursor: pointer; transition: 0.2s;
            }
            .btn-atomic:hover { background: #f2f2f7; border-color: #8e8e93; }
            .btn-atomic.active { color: var(--indra-accent); border-color: var(--indra-accent); }

            .divergence-indicator {
                width: 4px; height: 100%; position: absolute; left: 0; background: #ff9f0a;
                display: none;
            }
            .field-row.divergent .divergence-indicator { display: block; }
            .field-row.divergent .field-label { color: #ff9f0a; }

            .metadata-box {
                padding: 15px 20px; background: #fdfdfd; border-top: 1px solid var(--indra-border);
                font-family: 'JetBrains Mono', monospace; font-size: 9px;
            }
            .meta-item { display: flex; gap: 10px; margin-bottom: 6px; color: #8e8e93; }
            .meta-val { color: #1c1c1e; }
        </style>

        <div class="projector-container">
            <header class="projector-header">
                <div class="header-title">Leyes de Datos Detectadas (ADN)</div>
                <button class="btn-refresh" id="btn-refresh-local">Volver a Escanear Disco</button>
            </header>

            ${this._schemas.map(s => this._renderSchemaCard(s)).join('')}
        </div>
        `;

        this._setupListeners();
    }

    _renderSchemaCard(s) {
        const meta = s.metadata || {};
        const isSynced = !!meta.drive_id;
        const remote = s._remoteState || null;
        const fields = s.fields || s.payload?.fields || [];
        const remoteFields = remote?.fields || remote?.payload?.fields || [];

        // Detección de Divergencia Global
        let hasDivergence = false;
        if (isSynced && remote) {
            hasDivergence = fields.some(f => {
                const rf = remoteFields.find(r => r.id === f.id);
                return this.diffField(f, rf) === 'DIVERGENT';
            }) || fields.length !== remoteFields.length;
        }

        return `
        <div class="schema-card">
            <div class="card-header">
                <div class="schema-id">
                    <span class="status-dot ${isSynced ? (hasDivergence ? 'status--divergent' : 'status--synced') : ''}"></span>
                    <span>${(s.handle?.alias || s.id).toUpperCase()}</span>
                </div>
                <button class="btn-main-sync ${hasDivergence ? 'divergent' : ''}" onclick="this.getRootNode().host.handleFullSync('${s.id}')">
                    ${isSynced ? (hasDivergence ? 'Actualizar Core' : 'Sincronizado') : 'Subir al Core'}
                </button>
            </div>

            <div class="card-body">
                <details open>
                    <summary>Definición de Arquitectura</summary>
                    <div class="fields-list">
                        ${fields.map(f => {
                            const rf = remoteFields.find(r => r.id === f.id);
                            const fieldStatus = isSynced && remote ? this.diffField(f, rf) : 'STABLE';
                            return `
                                <div class="field-row ${fieldStatus === 'DIVERGENT' ? 'divergent' : ''}" style="position:relative;">
                                    <div class="divergence-indicator"></div>
                                    <div class="field-info">
                                        <div class="field-label">${f.label || f.id}</div>
                                        <div class="field-meta">${f.id.toUpperCase()} • ${f.type}</div>
                                    </div>
                                    <div class="field-actions">
                                        <button class="btn-atomic active" title="Bajar del Core" onclick="this.getRootNode().host.handleAtomicPull('${s.id}', '${f.id}')">↓</button>
                                        <button class="btn-atomic active" title="Subir al Core" onclick="this.getRootNode().host.handleAtomicPush('${s.id}', '${f.id}')">↑</button>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </details>

                ${isSynced ? `
                <details>
                    <summary>Evidencia del Core (Sincronía)</summary>
                    <div class="metadata-box">
                        <div class="meta-item"><span>ID DRIVE:</span> <span class="meta-val">${meta.drive_id}</span></div>
                        <div class="meta-item"><span>SYNCED_AT:</span> <span class="meta-val">${meta.synced_at || '--'}</span></div>
                        <div style="margin-top:10px;">
                            <button class="btn-refresh" style="font-size:8px;" onclick="this.getRootNode().host.handleRefreshRemote('${s.id}')">Validar contra Core (PULL)</button>
                        </div>
                    </div>
                </details>
                ` : ''}
            </div>
        </div>
        `;
    }

    _setupListeners() {
        const refreshBtn = this.shadowRoot.getElementById('btn-refresh-local');
        if (refreshBtn) {
            refreshBtn.onclick = () => {
                this.dispatchEvent(new CustomEvent('indra-refresh-local', { bubbles: true, composed: true }));
            };
        }
    }

    async handleAtomicPush(schemaId, fieldId) {
        const schema = this._schemas.find(s => s.id === schemaId);
        const field = (schema.fields || schema.payload?.fields || []).find(f => f.id === fieldId);
        console.log(`🚀 [Sincerity:Atomic] Subiendo definición del campo '${fieldId}' en ${schemaId}...`);
        
        try {
            await this._bridge.resonanceSync.patchSchemaField(schemaId, field);
            this.handleRefreshRemote(schemaId); // Refrescar estado remoto tras el parche
        } catch (e) {
            alert("Fallo la sincronización atómica: " + e.message);
        }
    }

    async handleAtomicPull(schemaId, fieldId) {
        alert("PULL ATÓMICO: Esta acción sobreescribirá tu archivo JS local para el campo '" + fieldId + "'.");
        // Lógica de manipulación de archivo local (vía Vite API) a implementar si es necesario.
    }

    async handleFullSync(schemaId) {
        const schema = this._schemas.find(s => s.id === schemaId);
        try {
            await this._bridge.resonanceSync.anchorSchema(schemaId);
            this.handleRefreshRemote(schemaId);
        } catch (e) {
            alert("Fallo el anclaje global: " + e.message);
        }
    }

    async handleRefreshRemote(schemaId) {
        const schema = this._schemas.find(s => s.id === schemaId);
        if (!schema || !schema.metadata?.drive_id) return;

        try {
            const resp = await this._bridge.execute({
                protocol: 'ATOM_READ',
                provider: 'drive',
                context_id: schema.metadata.drive_id
            });
            if (resp.metadata?.status === 'OK') {
                const remoteAtom = resp.items?.[0];
                schema._remoteState = remoteAtom.payload;
                this.render();
            }
        } catch (e) {
            console.error("Fallo el refresco remoto:", e);
        }
    }
}

customElements.define('indra-schema-projector', IndraSchemaProjector);
