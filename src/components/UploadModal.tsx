import React, { useState } from 'react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (filename: string, rowCount: number) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
}) => {
  const [csvContent, setCsvContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvContent(text);
    };
    reader.readAsText(file);
  };

  const handleApply = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const lines = csvContent.trim().split('\n').filter((l) => l.trim().length > 0);
      const rowCount = Math.max(1, lines.length - 1);
      onUploadSuccess(fileName || 'Custom_Edge_List.csv', rowCount);
      onClose();
    }, 800);
  };

  const loadSamplePreset = (presetName: string) => {
    setFileName(presetName);
    setCsvContent(`siniestro,entidad,tipo,aseguradora,concurrencia
SIN_0001,Dr. Carlos Mendoza,MÉDICO,Aseguradora A,4
SIN_0001,Xavier Estrada,ASESOR,Aseguradora A,2
SIN_0002,Dr. Carlos Mendoza,MÉDICO,Aseguradora B,7
SIN_0002,Clínica San Gabriel,HOSPITAL,Aseguradora B,3
SIN_0003,Laura Peñaloza,BENEFICIARIO,Aseguradora C,1
SIN_0003,Xavier Estrada,ASESOR,Aseguradora C,5
SIN_0004,Av. Insurgentes Sur 1420,DOMICILIO,Aseguradora D,6
SIN_0004,Funeraria San Rafael,FUNERARIA,Aseguradora D,4
SIN_0005,Adriana Ibáñez,BENEFICIARIO,Aseguradora E,5
SIN_0005,David Flores,ASEGURADO,Aseguradora F,3`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0e13]/80 backdrop-blur-md select-none">
      <div className="w-full max-w-xl bg-[#191c21] border border-[#3b494b]/40 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-space-lg py-space-md bg-[#1d2025] border-b border-[#3b494b]/30 flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[20px] text-[#00f0ff]">upload_file</span>
            <span className="font-headline-md text-headline-md text-[#dbfcff] font-bold">
              Ingesta de Lista de Aristas (Edge List)
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded bg-[#272a30] hover:bg-[#32353b] text-[#b9cacb] hover:text-[#e1e2ea] flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-space-lg flex flex-col gap-space-md overflow-y-auto max-h-[70vh]">
          <div>
            <label className="font-label-sm text-label-sm text-[#849495] uppercase block mb-1">
              Cargar Archivo CSV o TXT
            </label>
            <div className="border-2 border-dashed border-[#3b494b]/50 hover:border-[#00f0ff]/50 rounded-lg p-space-lg flex flex-col items-center justify-center gap-2 bg-[#0b0e13]/50 cursor-pointer relative transition-colors">
              <input
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <span className="material-symbols-outlined text-[32px] text-[#7df4ff]">cloud_upload</span>
              <span className="font-body-sm text-body-sm text-[#e1e2ea] font-medium">
                {fileName ? `Archivo seleccionado: ${fileName}` : 'Arrastre su archivo CSV o haga clic para buscar'}
              </span>
              <span className="font-code-dense text-[10px] text-[#849495]">
                Formato sugerido: [siniestro, entidad, tipo, aseguradora, concurrencia]
              </span>
            </div>
          </div>

          {/* Quick presets */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-label-sm text-label-sm text-[#849495] uppercase">
                O Seleccionar Conjunto Pre-cargado:
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => loadSamplePreset('Siniestros_Concurrencia_2026.csv')}
                className="px-2 py-1.5 rounded bg-[#1d2025] hover:bg-[#272a30] text-[#7df4ff] font-code-dense text-code-dense border border-[#3b494b]/30 text-left cursor-pointer transition-colors"
              >
                📊 Siniestros_Concurrencia_2026.csv
              </button>
              <button
                type="button"
                onClick={() => loadSamplePreset('Red_Colusion_Metropolitana_Q1.csv')}
                className="px-2 py-1.5 rounded bg-[#1d2025] hover:bg-[#272a30] text-[#43ffbb] font-code-dense text-code-dense border border-[#3b494b]/30 text-left cursor-pointer transition-colors"
              >
                🔬 Red_Colusion_Metropolitana_Q1.csv
              </button>
            </div>
          </div>

          {/* Direct CSV Paste */}
          <div>
            <label className="font-label-sm text-label-sm text-[#849495] uppercase block mb-1">
              Previsualización o Edición de Datos CSV
            </label>
            <textarea
              rows={5}
              value={csvContent}
              onChange={(e) => setCsvContent(e.target.value)}
              placeholder="siniestro,entidad,tipo,aseguradora,concurrencia&#10;SIN_0001,Dr. Carlos Mendoza,MÉDICO,Aseguradora A,4"
              className="w-full bg-[#0b0e13] border border-[#3b494b]/40 rounded p-2 text-xs font-code-dense text-[#e1e2ea] focus:outline-none focus:border-[#00f0ff]"
            />
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-space-lg py-space-sm bg-[#1d2025] border-t border-[#3b494b]/30 flex items-center justify-end gap-space-sm">
          <button
            type="button"
            onClick={onClose}
            className="px-space-md py-1.5 rounded bg-[#272a30] hover:bg-[#32353b] text-[#b9cacb] font-label-md text-label-md cursor-pointer transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={!csvContent.trim() || isProcessing}
            className="px-space-lg py-1.5 rounded bg-[#00f0ff] text-[#002022] font-label-md text-label-md font-semibold hover:bg-[#00dbe9] disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1 shadow-md"
          >
            {isProcessing ? (
              <>
                <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
                <span>Procesando Aristas...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">sync</span>
                <span>Ingestar y Analizar Grafo</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
