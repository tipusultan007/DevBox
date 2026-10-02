import React, { useState } from 'react';
import { X, Eye, EyeOff, Save, Check, Copy, FileSliders, CheckCircle2 } from 'lucide-react';
import { Project } from '../../types';

interface EnvEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

export const EnvEditorModal: React.FC<EnvEditorModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const [revealSecrets, setRevealSecrets] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const [envVars, setEnvVars] = useState<Array<{ key: string; value: string; isSecret?: boolean }>>([
    { key: 'APP_NAME', value: project?.name || 'My Shop' },
    { key: 'APP_ENV', value: 'local' },
    { key: 'APP_KEY', value: 'base64:3uJ2bK1Y9xK49pI21kUVa0M_XgIwwBkgjxdJLy1Gz=', isSecret: true },
    { key: 'APP_DEBUG', value: 'true' },
    { key: 'APP_URL', value: `https://${project?.domain || 'myshop.test'}` },
    { key: 'DB_CONNECTION', value: 'mysql' },
    { key: 'DB_HOST', value: '127.0.0.1' },
    { key: 'DB_PORT', value: '3306' },
    { key: 'DB_DATABASE', value: project?.slug.replace(/-/g, '_') || 'myshop' },
    { key: 'DB_USERNAME', value: 'root' },
    { key: 'DB_PASSWORD', value: 'devbox_local_pass', isSecret: true },
    { key: 'REDIS_HOST', value: '127.0.0.1' },
    { key: 'REDIS_PORT', value: '6379' },
    { key: 'MAIL_MAILER', value: 'smtp' },
    { key: 'MAIL_HOST', value: '127.0.0.1' },
    { key: 'MAIL_PORT', value: '1025' },
  ]);

  if (!isOpen) return null;

  const handleUpdateVar = (index: number, val: string) => {
    setEnvVars((prev) => {
      const next = [...prev];
      next[index].value = val;
      return next;
    });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleCopyAll = () => {
    const raw = envVars.map((v) => `${v.key}=${v.value}`).join('\n');
    navigator.clipboard.writeText(raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-devbox-card border border-devbox-border rounded-2xl shadow-glass flex flex-col overflow-hidden max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-devbox-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <FileSliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Environment Configuration (.env)</h3>
              <p className="text-[11px] text-devbox-subtle font-mono">{project?.path}\\.env</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-devbox-subtle hover:text-white hover:bg-devbox-hover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-2.5 bg-devbox-panel/60 border-b border-devbox-border flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRevealSecrets(!revealSecrets)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-devbox-card hover:bg-devbox-hover text-devbox-muted hover:text-white border border-devbox-border transition-colors"
            >
              {revealSecrets ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{revealSecrets ? 'Mask Secrets' : 'Reveal Secrets'}</span>
            </button>

            <button
              onClick={handleCopyAll}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-devbox-card hover:bg-devbox-hover text-devbox-muted hover:text-white border border-devbox-border transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied .env' : 'Copy All'}</span>
            </button>
          </div>

          {saved && (
            <span className="text-emerald-400 font-mono text-xs flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Saved to disk
            </span>
          )}
        </div>

        {/* Editor Rows */}
        <div className="p-6 overflow-y-auto space-y-2.5 flex-1 font-mono text-xs">
          {envVars.map((v, i) => (
            <div key={v.key} className="flex items-center gap-3">
              <span className="w-44 text-devbox-muted font-semibold shrink-0 select-none text-right">
                {v.key}
              </span>
              <span className="text-devbox-subtle select-none">=</span>
              <input
                type={v.isSecret && !revealSecrets ? 'password' : 'text'}
                value={v.value}
                onChange={(e) => handleUpdateVar(i, e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg bg-devbox-panel border border-devbox-border/80 text-devbox-text focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-devbox-border flex items-center justify-between bg-devbox-card/90">
          <span className="text-xs text-devbox-subtle">
            Changes apply on next service request / PHP worker restart.
          </span>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-devbox-panel hover:bg-devbox-hover text-devbox-muted text-xs font-semibold transition-colors"
            >
              Close
            </button>

            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-glow transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Save .env</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
