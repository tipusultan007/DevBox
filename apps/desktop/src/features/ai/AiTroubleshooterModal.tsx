import React, { useState } from 'react';
import { Sparkles, X, Check, AlertTriangle, ArrowRight, Bot, Bug, ShieldCheck, Wrench } from 'lucide-react';
import { Project } from '../../types';

interface AiTroubleshooterModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

export const AiTroubleshooterModal: React.FC<AiTroubleshooterModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [diagnosed, setDiagnosed] = useState(true);
  const [resolved, setResolved] = useState(false);

  if (!isOpen) return null;

  const handleRunAiDiagnostics = () => {
    setAnalyzing(true);
    setResolved(false);
    setTimeout(() => {
      setAnalyzing(false);
      setDiagnosed(true);
    }, 1200);
  };

  const handleApplyFix = () => {
    setResolved(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl bg-devbox-card border border-devbox-border rounded-2xl shadow-glass flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-devbox-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 p-0.5 shadow-glow flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">DevBox AI Troubleshooter</h3>
              <p className="text-[11px] text-devbox-subtle">
                Automated error root-cause analyzer & 1-click remediation
              </p>
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
          <div className="p-3.5 rounded-xl bg-devbox-panel border border-devbox-border text-xs flex items-center justify-between">
            <span className="text-devbox-subtle font-mono">Inspecting Project:</span>
            <span className="font-bold text-white font-mono">{project?.name || 'My Shop'} ({project?.domain || 'myshop.test'})</span>
          </div>

          {analyzing ? (
            <div className="text-center py-10 space-y-3">
              <Sparkles className="w-8 h-8 text-purple-400 mx-auto animate-spin" />
              <p className="text-sm font-semibold text-white">Inspecting Apache logs, PHP errors, .env, and ports...</p>
              <p className="text-xs text-devbox-subtle">Correlating stack traces with runtime extensions</p>
            </div>
          ) : diagnosed ? (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wide">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Identified Issue: PDO MySQL Extension Missing</span>
                </div>
                <p className="text-xs text-devbox-text leading-relaxed">
                  Your Laravel application attempted to execute a database query, but the driver for <code className="text-purple-300">pdo_mysql</code> was not enabled in <code className="text-purple-300">php.ini</code> for PHP {project?.php_version || '8.3'}.
                </p>
              </div>

              {/* Inspected Logs Snippet */}
              <div className="p-3 rounded-xl bg-black/60 border border-devbox-border text-[11px] font-mono space-y-1">
                <p className="text-devbox-subtle">[Laravel Error Log snippet]:</p>
                <p className="text-rose-400">Illuminate\Database\QueryException: could not find driver (Connection: mysql)</p>
                <p className="text-devbox-subtle">at vendor\laravel\framework\src\Illuminate\Database\Connectors\Connector.php:70</p>
              </div>

              {/* Suggested Remediation */}
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-purple-300">Recommended 1-Click Fix:</h4>
                  <p className="text-[11px] text-devbox-muted">Enable extension=pdo_mysql in php.ini and reload FastCGI worker</p>
                </div>

                {resolved ? (
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold font-mono flex items-center gap-1.5">
                    <Check className="w-4 h-4" />
                    Fixed & Applied
                  </span>
                ) : (
                  <button
                    onClick={handleApplyFix}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-glow transition-all active:scale-95"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Enable Extension</span>
                  </button>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-devbox-border flex items-center justify-between bg-devbox-card/90">
          <button
            onClick={handleRunAiDiagnostics}
            disabled={analyzing}
            className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Re-Analyze Logs</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-devbox-panel hover:bg-devbox-hover text-devbox-muted text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
