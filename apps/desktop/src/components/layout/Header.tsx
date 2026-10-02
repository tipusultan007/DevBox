import React from 'react';
import { Plus, Terminal, RefreshCw, Activity, ExternalLink, Sparkles, Search } from 'lucide-react';
import { Service, NavigationTab } from '../../types';

interface HeaderProps {
  currentTab: NavigationTab;
  services: Service[];
  activeCliPhp: string;
  onOpenNewProject: () => void;
  onOpenTerminal: () => void;
  onOpenAi: () => void;
  onRefresh: () => void;
  onOpenCommandPalette?: () => void;
  isRefreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  services,
  activeCliPhp,
  onOpenNewProject,
  onOpenTerminal,
  onOpenAi,
  onRefresh,
  onOpenCommandPalette,
  isRefreshing
}) => {
  const getTabTitle = (tab: NavigationTab) => {
    switch (tab) {
      case 'dashboard': return 'Dashboard Overview';
      case 'projects': return 'Project Workspace';
      case 'profiles': return 'Environment Profiles';
      case 'services': return 'Background Services';
      case 'ports': return 'Port Manager & Conflict Inspector';
      case 'php': return 'PHP Version Manager';
      case 'databases': return 'Database Management';
      case 'domains': return 'Domains & Local SSL';
      case 'tunnels': return 'Cloudflare Tunnel Sharing';
      case 'plugins': return 'Plugin Ecosystem & Microservices';
      case 'diagnostics': return 'System Diagnostics & Health';
      case 'logs': return 'Live Event & Service Logs';
      case 'settings': return 'DevBox Preferences';
    }
  };

  const apache = services.find(s => s.service_type === 'apache');
  const mysql = services.find(s => s.service_type === 'mysql');
  const redis = services.find(s => s.service_type === 'redis');

  return (
    <header className="h-16 px-6 bg-devbox-card/60 backdrop-blur-md border-b border-devbox-border flex items-center justify-between shrink-0">
      {/* Title & Path */}
      <div className="flex items-center gap-3">
        <h1 className="text-base sm:text-lg font-bold text-devbox-text tracking-tight">
          {getTabTitle(currentTab)}
        </h1>
        <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-devbox-border" />
        <span className="hidden sm:inline-block text-xs font-mono text-devbox-subtle">
          PHP CLI: <span className="text-blue-400 font-semibold">{activeCliPhp}</span>
        </span>
      </div>

      {/* Center Service Pills */}
      <div className="hidden xl:flex items-center gap-2">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-devbox-panel border border-devbox-border text-xs">
          <span className={`w-2 h-2 rounded-full ${apache?.status === 'running' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-slate-600'}`} />
          <span className="text-devbox-muted font-medium">Apache</span>
          <span className="text-[10px] font-mono text-devbox-subtle">:80</span>
        </div>

        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-devbox-panel border border-devbox-border text-xs">
          <span className={`w-2 h-2 rounded-full ${mysql?.status === 'running' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-slate-600'}`} />
          <span className="text-devbox-muted font-medium">MySQL</span>
          <span className="text-[10px] font-mono text-devbox-subtle">:3306</span>
        </div>

        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-devbox-panel border border-devbox-border text-xs">
          <span className={`w-2 h-2 rounded-full ${redis?.status === 'running' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-slate-600'}`} />
          <span className="text-devbox-muted font-medium">Redis</span>
          <span className="text-[10px] font-mono text-devbox-subtle">:6379</span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {onOpenCommandPalette && (
          <button
            onClick={onOpenCommandPalette}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-devbox-panel hover:bg-devbox-hover text-devbox-muted hover:text-white border border-devbox-border text-xs transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-devbox-subtle" />
            <span>Search or jump...</span>
            <kbd className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-devbox-card border border-devbox-border">Ctrl+K</kbd>
          </button>
        )}

        <button
          onClick={onOpenAi}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/15 hover:bg-purple-600/25 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Ask AI</span>
        </button>

        <button
          onClick={onRefresh}
          title="Refresh All"
          className="p-2 rounded-lg bg-devbox-panel hover:bg-devbox-hover text-devbox-muted hover:text-devbox-text border border-devbox-border transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
        </button>

        <button
          onClick={onOpenTerminal}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-devbox-panel hover:bg-devbox-hover text-devbox-text border border-devbox-border text-xs font-medium transition-colors"
        >
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span>Terminal</span>
        </button>

        <button
          onClick={onOpenNewProject}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-glow transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Project</span>
        </button>
      </div>
    </header>
  );
};
