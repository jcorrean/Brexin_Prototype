import React, { useState } from 'react';

export type NavTab = 'graph-explorer' | 'csv-data-pipeline' | 'network-metrics-and-centrality' | 'export-and-report';

interface HeaderProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenUpload: () => void;
  physicsActive: boolean;
  onTogglePhysics: () => void;
  datasetName: string;
  onSelectDataset?: (name: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenUpload,
  physicsActive,
  onTogglePhysics,
  datasetName,
  onSelectDataset,
}) => {
  const [showDatasetMenu, setShowDatasetMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const availableDatasets = [
    'Siniestros_Concurrencia_2026.csv',
    'Red_Colusion_Metropolitana_Q1.csv',
    'Fraude_Patrimonial_Vida_2025.csv',
  ];

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-[#0b0e13]/90 backdrop-blur-xl border-b border-[#3b494b]/30 flex items-center justify-between px-space-lg">
      <div className="flex items-center gap-space-lg">
        {/* Brand identity */}
        <div 
          className="flex items-center gap-space-sm cursor-pointer select-none"
          onClick={() => onSelectTab('graph-explorer')}
        >
          <img
            alt="GraphForge Logo"
            className="h-8 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida/AEtjO1WRoVwQXFQ6TP4UWBt7HH8TQngtapeS-12nWQFVyndxnaKPKegDKpjpG8ZKi3C5JUrkZklAQG2LuK84zFN1h8RB1VZnNiL56GQPeyKcJiLZ8gqcwkDGIv0QFBt1wKhP7wvxmUinzIDF4dNOV5JwCys21U80mUOltgfgB3wZxy50kYfvgWXlRu3p-ucNb9hDPfdRpsSiwZZaLyu_v5VfBZR88CLditdeGLfkvv-8lbE5UoCsxdlOk68"
          />
          <span className="font-headline-md text-headline-md tracking-tight text-[#7df4ff]">
            GraphForge Studio
          </span>
          <span className="font-label-sm text-label-sm px-space-xs py-0.5 rounded bg-[#272a30] text-[#43ffbb] border border-[#43ffbb]/20">
            v2.4 Pro
          </span>
        </div>

        <div className="h-4 w-px bg-[#3b494b]/40 hidden md:block"></div>

        {/* Dataset Pill Selector */}
        <div className="relative hidden md:block">
          <button
            type="button"
            onClick={() => setShowDatasetMenu(!showDatasetMenu)}
            className="flex items-center gap-space-xs px-space-sm py-1 rounded bg-[#191c21] border border-[#3b494b]/30 cursor-pointer hover:border-[#00dbe9]/50 transition-colors"
          >
            <span className="material-symbols-outlined text-[14px] text-[#00dbe9]">dataset</span>
            <span className="font-code-dense text-code-dense text-[#b9cacb] font-medium max-w-[200px] truncate">
              {datasetName}
            </span>
            <span className="material-symbols-outlined text-[14px] text-[#849495]">arrow_drop_down</span>
          </button>

          {showDatasetMenu && (
            <div className="absolute left-0 top-full mt-1.5 w-64 bg-[#191c21] border border-[#3b494b]/40 rounded-lg shadow-2xl py-1 z-50">
              <div className="px-3 py-1 text-[10px] font-code-dense uppercase text-[#849495]">
                Switch Active Dataset:
              </div>
              {availableDatasets.map((ds) => (
                <button
                  key={ds}
                  type="button"
                  className={`w-full text-left px-3 py-2 text-xs font-code-dense flex items-center justify-between hover:bg-[#272a30] transition-colors ${
                    ds === datasetName ? 'text-[#00f0ff] font-semibold bg-[#272a30]/50' : 'text-[#e1e2ea]'
                  }`}
                  onClick={() => {
                    onSelectDataset?.(ds);
                    setShowDatasetMenu(false);
                  }}
                >
                  <span className="truncate">{ds}</span>
                  {ds === datasetName && (
                    <span className="material-symbols-outlined text-[14px] text-[#00f0ff]">check</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Top Navigation Tabs */}
        <nav className="hidden xl:flex items-center gap-1 ml-space-md">
          <button
            type="button"
            onClick={() => onSelectTab('graph-explorer')}
            className={`px-space-md py-1.5 rounded font-label-md text-label-md transition-colors cursor-pointer ${
              currentTab === 'graph-explorer'
                ? 'bg-[#272a30] text-[#7df4ff] border border-[#00f0ff]/30 shadow-[0_0_10px_rgba(0,240,255,0.15)] font-semibold'
                : 'text-[#b9cacb] hover:text-[#e1e2ea] hover:bg-[#272a30]'
            }`}
          >
            Graph Explorer
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('csv-data-pipeline')}
            className={`px-space-md py-1.5 rounded font-label-md text-label-md transition-colors cursor-pointer ${
              currentTab === 'csv-data-pipeline'
                ? 'bg-[#272a30] text-[#7df4ff] border border-[#00f0ff]/30 shadow-[0_0_10px_rgba(0,240,255,0.15)] font-semibold'
                : 'text-[#b9cacb] hover:text-[#e1e2ea] hover:bg-[#272a30]'
            }`}
          >
            CSV Data Pipeline
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('network-metrics-and-centrality')}
            className={`px-space-md py-1.5 rounded font-label-md text-label-md transition-colors cursor-pointer ${
              currentTab === 'network-metrics-and-centrality'
                ? 'bg-[#272a30] text-[#7df4ff] border border-[#00f0ff]/30 shadow-[0_0_10px_rgba(0,240,255,0.15)] font-semibold'
                : 'text-[#b9cacb] hover:text-[#e1e2ea] hover:bg-[#272a30]'
            }`}
          >
            Network Metrics & Centrality
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('export-and-report')}
            className={`px-space-md py-1.5 rounded font-label-md text-label-md transition-colors cursor-pointer ${
              currentTab === 'export-and-report'
                ? 'bg-[#272a30] text-[#7df4ff] border border-[#00f0ff]/30 shadow-[0_0_10px_rgba(0,240,255,0.15)] font-semibold'
                : 'text-[#b9cacb] hover:text-[#e1e2ea] hover:bg-[#272a30]'
            }`}
          >
            Export & Report
          </button>
        </nav>
      </div>

      {/* Action Cluster */}
      <div className="flex items-center gap-space-md">
        <button
          type="button"
          onClick={onOpenUpload}
          className="flex items-center gap-space-xs px-space-md py-1.5 rounded bg-[#00f0ff] text-[#002022] font-label-md text-label-md font-semibold hover:bg-[#00dbe9] transition-all shadow-[0_0_12px_rgba(0,240,255,0.25)] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">upload_file</span>
          <span>Upload Edge List</span>
        </button>

        <div className="flex items-center gap-1 bg-[#191c21] p-1 rounded border border-[#3b494b]/20">
          <button
            type="button"
            onClick={onTogglePhysics}
            className={`w-8 h-8 rounded flex items-center justify-center transition-colors cursor-pointer ${
              physicsActive
                ? 'text-[#43ffbb] hover:bg-[#272a30] hover:text-[#43ffbb]'
                : 'text-[#849495] hover:bg-[#272a30] hover:text-[#e1e2ea]'
            }`}
            title={physicsActive ? 'Pause Physics Engine' : 'Resume Physics Engine'}
          >
            <span className="material-symbols-outlined text-[18px]">hub</span>
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="w-8 h-8 rounded flex items-center justify-center text-[#b9cacb] hover:bg-[#272a30] hover:text-[#e1e2ea] transition-colors cursor-pointer"
            title="Toggle Fullscreen"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-space-sm pl-space-xs border-l border-[#3b494b]/30">
          <div className="w-8 h-8 rounded-full bg-[#dbfcff] flex items-center justify-center shadow-[0_0_8px_rgba(219,252,255,0.4)]">
            <span className="material-symbols-outlined text-[#00363a] text-[18px]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
};
