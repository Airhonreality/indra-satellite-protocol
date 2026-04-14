/**
 * SCHEMA: Catálogo (v1)
 * Inventario de materiales y parámetros técnicos.
 */
(function() {
    const schema = {
        id: 'veta_catalogo_v1',
        version: '1.0.0',
        label: 'Catálogo de Materiales y Precios',
        target_provider: 'drive',
        fields: [
            { id: 'referencia', label: 'REF', type: 'TEXT' },
            { id: 'nombre', label: 'Nombre del Material', type: 'TEXT' },
            { id: 'categoria', label: 'Categoría', type: 'SELECT' },
            { id: 'precio_m2', label: 'Precio por m²', type: 'CURRENCY' },
            { id: 'proveedor', label: 'Proveedor', type: 'TEXT' },
            { id: 'activo', label: 'Activo en Catálogo', type: 'BOOLEAN' },
            { id: 'notas', label: 'Observaciones', type: 'LONG_TEXT' },
            { id: 'tipo', label: 'Tipo de Ítem', type: 'SELECT', options: ['atomico', 'ensamble'], default: 'atomico' },
            { id: 'composicion_json', label: 'Composición (JSON)', type: 'LONG_TEXT' },
            { id: 'asset_imagen_id', label: 'ID Asset Imagen (Indra)', type: 'TEXT' },
            { id: 'asset_modelo3d_id', label: 'ID Asset Modelo 3D (Indra)', type: 'TEXT' },
            { id: 'medidas_json', label: 'Medidas (JSON)', type: 'LONG_TEXT' },
            { id: 'atributos', label: 'Atributos Técnicos', type: 'LONG_TEXT' }
        ]
    };

    if (window.VETA_REGISTRY) {
        window.VETA_REGISTRY[schema.id] = { ...schema, _status: 'UNKNOWN' };
    }
})();
