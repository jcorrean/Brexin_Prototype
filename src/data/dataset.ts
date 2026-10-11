export interface GraphNode {
  id: string;
  name: string;
  type: 'SINIESTRO' | 'ASEGURADO' | 'MEDICO' | 'BENEFICIARIO' | 'ASESOR' | 'HOSPITAL' | 'DOMICILIO' | 'FUNERARIA' | 'ASEGURADORA';
  degree: number;
  cases: number;
  risk: 'CRÍTICO' | 'ALTO' | 'MEDIO' | 'BAJO';
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  radius?: number;
  idCode?: string;
  rfc?: string;
  betweenness?: number;
  eigen?: number;
  exposure?: string;
  clabes?: { text: string; amount: string }[];
  fiscalAddress?: string;
  fiscalPhone?: string;
  connections?: { name: string; role: string; sin: string; sub: string; icon: string; id: string }[];
  timeline?: { time: string; text: string; color: string }[];
  legalStatus?: string;
  badge?: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  weight: number;
  verb?: string;
  sourceNode?: GraphNode;
  targetNode?: GraphNode;
}

export const COLOR_MAP: Record<string, string> = {
  SINIESTRO: '#ef4444',
  ASEGURADO: '#3b82f6',
  MEDICO: '#f59e0b',
  BENEFICIARIO: '#22c55e',
  ASESOR: '#a855f7',
  HOSPITAL: '#14b8a6',
  DOMICILIO: '#94a3b8',
  FUNERARIA: '#f97316',
  ASEGURADORA: '#06b6d4',
};

export const ICON_MAP: Record<string, string> = {
  SINIESTRO: 'flag',
  ASEGURADO: 'person',
  MEDICO: 'medical_services',
  BENEFICIARIO: 'family_restroom',
  ASESOR: 'support_agent',
  HOSPITAL: 'local_hospital',
  DOMICILIO: 'home_pin',
  FUNERARIA: 'church',
  ASEGURADORA: 'shield',
};

