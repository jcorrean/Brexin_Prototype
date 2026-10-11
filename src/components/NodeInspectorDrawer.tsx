import React, { useState } from 'react';

interface ConnectionItem {
  name: string;
  role: string;
  sin: string;
  sub: string;
  icon: string;
  id: string;
}

interface TimelineItem {
  time: string;
  text: string;
  color: string;
}

interface ClabeItem {
  text: string;
  amount: string;
}

interface SuspectProfile {
  slug: string;
  name: string;
  avatarIcon: string;
  badge: string;
  idCode: string;
  legalStatus: string;
  risk: string;
  degree: string;
  betweenness: string;
  concurrency: string;
  exposure: string;
  fiscalAddress: string;
  fiscalPhone: string;
  clabes: ClabeItem[];
  connections: ConnectionItem[];
  timeline: TimelineItem[];
}

const SUSPECT_DATA: Record<string, SuspectProfile> = {
  'xavier-estrada': {
    slug: 'xavier-estrada',
    name: 'Xavier Estrada',
    avatarIcon: 'support_agent',
    badge: 'RANK #1 · BROKER',
    idCode: 'ID OPERATIVO: AS-0941-CDMX // RFC: EASX820419-HN8',
    legalStatus: 'IMPUTADO PRINCIPAL // ARTICULADOR DE FRAUDE SISTÉMICO',
    risk: '98.4%',
    degree: '0.985',
    betweenness: '0.412',
    concurrency: '23 Siniestros',
    exposure: '$29.8M',
    fiscalAddress: 'Av. Insurgentes Sur 1420, Piso 3, Of. 302, Benito Juárez, CDMX',
    fiscalPhone: '+52 (55) 8491-0941 // IP: 187.190.45.112',
    clabes: [
      { text: '012180004918274910 (BBVA) - Testaf: María Elena Dávila', amount: '$11,400,000 MXN' },
      { text: '014180009214710294 (Santander) - Testaf: Inmuebles Alpha SA', amount: '$8,250,000 MXN' },
    ],
    connections: [
      { name: 'Dr. Carlos Mendoza', role: 'Médico Evaluador // Vínculo recíproco ponderado w=19', sin: '18 siniestros', sub: 'Cruzados en 6 Cías', icon: 'medical_services', id: 'carlos-mendoza' },
      { name: 'Insurgentes Sur 1420', role: 'Domicilio Colusivo // w=18 conexiones de póliza', sin: '15 siniestros', sub: '14 reclamantes', icon: 'apartment', id: 'insurgentes-1420' },
      { name: 'Hospital Metropolitano', role: 'Clínica Emisora de Dictámenes Clínicos', sin: '8 siniestros', sub: 'Folios HME-99', icon: 'local_hospital', id: 'hospital-metropolitano' },
    ],
    timeline: [
      { time: '14-ENE-2026 10:14 UTC', text: 'Radicación simultánea de 4 siniestros graves en 4 aseguradoras distintas (Consorcio A, C, D, F) con idéntico reporte de colisión.', color: 'bg-[#ef4444]' },
      { time: '02-FEB-2026 15:30 UTC', text: 'Alerta pericial de coincidencia de IP: Mismo dispositivo MAC/IP tramita reclamaciones de indemnización para 12 reclamantes inconexos.', color: 'bg-[#43ffbb]' },
      { time: '28-FEB-2026 18:22 UTC', text: 'Desvío de cheques de liquidación judicial judicialmente emitidos a favor de terceros endosados a cuentas vinculadas al broker.', color: 'bg-[#00f0ff]' },
    ],
  },
  'carlos-mendoza': {
    slug: 'carlos-mendoza',
    name: 'Dr. Carlos Mendoza',
    avatarIcon: 'medical_services',
    badge: 'RANK #2 · MÉDICO',
    idCode: 'CÉDULA PROF: 8492014-M // RFC: MECA790114-K21',
    legalStatus: 'CO-AUTOR MATERIAL // FALSIFICACIÓN DE INFORMES CLÍNICOS',
    risk: '96.2%',
    degree: '0.962',
    betweenness: '0.389',
    concurrency: '21 Siniestros',
    exposure: '$27.4M',
    fiscalAddress: 'Consultorio Privado: Río Churubusco 410, Coyoacán, CDMX',
    fiscalPhone: '+52 (55) 5523-8819 // IP: 201.144.12.88',
    clabes: [
      { text: '002180701928419201 (Citibanamex) - Honorarios Clínicos No Registrados', amount: '$4,150,000 MXN' },
      { text: '072180002819401928 (Banorte) - Cuenta Mancomunada Sanatorio', amount: '$2,800,000 MXN' },
    ],
    connections: [
      { name: 'Xavier Estrada', role: 'Broker Promotor // Vínculo w=19', sin: '18 siniestros', sub: 'Comisiones cruzadas', icon: 'support_agent', id: 'xavier-estrada' },
      { name: 'Hospital Metropolitano', role: 'Centro Médico Emisor // Dictámenes 2025-2026', sin: '14 siniestros', sub: 'Certificados apócrifos', icon: 'local_hospital', id: 'hospital-metropolitano' },
      { name: 'Clínica La Salud', role: 'Centro Secundario // Emisión con 23 km desfase', sin: '7 siniestros', sub: 'Traumatología express', icon: 'local_hospital', id: 'hospital-metropolitano' },
    ],
    timeline: [
      { time: '14-ENE-2026 11:00 UTC', text: 'Firmó dictámenes de incapacidad permanente en 2 hospitales a 23 km de distancia exactamente a la misma hora.', color: 'bg-[#ef4444]' },
      { time: '20-ENE-2026 09:40 UTC', text: 'Recibió depósito interbancario SPEI directo de Xavier Estrada por concepto de consulta no declarada.', color: 'bg-[#43ffbb]' },
      { time: '11-MAR-2026 17:15 UTC', text: 'Colegio de Médicos no encuentra bitácora física de intervenciones quirúrgicas reclamadas.', color: 'bg-[#00f0ff]' },
    ],
  },
  'insurgentes-1420': {
    slug: 'insurgentes-1420',
    name: 'Insurgentes Sur 1420',
    avatarIcon: 'apartment',
    badge: 'RANK #3 · DOMICILIO FANTASMA',
    idCode: 'DOMICILIO FISCAL COMÚN // C.P. 03920, BENITO JUÁREZ, CDMX',
    legalStatus: 'EPICENTRO DE COLISIÓN DOMICILIARIA // OFICINA VIRTUAL DESOCUPADA',
    risk: '94.8%',
    degree: '0.824',
    betweenness: '0.298',
    concurrency: '18 Siniestros',
    exposure: '$22.9M',
    fiscalAddress: 'Av. Insurgentes Sur 1420, Actipan, Benito Juárez, 03920 CDMX',
    fiscalPhone: 'Centralita Virtual VoIP // Reenvío a línea móvil oculta',
    clabes: [
      { text: 'Cheques de liquidación judicial recibidos en buzón postal físico', amount: '18 Reclamaciones' },
      { text: 'Contrato de arrendamiento firmado con cédula de identidad apócrifa', amount: 'Sin inquilino real' },
    ],
    connections: [
      { name: 'Xavier Estrada', role: 'Contratante de oficina virtual', sin: '15 siniestros', sub: 'Firmante de correspondencia', icon: 'support_agent', id: 'xavier-estrada' },
      { name: 'Adriana Ibáñez', role: 'Beneficiaria con mismo domicilio declarado', sin: '7 siniestros', sub: 'Reclamaciones coincidentes', icon: 'person', id: 'carlos-mendoza' },
      { name: 'Dr. Carlos Mendoza', role: 'Dirección médica de correspondencia', sin: '9 siniestros', sub: 'Dictámenes entregados', icon: 'medical_services', id: 'carlos-mendoza' },
    ],
    timeline: [
      { time: '05-DIC-2025', text: 'Inspección judicial presencial constata oficina vacía bajo razón social fantasma sin personal ni mobiliario.', color: 'bg-[#ef4444]' },
      { time: '18-ENE-2026', text: 'Recepción concentrada de 11 notificaciones judiciales de pago de diversas aseguradoras.', color: 'bg-[#43ffbb]' },
      { time: '04-MAR-2026', text: 'Georreferenciación satelital confirma incompatibilidad de espacio con 14 pólizas de vivienda colectiva.', color: 'bg-[#00f0ff]' },
    ],
  },
  'hospital-metropolitano': {
    slug: 'hospital-metropolitano',
    name: 'Hospital Metropolitano',
    avatarIcon: 'local_hospital',
    badge: 'CLÍNICA EN COLUSIÓN',
    idCode: 'RFC: HME-091120-K18 // LICENCIA COFEPRIS: 14-092-CDMX',
    legalStatus: 'INSTITUCIÓN FACILITADORA // SELLOS Y FOLIOS VICIADOS',
    risk: '89.1%',
    degree: '0.742',
    betweenness: '0.245',
    concurrency: '15 Siniestros',
    exposure: '$17.6M',
    fiscalAddress: 'Calzada de Tlalpan 1890, Benito Juárez, CDMX',
    fiscalPhone: '+52 (55) 5674-0012 // Folios manuales sin sistema digital',
    clabes: [
      { text: '072180001948192041 (Banorte) - Servicios Médicos Metropolitano SA', amount: '$7,900,000 MXN' },
    ],
    connections: [
      { name: 'Dr. Carlos Mendoza', role: 'Médico Adscrito Simulado', sin: '14 siniestros', sub: 'Aval de cirugías dudosas', icon: 'medical_services', id: 'carlos-mendoza' },
      { name: 'Xavier Estrada', role: 'Canalizador de siniestros masivos', sin: '8 siniestros', sub: 'Convenio atípico', icon: 'support_agent', id: 'xavier-estrada' },
    ],
    timeline: [
      { time: '12-ENE-2026', text: 'Auditoría interna detecta duplicidad de números de folio de quirófano en 5 reclamaciones simultáneas.', color: 'bg-[#ef4444]' },
      { time: '15-FEB-2026', text: 'Falta de estudios radiológicos en archivo digital para respaldar incapacidades emitidas.', color: 'bg-[#43ffbb]' },
    ],
  },
};

