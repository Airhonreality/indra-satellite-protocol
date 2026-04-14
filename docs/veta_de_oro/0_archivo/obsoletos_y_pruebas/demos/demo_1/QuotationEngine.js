/*
 * QuotationEngine.js — Núcleo de Estado TGS (v21.0)
 * Sin dependencias del DOM. Agnóstico, predecible y estricto.
 */
export class QuotationEngine {
    constructor(initialState) {
        this.version = '1.0';
        this.subscribers = [];
        this.cacheKey = 'VETA_ORO_TGS_STATE';
        
        const cached = localStorage.getItem(this.cacheKey);
        this.state = cached ? JSON.parse(cached) : this.buildInitialState(initialState);
    }

    buildInitialState(override) {
        return {
            etiqueta_propuesta: 'COT-'+Date.now(),
            cliente: { nombre: '' },
            escenario_activo: 'main',
            escenarios: {
                'main': { etiqueta: 'Cotización Principal', espacios: [] }
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

    // --- ACCIONES DE ESTADO PURO ---

    setPropuestaName(name) {
        this.state.etiqueta_propuesta = name;
        this._commit();
    }

    setCliente(c) {
        this.state.cliente = { nombre: c.nombre, ...c };
        this._commit();
    }

    switchScenario(id) {
        if(this.state.escenarios[id]) {
            this.state.escenario_activo = id;
            this._commit();
        }
    }

    // FABRICA CONSECUENTE: Derivación Determinística
    createVariant(sourceId, newName) {
        const source = this.state.escenarios[sourceId];
        if (!source) return;
        const newId = 'alt_' + Date.now();
        // Generamos un clon estructurado. 
        // En el futuro, aquí se regeneran timestamps de creación de la rama.
        this.state.escenarios[newId] = JSON.parse(JSON.stringify(source));
        this.state.escenarios[newId].etiqueta = newName;
        this.state.escenario_activo = newId;
        this._commit();
    }

    renameVariant(id, newName) {
        if(this.state.escenarios[id]) {
            this.state.escenarios[id].etiqueta = newName;
            this._commit();
        }
    }

    deleteVariant(id) {
        if(id !== 'main' && this.state.escenarios[id]) {
            delete this.state.escenarios[id];
            this.state.escenario_activo = 'main';
            this._commit();
        }
    }

    // --- ACCIONES DE ESPACIO ---

    addSpace(etiqueta = 'Nuevo Espacio') {
        const uuid = crypto.randomUUID();
        const sc = this.state.escenarios[this.state.escenario_activo];
        sc.espacios.push({ uuid, etiqueta, items_tecnicos: [] });
        
        // Regla de Propagación: Si estoy en master y hay más ramas, avisa.
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
        clon.uuid = crypto.randomUUID(); 
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

    // --- PROPAGACIÓN ---
    propagateSpaceToBranches(uuid) {
        const masterSpace = this.state.escenarios['main'].espacios.find(e => e.uuid === uuid);
        if(!masterSpace) return;
        Object.keys(this.state.escenarios).forEach(id => {
            if(id !== 'main' && !this.state.escenarios[id].espacios.some(e => e.uuid === uuid)) {
                this.state.escenarios[id].espacios.push(JSON.parse(JSON.stringify(masterSpace)));
            }
        });
        this.state.flags.pending_sync_uuid = null;
        this._commit();
    }

    dismissPropagate() {
        this.state.flags.pending_sync_uuid = null;
        this._commit();
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
        if(!esp) return;
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