export const RAW_NODES: GraphNode[] = [
  // Central Claims (Siniestros)
  { id: 'SIN-101', name: 'Siniestro 2026-081', type: 'SINIESTRO', degree: 14, cases: 14, risk: 'ALTO' },
  { id: 'SIN-102', name: 'Siniestro 2026-082', type: 'SINIESTRO', degree: 18, cases: 18, risk: 'CRÍTICO' },
  { id: 'SIN-103', name: 'Siniestro 2026-094', type: 'SINIESTRO', degree: 12, cases: 12, risk: 'MEDIO' },
  { id: 'SIN-104', name: 'Siniestro 2026-112', type: 'SINIESTRO', degree: 21, cases: 21, risk: 'CRÍTICO' },
  { id: 'SIN-105', name: 'Siniestro 2026-140', type: 'SINIESTRO', degree: 9, cases: 9, risk: 'MEDIO' },
  { id: 'SIN-106', name: 'Siniestro 2026-155', type: 'SINIESTRO', degree: 11, cases: 11, risk: 'MEDIO' },
  { id: 'SIN-107', name: 'Siniestro 2026-168', type: 'SINIESTRO', degree: 15, cases: 15, risk: 'ALTO' },
  { id: 'SIN-108', name: 'Siniestro 2026-192', type: 'SINIESTRO', degree: 17, cases: 17, risk: 'ALTO' },

  // Key Anomalous Hubs
  {
    id: 'MED-7492',
    name: 'Dr. Carlos Mendoza',
    type: 'MEDICO',
    degree: 96,
    cases: 21,
    risk: 'CRÍTICO',
    idCode: 'CÉDULA PROF: 8492014-M // RFC: MECA790114-K21',
    betweenness: 0.389,
    eigen: 0.871,
    exposure: '$27.4M',
    badge: 'RANK #2 · MÉDICO',
    legalStatus: 'CO-AUTOR MATERIAL // FALSIFICACIÓN DE INFORMES CLÍNICOS',
    fiscalAddress: 'Consultorio Privado: Río Churubusco 410, Coyoacán, CDMX',
    fiscalPhone: '+52 (55) 5523-8819 // IP: 201.144.12.88',
    clabes: [
      { text: '002180701928419201 (Citibanamex) - Honorarios Clínicos No Registrados', amount: '$4,150,000 MXN' },
      { text: '072180002819401928 (Banorte) - Cuenta Mancomunada Sanatorio', amount: '$2,800,000 MXN' },
    ],
    connections: [
      { name: 'Xavier Estrada', role: 'Broker Promotor // Vínculo w=19', sin: '18 siniestros', sub: 'Comisiones cruzadas', icon: 'support_agent', id: 'xavier-estrada' },
      { name: 'Hospital Metropolitano', role: 'Centro Médico Emisor // Dictámenes 2025-2026', sin: '14 siniestros', sub: 'Certificados apócrifos', icon: 'local_hospital', id: 'hospital-metropolitano' },
      { name: 'Clínica La Salud', role: 'Centro Secundario // Emisión con 23 km desfase', sin: '7 siniestros', sub: 'Traumatología express', icon: 'local_hospital', id: 'carlos-mendoza' },
    ],
    timeline: [
      { time: '14-ENE-2026 11:00 UTC', text: 'Firmó dictámenes de incapacidad permanente en 2 hospitales a 23 km de distancia exactamente a la misma hora.', color: 'bg-[#ef4444]' },
      { time: '20-ENE-2026 09:40 UTC', text: 'Recibió depósito interbancario SPEI directo de Xavier Estrada por concepto de consulta no declarada.', color: 'bg-[#43ffbb]' },
      { time: '11-MAR-2026 17:15 UTC', text: 'Colegio de Médicos no encuentra bitácora física de intervenciones quirúrgicas reclamadas.', color: 'bg-[#00f0ff]' },
    ],
  },
  {
    id: 'ASE-8812',
    name: 'Xavier Estrada',
    type: 'ASESOR',
    degree: 98,
    cases: 23,
    risk: 'CRÍTICO',
    idCode: 'ID OPERATIVO: AS-0941-CDMX // RFC: EASX820419-HN8',
    betweenness: 0.412,
    eigen: 0.894,
    exposure: '$29.8M',
    badge: 'RANK #1 · BROKER',
    legalStatus: 'IMPUTADO PRINCIPAL // ARTICULADOR DE FRAUDE SISTÉMICO',
    fiscalAddress: 'Av. Insurgentes Sur 1420, Piso 3, Of. 302, Benito Juárez, CDMX',
    fiscalPhone: '+52 (55) 8491-0941 // IP: 187.190.45.112',
    clabes: [
      { text: '012180004918274910 (BBVA) - Testaf: María Elena Dávila', amount: '$11,400,000 MXN' },
      { text: '014180009214710294 (Santander) - Testaf: Inmuebles Alpha SA', amount: '$8,250,000 MXN' },
    ],
    connections: [
      { name: 'Dr. Carlos Mendoza', role: 'Médico Evaluador // Vínculo ponderado w=19', sin: '18 siniestros', sub: 'Cruzados en 6 Cías', icon: 'medical_services', id: 'carlos-mendoza' },
      { name: 'Insurgentes Sur 1420', role: 'Domicilio Colusivo // w=18 conexiones', sin: '15 siniestros', sub: '14 reclamantes', icon: 'apartment', id: 'insurgentes-1420' },
      { name: 'Hospital Metropolitano', role: 'Clínica Emisora de Dictámenes Clínicos', sin: '8 siniestros', sub: 'Folios HME-99', icon: 'local_hospital', id: 'hospital-metropolitano' },
    ],
    timeline: [
      { time: '14-ENE-2026 10:14 UTC', text: 'Radicación simultánea de 4 siniestros graves en 4 aseguradoras distintas con idéntico reporte de colisión.', color: 'bg-[#ef4444]' },
      { time: '02-FEB-2026 15:30 UTC', text: 'Alerta pericial de coincidencia de IP: Mismo dispositivo tramita expedientes de 12 reclamantes inconexos.', color: 'bg-[#43ffbb]' },
      { time: '28-FEB-2026 18:22 UTC', text: 'Desvío de cheques de liquidación judicial emitidos a favor de terceros endosados al broker.', color: 'bg-[#00f0ff]' },
    ],
  },
  {
    id: 'DOM-0142',
    name: 'Av. Insurgentes Sur 1420',
    type: 'DOMICILIO',
    degree: 82,
    cases: 18,
    risk: 'ALTO',
    idCode: 'DOMICILIO FISCAL COMÚN // C.P. 03920, BENITO JUÁREZ, CDMX',
    betweenness: 0.298,
    eigen: 0.745,
    exposure: '$22.9M',
    badge: 'RANK #3 · DOMICILIO FANTASMA',
    legalStatus: 'EPICENTRO DE COLISIÓN DOMICILIARIA // OFICINA VIRTUAL DESOCUPADA',
    fiscalAddress: 'Av. Insurgentes Sur 1420, Actipan, Benito Juárez, 03920 CDMX',
    fiscalPhone: 'Centralita Virtual VoIP // Reenvío a línea móvil oculta',
    clabes: [
      { text: 'Cheques de liquidación judicial recibidos en buzón postal físico', amount: '18 Reclamaciones' },
      { text: 'Contrato de arrendamiento firmado con cédula de identidad apócrifa', amount: 'Sin inquilino real' },
    ],
    connections: [
      { name: 'Xavier Estrada', role: 'Contratante de oficina virtual', sin: '15 siniestros', sub: 'Firmante de correspondencia', icon: 'support_agent', id: 'xavier-estrada' },
      { name: 'Adriana Ibáñez', role: 'Beneficiaria con mismo domicilio declarado', sin: '7 siniestros', sub: 'Reclamaciones coincidentes', icon: 'person', id: 'adriana-ibanez' },
      { name: 'Dr. Carlos Mendoza', role: 'Dirección médica de correspondencia', sin: '9 siniestros', sub: 'Dictámenes entregados', icon: 'medical_services', id: 'carlos-mendoza' },
    ],
    timeline: [
      { time: '05-DIC-2025', text: 'Inspección judicial presencial constata oficina vacía bajo razón social fantasma sin personal ni mobiliario.', color: 'bg-[#ef4444]' },
      { time: '18-ENE-2026', text: 'Recepción concentrada de 11 notificaciones judiciales de pago de diversas aseguradoras.', color: 'bg-[#43ffbb]' },
      { time: '04-MAR-2026', text: 'Georreferenciación satelital confirma incompatibilidad de espacio con 14 pólizas de vivienda colectiva.', color: 'bg-[#00f0ff]' },
    ],
  },

  // Clinical & Infrastructure
  {
    id: 'HOS-302',
    name: 'Hospital Ángeles Metropolitano',
    type: 'HOSPITAL',
    degree: 52,
    cases: 14,
    risk: 'ALTO',
    idCode: 'CLUES: DF-SSA-018 // RFC: HME-091120-K18',
    betweenness: 0.145,
    eigen: 0.512,
    exposure: '$17.6M',
    badge: 'CLÍNICA EN COLUSIÓN',
    legalStatus: 'INSTITUCIÓN FACILITADORA // SELLOS Y FOLIOS VICIADOS',
    fiscalAddress: 'Calzada de Tlalpan 1890, Benito Juárez, CDMX',
    fiscalPhone: '+52 (55) 5674-0012 // Folios manuales sin sistema digital',
    clabes: [{ text: '072180001948192041 (Banorte) - Servicios Médicos Metropolitano SA', amount: '$7,900,000 MXN' }],
    connections: [
      { name: 'Dr. Carlos Mendoza', role: 'Médico Adscrito Simulado', sin: '14 siniestros', sub: 'Aval de cirugías dudosas', icon: 'medical_services', id: 'carlos-mendoza' },
      { name: 'Xavier Estrada', role: 'Canalizador de siniestros masivos', sin: '8 siniestros', sub: 'Convenio atípico', icon: 'support_agent', id: 'xavier-estrada' },
    ],
    timeline: [
      { time: '12-ENE-2026', text: 'Auditoría interna detecta duplicidad de números de folio de quirófano en 5 reclamaciones simultáneas.', color: 'bg-[#ef4444]' },
      { time: '15-FEB-2026', text: 'Falta de estudios radiológicos en archivo digital para respaldar incapacidades emitidas.', color: 'bg-[#43ffbb]' },
    ],
  },
  { id: 'HOS-308', name: 'Clínica Quirúrgica Roma', type: 'HOSPITAL', degree: 40, cases: 10, risk: 'MEDIO' },
  { id: 'FUN-901', name: 'Funeraria Gayosso Central', type: 'FUNERARIA', degree: 28, cases: 8, risk: 'MEDIO' },
  { id: 'FUN-209', name: 'Jardines Espirituales', type: 'FUNERARIA', degree: 44, cases: 7, risk: 'MEDIO', betweenness: 0.118, eigen: 0.470 },
  { id: 'FUN-881', name: 'Gayosso Sullivan', type: 'FUNERARIA', degree: 42, cases: 7, risk: 'MEDIO', betweenness: 0.098, eigen: 0.435 },
  { id: 'ASG-001', name: 'Grupo Asegurador Alpha', type: 'ASEGURADORA', degree: 60, cases: 25, risk: 'MEDIO' },

  // Insured, Beneficiaries & Staff
  { id: 'USR-201', name: 'Mariana Fuentes', type: 'ASEGURADO', degree: 34, cases: 6, risk: 'MEDIO' },
  { id: 'USR-202', name: 'Rodrigo Benítez', type: 'ASEGURADO', degree: 42, cases: 8, risk: 'ALTO' },
  { id: 'USR-203', name: 'Valeria Moncada', type: 'ASEGURADO', degree: 29, cases: 5, risk: 'BAJO' },
  { id: 'USR-8911', name: 'Adriana Ibáñez', type: 'BENEFICIARIO', degree: 39, cases: 7, risk: 'ALTO', betweenness: 0.082, eigen: 0.410 },
  { id: 'USR-8406', name: 'David Flores', type: 'ASEGURADO', degree: 38, cases: 6, risk: 'MEDIO', betweenness: 0.075, eigen: 0.395 },
  { id: 'BEN-501', name: 'Fernando Fuentes', type: 'BENEFICIARIO', degree: 31, cases: 7, risk: 'ALTO' },
  { id: 'BEN-502', name: 'Sofía Benítez', type: 'BENEFICIARIO', degree: 36, cases: 9, risk: 'ALTO' },
  { id: 'BEN-503', name: 'Mauricio Paz', type: 'BENEFICIARIO', degree: 20, cases: 4, risk: 'BAJO' },
  { id: 'MED-9021', name: 'Dra. Elena Ramos', type: 'MEDICO', degree: 38, cases: 7, risk: 'MEDIO' },
  { id: 'ASE-4102', name: 'Clara Del Valle', type: 'ASESOR', degree: 30, cases: 6, risk: 'BAJO' },
  { id: 'DOM-5510', name: 'Col. Juárez Poniente 44', type: 'DOMICILIO', degree: 22, cases: 4, risk: 'BAJO' },
];

