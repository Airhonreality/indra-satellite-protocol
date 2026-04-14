/**
 * SCHEMA: CRM Clientes (v1)
 * Registro central de identidades comerciales.
 */
(function() {
    const schema = {
        id: 'veta_clientes_v1',
        version: '1.0.0',
        label: 'CRM de Clientes Veta de Oro',
        target_provider: 'drive',
        fields: [
            { id: 'nombre', label: 'Nombre o Razón Social', type: 'TEXT' },
            { id: 'identificacion', label: 'Cédula o NIT', type: 'TEXT' },
            { id: 'email', label: 'Email', type: 'EMAIL' },
            { id: 'telefono', label: 'WhatsApp', type: 'PHONE' },
            { id: 'ciudad', label: 'Ciudad', type: 'TEXT' },
            { id: 'origen', label: 'Canal de Captación', type: 'SELECT' },
            { id: 'created_at', label: 'Fecha de Ingreso', type: 'DATE' }
        ]
    };

    if (window.VETA_REGISTRY) {
        window.VETA_REGISTRY[schema.id] = { ...schema, _status: 'UNKNOWN' };
    }
})();
