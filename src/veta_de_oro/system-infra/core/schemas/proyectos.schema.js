/**
 * SCHEMA: Proyectos (v1.1)
 * El ADN aprobado para la gestión integral de Veta de Oro.
 * Integra Metadata de Cliente, Carpintería y Trazabilidad Financiera.
 */
(function() {
    const schema = {
        id: 'veta_proyectos_v1',
        version: '1.1.0',
        label: 'Gestión Integral de Proyectos',
        target_provider: 'drive',
        fields: [
            /* --- METADATA PROYECTO --- */
            { id: 'project_id', label: 'VETA_CODE', type: 'TEXT' },
            { id: 'project_name', label: 'Nombre Proyecto', type: 'TEXT' },
            { id: 'project_address', label: 'Dirección Obra', type: 'TEXT' },
            { id: 'project_city', label: 'Ciudad', type: 'TEXT' },
            
            /* --- METADATA CLIENTE --- */
            { id: 'client_full_name', label: 'Nombre Cliente', type: 'TEXT' },
            { id: 'client_tax_id', label: 'Cédula/NIT', type: 'TEXT' },
            { id: 'client_phone', label: 'WhatsApp', type: 'PHONE' },
            { id: 'client_email', label: 'Email', type: 'EMAIL' },
            
            /* --- HITOS Y LOGÍTICA --- */
            { id: 'fase_actual', label: 'Fase Operativa', type: 'SELECT' }, // LEAD, DISEÑO, CONTRATADO, etc.
            { id: 'remedicion_ok', label: 'Remedición Validada', type: 'BOOLEAN' },
            { id: 'fecha_contrato', label: 'Día Cero (Firma)', type: 'DATE' },
            
            /* --- FINANZAS (TRACRABILIDAD) --- */
            { id: 'valor_total', label: 'Total Contrato', type: 'CURRENCY' },
            { id: 'abonos_totales', label: 'Suma de Abonos', type: 'CURRENCY' },
            { id: 'json_pagos', label: 'Historial de Pagos (JSON)', type: 'LONG_TEXT' },
            { id: 'estado_pago', label: 'Estado Financiero', type: 'SELECT' }, // PENDIENTE, AL_DIA, MORA, LIQUIDADO
            
            /* --- INGENIERÍA --- */
            { id: 'json_espacios', label: 'Ingeniería de Espacios', type: 'LONG_TEXT' },
            { id: 'json_items', label: 'Átomos de Producción', type: 'LONG_TEXT' }
        ]
    };

    if (window.VETA_REGISTRY) {
        window.VETA_REGISTRY[schema.id] = { ...schema, _status: 'UNKNOWN' };
    }
})();
