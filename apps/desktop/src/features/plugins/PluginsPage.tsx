import React, { useState } from 'react';
import {
  Boxes,
  Download,
  Check,
  Power,
  Search,
  ExternalLink,
  Sparkles,
  Server,
  Database,
  Mail,
  Zap,
  HardDrive
} from 'lucide-react';
import { PluginItem } from '../../types';

export const PluginsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [plugins, setPlugins] = useState<PluginItem[]>([
    { id: 'mailpit', name: 'Mailpit', version: '1.22.3', type: 'service', description: 'Lightweight local email testing server with modern web interface and SMTP listener.', default_port: 8025, is_installed: true, is_running: false, icon: 'Mail' },
    { id: 'meilisearch', name: 'Meilisearch', version: '1.9.0', type: 'search', description: 'Ultra-fast, open-source search engine with intuitive REST API and typo tolerance.', default_port: 7700, is_installed: false, is_running: false, icon: 'Zap' },
    { id: 'postgresql', name: 'PostgreSQL Server', version: '16.4', type: 'database', description: 'Advanced open-source relational SQL database with JSONB support.', default_port: 5432, is_installed: false, is_running: false, icon: 'Database' },
    { id: 'mongodb', name: 'MongoDB Community', version: '7.0.12', type: 'database', description: 'NoSQL document database designed for modern web apps and agile development.', default_port: 27017, is_installed: false, is_running: false, icon: 'Database' },
    { id: 'minio', name: 'MinIO Object Storage', version: 'RELEASE.2024', type: 'storage', description: 'S3-compatible local object storage server for testing file uploads and CDN assets.', default_port: 9000, is_installed: false, is_running: false, icon: 'HardDrive' },
    { id: 'rabbitmq', name: 'RabbitMQ Message Broker', version: '3.13.6', type: 'queue', description: 'Reliable and mature messaging broker for async Laravel background queues.', default_port: 5672, is_installed: false, is_running: false, icon: 'Server' },
    { id: 'ngrok', name: 'Ngrok Tunnel Agent', version: '3.14.0', type: 'tunnel', description: 'Alternative local tunnel provider for instant public URL exposure.', default_port: 4040, is_installed: false, is_running: false, icon: 'Zap' },
  ]);

  const [installingId, setInstallingId] = useState<string | null>(null);

  const handleToggleInstall = (id: string) => {
    setInstallingId(id);
    setTimeout(() => {
      setPlugins(prev => prev.map(p => {
        if (p.id === id) {
          const nextInstall = !p.is_installed;
          return { ...p, is_installed: nextInstall, is_running: nextInstall ? true : false };
        }
        return p;
      }));
      setInstallingId(null);
    }, 600);
  };

  const handleToggleRunning = (id: string) => {
    setPlugins(prev => prev.map(p => p.id === id ? { ...p, is_running: !p.is_running } : p));
  };

  const filteredPlugins = plugins.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase()) ||
    p.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Plugin Ecosystem & Services</h2>
          <p className="text-xs text-devbox-muted">
            Extend your DevBox environment with search engines, NoSQL datastores, object storage, and message brokers.
          </p>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-devbox-subtle" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search plugins..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-devbox-card border border-devbox-border text-xs text-devbox-text placeholder:text-devbox-subtle focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPlugins.map((plugin) => (
          <div
            key={plugin.id}
            className="glass-card rounded-2xl border border-devbox-border/80 hover:border-blue-500/40 p-5 space-y-4 flex flex-col justify-between transition-all shadow-sm"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-white">{plugin.name}</h3>
                  <span className="text-[10px] text-devbox-subtle font-mono">v{plugin.version} • {plugin.type.toUpperCase()}</span>
                </div>

                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  plugin.is_running
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : plugin.is_installed
                    ? 'bg-blue-500/15 text-blue-400'
                    : 'bg-slate-700 text-slate-300'
                }`}>
                  {plugin.is_running ? 'Running' : plugin.is_installed ? 'Installed' : 'Available'}
                </span>
              </div>

              <p className="text-xs text-devbox-muted">
                {plugin.description}
              </p>

              <div className="p-2.5 rounded-xl bg-devbox-panel/80 border border-devbox-border/60 text-xs font-mono text-devbox-subtle flex items-center justify-between">
                <span>Default Port:</span>
                <span className="text-blue-400 font-bold">:{plugin.default_port}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-devbox-border/60 flex items-center justify-between">
              {plugin.is_installed ? (
                <>
                  <button
                    onClick={() => handleToggleRunning(plugin.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      plugin.is_running
                        ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-glow'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{plugin.is_running ? 'Stop' : 'Start'}</span>
                  </button>

                  <button
                    onClick={() => handleToggleInstall(plugin.id)}
                    className="text-xs text-devbox-subtle hover:text-rose-400 transition-colors"
                  >
                    Uninstall
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleToggleInstall(plugin.id)}
                  disabled={installingId === plugin.id}
                  className="w-full py-2 rounded-xl bg-devbox-panel hover:bg-devbox-hover text-white border border-devbox-border text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <Download className={`w-3.5 h-3.5 ${installingId === plugin.id ? 'animate-bounce' : ''}`} />
                  <span>{installingId === plugin.id ? 'Installing Plugin...' : 'Install Plugin'}</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
