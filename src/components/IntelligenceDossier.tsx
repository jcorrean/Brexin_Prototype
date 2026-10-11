import React, { useState } from 'react';

interface IntelligenceDossierProps {
  onOpenInspector: (slug: string) => void;
  onLocateInCanvas: (nodeId: string) => void;
}

export const IntelligenceDossier: React.FC<IntelligenceDossierProps> = ({
  onOpenInspector,
  onLocateInCanvas,
}) => {
  const [subgraphMode, setSubgraphMode] = useState<'k-core' | 'louvain' | 'bridges'>('k-core');
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [hashCopied, setHashCopied] = useState(false);
  const [watermarkActive, setWatermarkActive] = useState(true);
  const [recalculatingIndices, setRecalculatingIndices] = useState(false);
  const [indicesSuccess, setIndicesSuccess] = useState(false);

  // Checkbox configuration state
  const [configChecks, setConfigChecks] = useState({
    centrality: true,
    louvain: true,
    edgeList: true,
    ipGeocoding: false,
  });

  const sha256Hash = '9b8f2c694a10df3e8e19b8849c21aa5c0247fa8e';

  const copyHashToClipboard = () => {
    navigator.clipboard?.writeText(sha256Hash);
    setHashCopied(true);
    setTimeout(() => setHashCopied(false), 2000);
  };

  const handleExportPdf = () => {
    setPdfGenerating(true);
    setTimeout(() => {
      setPdfGenerating(false);
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 2500);
    }, 1200);
  };

  const handleRegenerateIndices = () => {
    setRecalculatingIndices(true);
    setTimeout(() => {
      setRecalculatingIndices(false);
      setIndicesSuccess(true);
      setTimeout(() => setIndicesSuccess(false), 2000);
    }, 800);
  };

  const downloadGephi = () => {
    const content = `<?xml version="1.0" encoding="UTF-8"?><graphml xmlns="http://graphml.graphdrawing.org/xmlns"><graph id="G" edgedefault="undirected"><node id="Xavier_Estrada"/><node id="Dr_Carlos_Mendoza"/><node id="Insurgentes_1420"/><edge source="Xavier_Estrada" target="Dr_Carlos_Mendoza"/></graph></graphml>`;
    const blob = new Blob([content], { type: 'application/xml' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'Dossier_2026_X79A_Graph.graphml';
    a.click();
  };

  const downloadCypher = () => {
    const cypher = `CREATE (x:Broker {name: 'Xavier Estrada', id: 'AS-0941', risk: 0.985})\nCREATE (m:Doctor {name: 'Dr. Carlos Mendoza', id: 'MED-7492', risk: 0.962})\nCREATE (d:Address {street: 'Av. Insurgentes Sur 1420', risk: 0.824})\nCREATE (x)-[:COLLUDES_WITH {claims: 18, weight: 19}]->(m)\nCREATE (x)-[:OPERATES_AT {claims: 15, weight: 18}]->(d);`;
    const blob = new Blob([cypher], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'Dossier_2026_X79A_Queries.cql';
    a.click();
  };

  return (
    <div className="flex flex-col w-full text-[#e1e2ea] bg-[#111319] min-h-screen select-none">
      {/* Top Forensic Breadcrumb & Telemetry Ticker */}
      <div className="w-full bg-[#0b0e13] px-space-lg py-space-xs flex flex-wrap items-center justify-between gap-space-sm border-b border-[#3b494b]/30">
        <div className="flex items-center gap-space-sm flex-wrap">
          <span className="font-code-dense text-code-dense text-[#43ffbb] flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#43ffbb] animate-pulse"></span>
            ENCRYPTION: AES-256-GCM
          </span>
          <span className="text-[#32353b] font-code-dense text-code-dense">•</span>
          <span className="font-code-dense text-code-dense text-[#b9cacb]">SHA-256 HASH:</span>
          <span className="font-code-dense text-code-dense text-[#dbfcff] font-medium tracking-wide">
            {sha256Hash}
          </span>
          <button
            type="button"
            onClick={copyHashToClipboard}
            className="px-space-xs py-0.5 rounded bg-[#1d2025] hover:bg-[#272a30] text-[#e1e2ea] text-code-dense transition-all flex items-center gap-1 cursor-pointer border border-[#3b494b]/20"
            title="Copy Hash"
          >
            <span className="material-symbols-outlined text-[12px]">content_copy</span>
            <span className="font-code-dense text-[10px]">{hashCopied ? 'COPIED!' : 'COPY'}</span>
          </button>
        </div>

        <div className="flex items-center gap-space-md">
          <div className="flex items-center gap-1">
            <span className="font-label-sm text-label-sm uppercase text-[#849495]">Custody Protocol:</span>
            <span className="font-code-dense text-code-dense text-[#43ffbb] font-semibold">
              ISO/IEC 27037 VALIDATED
            </span>
          </div>
          <span className="text-[#32353b] font-code-dense text-code-dense">•</span>
          <span className="font-code-dense text-code-dense text-[#b9cacb]">TIMESTAMP: 2026-03-31 16:42:19 UTC</span>
        </div>
      </div>

      {/* Main Dossier Container */}
      <div className="w-full p-space-md lg:p-space-lg flex flex-col gap-space-lg">
        {/* Section 1: Executive Dossier Header & Command Actions */}
        <div className="w-full bg-[#0b0e13] rounded-xl p-space-lg shadow-xl relative overflow-hidden border border-[#3b494b]/30">
          {/* Ambient Glow Behind Status */}
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-[#ffb4ab]/10 blur-3xl pointer-events-none"></div>
          <div className="absolute -left-16 -bottom-16 w-80 h-80 rounded-full bg-[#00f0ff]/5 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col xl:flex-row xl:items-start justify-between gap-space-lg">
            {/* Title & Metadata */}
            <div className="flex flex-col gap-space-sm max-w-4xl">
              <div className="flex items-center gap-space-sm flex-wrap">
                <span className="px-space-sm py-0.5 rounded bg-[#93000a] text-[#ffd9dc] font-code-dense text-label-sm font-semibold tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-[#ffd9dc]">warning</span>
                  CONFIDENTIAL // FORENSIC AUDIT READY
                </span>
                <span className="px-space-sm py-0.5 rounded bg-[#272a30] text-[#7df4ff] font-code-dense text-label-sm border border-[#00f0ff]/20">
                  DOSSIER ID: DOSSIER-2026-X79A
                </span>
                <span className="px-space-sm py-0.5 rounded bg-[#1d2025] text-[#43ffbb] font-code-dense text-label-sm border border-[#43ffbb]/20">
                  JURISDICTION: CDMX FEDERAL 1ª INSTANCIA
                </span>
              </div>

              <div className="flex flex-col">
                <span className="font-code-dense text-label-sm text-[#849495] uppercase tracking-wider">
                  EXPEDIENTE PERICIAL Y DICTAMEN TÉCNICO DE CONCURRENCIA
                </span>
                <h1 className="font-headline-xl text-headline-xl text-[#dbfcff] tracking-tight font-bold">
                  Red de Concurrencia de Siniestros & Fraude Sistémico
                </h1>
                <p className="font-body-md text-body-md text-[#b9cacb] mt-1">
                  Informe pericial forense automatizado sobre la topología de vínculos ilícitos, colusión
                  médico-aseguradora y epicentros de concurrencia patrimonial extraídos de{' '}
                  <code className="font-code-dense text-[#7df4ff] bg-[#1d2025] px-1 py-0.5 rounded">
                    Siniestros_Concurrencia_2026.csv
                  </code>
                  .
                </p>
              </div>

              {/* Ingestion Metrics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs mt-space-sm">
                <div className="bg-[#191c21] p-space-sm rounded flex flex-col border border-[#3b494b]/20">
                  <span className="font-label-sm text-label-sm text-[#849495] uppercase">Reclamaciones</span>
                  <span className="font-headline-md text-headline-md text-[#dbfcff] font-bold">40 Siniestros</span>
                  <span className="font-code-dense text-code-dense text-[#b9cacb]">Concurrencia inter-empresa</span>
                </div>
                <div className="bg-[#191c21] p-space-sm rounded flex flex-col border border-[#3b494b]/20">
                  <span className="font-label-sm text-label-sm text-[#849495] uppercase">Entidades Mapeadas</span>
                  <span className="font-headline-md text-headline-md text-[#43ffbb] font-bold">99 Nodos</span>
                  <span className="font-code-dense text-code-dense text-[#b9cacb]">14 médicos / 8 brokers</span>
                </div>
                <div className="bg-[#191c21] p-space-sm rounded flex flex-col border border-[#3b494b]/20">
                  <span className="font-label-sm text-label-sm text-[#849495] uppercase">Aristas Transversales</span>
                  <span className="font-headline-md text-headline-md text-[#dbfcff] font-bold">320 Vínculos</span>
                  <span className="font-code-dense text-code-dense text-[#b9cacb]">Peso ponderado promedio 3.4</span>
                </div>
                <div className="bg-[#191c21] p-space-sm rounded flex flex-col border border-[#3b494b]/20">
                  <span className="font-label-sm text-label-sm text-[#849495] uppercase">Aseguradoras Afectadas</span>
                  <span className="font-headline-md text-headline-md text-[#ffd9dc] font-bold">6 Cías</span>
                  <span className="font-code-dense text-code-dense text-[#b9cacb]">Consorcio A, B, C, D, E, F</span>
                </div>
              </div>
            </div>

            {/* Export Action Matrix */}
            <div className="flex flex-col gap-space-sm min-w-[280px]">
              <span className="font-label-sm text-label-sm text-[#849495] uppercase tracking-wider">
                Acciones Judiciales & Exportación
              </span>
              <button
                type="button"
                onClick={handleExportPdf}
                disabled={pdfGenerating}
                className="w-full flex items-center justify-between px-space-md py-space-sm rounded-lg bg-[#00f0ff] text-[#002022] font-label-md text-label-md font-semibold hover:bg-[#00dbe9] transition-all shadow-lg hover:shadow-cyan-500/25 cursor-pointer"
              >
                <span className="flex items-center gap-space-xs">
                  <span className={`material-symbols-outlined text-[18px] ${pdfGenerating ? 'animate-spin' : ''}`}>
                    {pdfGenerating ? 'sync' : 'gavel'}
                  </span>
                  <span>
                    {pdfGenerating
                      ? 'Compilando Hash & Sellando...'
                      : pdfSuccess
                      ? 'PDF Descargado // SHA Validado'
                      : 'Export Signed Forensic PDF'}
                  </span>
                </span>
                <span className="font-code-dense text-code-dense uppercase bg-[#0b0e13]/30 px-1 rounded text-[#002022]">
                  OFICIAL
                </span>
              </button>

              <div className="grid grid-cols-2 gap-space-xs">
                <button
                  type="button"
                  onClick={downloadGephi}
                  className="flex items-center justify-center gap-1 px-space-sm py-2 rounded bg-[#1d2025] hover:bg-[#272a30] text-[#e1e2ea] text-label-md font-label-md transition-colors cursor-pointer border border-[#3b494b]/20"
                  title="Export GraphML for Gephi visualization"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#43ffbb]">hub</span>
                  <span>Gephi [.GRAPHML]</span>
                </button>
                <button
                  type="button"
                  onClick={downloadCypher}
                  className="flex items-center justify-center gap-1 px-space-sm py-2 rounded bg-[#1d2025] hover:bg-[#272a30] text-[#e1e2ea] text-label-md font-label-md transition-colors cursor-pointer border border-[#3b494b]/20"
                  title="Export Cypher query dump for Neo4j"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#dbfcff]">terminal</span>
                  <span>Cypher [.CQL]</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  alert('Compilando paquete judicial: Contiene SHA-256 hashes, actas periciales y CSVs de aristas.');
                }}
                className="w-full flex items-center justify-center gap-space-xs px-space-md py-2 rounded bg-[#191c21] hover:bg-[#272a30] text-[#b9cacb] hover:text-[#e1e2ea] text-label-md font-label-md transition-colors cursor-pointer border border-[#3b494b]/20"
              >
                <span className="material-symbols-outlined text-[16px] text-[#ffd9dc]">folder_zip</span>
                <span>Court Evidence Pack [.ZIP + Hashes]</span>
              </button>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-space-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={watermarkActive}
                    onChange={(e) => setWatermarkActive(e.target.checked)}
                    className="w-3.5 h-3.5 rounded bg-[#0b0e13] accent-[#00f0ff] cursor-pointer"
                  />
                  <span className="font-code-dense text-code-dense text-[#b9cacb]">Watermark: JUZGADO 14</span>
                </label>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="font-code-dense text-code-dense text-[#dbfcff] hover:underline cursor-pointer flex items-center gap-0.5"
                >
                  <span className="material-symbols-outlined text-[12px]">print</span>
                  <span>Previsualizar</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Executive Threat Index & Collusion Exposure Metric Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
          {/* High-Impact Risk Gauge Card */}
          <div className="lg:col-span-4 bg-[#0b0e13] rounded-xl p-space-lg flex flex-col justify-between shadow-md relative overflow-hidden border border-[#3b494b]/30">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-[#849495] uppercase tracking-wider">
                  Índice Sintético de Riesgo de Colusión
                </span>
                <span className="font-headline-md text-headline-md text-[#ffb4ab] font-bold flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[#ffb4ab] text-[20px]">local_fire_department</span>
                  CRITICAL THREAT RING
                </span>
              </div>
              <span className="font-code-dense text-code-dense px-2 py-0.5 rounded bg-[#93000a] text-[#ffd9dc] font-bold">
                TIER 1
              </span>
            </div>

            {/* Metric Display & Visual SVG Ring */}
            <div className="my-space-md flex items-center justify-center gap-space-lg">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#272a30"
                    strokeWidth="8"
                  />
                  {/* 94.8% of circumference 2 * PI * 42 = 263.89 -> stroke-dashoffset = 13.72 */}
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#ffb4ab"
                    strokeWidth="8"
                    strokeDasharray="263.89"
                    strokeDashoffset="13.72"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="font-headline-xl text-headline-xl font-bold text-[#e1e2ea] leading-none">
                    94.8
                  </span>
                  <span className="font-code-dense text-code-dense text-[#849495]">/ 100 PTS</span>
                </div>
              </div>

              <div className="flex flex-col gap-space-xs font-code-dense text-code-dense">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#ffb4ab]"></span>
                  <span className="text-[#b9cacb]">
                    Concurrencia: <b className="text-[#e1e2ea]">98.2%</b>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#ffb4ab]"></span>
                  <span className="text-[#b9cacb]">
                    Centralidad: <b className="text-[#e1e2ea]">91.4%</b>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#43ffbb]"></span>
                  <span className="text-[#b9cacb]">
                    Divergencia: <b className="text-[#e1e2ea]">89.0%</b>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00f0ff]"></span>
                  <span className="text-[#b9cacb]">
                    Falsedad IP: <b className="text-[#e1e2ea]">96.7%</b>
                  </span>
                </div>
              </div>
            </div>

            {/* Simulated Fracture Callout */}
            <div className="bg-[#191c21] p-space-sm rounded-lg flex items-center justify-between border border-[#3b494b]/20">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[18px] text-[#43ffbb]">alt_route</span>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-[#43ffbb] font-semibold">
                    Fractura de Red Simulada
                  </span>
                  <span className="font-code-dense text-code-dense text-[#b9cacb]">
                    Neutralizando 3 Nodos Articulación
                  </span>
                </div>
              </div>
              <span className="font-headline-md text-headline-md text-[#43ffbb] font-bold">68.4%</span>
            </div>
          </div>

          {/* Financial Exposure & Narrative */}
          <div className="lg:col-span-8 bg-[#0b0e13] rounded-xl p-space-lg flex flex-col justify-between shadow-md border border-[#3b494b]/30">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 pb-space-sm">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[#dbfcff] text-[20px]">account_balance</span>
                  <span className="font-headline-md text-headline-md text-[#e1e2ea] font-semibold">
                    Dictamen Cuantitativo de Exposición Patrimonial
                  </span>
                </div>
                <span className="font-code-dense text-code-dense text-[#b9cacb] bg-[#1d2025] px-2 py-0.5 rounded border border-[#3b494b]/20">
                  PERIODO: 2024-Q3 A 2026-Q1
                </span>
              </div>

              {/* Exposure Numbers Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm my-space-sm">
                <div className="bg-[#191c21] p-space-md rounded-lg border border-[#3b494b]/20">
                  <span className="font-label-sm text-label-sm text-[#849495] uppercase">
                    Monto Total Reclamado en Colusión
                  </span>
                  <div className="font-headline-xl text-headline-xl text-[#ffb4ab] font-extrabold mt-0.5">
                    $42,850,000 <span className="text-headline-md text-[#ffb4ab]/80 font-normal">MXN</span>
                  </div>
                  <span className="font-code-dense text-code-dense text-[#b9cacb]">Sumatoria de 40 reclamaciones</span>
                </div>
                <div className="bg-[#191c21] p-space-md rounded-lg border border-[#3b494b]/20">
                  <span className="font-label-sm text-label-sm text-[#849495] uppercase">
                    Monto Preventivo Contenido
                  </span>
                  <div className="font-headline-xl text-headline-xl text-[#43ffbb] font-extrabold mt-0.5">
                    $27,410,000 <span className="text-headline-md text-[#43ffbb]/80 font-normal">MXN</span>
                  </div>
                  <span className="font-code-dense text-code-dense text-[#b9cacb]">
                    Liquidaciones bloqueadas judicialmente
                  </span>
                </div>
                <div className="bg-[#191c21] p-space-md rounded-lg border border-[#3b494b]/20">
                  <span className="font-label-sm text-label-sm text-[#849495] uppercase">
                    Pagos Indebidos Ya Dispersados
                  </span>
                  <div className="font-headline-xl text-headline-xl text-[#ffd9dc] font-extrabold mt-0.5">
                    $15,440,000 <span className="text-headline-md text-[#ffd9dc]/80 font-normal">MXN</span>
                  </div>
                  <span className="font-code-dense text-code-dense text-[#b9cacb]">Objetivo de acción de repetición</span>
                </div>
              </div>

              {/* Findings Bulleted List */}
              <div className="flex flex-col gap-space-xs mt-space-sm">
                <span className="font-label-sm text-label-sm text-[#849495] uppercase tracking-wider">
                  Hallazgos Periciales Irrefutables
                </span>
                <div className="bg-[#1d2025] p-space-sm rounded-lg flex items-start gap-space-sm border border-[#3b494b]/20">
                  <span className="material-symbols-outlined text-[#7df4ff] text-[18px] mt-0.5">share_location</span>
                  <p className="font-body-sm text-body-sm text-[#e1e2ea]">
                    <b className="text-[#7df4ff]">Epicentro Geográfico Sintético:</b> 18 de las 40 reclamaciones
                    (45.0%) registran idéntico domicilio fiscal en{' '}
                    <span className="font-code-dense text-[#43ffbb]">
                      Av. Insurgentes Sur 1420, Benito Juárez, CDMX
                    </span>
                    , a pesar de involucrar a 14 reclamantes presuntamente inconexos sin lazos consanguíneos
                    reportados.
                  </p>
                </div>
                <div className="bg-[#1d2025] p-space-sm rounded-lg flex items-start gap-space-sm border border-[#3b494b]/20">
                  <span className="material-symbols-outlined text-[#43ffbb] text-[18px] mt-0.5">verified_user</span>
                  <p className="font-body-sm text-body-sm text-[#e1e2ea]">
                    <b className="text-[#43ffbb]">Monopolio de Validación Médica:</b> El dictaminador{' '}
                    <span className="font-code-dense text-[#43ffbb]">Dr. Carlos Mendoza</span> avaló 21 siniestros
                    ortopédicos graves, firmando diagnósticos presuntamente en dos hospitales distintos (
                    <code className="font-code-dense text-[#7df4ff]">Hospital Metropolitano</code> y{' '}
                    <code className="font-code-dense text-[#7df4ff]">Clínica La Salud</code>) en la misma hora con 23 km
                    de distancia geográfica.
                  </p>
                </div>
                <div className="bg-[#1d2025] p-space-sm rounded-lg flex items-start gap-space-sm border border-[#3b494b]/20">
                  <span className="material-symbols-outlined text-[#ffd9dc] text-[18px] mt-0.5">sync_alt</span>
                  <p className="font-body-sm text-body-sm text-[#e1e2ea]">
                    <b className="text-[#ffd9dc]">Puente Estructural Broker:</b> El intermediario{' '}
                    <span className="font-code-dense text-[#ffd9dc]">Xavier Estrada (AS-0941)</span> ostenta la métrica
                    de betweenness más alta del grafo (<code className="font-code-dense text-[#7df4ff]">0.412</code>),
                    canalizando pólizas distribuidas en 6 aseguradoras competidoras para evadir alarmas de concurrencia
                    interna.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-space-sm flex items-center justify-between text-code-dense font-code-dense text-[#849495] border-t border-[#3b494b]/20 mt-space-sm">
              <span>ALGORITMO DETECCIÓN: LOUVAIN COMMUNITY v4 + BRANDES BETWEENNESS</span>
              <span className="text-[#43ffbb]">CONFIABILIDAD PERICIAL: 99.4%</span>
            </div>
          </div>
        </div>

        {/* Section 3: Deep-Dive Suspect Profiles (Evidence Cards) */}
        <div className="flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-[#43ffbb] text-[22px]">badge</span>
              <h2 className="font-headline-md text-headline-md text-[#e1e2ea] font-semibold">
                Objetivos de Neutralización & Fichas Periciales
              </h2>
            </div>
            <span className="font-code-dense text-code-dense text-[#849495]">
              TOP-3 NODOS DE MÁXIMA CRITICIDAD ESTRUCTURAL
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
            {/* Suspect 1: Xavier Estrada */}
            <div className="bg-[#0b0e13] rounded-xl p-space-lg flex flex-col justify-between shadow-md relative overflow-hidden group hover:bg-[#191c21] transition-all border border-[#3b494b]/30 hover:border-[#00f0ff]/40">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ffb4ab] via-[#ffd9dc] to-[#ffb4ab]"></div>
              <div className="flex flex-col gap-space-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-space-xs">
                    <div className="w-10 h-10 rounded-lg bg-[#272a30] flex items-center justify-center text-[#7df4ff]">
                      <span className="material-symbols-outlined text-[24px]">support_agent</span>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <span className="font-headline-md text-headline-md text-[#dbfcff] font-bold">
                          Xavier Estrada
                        </span>
                        <span className="w-2 h-2 rounded-full bg-[#ffb4ab] animate-pulse"></span>
                      </div>
                      <span className="font-code-dense text-code-dense text-[#849495]">
                        ASESOR / BROKER · ID: AS-0941-CDMX
                      </span>
                    </div>
                  </div>
                  <span className="px-space-xs py-0.5 rounded bg-[#93000a]/20 text-[#ffb4ab] font-code-dense text-label-sm font-bold border border-[#ffb4ab]/30">
                    RANK #1
                  </span>
                </div>

                <div className="bg-[#272a30] px-space-sm py-1 rounded flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-[#849495]">Rol Criminológico:</span>
                  <span className="font-code-dense text-code-dense text-[#ffd9dc] font-semibold">
                    PUENTE ESTRUCTURAL / BROKER
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1 bg-[#1d2025] p-space-xs rounded">
                  <div className="flex flex-col text-center">
                    <span className="font-label-sm text-label-sm text-[#849495]">Degree</span>
                    <span className="font-code-dense text-label-md text-[#43ffbb] font-bold">0.985</span>
                  </div>
                  <div className="flex flex-col text-center">
                    <span className="font-label-sm text-label-sm text-[#849495]">Betweenness</span>
                    <span className="font-code-dense text-label-md text-[#7df4ff] font-bold">0.412</span>
                  </div>
                  <div className="flex flex-col text-center">
                    <span className="font-label-sm text-label-sm text-[#849495]">Concurrencia</span>
                    <span className="font-code-dense text-label-md text-[#ffb4ab] font-bold">23 Siniestros</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 text-body-sm font-body-sm text-[#b9cacb]">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[#7df4ff] text-[14px] mt-0.5">check_circle</span>
                    <span>
                      Intermedió reclamos cruzados en <b>6 aseguradoras distintas</b> sin informar duplicidad de
                      amparos.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[#7df4ff] text-[14px] mt-0.5">check_circle</span>
                    <span>Coordinó la cobranza de indemnizaciones hacia 3 cuentas beneficiarias testaferros.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[#7df4ff] text-[14px] mt-0.5">check_circle</span>
                    <span>Coincidencia de número telefónico IP en 12 formularios digitales simultáneos.</span>
                  </div>
                </div>
              </div>

              <div className="pt-space-md mt-space-sm flex items-center justify-between border-t border-[#3b494b]/20">
                <span className="font-code-dense text-code-dense text-[#849495]">DELITO: FRAUDE MAQUINADO</span>
                <button
                  type="button"
                  onClick={() => onOpenInspector('xavier-estrada')}
                  className="px-2 py-1 rounded bg-[#00f0ff]/10 hover:bg-[#00f0ff] text-[#dbfcff] hover:text-[#002022] font-label-sm text-label-sm transition-all cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">visibility</span>
                  <span>Inspeccionar Nodo</span>
                </button>
              </div>
            </div>

            {/* Suspect 2: Dr. Carlos Mendoza */}
            <div className="bg-[#0b0e13] rounded-xl p-space-lg flex flex-col justify-between shadow-md relative overflow-hidden group hover:bg-[#191c21] transition-all border border-[#3b494b]/30 hover:border-[#43ffbb]/40">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#43ffbb] via-[#00f0ff] to-[#43ffbb]"></div>
              <div className="flex flex-col gap-space-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-space-xs">
                    <div className="w-10 h-10 rounded-lg bg-[#272a30] flex items-center justify-center text-[#43ffbb]">
                      <span className="material-symbols-outlined text-[24px]">medical_services</span>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <span className="font-headline-md text-headline-md text-[#dbfcff] font-bold">
                          Dr. Carlos Mendoza
                        </span>
                        <span className="w-2 h-2 rounded-full bg-[#43ffbb]"></span>
                      </div>
                      <span className="font-code-dense text-code-dense text-[#849495]">
                        MÉDICO PERITO · CÉD: 8492014-M
                      </span>
                    </div>
                  </div>
                  <span className="px-space-xs py-0.5 rounded bg-[#93000a]/20 text-[#ffb4ab] font-code-dense text-label-sm font-bold border border-[#ffb4ab]/30">
                    RANK #2
                  </span>
                </div>

                <div className="bg-[#272a30] px-space-sm py-1 rounded flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-[#849495]">Rol Criminológico:</span>
                  <span className="font-code-dense text-code-dense text-[#43ffbb] font-semibold">
                    VALIDADOR CLÍNICO SISTÉMICO
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1 bg-[#1d2025] p-space-xs rounded">
                  <div className="flex flex-col text-center">
                    <span className="font-label-sm text-label-sm text-[#849495]">Degree</span>
                    <span className="font-code-dense text-label-md text-[#43ffbb] font-bold">0.962</span>
                  </div>
                  <div className="flex flex-col text-center">
                    <span className="font-label-sm text-label-sm text-[#849495]">Betweenness</span>
                    <span className="font-code-dense text-label-md text-[#7df4ff] font-bold">0.389</span>
                  </div>
                  <div className="flex flex-col text-center">
                    <span className="font-label-sm text-label-sm text-[#849495]">Concurrencia</span>
                    <span className="font-code-dense text-label-md text-[#ffb4ab] font-bold">21 Siniestros</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 text-body-sm font-body-sm text-[#b9cacb]">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[#43ffbb] text-[14px] mt-0.5">check_circle</span>
                    <span>
                      Firmante exclusivo en dictámenes de secuelas músculo-esqueléticas idénticas en redacción.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[#43ffbb] text-[14px] mt-0.5">check_circle</span>
                    <span>Emisión simultánea de certificados en dos sanatorios a 23 km de distancia.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[#43ffbb] text-[14px] mt-0.5">check_circle</span>
                    <span>Recibió transferencias directas por honorarios atípicos no reportados al SAT.</span>
                  </div>
                </div>
              </div>

              <div className="pt-space-md mt-space-sm flex items-center justify-between border-t border-[#3b494b]/20">
                <span className="font-code-dense text-code-dense text-[#849495]">DELITO: DOCUMENTO APÓCRIFO</span>
                <button
                  type="button"
                  onClick={() => onOpenInspector('carlos-mendoza')}
                  className="px-2 py-1 rounded bg-[#43ffbb]/10 hover:bg-[#43ffbb] text-[#43ffbb] hover:text-[#002022] font-label-sm text-label-sm transition-all cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">visibility</span>
                  <span>Inspeccionar Nodo</span>
                </button>
              </div>
            </div>

            {/* Suspect 3: Insurgentes Sur 1420 */}
            <div className="bg-[#0b0e13] rounded-xl p-space-lg flex flex-col justify-between shadow-md relative overflow-hidden group hover:bg-[#191c21] transition-all border border-[#3b494b]/30 hover:border-[#00dbe9]/40">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00f0ff] via-[#00dbe9] to-[#00f0ff]"></div>
              <div className="flex flex-col gap-space-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-space-xs">
                    <div className="w-10 h-10 rounded-lg bg-[#272a30] flex items-center justify-center text-[#7df4ff]">
                      <span className="material-symbols-outlined text-[24px]">apartment</span>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <span className="font-headline-md text-headline-md text-[#dbfcff] font-bold">
                          Insurgentes Sur 1420
                        </span>
                        <span className="w-2 h-2 rounded-full bg-[#7df4ff]"></span>
                      </div>
                      <span className="font-code-dense text-code-dense text-[#849495]">
                        DOMICILIO FANTASMA · CDMX 03920
                      </span>
                    </div>
                  </div>
                  <span className="px-space-xs py-0.5 rounded bg-[#93000a]/20 text-[#ffb4ab] font-code-dense text-label-sm font-bold border border-[#ffb4ab]/30">
                    RANK #3
                  </span>
                </div>

                <div className="bg-[#272a30] px-space-sm py-1 rounded flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-[#849495]">Rol Criminológico:</span>
                  <span className="font-code-dense text-code-dense text-[#7df4ff] font-semibold">
                    EPICENTRO DE COLISIÓN DOMICILIARIA
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1 bg-[#1d2025] p-space-xs rounded">
                  <div className="flex flex-col text-center">
                    <span className="font-label-sm text-label-sm text-[#849495]">Degree</span>
                    <span className="font-code-dense text-label-md text-[#43ffbb] font-bold">0.824</span>
                  </div>
                  <div className="flex flex-col text-center">
                    <span className="font-label-sm text-label-sm text-[#849495]">Betweenness</span>
                    <span className="font-code-dense text-label-md text-[#7df4ff] font-bold">0.298</span>
                  </div>
                  <div className="flex flex-col text-center">
                    <span className="font-label-sm text-label-sm text-[#849495]">Concurrencia</span>
                    <span className="font-code-dense text-label-md text-[#ffb4ab] font-bold">18 Siniestros</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 text-body-sm font-body-sm text-[#b9cacb]">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[#7df4ff] text-[14px] mt-0.5">check_circle</span>
                    <span>
                      Oficina virtual desocupada registrada como hogar de <b>14 asegurados no relacionados</b>.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[#7df4ff] text-[14px] mt-0.5">check_circle</span>
                    <span>Recepción centralizada de correspondencia judicial y cheques indemnizatorios.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[#7df4ff] text-[14px] mt-0.5">check_circle</span>
                    <span>Conexión directa con 8 beneficiarios designados con cuentas CLABE clonadas.</span>
                  </div>
                </div>
              </div>

              <div className="pt-space-md mt-space-sm flex items-center justify-between border-t border-[#3b494b]/20">
                <span className="font-code-dense text-code-dense text-[#849495]">TIPO: DOMICILIO RECURRENTE</span>
                <button
                  type="button"
                  onClick={() => onOpenInspector('insurgentes-1420')}
                  className="px-2 py-1 rounded bg-[#00f0ff]/10 hover:bg-[#00f0ff] text-[#dbfcff] hover:text-[#002022] font-label-sm text-label-sm transition-all cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">visibility</span>
                  <span>Inspeccionar Nodo</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Evidentiary Subgraph Topology & Articulation Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
          {/* Interactive Sub-Network Preview Canvas */}
          <div className="lg:col-span-7 bg-[#0b0e13] rounded-xl p-space-lg flex flex-col justify-between shadow-md border border-[#3b494b]/30">
            <div className="flex flex-wrap items-center justify-between gap-space-sm">
              <div className="flex flex-col">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[#00f0ff] text-[20px]">hub</span>
                  <span className="font-headline-md text-headline-md text-[#e1e2ea] font-semibold">
                    Sub-Grafo Probatorio: Cluster Alpha
                  </span>
                </div>
                <span className="font-code-dense text-code-dense text-[#849495]">
                  Núcleo Colusivo Insurgentes-Mendoza (Extracción Focalizada)
                </span>
              </div>

              {/* Topology Mode Controls */}
              <div className="flex items-center gap-1 bg-[#1d2025] p-1 rounded border border-[#3b494b]/20">
                <button
                  type="button"
                  onClick={() => setSubgraphMode('k-core')}
                  className={`px-space-xs py-0.5 rounded font-code-dense text-[10px] font-bold cursor-pointer transition-colors ${
                    subgraphMode === 'k-core'
                      ? 'bg-[#00f0ff] text-[#002022]'
                      : 'text-[#b9cacb] hover:text-[#e1e2ea]'
                  }`}
                >
                  K-CORE 4
                </button>
                <button
                  type="button"
                  onClick={() => setSubgraphMode('louvain')}
                  className={`px-space-xs py-0.5 rounded font-code-dense text-[10px] font-bold cursor-pointer transition-colors ${
                    subgraphMode === 'louvain'
                      ? 'bg-[#00f0ff] text-[#002022]'
                      : 'text-[#b9cacb] hover:text-[#e1e2ea]'
                  }`}
                >
                  LOUVAIN
                </button>
                <button
                  type="button"
                  onClick={() => setSubgraphMode('bridges')}
                  className={`px-space-xs py-0.5 rounded font-code-dense text-[10px] font-bold cursor-pointer transition-colors ${
                    subgraphMode === 'bridges'
                      ? 'bg-[#00f0ff] text-[#002022]'
                      : 'text-[#b9cacb] hover:text-[#e1e2ea]'
                  }`}
                >
                  BRIDGES ONLY
                </button>
              </div>
            </div>

            {/* Inline Visual Topology Diagram */}
            <div className="relative w-full h-80 my-space-md bg-[#0b0e13] rounded-lg overflow-hidden flex items-center justify-center border border-[#3b494b]/20">
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#00f0ff 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              ></div>

              <svg className="w-full h-full relative z-10" viewBox="0 0 700 320" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#00f0ff" floodOpacity="0.8" />
                  </filter>
                  <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#ef4444" floodOpacity="0.9" />
                  </filter>
                </defs>

                {/* Edges from Xavier Estrada (350, 160) */}
                <line x1="350" y1="160" x2="210" y2="90" stroke="#00f0ff" strokeWidth="2.5" strokeDasharray="4,2" strokeOpacity="0.8" />
                <line x1="350" y1="160" x2="490" y2="90" stroke="#ef4444" strokeWidth="3" strokeOpacity="0.9" />
                <line x1="350" y1="160" x2="250" y2="240" stroke="#00f0ff" strokeWidth="2" strokeOpacity="0.7" />
                <line x1="350" y1="160" x2="450" y2="240" stroke="#10b981" strokeWidth="2.5" strokeOpacity="0.8" />
                <line x1="350" y1="160" x2="130" y2="160" stroke="#00f0ff" strokeWidth="1.5" strokeOpacity="0.5" />
                <line x1="350" y1="160" x2="570" y2="160" stroke="#ef4444" strokeWidth="2" strokeOpacity="0.7" />

                {/* From Dr. Mendoza */}
                <line x1="490" y1="90" x2="620" y2="60" stroke="#ef4444" strokeWidth="2" strokeOpacity="0.6" />
                <line x1="490" y1="90" x2="570" y2="160" stroke="#ef4444" strokeWidth="3" strokeOpacity="0.9" />
                <line x1="490" y1="90" x2="450" y2="240" stroke="#10b981" strokeWidth="2" strokeOpacity="0.7" />

                {/* From Insurgentes */}
                <line x1="210" y1="90" x2="90" y2="70" stroke="#00f0ff" strokeWidth="2" strokeOpacity="0.6" />
                <line x1="210" y1="90" x2="130" y2="160" stroke="#00f0ff" strokeWidth="2.5" strokeOpacity="0.8" />
                <line x1="210" y1="90" x2="250" y2="240" stroke="#00f0ff" strokeWidth="2" strokeOpacity="0.7" />

                {/* Claims (Diamonds) */}
                <polygon points="90,62 98,70 90,78 82,70" fill="#32353b" stroke="#00f0ff" strokeWidth="1.5" />
                <text x="90" y="55" fill="#b9cacb" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">
                  CLM-8812
                </text>

                <polygon points="620,52 628,60 620,68 612,60" fill="#32353b" stroke="#ef4444" strokeWidth="1.5" />
                <text x="620" y="45" fill="#b9cacb" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">
                  CLM-9043
                </text>

                {/* Entity Nodes */}
                <circle cx="130" cy="160" r="14" fill="#191c21" stroke="#00f0ff" strokeWidth="2" />
                <text x="130" y="164" fill="#e1e2ea" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">
                  H. Metr
                </text>

                <circle cx="570" cy="160" r="14" fill="#191c21" stroke="#ef4444" strokeWidth="2" />
                <text x="570" y="164" fill="#e1e2ea" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">
                  Cl. Salud
                </text>

                <circle cx="250" cy="240" r="13" fill="#191c21" stroke="#00e2a0" strokeWidth="2" />
                <text x="250" y="244" fill="#e1e2ea" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">
                  Fun. S.R.
                </text>

                <circle cx="450" cy="240" r="13" fill="#43ffbb" strokeWidth="2" />
                <text x="450" y="244" fill="#e1e2ea" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">
                  A. Ibáñez
                </text>

                {/* Hub 1: Epicenter Address */}
                <circle
                  cx="210"
                  cy="90"
                  r="22"
                  fill="#111319"
                  stroke="#00f0ff"
                  strokeWidth="3"
                  filter="url(#glow-cyan)"
                  className="cursor-pointer"
                  onClick={() => onOpenInspector('insurgentes-1420')}
                />
                <text x="210" y="87" fill="#dbfcff" fontSize="9" fontWeight="bold" fontFamily="Inter" textAnchor="middle">
                  Insurgentes
                </text>
                <text x="210" y="99" fill="#00e2a0" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">
                  1420 (x18)
                </text>

                {/* Hub 2: Dr. Carlos Mendoza */}
                <circle
                  cx="490"
                  cy="90"
                  r="24"
                  fill="#111319"
                  stroke="#ef4444"
                  strokeWidth="3"
                  filter="url(#glow-red)"
                  className="cursor-pointer"
                  onClick={() => onOpenInspector('carlos-mendoza')}
                />
                <text x="490" y="87" fill="#fff3f3" fontSize="9" fontWeight="bold" fontFamily="Inter" textAnchor="middle">
                  Dr. Mendoza
                </text>
                <text x="490" y="99" fill="#ffb4ab" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">
                  MED (x21)
                </text>

                {/* Core Conduit: Xavier Estrada */}
                <circle
                  cx="350"
                  cy="160"
                  r="30"
                  fill="#111319"
                  stroke="#00f0ff"
                  strokeWidth="4"
                  filter="url(#glow-cyan)"
                  className="cursor-pointer"
                  onClick={() => onOpenInspector('xavier-estrada')}
                />
                <circle cx="350" cy="160" r="26" fill="none" stroke="#43ffbb" strokeWidth="1.5" strokeDasharray="3,3" />
                <text x="350" y="156" fill="#7df4ff" fontSize="11" fontWeight="bold" fontFamily="Inter" textAnchor="middle">
                  Xavier Estrada
                </text>
                <text x="350" y="170" fill="#00e2a0" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">
                  BROKER [BC:0.412]
                </text>

                {/* Edge Weight Indicators */}
                <rect x="408" y="115" width="30" height="13" rx="2" fill="#272a30" />
                <text x="423" y="125" fill="#ffb4ab" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">
                  w=19
                </text>
                <rect x="268" y="115" width="30" height="13" rx="2" fill="#272a30" />
                <text x="283" y="125" fill="#7df4ff" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">
                  w=18
                </text>
              </svg>

              <div className="absolute bottom-2 left-2 bg-[#272a30]/90 backdrop-blur px-space-sm py-1 rounded flex items-center gap-space-sm font-code-dense text-[10px] border border-[#3b494b]/30">
                <span className="flex items-center gap-1 text-[#7df4ff]">
                  <span className="w-2 h-2 rounded-full bg-[#00f0ff]"></span> Hub Articulación
                </span>
                <span className="flex items-center gap-1 text-[#ffb4ab]">
                  <span className="w-2 h-2 rounded-full bg-[#ef4444]"></span> Anodal Confl.
                </span>
                <span className="flex items-center gap-1 text-[#43ffbb]">
                  <span className="w-2 h-2 rounded-full bg-[#43ffbb]"></span> Co-Partícipe
                </span>
                <span className="flex items-center gap-1 text-[#849495]">
                  <span className="w-2 h-2 rotate-45 bg-[#32353b]"></span> Siniestro
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-code-dense font-code-dense text-[#849495]">
              <span>ALGORITMO DE CORTE: FORD-FULKERSON MIN-CUT ANALYSIS</span>
              <span className="text-[#7df4ff]">MODULARIDAD SUBGRAFO Q = 0.741</span>
            </div>
          </div>

          {/* Matrix of Primary Colluding Entities Table */}
          <div className="lg:col-span-5 bg-[#0b0e13] rounded-xl p-space-lg flex flex-col justify-between shadow-md border border-[#3b494b]/30">
            <div>
              <div className="flex items-center justify-between pb-space-sm">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[#43ffbb] text-[20px]">table_chart</span>
                  <span className="font-headline-md text-headline-md text-[#e1e2ea] font-semibold">
                    Entidades Colusivas Principales
                  </span>
                </div>
                <span className="font-code-dense text-code-dense text-[#43ffbb] bg-[#1d2025] px-2 py-0.5 rounded font-bold border border-[#43ffbb]/20">
                  5 ENFOQUES
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-body-sm text-body-sm">
                  <thead>
                    <tr className="text-[#849495] font-label-sm text-label-sm bg-[#191c21]">
                      <th className="py-2 px-space-sm">Entidad</th>
                      <th className="py-2 px-space-xs">Tipo</th>
                      <th className="py-2 px-space-xs text-center">Concurrencia</th>
                      <th className="py-2 px-space-sm text-right">Penetración</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1d2025]">
                    {[
                      {
                        name: 'Dr. Carlos Mendoza',
                        id: 'CÉD: 8492014-M',
                        type: 'MÉDICO',
                        sin: '21 sin.',
                        pen: '6 / 6 Cías',
                        slug: 'carlos-mendoza',
                      },
                      {
                        name: 'Xavier Estrada',
                        id: 'ID: AS-0941-CDMX',
                        type: 'BROKER',
                        sin: '23 sin.',
                        pen: '6 / 6 Cías',
                        slug: 'xavier-estrada',
                      },
                      {
                        name: 'Hospital Metropolitano',
                        id: 'RFC: HME-091120-K18',
                        type: 'CLÍNICA',
                        sin: '15 sin.',
                        pen: '4 / 6 Cías',
                        slug: 'hospital-metropolitano',
                      },
                      {
                        name: 'Funeraria San Rafael',
                        id: 'RFC: FSR-120401-AA3',
                        type: 'PROVEEDOR',
                        sin: '9 sin.',
                        pen: '3 / 6 Cías',
                        slug: 'xavier-estrada',
                      },
                      {
                        name: 'Adriana Ibáñez',
                        id: 'CURP: IAMA891104...',
                        type: 'BENEFICIARIA',
                        sin: '7 sin.',
                        pen: '3 / 6 Cías',
                        slug: 'carlos-mendoza',
                      },
                    ].map((row, idx) => (
                      <tr
                        key={idx}
                        onClick={() => onOpenInspector(row.slug)}
                        className="hover:bg-[#1d2025] transition-colors cursor-pointer group"
                      >
                        <td className="py-2.5 px-space-sm font-medium text-[#dbfcff]">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                              <span>{row.name}</span>
                              <span className="material-symbols-outlined text-[14px] text-[#7df4ff] opacity-0 group-hover:opacity-100 transition-opacity">
                                open_in_new
                              </span>
                            </div>
                            <span className="font-code-dense text-[10px] text-[#849495]">{row.id}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-space-xs font-code-dense text-code-dense text-[#43ffbb]">
                          {row.type}
                        </td>
                        <td className="py-2.5 px-space-xs text-center font-code-dense font-bold text-[#ffb4ab]">
                          {row.sin}
                        </td>
                        <td className="py-2.5 px-space-sm text-right font-code-dense text-[#7df4ff]">
                          {row.pen}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-space-md bg-[#1d2025] p-space-sm rounded-lg flex items-center justify-between border border-[#3b494b]/20">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[16px] text-[#dbfcff]">policy</span>
                <span className="font-label-sm text-label-sm text-[#e1e2ea]">
                  Test de Independencia Chi-Cuadrado
                </span>
              </div>
              <span className="font-code-dense text-code-dense text-[#ffb4ab] font-bold">
                p &lt; 0.00001 (ANÓMALO)
              </span>
            </div>
          </div>
        </div>

        {/* Section 5: Legal Chain of Custody & Dynamic Report Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
          {/* Chain of Custody Cryptographic Seal */}
          <div className="lg:col-span-8 bg-[#0b0e13] rounded-xl p-space-lg shadow-md flex flex-col justify-between border border-[#3b494b]/30">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-space-sm pb-space-sm">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[#43ffbb] text-[22px]">verified</span>
                  <div className="flex flex-col">
                    <span className="font-headline-md text-headline-md text-[#e1e2ea] font-semibold">
                      Cadena de Custodia Digital & Validez Pericial
                    </span>
                    <span className="font-code-dense text-code-dense text-[#849495]">
                      Conformidad con Norma ISO/IEC 27037:2012 (Evidencia Digital)
                    </span>
                  </div>
                </div>
                <span className="px-space-sm py-1 rounded bg-[#43ffbb]/10 text-[#43ffbb] font-code-dense text-label-sm font-bold flex items-center gap-1 border border-[#43ffbb]/20">
                  <span className="material-symbols-outlined text-[14px]">shield</span>
                  FIRMA CRIPTOGRÁFICA VÁLIDA
                </span>
              </div>

              {/* Cryptographic Detail Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm mt-space-sm">
                <div className="bg-[#191c21] p-space-md rounded-lg flex flex-col gap-1 border border-[#3b494b]/20">
                  <span className="font-label-sm text-label-sm text-[#849495] uppercase">
                    Perito Responsable & Credenciales
                  </span>
                  <span className="font-headline-md text-headline-md text-[#dbfcff] font-bold">
                    Ing. Rodrigo Valenzuela S.
                  </span>
                  <span className="font-code-dense text-code-dense text-[#b9cacb]">
                    Perito en Informática Forense & Análisis de Redes
                  </span>
                  <span className="font-code-dense text-code-dense text-[#43ffbb]">
                    Cédula Prof. Especialidad: 11940283 / PFP
                  </span>
                </div>
                <div className="bg-[#191c21] p-space-md rounded-lg flex flex-col gap-1 border border-[#3b494b]/20">
                  <span className="font-label-sm text-label-sm text-[#849495] uppercase">
                    Sello de Tiempo Certificado (TSA)
                  </span>
                  <span className="font-headline-md text-headline-md text-[#e1e2ea] font-bold">
                    2026-03-31T16:42:19.412Z
                  </span>
                  <span className="font-code-dense text-code-dense text-[#b9cacb]">
                    Autoridad Certificadora: PSC-NOM-151-MÉXICO
                  </span>
                  <span className="font-code-dense text-code-dense text-[#7df4ff]">
                    Folio Constancia: AC-MX-2026-9912048
                  </span>
                </div>
              </div>

              {/* Raw Crypto Block */}
              <div className="mt-space-sm bg-[#1d2025] p-space-sm rounded-lg flex flex-col gap-1 border border-[#3b494b]/20">
                <div className="flex items-center justify-between text-code-dense font-code-dense">
                  <span className="text-[#849495]">FIRMA DIGITAL RSA-4096 / SHA-256</span>
                  <span className="text-[#43ffbb] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">lock</span>
                    INTEGRIDAD GARANTIZADA
                  </span>
                </div>
                <p className="font-code-dense text-[10px] text-[#b9cacb] break-all leading-tight">
                  3f8a41c7b809d4e112f47e9a03bc58914d2e8f17a9c3d4e8b210f65c9e471829aa841029384756c0b1e2d3f4a5b6c7d8e9f0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
                </p>
              </div>
            </div>

            <div className="pt-space-md flex flex-wrap items-center justify-between gap-2 border-t border-[#3b494b]/20 mt-space-sm">
              <div className="flex items-center gap-space-sm text-code-dense font-code-dense text-[#b9cacb]">
                <span>
                  Repositorio Central: <code className="text-[#7df4ff]">/dossiers/2026/X79A/master.json</code>
                </span>
                <span>•</span>
                <span>Acceso Auditado: 3 consultas de Agente MP</span>
              </div>
              <button
                type="button"
                onClick={() => alert('Historial de Cadena de Custodia: 3 accesos verificados por firma biométrica.')}
                className="px-space-md py-1.5 rounded bg-[#1d2025] hover:bg-[#272a30] text-[#e1e2ea] text-label-md font-label-md flex items-center gap-1 cursor-pointer transition-colors border border-[#3b494b]/20"
              >
                <span className="material-symbols-outlined text-[16px] text-[#43ffbb]">history</span>
                <span>Historial de Cadena</span>
              </button>
            </div>
          </div>

          {/* Customizable Report Config Panel */}
          <div className="lg:col-span-4 bg-[#0b0e13] rounded-xl p-space-lg shadow-md flex flex-col justify-between border border-[#3b494b]/30">
            <div>
              <div className="flex items-center justify-between pb-space-sm">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[#dbfcff] text-[20px]">tune</span>
                  <span className="font-headline-md text-headline-md text-[#e1e2ea] font-semibold">
                    Configurar Paquete
                  </span>
                </div>
                <span className="font-code-dense text-code-dense text-[#849495]">EXPEDIENTE V2.4</span>
              </div>
              <p className="font-body-sm text-body-sm text-[#b9cacb] mb-space-sm">
                Seleccione los anexos técnicos a compilar dentro de la providencia precautoria judicial.
              </p>

              <div className="flex flex-col gap-space-sm">
                <label className="flex items-start gap-space-sm bg-[#1d2025] p-space-sm rounded-lg cursor-pointer hover:bg-[#272a30] transition-colors border border-[#3b494b]/20">
                  <input
                    type="checkbox"
                    checked={configChecks.centrality}
                    onChange={(e) => setConfigChecks({ ...configChecks, centrality: e.target.checked })}
                    className="mt-0.5 w-4 h-4 rounded bg-[#0b0e13] accent-[#00f0ff] cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-[#e1e2ea] font-medium">
                      Matrices de Centralidad Completas
                    </span>
                    <span className="font-code-dense text-code-dense text-[#849495]">
                      Incluye eigenvector, betweenness y k-shell
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-space-sm bg-[#1d2025] p-space-sm rounded-lg cursor-pointer hover:bg-[#272a30] transition-colors border border-[#3b494b]/20">
                  <input
                    type="checkbox"
                    checked={configChecks.louvain}
                    onChange={(e) => setConfigChecks({ ...configChecks, louvain: e.target.checked })}
                    className="mt-0.5 w-4 h-4 rounded bg-[#0b0e13] accent-[#00f0ff] cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-[#e1e2ea] font-medium">
                      Particiones de Louvain & Clusters
                    </span>
                    <span className="font-code-dense text-code-dense text-[#849495]">
                      Agrupamiento modular de los 99 nodos
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-space-sm bg-[#1d2025] p-space-sm rounded-lg cursor-pointer hover:bg-[#272a30] transition-colors border border-[#3b494b]/20">
                  <input
                    type="checkbox"
                    checked={configChecks.edgeList}
                    onChange={(e) => setConfigChecks({ ...configChecks, edgeList: e.target.checked })}
                    className="mt-0.5 w-4 h-4 rounded bg-[#0b0e13] accent-[#00f0ff] cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-[#e1e2ea] font-medium">
                      Catálogo de Aristas Crudas (Edge List)
                    </span>
                    <span className="font-code-dense text-code-dense text-[#849495]">
                      320 conexiones formateadas en CSV forense
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-space-sm bg-[#1d2025] p-space-sm rounded-lg cursor-pointer hover:bg-[#272a30] transition-colors border border-[#3b494b]/20">
                  <input
                    type="checkbox"
                    checked={configChecks.ipGeocoding}
                    onChange={(e) => setConfigChecks({ ...configChecks, ipGeocoding: e.target.checked })}
                    className="mt-0.5 w-4 h-4 rounded bg-[#0b0e13] accent-[#00f0ff] cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-[#e1e2ea] font-medium">
                      Dispersión de Anomalías IP & Geocoding
                    </span>
                    <span className="font-code-dense text-code-dense text-[#849495]">
                      Cartografía satelital de domicilios ficticios
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div className="pt-space-md">
              <button
                type="button"
                onClick={handleRegenerateIndices}
                disabled={recalculatingIndices}
                className="w-full py-2.5 rounded-lg bg-[#1d2025] hover:bg-[#272a30] text-[#7df4ff] font-label-md text-label-md font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer border border-[#3b494b]/30"
              >
                <span className={`material-symbols-outlined text-[16px] ${recalculatingIndices ? 'animate-spin' : ''}`}>
                  {indicesSuccess ? 'done' : 'sync'}
                </span>
                <span>
                  {recalculatingIndices
                    ? 'Sincronizando Anexos...'
                    : indicesSuccess
                    ? 'Índices Sincronizados'
                    : 'Regenerar Índices de Expediente'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
