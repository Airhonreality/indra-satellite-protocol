/**
 * MOCKS.JS — Subsistema Agnóstico de Datos (v21.0)
 */
export const MOCK_CLIENTES = [
  { id: 'cli_001', nombre: 'Álvaro García Ríos', tipo: 'residencial', contacto: '+57 300 412 8810', email: 'alvarogarcia@gmail.com' },
  { id: 'cli_002', nombre: 'Martha Lucía Ospina', tipo: 'residencial', contacto: '+57 311 987 4523', email: 'marthaosp@hotmail.com' },
  { id: 'cli_003', nombre: 'Andrés Echeverry Gómez', tipo: 'residencial', contacto: '+57 322 654 0091', email: 'aecheverryg@outlook.com' }
];

export const MOCK_CATALOGO = [
  { sku: 'CAR-MOD-INF-01', descripcion: 'Módulo Inferior Base (60x70cm)', precio_unitario: 780000, unidad: 'und', categoria: 'Carpintería', activo: true },
  { sku: 'CAR-MOD-INF-02', descripcion: 'Módulo Inferior Cajonera 3T', precio_unitario: 1100000, unidad: 'und', categoria: 'Carpintería', activo: true },
  { sku: 'SUP-QTZ-01', descripcion: 'Mesón Cuarzo Silestone (m²)', precio_unitario: 980000, unidad: 'm²', categoria: 'Superficies', activo: true },
  { sku: 'SUP-SIN-01', descripcion: 'Mesón Piedra Sinterizada Neolith (m²)', precio_unitario: 1450000, unidad: 'm²', categoria: 'Superficies', activo: true },
  { sku: 'ACC-HER-CIE-01', descripcion: 'Bisagra Cierre Lento Grass (par)', precio_unitario: 42000, unidad: 'par', categoria: 'Accesorios', activo: true },
  { sku: 'MO-INS-01', descripcion: 'Instalación por Módulo (und)', precio_unitario: 180000, unidad: 'und', categoria: 'Mano de Obra', activo: true }
];
