import React, { useEffect, useRef, useState, useCallback } from 'react';
import { COLOR_MAP, ICON_MAP, RAW_NODES, RAW_EDGES, GraphNode } from '../data/dataset';

interface TopologyCanvasProps {
  physicsActive: boolean;
  onTogglePhysics: () => void;
  onOpenUpload: () => void;
  onOpenNodeInspector: (slugOrId: string) => void;
  selectedNodeId?: string | null;
}

export const TopologyCanvas: React.FC<TopologyCanvasProps> = ({
  physicsActive,
  onTogglePhysics,
  onOpenUpload,
  onOpenNodeInspector,
  selectedNodeId: propSelectedNodeId,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Simulation state
  const nodesRef = useRef<GraphNode[]>([]);
  const edgesRef = useRef<typeof RAW_EDGES>([]);
  const cameraRef = useRef({ x: 0, y: 0, zoom: 1 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const hoveredNodeRef = useRef<GraphNode | null>(null);

  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [minEdgeWeight, setMinEdgeWeight] = useState(2);
  const [activeTypeFilter, setActiveTypeFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'bipartite' | 'direct'>('bipartite');
  const [searchQuery, setSearchQuery] = useState('');
  const [layoutAlgo, setLayoutAlgo] = useState<'fa2' | 'bh' | 'hier'>('fa2');
  const [concurrenceLevel, setConcurrenceLevel] = useState<number>(15);

  // Initialize node layout
  useEffect(() => {
    const initializedNodes: GraphNode[] = RAW_NODES.map((n, i) => {
      const angle = (i / RAW_NODES.length) * Math.PI * 2;
      const radius = 180 + (n.degree > 60 ? 40 : (i % 3) * 60 + 50);
      return {
        ...n,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        radius: n.type === 'SINIESTRO' ? 12 : Math.max(7, Math.min(22, n.degree / 4)),
      };
    });

    const initializedEdges = RAW_EDGES.map((e) => ({
      ...e,
      sourceNode: initializedNodes.find((n) => n.id === e.source),
      targetNode: initializedNodes.find((n) => n.id === e.target),
    })).filter((e) => e.sourceNode && e.targetNode);

    nodesRef.current = initializedNodes;
    edgesRef.current = initializedEdges;

    // Default selection
    const defaultTarget = initializedNodes.find((n) => n.id === 'MED-7492') || initializedNodes[0];
    setSelectedNode(defaultTarget);
  }, []);

  // Sync external selection if prop changes
  useEffect(() => {
    if (propSelectedNodeId && nodesRef.current.length > 0) {
      const found = nodesRef.current.find(
        (n) =>
          n.id === propSelectedNodeId ||
          n.name.toLowerCase().includes(propSelectedNodeId.toLowerCase()) ||
          (propSelectedNodeId === 'xavier-estrada' && n.id === 'ASE-8812') ||
          (propSelectedNodeId === 'carlos-mendoza' && n.id === 'MED-7492') ||
          (propSelectedNodeId === 'insurgentes-1420' && n.id === 'DOM-0142') ||
          (propSelectedNodeId === 'hospital-metropolitano' && n.id === 'HOS-302')
      );
      if (found) {
        setSelectedNode(found);
        cameraRef.current.x = -found.x! * cameraRef.current.zoom;
        cameraRef.current.y = -found.y! * cameraRef.current.zoom;
      }
    }
  }, [propSelectedNodeId]);

  // Coordinate conversion
  const screenToWorld = useCallback((sx: number, sy: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2 + cameraRef.current.x;
    const cy = height / 2 + cameraRef.current.y;
    return {
      x: (sx - cx) / cameraRef.current.zoom,
      y: (sy - cy) / cameraRef.current.zoom,
    };
  }, []);

  // Main simulation and render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Simulation loop
    const loop = () => {
      const width = canvas.width;
      const height = canvas.height;
      const nodes = nodesRef.current;
      const edges = edgesRef.current;

      // 1. Physics Step
      if (physicsActive && nodes.length > 0) {
        const repulsion = layoutAlgo === 'bh' ? 520 : 440;
        const springLength = layoutAlgo === 'hier' ? 90 : 110;
        const springK = 0.045;
        const damping = 0.88;

        // Node repulsion
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const n1 = nodes[i];
            const n2 = nodes[j];
            const dx = n2.x! - n1.x!;
            const dy = n2.y! - n1.y!;
            const dist = Math.hypot(dx, dy) || 1;
            if (dist < 420) {
              const force = (repulsion * repulsion) / (dist * dist);
              const fx = (dx / dist) * force;
              const fy = (dy / dist) * force;
              n1.vx! -= fx;
              n1.vy! -= fy;
              n2.vx! += fx;
              n2.vy! += fy;
            }
          }
        }

        // Edge spring force
        edges.forEach((edge) => {
          if (edge.weight < minEdgeWeight) return;
          const s = edge.sourceNode!;
          const t = edge.targetNode!;
          const dx = t.x! - s.x!;
          const dy = t.y! - s.y!;
          const dist = Math.hypot(dx, dy) || 1;
          const force = (dist - springLength) * springK * (edge.weight * 0.4);
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;

          s.vx! += fx;
          s.vy! += fy;
          t.vx! -= fx;
          t.vy! -= fy;
        });

        // Center gravity & integrate
        nodes.forEach((node) => {
          node.vx! += -node.x! * 0.008;
          node.vy! += -node.y! * 0.008;

          node.vx! *= damping;
          node.vy! *= damping;

          node.x! += node.vx!;
          node.y! += node.vy!;
        });
      }

      // 2. Render Step
      ctx.clearRect(0, 0, width, height);

      ctx.save();
      ctx.translate(width / 2 + cameraRef.current.x, height / 2 + cameraRef.current.y);
      ctx.scale(cameraRef.current.zoom, cameraRef.current.zoom);

      // Render Edges
      edges.forEach((edge) => {
        if (edge.weight < minEdgeWeight) return;
        const s = edge.sourceNode!;
        const t = edge.targetNode!;

        const isHighlighted =
          (selectedNode && (s.id === selectedNode.id || t.id === selectedNode.id)) ||
          (hoveredNodeRef.current && (s.id === hoveredNodeRef.current.id || t.id === hoveredNodeRef.current.id));

        ctx.beginPath();
        ctx.moveTo(s.x!, s.y!);
        ctx.lineTo(t.x!, t.y!);

        if (isHighlighted) {
          ctx.strokeStyle = '#00f0ff';
          ctx.lineWidth = Math.min(4, edge.weight * 0.85);
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur = 10;
        } else {
          ctx.strokeStyle = 'rgba(132, 148, 149, 0.18)';
          ctx.lineWidth = Math.max(0.6, edge.weight * 0.35);
          ctx.shadowBlur = 0;
        }
        ctx.stroke();
      });
      ctx.shadowBlur = 0;

      // Render Nodes
      nodes.forEach((node) => {
        if (activeTypeFilter !== 'ALL' && node.type !== activeTypeFilter) {
          ctx.globalAlpha = 0.15;
        } else {
          ctx.globalAlpha = 1.0;
        }

        const color = COLOR_MAP[node.type] || '#dbfcff';
        const isSelected = selectedNode && selectedNode.id === node.id;
        const isHovered = hoveredNodeRef.current && hoveredNodeRef.current.id === node.id;

        // Glowing halos for critical hubs or selected node
        if (node.degree > 60 || isSelected) {
          ctx.beginPath();
          ctx.arc(node.x!, node.y!, (node.radius || 10) * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = color + '22';
          ctx.fill();
        }

        // Draw shape: Siniestro (Diamond), others (Circle)
        ctx.beginPath();
        if (node.type === 'SINIESTRO') {
          const r = (node.radius || 10) * 1.2;
          ctx.moveTo(node.x!, node.y! - r);
          ctx.lineTo(node.x! + r, node.y!);
          ctx.lineTo(node.x!, node.y! + r);
          ctx.lineTo(node.x! - r, node.y!);
          ctx.closePath();
        } else {
          ctx.arc(node.x!, node.y!, node.radius || 10, 0, Math.PI * 2);
        }

        ctx.fillStyle = color;
        ctx.fill();

        if (isSelected || isHovered) {
          ctx.lineWidth = 2.5;
          ctx.strokeStyle = '#ffffff';
          ctx.stroke();
        }

        // Monospace ID label for major entities
        if (node.degree > 35 || isSelected || isHovered) {
          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.fillStyle = '#e1e2ea';
          ctx.textAlign = 'center';
          ctx.fillText(node.name, node.x!, node.y! + (node.radius || 10) + 13);
        }
      });
      ctx.globalAlpha = 1.0;

      ctx.restore();

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [physicsActive, layoutAlgo, minEdgeWeight, activeTypeFilter, selectedNode]);

  // Mouse event handlers on canvas
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX - cameraRef.current.x,
      y: e.clientY - cameraRef.current.y,
    };

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const pos = screenToWorld(e.clientX - rect.left, e.clientY - rect.top);

    const hit = nodesRef.current.find(
      (n) => Math.hypot((n.x || 0) - pos.x, (n.y || 0) - pos.y) <= (n.radius || 10) + 8
    );
    if (hit) {
      setSelectedNode(hit);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const pos = screenToWorld(e.clientX - rect.left, e.clientY - rect.top);

    if (isDraggingRef.current) {
      cameraRef.current.x = e.clientX - dragStartRef.current.x;
      cameraRef.current.y = e.clientY - dragStartRef.current.y;
    } else {
      const hit = nodesRef.current.find(
        (n) => Math.hypot((n.x || 0) - pos.x, (n.y || 0) - pos.y) <= (n.radius || 10) + 8
      );
      hoveredNodeRef.current = hit || null;
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 0.9 : 1.1;
    cameraRef.current.zoom = Math.min(3.5, Math.max(0.3, cameraRef.current.zoom * factor));
  };

  // Focus an entity by name
  const focusEntityByName = (name: string) => {
    const found = nodesRef.current.find((n) => n.name.toLowerCase().includes(name.toLowerCase()));
    if (found) {
      setSelectedNode(found);
      cameraRef.current.x = -found.x! * cameraRef.current.zoom;
      cameraRef.current.y = -found.y! * cameraRef.current.zoom;
    }
  };

  // Search input handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.trim()) {
      const found = nodesRef.current.find(
        (n) => n.name.toLowerCase().includes(q.toLowerCase()) || n.id.toLowerCase().includes(q.toLowerCase())
      );
      if (found) {
        setSelectedNode(found);
        cameraRef.current.x = -found.x! * cameraRef.current.zoom;
        cameraRef.current.y = -found.y! * cameraRef.current.zoom;
      }
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleResetGraph = () => {
    cameraRef.current = { x: 0, y: 0, zoom: 1 };
    setMinEdgeWeight(2);
    setActiveTypeFilter('ALL');
    setSearchQuery('');
    setConcurrenceLevel(15);
  };

  const exportCanvasSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.download = `GraphForge_Topology_${Date.now()}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
  };

  // Compute category counts
  const categoryCounts = RAW_NODES.reduce((acc, curr) => {
    acc[curr.type] = (acc[curr.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="flex flex-col w-full relative select-none overflow-hidden h-[calc(100vh-4rem)]">
      {/* Interactive WebGL / Canvas Simulation Container */}
      <div className="relative w-full h-full bg-[#0b0e13]">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
          className="w-full h-full block cursor-grab active:cursor-grabbing"
        />

        {/* Ambient Visual Grid & Depth Markers */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0b0e13] via-transparent to-[#0b0e13]/40 opacity-70"></div>

        {/* Top Centered Status Pill */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none flex items-center gap-space-sm px-space-md py-1 rounded-full bg-[#191c21]/80 backdrop-blur-md shadow-md text-[#b9cacb] font-label-sm text-label-sm border border-[#3b494b]/30">
          <span className="w-1.5 h-1.5 rounded-full bg-[#43ffbb] animate-ping"></span>
          <span className="text-[#7df4ff] uppercase tracking-wider font-semibold">Live Forensics Simulation</span>
          <span className="text-[#849495]">|</span>
          <span>ForceAtlas2 (Barnes-Hut θ=0.62)</span>
          <span className="text-[#849495]">|</span>
          <span className="text-[#43ffbb] font-code-dense text-code-dense">60 FPS</span>
        </div>

        {/* ======================================================== */}
        {/* LEFT PANEL: Explorador Brex In Inspector & Filters       */}
        {/* ======================================================== */}
        <aside className="absolute top-4 left-4 bottom-14 w-84 max-w-[calc(100vw-2rem)] flex flex-col gap-space-sm pointer-events-auto z-20 overflow-hidden">
          {/* Search & Brand Tag */}
          <div className="p-space-md rounded-xl bg-[#191c21]/90 backdrop-blur-xl shadow-xl flex flex-col gap-space-sm border border-[#3b494b]/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[18px] text-[#00f0ff]">troubleshoot</span>
                <span className="font-headline-md text-headline-md text-[#dbfcff] tracking-tight">
                  Explorador Brex In
                </span>
              </div>
              <span className="font-label-sm text-label-sm px-space-xs py-0.5 rounded bg-[#272a30] text-[#7df4ff] border border-[#00f0ff]/20">
                FORENSIC v2.8
              </span>
            </div>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-2.5 text-[16px] text-[#849495]">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search node by ID or name..."
                className="w-full pl-8 pr-8 py-1.5 bg-[#0b0e13] rounded font-code-dense text-code-dense text-[#e1e2ea] placeholder:text-[#849495] focus:outline-none focus:bg-[#272a30] border border-transparent focus:border-[#00f0ff]/40 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-2 text-[#849495] hover:text-[#e1e2ea] text-[14px]"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Scrollable Configuration & Telemetry Column */}
          <div className="flex-1 overflow-y-auto pr-0.5 flex flex-col gap-space-sm">
            {/* Telemetry Summary */}
            <div className="p-space-md rounded-xl bg-[#191c21]/90 backdrop-blur-xl shadow-lg flex flex-col gap-space-sm border border-[#3b494b]/30">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-[#849495] font-semibold">
                  Analítica de Red
                </span>
                <span className="font-code-dense text-code-dense text-[#43ffbb] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#43ffbb]"></span> Cluster Concurrente
                </span>
              </div>

              <div className="grid grid-cols-3 gap-space-xs pt-1">
                <div className="flex flex-col p-space-xs rounded bg-[#272a30]/60">
                  <span className="font-headline-md text-headline-md font-bold text-[#7df4ff]">40</span>
                  <span className="font-label-sm text-label-sm text-[#b9cacb] leading-tight">Siniestros Totales</span>
                </div>
                <div className="flex flex-col p-space-xs rounded bg-[#272a30]/60">
                  <span className="font-headline-md text-headline-md font-bold text-[#43ffbb]">99</span>
                  <span className="font-label-sm text-label-sm text-[#b9cacb] leading-tight">Entidades Únicas</span>
                </div>
                <div className="flex flex-col p-space-xs rounded bg-[#272a30]/60">
                  <span className="font-headline-md text-headline-md font-bold text-[#00f0ff]">320</span>
                  <span className="font-label-sm text-label-sm text-[#b9cacb] leading-tight">Vínculos Totales</span>
                </div>
              </div>

              {/* Recurrence Hotspots */}
              <div className="flex flex-col gap-1.5 pt-2">
                <span className="font-label-sm text-label-sm uppercase text-[#849495]">
                  Anomalías de Concurrencia
                </span>
                <div
                  onClick={() => focusEntityByName('Dr. Carlos Mendoza')}
                  className="flex items-center justify-between p-1.5 rounded bg-[#0b0e13]/80 cursor-pointer hover:bg-[#272a30] transition-colors"
                >
                  <div className="flex items-center gap-space-xs min-w-0">
                    <span className="w-2 h-2 rounded-full bg-[#f59e0b]"></span>
                    <span className="font-body-sm text-body-sm text-[#e1e2ea] truncate">Dr. Carlos Mendoza</span>
                  </div>
                  <span className="font-code-dense text-code-dense text-[#00f0ff] font-semibold whitespace-nowrap">
                    21 sin.
                  </span>
                </div>

                <div
                  onClick={() => focusEntityByName('Xavier Estrada')}
                  className="flex items-center justify-between p-1.5 rounded bg-[#0b0e13]/80 cursor-pointer hover:bg-[#272a30] transition-colors"
                >
                  <div className="flex items-center gap-space-xs min-w-0">
                    <span className="w-2 h-2 rounded-full bg-[#a855f7]"></span>
                    <span className="font-body-sm text-body-sm text-[#e1e2ea] truncate">Xavier Estrada (Asesor)</span>
                  </div>
                  <span className="font-code-dense text-code-dense text-[#00f0ff] font-semibold whitespace-nowrap">
                    22 sin.
                  </span>
                </div>

                <div
                  onClick={() => focusEntityByName('Av. Insurgentes Sur 1420')}
                  className="flex items-center justify-between p-1.5 rounded bg-[#0b0e13]/80 cursor-pointer hover:bg-[#272a30] transition-colors"
                >
                  <div className="flex items-center gap-space-xs min-w-0">
                    <span className="w-2 h-2 rounded-full bg-[#94a3b8]"></span>
                    <span className="font-body-sm text-body-sm text-[#e1e2ea] truncate">Av. Insurgentes Sur 1420</span>
                  </div>
                  <span className="font-code-dense text-code-dense text-[#00f0ff] font-semibold whitespace-nowrap">
                    18 sin.
                  </span>
                </div>
              </div>
            </div>

            {/* Filters Section */}
            <div className="p-space-md rounded-xl bg-[#191c21]/90 backdrop-blur-xl shadow-lg flex flex-col gap-space-md border border-[#3b494b]/30">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-[#849495] font-semibold">
                Proyección y Filtros
              </span>

              {/* Mode Toggle */}
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-[#b9cacb]">Modo de Visualización</label>
                <div className="grid grid-cols-2 p-1 rounded bg-[#0b0e13]">
                  <button
                    type="button"
                    onClick={() => setViewMode('bipartite')}
                    className={`py-1 px-2 rounded font-label-sm text-label-sm font-semibold transition-all cursor-pointer ${
                      viewMode === 'bipartite'
                        ? 'bg-[#272a30] text-[#7df4ff] shadow-sm'
                        : 'text-[#b9cacb] hover:text-[#e1e2ea]'
                    }`}
                  >
                    Entidad ↔ Siniestro
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('direct')}
                    className={`py-1 px-2 rounded font-label-sm text-label-sm transition-all cursor-pointer ${
                      viewMode === 'direct'
                        ? 'bg-[#272a30] text-[#7df4ff] shadow-sm font-semibold'
                        : 'text-[#b9cacb] hover:text-[#e1e2ea]'
                    }`}
                  >
                    Proyección Directa
                  </button>
                </div>
              </div>

              {/* Entity Type Select */}
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-[#b9cacb]">Tipo de Entidad Filtrable</label>
                <select
                  value={activeTypeFilter}
                  onChange={(e) => setActiveTypeFilter(e.target.value)}
                  className="w-full py-1.5 px-2 bg-[#0b0e13] rounded font-body-sm text-body-sm text-[#e1e2ea] focus:outline-none focus:bg-[#272a30] border border-[#3b494b]/30 cursor-pointer"
                >
                  <option value="ALL">Todas las Entidades (Global)</option>
                  <option value="SINIESTRO">Solo Siniestros (Claims)</option>
                  <option value="MEDICO">Médicos Tratantes</option>
                  <option value="ASESOR">Asesores de Seguros</option>
                  <option value="HOSPITAL">Clínicas y Hospitales</option>
                  <option value="DOMICILIO">Domicilios Fiscales</option>
                  <option value="FUNERARIA">Servicios Funerarios</option>
                  <option value="ASEGURADORA">Compañías Aseguradoras</option>
                </select>
              </div>

              {/* Concurrence Level Buttons */}
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-[#b9cacb]">Nivel de Concurrencia</label>
                <div className="grid grid-cols-4 gap-1">
                  {[
                    { label: 'Bajo', level: 1 },
                    { label: 'Medio', level: 5 },
                    { label: 'Alto', level: 10 },
                    { label: 'Muy Alto', level: 15 },
                  ].map((btn) => (
                    <button
                      key={btn.level}
                      type="button"
                      onClick={() => {
                        setConcurrenceLevel(btn.level);
                        setMinEdgeWeight(btn.level > 8 ? 4 : 2);
                      }}
                      className={`py-1 rounded font-label-sm text-label-sm transition-colors cursor-pointer ${
                        concurrenceLevel === btn.level
                          ? 'bg-[#00f0ff] text-[#002022] font-semibold'
                          : 'bg-[#272a30] text-[#e1e2ea] hover:text-[#43ffbb]'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Carrier Filter */}
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-[#b9cacb]">Compañía Aseguradora</label>
                <select className="w-full py-1.5 px-2 bg-[#0b0e13] rounded font-body-sm text-body-sm text-[#e1e2ea] focus:outline-none focus:bg-[#272a30] border border-[#3b494b]/30 cursor-pointer">
                  <option>Todas las Aseguradoras (A-F)</option>
                  <option>Grupo Asegurador Alpha</option>
                  <option>Metrópoli Seguros Vida</option>
                  <option>Seguros Monterrey & Co.</option>
                  <option>GNP Patrimonial Corp</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-space-xs pt-1">
                <button
                  type="button"
                  onClick={handleResetGraph}
                  className="w-full py-1.5 px-3 rounded bg-[#272a30] hover:bg-[#36393f] text-[#e1e2ea] font-label-md text-label-md flex items-center justify-center gap-space-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#00dbe9]">restart_alt</span>
                  <span>Restablecer Red Completa</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenUpload}
                  className="w-full py-1.5 px-3 rounded bg-[#00f0ff] text-[#002022] font-label-md text-label-md font-semibold hover:bg-[#00dbe9] flex items-center justify-center gap-space-xs transition-colors shadow-md cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">upload_file</span>
                  <span>Upload New CSV Edge List</span>
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* ======================================================== */}
        {/* RIGHT PANEL: Node Legend & Active Entity Dossier         */}
        {/* ======================================================== */}
        <aside className="absolute top-4 right-4 bottom-14 w-84 max-w-[calc(100vw-2rem)] flex flex-col gap-space-sm pointer-events-auto z-20 overflow-hidden">
          {/* Active Node Dossier */}
          {selectedNode && (
            <div className="p-space-md rounded-xl bg-[#191c21]/95 backdrop-blur-xl shadow-xl flex flex-col gap-space-sm border border-[#3b494b]/30">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-[#849495] font-semibold">
                  Nodo en Foco
                </span>
                <span
                  className={`font-label-sm text-label-sm px-2 py-0.5 rounded font-bold tracking-wider ${
                    selectedNode.risk === 'CRÍTICO'
                      ? 'bg-[#93000a] text-[#fff3f3]'
                      : 'bg-[#93000a]/70 text-[#fff3f3]'
                  }`}
                >
                  {selectedNode.risk === 'CRÍTICO' ? '[ALERTA CONCURRENCIA]' : `[${selectedNode.risk}]`}
                </span>
              </div>

              <div className="flex items-start gap-space-sm">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: (COLOR_MAP[selectedNode.type] || '#00f0ff') + '25' }}
                >
                  <span
                    className="material-symbols-outlined text-[24px]"
                    style={{ color: COLOR_MAP[selectedNode.type] || '#00f0ff' }}
                  >
                    {ICON_MAP[selectedNode.type] || 'bubble_chart'}
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <h3 className="font-headline-md text-headline-md text-[#dbfcff] font-bold truncate">
                    {selectedNode.name}
                  </h3>
                  <span className="font-label-sm text-label-sm text-[#b9cacb] font-mono">
                    ID: {selectedNode.id} • {selectedNode.type}
                  </span>
                </div>
              </div>

              {/* Metric badges inside card */}
              <div className="grid grid-cols-2 gap-space-xs pt-1">
                <div className="p-2 rounded bg-[#0b0e13] flex flex-col">
                  <span className="font-label-sm text-label-sm text-[#849495]">Degree Centrality</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-headline-lg text-headline-lg text-[#7df4ff] font-bold">
                      {(selectedNode.degree / 100).toFixed(2)}
                    </span>
                    <span className="font-label-sm text-label-sm text-[#43ffbb] font-mono">/ 1.00</span>
                  </div>
                </div>

                <div className="p-2 rounded bg-[#0b0e13] flex flex-col">
                  <span className="font-label-sm text-label-sm text-[#849495]">Siniestros Ligados</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-headline-lg text-headline-lg text-[#ef4444] font-bold">
                      {selectedNode.cases}
                    </span>
                    <span className="font-label-sm text-label-sm text-[#849495] font-mono">casos</span>
                  </div>
                </div>
              </div>

              {/* Relational cross-reference preview */}
              <div className="flex flex-col gap-1 pt-1">
                <span className="font-label-sm text-label-sm text-[#849495] uppercase">
                  Entidades Cruzadas Directas
                </span>
                <div className="flex flex-col gap-1 max-h-28 overflow-y-auto pr-1">
                  <div
                    onClick={() => focusEntityByName('Hospital Ángeles')}
                    className="flex items-center justify-between p-1.5 rounded bg-[#0b0e13] text-body-sm font-body-sm text-[#e1e2ea] cursor-pointer hover:bg-[#272a30]"
                  >
                    <span className="truncate flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#14b8a6]"></span> Hosp. Ángeles Metropolitano
                    </span>
                    <span className="font-code-dense text-code-dense text-[#849495]">14 c.</span>
                  </div>
                  <div
                    onClick={() => focusEntityByName('Xavier Estrada')}
                    className="flex items-center justify-between p-1.5 rounded bg-[#0b0e13] text-body-sm font-body-sm text-[#e1e2ea] cursor-pointer hover:bg-[#272a30]"
                  >
                    <span className="truncate flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7]"></span> Asesor Xavier Estrada
                    </span>
                    <span className="font-code-dense text-code-dense text-[#849495]">12 c.</span>
                  </div>
                  <div
                    onClick={() => focusEntityByName('Insurgentes Sur')}
                    className="flex items-center justify-between p-1.5 rounded bg-[#0b0e13] text-body-sm font-body-sm text-[#e1e2ea] cursor-pointer hover:bg-[#272a30]"
                  >
                    <span className="truncate flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#94a3b8]"></span> Insurgentes Sur 1420
                    </span>
                    <span className="font-code-dense text-code-dense text-[#849495]">9 c.</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const slug =
                    selectedNode.id === 'ASE-8812'
                      ? 'xavier-estrada'
                      : selectedNode.id === 'MED-7492'
                      ? 'carlos-mendoza'
                      : selectedNode.id === 'DOM-0142'
                      ? 'insurgentes-1420'
                      : 'xavier-estrada';
                  onOpenNodeInspector(slug);
                }}
                className="w-full py-1.5 px-2 rounded bg-[#272a30] hover:bg-[#36393f] text-[#7df4ff] font-label-sm text-label-sm font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">policy</span>
                <span>Generar Reporte de Fraude Cruzado</span>
              </button>
            </div>
          )}

          {/* Node Color Taxonomy Legend */}
          <div className="p-space-md rounded-xl bg-[#191c21]/90 backdrop-blur-xl shadow-xl flex flex-col gap-space-xs flex-1 overflow-y-auto border border-[#3b494b]/30">
            <div className="flex items-center justify-between pb-1">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-[#849495] font-semibold">
                Taxonomía y Pesos
              </span>
              <span className="font-label-sm text-label-sm text-[#b9cacb]">9 Categorías</span>
            </div>

            <div className="flex flex-col gap-1.5">
              {[
                { label: 'Siniestro (Reclamo)', type: 'SINIESTRO', isDiamond: true },
                { label: 'Asegurado Titular', type: 'ASEGURADO' },
                { label: 'Beneficiario Designado', type: 'BENEFICIARIO' },
                { label: 'Médico Dictaminador', type: 'MEDICO' },
                { label: 'Asesor / Agente Poliza', type: 'ASESOR' },
                { label: 'Hospital / Clínica', type: 'HOSPITAL' },
                { label: 'Domicilio Registrado', type: 'DOMICILIO' },
                { label: 'Funeraria / Trámite', type: 'FUNERARIA' },
                { label: 'Compañía Aseguradora', type: 'ASEGURADORA' },
              ].map((cat) => {
                const color = COLOR_MAP[cat.type] || '#dbfcff';
                const count = categoryCounts[cat.type] || (cat.type === 'SINIESTRO' ? 40 : 10);
                return (
                  <div
                    key={cat.type}
                    onClick={() => setActiveTypeFilter(activeTypeFilter === cat.type ? 'ALL' : cat.type)}
                    className={`flex items-center justify-between p-1.5 rounded transition-colors cursor-pointer ${
                      activeTypeFilter === cat.type ? 'bg-[#272a30] ring-1 ring-[#00f0ff]' : 'bg-[#0b0e13] hover:bg-[#272a30]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {cat.isDiamond ? (
                        <span
                          className="w-2.5 h-2.5 rotate-45"
                          style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
                        ></span>
                      ) : (
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
                        ></span>
                      )}
                      <span className="font-body-sm text-body-sm text-[#e1e2ea]">{cat.label}</span>
                    </div>
                    <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-[#272a30] text-[#e1e2ea] font-mono">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* ======================================================== */}
        {/* BOTTOM FLOATING QUICK-CONTROLS DOCK                      */}
        {/* ======================================================== */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-space-xs p-1.5 rounded-xl bg-[#191c21]/90 backdrop-blur-xl shadow-2xl z-30 border border-[#3b494b]/30">
          {/* Play/Pause Simulation */}
          <button
            type="button"
            onClick={onTogglePhysics}
            className={`w-9 h-9 rounded-lg bg-[#272a30] hover:bg-[#36393f] flex items-center justify-center transition-colors cursor-pointer ${
              physicsActive ? 'text-[#43ffbb]' : 'text-[#849495]'
            }`}
            title="Play/Pause Force Simulation"
          >
            <span className="material-symbols-outlined text-[18px]">
              {physicsActive ? 'pause' : 'play_arrow'}
            </span>
          </button>

          <div className="h-4 w-px bg-[#3b494b]/50 mx-1"></div>

          {/* Zoom Controls */}
          <button
            type="button"
            onClick={() => {
              cameraRef.current.zoom = Math.min(3.5, cameraRef.current.zoom * 1.2);
            }}
            className="w-9 h-9 rounded-lg bg-[#272a30] text-[#e1e2ea] hover:text-[#7df4ff] hover:bg-[#36393f] flex items-center justify-center transition-colors cursor-pointer"
            title="Acercar Vista"
          >
            <span className="material-symbols-outlined text-[18px]">zoom_in</span>
          </button>
          <button
            type="button"
            onClick={() => {
              cameraRef.current.zoom = Math.max(0.3, cameraRef.current.zoom * 0.8);
            }}
            className="w-9 h-9 rounded-lg bg-[#272a30] text-[#e1e2ea] hover:text-[#7df4ff] hover:bg-[#36393f] flex items-center justify-center transition-colors cursor-pointer"
            title="Alejar Vista"
          >
            <span className="material-symbols-outlined text-[18px]">zoom_out</span>
          </button>
          <button
            type="button"
            onClick={() => {
              cameraRef.current = { x: 0, y: 0, zoom: 1 };
            }}
            className="w-9 h-9 rounded-lg bg-[#272a30] text-[#e1e2ea] hover:text-[#7df4ff] hover:bg-[#36393f] flex items-center justify-center transition-colors cursor-pointer"
            title="Centrar Red (Fit Screen)"
          >
            <span className="material-symbols-outlined text-[18px]">center_focus_strong</span>
          </button>

          <div className="h-4 w-px bg-[#3b494b]/50 mx-1"></div>

          {/* Layout Algorithm Selector */}
          <div className="flex items-center gap-1.5 px-2">
            <span className="material-symbols-outlined text-[16px] text-[#849495]">tune</span>
            <select
              value={layoutAlgo}
              onChange={(e) => setLayoutAlgo(e.target.value as any)}
              className="bg-[#0b0e13] text-[#e1e2ea] font-label-sm text-label-sm py-1 px-2 rounded focus:outline-none border border-[#3b494b]/30 cursor-pointer"
            >
              <option value="fa2">ForceAtlas2 (Concurrencia)</option>
              <option value="bh">Barnes-Hut (Topología N-Body)</option>
              <option value="hier">Hierarchical Tree (Árbol Causal)</option>
            </select>
          </div>

          <div className="h-4 w-px bg-[#3b494b]/50 mx-1"></div>

          {/* Edge Weight Threshold Slider */}
          <div className="flex items-center gap-2 px-2">
            <span className="font-label-sm text-label-sm text-[#849495] whitespace-nowrap">Edge Thresh:</span>
            <input
              type="range"
              min="1"
              max="10"
              value={minEdgeWeight}
              onChange={(e) => setMinEdgeWeight(parseInt(e.target.value, 10))}
              className="w-20 accent-[#00f0ff] cursor-pointer"
            />
            <span className="font-code-dense text-code-dense text-[#7df4ff] w-4">
              ≥{minEdgeWeight}
            </span>
          </div>

          <div className="h-4 w-px bg-[#3b494b]/50 mx-1"></div>

          {/* Export Snapshot Button */}
          <button
            type="button"
            onClick={exportCanvasSnapshot}
            className="px-3 py-1.5 rounded-lg bg-[#00f0ff] text-[#002022] font-label-sm text-label-sm font-semibold hover:bg-[#00dbe9] flex items-center gap-1 transition-colors shadow-sm cursor-pointer"
            title="Exportar Mapa Forense"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            <span>Export Snapshot</span>
          </button>
        </div>

        {/* BOTTOM ACADEMIC CITATION TICKER */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-[#0b0e13]/95 backdrop-blur-md flex items-center justify-between px-space-lg text-[#849495] font-label-sm text-label-sm z-20 pointer-events-none border-t border-[#3b494b]/20">
          <div className="flex items-center gap-2 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-[#43ffbb]"></span>
            <span className="truncate">
              Prototipo de Grafo Institucional de Conocimiento | Motor de Ingesta CSV Activo | Universidad Iberoamericana
            </span>
          </div>
          <div className="hidden md:flex items-center gap-space-lg font-code-dense text-code-dense">
            <span>G-Index: 0.814</span>
            <span>Modularidad: 0.64</span>
            <span className="text-[#7df4ff]">Licencia Brex In Research</span>
          </div>
        </div>
      </div>
    </div>
  );
};
