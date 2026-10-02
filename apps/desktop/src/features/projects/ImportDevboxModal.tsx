import React, { useState } from 'react';
import { X, UploadCloud, Check, Package, Sparkles, Server, Globe, Database, ArrowRight } from 'lucide-react';
import { Project } from '../../types';

interface ImportDevboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (pkgData: any) => Promise<void>;
}

export const ImportDevboxModal: React.FC<ImportDevboxModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [selectedFile, setSelectedFile] = useState<string>('agency-store.devbox');
  const [isImporting, setIsImporting] = useState(false);
  const [importedSuccess, setImportedSuccess] = useState(false);

  // Pre-configured sample portable bundle
  const sampleBundle = {
    manifest_version: '1.0',
    devbox_version: '1.0.0',
    project: {
      name: 'Agency Storefront',
      type: 'laravel',
      php: '8.3',
      web_server: 'apache',
      domain: 'agency-store.test',
      https_enabled: true
    },
    services: ['mysql', 'redis'],
    database: {
      name: 'agency_store',
      engine: 'mysql',
      size_mb: 4.8
    },
    environment: {
      APP_NAME: 'Agency Storefront',
      APP_ENV: 'local',
      APP_URL: 'https://agency-store.test',
      DB_CONNECTION: 'mysql',
      DB_DATABASE: 'agency_store'
    }
  };

  if (!isOpen) return null;

  const handleExecuteImport = async () => {
    setIsImporting(true);
    try {
      await onImport(sampleBundle);
      setImportedSuccess(true);
      setTimeout(() => {
        setIsImporting(false);
        setImportedSuccess(false);
        onClose();
      }, 1500);
    } catch {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-devbox-card border border-devbox-border rounded-2xl shadow-glass flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-devbox-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Import DevBox Environment</h3>
              <p className="text-[11px] text-devbox-subtle font-mono">*.devbox portable package format</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-devbox-subtle hover:text-white hover:bg-devbox-hover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="p-4 rounded-xl border border-dashed border-devbox-border bg-devbox-panel/60 text-center space-y-2 cursor-pointer hover:border-blue-500/50 transition-colors">
            <UploadCloud className="w-8 h-8 text-blue-400 mx-auto" />
            <p className="text-xs font-semibold text-white">
              Package loaded: <span className="font-mono text-emerald-400">{selectedFile}</span>
            </p>
            <p className="text-[11px] text-devbox-subtle">
              Detected .devbox manifest with project files, database dump, and runtime configs.
            </p>
          </div>

          {/* Package Preview Specs */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-devbox-muted uppercase tracking-wider">
              Environment Specification
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-devbox-panel border border-devbox-border space-y-1">
                <span className="text-devbox-subtle text-[10px] uppercase block">Application</span>
                <span className="font-bold text-white block">{sampleBundle.project.name}</span>
                <span className="text-blue-400 font-mono text-[11px] capitalize">{sampleBundle.project.type}</span>
              </div>

              <div className="p-3 rounded-xl bg-devbox-panel border border-devbox-border space-y-1">
                <span className="text-devbox-subtle text-[10px] uppercase block">Runtime & Host</span>
                <span className="font-bold text-white block font-mono">PHP {sampleBundle.project.php}</span>
                <span className="text-amber-400 font-mono text-[11px] capitalize">{sampleBundle.project.web_server}</span>
              </div>

              <div className="p-3 rounded-xl bg-devbox-panel border border-devbox-border space-y-1">
                <span className="text-devbox-subtle text-[10px] uppercase block">Local Domain & SSL</span>
                <span className="font-bold text-emerald-400 block font-mono">https://{sampleBundle.project.domain}</span>
                <span className="text-devbox-subtle text-[10px]">Auto CA trusted</span>
              </div>

              <div className="p-3 rounded-xl bg-devbox-panel border border-devbox-border space-y-1">
                <span className="text-devbox-subtle text-[10px] uppercase block">Database Attachment</span>
                <span className="font-bold text-purple-400 block font-mono">{sampleBundle.database.name}</span>
                <span className="text-devbox-subtle text-[10px]">MySQL 8.4 (with seed schema)</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300">
            DevBox will recreate the exact PHP runtime version, Apache VirtualHost, local SSL certificate, hosts entry, and database schema automatically.
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-devbox-border flex items-center justify-between bg-devbox-card/90">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-devbox-panel hover:bg-devbox-hover text-devbox-muted text-xs font-semibold transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleExecuteImport}
            disabled={isImporting}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white text-xs font-bold shadow-glow transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {importedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Environment Ready!</span>
              </>
            ) : isImporting ? (
              <span>Recreating Environment Stack...</span>
            ) : (
              <>
                <span>Import & Provision</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
