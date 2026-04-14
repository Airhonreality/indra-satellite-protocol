/**
 * SCHEMA: Cotizaciones (v1)
 * ADN de solicitudes técnicas para Veta de Oro.
 */
(function() {
    const schema = {
        id: 'veta_cotizaciones_v1',
        version: '1.0.0',
        label: 'Gestión de Propuestas Comerciales',
        target_provider: 'drive',
        fields: [
            { id: 'cliente_nombre', label: 'Nombre del Cliente', type: 'TEXT' },
            { id: 'cliente_tel', label: 'Teléfono / WhatsApp', type: 'PHONE' },
            { id: 'cliente_zona', label: 'Zona / Proyecto', type: 'TEXT' },
            { id: 'tipo_proyecto', label: 'Tipo de Proyecto', type: 'SELECT' },
            { id: 'acabado', label: 'Acabado de Superficie', type: 'SELECT' },
            { id: 'escala', label: 'Escala del Área', type: 'SELECT' },
            { id: 'monto_estimado', label: 'Inversión Proyectada', type: 'CURRENCY' },
            { id: 'json_payload', label: 'Payload TGS Completo', type: 'LONG_TEXT' },
            { id: 'estado', label: 'Estado de la Propuesta', type: 'SELECT' },
            { id: 'asesor', label: 'Asesor Comercial', type: 'TEXT' },
            { id: 'created_at', label: 'Fecha de Registro', type: 'DATE' }
        ]
    };

    if (window.VETA_REGISTRY) {
        window.VETA_REGISTRY[schema.id] = { ...schema, _status: 'UNKNOWN' };
    }
})();
