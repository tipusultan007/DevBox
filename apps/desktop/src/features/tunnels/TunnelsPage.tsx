import React, { useState } from 'react';
import {
  Cloud,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Square,
  ShieldCheck,
  ShieldAlert,
  Radio,
  Clock,
  Sparkles,
  Globe,
  KeyRound,
  Layers,
  ArrowRight
} from 'lucide-react';
import { TunnelItem, Project } from '../../types';

interface TunnelsPageProps {
  tunnels: TunnelItem[];
  projects: Project[];
  onStartQuickTunnel: (projectId: number) => Promise<void>;
  onStopTunnel: (id: number) => Promise<void>;
}

export const TunnelsPage: React.FC<TunnelsPageProps> = ({
  tunnels,
  projects,
  onStartQuickTunnel,
  onStopTunnel,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<number>(projects[0]?.id || 1);
  const [tunnelMode, setTunnelMode] = useState<'quick' | 'persistent' | 'account'>('quick');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Mode 2 fields
  const [persistentHostname, setPersistentHostname] = useState('demo.example.com');
  const [tunnelToken, setTunnelToken] = useState('eyJhIjoiOGE1Z...');

  // Mode 3 fields
  const [cfToken, setCfToken] = useState('CF_api_token_xxxxxxxxxxxx');
  const [selectedZone, setSelectedZone] = useState('mydomain.com');
  const [subdomainPrefix, setSubdomainPrefix] = useState('preview');
  const [accountConnected, setAccountConnected] = useState(false);

  const handleCopy = (id: number, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreate = async () => {
    setIsCreating(true);
    await onStartQuickTunnel(selectedProjectId);
    setIsCreating(false);
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto h-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Cloudflare Tunnel Sharing</h2>
          <p className="text-xs text-devbox-muted">
            Share local HTTP/HTTPS services securely using outbound Cloudflare tunnels without port forwarding.
          </p>
        </div>

        <div className="flex items-center gap-2 p-2 px-3 rounded-xl bg-devbox-panel border border-devbox-border text-xs text-devbox-muted">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Tunnel Guard: Non-HTTP ports automatically blocked (§14)</span>
        </div>
      </div>

      {/* Mode Selector Tabs (§13: Mode 1 Quick, Mode 2 Persistent, Mode 3 Cloudflare Account) */}
      <div className="glass-card p-6 rounded-2xl border border-blue-500/30 space-y-5">
        <div className="flex items-center justify-between border-b border-devbox-border/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Create Tunnel</h3>
              <p className="text-xs text-devbox-muted">Choose your sharing architecture mode.</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-devbox-panel rounded-xl border border-devbox-border text-xs">
            {[
              { id: 'quick', label: 'Mode 1: Quick Tunnel' },
              { id: 'persistent', label: 'Mode 2: Persistent' },
              { id: 'account', label: 'Mode 3: CF Account' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setTunnelMode(m.id as any)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  tunnelMode === m.id
                    ? 'bg-blue-600 text-white shadow-glow'
                    : 'text-devbox-muted hover:text-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* MODE 1: Quick Tunnel */}
        {tunnelMode === 'quick' && (
          <div className="space-y-4">
            <p className="text-xs text-devbox-muted">
              Instantly provisions an ephemeral <code className="text-blue-300 font-mono">*.trycloudflare.com</code> URL. Ideal for temporary client demos and webhook testing without login.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="w-full sm:w-80">
                <label className="block text-[10px] uppercase font-semibold text-devbox-subtle mb-1">Target Project</label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-devbox-panel border border-devbox-border text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.domain})
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full sm:w-auto self-end">
                <button
                  onClick={handleCreate}
                  disabled={isCreating}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-glow transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Cloud className="w-4 h-4" />
                  <span>{isCreating ? 'Provisioning Quick Tunnel...' : 'Start Quick Tunnel'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: Persistent Tunnel */}
        {tunnelMode === 'persistent' && (
          <div className="space-y-4">
            <p className="text-xs text-devbox-muted">
              Binds to a custom corporate hostname with continuous cloudflared ingress rules and stable credentials.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-semibold text-devbox-subtle mb-1">Project</label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-devbox-panel border border-devbox-border text-xs text-white focus:outline-none"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.domain})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-semibold text-devbox-subtle mb-1">Custom Hostname</label>
                <input
                  type="text"
                  value={persistentHostname}
                  onChange={(e) => setPersistentHostname(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-devbox-panel border border-devbox-border text-xs text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-semibold text-devbox-subtle mb-1">Tunnel Secret Token</label>
                <input
                  type="password"
                  value={tunnelToken}
                  onChange={(e) => setTunnelToken(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-devbox-panel border border-devbox-border text-xs text-white font-mono focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleCreate}
              disabled={isCreating}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-glow transition-all active:scale-95"
            >
              Start Persistent Tunnel
            </button>
          </div>
        )}

        {/* MODE 3: Cloudflare Account Integration */}
        {tunnelMode === 'account' && (
          <div className="space-y-4">
            <p className="text-xs text-devbox-muted">
              Connect your Cloudflare account to manage domains, subdomains, and DNS routes directly from DevBox without opening the browser dashboard.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-semibold text-devbox-subtle mb-1">Cloudflare API Token</label>
                <input
                  type="password"
                  value={cfToken}
                  onChange={(e) => setCfToken(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-devbox-panel border border-devbox-border text-xs text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-semibold text-devbox-subtle mb-1">Zone / Domain</label>
                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-devbox-panel border border-devbox-border text-xs text-white focus:outline-none"
                >
                  <option value="mydomain.com">mydomain.com (Active)</option>
                  <option value="client-apps.io">client-apps.io (Active)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-semibold text-devbox-subtle mb-1">Subdomain Prefix</label>
                <input
                  type="text"
                  value={subdomainPrefix}
                  onChange={(e) => setSubdomainPrefix(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-devbox-panel border border-devbox-border text-xs text-emerald-400 font-mono focus:outline-none"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-devbox-panel/80 border border-devbox-border text-xs font-mono text-devbox-subtle flex items-center justify-between">
              <span>DNS Preview: <strong>{subdomainPrefix}.{selectedZone}</strong> CNAME &rarr; cloudflare-tunnel-uuid.cfargotunnel.com</span>
              <span className="text-emerald-400">DNS Proxy: ON</span>
            </div>

            <button
              onClick={handleCreate}
              disabled={isCreating}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-glow transition-all active:scale-95"
            >
              Route DNS & Start Tunnel
            </button>
          </div>
        )}
      </div>

      {/* Security Warning Matrix (§14: Tunnel Security) */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-200">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Tunnel Security Boundary Policy (§14)</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px] pt-1">
          <div className="p-2 rounded bg-black/40 border border-amber-500/20 text-emerald-400">
            ✓ HTTP Project (:80)
          </div>
          <div className="p-2 rounded bg-black/40 border border-amber-500/20 text-emerald-400">
            ✓ HTTPS Project (:443)
          </div>
          <div className="p-2 rounded bg-black/40 border border-amber-500/20 text-rose-400">
            ✗ MySQL (:3306) Blocked
          </div>
          <div className="p-2 rounded bg-black/40 border border-amber-500/20 text-rose-400">
            ✗ Redis (:6379) Blocked
          </div>
        </div>
      </div>

      {/* Active Tunnels */}
      <div className="glass-card rounded-2xl border border-devbox-border/80 overflow-hidden">
        <div className="px-6 py-4 border-b border-devbox-border/60 flex items-center justify-between">
          <h3 className="font-bold text-sm text-white">Active Tunnels</h3>
          <span className="text-xs text-devbox-subtle font-mono">{tunnels.length} Online</span>
        </div>

        {tunnels.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <Cloud className="w-10 h-10 text-devbox-subtle mx-auto" />
            <p className="text-sm font-semibold text-white">No active tunnels</p>
            <p className="text-xs text-devbox-muted">Launch a tunnel above to share your project over the internet.</p>
          </div>
        ) : (
          <div className="divide-y divide-devbox-border/60">
            {tunnels.map((tunnel) => (
              <div
                key={tunnel.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-devbox-panel/30 transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
                    <h4 className="font-bold text-base text-white">{tunnel.project_name}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase">
                      {tunnel.mode} Tunnel
                    </span>
                  </div>

                  {tunnel.public_url && (
                    <div className="flex items-center gap-2">
                      <a
                        href={tunnel.public_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-mono text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        {tunnel.public_url}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <button
                        onClick={() => handleCopy(tunnel.id, tunnel.public_url!)}
                        title="Copy Public URL"
                        className="p-1 rounded hover:bg-devbox-hover text-devbox-muted hover:text-white transition-colors"
                      >
                        {copiedId === tunnel.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-xs font-mono text-devbox-subtle">
                    <span>Target: {tunnel.target_url}</span>
                    {tunnel.pid && <span>PID: {tunnel.pid}</span>}
                    <span>Created: {tunnel.created_at}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onStopTunnel(tunnel.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Square className="w-3.5 h-3.5" />
                    <span>Stop Tunnel</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
