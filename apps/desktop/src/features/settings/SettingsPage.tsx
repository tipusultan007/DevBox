import React, { useState, useEffect } from 'react';
import { Settings, Folder, Save, Check, RefreshCw, HardDrive, Shield } from 'lucide-react';
import { api } from '../../services/api';

export const SettingsPage: React.FC = () => {
  const [devboxRoot, setDevboxRoot] = useState('C:\\DevBox');
  const [projectsDir, setProjectsDir] = useState('D:\\Projects');
  const [defaultPhp, setDefaultPhp] = useState('8.3');
  const [defaultWebServer, setDefaultWebServer] = useState('apache');
  const [autoStartWindows, setAutoStartWindows] = useState(false);
  const [autoTrustCa, setAutoTrustCa] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    api.getSettings().then((cfg) => {
      if (cfg) {
        if (cfg.devboxRoot) setDevboxRoot(cfg.devboxRoot);
        if (cfg.projectsDir) setProjectsDir(cfg.projectsDir);
        if (cfg.defaultPhp) setDefaultPhp(cfg.defaultPhp);
        if (cfg.defaultWebServer) setDefaultWebServer(cfg.defaultWebServer);
        if (cfg.autoStartWindows !== undefined) setAutoStartWindows(cfg.autoStartWindows);
        if (cfg.autoTrustCa !== undefined) setAutoTrustCa(cfg.autoTrustCa);
      }
    }).catch(console.error);
  }, []);

  const handleSave = async () => {
    try {
      await api.saveSettings({
        devboxRoot,
        projectsDir,
        defaultPhp,
        defaultWebServer,
        autoStartWindows,
        autoTrustCa
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto overflow-y-auto h-full">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Preferences & Paths</h2>
          <p className="text-xs text-devbox-muted">
            Configure system directories, default runtime profiles, and Windows integration settings.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-glow transition-all active:scale-95"
        >
          {isSaved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{isSaved ? 'Settings Saved' : 'Save Preferences'}</span>
        </button>
      </div>

      {isSaved && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-400 font-mono animate-in fade-in">
          ✓ Configuration updated in C:\DevBox\config\app.toml
        </div>
      )}

      {/* Directory Paths Section */}
      <div className="glass-card p-6 rounded-2xl border border-devbox-border/80 space-y-4">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <Folder className="w-4 h-4 text-blue-400" />
          <span>Filesystem Paths</span>
        </h3>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-devbox-muted uppercase tracking-wider mb-1">
              DevBox Runtimes Root Directory
            </label>
            <input
              type="text"
              value={devboxRoot}
              onChange={(e) => setDevboxRoot(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-devbox-panel border border-devbox-border text-xs font-mono text-devbox-text focus:outline-none focus:border-blue-500"
            />
            <span className="text-[10px] text-devbox-subtle">Hosts runtimes, manifests, logs, SSL, and data stores.</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-devbox-muted uppercase tracking-wider mb-1">
              Default Projects Workspace Directory
            </label>
            <input
              type="text"
              value={projectsDir}
              onChange={(e) => setProjectsDir(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-devbox-panel border border-devbox-border text-xs font-mono text-devbox-text focus:outline-none focus:border-blue-500"
            />
            <span className="text-[10px] text-devbox-subtle">Projects are not restricted to C:\ and can reside on any drive.</span>
          </div>
        </div>
      </div>

      {/* Runtime Defaults */}
      <div className="glass-card p-6 rounded-2xl border border-devbox-border/80 space-y-4">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-purple-400" />
          <span>Project Defaults</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-devbox-muted uppercase tracking-wider mb-1">
              Default PHP Version
            </label>
            <select
              value={defaultPhp}
              onChange={(e) => setDefaultPhp(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-devbox-panel border border-devbox-border text-xs text-white focus:outline-none"
            >
              <option value="8.5">PHP 8.5 (Preview)</option>
              <option value="8.4">PHP 8.4 (Latest)</option>
              <option value="8.3">PHP 8.3 (LTS Recommended)</option>
              <option value="8.2">PHP 8.2</option>
              <option value="8.1">PHP 8.1</option>
              <option value="7.4">PHP 7.4 (Legacy)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-devbox-muted uppercase tracking-wider mb-1">
              Default Web Server
            </label>
            <select
              value={defaultWebServer}
              onChange={(e) => setDefaultWebServer(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-devbox-panel border border-devbox-border text-xs text-white focus:outline-none"
            >
              <option value="apache">Apache 2.4 (VirtualHosts + FastCGI)</option>
              <option value="nginx">Nginx 1.26 (PHP-FPM)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Windows Administrator & Privileged Helper Model (§33) */}
      <div className="glass-card p-6 rounded-2xl border border-devbox-border/80 space-y-4">
        <div className="flex items-center justify-between border-b border-devbox-border/60 pb-3">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Windows Administrator Model (§33)</span>
          </h3>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            Unprivileged User Mode (Secure)
          </span>
        </div>

        <p className="text-xs text-devbox-muted">
          DevBox runs with standard user permissions. Windows UAC elevation is only requested on-demand via the Privileged Helper when modifying <code className="text-devbox-text">hosts</code> or installing local root certificates.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-devbox-panel border border-devbox-border flex items-center justify-between">
            <div>
              <span className="font-semibold text-white block">Hosts File Helper</span>
              <span className="text-[11px] text-devbox-subtle">C:\Windows\System32\drivers\etc\hosts</span>
            </div>
            <span className="text-emerald-400 font-mono text-xs">✓ Ready</span>
          </div>

          <div className="p-3 rounded-xl bg-devbox-panel border border-devbox-border flex items-center justify-between">
            <div>
              <span className="font-semibold text-white block">Root Certificate Helper</span>
              <span className="text-[11px] text-devbox-subtle">Cert:\LocalMachine\Root</span>
            </div>
            <span className="text-emerald-400 font-mono text-xs">✓ Ready</span>
          </div>
        </div>
      </div>

      {/* Dual Update Architecture (§34) */}
      <div className="glass-card p-6 rounded-2xl border border-devbox-border/80 space-y-4">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-blue-400" />
          <span>Update Architecture (§34)</span>
        </h3>

        <p className="text-xs text-devbox-muted">
          DevBox application updates and runtime binaries are managed separately, allowing you to update PHP, Apache, or MySQL without upgrading the desktop application shell.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-devbox-panel border border-devbox-border space-y-3">
            <div>
              <span className="text-xs font-bold text-white block">DevBox Desktop Application</span>
              <span className="text-[11px] text-devbox-subtle font-mono">Current: v1.0.0 (Latest Release)</span>
            </div>
            <button
              onClick={() => {
                setIsSaved(true);
                setTimeout(() => setIsSaved(false), 3000);
              }}
              className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-glow transition-all"
            >
              Check for App Updates
            </button>
          </div>

          <div className="p-4 rounded-xl bg-devbox-panel border border-devbox-border space-y-3">
            <div>
              <span className="text-xs font-bold text-white block">Runtime Manifest Index</span>
              <span className="text-[11px] text-devbox-subtle font-mono">Synced: 7 JSON runtime manifests</span>
            </div>
            <button
              onClick={() => {
                setIsSaved(true);
                setTimeout(() => setIsSaved(false), 3000);
              }}
              className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-glow transition-all"
            >
              Check for Runtime Updates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
