/**
 * MOCK ADAPTER v6.2.2 - ESCENARIO DE PRODUCCIÓN REAL
 * Datos de prueba basados en el flujo de Veta de Oro.
 */

export const MOCK_PROJECT_CONTEXT = {
    project: {
        id: "VETA-2024-089",
        name: "Residencia Altos del Valle",
        address: "CLL 123 #45-67, ENVIGADO",
        status: "INGENIERÍA_Y_DISEÑO"
    },
    client: {
        name: "Javier Rodriguez",
        phone: "+57 321 000 0000",
        nit: "900.123.456-1"
    }
};

export const MOCK_CATALOG = [
    { id: "M-COC-INF", nombre: "Módulo Cocina Inferior", categoria: "Mueblería", precio: 850000 },
    { id: "M-COC-SUP", nombre: "Módulo Cocina Superior", categoria: "Mueblería", precio: 620000 },
    { id: "H-HER-BLU", nombre: "Herraje Blum Aventos", categoria: "Herrajes", precio: 450000 },
    { id: "T-GRA-NAT", nombre: "Mesón Granito Natural", categoria: "Superficies", precio: 1200000 }
];

export const MOCK_3D_ASSETS = {
    "Cocina Principal": { 
        render: null, 
        skp: null,
        progress: 0 
    },
    "default": { 
        render: null, 
        skp: null, 
        progress: 0 
    }
};

export const MOCK_QUOTATION_DATA = {
    activeScenario: "sc-001",
    scenarios: [
        {
            uuid: "sc-001",
            name: "Propuesta Integral",
            spaces: [
                {
                    uuid: "sp-001",
                    etiqueta: "Cocina Principal",
                    subtotal: 12450000,
                    viewMode: "DESIGN_3D",
                    design: MOCK_3D_ASSETS["Cocina Principal"],
                    items_tecnicos: [
                        { uuid: "i-01", nombre: "Módulos Inferiores (Melamina 18mm)", subtotal: 4500000 },
                        { uuid: "i-02", nombre: "Puertas MDF Pintura Poliuretano", subtotal: 3200000 },
                        { uuid: "i-03", nombre: "Mesón Silestone Blanco Estelar", subtotal: 4750000 }
                    ],
                    requisitos_tecnicos: [
                        { uuid: "r-01", texto: "Punto hidráulico desplazado 15cm a la derecha" },
                        { uuid: "r-02", texto: "Refuerzo en muro para módulos superiores" }
                    ]
                }
            ]
        }
    ]
};
export const MOCK_FINANCE = {
    total: 12450000,
    abonos: 3735000,
    saldo: 8715000
};