export const RAW_EDGES: GraphEdge[] = [
  { source: 'MED-7492', target: 'SIN-101', weight: 4 },
  { source: 'MED-7492', target: 'SIN-102', weight: 6 },
  { source: 'MED-7492', target: 'SIN-104', weight: 8 },
  { source: 'MED-7492', target: 'HOS-302', weight: 7 },
  { source: 'ASE-8812', target: 'SIN-101', weight: 5 },
  { source: 'ASE-8812', target: 'SIN-102', weight: 5 },
  { source: 'ASE-8812', target: 'SIN-104', weight: 7 },
  { source: 'ASE-8812', target: 'MED-7492', weight: 6 },
  { source: 'DOM-0142', target: 'SIN-102', weight: 5 },
  { source: 'DOM-0142', target: 'SIN-104', weight: 6 },
  { source: 'DOM-0142', target: 'USR-202', weight: 4 },
  { source: 'DOM-0142', target: 'BEN-502', weight: 4 },
  { source: 'HOS-302', target: 'SIN-104', weight: 5 },
  { source: 'HOS-302', target: 'SIN-101', weight: 4 },
  { source: 'HOS-308', target: 'SIN-103', weight: 3 },
  { source: 'HOS-308', target: 'MED-9021', weight: 4 },
  { source: 'MED-9021', target: 'SIN-103', weight: 3 },
  { source: 'MED-9021', target: 'SIN-105', weight: 2 },
  { source: 'FUN-901', target: 'SIN-104', weight: 4 },
  { source: 'FUN-209', target: 'SIN-102', weight: 4 },
  { source: 'FUN-881', target: 'SIN-101', weight: 4 },
  { source: 'ASG-001', target: 'SIN-101', weight: 3 },
  { source: 'ASG-001', target: 'SIN-102', weight: 3 },
  { source: 'ASG-001', target: 'SIN-104', weight: 3 },
  { source: 'USR-201', target: 'SIN-101', weight: 3 },
  { source: 'USR-201', target: 'BEN-501', weight: 4 },
  { source: 'USR-202', target: 'SIN-102', weight: 4 },
  { source: 'USR-202', target: 'SIN-104', weight: 5 },
  { source: 'USR-202', target: 'BEN-502', weight: 5 },
  { source: 'USR-203', target: 'SIN-105', weight: 2 },
  { source: 'USR-203', target: 'BEN-503', weight: 2 },
  { source: 'USR-8911', target: 'SIN-102', weight: 4 },
  { source: 'USR-8911', target: 'DOM-0142', weight: 5 },
  { source: 'USR-8406', target: 'SIN-101', weight: 3 },
  { source: 'USR-8406', target: 'ASE-8812', weight: 4 },
  { source: 'ASE-4102', target: 'SIN-105', weight: 2 },
  { source: 'DOM-5510', target: 'USR-201', weight: 2 },
  { source: 'SIN-106', target: 'MED-7492', weight: 3 },
  { source: 'SIN-107', target: 'ASE-8812', weight: 4 },
  { source: 'SIN-108', target: 'HOS-302', weight: 4 },
];

