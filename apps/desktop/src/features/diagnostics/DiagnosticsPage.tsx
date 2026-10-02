import React, { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Zap,
  Server,
  Network,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { DiagnosticCheck } from '../../types';

interface DiagnosticsPageProps {
  checks: DiagnosticCheck[];
  onRunDiagnostics: () => Promise<void>;
  onResolveIssue: (actionId: string) => Promise<void>;
  isRunning: boolean;
}

export const DiagnosticsPage: React.FC<DiagnosticsPageProps> = ({
  checks,
  onRunDiagnostics,
  onResolveIssue,
  isRunning,
}) => {
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const handleResolve = async (actionId: string) => {
    setResolvingId(actionId);
    await onResolveIssue(actionId);
    setResolvingId(null);
  };

  const passCount = checks.filter((c) => c.status === 'pass').length;
  const healthPercent = Math.round((passCount / (checks.length || 1)) * 100);

  const ports = [
    { port: 80, name: 'Apache HTTP', status: 'In Use', owner: 'httpd.exe (PID 4216)', color: 'emerald' },
    { port: 443, name: 'Apache SSL', status: 'In Use', owner: 'httpd.exe (PID 4216)', color: 'emerald' },
    { port: 3306, name: 'MySQL Database', status: 'In Use', owner: 'mysqld.exe (PID 5128)', color: 'emerald' },
    { port: 6379, name: 'Redis Cache', status: 'In Use', owner: 'redis-server.exe (PID 6044)', color: 'emerald' },
    { port: 8080, name: 'Nginx Alternative', status: 'Free', owner: 'Available', color: 'slate' },
    { port: 8025, name: 'Mailpit Web UI', status: 'Free', owner: 'Available', color: 'slate' },
  ];

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto h-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Diagnostics Engine</h2>
          <p className="text-xs text-devbox-muted">
            Intelligent Windows environment scanner detecting port 80/IIS collisions, missing PHP modules, and SSL trust state.
          </p>
        </div>

        <button
          onClick={onRunDiagnostics}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-glow transition-all active:scale-95 disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
          <span>{isRunning ? 'Analyzing System...' : 'Run Diagnostics'}</span>
        </button>
      </div>

      {/* Health Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-devbox-border/80 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-devbox-subtle uppercase tracking-wider">Health Rating</span>
            <div className="text-3xl font-extrabold text-white">{healthPercent}%</div>
            <p className="text-xs text-emerald-400 font-medium">All critical checks passing</p>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-emerald-500/30 border-t-emerald-400 flex items-center justify-center font-bold text-lg text-emerald-400">
            {healthPercent}%
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-devbox-border/80 md:col-span-2 space-y-3">
          <span className="text-xs font-semibold text-devbox-subtle uppercase tracking-wider block">Port Allocation Scanner</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {ports.map((p) => (
              <div key={p.port} className="p-2.5 rounded-xl bg-devbox-panel border border-devbox-border/60 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-blue-400">:{p.port}</span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                    p.status === 'In Use' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {p.status}
                  </span>
                </div>
                <p className="text-[11px] font-medium text-devbox-text mt-1">{p.name}</p>
                <p className="text-[10px] text-devbox-subtle font-mono truncate">{p.owner}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Diagnostics Results List */}
      <div className="glass-card rounded-2xl border border-devbox-border/80 overflow-hidden">
        <div className="px-6 py-4 border-b border-devbox-border/60 flex items-center justify-between">
          <h3 className="font-bold text-sm text-white">Diagnostic Verification Checks</h3>
          <span className="text-xs text-devbox-subtle font-mono">{passCount} / {checks.length} Passed</span>
        </div>

        <div className="divide-y divide-devbox-border/60">
          {checks.map((chk) => {
            const isPass = chk.status === 'pass';
            const isWarn = chk.status === 'warn';

            return (
              <div
                key={chk.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-devbox-panel/30 transition-colors"
              >
                <div className="flex items-start gap-3.5">
                  <div className="mt-0.5">
                    {isPass && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                    {isWarn && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                    {!isPass && !isWarn && <XCircle className="w-5 h-5 text-rose-500" />}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{chk.title}</span>
                      <span className="px-2 py-0.2 rounded text-[10px] font-semibold uppercase bg-devbox-panel border border-devbox-border text-devbox-subtle">
                        {chk.category}
                      </span>
                    </div>
                    <p className="text-xs text-devbox-muted">{chk.message}</p>
                  </div>
                </div>

                {chk.action_label && chk.action_id && (
                  <button
                    onClick={() => handleResolve(chk.action_id!)}
                    disabled={resolvingId === chk.action_id}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold self-start sm:self-center shrink-0 transition-colors"
                  >
                    {resolvingId === chk.action_id ? 'Resolving...' : chk.action_label}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
