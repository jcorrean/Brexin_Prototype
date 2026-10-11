import React, { useState, useMemo } from 'react';
import { LEADERBOARD_DATA } from '../data/dataset';

interface NetworkMetricsProps {
  onLocateInCanvas: (nodeId: string) => void;
  onOpenNodeInspector: (slugOrId: string) => void;
  onPushToDossier: () => void;
}

export const NetworkMetrics: React.FC<NetworkMetricsProps> = ({
  onLocateInCanvas,
  onOpenNodeInspector,
  onPushToDossier,
}) => {
  const [engine, setEngine] = useState<'betweenness' | 'degree' | 'eigen' | 'closeness'>('betweenness');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [louvainRunning, setLouvainRunning] = useState(false);
  const [katzCalculated, setKatzCalculated] = useState(false);

  // Filter & sort leaderboard
  const processedData = useMemo(() => {
    let list = [...LEADERBOARD_DATA];

    if (categoryFilter !== 'ALL') {
      list = list.filter((item) => {
        if (categoryFilter === 'MEDICO') return item.category === 'MÉDICO';
        if (categoryFilter === 'ASESOR') return item.category === 'ASESOR';
        if (categoryFilter === 'HOSPITAL') return item.category === 'HOSPITAL';
        if (categoryFilter === 'DOMICILIO') return item.category === 'DOMICILIO';
        if (categoryFilter === 'FUNERARIA') return item.category === 'FUNERARIA';
        if (categoryFilter === 'ASEGURADO') return item.category === 'ASEGURADO';
        return true;
      });
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (item) => item.name.toLowerCase().includes(q) || item.idCode.toLowerCase().includes(q)
      );
    }

    // Sort by chosen engine
    list.sort((a, b) => {
      if (engine === 'degree') return b.degree - a.degree;
      if (engine === 'eigen') return b.eigen - a.eigen;
      return b.betweenness - a.betweenness;
    });

    return list;
  }, [engine, categoryFilter, searchTerm]);

  const handleRunLouvain = () => {
    setLouvainRunning(true);
    setTimeout(() => {
      setLouvainRunning(false);
    }, 1200);
  };

  const handleDownloadMatrix = () => {
    const csvRows = [
      'Rank,Entity,Category,ID,Degree_Centrality,Betweenness_Centrality,Eigenvector,Concurrency',
      ...LEADERBOARD_DATA.map(
        (d) => `${d.rank},"${d.name}","${d.category}","${d.idCode}",${d.degree},${d.betweenness},${d.eigen},"${d.concurrency}"`
      ),
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GraphForge_Centrality_Matrix_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col w-full text-[#e1e2ea] bg-[#111319] font-body-md select-none">
      {/* ========================================== */}
      {/* TOP TELEMETRY & GLOBAL METRICS BAR         */}
      {/* ========================================== */}
      <section className="p-space-lg flex flex-col gap-space-md bg-[#0b0e13] border-b border-[#3b494b]/30">
        {/* Header Meta & Controls */}
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-space-md">
          <div className="flex flex-wrap items-center gap-space-sm">
            <div className="flex items-center gap-space-xs px-space-sm py-1 bg-[#1d2025] rounded border border-[#3b494b]/20">
              <span className="w-2 h-2 rounded-full bg-[#43ffbb] shadow-[0_0_8px_#43ffbb]"></span>
              <span className="font-label-sm text-label-sm uppercase text-[#43ffbb]">
                Algorithm Core Active
              </span>
            </div>
            <span className="font-code-dense text-code-dense text-[#849495]">|</span>
            <span className="font-code-dense text-code-dense text-[#b9cacb]">
              DATASET: <strong className="text-[#7df4ff]">Siniestros_Concurrencia_2026.csv</strong>
            </span>
            <span className="font-label-sm text-label-sm px-space-xs py-0.5 rounded bg-[#272a30] text-[#00dbe9]">
              N=99 Entities
            </span>
            <span className="font-label-sm text-label-sm px-space-xs py-0.5 rounded bg-[#272a30] text-[#00dbe9]">
              M=40 Claims
            </span>
            <span className="font-label-sm text-label-sm px-space-xs py-0.5 rounded bg-[#272a30] text-[#43ffbb]">
              E=320 Edges
            </span>
            <span className="font-label-sm text-label-sm px-space-sm py-0.5 rounded bg-[#93000a]/30 text-[#ffb4ab] flex items-center gap-1 border border-[#93000a]/40">
              <span className="material-symbols-outlined text-[13px]">warning</span>
              <span>Outliers: Top 5% (&gt;3σ)</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-space-sm w-full xl:w-auto">
            {/* Centrality Engine Selector */}
            <div className="flex items-center bg-[#191c21] rounded p-1 gap-1 border border-[#3b494b]/30">
              <span className="font-label-sm text-label-sm text-[#849495] pl-2 pr-1 hidden sm:inline uppercase">
                Engine:
              </span>
              <button
                type="button"
                onClick={() => setEngine('betweenness')}
                className={`px-space-sm py-1 rounded font-label-sm text-label-sm transition-all cursor-pointer ${
                  engine === 'betweenness'
                    ? 'bg-[#00f0ff] text-[#002022] font-semibold shadow-[0_0_10px_rgba(0,240,255,0.25)]'
                    : 'text-[#b9cacb] hover:text-[#e1e2ea] hover:bg-[#272a30]'
                }`}
              >
                Betweenness (Brokerage)
              </button>
              <button
                type="button"
                onClick={() => setEngine('degree')}
                className={`px-space-sm py-1 rounded font-label-sm text-label-sm transition-all cursor-pointer ${
                  engine === 'degree'
                    ? 'bg-[#00f0ff] text-[#002022] font-semibold shadow-[0_0_10px_rgba(0,240,255,0.25)]'
                    : 'text-[#b9cacb] hover:text-[#e1e2ea] hover:bg-[#272a30]'
                }`}
              >
                Degree (Hubs)
              </button>
              <button
                type="button"
                onClick={() => setEngine('eigen')}
                className={`px-space-sm py-1 rounded font-label-sm text-label-sm transition-all cursor-pointer hidden md:block ${
                  engine === 'eigen'
                    ? 'bg-[#00f0ff] text-[#002022] font-semibold shadow-[0_0_10px_rgba(0,240,255,0.25)]'
                    : 'text-[#b9cacb] hover:text-[#e1e2ea] hover:bg-[#272a30]'
                }`}
              >
                Eigenvector / PR
              </button>
              <button
                type="button"
                onClick={() => setEngine('closeness')}
                className={`px-space-sm py-1 rounded font-label-sm text-label-sm transition-all cursor-pointer hidden lg:block ${
                  engine === 'closeness'
                    ? 'bg-[#00f0ff] text-[#002022] font-semibold shadow-[0_0_10px_rgba(0,240,255,0.25)]'
                    : 'text-[#b9cacb] hover:text-[#e1e2ea] hover:bg-[#272a30]'
                }`}
              >
                Closeness
              </button>
            </div>

            {/* Action Triggers */}
            <button
              type="button"
              onClick={handleRunLouvain}
              className="flex items-center gap-1.5 px-space-md py-1.5 rounded bg-[#272a30] hover:bg-[#36393f] text-[#7df4ff] font-label-md text-label-md transition-all cursor-pointer border border-[#3b494b]/20"
            >
              <span className={`material-symbols-outlined text-[16px] text-[#43ffbb] ${louvainRunning ? 'animate-spin' : ''}`}>
                calculate
              </span>
              <span>{louvainRunning ? 'Running Q Matrix...' : 'Run Louvain v2.4'}</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadMatrix}
              className="flex items-center gap-1 px-space-sm py-1.5 rounded bg-[#191c21] hover:bg-[#272a30] text-[#b9cacb] font-label-sm text-label-sm transition-all cursor-pointer border border-[#3b494b]/20"
            >
              <span className="material-symbols-outlined text-[15px]">file_download</span>
              <span>Matrix [.CSV]</span>
            </button>
          </div>
        </div>

        {/* 6 Primary Forensic Metric Tiles with Micro Sparklines */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-space-sm">
          {/* Metric 1: Density */}
          <div className="bg-[#191c21] p-space-sm rounded flex flex-col justify-between hover:bg-[#1d2025] transition-all border border-[#3b494b]/20">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-[#849495] uppercase tracking-wider">Density</span>
              <span className="material-symbols-outlined text-[#849495] text-[16px]">grain</span>
            </div>
            <div className="my-1">
              <div className="font-label-lg text-label-lg font-bold text-[#7df4ff]">0.065</div>
              <div className="font-code-dense text-[10px] text-[#b9cacb] truncate">Sparse Bipartite Multi-hub</div>
            </div>
            <svg className="w-full h-4 text-[#00dbe9]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path d="M0,15 Q25,18 40,8 T80,12 T100,5"></path>
            </svg>
          </div>

          {/* Metric 2: Avg Degree */}
          <div className="bg-[#191c21] p-space-sm rounded flex flex-col justify-between hover:bg-[#1d2025] transition-all border border-[#3b494b]/20">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-[#849495] uppercase tracking-wider">Avg Degree (k̄)</span>
              <span className="material-symbols-outlined text-[#43ffbb] text-[16px]">share</span>
            </div>
            <div className="my-1">
              <div className="font-label-lg text-label-lg font-bold text-[#43ffbb]">
                6.46 <span className="font-code-dense text-[10px] text-[#849495]">edges/node</span>
              </div>
              <div className="font-code-dense text-[10px] text-[#b9cacb]">Max Node k=34 (Xavier E.)</div>
            </div>
            <svg className="w-full h-4 text-[#43ffbb]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path d="M0,18 L15,16 L35,17 L50,11 L65,13 L85,4 L100,2"></path>
            </svg>
          </div>

          {/* Metric 3: Clustering Coeff */}
          <div className="bg-[#191c21] p-space-sm rounded flex flex-col justify-between hover:bg-[#1d2025] transition-all border border-[#3b494b]/20">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-[#849495] uppercase tracking-wider">Clustering (C)</span>
              <span className="material-symbols-outlined text-[#00dbe9] text-[16px]">network_node</span>
            </div>
            <div className="my-1">
              <div className="font-label-lg text-label-lg font-bold text-[#00dbe9]">0.584</div>
              <div className="font-code-dense text-[10px] text-[#43ffbb] font-medium">High Triadic Closure</div>
            </div>
            <svg className="w-full h-4 text-[#00dbe9]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path d="M0,12 C20,10 40,16 60,6 C80,2 90,8 100,3"></path>
            </svg>
          </div>

          {/* Metric 4: Modularity */}
          <div className="bg-[#191c21] p-space-sm rounded flex flex-col justify-between hover:bg-[#1d2025] transition-all border border-[#3b494b]/20">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-[#849495] uppercase tracking-wider">Modularity (Q)</span>
              <span className="material-symbols-outlined text-[#ffb4ab] text-[16px]">bubble_chart</span>
            </div>
            <div className="my-1">
              <div className="font-label-lg text-label-lg font-bold text-[#ffb4ab]">0.642</div>
              <div className="font-code-dense text-[10px] text-[#b9cacb]">4 Segregated Rings</div>
            </div>
            <svg className="w-full h-4 text-[#ffb4ab]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path d="M0,16 C30,14 45,5 70,7 C85,9 95,2 100,1"></path>
            </svg>
          </div>

          {/* Metric 5: Path Length */}
          <div className="bg-[#191c21] p-space-sm rounded flex flex-col justify-between hover:bg-[#1d2025] transition-all border border-[#3b494b]/20">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-[#849495] uppercase tracking-wider">Avg Path Length</span>
              <span className="material-symbols-outlined text-[#849495] text-[16px]">route</span>
            </div>
            <div className="my-1">
              <div className="font-label-lg text-label-lg font-bold text-[#e1e2ea]">
                2.84 <span className="font-code-dense text-[10px] text-[#849495]">hops</span>
              </div>
              <div className="font-code-dense text-[10px] text-[#b9cacb]">Rapid Fraud Collusion</div>
            </div>
            <svg className="w-full h-4 text-[#849495]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path d="M0,8 L20,10 L40,9 L60,14 L80,11 L100,12"></path>
            </svg>
          </div>

          {/* Metric 6: Network Diameter */}
          <div className="bg-[#191c21] p-space-sm rounded flex flex-col justify-between hover:bg-[#1d2025] transition-all border border-[#3b494b]/20">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-[#849495] uppercase tracking-wider">Diameter</span>
              <span className="material-symbols-outlined text-[#849495] text-[16px]">straighten</span>
            </div>
            <div className="my-1">
              <div className="font-label-lg text-label-lg font-bold text-[#e1e2ea]">
                5 <span className="font-code-dense text-[10px] text-[#849495]">hops</span>
              </div>
              <div className="font-code-dense text-[10px] text-[#b9cacb]">Compact Giant Component</div>
            </div>
            <svg className="w-full h-4 text-[#43ffbb]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path d="M0,14 L30,12 L50,15 L70,8 L90,6 L100,7"></path>
            </svg>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* MAIN WORKSPACE: 65% / 35% CENTRAL SPLIT     */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-md p-space-lg">
        {/* ======================================== */}
        {/* LEFT COLUMN: LEADERBOARD (~65%)          */}
        {/* ======================================== */}
        <section className="xl:col-span-7 flex flex-col gap-space-md bg-[#0b0e13] p-space-md rounded border border-[#3b494b]/30">
          {/* Table Header & Entity Class Filters */}
          <div className="flex flex-col gap-space-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-headline-md text-headline-md text-[#7df4ff]">
                    Forensic Centrality Leaderboard
                  </span>
                  <span className="font-code-dense text-code-dense text-[#43ffbb] bg-[#272a30] px-1.5 py-0.5 rounded">
                    SORT: C_{engine.toUpperCase()} DESC
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-[#b9cacb]">
                  Nodes flagged by structural bridging capacity across independent claim cohorts.
                </p>
              </div>

              <div className="flex items-center gap-space-xs w-full sm:w-auto">
                <div className="relative flex-1 sm:w-48">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search node hash..."
                    className="w-full bg-[#191c21] text-[#e1e2ea] text-body-sm pl-7 pr-space-sm py-1 rounded placeholder:text-[#849495] focus:outline-none focus:ring-1 focus:ring-[#00f0ff] border border-[#3b494b]/30"
                  />
                  <span className="material-symbols-outlined absolute left-1.5 top-1.5 text-[15px] text-[#849495]">
                    search
                  </span>
                </div>
                <button
                  type="button"
                  className="p-1 rounded bg-[#191c21] hover:bg-[#1d2025] text-[#b9cacb] border border-[#3b494b]/30 cursor-pointer"
                  title="Filter Settings"
                >
                  <span className="material-symbols-outlined text-[18px]">tune</span>
                </button>
              </div>
            </div>

            {/* Filter Pill Carousel */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
              {[
                { label: 'All Entities (99)', value: 'ALL' },
                { label: 'Médicos (13)', value: 'MEDICO' },
                { label: 'Asesores (13)', value: 'ASESOR' },
                { label: 'Hospitales (10)', value: 'HOSPITAL' },
                { label: 'Domicilios (14)', value: 'DOMICILIO' },
                { label: 'Funerarias (8)', value: 'FUNERARIA' },
                { label: 'Asegurados (18)', value: 'ASEGURADO' },
              ].map((pill) => (
                <button
                  key={pill.value}
                  type="button"
                  onClick={() => setCategoryFilter(pill.value)}
                  className={`px-space-sm py-1 rounded font-label-sm text-label-sm shrink-0 transition-colors cursor-pointer ${
                    categoryFilter === pill.value
                      ? 'bg-[#00f0ff] text-[#002022] font-semibold'
                      : 'bg-[#191c21] hover:bg-[#1d2025] text-[#b9cacb]'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* High Density Mathematical Centrality Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#272a30]/60 text-[#849495] font-label-sm text-label-sm uppercase">
                  <th className="py-2 px-space-sm">#</th>
                  <th className="py-2 px-space-sm">Entity Identifier & Category</th>
                  <th className="py-2 px-space-sm text-right">Degree (C_D)</th>
                  <th className="py-2 px-space-sm text-right">Betweenness (C_B)</th>
                  <th className="py-2 px-space-sm text-right">Eigen (C_E)</th>
                  <th className="py-2 px-space-sm text-center">Concurrency</th>
                  <th className="py-2 px-space-sm">Classification & Risk Flag</th>
                  <th className="py-2 px-space-sm text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="font-code-dense text-code-dense divide-y divide-[#1d2025]">
                {processedData.map((row) => (
                  <tr
                    key={row.rank}
                    className="bg-[#191c21]/80 hover:bg-[#272a30]/50 transition-colors group"
                  >
                    <td className="py-2.5 px-space-sm text-[#7df4ff] font-bold">{row.rank}</td>
                    <td className="py-2.5 px-space-sm">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor: row.indicatorColor,
                            boxShadow: `0 0 6px ${row.indicatorColor}`,
                          }}
                        ></span>
                        <div>
                          <div className="text-[#e1e2ea] font-semibold text-body-sm group-hover:text-[#7df4ff] transition-colors">
                            {row.name}
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="font-label-sm text-[9px] px-1 py-0.2 rounded bg-[#32353b] text-[#00dbe9]">
                              {row.category}
                            </span>
                            <span className="text-[9px] text-[#849495]">{row.idCode}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-space-sm text-right">
                      <span className="text-[#e1e2ea] font-semibold">{row.degree.toFixed(3)}</span>
                      <div className="w-16 h-1 bg-[#32353b] ml-auto mt-1 rounded overflow-hidden">
                        <div
                          className="bg-[#00f0ff] h-full"
                          style={{ width: `${Math.min(100, row.degree * 100)}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="py-2.5 px-space-sm text-right">
                      <span className="text-[#ffb4ab] font-bold">{row.betweenness.toFixed(3)}</span>
                      <div className="w-16 h-1 bg-[#32353b] ml-auto mt-1 rounded overflow-hidden">
                        <div
                          className="bg-[#ffb4ab] h-full"
                          style={{ width: `${Math.min(100, row.betweenness * 200)}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="py-2.5 px-space-sm text-right">
                      <span className="text-[#43ffbb] font-semibold">{row.eigen.toFixed(3)}</span>
                      <div className="w-16 h-1 bg-[#32353b] ml-auto mt-1 rounded overflow-hidden">
                        <div
                          className="bg-[#43ffbb] h-full"
                          style={{ width: `${Math.min(100, row.eigen * 100)}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="py-2.5 px-space-sm text-center">
                      <span className="font-label-md text-label-md px-1.5 py-0.5 rounded bg-[#32353b] text-[#7df4ff]">
                        {row.concurrency}
                      </span>
                    </td>
                    <td className="py-2.5 px-space-sm">
                      <span
                        className={`font-label-sm text-[10px] px-2 py-0.5 rounded font-semibold flex items-center gap-1 w-fit ${
                          row.riskClass === 'error'
                            ? 'bg-[#93000a]/30 text-[#ffb4ab]'
                            : row.riskClass === 'amber'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-[#272a30] text-[#7df4ff]'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            row.riskClass === 'error'
                              ? 'bg-[#ffb4ab] animate-ping'
                              : row.riskClass === 'amber'
                              ? 'bg-amber-400'
                              : 'bg-[#00f0ff]'
                          }`}
                        ></span>
                        {row.riskFlag}
                      </span>
                    </td>
                    <td className="py-2.5 px-space-sm text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onLocateInCanvas(row.slug)}
                          className="p-1 rounded hover:bg-[#36393f] text-[#00dbe9] cursor-pointer"
                          title="Locate in WebGPU Canvas"
                        >
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenNodeInspector(row.slug)}
                          className="p-1 rounded hover:bg-[#36393f] text-[#b9cacb] hover:text-[#e1e2ea] cursor-pointer"
                          title="Sub-graph Dossier"
                        >
                          <span className="material-symbols-outlined text-[16px]">account_tree</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination & Density Stats Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between text-[#849495] font-label-sm text-label-sm pt-space-xs gap-2 border-t border-[#3b494b]/20">
            <div className="flex items-center gap-2">
              <span>Displaying {processedData.length} of 99 entities</span>
              <span className="text-[#3b494b]">|</span>
              <span className="text-[#b9cacb]">Normalized Matrix: Min-Max (0.000 - 1.000)</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage(Math.max(1, page - 1))}
                className="px-2 py-1 rounded bg-[#1d2025] text-[#e1e2ea] hover:bg-[#272a30] cursor-pointer"
              >
                Prev
              </button>
              <span className="px-2 py-1 text-[#7df4ff] font-bold">{page}</span>
              <button
                type="button"
                onClick={() => setPage(page + 1)}
                className="px-2 py-1 rounded bg-[#1d2025] text-[#e1e2ea] hover:bg-[#272a30] cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </section>

        {/* ======================================== */}
        {/* RIGHT COLUMN: CURVES & CLUSTERS (~35%)   */}
        {/* ======================================== */}
        <div className="xl:col-span-5 flex flex-col gap-space-md">
          {/* Card 1: Degree Distribution & Power Law Diagnostic */}
          <div className="bg-[#0b0e13] p-space-md rounded flex flex-col gap-space-sm border border-[#3b494b]/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#43ffbb] text-[18px]">query_stats</span>
                <span className="font-headline-md text-headline-md text-[#e1e2ea]">
                  Degree Distribution & Scale-Free Fit
                </span>
              </div>
              <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-[#1d2025] text-[#7df4ff] font-mono">
                P(k) ~ k^-γ
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-[#b9cacb]">
              Heavy-tail scale-free topology verification. Power-law exponent{' '}
              <strong className="text-[#43ffbb]">γ = 2.14</strong> indicates deliberate artificial hub consolidation
              rather than random Poisson claims noise.
            </p>

            {/* Synthetic vs Observed SVG Chart */}
            <div className="bg-[#191c21] p-space-sm rounded relative border border-[#3b494b]/20">
              <div className="flex items-center justify-between text-[10px] font-code-dense text-[#849495] mb-1">
                <span>Probability P(k)</span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-0.5 bg-[#849495]"></span> Poisson Null-Hypothesis
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-0.5 bg-[#43ffbb]"></span> Observed Forensic Tail
                  </span>
                </div>
              </div>

              <svg className="w-full h-32" viewBox="0 0 320 120" preserveAspectRatio="none">
                {/* Grid lines */}
                <line x1="0" y1="30" x2="320" y2="30" stroke="#1d2025" strokeDasharray="3 3" strokeWidth="1" />
                <line x1="0" y1="60" x2="320" y2="60" stroke="#1d2025" strokeDasharray="3 3" strokeWidth="1" />
                <line x1="0" y1="90" x2="320" y2="90" stroke="#1d2025" strokeDasharray="3 3" strokeWidth="1" />

                {/* Poisson Curve */}
                <path
                  d="M 10 110 Q 50 15, 90 95 T 160 115 L 310 118"
                  fill="none"
                  stroke="#849495"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                  opacity="0.5"
                />

                {/* Power-law Heavy Tail */}
                <path
                  d="M 10 10 Q 30 50, 70 85 T 150 100 T 240 105 T 310 108"
                  fill="none"
                  stroke="#43ffbb"
                  strokeWidth="2.5"
                  filter="drop-shadow(0 0 6px rgba(67,255,187,0.4))"
                />

                {/* Hub Points */}
                <circle cx="270" cy="106" r="4" fill="#00f0ff" />
                <circle cx="295" cy="107" r="4.5" fill="#ffb4ab" />
                <circle cx="310" cy="108" r="5" fill="#ffb4ab" />

                <text x="225" y="96" fill="#00f0ff" fontSize="9" fontFamily="JetBrains Mono">
                  Synthetic Hubs (&gt;3σ)
                </text>
              </svg>

              <div className="flex items-center justify-between text-[10px] font-code-dense text-[#849495] mt-1">
                <span>k = 1 (Peripheral)</span>
                <span>k = 12</span>
                <span>k = 24</span>
                <span className="text-[#ffb4ab] font-semibold">k = 34 (Extreme Hub)</span>
              </div>
            </div>
          </div>

          {/* Card 2: Detected Louvain Fraud Communities */}
          <div className="bg-[#0b0e13] p-space-md rounded flex flex-col gap-space-sm border border-[#3b494b]/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ffb4ab] text-[18px]">hub</span>
                <span className="font-headline-md text-headline-md text-[#e1e2ea]">
                  Detected Fraud Rings (Louvain)
                </span>
              </div>
              <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-[#272a30] text-[#43ffbb]">
                Q = 0.642
              </span>
            </div>

            <div className="flex flex-col gap-space-xs">
              {/* Cluster Alpha */}
              <div
                onClick={() => onOpenNodeInspector('xavier-estrada')}
                className="p-space-sm rounded bg-[#191c21] hover:bg-[#1d2025] transition-all flex flex-col gap-1.5 border border-[#3b494b]/20 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ffb4ab] shadow-[0_0_8px_#ffb4ab]"></span>
                    <span className="font-body-sm text-body-sm font-semibold text-[#7df4ff]">
                      Cluster Alpha: Insurgentes-Mendoza Ring
                    </span>
                  </div>
                  <span className="font-label-sm text-[10px] px-2 py-0.5 rounded bg-[#93000a]/40 text-[#ffb4ab] font-bold">
                    CRITICAL 93/100
                  </span>
                </div>
                <div className="flex items-center justify-between font-code-dense text-code-dense text-[#b9cacb]">
                  <span>
                    Nodes: <strong className="text-[#e1e2ea]">42</strong> | Density:{' '}
                    <strong className="text-[#e1e2ea]">0.38</strong>
                  </span>
                  <span>
                    Intra-edges: <strong className="text-[#43ffbb]">168</strong>
                  </span>
                </div>
                <div className="text-[11px] text-[#849495] font-body-sm truncate">
                  Primary Articulations:{' '}
                  <span className="text-[#b9cacb]">Dr. Carlos Mendoza, Xavier Estrada, Av. Insurgentes Sur 1420</span>
                </div>
              </div>

              {/* Cluster Beta */}
              <div
                onClick={() => onOpenNodeInspector('hospital-metropolitano')}
                className="p-space-sm rounded bg-[#191c21] hover:bg-[#1d2025] transition-all flex flex-col gap-1.5 border border-[#3b494b]/20 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                    <span className="font-body-sm text-body-sm font-semibold text-[#7df4ff]">
                      Cluster Beta: Metropolitano-Silva Ring
                    </span>
                  </div>
                  <span className="font-label-sm text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                    ELEVATED 74/100
                  </span>
                </div>
                <div className="flex items-center justify-between font-code-dense text-code-dense text-[#b9cacb]">
                  <span>
                    Nodes: <strong className="text-[#e1e2ea]">26</strong> | Density:{' '}
                    <strong className="text-[#e1e2ea]">0.29</strong>
                  </span>
                  <span>
                    Intra-edges: <strong className="text-[#43ffbb]">82</strong>
                  </span>
                </div>
                <div className="text-[11px] text-[#849495] font-body-sm truncate">
                  Primary Articulations:{' '}
                  <span className="text-[#b9cacb]">Hospital Metropolitano, César Augusto Silva, Gayosso Sullivan</span>
                </div>
              </div>

              {/* Cluster Gamma */}
              <div className="p-space-sm rounded bg-[#191c21] hover:bg-[#1d2025] transition-all flex flex-col gap-1.5 border border-[#3b494b]/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00dbe9]"></span>
                    <span className="font-body-sm text-body-sm font-semibold text-[#e1e2ea]">
                      Cluster Gamma: Sur Hospitalario / Tlalpan Ring
                    </span>
                  </div>
                  <span className="font-label-sm text-[10px] px-2 py-0.5 rounded bg-[#272a30] text-[#7df4ff] font-bold">
                    MODERATE 51/100
                  </span>
                </div>
                <div className="flex items-center justify-between font-code-dense text-code-dense text-[#b9cacb]">
                  <span>
                    Nodes: <strong className="text-[#e1e2ea]">18</strong> | Density:{' '}
                    <strong className="text-[#e1e2ea]">0.22</strong>
                  </span>
                  <span>
                    Intra-edges: <strong className="text-[#43ffbb]">46</strong>
                  </span>
                </div>
                <div className="text-[11px] text-[#849495] font-body-sm truncate">
                  Primary Articulations:{' '}
                  <span className="text-[#b9cacb]">Av. Tlalpan 2400, Dr. Daniel Solares</span>
                </div>
              </div>

              {/* Cluster Delta */}
              <div className="p-space-sm rounded bg-[#191c21] hover:bg-[#1d2025] transition-all flex flex-col gap-1.5 opacity-70 border border-[#3b494b]/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#849495]"></span>
                    <span className="font-body-sm text-body-sm font-semibold text-[#b9cacb]">
                      Cluster Delta: Fringe Non-Collusive Claims
                    </span>
                  </div>
                  <span className="font-label-sm text-[10px] px-2 py-0.5 rounded bg-[#272a30] text-[#849495]">
                    LOW 18/100
                  </span>
                </div>
                <div className="flex items-center justify-between font-code-dense text-code-dense text-[#849495]">
                  <span>Nodes: 13 | Density: 0.09</span>
                  <span>Intra-edges: 24</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Centrality Correlation Matrix */}
          <div className="bg-[#0b0e13] p-space-md rounded flex flex-col gap-space-sm border border-[#3b494b]/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#7df4ff] text-[18px]">scatter_plot</span>
                <span className="font-headline-md text-headline-md text-[#e1e2ea]">
                  Brokerage vs Degree Topology
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-[#849495]">C_D × C_B Scatter</span>
            </div>

            <div className="bg-[#191c21] p-space-sm rounded relative border border-[#3b494b]/20">
              <svg className="w-full h-36" viewBox="0 0 300 140">
                {/* Axis lines */}
                <line x1="150" y1="10" x2="150" y2="130" stroke="#272a30" strokeWidth="1" />
                <line x1="10" y1="70" x2="290" y2="70" stroke="#272a30" strokeWidth="1" />

                {/* Quadrant Labels */}
                <text x="18" y="24" fill="#849495" fontSize="8" fontFamily="JetBrains Mono">
                  Q1: GATEKEEPERS / BRIDGES (High C_B)
                </text>
                <text x="160" y="24" fill="#ffb4ab" fontSize="8" fontWeight="600" fontFamily="JetBrains Mono">
                  Q2: CRITICAL COORDINATORS (Dual Hub)
                </text>
                <text x="18" y="125" fill="#849495" fontSize="8" fontFamily="JetBrains Mono">
                  Q3: PERIPHERAL / ISOLATED
                </text>
                <text x="175" y="125" fill="#849495" fontSize="8" fontFamily="JetBrains Mono">
                  Q4: PURE CONDUIT HUBS (High C_D)
                </text>

                {/* Scattered Nodes */}
                <circle cx="35" cy="110" r="2.5" fill="#849495" opacity="0.4" />
                <circle cx="48" cy="98" r="2" fill="#849495" opacity="0.4" />
                <circle cx="62" cy="115" r="3" fill="#849495" opacity="0.4" />
                <circle cx="75" cy="105" r="2.5" fill="#849495" opacity="0.4" />
                <circle cx="90" cy="112" r="2" fill="#849495" opacity="0.4" />
                <circle cx="110" cy="92" r="3" fill="#849495" opacity="0.5" />
                <circle cx="125" cy="85" r="3.5" fill="#00dbe9" opacity="0.6" />

                {/* Top-left quadrant */}
                <circle cx="85" cy="45" r="3.5" fill="#ffd9dc" opacity="0.7" />
                <circle cx="115" cy="38" r="4" fill="#ffd9dc" opacity="0.7" />

                {/* Bottom-right quadrant */}
                <circle cx="210" cy="82" r="4.5" fill="#43ffbb" opacity="0.7" />
                <circle cx="230" cy="95" r="4" fill="#43ffbb" opacity="0.7" />
                <circle cx="245" cy="88" r="4.5" fill="#43ffbb" opacity="0.7" />

                {/* Top Right: Outliers */}
                <circle
                  cx="230"
                  cy="42"
                  r="5"
                  fill="#ffb4ab"
                  filter="drop-shadow(0 0 6px #ffb4ab)"
                  className="cursor-pointer"
                  onClick={() => onOpenNodeInspector('insurgentes-1420')}
                />
                <text x="180" y="52" fill="#e1e2ea" fontSize="7.5" fontFamily="JetBrains Mono">
                  Insurgentes 1420
                </text>

                <circle
                  cx="265"
                  cy="30"
                  r="6"
                  fill="#ffb4ab"
                  filter="drop-shadow(0 0 8px #ffb4ab)"
                  className="cursor-pointer"
                  onClick={() => onOpenNodeInspector('carlos-mendoza')}
                />
                <text x="215" y="22" fill="#ffd9dc" fontSize="8" fontWeight="bold" fontFamily="JetBrains Mono">
                  Dr. Mendoza
                </text>

                <circle
                  cx="282"
                  cy="24"
                  r="7"
                  fill="#00f0ff"
                  filter="drop-shadow(0 0 10px #00f0ff)"
                  className="cursor-pointer"
                  onClick={() => onOpenNodeInspector('xavier-estrada')}
                />
                <text x="238" y="14" fill="#00f0ff" fontSize="8.5" fontWeight="bold" fontFamily="JetBrains Mono">
                  Xavier Estrada
                </text>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* FORENSIC SUMMARY FOOTER / AUDIT ACTION BAR */}
      {/* ========================================== */}
      <section className="p-space-lg bg-[#191c21] flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md border-t border-[#3b494b]/30 mt-auto">
        <div className="flex items-start gap-space-sm max-w-2xl">
          <div className="p-2 rounded bg-[#93000a]/30 text-[#ffb4ab] shrink-0 border border-[#93000a]/40">
            <span className="material-symbols-outlined text-[24px]">crisis_alert</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-headline-md text-headline-md text-[#7df4ff]">
                Graph Articulation Points Detected (k=3)
              </span>
              <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-[#ffb4ab] text-[#690005] font-bold">
                SEVERITY: CRITICAL
              </span>
            </div>
            <p className="font-body-md text-body-md text-[#b9cacb] mt-0.5">
              Simulated node removal of <strong className="text-[#e1e2ea]">Xavier Estrada</strong>,{' '}
              <strong className="text-[#e1e2ea]">Dr. Carlos Mendoza</strong>, and{' '}
              <strong className="text-[#e1e2ea]">Av. Insurgentes Sur 1420</strong> fractures{' '}
              <strong className="text-[#43ffbb]">68.4%</strong> of global network biconnectivity, isolating the fraud
              rings into disjoint subgraphs.
            </p>
          </div>
        </div>

        {/* Forensic Primary Action Triggers */}
        <div className="flex flex-wrap items-center gap-space-sm shrink-0 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setKatzCalculated(!katzCalculated)}
            className="flex items-center gap-1.5 px-space-md py-2 rounded bg-[#272a30] hover:bg-[#36393f] text-[#e1e2ea] font-label-md text-label-md transition-all cursor-pointer border border-[#3b494b]/20"
          >
            <span className="material-symbols-outlined text-[16px] text-[#00dbe9]">function</span>
            <span>{katzCalculated ? 'Katz Matrix (α=0.15) Ready' : 'Compute Katz Matrix'}</span>
          </button>

          <button
            type="button"
            onClick={onPushToDossier}
            className="flex items-center gap-1.5 px-space-md py-2 rounded bg-[#00f0ff] hover:bg-[#00dbe9] text-[#002022] font-label-md text-label-md font-semibold transition-all shadow-[0_0_16px_rgba(0,240,255,0.3)] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span>Push Anomalies to Intelligence Dossier</span>
          </button>
        </div>
      </section>
    </div>
  );
};