export const CSV_SAMPLE_ROWS = [
  { siniestro: 'SIN_0001', entidad: 'Dr. Carlos Mendoza', tipo: 'MÉDICO', aseguradora: 'Aseguradora A', concurrencia: 4 },
  { siniestro: 'SIN_0001', entidad: 'Xavier Estrada', tipo: 'ASESOR', aseguradora: 'Aseguradora A', concurrencia: 2 },
  { siniestro: 'SIN_0002', entidad: 'Dr. Carlos Mendoza', tipo: 'MÉDICO', aseguradora: 'Aseguradora B', concurrencia: 7 },
  { siniestro: 'SIN_0002', entidad: 'Clínica San Gabriel', tipo: 'HOSPITAL', aseguradora: 'Aseguradora B', concurrencia: 3 },
  { siniestro: 'SIN_0003', entidad: 'Laura Peñaloza', tipo: 'BENEFICIARIO', aseguradora: 'Aseguradora C', concurrencia: 1 },
  { siniestro: 'SIN_0003', entidad: 'Xavier Estrada', tipo: 'ASESOR', aseguradora: 'Aseguradora C', concurrencia: 5 },
  { siniestro: 'SIN_0004', entidad: 'Av. Insurgentes Sur 1420', tipo: 'DOMICILIO', aseguradora: 'Aseguradora D', concurrencia: 6 },
  { siniestro: 'SIN_0004', entidad: 'Funeraria San Rafael', tipo: 'FUNERARIA', aseguradora: 'Aseguradora D', concurrencia: 4 },
  { siniestro: 'SIN_0005', entidad: 'Adriana Ibáñez', tipo: 'BENEFICIARIO', aseguradora: 'Aseguradora E', concurrencia: 5 },
  { siniestro: 'SIN_0005', entidad: 'David Flores', tipo: 'ASEGURADO', aseguradora: 'Aseguradora F', concurrencia: 3 },
];

