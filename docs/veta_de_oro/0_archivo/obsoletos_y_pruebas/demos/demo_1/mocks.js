/**
 * MOCKS.JS — Subsistema Agnóstico de Datos
 * =========================================
 * Simula una base de datos de backend con:
 *   - 15 clientes residenciales / comerciales
 *   - 35 productos del catálogo técnico (5 categorías)
 *   - Estado inicial parametrizado de la propuesta
 *
 * SCHEMA DE CLIENTE:
 * { id, nombre, empresa?, tipo, ubicacion, barrio, ciudad, contacto, email, notas? }
 *
 * SCHEMA DE PRODUCTO:
 * { sku, descripcion, precio_unitario, unidad, categoria, subtipo?, activo }
 */

// ═══════════════════════════════════════════
//  TABLA: CLIENTES (15 registros)
// ═══════════════════════════════════════════
export const MOCK_CLIENTES = [
  {
    id: 'cli_001',
    nombre: 'Álvaro García Ríos',
    tipo: 'residencial',
    ubicacion: 'Cra. 34 #12A-50, Apto 803',
    barrio: 'Altos del Poblado',
    ciudad: 'Medellín',
    contacto: '+57 300 412 8810',
    email: 'alvarogarcia@gmail.com',
    notas: 'Proyecto cocina + lavandería. Cliente VIP.'
  },
  {
    id: 'cli_002',
    nombre: 'Martha Lucía Ospina',
    tipo: 'residencial',
    ubicacion: 'Km 14 Vía Las Palmas, Casa 22',
    barrio: 'Llanogrande',
    ciudad: 'Rionegro',
    contacto: '+57 311 987 4523',
    email: 'marthaosp@hotmail.com',
    notas: 'Clóset principal y baño suite.'
  },
  {
    id: 'cli_003',
    nombre: 'Andrés Echeverry Gómez',
    tipo: 'residencial',
    ubicacion: 'Cl. 50 Sur #48-30, Casa 5',
    barrio: 'La Estrella',
    ciudad: 'Medellín',
    contacto: '+57 322 654 0091',
    email: 'aecheverryg@outlook.com',
    notas: 'Cocina integral con isla.'
  },
  {
    id: 'cli_004',
    nombre: 'Isabella Restrepo V.',
    tipo: 'residencial',
    ubicacion: 'Cra. 42 #3 Sur-81, Apto 501',
    barrio: 'El Tesoro',
    ciudad: 'Medellín',
    contacto: '+57 304 231 7760',
    email: 'isabellarv@gmail.com',
    notas: 'Proyecto integral: cocina, vestier y baño principal.'
  },
  {
    id: 'cli_005',
    nombre: 'Carlos Mejía Londoño',
    tipo: 'residencial',
    ubicacion: 'Cl. 10 #38-15, Casa 1',
    barrio: 'Provenza',
    ciudad: 'Medellín',
    contacto: '+57 313 500 3388',
    email: 'carlmej@icloud.com'
  },
  {
    id: 'cli_006',
    nombre: 'Valentina Soto Arango',
    tipo: 'residencial',
    ubicacion: 'Cra 25A #1 Sur-45, Apto 1102',
    barrio: 'Ciudad del Río',
    ciudad: 'Medellín',
    contacto: '+57 316 783 2240',
    email: 'vsotoa@gmail.com',
    notas: 'Primera reunión pendiente. Referido por cli_001.'
  },
  {
    id: 'cli_007',
    nombre: 'Grupo Inmobiliario Vera S.A.',
    empresa: 'Grupo Vera S.A.',
    tipo: 'comercial',
    ubicacion: 'Cl. 7 #43A-100, Of. 602',
    barrio: 'El Centro',
    ciudad: 'Medellín',
    contacto: '+57 604 448 1200',
    email: 'proyectos@grupovera.co',
    notas: 'Dotación de 8 apartamentos tipo A. Proyecto Torre Serena.'
  },
  {
    id: 'cli_008',
    nombre: 'Sofía Jaramillo Cano',
    tipo: 'residencial',
    ubicacion: 'Cra. 69 #34-28, Casa 9',
    barrio: 'Laureles',
    ciudad: 'Medellín',
    contacto: '+57 317 392 8801',
    email: 'sofijara@gmail.com'
  },
  {
    id: 'cli_009',
    nombre: 'Restaurante D\'Origen',
    empresa: 'D\'Origen Gastronomía SAS',
    tipo: 'comercial',
    ubicacion: 'Cl. 9 #37-30, Local 1',
    barrio: 'El Poblado',
    ciudad: 'Medellín',
    contacto: '+57 312 404 9910',
    email: 'admin@dorigen.com.co',
    notas: 'Cocina industrial. Requiere materiales con certificación NSF.'
  },
  {
    id: 'cli_010',
    nombre: 'Juliana Montoya Hincapié',
    tipo: 'residencial',
    ubicacion: 'Cra. 80 #52D-25, Apto 302',
    barrio: 'Belén',
    ciudad: 'Medellín',
    contacto: '+57 302 881 4450',
    email: 'julimontoya@gmail.com',
    notas: 'Remodelación total: cocina, sala comedor y zona de trabajo.'
  },
  {
    id: 'cli_011',
    nombre: 'Felipe Arboleda Zapata',
    tipo: 'residencial',
    ubicacion: 'Cl. 76 #55-90, Casa Campestre',
    barrio: 'Las Brisas',
    ciudad: 'La Ceja',
    contacto: '+57 321 774 6632',
    email: 'farbz@hotmail.com'
  },
  {
    id: 'cli_012',
    nombre: 'Daniela Correa Palacio',
    tipo: 'residencial',
    ubicacion: 'Cra. 50 #19-60, Apto 1504',
    barrio: 'Manila',
    ciudad: 'Medellín',
    contacto: '+57 310 558 2211',
    email: 'danielacp@gmail.com',
    notas: 'Cocina en L con mesón de cuarzo. Cliente muy específico con el diseño.'
  },
  {
    id: 'cli_013',
    nombre: 'Clínica Dental Sonrisa',
    empresa: 'Inversiones Dental SAS',
    tipo: 'comercial',
    ubicacion: 'Cl. 35 #81-43, Cons. 301',
    barrio: 'Calasanz',
    ciudad: 'Medellín',
    contacto: '+57 604 411 0022',
    email: 'gerencia@sonrisaclinica.com',
    notas: 'Muebles clínicos para 4 consultorios. Materiales antibacteriales.'
  },
  {
    id: 'cli_014',
    nombre: 'José Luis Vélez Castaño',
    tipo: 'residencial',
    ubicacion: 'Km 8 Vía Marinilla, Lote 14',
    barrio: 'El Santuario',
    ciudad: 'Marinilla',
    contacto: '+57 318 663 4477',
    email: 'jlvelezc@gmail.com'
  },
  {
    id: 'cli_015',
    nombre: 'Camila Duque Betancur',
    tipo: 'residencial',
    ubicacion: 'Cra. 43A #18-111, Apto 204',
    barrio: 'El Astillero',
    ciudad: 'Medellín',
    contacto: '+57 315 120 9900',
    email: 'camiladuq@gmail.com',
    notas: 'Proyecto pendiente de planos. Diseñadora de interiores, requiere propuesta detallada.'
  }
];

