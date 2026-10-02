import React, { useState, useEffect } from 'react';
import {
  Search,
  FolderGit2,
  Zap,
  Boxes,
  Database,
  Globe,
  Cloud,
  Activity,
  Terminal,
  Play,
  Square,
  ExternalLink,
  Plus,
  Sparkles,
  Command,
  X
} from 'lucide-react';
import { Project, Service, NavigationTab } from '../../types';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  services: Service[];
  onNavigate: (tab: NavigationTab) => void;
  onOpenProject: (domain: string) => void;
  onOpenProjectTerminal: (project: Project) => void;
  onStartService: (type: string) => void;
  onStopService: (type: string) => void;
  onNewProject: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  projects,
  services,
  onNavigate,
  onOpenProject,
  onOpenProjectTerminal,
  onStartService,
  onStopService,
  onNewProject,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Global Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open triggered by parent if wired
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Build command items
  const items = [
    // Navigation
    { id: 'nav-dash', category: 'Navigation', title: 'Go to Dashboard', icon: Sparkles, action: () => { onNavigate('dashboard'); onClose(); } },
    { id: 'nav-proj', category: 'Navigation', title: 'Go to Projects', icon: FolderGit2, action: () => { onNavigate('projects'); onClose(); } },
    { id: 'nav-serv', category: 'Navigation', title: 'Go to Services', icon: Zap, action: () => { onNavigate('services'); onClose(); } },
    { id: 'nav-php', category: 'Navigation', title: 'Go to PHP Version Manager', icon: Boxes, action: () => { onNavigate('php'); onClose(); } },
    { id: 'nav-db', category: 'Navigation', title: 'Go to Database Manager', icon: Database, action: () => { onNavigate('databases'); onClose(); } },
    { id: 'nav-dom', category: 'Navigation', title: 'Go to Domains & SSL', icon: Globe, action: () => { onNavigate('domains'); onClose(); } },
    { id: 'nav-tun', category: 'Navigation', title: 'Go to Cloudflare Tunnels', icon: Cloud, action: () => { onNavigate('tunnels'); onClose(); } },
    { id: 'nav-port', category: 'Navigation', title: 'Go to Port Manager', icon: Activity, action: () => { onNavigate('ports'); onClose(); } },
    { id: 'nav-diag', category: 'Navigation', title: 'Go to Diagnostics & Health', icon: Activity, action: () => { onNavigate('diagnostics'); onClose(); } },

    // Quick Action
    { id: 'act-new-proj', category: 'Actions', title: 'Create New Project (Wizard)', icon: Plus, action: () => { onNewProject(); onClose(); } },

    // Projects
    ...projects.map((p) => ({
      id: `proj-${p.id}`,
      category: 'Projects',
      title: `Open ${p.name} (https://${p.domain})`,
      icon: ExternalLink,
      action: () => { onOpenProject(p.domain); onClose(); }
    })),
    ...projects.map((p) => ({
      id: `proj-term-${p.id}`,
      category: 'Project Terminal',
      title: `Terminal: ${p.name} (PHP ${p.php_version})`,
      icon: Terminal,
      action: () => { onOpenProjectTerminal(p); onClose(); }
    })),

    // Services
    ...services.map((s) => ({
      id: `serv-toggle-${s.id}`,
      category: 'Service Controls',
      title: s.status === 'running' ? `Stop ${s.name} (: ${s.port})` : `Start ${s.name} (: ${s.port})`,
      icon: s.status === 'running' ? Square : Play,
      action: () => {
        if (s.status === 'running') onStopService(s.service_type);
        else onStartService(s.service_type);
        onClose();
      }
    }))
  ];

  const filtered = items.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-devbox-card border border-devbox-border rounded-2xl shadow-glass overflow-hidden flex flex-col">
        {/* Search Header */}
        <div className="p-4 border-b border-devbox-border flex items-center gap-3 bg-devbox-panel/80">
          <Search className="w-5 h-5 text-devbox-subtle" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            placeholder="Type a command, project, service, or destination (Esc to close)..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-devbox-subtle focus:outline-none"
          />
          <kbd className="px-2 py-0.5 rounded text-[10px] font-mono bg-devbox-card border border-devbox-border text-devbox-subtle">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-devbox-subtle">
              No matching commands or projects found for "{query}".
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  className="px-3.5 py-2.5 rounded-xl hover:bg-devbox-panel cursor-pointer flex items-center justify-between text-xs transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-devbox-card border border-devbox-border/60 text-devbox-subtle group-hover:text-blue-400 group-hover:border-blue-500/40 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-white block">{item.title}</span>
                      <span className="text-[10px] text-devbox-subtle">{item.category}</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-devbox-subtle group-hover:text-blue-400">
                    Jump &rarr;
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-devbox-border bg-devbox-panel/40 flex items-center justify-between text-[11px] text-devbox-subtle">
          <div className="flex items-center gap-3">
            <span>Navigation: <kbd className="px-1.5 py-0.5 rounded bg-devbox-card border border-devbox-border font-mono text-[9px]">Tab</kbd></span>
            <span>Select: <kbd className="px-1.5 py-0.5 rounded bg-devbox-card border border-devbox-border font-mono text-[9px]">Click</kbd></span>
          </div>
          <span className="font-mono">DevBox Command Palette</span>
        </div>
      </div>
    </div>
  );
};