export const LEADERBOARD_DATA = [
  {
    rank: '01',
    name: 'Xavier Estrada',
    category: 'ASESOR',
    idCode: 'ID: AS-0941-CDMX',
    degree: 0.985,
    betweenness: 0.412,
    eigen: 0.894,
    concurrency: '23 sin.',
    riskFlag: 'HIGH BRIDGE BROKER',
    riskClass: 'error',
    slug: 'xavier-estrada',
    indicatorColor: '#ffb4ab',
  },
  {
    rank: '02',
    name: 'Dr. Carlos Mendoza',
    category: 'MÉDICO',
    idCode: 'CED: 8492014-M',
    degree: 0.962,
    betweenness: 0.389,
    eigen: 0.871,
    concurrency: '21 sin.',
    riskFlag: 'HUB CONCURRENCIA',
    riskClass: 'amber',
    slug: 'carlos-mendoza',
    indicatorColor: '#f59e0b',
  },
  {
    rank: '03',
    name: 'Av. Insurgentes Sur 1420',
    category: 'DOMICILIO',
    idCode: 'Bto. Juárez, CDMX',
    degree: 0.824,
    betweenness: 0.298,
    eigen: 0.745,
    concurrency: '18 sin.',
    riskFlag: 'SHELL ADDRESS',
    riskClass: 'error',
    slug: 'insurgentes-1420',
    indicatorColor: '#ffb4ab',
  },
  {
    rank: '04',
    name: 'Hospital Metropolitano',
    category: 'HOSPITAL',
    idCode: 'CLUES: DF-SSA-018',
    degree: 0.485,
    betweenness: 0.145,
    eigen: 0.512,
    concurrency: '8 sin.',
    riskFlag: 'FOCAL CLINIC',
    riskClass: 'primary',
    slug: 'hospital-metropolitano',
    indicatorColor: '#00f0ff',
  },
  {
    rank: '05',
    name: 'Jardines Espirituales',
    category: 'FUNERARIA',
    idCode: 'REG: FUN-209-DF',
    degree: 0.442,
    betweenness: 0.118,
    eigen: 0.470,
    concurrency: '7 sin.',
    riskFlag: 'RECURRENT CLAIM',
    riskClass: 'amber',
    slug: 'jardines-espirituales',
    indicatorColor: '#f59e0b',
  },
  {
    rank: '06',
    name: 'Gayosso Sullivan',
    category: 'FUNERARIA',
    idCode: 'REG: FUN-881-DF',
    degree: 0.421,
    betweenness: 0.098,
    eigen: 0.435,
    concurrency: '7 sin.',
    riskFlag: 'CLUSTER HUB',
    riskClass: 'amber',
    slug: 'gayosso-sullivan',
    indicatorColor: '#f59e0b',
  },
  {
    rank: '07',
    name: 'Adriana Ibáñez',
    category: 'ASEGURADO',
    idCode: 'RFC: IA790214-KJ2',
    degree: 0.395,
    betweenness: 0.082,
    eigen: 0.410,
    concurrency: '6 sin.',
    riskFlag: 'MULTI-POLICY REC',
    riskClass: 'primary-dim',
    slug: 'adriana-ibanez',
    indicatorColor: '#00dbe9',
  },
  {
    rank: '08',
    name: 'David Flores',
    category: 'ASEGURADO',
    idCode: 'RFC: FD840611-LP8',
    degree: 0.380,
    betweenness: 0.075,
    eigen: 0.395,
    concurrency: '6 sin.',
    riskFlag: 'MULTI-POLICY REC',
    riskClass: 'primary-dim',
    slug: 'david-flores',
    indicatorColor: '#00dbe9',
  },
];
