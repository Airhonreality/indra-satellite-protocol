/*
 * QuotationEngine.js — Núcleo de Estado TGS (v21.0)
 * Sin dependencias del DOM. Agnóstico, predecible y estricto.
 */
export class QuotationEngine {
    constructor(initialState) {
        this.version = '1.2'; // Actualización: Soporte para Modo Impresión (Axiom Print)
        this.subscribers = [];
        this.cacheKey = 'VETA_ORO_TGS_STATE';
        
        const cached = localStorage.getItem(this.cacheKey);
        this.state = cached ? JSON.parse(cached) : this.buildInitialState(initialState);
    }

    buildInitialState(override) {
        return {
            metadata: {
                nombre_proyecto: 'Nuevo Proyecto Industrial',
                id_propuesta: 'COT-'+Date.now(),
                fecha_emision: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
            },
            etiqueta_propuesta: 'Cotización Base',
            cliente: { nombre: '' },
            escenario_activo: 'main',
            escenarios: {
                'main': { etiqueta: 'Cotización Principal', espacios: [] }
            },
            consideraciones_globales: [
                'La selección final de acabados se realizará sobre muestras físicas.',
                'Tiempos de entrega sujetos a disponibilidad de materiales importados.'
            ],
            terminos: {
                tiempos_entrega: '45 días hábiles',
                validez_oferta: '15 días',
                forma_pago: '50% anticipo, 50% contra entrega'
            },
            flags: { pending_sync_uuid: null },
            ...override
        };
    }

    subscribe(callback) {
        this.subscribers.push(callback);
    }

    _commit() {
        localStorage.setItem(this.cacheKey, JSON.stringify(this.state));
        this.subscribers.forEach(cb => cb(this.state));
    }

    // --- ACCIONES DE METADATA & GLOBALES ---
    setMetadata(field, value) {
        this.state.metadata[field] = value;
        this._commit();
    }

    addConsideracion(texto = 'Nueva nota') {
        this.state.consideraciones_globales.push(texto);
        this._commit();
    }

    removeConsideracion(index) {
        this.state.consideraciones_globales.splice(index, 1);
        this._commit();
    }

    updateTermino(field, value) {
        this.state.terminos[field] = value;
        this._commit();
    }

    // --- ACCIONES DE ESTADO ---
    setPropuestaName(name) { this.state.etiqueta_propuesta = name; this._commit(); }
    setCliente(c) { this.state.cliente = { nombre: c.nombre, ...c }; this._commit(); }
    switchScenario(id) { if(this.state.escenarios[id]) { this.state.escenario_activo = id; this._commit(); } }

    createVariant(sourceId, newName) {
        const source = this.state.escenarios[sourceId];
        if (!source) return;
        const newId = 'alt_' + Date.now();
        this.state.escenarios[newId] = JSON.parse(JSON.stringify(source));
        this.state.escenarios[newId].etiqueta = newName;
        this.state.escenario_activo = newId;
        this._commit();
    }

    renameVariant(id, newName) { if(this.state.escenarios[id]) { this.state.escenarios[id].etiqueta = newName; this._commit(); } }
    deleteVariant(id) { if(id !== 'main' && this.state.escenarios[id]) { delete this.state.escenarios[id]; this.state.escenario_activo = 'main'; this._commit(); } }

    // --- ACCIONES DE ESPACIO (Incluyendo BD-15) ---
    addSpace(etiqueta = 'Nuevo Espacio') {
        const uuid = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : 'id_'+Math.random().toString(36).substr(2,9);
        const sc = this.state.escenarios[this.state.escenario_activo];
        sc.espacios.push({ 
            uuid, 
            etiqueta, 
            items_tecnicos: [],
            requirements: [], // BD-15 Integrado
            design: { render: null, skp: null },
            viewMode: 'ENGINEERING' 
        });
        if (this.state.escenario_activo === 'main' && Object.keys(this.state.escenarios).length > 1) {
            this.state.flags.pending_sync_uuid = uuid;
        }
        this._commit();
    }