// ═══════════════════════════════════════════
//  TABLA: CATÁLOGO DE PRODUCTOS (35 registros)
//  CATEGORÍAS: Carpintería | Superficies | Accesorios | Iluminación | Mano de Obra
// ═══════════════════════════════════════════
export const MOCK_CATALOGO = [

  // --- CARPINTERIA (12 ítems) ---
  { sku: 'CAR-MOD-INF-01', descripcion: 'Módulo Inferior Base (60x70cm)', precio_unitario: 780000,  unidad: 'und', categoria: 'Carpintería', activo: true },
  { sku: 'CAR-MOD-INF-02', descripcion: 'Módulo Inferior Cajonera 3T', precio_unitario: 1100000, unidad: 'und', categoria: 'Carpintería', activo: true },
  { sku: 'CAR-MOD-INF-03', descripcion: 'Módulo Inferior Esquinero Giratorio', precio_unitario: 1450000, unidad: 'und', categoria: 'Carpintería', activo: true },
  { sku: 'CAR-MOD-SUP-01', descripcion: 'Módulo Superior Aéreo (60x35cm)', precio_unitario: 580000,  unidad: 'und', categoria: 'Carpintería', activo: true },
  { sku: 'CAR-MOD-SUP-02', descripcion: 'Módulo Superior con Marco Vitrina', precio_unitario: 890000,  unidad: 'und', categoria: 'Carpintería', activo: true },
  { sku: 'CAR-MOD-TOR-01', descripcion: 'Torre Despensera Alta (40x200cm)', precio_unitario: 1950000, unidad: 'und', categoria: 'Carpintería', activo: true },
  { sku: 'CAR-ISL-01',     descripcion: 'Isla Central Modular (120x90cm)', precio_unitario: 2400000, unidad: 'und', categoria: 'Carpintería', activo: true },
  { sku: 'CAR-CLO-01',     descripcion: 'Módulo Clóset Colgar + Repisas', precio_unitario: 1200000, unidad: 'und', categoria: 'Carpintería', activo: true },
  { sku: 'CAR-CLO-02',     descripcion: 'Módulo Clóset Cajonera Completa', precio_unitario: 1380000, unidad: 'und', categoria: 'Carpintería', activo: true },
  { sku: 'CAR-LAV-01',     descripcion: 'Mueble Lavandería (Tándem 60cm)', precio_unitario: 890000,  unidad: 'und', categoria: 'Carpintería', activo: true },
  { sku: 'CAR-BAN-01',     descripcion: 'Mueble Vanity Baño (80cm)', precio_unitario: 1100000, unidad: 'und', categoria: 'Carpintería', activo: true },
  { sku: 'CAR-BAN-02',     descripcion: 'Espejo con Caja Embutida (60x80cm)', precio_unitario: 650000,  unidad: 'und', categoria: 'Carpintería', activo: true },

  // --- SUPERFICIES (8 ítems) ---
  { sku: 'SUP-QTZ-01', descripcion: 'Mesón Cuarzo Silestone (m²)', precio_unitario: 980000,  unidad: 'm²', categoria: 'Superficies', activo: true },
  { sku: 'SUP-SIN-01', descripcion: 'Mesón Piedra Sinterizada Neolith (m²)', precio_unitario: 1450000, unidad: 'm²', categoria: 'Superficies', activo: true },
  { sku: 'SUP-SIN-02', descripcion: 'Mesón Dekton Ultra-Compact (m²)', precio_unitario: 1680000, unidad: 'm²', categoria: 'Superficies', activo: true },
  { sku: 'SUP-LAM-01', descripcion: 'Mesón Laminado HPL Ergon (m²)', precio_unitario: 480000,  unidad: 'm²', categoria: 'Superficies', activo: true },
  { sku: 'SUP-MAD-01', descripcion: 'Mesón Madera Maciza Teca (m²)', precio_unitario: 1100000, unidad: 'm²', categoria: 'Superficies', activo: true },
  { sku: 'SUP-GRS-01', descripcion: 'Revestimiento Porcelanico Rectificado (m²)', precio_unitario: 280000,  unidad: 'm²', categoria: 'Superficies', activo: true },
  { sku: 'SUP-VDR-01', descripcion: 'Salpicadero Vidrio Templado (m²)', precio_unitario: 520000,  unidad: 'm²', categoria: 'Superficies', activo: true },
  { sku: 'SUP-ACR-01', descripcion: 'Frente de Cocina Acrílico Alto Brillo (m²)', precio_unitario: 340000,  unidad: 'm²', categoria: 'Superficies', activo: true },

  // --- ACCESORIOS (9 ítems) ---
  { sku: 'ACC-HER-CIE-01', descripcion: 'Bisagra Cierre Lento Grass (par)', precio_unitario: 42000,   unidad: 'par', categoria: 'Accesorios', activo: true },
  { sku: 'ACC-HER-COR-01', descripcion: 'Corredera Full Extension Telescópica (par)', precio_unitario: 115000,  unidad: 'par', categoria: 'Accesorios', activo: true },
  { sku: 'ACC-HER-ELE-01', descripcion: 'Apertura Eléctrica Push-To-Open', precio_unitario: 280000,  unidad: 'und', categoria: 'Accesorios', activo: true },
  { sku: 'ACC-ORG-BAN-01', descripcion: 'Organizador de Cajón Bambú (60cm)', precio_unitario: 185000,  unidad: 'und', categoria: 'Accesorios', activo: true },
  { sku: 'ACC-ORG-CLO-01', descripcion: 'Set Organizadores Clóset (Módulo Completo)', precio_unitario: 320000,  unidad: 'set', categoria: 'Accesorios', activo: true },
  { sku: 'ACC-ALZ-01',     descripcion: 'Sistema Alzadores Mueble Superior (par)', precio_unitario: 390000,  unidad: 'par', categoria: 'Accesorios', activo: true },
  { sku: 'ACC-CES-GIR-01', descripcion: 'Cesto Giratorio Susan (Esquinero)', precio_unitario: 450000,  unidad: 'und', categoria: 'Accesorios', activo: true },
  { sku: 'ACC-SOC-ALU-01', descripcion: 'Zócalo Aluminio Anodizado (m)', precio_unitario: 48000,   unidad: 'm',   categoria: 'Accesorios', activo: true },
  { sku: 'ACC-TIR-01',     descripcion: 'Jaladera Acero Inoxidable (und)', precio_unitario: 35000,   unidad: 'und', categoria: 'Accesorios', activo: true },

  // --- ILUMINACIÓN (3 ítems) ---
  { sku: 'LUZ-LED-PER-01', descripcion: 'Perfil LED Empotrado Aluminio (m)',     precio_unitario: 145000,  unidad: 'm',   categoria: 'Iluminación', activo: true },
  { sku: 'LUZ-LED-PUN-01', descripcion: 'Punto de Luz Spot Empotrado GU10',      precio_unitario: 95000,   unidad: 'und', categoria: 'Iluminación', activo: true },
  { sku: 'LUZ-TRA-01',     descripcion: 'Tira LED por Sensor Movimiento (m)',    precio_unitario: 110000,  unidad: 'm',   categoria: 'Iluminación', activo: true },

  // --- MANO DE OBRA (3 ítems) ---
  { sku: 'MO-INS-01', descripcion: 'Instalación por Módulo (und)', precio_unitario: 180000,  unidad: 'und', categoria: 'Mano de Obra', activo: true },
  { sku: 'MO-LEV-01', descripcion: 'Levantamiento y Planos Técnicos (global)', precio_unitario: 350000,  unidad: 'gbl', categoria: 'Mano de Obra', activo: true },
  { sku: 'MO-DES-01', descripcion: 'Desmonte y Demolición de Muebles Existentes', precio_unitario: 280000,  unidad: 'gbl', categoria: 'Mano de Obra', activo: true }
];

