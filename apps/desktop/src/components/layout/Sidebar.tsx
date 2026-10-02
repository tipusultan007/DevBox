import React from 'react';
import {
  LayoutDashboard,
  FolderGit2,
  Zap,
  Boxes,
  Database,
  Globe,
  Cloud,
  FileText,
  Activity,
  Settings,
  Terminal,
  ShieldCheck,
  Network,
  Layers,
  Sparkles,
  Puzzle,
  Award
} from 'lucide-react';
import { NavigationTab } from '../../types';

interface SidebarProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  onOpenTerminal: () => void;
  onOpenAiTroubleshooter: () => void;
  onOpenLicensing: () => void;
  activeCliPhp: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  onOpenTerminal,
  onOpenAiTroubleshooter,
  onOpenLicensing,
  activeCliPhp
}) => {
  const navItems = [
    { id: 'dashboard' as NavigationTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects' as NavigationTab, label: 'Projects', icon: FolderGit2 },
    { id: 'profiles' as NavigationTab, label: 'Profiles', icon: Layers, badge: 'Pro' },
    { id: 'services' as NavigationTab, label: 'Services', icon: Zap },
    { id: 'ports' as NavigationTab, label: 'Port Manager', icon: Network },
    { id: 'php' as NavigationTab, label: 'PHP Versions', icon: Boxes, subtext: `CLI: ${activeCliPhp}` },
    { id: 'databases' as NavigationTab, label: 'Databases', icon: Database },
    { id: 'domains' as NavigationTab, label: 'Domains & SSL', icon: Globe },
    { id: 'tunnels' as NavigationTab, label: 'Cloudflare Tunnels', icon: Cloud, badge: 'Live' },
    { id: 'plugins' as NavigationTab, label: 'Plugins', icon: Puzzle },
    { id: 'diagnostics' as NavigationTab, label: 'Diagnostics', icon: Activity },
    { id: 'logs' as NavigationTab, label: 'Logs', icon: FileText },
  ];

  return (
    <aside className="w-64 bg-devbox-card/90 border-r border-devbox-border flex flex-col justify-between shrink-0 select-none overflow-y-auto">
      {/* Brand Header */}
      <div>
        <div className="h-16 px-5 flex items-center gap-3 border-b border-devbox-border/80">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 p-0.5 shadow-glow flex items-center justify-center">
            <div className="w-full h-full bg-devbox-bg rounded-[10px] flex items-center justify-center">
              <Boxes className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-wide bg-gradient-to-r from-blue-400 via-indigo-300 to-white bg-clip-text text-transparent">
                  DEVBOX
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">
                  v0.1
                </span>
              </div>
            </div>
            <p className="text-[11px] text-devbox-subtle font-mono">PHP / Windows</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                    : 'text-devbox-muted hover:bg-devbox-hover/60 hover:text-devbox-text border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-devbox-subtle'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                    item.badge === 'Live'
                      ? 'bg-emerald-500/20 text-emerald-400 animate-pulse'
                      : item.badge === 'Pro'
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'bg-devbox-panel text-devbox-muted'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {item.subtext && !isActive && (
                  <span className="text-[10px] text-devbox-subtle font-mono">{item.subtext}</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Quick Tools */}
      <div className="p-3 border-t border-devbox-border/80 space-y-1">
        <button
          onClick={onOpenAiTroubleshooter}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-purple-900/30 to-blue-900/30 hover:from-purple-900/50 hover:to-blue-900/50 text-purple-300 border border-purple-500/30 shadow-glow transition-all"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin" />
            <span>DevBox AI</span>
          </div>
          <span className="text-[9px] bg-purple-500/30 px-1.5 py-0.5 rounded text-white font-bold">Assist</span>
        </button>

        <button
          onClick={onOpenTerminal}
          className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium text-devbox-muted hover:bg-devbox-hover hover:text-devbox-text transition-colors border border-transparent"
        >
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span>DevBox Terminal</span>
        </button>

        <div className="flex gap-1 pt-1">
          <button
            onClick={onOpenLicensing}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-[11px] font-semibold transition-colors"
          >
            <Award className="w-3 h-3" />
            <span>Pro Edition</span>
          </button>

          <button
            onClick={() => onTabChange('settings')}
            className={`p-1.5 rounded-lg border transition-colors ${
              currentTab === 'settings'
                ? 'bg-blue-600/15 text-blue-400 border-blue-500/30'
                : 'text-devbox-muted hover:bg-devbox-hover border-devbox-border'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
