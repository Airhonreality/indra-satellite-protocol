/**
 * CatalogoModular.js — Motor de Estado TGS v1.0
 * Administrador de Ensambles. 100% agnóstico del DOM.
 * Depende de: QuotationEngine (para resolvePrice)
 */
class CatalogoModular {
    constructor(catalogRef) {
        this.catalog  = catalogRef;   // Referencia viva al array maestro (MOCK_CATALOGO)
        this.cacheKey = 'VETA_CMR_STATE';
        this.subscribers = [];

        // Cargar desde localStorage si hay cambios locales no sincronizados
        const cached = localStorage.getItem(this.cacheKey);
        this._localOverrides = cached ? JSON.parse(cached) : {};
    }

    subscribe(cb) { this.subscribers.push(cb); }
    _commit()     { 
        localStorage.setItem(this.cacheKey, JSON.stringify(this._localOverrides));
        this.subscribers.forEach(cb => cb(this.getEnsambles()));
    }

    // ── CONSULTAS ──────────────────────────────────────

    /** Retorna todos los ensambles activos del catálogo */
    getEnsambles() {
        return this.catalog.filter(p => p.tipo === 'ensamble');
    }

    /** Retorna los ítems atómicos disponibles (para el picker de composición) */
    getAtomos() {
        return this.catalog.filter(p => !p.tipo || p.tipo === 'atomico');
    }

    /** Retorna todos los ítems (átomos + ensambles) para el picker */
    getTodosLosItems() {
        return this.catalog.filter(p => p.activo !== false);
    }

    /** Calcula el precio efectivo de un ensamble */
    getPrecioEfectivo(sku) {
        return QuotationEngine.resolvePrice(sku, this.catalog);
    }

    /** Desglosa el costo de cada línea de un ensamble */
    getDesglose(sku) {
        const item = this.catalog.find(p => p.sku === sku);
        if (!item || item.tipo !== 'ensamble') return [];
        const comp = Array.isArray(item.composicion_json) 
            ? item.composicion_json 
            : JSON.parse(item.composicion_json || '[]');
        return comp.map(linea => {
            const hijo = this.catalog.find(p => p.sku === linea.sku);
            const precioHijo = QuotationEngine.resolvePrice(linea.sku, this.catalog);
            return {
                ...linea,
                descripcion_hijo: hijo?.descripcion || linea.sku,
                precio_hijo_unitario: precioHijo,
                subtotal_linea: precioHijo * linea.cantidad,
                es_ensamble_hijo: hijo?.tipo === 'ensamble',
            };
        });
    }

    // ── MUTACIONES ─────────────────────────────────────

    createEnsamble(data) {
        const sku = data.sku || `ENS-${Date.now()}`;
        const nuevoEnsamble = {
            sku,
            descripcion:        data.descripcion || 'Nuevo Ensamble',
            precio_unitario:    0,
            unidad:             data.unidad || 'und',
            categoria:          'Ensambles',
            tipo:               'ensamble',
            activo:             true,
            asset_imagen_id:    null,
            asset_modelo3d_id:  null,
            medidas_json:       data.medidas_json || { ancho: 0, alto: 0, fondo: 0, unidad: 'cm' },
            atributos:          data.atributos || '',
            composicion_json:   data.composicion_json || [],
            created_at:         new Date().toISOString(),
            updated_at:         new Date().toISOString(),
        };
        this.catalog.push(nuevoEnsamble);
        this._commit();
        return nuevoEnsamble;
    }

    updateEnsamble(sku, patch) {
        const idx = this.catalog.findIndex(p => p.sku === sku);
        if (idx === -1) throw new Error(`ENS no encontrado: ${sku}`);
        Object.assign(this.catalog[idx], { ...patch, updated_at: new Date().toISOString() });
        this._commit();
        return this.catalog[idx];
    }

    addLineaComposicion(sku, linea) {
        const ensamble = this.catalog.find(p => p.sku === sku);
        if (!ensamble) return;
        const comp = Array.isArray(ensamble.composicion_json) 
            ? ensamble.composicion_json 
            : JSON.parse(ensamble.composicion_json || '[]');
        
        const tempComp = [...comp, linea];
        try {
            const tempCatalog = this.catalog.map(p => 
                p.sku === sku ? { ...p, composicion_json: tempComp } : p
            );
            QuotationEngine.resolvePrice(sku, tempCatalog);
        } catch(e) {
            throw new Error('No se puede agregar: crearía una dependencia circular.');
        }

        ensamble.composicion_json = tempComp;
        ensamble.updated_at = new Date().toISOString();
        this._commit();
    }

    updateLineaComposicion(sku, lineaIndex, newData) {
        const ensamble = this.catalog.find(p => p.sku === sku);
        if (!ensamble) return;
        const comp = Array.isArray(ensamble.composicion_json) 
            ? ensamble.composicion_json 
            : [];
        if (newData === null) {
            comp.splice(lineaIndex, 1);
        } else {
            comp[lineaIndex] = { ...comp[lineaIndex], ...newData };
        }
        ensamble.composicion_json = comp;
        ensamble.updated_at = new Date().toISOString();
        this._commit();
    }

    archivarEnsamble(sku) {
        this.updateEnsamble(sku, { activo: false });
    }

    registrarAsset(sku, tipoAsset, atomId) {
        const field = tipoAsset === 'imagen' ? 'asset_imagen_id' : 'asset_modelo3d_id';
        this.updateEnsamble(sku, { [field]: atomId });
    }

    exportarJSON() {
        const ensambles = this.getEnsambles().map(e => ({
            ...e,
            composicion_json: typeof e.composicion_json === 'string' 
                ? JSON.parse(e.composicion_json) 
                : e.composicion_json,
            precio_efectivo: this.getPrecioEfectivo(e.sku),
        }));
        return JSON.stringify(ensambles, null, 2);
    }
}