// ═══════════════════════════════════════════
//  ESTADO INICIAL DE UNA PROPUESTA
// ═══════════════════════════════════════════
export const ESTADO_INICIAL_PROPUESTA = {
  metadatos: {
    propuesta_id: `PRP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`,
    estado: 'borrador',
    creado_el: new Date().toISOString(),
    version: '1.2.0'
  },
  contexto_cliente: {
    uid: null,
    nombre_completo: '',
    empresa: null,
    tipo: null,
    canal_contacto: 'whatsapp',
    ubicacion_proyecto: '',
    ciudad: ''
  },
  configuracion: {
    espacios: [],
    variantes: [
       { id: 'v_base', etiqueta: 'Base (Estándar)', delta_porcentaje: 1.0, color: '#b5a99a' }
       // El usuario agregará más aquí
    ]
  },
  homeostasis_financiera: {
    moneda: 'COP',
    total_base: 0
  }
};

// ═══════════════════════════════════════════
//  HELPERS DE CONSULTA (API-like)
// ═══════════════════════════════════════════

/** Buscar cliente por ID */
export const buscarCliente = (id) => MOCK_CLIENTES.find(c => c.id === id) ?? null;

/** Obtener productos activos por categoría */
export const productsPorCategoria = () =>
  MOCK_CATALOGO.filter(p => p.activo).reduce((acc, prod) => {
    if (!acc[prod.categoria]) acc[prod.categoria] = [];
    acc[prod.categoria].push(prod);
    return acc;
  }, {});

/** Buscar producto por SKU */
export const buscarProducto = (sku) => MOCK_CATALOGO.find(p => p.sku === sku) ?? null;
