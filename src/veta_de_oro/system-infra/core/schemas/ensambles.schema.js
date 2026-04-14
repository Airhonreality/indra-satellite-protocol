/**
 * SCHEMA: Catálogo Modular — Ensambles (v1)
 * Subconjunto componible del catálogo. Cada ensamble
 * tiene precio calculado, no estático.
 */
(function() {
    const schema = {
        id: 'veta_ensambles_v1',
        version: '1.0.0',
        label: 'Catálogo Modular — Ensambles',
        target_provider: 'drive',
        fields: [
            { id: 'sku',                 label: 'SKU',                    type: 'TEXT'      },
            { id: 'descripcion',         label: 'Nombre del Ensamble',    type: 'TEXT'      },
            { id: 'categoria',           label: 'Categoría',              type: 'SELECT'    },
            { id: 'composicion_json',    label: 'Composición JSON',       type: 'LONG_TEXT' },
            { id: 'asset_imagen_id',     label: 'ID Asset Imagen',        type: 'TEXT'      },
            { id: 'asset_modelo3d_id',   label: 'ID Asset Modelo 3D',     type: 'TEXT'      },
            { id: 'medidas_json',        label: 'Medidas JSON',           type: 'LONG_TEXT' },
            { id: 'atributos',           label: 'Atributos Técnicos',     type: 'LONG_TEXT' },
            { id: 'activo',              label: 'Activo en Catálogo',     type: 'BOOLEAN'   },
            { id: 'created_at',          label: 'Fecha de Creación',      type: 'DATE'      },
            { id: 'updated_at',          label: 'Última Modificación',    type: 'DATE'      },
        ]
    };

    if (window.VETA_REGISTRY) {
        window.VETA_REGISTRY[schema.id] = { ...schema, _status: 'UNKNOWN' };
    }
})();
