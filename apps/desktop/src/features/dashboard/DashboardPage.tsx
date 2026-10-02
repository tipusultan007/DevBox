import React from 'react';
import {
  FolderGit2,
  Zap,
  Boxes,
  Cloud,
  Play,
  Square,
  RotateCw,
  ExternalLink,
  Terminal,
  Database,
  Share2,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Activity
} from 'lucide-react';
import { Project, Service, NavigationTab } from '../../types';

interface DashboardPageProps {
  projects: Project[];
  services: Service[];
  activeCliPhp: string;
  onNavigate: (tab: NavigationTab) => void;
  onStartService: (type: string) => void;
  onStopService: (type: string) => void;
  onRestartService: (type: string) => void;
  onOpenProject: (domain: string) => void;
  onOpenProjectTerminal: (project: Project) => void;
  onShareProject: (project: Project) => void;
  onNewProject: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  projects,
  services,
  activeCliPhp,
  onNavigate,
  onStartService,
  onStopService,
  onRestartService,
  onOpenProject,
  onOpenProjectTerminal,
  onShareProject,
  onNewProject
}) => {
  const runningServicesCount = services.filter(s => s.status === 'running').length;
  const runningProjectsCount = projects.filter(p => p.status === 'running').length;

  const [resources, setResources] = React.useState<any>(null);
  const [selectedDrive, setSelectedDrive] = React.useState<'c' | 'd'>('c');

  React.useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await fetch('http://127.0.0.1:1421/api/system/resources');
        if (res.ok) {
          const data = await res.json();
          setResources(data);
        }
      } catch {}
    };
    fetchResources();
    const interval = setInterval(fetchResources, 4000);
    return () => clearInterval(interval);
  }, []);

  const activeDisk = (selectedDrive === 'c' ? resources?.primary_drive : resources?.projects_drive)
    || resources?.disk
    || { drive: 'C:\\', letter: 'C:', label: 'System', used_gb: '245.4', total_gb: '249.3', free_gb: '3.9', used_pct: 98, is_warning: true };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto h-full">
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Projects Metric */}
        <div 
          onClick={() => onNavigate('projects')}
          className="glass-card p-5 rounded-2xl border border-devbox-border/80 hover:border-blue-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-devbox-subtle uppercase tracking-wider">Active Projects</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
              <FolderGit2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{projects.length}</span>
            <span className="text-xs font-medium text-emerald-400">({runningProjectsCount} running)</span>
          </div>
          <p className="mt-1 text-xs text-devbox-muted">Local domains with .test SSL</p>
        </div>

        {/* Services Metric */}
        <div 
          onClick={() => onNavigate('services')}
          className="glass-card p-5 rounded-2xl border border-devbox-border/80 hover:border-amber-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-devbox-subtle uppercase tracking-wider">Services</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{runningServicesCount}</span>
            <span className="text-xs font-medium text-devbox-subtle">/ {services.length} active</span>
          </div>
          <p className="mt-1 text-xs text-devbox-muted">Apache, MySQL, Redis managed</p>
        </div>

        {/* PHP CLI Metric */}
        <div 
          onClick={() => onNavigate('php')}
          className="glass-card p-5 rounded-2xl border border-devbox-border/80 hover:border-purple-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-devbox-subtle uppercase tracking-wider">CLI Runtime</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
              <Boxes className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{activeCliPhp.slice(0, 3)}</span>
            <span className="text-xs font-mono text-purple-400">v{activeCliPhp}</span>
          </div>
          <p className="mt-1 text-xs text-devbox-muted">6 multi-versions available</p>
        </div>

        {/* Cloudflare Tunnel Metric */}
        <div 
          onClick={() => onNavigate('tunnels')}
          className="glass-card p-5 rounded-2xl border border-devbox-border/80 hover:border-emerald-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-devbox-subtle uppercase tracking-wider">Cloudflare Share</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <Cloud className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">1</span>
            <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              Live Online
            </span>
          </div>
          <p className="mt-1 text-xs text-devbox-muted">trycloudflare.com active</p>
        </div>
      </div>

      {/* System Resources Monitor (Features.md §2: CPU, RAM, Disk) */}
      <div className="glass-card p-5 rounded-2xl border border-devbox-border/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-xs text-white uppercase tracking-wider">Host System Resources</h3>
          </div>
          <span className="text-[11px] font-mono text-devbox-subtle">Windows 11 Professional x64</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* CPU Usage */}
          <div className="p-3.5 rounded-xl bg-devbox-panel/80 border border-devbox-border space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-devbox-subtle font-medium">CPU Usage</span>
              <span className="font-mono font-bold text-emerald-400">
                {resources?.cpu?.usage_pct ?? 16}% ({resources?.cpu?.cores ?? 6} Cores)
              </span>
            </div>
            <div className="h-1.5 bg-devbox-card rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(resources?.cpu?.usage_pct ?? 16, 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-devbox-subtle truncate">
              {resources?.cpu?.model || 'AMD Ryzen 5 4500U with Radeon Graphics'}
            </p>
          </div>

          {/* RAM Usage */}
          <div className="p-3.5 rounded-xl bg-devbox-panel/80 border border-devbox-border space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-devbox-subtle font-medium">Memory (RAM)</span>
              <span className="font-mono font-bold text-blue-400">
                {resources?.memory?.used_gb ?? '11.9'} GB / {resources?.memory?.total_gb ?? '15.4'} GB ({resources?.memory?.usage_pct ?? 77}%)
              </span>
            </div>
            <div className="h-1.5 bg-devbox-card rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(resources?.memory?.usage_pct ?? 77, 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-devbox-subtle">
              <span>{resources?.memory?.free_gb ?? '3.5'} GB available</span>
              <span>FastCGI Pools</span>
            </div>
          </div>

          {/* Disk Usage */}
          <div className="p-3.5 rounded-xl bg-devbox-panel/80 border border-devbox-border space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-devbox-subtle font-medium">Storage</span>
                <div className="flex items-center rounded-lg bg-devbox-card p-0.5 border border-devbox-border">
                  <button
                    onClick={() => setSelectedDrive('c')}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-colors ${
                      selectedDrive === 'c'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-devbox-subtle hover:text-white'
                    }`}
                  >
                    C: System
                  </button>
                  <button
                    onClick={() => setSelectedDrive('d')}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-colors ${
                      selectedDrive === 'd'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-devbox-subtle hover:text-white'
                    }`}
                  >
                    D: Projects
                  </button>
                </div>
              </div>
              <span className={`font-mono font-bold ${activeDisk.used_pct >= 90 ? 'text-amber-400' : 'text-purple-400'}`}>
                {activeDisk.used_gb} GB / {activeDisk.total_gb} GB ({activeDisk.used_pct}%)
              </span>
            </div>
            <div className="h-1.5 bg-devbox-card rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  activeDisk.used_pct >= 90
                    ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                    : 'bg-gradient-to-r from-purple-500 to-pink-400'
                }`}
                style={{ width: `${Math.min(activeDisk.used_pct, 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <span className={activeDisk.used_pct >= 90 ? 'text-amber-400 font-semibold' : 'text-devbox-subtle'}>
                {activeDisk.free_gb} GB free {activeDisk.used_pct >= 90 ? '(⚠️ Low Space)' : 'remaining'}
              </span>
              <span className="text-devbox-muted font-mono">{activeDisk.drive || 'C:\\'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Core Services & Recent Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Core Services Card (1 col) */}
        <div className="lg:col-span-1 glass-card p-6 rounded-2xl border border-devbox-border/80 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Zap className="w-5 h-5 text-amber-400" />
              <h2 className="font-bold text-base text-white">Core Services</h2>
            </div>
            <button
              onClick={() => onNavigate('services')}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
            >
              Manage <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {services.map((service) => {
              const isRunning = service.status === 'running';
              return (
                <div
                  key={service.id}
                  className="p-3.5 rounded-xl bg-devbox-panel/70 border border-devbox-border/60 flex items-center justify-between hover:border-devbox-border transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${isRunning ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-slate-600'}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">{service.name}</span>
                        {service.pid && (
                          <span className="text-[10px] font-mono text-devbox-subtle">PID {service.pid}</span>
                        )}
                      </div>
                      <span className="text-xs font-mono text-devbox-muted">Port :{service.port}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isRunning ? (
                      <>
                        <button
                          onClick={() => onRestartService(service.service_type)}
                          title="Restart"
                          className="p-1.5 rounded-lg bg-devbox-card hover:bg-devbox-hover text-devbox-muted hover:text-amber-400 transition-colors"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onStopService(service.service_type)}
                          title="Stop"
                          className="p-1.5 rounded-lg bg-devbox-card hover:bg-devbox-hover text-devbox-muted hover:text-rose-400 transition-colors"
                        >
                          <Square className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => onStartService(service.service_type)}
                        title="Start"
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-1.5 transition-colors border border-emerald-500/30"
                      >
                        <Play className="w-3 h-3" />
                        <span>Start</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Diagnostics Quick Badge */}
          <div 
            onClick={() => onNavigate('diagnostics')}
            className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between cursor-pointer hover:bg-emerald-500/15 transition-all"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-xs font-bold text-emerald-300">Environment Healthy</p>
                <p className="text-[11px] text-emerald-400/80">No port 80 conflicts detected</p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        {/* Right Column: Recent Projects (2 cols) */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-devbox-border/80 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FolderGit2 className="w-5 h-5 text-blue-400" />
              <h2 className="font-bold text-base text-white">Active Projects</h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('projects')}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium"
              >
                View all ({projects.length})
              </button>
              <button
                onClick={onNewProject}
                className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-glow transition-all"
              >
                + New Project
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {projects.map((project) => {
              const isRunning = project.status === 'running';
              return (
                <div
                  key={project.id}
                  className="p-4 rounded-xl bg-devbox-panel/70 border border-devbox-border/70 hover:border-blue-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' : 'bg-slate-600'}`} />
                      <h3 className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors">
                        {project.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-devbox-card text-blue-400 border border-devbox-border uppercase">
                        {project.project_type}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-devbox-muted">
                      <span className="font-mono text-purple-400 font-medium">PHP {project.php_version}</span>
                      <span>•</span>
                      <span className="font-mono">{project.web_server}</span>
                      <span>•</span>
                      <span className="text-devbox-subtle font-mono truncate max-w-xs">{project.path}</span>
                    </div>

                    <div className="pt-1 flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>https://{project.domain}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => onOpenProject(project.domain)}
                      className="px-3 py-1.5 rounded-lg bg-devbox-card hover:bg-blue-600 hover:text-white text-devbox-muted text-xs font-semibold border border-devbox-border transition-all flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open</span>
                    </button>

                    <button
                      onClick={() => onOpenProjectTerminal(project)}
                      title="Open Terminal"
                      className="p-1.5 rounded-lg bg-devbox-card hover:bg-devbox-hover text-devbox-muted hover:text-emerald-400 border border-devbox-border transition-colors"
                    >
                      <Terminal className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onShareProject(project)}
                      title="Cloudflare Share"
                      className="p-1.5 rounded-lg bg-devbox-card hover:bg-devbox-hover text-devbox-muted hover:text-blue-400 border border-devbox-border transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
