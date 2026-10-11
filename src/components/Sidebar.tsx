import React from 'react';
import { NavTab } from './Header';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  activeNodesCount?: number;
  renderedEdgesCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  activeNodesCount = 14820,
  renderedEdgesCount = 48194,
}) => {
  const navItems = [
    {
      id: 'graph-explorer' as NavTab,
      label: 'Topology Canvas',
      icon: 'bubble_chart',
    },
    {
      id: 'csv-data-pipeline' as NavTab,
      label: 'Edge & Node Ingestion',
      icon: 'schema',
    },
    {
      id: 'network-metrics-and-centrality' as NavTab,
      label: 'Centrality & Clusters',
      icon: 'analytics',
    },
    {
      id: 'export-and-report' as NavTab,
      label: 'Intelligence Dossier',
      icon: 'assignment_turned_in',
    },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-[#0b0e13] border-r border-[#3b494b]/30 z-40 flex flex-col justify-between py-space-md select-none">
      <div className="flex flex-col gap-space-md px-space-sm">
        <div className="px-space-sm py-1">
          <span className="font-label-sm text-label-sm text-[#849495] uppercase tracking-wider">
            Graph Modules
          </span>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-space-sm px-space-sm py-2 rounded transition-colors text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#272a30] text-[#00dbe9] border-l-2 border-[#00f0ff] font-medium'
                    : 'text-[#b9cacb] hover:bg-[#1d2025] hover:text-[#e1e2ea]'
                }`}
              >
                <span className={`material-symbols-outlined text-[18px] ${isActive ? 'text-[#00f0ff]' : 'text-[#849495]'}`}>
                  {item.icon}
                </span>
                <span className="font-body-sm text-body-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* WebGPU Hardware Telemetry Indicator Box */}
      <div className="px-space-md py-space-sm mx-space-sm rounded bg-[#191c21] border border-[#3b494b]/20 flex flex-col gap-space-xs">
        <div className="flex items-center justify-between text-[#43ffbb]">
          <span className="font-label-sm text-label-sm uppercase tracking-wide">WebGPU Engine</span>
          <span className="w-2 h-2 rounded-full bg-[#43ffbb] shadow-[0_0_8px_#43ffbb] animate-pulse"></span>
        </div>
        <div className="flex justify-between font-code-dense text-code-dense text-[#b9cacb]">
          <span>Active Nodes</span>
          <span className="text-[#7df4ff] font-bold">{activeNodesCount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between font-code-dense text-code-dense text-[#b9cacb]">
          <span>Rendered Edges</span>
          <span className="text-[#7df4ff] font-bold">{renderedEdgesCount.toLocaleString()}</span>
        </div>
      </div>
    </aside>
  );
};
