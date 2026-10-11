import React, { useState } from 'react';
import { CSV_SAMPLE_ROWS } from '../data/dataset';

interface CsvDataPipelineProps {
  onOpenUpload: () => void;
  onGenerateGraph: () => void;
}

export const CsvDataPipeline: React.FC<CsvDataPipelineProps> = ({
  onOpenUpload,
  onGenerateGraph,
}) => {
  const [autoMergeActive, setAutoMergeActive] = useState(false);
  const [projectionMode, setProjectionMode] = useState<'bipartite' | 'monopartite'>('bipartite');
  const [sourceColumn, setSourceColumn] = useState('entidad (String)');
  const [targetColumn, setTargetColumn] = useState('siniestro (Key)');
  const [verbMapping, setVerbMapping] = useState('Col: tipo');
  const [weightColumn, setWeightColumn] = useState('concurrencia (Int)');
  const [normalizationType, setNormalizationType] = useState('Logarithmic (e)');
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileSuccess, setCompileSuccess] = useState(false);

  const handleDownloadSample = () => {
    const csvContent =
      'siniestro,entidad,tipo,aseguradora,concurrencia\n' +
      CSV_SAMPLE_ROWS.map((r) => `${r.siniestro},${r.entidad},${r.tipo},${r.aseguradora},${r.concurrencia}`).join(
        '\n'
      );
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Siniestros_Concurrencia_Sample.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetMapping = () => {
    setSourceColumn('entidad (String)');
    setTargetColumn('siniestro (Key)');
    setVerbMapping('Col: tipo');
    setWeightColumn('concurrencia (Int)');
    setAutoMergeActive(false);
    setProjectionMode('bipartite');
  };

  const handleGenerateGraphClick = () => {
    setIsCompiling(true);
    setTimeout(() => {
      setIsCompiling(false);
      setCompileSuccess(true);
      setTimeout(() => {
        onGenerateGraph();
      }, 700);
    }, 900);
  };

  return (
    <div className="flex flex-col w-full text-[#e1e2ea] bg-[#111319] min-h-screen select-none">
      {/* Top Forensic Breadcrumb & Pipeline Stepper */}
      <section className="w-full bg-[#0b0e13] px-space-lg py-space-md shadow-md border-b border-[#3b494b]/30">
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-space-md">
          {/* Workflow Multi-stage Stepper */}
          <div className="flex flex-wrap items-center gap-space-xs font-label-md text-label-md">
            <div className="flex items-center gap-space-xs px-space-md py-1.5 rounded bg-[#191c21] text-[#b9cacb] border border-[#3b494b]/20">
              <span className="material-symbols-outlined text-[16px] text-[#43ffbb]">check_circle</span>
              <span className="font-bold text-[#e1e2ea]">1. File Ingestion</span>
              <span className="text-[#43ffbb] font-code-dense text-code-dense">[1.4 MB]</span>
            </div>
            <span className="material-symbols-outlined text-[14px] text-[#849495]">chevron_right</span>

            <div className="flex items-center gap-space-xs px-space-md py-1.5 rounded bg-[#272a30] text-[#7df4ff] shadow-[0_0_12px_rgba(0,240,255,0.18)] border border-[#00f0ff]/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f0ff] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f0ff]"></span>
              </span>
              <span className="font-bold">2. Schema & Column Mapping</span>
              <span className="px-1.5 py-0.2 rounded bg-[#00f0ff]/15 text-[#00dbe9] text-label-sm font-code-dense">
                ACTIVE
              </span>
            </div>
            <span className="material-symbols-outlined text-[14px] text-[#849495]">chevron_right</span>

            <div className="flex items-center gap-space-xs px-space-md py-1.5 rounded bg-[#191c21] text-[#b9cacb] opacity-60">
              <span className="font-code-dense text-[12px] text-[#849495]">03</span>
              <span>Entity Taxonomy & Deduplication</span>
            </div>
            <span className="material-symbols-outlined text-[14px] text-[#849495]">chevron_right</span>

            <div className="flex items-center gap-space-xs px-space-md py-1.5 rounded bg-[#191c21] text-[#b9cacb] opacity-60">
              <span className="font-code-dense text-[12px] text-[#849495]">04</span>
              <span>Topology Synthesis</span>
            </div>
          </div>

          {/* Action Cluster */}
          <div className="flex items-center gap-space-sm self-end xl:self-auto">
            <button
              type="button"
              onClick={handleDownloadSample}
              className="flex items-center gap-space-xs px-space-md py-2 rounded bg-[#1d2025] hover:bg-[#272a30] text-[#b9cacb] hover:text-[#e1e2ea] font-label-md text-label-md transition-all cursor-pointer border border-[#3b494b]/20"
            >
              <span className="material-symbols-outlined text-[16px]">file_download</span>
              <span>Download Sample Schema (.csv)</span>
            </button>

            <button
              type="button"
              onClick={handleResetMapping}
              className="flex items-center gap-space-xs px-space-md py-2 rounded bg-[#1d2025] hover:bg-[#272a30] text-[#b9cacb] hover:text-[#e1e2ea] font-label-md text-label-md transition-all cursor-pointer border border-[#3b494b]/20"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              <span>Reset Mapping</span>
            </button>

            <button
              type="button"
              id="btn-generate-graph"
              onClick={handleGenerateGraphClick}
              disabled={isCompiling}
              className="flex items-center gap-space-xs px-space-lg py-2 rounded bg-[#00f0ff] text-[#002022] font-label-lg text-label-lg font-bold hover:bg-[#00dbe9] transition-all shadow-[0_0_16px_rgba(0,240,255,0.4)] cursor-pointer"
            >
              {isCompiling ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                  <span>Compiling 320 Edges...</span>
                </>
              ) : compileSuccess ? (
                <>
                  <span className="material-symbols-outlined text-[18px]">done_all</span>
                  <span>Graph Synthesized!</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">account_tree</span>
                  <span>Generate Knowledge Graph</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Forensic Telemetry Ribbon */}
        <div className="mt-space-sm flex flex-wrap items-center justify-between gap-space-md pt-space-xs border-t border-[#3b494b]/20">
          <div className="flex flex-wrap items-center gap-space-sm font-code-dense text-code-dense text-[#b9cacb]">
            <span className="text-[#849495] uppercase tracking-wider font-label-sm text-label-sm">
              Parser Telemetry:
            </span>
            <div className="flex items-center gap-1.5 px-space-sm py-0.5 rounded bg-[#1d2025] text-[#43ffbb]">
              <span className="material-symbols-outlined text-[13px]">dataset</span>
              <span>ROWS: 320 Edges</span>
            </div>
            <div className="flex items-center gap-1.5 px-space-sm py-0.5 rounded bg-[#1d2025] text-[#e1e2ea]">
              <span className="material-symbols-outlined text-[13px]">splitscreen</span>
              <span>DELIM: Comma [,]</span>
            </div>
            <div className="flex items-center gap-1.5 px-space-sm py-0.5 rounded bg-[#1d2025] text-[#e1e2ea]">
              <span className="material-symbols-outlined text-[13px]">code</span>
              <span>ENC: UTF-8 (BOM-Free)</span>
            </div>
            <div className="flex items-center gap-1.5 px-space-sm py-0.5 rounded bg-[#1d2025] text-[#e1e2ea]">
              <span className="material-symbols-outlined text-[13px]">table_rows</span>
              <span>HDR: Line #1</span>
            </div>
            <div className="flex items-center gap-1.5 px-space-sm py-0.5 rounded bg-[#1d2025] text-[#7df4ff]">
              <span className="material-symbols-outlined text-[13px]">verified</span>
              <span>SANITY SCORE: 98.4%</span>
            </div>
          </div>

          <div className="flex items-center gap-space-sm">
            <span className="font-label-sm text-label-sm text-[#849495] font-mono">
              FILE SHA-256: 9b8f2c...47fa8e
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#43ffbb] shadow-[0_0_6px_#43ffbb]"></span>
          </div>
        </div>
      </section>

      {/* Work Area Workspace Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-md p-space-md bg-[#111319]">
        {/* ========================================================= */}
        {/* LEFT & CENTER COLUMN: Schema Mapping Core Engine (7 Cols)  */}
        {/* ========================================================= */}
        <div className="xl:col-span-7 flex flex-col gap-space-md">
          {/* Ingested Source File Info Card */}
          <div className="flex items-center justify-between p-space-md rounded bg-[#191c21] shadow-sm border border-[#3b494b]/20">
            <div className="flex items-center gap-space-md min-w-0">
              <div className="w-10 h-10 rounded bg-[#1d2025] flex items-center justify-center text-[#7df4ff]">
                <span className="material-symbols-outlined text-[24px]">description</span>
              </div>
              <div className="min-w-0 flex flex-col">
                <div className="flex items-center gap-space-sm">
                  <span className="font-headline-md text-headline-md text-[#e1e2ea] font-semibold truncate">
                    Siniestros_Concurrencia_2026.csv
                  </span>
                  <span className="px-space-xs py-0.5 rounded bg-[#272a30] text-[#43ffbb] font-code-dense text-code-dense">
                    Auto-mapped (94% confidence)
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-[#b9cacb] truncate">
                  Detected columns: <code className="text-[#7df4ff]">siniestro</code>,{' '}
                  <code className="text-[#7df4ff]">entidad</code>, <code className="text-[#7df4ff]">tipo</code>,{' '}
                  <code className="text-[#7df4ff]">aseguradora</code>,{' '}
                  <code className="text-[#7df4ff]">concurrencia</code>. Schema profile conforms to Bipartite
                  Concurrency Graph.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-space-xs shrink-0">
              <button
                type="button"
                onClick={onOpenUpload}
                className="p-2 rounded bg-[#1d2025] text-[#b9cacb] hover:text-[#7df4ff] hover:bg-[#272a30] transition-colors cursor-pointer"
                title="Replace CSV"
              >
                <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
              </button>
              <button
                type="button"
                className="p-2 rounded bg-[#1d2025] text-[#b9cacb] hover:text-[#e1e2ea] hover:bg-[#272a30] transition-colors cursor-pointer"
                title="Raw File Specs"
              >
                <span className="material-symbols-outlined text-[20px]">info</span>
              </button>
            </div>
          </div>

          {/* Graph Role Mapping Block */}
          <div className="flex flex-col gap-space-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="font-label-lg text-label-lg text-[#7df4ff] font-semibold uppercase tracking-wider">
                  Topological Bindings
                </span>
                <span className="text-[#849495] font-code-dense text-code-dense">[Graph-Model Definitions]</span>
              </div>
              <span className="font-code-dense text-code-dense text-[#b9cacb]">5/5 Primary Slots Mapped</span>
            </div>

            {/* Role 1: Source Node (Origen / Sujeto) */}
            <div className="p-space-md rounded bg-[#191c21] transition-all hover:bg-[#1d2025]/60 shadow-sm border border-[#3b494b]/20">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
                <div className="flex items-start gap-space-md">
                  <div className="w-8 h-8 rounded bg-[#00f0ff]/20 text-[#7df4ff] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">person_pin_circle</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-space-xs">
                      <span className="font-headline-md text-headline-md text-[#e1e2ea] font-medium">
                        Source Node (Origen / Sujeto)
                      </span>
                      <span className="px-space-xs py-0.5 rounded bg-[#00f0ff]/15 text-[#7df4ff] font-code-dense text-code-dense">
                        [MANDATORY]
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-[#b9cacb]">
                      Network subject identifier. Auto-partitioned into heterogeneous entity categories.
                    </p>
                    <div className="mt-space-xs flex items-center gap-space-xs font-code-dense text-code-dense text-[#849495]">
                      <span>Samples:</span>
                      <span className="text-[#7df4ff] bg-[#1d2025] px-1 py-0.5 rounded">Dr. Carlos Mendoza</span>
                      <span className="text-[#7df4ff] bg-[#1d2025] px-1 py-0.5 rounded">Xavier Estrada</span>
                      <span className="text-[#7df4ff] bg-[#1d2025] px-1 py-0.5 rounded">Aseguradora F</span>
                    </div>
                  </div>
                </div>

                {/* Mapping Selector */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-sm shrink-0">
                  <div className="flex flex-col">
                    <label className="font-label-sm text-label-sm text-[#849495] mb-0.5">CSV Column</label>
                    <div className="relative">
                      <select
                        value={sourceColumn}
                        onChange={(e) => setSourceColumn(e.target.value)}
                        className="w-44 px-space-md py-1.5 rounded bg-[#0b0e13] text-[#7df4ff] font-code-dense text-code-dense appearance-none focus:outline-none focus:ring-1 focus:ring-[#00f0ff] cursor-pointer pr-7 border border-[#3b494b]/30"
                      >
                        <option>entidad (String)</option>
                        <option>siniestro</option>
                        <option>tipo</option>
                        <option>aseguradora</option>
                        <option>concurrencia</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-2 top-2 text-[14px] text-[#849495] pointer-events-none">
                        expand_more
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="font-label-sm text-label-sm text-[#849495] mb-0.5">Node Classifier</label>
                    <span className="px-space-md py-1.5 rounded bg-[#1d2025] text-[#43ffbb] font-code-dense text-code-dense text-center">
                      Heterogeneous
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Role 2: Target Node (Destino / Expediente) */}
            <div className="p-space-md rounded bg-[#191c21] transition-all hover:bg-[#1d2025]/60 shadow-sm border border-[#3b494b]/20">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
                <div className="flex items-start gap-space-md">
                  <div className="w-8 h-8 rounded bg-[#00e2a0]/20 text-[#43ffbb] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">hub</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-space-xs">
                      <span className="font-headline-md text-headline-md text-[#e1e2ea] font-medium">
                        Target Node (Destino / Expediente)
                      </span>
                      <span className="px-space-xs py-0.5 rounded bg-[#43ffbb]/15 text-[#43ffbb] font-code-dense text-code-dense">
                        [MANDATORY]
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-[#b9cacb]">
                      Claim dossier or incident container that connects overlapping entities.
                    </p>
                    <div className="mt-space-xs flex items-center gap-space-xs font-code-dense text-code-dense text-[#849495]">
                      <span>Samples:</span>
                      <span className="text-[#43ffbb] bg-[#1d2025] px-1 py-0.5 rounded">SIN_0001</span>
                      <span className="text-[#43ffbb] bg-[#1d2025] px-1 py-0.5 rounded">SIN_0002</span>
                      <span className="text-[#43ffbb] bg-[#1d2025] px-1 py-0.5 rounded">SIN_0003</span>
                    </div>
                  </div>
                </div>

                {/* Mapping Selector */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-sm shrink-0">
                  <div className="flex flex-col">
                    <label className="font-label-sm text-label-sm text-[#849495] mb-0.5">CSV Column</label>
                    <div className="relative">
                      <select
                        value={targetColumn}
                        onChange={(e) => setTargetColumn(e.target.value)}
                        className="w-44 px-space-md py-1.5 rounded bg-[#0b0e13] text-[#43ffbb] font-code-dense text-code-dense appearance-none focus:outline-none focus:ring-1 focus:ring-[#43ffbb] cursor-pointer pr-7 border border-[#3b494b]/30"
                      >
                        <option>siniestro (Key)</option>
                        <option>entidad</option>
                        <option>tipo</option>
                        <option>aseguradora</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-2 top-2 text-[14px] text-[#849495] pointer-events-none">
                        expand_more
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="font-label-sm text-label-sm text-[#849495] mb-0.5">Geometry</label>
                    <span className="px-space-md py-1.5 rounded bg-[#1d2025] text-[#b9cacb] font-code-dense text-code-dense text-center">
                      Rhombus / Node
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Role 3: Edge Verb / Predicate */}
            <div className="p-space-md rounded bg-[#191c21] transition-all hover:bg-[#1d2025]/60 shadow-sm border border-[#3b494b]/20">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
                <div className="flex items-start gap-space-md">
                  <div className="w-8 h-8 rounded bg-[#1d2025] text-[#849495] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">timeline</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-space-xs">
                      <span className="font-headline-md text-headline-md text-[#e1e2ea] font-medium">
                        Edge Verb (Relación / Vínculo)
                      </span>
                      <span className="px-space-xs py-0.5 rounded bg-[#32353b] text-[#b9cacb] font-code-dense text-code-dense">
                        [DYNAMIC]
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-[#b9cacb]">
                      Relationship predicate describing interaction typology. Can use static literal or column value.
                    </p>
                    <div className="mt-space-xs flex items-center gap-space-xs font-code-dense text-code-dense text-[#849495]">
                      <span>Current Schema:</span>
                      <span className="text-[#e1e2ea] bg-[#1d2025] px-1 py-0.5 rounded">
                        Dynamic by ‘tipo’ (TREATS, CLAIMS, INSURES)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mapping Selector */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-sm shrink-0">
                  <div className="flex flex-col">
                    <label className="font-label-sm text-label-sm text-[#849495] mb-0.5">Mapping Strategy</label>
                    <div className="relative">
                      <select
                        value={verbMapping}
                        onChange={(e) => setVerbMapping(e.target.value)}
                        className="w-44 px-space-md py-1.5 rounded bg-[#0b0e13] text-[#e1e2ea] font-code-dense text-code-dense appearance-none focus:outline-none focus:ring-1 focus:ring-[#00f0ff] cursor-pointer pr-7 border border-[#3b494b]/30"
                      >
                        <option>Col: tipo</option>
                        <option>Literal: PARTICIPATES_IN</option>
                        <option>Literal: CO_CONCURRENT</option>
                        <option>Infer from Category</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-2 top-2 text-[14px] text-[#849495] pointer-events-none">
                        expand_more
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="font-label-sm text-label-sm text-[#849495] mb-0.5">Directionality</label>
                    <span className="px-space-md py-1.5 rounded bg-[#1d2025] text-[#00dbe9] font-code-dense text-code-dense text-center">
                      Directed (→)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Role 4: Edge Weight & Concurrency Metric */}
            <div className="p-space-md rounded bg-[#191c21] transition-all hover:bg-[#1d2025]/60 shadow-sm border border-[#3b494b]/20">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
                <div className="flex items-start gap-space-md">
                  <div className="w-8 h-8 rounded bg-[#00f0ff]/20 text-[#00dbe9] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">fitness_center</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-space-xs">
                      <span className="font-headline-md text-headline-md text-[#e1e2ea] font-medium">
                        Edge Weight (Peso de Arista / Concurrencia)
                      </span>
                      <span className="px-space-xs py-0.5 rounded bg-[#7df4ff]/20 text-[#00dbe9] font-code-dense text-code-dense">
                        [NUMERIC]
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-[#b9cacb]">
                      Weight calculation determines spring tension in force layout and thickens visual edge arcs.
                    </p>
                    <div className="mt-space-xs flex flex-wrap items-center gap-space-xs font-code-dense text-code-dense">
                      <span className="text-[#849495]">Scale:</span>
                      <span className="bg-[#1d2025] px-1 py-0.5 rounded text-[#b9cacb]">L1=1x</span>
                      <span className="bg-[#1d2025] px-1 py-0.5 rounded text-[#43ffbb]">L2=2x</span>
                      <span className="bg-[#1d2025] px-1 py-0.5 rounded text-[#7df4ff]">L3=4x</span>
                      <span className="bg-[#1d2025] px-1 py-0.5 rounded text-[#ffb4ab]">L4=7x+ (ANOMALOUS)</span>
                    </div>
                  </div>
                </div>

                {/* Mapping Selector */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-sm shrink-0">
                  <div className="flex flex-col">
                    <label className="font-label-sm text-label-sm text-[#849495] mb-0.5">CSV Column</label>
                    <div className="relative">
                      <select
                        value={weightColumn}
                        onChange={(e) => setWeightColumn(e.target.value)}
                        className="w-44 px-space-md py-1.5 rounded bg-[#0b0e13] text-[#7df4ff] font-code-dense text-code-dense appearance-none focus:outline-none focus:ring-1 focus:ring-[#00f0ff] cursor-pointer pr-7 border border-[#3b494b]/30"
                      >
                        <option>concurrencia (Int)</option>
                        <option>Uniform Weight (1.0)</option>
                        <option>Calculate by Frequency</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-2 top-2 text-[14px] text-[#849495] pointer-events-none">
                        expand_more
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="font-label-sm text-label-sm text-[#849495] mb-0.5">Normalization</label>
                    <button
                      type="button"
                      onClick={() =>
                        setNormalizationType(
                          normalizationType === 'Logarithmic (e)' ? 'Min-Max (0-1)' : 'Logarithmic (e)'
                        )
                      }
                      className="px-space-md py-1.5 rounded bg-[#1d2025] text-[#43ffbb] font-code-dense text-code-dense hover:bg-[#272a30] transition-colors cursor-pointer border border-[#3b494b]/20"
                    >
                      {normalizationType}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Role 5: Attribute & Metadata Binding Panel */}
            <div className="p-space-md rounded bg-[#191c21] shadow-sm border border-[#3b494b]/20">
              <div className="flex items-center justify-between mb-space-sm">
                <span className="font-label-md text-label-md text-[#e1e2ea] font-semibold flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[16px] text-[#00dbe9]">tune</span>
                  Supplementary Node Attributes & Categorization
                </span>
                <span className="font-code-dense text-code-dense text-[#43ffbb]">[2 Active Dimensions]</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm font-body-sm text-body-sm">
                <div className="p-space-sm rounded bg-[#0b0e13] flex items-center justify-between border border-[#3b494b]/20">
                  <div>
                    <span className="block text-[#849495] font-label-sm text-label-sm">Categorical Taxonomy</span>
                    <span className="text-[#e1e2ea] font-mono font-medium">tipo → Entity Classifier</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#1d2025] text-[#7df4ff] font-code-dense text-code-dense">
                    MÉDICO, ASESOR, ...
                  </span>
                </div>
                <div className="p-space-sm rounded bg-[#0b0e13] flex items-center justify-between border border-[#3b494b]/20">
                  <div>
                    <span className="block text-[#849495] font-label-sm text-label-sm">
                      Corporate Domain / Partition
                    </span>
                    <span className="text-[#e1e2ea] font-mono font-medium">aseguradora → Node Cluster Group</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#1d2025] text-[#43ffbb] font-code-dense text-code-dense">
                    Aseguradora A - F
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Real-Time Forensic Sanity Check / Validation Module */}
          <div className="p-space-md rounded bg-[#191c21] shadow-sm border border-[#3b494b]/20">
            <div className="flex items-center justify-between mb-space-sm">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[18px] text-[#43ffbb]">verified_user</span>
                <span className="font-label-lg text-label-lg text-[#e1e2ea] font-semibold">
                  Schema Sanity Verification
                </span>
              </div>
              <span className="font-code-dense text-code-dense text-[#43ffbb] bg-[#1d2025] px-2 py-0.5 rounded">
                Pass Rate: 99.2%
              </span>
            </div>

            <div className="flex flex-col gap-space-xs">
              {/* Check 1 */}
              <div className="flex items-center justify-between p-space-sm rounded bg-[#0b0e13]">
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-[16px] text-[#43ffbb]">check_circle</span>
                  <span className="text-[#e1e2ea] font-body-sm text-body-sm">
                    Zero orphan nodes detected across 320 edges
                  </span>
                </div>
                <span className="font-code-dense text-code-dense text-[#849495]">0 dangling refs</span>
              </div>

              {/* Check 2 */}
              <div className="flex items-center justify-between p-space-sm rounded bg-[#0b0e13]">
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-[16px] text-[#43ffbb]">check_circle</span>
                  <span className="text-[#e1e2ea] font-body-sm text-body-sm">
                    Bipartite structural partition verified (Entidad ↔ Siniestro)
                  </span>
                </div>
                <span className="font-code-dense text-code-dense text-[#43ffbb] font-medium">2 Distinct Sets</span>
              </div>

              {/* Check 3 - Warning with Resolution Action */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm p-space-sm rounded bg-[#0b0e13] border-l-2 border-[#00f0ff]">
                <div className="flex items-start gap-space-sm">
                  <span className="material-symbols-outlined text-[18px] text-[#7df4ff] mt-0.5">warning</span>
                  <div>
                    <span className="text-[#e1e2ea] font-body-sm text-body-sm font-semibold">
                      3 potential duplicate entities detected with fuzzy similarity &gt; 92%
                    </span>
                    <p className="font-code-dense text-code-dense text-[#b9cacb]">
                      Match found:{' '}
                      <span className="text-[#ffb4ab] font-medium">‘Igancio Medina’</span> ↔{' '}
                      <span className="text-[#43ffbb] font-medium">‘Ignacio Medina’</span> (Levenshtein dist: 1)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-space-xs self-end md:self-auto">
                  <button
                    type="button"
                    onClick={() => setAutoMergeActive(!autoMergeActive)}
                    className={`px-space-sm py-1 rounded font-code-dense text-code-dense transition-all cursor-pointer ${
                      autoMergeActive
                        ? 'bg-[#00f0ff] text-[#002022] font-semibold shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                        : 'bg-[#00f0ff]/20 hover:bg-[#00f0ff] text-[#7df4ff] hover:text-[#002022]'
                    }`}
                  >
                    {autoMergeActive ? 'Auto-Merge Active (3 Synced)' : 'Enable Auto-Merge'}
                  </button>
                </div>
              </div>

              {/* Check 4 */}
              <div className="flex items-center justify-between p-space-sm rounded bg-[#0b0e13]">
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-[16px] text-[#43ffbb]">check_circle</span>
                  <span className="text-[#e1e2ea] font-body-sm text-body-sm">
                    Acyclic integrity validated (No direct circular edge contradictions)
                  </span>
                </div>
                <span className="font-code-dense text-code-dense text-[#849495]">0 self-loops</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Interactive Table & Mini-Canvas (5 Cols)     */}
        {/* ========================================================= */}
        <div className="xl:col-span-5 flex flex-col gap-space-md">
          {/* Interactive CSV Data Table Preview with Schema Highlighting */}
          <div className="p-space-md rounded bg-[#191c21] shadow-sm flex flex-col gap-space-sm border border-[#3b494b]/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[16px] text-[#7df4ff]">table_chart</span>
                <span className="font-label-lg text-label-lg text-[#e1e2ea] font-semibold">
                  Parsed CSV Sample Preview
                </span>
              </div>
              <span className="font-code-dense text-code-dense text-[#849495]">Displaying top 6 of 320 records</span>
            </div>

            {/* Legend Ribbon for Highlighted Columns */}
            <div className="flex flex-wrap items-center gap-space-xs font-code-dense text-code-dense pb-space-xs">
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#32353b] text-[#43ffbb]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#43ffbb]"></span>Target (Siniestro)
              </span>
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#32353b] text-[#7df4ff]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7df4ff]"></span>Source (Entidad)
              </span>
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#32353b] text-[#e1e2ea]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#849495]"></span>Metadata / Concurrencia
              </span>
            </div>

            {/* Data Table Container */}
            <div className="overflow-x-auto rounded bg-[#0b0e13]">
              <table className="w-full text-left font-code-dense text-code-dense border-collapse">
                <thead>
                  <tr className="bg-[#1d2025] border-b border-[#272a30] text-[#b9cacb]">
                    <th className="p-space-sm text-[#43ffbb]">siniestro [TARGET]</th>
                    <th className="p-space-sm text-[#7df4ff]">entidad [SOURCE]</th>
                    <th className="p-space-sm text-[#e1e2ea]">tipo [ROLE]</th>
                    <th className="p-space-sm text-[#e1e2ea]">aseguradora</th>
                    <th className="p-space-sm text-[#00dbe9] text-right">concurrencia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1d2025] text-[#b9cacb]">
                  {CSV_SAMPLE_ROWS.slice(0, 6).map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#272a30]/40 transition-colors">
                      <td className="p-space-sm font-semibold text-[#43ffbb]">{row.siniestro}</td>
                      <td className="p-space-sm text-[#7df4ff]">{row.entidad}</td>
                      <td className="p-space-sm">
                        <span
                          className={`px-1.5 py-0.5 rounded bg-[#1d2025] text-[10px] ${
                            row.tipo === 'MÉDICO'
                              ? 'text-[#f59e0b]'
                              : row.tipo === 'ASESOR'
                              ? 'text-[#a855f7]'
                              : row.tipo === 'HOSPITAL'
                              ? 'text-[#14b8a6]'
                              : 'text-[#849495]'
                          }`}
                        >
                          {row.tipo}
                        </span>
                      </td>
                      <td className="p-space-sm">{row.aseguradora}</td>
                      <td
                        className={`p-space-sm text-right font-bold ${
                          row.concurrencia >= 7
                            ? 'text-[#ffb4ab]'
                            : row.concurrencia >= 4
                            ? 'text-[#7df4ff]'
                            : 'text-[#e1e2ea]'
                        }`}
                      >
                        {row.concurrencia}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Instant Topological Micro-Graph Canvas Simulator */}
          <div className="p-space-md rounded bg-[#191c21] shadow-sm flex flex-col gap-space-sm border border-[#3b494b]/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[16px] text-[#43ffbb]">bubble_chart</span>
                <span className="font-label-lg text-label-lg text-[#e1e2ea] font-semibold">
                  Topology Preview Mini-Canvas
                </span>
              </div>

              {/* Projection Mode Selector */}
              <div className="flex items-center bg-[#0b0e13] p-0.5 rounded font-code-dense text-code-dense border border-[#3b494b]/30">
                <button
                  type="button"
                  onClick={() => setProjectionMode('bipartite')}
                  className={`px-2 py-1 rounded font-semibold transition-colors cursor-pointer ${
                    projectionMode === 'bipartite'
                      ? 'bg-[#00f0ff] text-[#002022]'
                      : 'text-[#b9cacb] hover:text-[#e1e2ea]'
                  }`}
                >
                  Bipartite (E ↔ S)
                </button>
                <button
                  type="button"
                  onClick={() => setProjectionMode('monopartite')}
                  className={`px-2 py-1 rounded font-semibold transition-colors cursor-pointer ${
                    projectionMode === 'monopartite'
                      ? 'bg-[#43ffbb] text-[#003825]'
                      : 'text-[#b9cacb] hover:text-[#e1e2ea]'
                  }`}
                >
                  Co-occurrence
                </button>
              </div>
            </div>

            <p className="font-body-sm text-body-sm text-[#b9cacb]">
              Live reactive preview rendering sample of 10 parsed nodes & concurrent clusters based on the active bindings.
            </p>

            {/* Dynamic Micro Visual Canvas Container */}
            <div className="relative w-full h-80 rounded bg-[#0b0e13] overflow-hidden flex items-center justify-center border border-[#3b494b]/20">
              <div className="absolute inset-0 bg-[radial-gradient(#1d2025_1px,transparent_1px)] [background-size:16px_16px] opacity-70 pointer-events-none"></div>

              {/* Topology Diagram inline SVG */}
              <svg className="w-full h-full relative z-10" viewBox="0 0 460 280" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="cyanLine" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#43ffbb" stopOpacity="0.2" />
                  </linearGradient>
                  <linearGradient id="alertEdge" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffb4ab" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.3" />
                  </linearGradient>
                  <filter id="glowCyan" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Edges */}
                <line x1="140" y1="130" x2="230" y2="70" stroke="url(#alertEdge)" strokeWidth="3" />
                <line x1="140" y1="130" x2="230" y2="150" stroke="url(#cyanLine)" strokeWidth="2" />
                <line x1="140" y1="130" x2="230" y2="220" stroke="#3b494b" strokeWidth="1" />
                <line x1="330" y1="110" x2="230" y2="70" stroke="url(#cyanLine)" strokeWidth="2" />
                <line x1="330" y1="110" x2="230" y2="220" stroke="url(#cyanLine)" strokeWidth="2.5" />
                <line x1="90" y1="210" x2="230" y2="150" stroke="#3b494b" strokeWidth="1.5" />
                <line x1="360" y1="210" x2="230" y2="220" stroke="#3b494b" strokeWidth="1" />

                {/* Siniestros (Rhombuses) */}
                <g transform="translate(230, 70)" className="cursor-pointer hover:scale-110 transition-transform">
                  <rect x="-12" y="-12" width="24" height="24" transform="rotate(45)" fill="#191c21" stroke="#43ffbb" strokeWidth="1.5" />
                  <text x="0" y="22" fill="#43ffbb" fontSize="8" fontFamily="'JetBrains Mono', monospace" textAnchor="middle">
                    SIN_0001
                  </text>
                </g>

                <g transform="translate(230, 150)" className="cursor-pointer hover:scale-110 transition-transform">
                  <rect x="-14" y="-14" width="28" height="28" transform="rotate(45)" fill="#191c21" stroke="#ffb4ab" strokeWidth="2" filter="url(#glowCyan)" />
                  <text x="0" y="24" fill="#ffb4ab" fontSize="8" fontWeight="bold" fontFamily="'JetBrains Mono', monospace" textAnchor="middle">
                    SIN_0002 [7x]
                  </text>
                </g>

                <g transform="translate(230, 220)" className="cursor-pointer hover:scale-110 transition-transform">
                  <rect x="-11" y="-11" width="22" height="22" transform="rotate(45)" fill="#191c21" stroke="#43ffbb" strokeWidth="1.5" />
                  <text x="0" y="20" fill="#43ffbb" fontSize="8" fontFamily="'JetBrains Mono', monospace" textAnchor="middle">
                    SIN_0003
                  </text>
                </g>

                {/* Entities */}
                <g transform="translate(140, 130)" className="cursor-pointer">
                  <circle r="14" fill="#00363a" stroke="#00f0ff" strokeWidth="2" filter="url(#glowCyan)" />
                  <circle r="4" fill="#00f0ff" />
                  <text x="-18" y="-18" fill="#dbfcff" fontSize="9" fontWeight="600" fontFamily="'Inter', sans-serif" textAnchor="end">
                    Dr. Carlos Mendoza
                  </text>
                  <text x="-18" y="-9" fill="#43ffbb" fontSize="7" fontFamily="'JetBrains Mono', monospace" textAnchor="end">
                    [MÉDICO | DEG: 3]
                  </text>
                </g>

                <g transform="translate(330, 110)" className="cursor-pointer">
                  <circle r="12" fill="#00363a" stroke="#00f0ff" strokeWidth="1.5" />
                  <circle r="3" fill="#00f0ff" />
                  <text x="18" y="-10" fill="#dbfcff" fontSize="9" fontWeight="600" fontFamily="'Inter', sans-serif" textAnchor="start">
                    Xavier Estrada
                  </text>
                  <text x="18" y="-1" fill="#00dbe9" fontSize="7" fontFamily="'JetBrains Mono', monospace" textAnchor="start">
                    [ASESOR | DEG: 2]
                  </text>
                </g>

                <g transform="translate(90, 210)">
                  <circle r="9" fill="#1d2025" stroke="#849495" strokeWidth="1.5" />
                  <text x="0" y="18" fill="#b9cacb" fontSize="8" fontFamily="'Inter', sans-serif" textAnchor="middle">
                    Clínica San Gabriel
                  </text>
                </g>

                <g transform="translate(360, 210)">
                  <circle r="8" fill="#1d2025" stroke="#849495" strokeWidth="1" />
                  <text x="0" y="16" fill="#849495" fontSize="8" fontFamily="'Inter', sans-serif" textAnchor="middle">
                    Laura Peñaloza
                  </text>
                </g>
              </svg>

              {/* Floating mini-hud overlay */}
              <div className="absolute bottom-2 left-2 px-space-xs py-0.5 rounded bg-[#272a30]/80 backdrop-blur font-code-dense text-code-dense text-[#b9cacb] flex items-center gap-space-xs z-20 border border-[#3b494b]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#43ffbb]"></span>
                <span>Live Physics: Stabilized (10 Nodes, 7 Edges)</span>
              </div>

              <div className="absolute top-2 right-2 flex items-center gap-1 z-20">
                <button
                  type="button"
                  className="p-1 rounded bg-[#1d2025] text-[#b9cacb] hover:text-[#e1e2ea] cursor-pointer"
                  title="Center View"
                >
                  <span className="material-symbols-outlined text-[14px]">filter_center_focus</span>
                </button>
                <button
                  type="button"
                  className="p-1 rounded bg-[#1d2025] text-[#b9cacb] hover:text-[#e1e2ea] cursor-pointer"
                  title="Run Layout Physics"
                >
                  <span className="material-symbols-outlined text-[14px]">refresh</span>
                </button>
              </div>
            </div>

            {/* Node & Edge Projection Parameters Mini-Panel */}
            <div className="grid grid-cols-2 gap-space-sm pt-space-xs font-code-dense text-code-dense">
              <div className="p-space-xs rounded bg-[#0b0e13] flex items-center justify-between border border-[#3b494b]/20">
                <span className="text-[#849495]">Max Edge Tension</span>
                <span className="text-[#7df4ff]">0.82 N</span>
              </div>
              <div className="p-space-xs rounded bg-[#0b0e13] flex items-center justify-between border border-[#3b494b]/20">
                <span className="text-[#849495]">Clustering Modularity</span>
                <span className="text-[#43ffbb]">0.74 Q</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Workspace Status Bar */}
      <footer className="w-full bg-[#0b0e13] px-space-lg py-2 flex flex-col md:flex-row items-center justify-between gap-space-sm font-code-dense text-code-dense text-[#849495] border-t border-[#3b494b]/30 mt-auto">
        <div className="flex items-center gap-space-md">
          <span className="flex items-center gap-1 text-[#b9cacb]">
            <span className="material-symbols-outlined text-[14px] text-[#43ffbb]">memory</span>
            <span>Mapping Memory Footprint: 2.1 MB / 4.0 GB Allocation</span>
          </span>
          <span className="hidden lg:inline text-[#3b494b]">|</span>
          <span className="hidden lg:inline text-[#b9cacb]">
            Press <kbd className="px-1 py-0.5 rounded bg-[#1d2025] text-[#e1e2ea]">Ctrl+Enter</kbd> to compile graph
          </span>
        </div>
        <div className="flex items-center gap-space-sm">
          <span className="text-[#43ffbb]">Ready for Stage 3 (Taxonomy Normalization)</span>
          <span className="w-2 h-2 rounded-full bg-[#43ffbb]"></span>
        </div>
      </footer>
    </div>
  );
};
