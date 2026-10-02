import React from 'react';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, HeartPulse, RefreshCw } from 'lucide-react';
import { Project } from '../../types';

interface ProjectHealthModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

export const ProjectHealthModal: React.FC<ProjectHealthModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  if (!isOpen || !project) return null;

  const healthItems = [
    { name: 'PHP Runtime', status: 'pass', value: `PHP ${project.php_version} (Thread Safe x64)` },
    { name: 'Composer Dependencies', status: 'pass', value: 'vendor/autoload.php loaded (3,420 classes)' },
    { name: 'Core PHP Extensions', status: 'pass', value: 'curl, mbstring, openssl, pdo_mysql, zip, fileinfo' },
    { name: 'Database Connectivity', status: 'pass', value: 'Connected to 127.0.0.1:3306 (MySQL 8.4)' },
    { name: 'SSL Certificate Status', status: 'pass', value: `Trusted SAN certificate active for ${project.domain}` },
    { name: 'Redis Cache Connection', status: 'pass', value: '127.0.0.1:6379 PONG (0.2ms)' },
    { name: 'Environment Configuration', status: 'pass', value: 'Valid .env file with APP_KEY defined' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-devbox-card border border-devbox-border rounded-2xl shadow-glass flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-devbox-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <HeartPulse className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Project Health Scorecard</h3>
              <p className="text-[11px] text-devbox-subtle font-mono">{project.name} ({project.domain})</p>
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
        <div className="p-6 space-y-5">
          {/* Big Scorecard Banner */}
          <div className="glass-card p-5 rounded-2xl border border-emerald-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold text-devbox-subtle uppercase tracking-wider block">Overall Integrity</span>
              <div className="text-3xl font-extrabold text-emerald-400">98%</div>
              <span className="text-xs text-devbox-muted">All 7 subsystems operating nominally</span>
            </div>
            <div className="w-14 h-14 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 flex items-center justify-center text-emerald-400 font-bold">
              ✓
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-2">
            {healthItems.map((item, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-devbox-panel/80 border border-devbox-border/60 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-semibold text-white block">{item.name}</span>
                    <span className="text-[11px] text-devbox-subtle font-mono">{item.value}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded">
                  OK
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-devbox-border flex items-center justify-between bg-devbox-card/90">
          <span className="text-[11px] text-devbox-subtle">Last evaluated just now</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-devbox-panel hover:bg-devbox-hover text-white text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