    cloneSpace(uuid) {
        const sc = this.state.escenarios[this.state.escenario_activo];
        const target = sc.espacios.find(e => e.uuid === uuid);
        if(!target) return;
        const clon = JSON.parse(JSON.stringify(target));
        clon.uuid = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : 'id_'+Math.random().toString(36).substr(2,9); 
        clon.etiqueta += ' (Copia)';
        sc.espacios.push(clon);
        this._commit();
    }

    renameSpace(uuid, name) {
        const sc = this.state.escenarios[this.state.escenario_activo];
        const target = sc.espacios.find(e => e.uuid === uuid);
        if(target) { target.etiqueta = name; this._commit(); }
    }

    deleteSpace(uuid) {
        const sc = this.state.escenarios[this.state.escenario_activo];
        sc.espacios = sc.espacios.filter(e => e.uuid !== uuid);
        this._commit();
    }

    // --- ACCIONES 3D (Fase 4.1) ---
    toggleViewMode(uuid, mode) {
        const sc = this.state.escenarios[this.state.escenario_activo];
        const target = sc.espacios.find(e => e.uuid === uuid);
        if(target) { target.viewMode = mode; this._commit(); }
    }

    async attachAsset(uuid, assetData) {
        const sc = this.state.escenarios[this.state.escenario_activo];
        const target = sc.espacios.find(e => e.uuid === uuid);
        if(target) {
            target.design = { 
                render: assetData.render, 
                skp: assetData.skp, 
                metadata: assetData.metadata || "SOURCE_SYNC" 
            };
            target.viewMode = 'DESIGN_3D';
            this._commit();
        }
    }

    // --- ACCIONES BD-15 (REQUERIMIENTOS) ---
    addRequirement(sUuid) {
        const sc = this.state.escenarios[this.state.escenario_activo];
        const esp = sc.espacios.find(e => e.uuid === sUuid);
        if(esp) {
            esp.requirements.push({ id: Date.now(), desc: 'Nueva Dependencia', spec: '', done: false });
            this._commit();
        }
    }

    toggleRequirement(sUuid, rId) {
        const sc = this.state.escenarios[this.state.escenario_activo];
        const esp = sc.espacios.find(e => e.uuid === sUuid);
        const req = esp.requirements.find(r => r.id === rId);
        if(req) { req.done = !req.done; this._commit(); }
    }

    updateRequirement(sUuid, rId, field, val) {
        const sc = this.state.escenarios[this.state.escenario_activo];
        const esp = sc.espacios.find(e => e.uuid === sUuid);
        const req = esp.requirements.find(r => r.id === rId);
        if(req) { req[field] = val; this._commit(); }
    }

    // --- ACCIONES DE LÍNEA TÉCNICA ---
    addItem(sUuid) {
        const sc = this.state.escenarios[this.state.escenario_activo];
        const esp = sc.espacios.find(e => e.uuid === sUuid);
        if(esp) {
            esp.items_tecnicos.push({ sku: 'TEMP_'+Date.now(), descripcion: '', cantidad: 1, precio_unitario: 0, subtotal: 0 });
            this._commit();
        }
    }

    updateItem(sUuid, oldSku, productData) {
        const sc = this.state.escenarios[this.state.escenario_activo];
        const esp = sc.espacios.find(e => e.uuid === sUuid);
        if(!esp) return;
        const it = esp.items_tecnicos.find(i => i.sku === oldSku);
        if(it) {
            Object.assign(it, { 
                sku: productData.sku || productData.id, 
                descripcion: productData.nombre, 
                precio_unitario: productData.precio_unitario, 
                subtotal: it.cantidad * productData.precio_unitario 
            });
            this._commit();
        }
    }

    updateQty(sUuid, iSku, qty) {
        const sc = this.state.escenarios[this.state.escenario_activo];
        const esp = sc.espacios.find(e => e.uuid === sUuid);
        const it = esp.items_tecnicos.find(i => i.sku === iSku);
        if(it) {
            it.cantidad = Math.max(1, qty);
            it.subtotal = it.cantidad * it.precio_unitario;
            this._commit();
        }
    }

    deleteItem(sUuid, iSku) {
        const sc = this.state.escenarios[this.state.escenario_activo];
        const esp = sc.espacios.find(e => e.uuid === sUuid);
        if(esp) {
            esp.items_tecnicos = esp.items_tecnicos.filter(i => i.sku !== iSku);
            this._commit();
        }
    }
}
