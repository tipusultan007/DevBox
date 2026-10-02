import React, { useState, useEffect } from 'react';
import { Network, RefreshCw, AlertTriangle, CheckCircle2, Search, XCircle, ShieldAlert, Cpu } from 'lucide-react';
import { api } from '../../services/api';
import { PortItem } from '../../types';

export const PortManagerPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [ports, setPorts] = useState<PortItem[]>([]);

  const fetchPorts = async () => {
    setIsScanning(true);
    try {
      const data = await api.getMonitoredPorts();
      if (Array.isArray(data) && data.length > 0) {
        setPorts(data);
      }
    } catch (err) {
      console.error('Failed to scan ports:', err);
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    fetchPorts();
  }, []);

  const handleRefresh = async () => {
    await fetchPorts();
    setNotice('Port scan completed: Monitored TCP ports refreshed.');
    setTimeout(() => setNotice(null), 3500);
  };

  const handleFreePort = async (portNum: number) => {
    try {
      const res = await api.killPort(portNum);
      setNotice(res.message || `Freed port ${portNum}`);
      await fetchPorts();
    } catch {
      setNotice(`Failed to free port ${portNum}`);
    }
    setTimeout(() => setNotice(null), 3500);
  };

  const filteredPorts = ports.filter(p => 
    p.port.toString().includes(search) ||
    p.service.toLowerCase().includes(search.toLowerCase()) ||
    (p.processName && p.processName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto h-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Port Manager</h2>
          <p className="text-xs text-devbox-muted">
            Inspect all listening TCP ports on Windows, identify IIS/Skype collisions, and manage daemon bindings.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isScanning}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-glow transition-all active:scale-95 disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'Scanning Ports...' : 'Scan Active Ports'}</span>
        </button>
      </div>

      {notice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-400 font-mono animate-in fade-in">
          ✓ {notice}
        </div>
      )}

      {/* Search & Filter */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-devbox-subtle" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by port (e.g. 80), service, or process..."
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-devbox-card border border-devbox-border text-xs text-devbox-text placeholder:text-devbox-subtle focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Port Table */}
      <div className="glass-card rounded-2xl border border-devbox-border/80 overflow-hidden shadow-glass">
        <div className="px-6 py-4 border-b border-devbox-border/60 flex items-center justify-between">
          <h3 className="font-bold text-sm text-white">Monitored Service Ports</h3>
          <span className="text-xs text-devbox-subtle font-mono">{ports.filter(p => p.status === 'active').length} Active Listeners</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-devbox-panel/80 text-devbox-subtle uppercase tracking-wider text-[10px] border-b border-devbox-border/60">
              <tr>
                <th className="py-3 px-6">Port</th>
                <th className="py-3 px-6">Service</th>
                <th className="py-3 px-6">Process (PID)</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Description</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-devbox-border/40 font-mono">
              {filteredPorts.map((entry) => {
                const isActive = entry.status === 'active';
                return (
                  <tr key={entry.port} className="hover:bg-devbox-panel/30 transition-colors">
                    <td className="py-4 px-6 font-bold text-sm text-blue-400">
                      :{entry.port}
                    </td>
                    <td className="py-4 px-6 font-sans font-semibold text-white">
                      {entry.service}
                    </td>
                    <td className="py-4 px-6 text-devbox-muted">
                      {entry.processName ? (
                        <div className="flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 text-purple-400" />
                          <span className="text-devbox-text font-bold">{entry.processName}</span>
                          <span className="text-[10px] text-devbox-subtle">({entry.pid})</span>
                        </div>
                      ) : (
                        <span className="text-devbox-subtle font-sans italic">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-sans ${
                        isActive
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-700/60 text-slate-300'
                      }`}>
                        {entry.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-devbox-subtle font-sans max-w-xs truncate">
                      {entry.description}
                    </td>
                    <td className="py-4 px-6 text-right font-sans">
                      {isActive && entry.pid && (
                        <button
                          onClick={() => handleFreePort(entry.port)}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-colors"
                        >
                          Free Port
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
