import { useState } from 'react';
import { Header, NavTab } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TopologyCanvas } from './components/TopologyCanvas';
import { CsvDataPipeline } from './components/CsvDataPipeline';
import { NetworkMetrics } from './components/NetworkMetrics';
import { IntelligenceDossier } from './components/IntelligenceDossier';
import { NodeInspectorDrawer } from './components/NodeInspectorDrawer';
import { UploadModal } from './components/UploadModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('graph-explorer');
  const [physicsActive, setPhysicsActive] = useState<boolean>(true);
  const [datasetName, setDatasetName] = useState<string>('Siniestros_Concurrencia_2026.csv');
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [inspectorState, setInspectorState] = useState<{ isOpen: boolean; activeSlug: string }>({
    isOpen: false,
    activeSlug: 'xavier-estrada',
  });
  const [canvasFocusTarget, setCanvasFocusTarget] = useState<string | null>(null);

  const handleOpenInspector = (slug: string) => {
    setInspectorState({
      isOpen: true,
      activeSlug: slug,
    });
  };

  const handleCloseInspector = () => {
    setInspectorState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleLocateInCanvas = (nodeId: string) => {
    setCanvasFocusTarget(nodeId);
    setCurrentTab('graph-explorer');
  };

  const handleIsolateInGraph = (slug: string) => {
    setCanvasFocusTarget(slug);
    setCurrentTab('graph-explorer');
    setInspectorState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleUploadSuccess = (filename: string) => {
    setDatasetName(filename);
    setCurrentTab('csv-data-pipeline');
  };

  return (
    <div className="bg-[#111319] min-h-screen text-[#e1e2ea] flex flex-col antialiased">
      {/* Top Main Navigation Bar */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenUpload={() => setIsUploadOpen(true)}
        physicsActive={physicsActive}
        onTogglePhysics={() => setPhysicsActive((p) => !p)}
        datasetName={datasetName}
        onSelectDataset={(name) => setDatasetName(name)}
      />

      {/* Main Layout Area: Fixed Left Sidebar + Dynamic Content Column */}
      <div className="flex pt-16">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          activeNodesCount={14820}
          renderedEdgesCount={48194}
        />

        <main className="pl-64 w-full min-h-[calc(100vh-4rem)] flex flex-col bg-[#111319]">
          {currentTab === 'graph-explorer' && (
            <TopologyCanvas
              physicsActive={physicsActive}
              onTogglePhysics={() => setPhysicsActive((p) => !p)}
              onOpenUpload={() => setIsUploadOpen(true)}
              onOpenNodeInspector={handleOpenInspector}
              selectedNodeId={canvasFocusTarget}
            />
          )}

          {currentTab === 'csv-data-pipeline' && (
            <CsvDataPipeline
              onOpenUpload={() => setIsUploadOpen(true)}
              onGenerateGraph={() => setCurrentTab('graph-explorer')}
            />
          )}

          {currentTab === 'network-metrics-and-centrality' && (
            <NetworkMetrics
              onLocateInCanvas={handleLocateInCanvas}
              onOpenNodeInspector={handleOpenInspector}
              onPushToDossier={() => setCurrentTab('export-and-report')}
            />
          )}

          {currentTab === 'export-and-report' && (
            <IntelligenceDossier
              onOpenInspector={handleOpenInspector}
              onLocateInCanvas={handleLocateInCanvas}
            />
          )}
        </main>
      </div>

      {/* Slide-out Node Inspector Drawer (Image 9) */}
      <NodeInspectorDrawer
        isOpen={inspectorState.isOpen}
        onClose={handleCloseInspector}
        activeSlug={inspectorState.activeSlug}
        onSelectSlug={(slug) => setInspectorState({ isOpen: true, activeSlug: slug })}
        onIsolateInGraph={handleIsolateInGraph}
      />

      {/* CSV Ingestion & Edge List Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
}
