/**
 * SCHEMA: Seguimiento de Producción (v1.0)
 * El ADN para la trazabilidad industrial de Veta de Oro.
 * Define el contrato de estados para cada ítem de un proyecto contratado.
 */
(function() {
    const schema = {
        id: 'veta_produccion_v1',
        version: '1.0.0',
        label: 'Pipeline de Manufactura e Instalación',
        target_provider: 'drive',
        fields: [
            /* --- VÍNCULO CON PROYECTO --- */
            { id: 'project_id', label: 'VETA_CODE_REF', type: 'TEXT' },
            { id: 'item_id', label: 'ID Ítem (ADN)', type: 'TEXT' },
            { id: 'item_name', label: 'Nombre Elemento', type: 'TEXT' },
            
            /* --- SEGMENTACIÓN (NATURALEZA) --- */
            { id: 'nature', label: 'Tipo de Proceso', type: 'SELECT', options: ['TABLERO', 'HERRAJE', 'TERCERIZADO'] },
            
            /* --- PIPELINE INDUSTRIAL (TABLEROS) --- */
            { id: 'dev_status', label: 'Desarrollo Técnico', type: 'SELECT', options: ['PENDIENTE', 'EN_CURSO', 'OK'] },
            { id: 'nesting_status', label: 'Despiece / Nesting', type: 'SELECT', options: ['PENDIENTE', 'EN_CURSO', 'OK'] },
            { id: 'raw_material_order', label: 'Pedido Material', type: 'SELECT', options: ['PENDIENTE', 'PEDIDO', 'EN_TRANSITO', 'EN_TALLER'] },
            
            /* --- PIPELINE EXTERNO (TERCERIZADOS) --- */
            { id: 'external_order', label: 'Orden Proveedor', type: 'SELECT', options: ['PENDIENTE', 'COTIZADO', 'EN_FABRICA', 'RECIBIDO'] },
            { id: 'supplier_name', label: 'Proveedor Externo', type: 'TEXT' },
            
            /* --- LOGÍSTICA (HERRAJES) --- */
            { id: 'inventory_check', label: 'Verificación Stock', type: 'BOOLEAN' },
            { id: 'purchase_needed', label: 'Compra Requerida', type: 'BOOLEAN' },
            
            /* --- ESTADOS FINALES --- */
            { id: 'production_progress', label: '% Producción', type: 'NUMBER' },
            { id: 'installation_date', label: 'Fecha Instalación', type: 'DATE' },
            { id: 'warranty_status', label: 'Estado Garantía', type: 'TEXT' }
        ]
    };

    if (window.VETA_REGISTRY) {
        window.VETA_REGISTRY[schema.id] = { ...schema, _status: 'UNKNOWN' };
    }
})();