interface NodeInspectorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeSlug: string;
  onSelectSlug: (slug: string) => void;
  onIsolateInGraph: (slug: string) => void;
}

export const NodeInspectorDrawer: React.FC<NodeInspectorDrawerProps> = ({
  isOpen,
  onClose,
  activeSlug,
  onSelectSlug,
  onIsolateInGraph,
}) => {
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [attached, setAttached] = useState(false);

  if (!isOpen) return null;

  const currentProfile = SUSPECT_DATA[activeSlug] || SUSPECT_DATA['xavier-estrada'];

  const handleExportIndividualPdf = () => {
    setPdfGenerating(true);
    setTimeout(() => {
      setPdfGenerating(false);
      const a = document.createElement('a');
      a.href = '#';
      a.download = `Ficha_Pericial_${currentProfile.slug.toUpperCase()}_Certificada.pdf`;
      // Feedback toast
    }, 1100);
  };

  const handleAttachEvidence = () => {
    setAttached(true);
    setTimeout(() => {
      setAttached(false);
    }, 2000);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-[#0b0e13]/80 backdrop-blur-sm transition-opacity duration-300 opacity-100"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        aria-label="Ficha de Inspección Forense en Detalle"
        className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-2xl bg-[#0b0e13] border-l border-[#3b494b]/30 shadow-2xl flex flex-col justify-between transform transition-transform duration-300 translate-x-0 overflow-hidden select-none"
      >
        {/* Header with Suspect Selection Pills & Close Button */}
        <div className="px-space-lg pt-space-md pb-space-sm bg-[#191c21] border-b border-[#3b494b]/30 flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-[#00f0ff]/20 border border-[#00f0ff]/40 flex items-center justify-center text-[#7df4ff]">
                <span className="material-symbols-outlined text-[18px]">biometrics</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-md text-headline-md text-[#dbfcff] font-bold tracking-tight">
                  Ficha de Inspección Forense en Detalle
                </span>
                <span className="font-code-dense text-[11px] text-[#849495]">
                  EVIDENCIA JUDICIAL // EXP. CONC-2026-X79A
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#93000a] text-[#ffd9dc] font-code-dense text-[10px] font-bold animate-pulse">
                OBJETIVO PRIORITARIO
              </span>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-[#1d2025] hover:bg-[#272a30] text-[#b9cacb] hover:text-[#e1e2ea] flex items-center justify-center transition-colors cursor-pointer"
                title="Cerrar Ficha (Esc)"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
          </div>

          {/* Quick Target Switcher Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
            <span className="font-code-dense text-[10px] text-[#849495] uppercase mr-1">Cambiar Nodo:</span>
            {[
              { slug: 'xavier-estrada', label: 'Xavier Estrada [AS-0941]' },
              { slug: 'carlos-mendoza', label: 'Dr. Carlos Mendoza [MED]' },
              { slug: 'insurgentes-1420', label: 'Insurgentes 1420 [DOM]' },
              { slug: 'hospital-metropolitano', label: 'Hosp. Metropolitano' },
            ].map((tab) => {
              const isSelected = activeSlug === tab.slug;
              return (
                <button
                  key={tab.slug}
                  type="button"
                  onClick={() => onSelectSlug(tab.slug)}
                  className={`px-2.5 py-1 rounded font-code-dense text-[11px] font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#00f0ff] text-[#002022] shadow-[0_0_8px_rgba(0,240,255,0.3)] font-semibold'
                      : 'bg-[#1d2025] text-[#b9cacb] hover:text-[#e1e2ea] hover:bg-[#272a30]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Drawer Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-space-lg flex flex-col gap-space-lg">
          {/* Node Identity Hero Card */}
          <div className="bg-[#191c21] rounded-xl p-space-md border border-[#3b494b]/30 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-[#ffb4ab]/10 blur-2xl pointer-events-none"></div>

            <div className="flex items-start justify-between gap-space-md">
              <div className="flex items-start gap-space-sm">
                <div className="w-12 h-12 rounded-xl bg-[#272a30] border border-[#3b494b]/40 flex items-center justify-center text-[#7df4ff] shadow-md">
                  <span className="material-symbols-outlined text-[28px]">{currentProfile.avatarIcon}</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-headline-lg text-headline-lg text-[#dbfcff] font-bold">
                      {currentProfile.name}
                    </h2>
                    <span className="px-2 py-0.5 rounded bg-[#93000a]/20 text-[#ffb4ab] font-code-dense text-[11px] font-bold border border-[#ffb4ab]/30">
                      {currentProfile.badge}
                    </span>
                  </div>
                  <span className="font-code-dense text-code-dense text-[#849495] mt-0.5">
                    {currentProfile.idCode}
                  </span>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#1d2025] text-[#ffd9dc] font-code-dense text-[10px] font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px] text-[#ffd9dc]">balance</span>
                      <span>{currentProfile.legalStatus}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className="font-label-sm text-label-sm text-[#849495] uppercase">Riesgo</span>
                <span className="font-headline-xl text-headline-xl font-extrabold text-[#ffb4ab] leading-tight">
                  {currentProfile.risk}
                </span>
                <span className="font-code-dense text-[10px] text-[#849495]">CRITICAL ANOMALY</span>
              </div>
            </div>

            {/* High-Resolution Centrality Scores Bar Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-space-md pt-space-sm border-t border-[#3b494b]/20">
              <div className="bg-[#0b0e13]/80 p-2 rounded flex flex-col border border-[#3b494b]/20">
                <span className="font-label-sm text-[10px] text-[#849495] uppercase">Degree Centrality</span>
                <span className="font-code-dense text-headline-md text-[#43ffbb] font-bold">
                  {currentProfile.degree}
                </span>
                <span className="font-code-dense text-[10px] text-[#b9cacb]">Percentil 99.8%</span>
              </div>
              <div className="bg-[#0b0e13]/80 p-2 rounded flex flex-col border border-[#3b494b]/20">
                <span className="font-label-sm text-[10px] text-[#849495] uppercase">Betweenness</span>
                <span className="font-code-dense text-headline-md text-[#7df4ff] font-bold">
                  {currentProfile.betweenness}
                </span>
                <span className="font-code-dense text-[10px] text-[#b9cacb]">Puente Crítico Máx</span>
              </div>
              <div className="bg-[#0b0e13]/80 p-2 rounded flex flex-col border border-[#3b494b]/20">
                <span className="font-label-sm text-[10px] text-[#849495] uppercase">Concurrencia</span>
                <span className="font-code-dense text-headline-md text-[#ffb4ab] font-bold">
                  {currentProfile.concurrency}
                </span>
                <span className="font-code-dense text-[10px] text-[#b9cacb]">57.5% de la red</span>
              </div>
              <div className="bg-[#0b0e13]/80 p-2 rounded flex flex-col border border-[#3b494b]/20">
                <span className="font-label-sm text-[10px] text-[#849495] uppercase">Exposición</span>
                <span className="font-code-dense text-headline-md text-[#ffd9dc] font-bold">
                  {currentProfile.exposure}
                </span>
                <span className="font-code-dense text-[10px] text-[#b9cacb]">MXN reclamados</span>
              </div>
            </div>
          </div>

          {/* Biometric & Fiscal Registry Section */}
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#7df4ff]">fingerprint</span>
                <span className="font-label-md text-label-md text-[#e1e2ea] font-semibold uppercase tracking-wider">
                  Registro Forense, Fiscal & Cuentas CLABE
                </span>
              </div>
              <span className="font-code-dense text-[10px] text-[#43ffbb]">VERIFICADO SAT / CNBV</span>
            </div>

            <div className="bg-[#191c21] rounded-lg p-space-sm grid grid-cols-1 md:grid-cols-2 gap-space-sm border border-[#3b494b]/20 font-code-dense text-code-dense">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-[#849495] uppercase">Domicilio Fiscal Vinculado</span>
                <span className="text-[#e1e2ea] font-medium">{currentProfile.fiscalAddress}</span>
                <span className="text-[10px] text-[#ffb4ab] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">warning</span>
                  Coincidencia con Epicentro Domiciliario Fantasma
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-[#849495] uppercase">Teléfono IP & Rastreo Digital</span>
                <span className="text-[#7df4ff] font-medium">{currentProfile.fiscalPhone}</span>
                <span className="text-[10px] text-[#43ffbb] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">check_circle</span>
                  Presente en 12 formularios de siniestro simultáneos
                </span>
              </div>

              <div className="flex flex-col gap-1 md:col-span-2 pt-1 border-t border-[#3b494b]/20">
                <span className="text-[10px] text-[#849495] uppercase">
                  Cuentas Bancarias CLABE Receptoras Identificadas
                </span>
                <div className="flex flex-col gap-1">
                  {currentProfile.clabes.map((c, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-[#1d2025] px-2 py-1 rounded border border-[#3b494b]/20"
                    >
                      <span className="text-[11px] text-[#e1e2ea]">{c.text}</span>
                      <span className="text-[#ffb4ab] text-[10px] font-bold">{c.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Topological Connectivity Breakdown */}
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#43ffbb]">hub</span>
                <span className="font-label-md text-label-md text-[#e1e2ea] font-semibold uppercase tracking-wider">
                  Topología de Vínculos Directos (Ego-Network)
                </span>
              </div>
              <span className="font-code-dense text-[10px] text-[#849495]">6 CONEXIONES DE ALTO IMPACTO</span>
            </div>

            <div className="flex flex-col gap-1.5">
              {currentProfile.connections.map((c, i) => (
                <div
                  key={i}
                  className="bg-[#191c21] hover:bg-[#1d2025] p-2.5 rounded-lg border border-[#3b494b]/20 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded bg-[#272a30] text-[#7df4ff] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]">{c.icon}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-body-sm font-semibold text-[#dbfcff]">{c.name}</span>
                      <span className="font-code-dense text-[10px] text-[#b9cacb]">{c.role}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-space-md text-right font-code-dense">
                    <div className="flex flex-col">
                      <span className="text-[#ffb4ab] font-bold text-[12px]">{c.sin}</span>
                      <span className="text-[10px] text-[#849495]">{c.sub}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onSelectSlug(c.id)}
                      className="px-2 py-1 rounded bg-[#272a30] hover:bg-[#00f0ff] hover:text-[#002022] text-[#7df4ff] text-[11px] transition-colors cursor-pointer"
                    >
                      Ver Ficha
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Evidentiary Timeline / Modus Operandi Log */}
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#ffd9dc]">history_edu</span>
                <span className="font-label-md text-label-md text-[#e1e2ea] font-semibold uppercase tracking-wider">
                  Cronología Probatoria & Modus Operandi
                </span>
              </div>
              <span className="font-code-dense text-[10px] text-[#849495]">3 EVENTOS CLAVE TRAZADOS</span>
            </div>

            <div className="relative pl-4 border-l-2 border-[#3b494b]/30 flex flex-col gap-space-sm ml-2 font-body-sm">
              {currentProfile.timeline.map((t, idx) => (
                <div key={idx} className="relative">
                  <div
                    className={`absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full ${t.color} ring-4 ring-[#0b0e13]`}
                  ></div>
                  <span className="font-code-dense text-[10px] text-[#849495]">{t.time}</span>
                  <p className="text-[#e1e2ea] text-body-sm font-medium mt-0.5">{t.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Command Actions inside the Drawer */}
        <div className="p-space-md bg-[#191c21] border-t border-[#3b494b]/30 flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onIsolateInGraph(currentProfile.slug)}
              className="px-space-sm py-2 rounded-lg bg-[#1d2025] hover:bg-[#272a30] text-[#43ffbb] font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#3b494b]/30"
            >
              <span className="material-symbols-outlined text-[18px]">filter_center_focus</span>
              <span>Aislar en Grafo</span>
            </button>
            <button
              type="button"
              onClick={handleAttachEvidence}
              className="px-space-sm py-2 rounded-lg bg-[#1d2025] hover:bg-[#272a30] text-[#7df4ff] font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#3b494b]/30"
            >
              <span className="material-symbols-outlined text-[18px]">
                {attached ? 'task_alt' : 'attach_file'}
              </span>
              <span>{attached ? 'Anexo Vinculado' : 'Adjuntar a Dictamen [ZIP]'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleExportIndividualPdf}
            disabled={pdfGenerating}
            className="w-full py-2.5 rounded-lg bg-[#00f0ff] text-[#002022] hover:bg-[#00dbe9] font-label-md text-label-md font-semibold flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(0,240,255,0.25)] transition-all cursor-pointer"
          >
            <span className={`material-symbols-outlined text-[18px] ${pdfGenerating ? 'animate-spin' : ''}`}>
              {pdfGenerating ? 'sync' : 'picture_as_pdf'}
            </span>
            <span>
              {pdfGenerating
                ? 'Generando Hash & Sellando PDF...'
                : 'Exportar Ficha Individual Pericial Certificada [.PDF]'}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};
