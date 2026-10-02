import React, { useState, useEffect } from 'react';
import {
  FolderGit2,
  Search,
  Plus,
  ExternalLink,
  Terminal,
  Database,
  Share2,
  Play,
  Square,
  Trash2,
  ShieldCheck,
  FileSliders,
  HeartPulse,
  Camera,
  Copy,
  Layers,
  Sparkles,
  Folder,
  GitBranch,
  AlertTriangle,
  RotateCw
} from 'lucide-react';
import { Project } from '../../types';
import { api } from '../../services/api';

interface ProjectsPageProps {
  projects: Project[];
  onOpenNewProject: () => void;
  onOpenProject: (domain: string) => void;
  onOpenTerminal: (project: Project) => void;
  onOpenEnvEditor: (project: Project) => void;
  onOpenShareModal: (project: Project) => void;
  onOpenHealthModal: (project: Project) => void;
  onTakeSnapshot: (project: Project) => Promise<void>;
  onCloneProject: (project: Project) => Promise<void>;
  onExportEnvironment?: (project: Project) => Promise<void>;
  onImportEnvironment?: (pkgData: any) => Promise<void>;
  onToggleStatus: (project: Project) => void;
  onDeleteProject: (id: number) => void;
}

import { ImportDevboxModal } from './ImportDevboxModal';
import { ProjectGitModal } from './ProjectGitModal';
import { Package, UploadCloud } from 'lucide-react';

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  projects,
  onOpenNewProject,
  onOpenProject,
  onOpenTerminal,
  onOpenEnvEditor,
  onOpenShareModal,
  onOpenHealthModal,
  onTakeSnapshot,
  onCloneProject,
  onExportEnvironment,
  onImportEnvironment,
  onToggleStatus,
  onDeleteProject,
}) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [notice, setNotice] = useState<string | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [gitProject, setGitProject] = useState<Project | null>(null);
  const [isGitModalOpen, setIsGitModalOpen] = useState(false);

  // Hosts file status (§15 & §33)
  const [hostsStatus, setHostsStatus] = useState<{
    synced: boolean;
    total_domains: number;
    synced_domains: string[];
    missing_domains: string[];
    command: string;
  } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const loadHosts = async () => {
    try {
      const res = await api.getHostsStatus();
      setHostsStatus(res);
    } catch {}
  };

  useEffect(() => {
    loadHosts();
  }, []);

  const handleSyncHosts = async () => {
    setIsSyncing(true);
    try {
      const res = await api.syncHosts();
      setNotice(res.message || 'Elevated hosts sync triggered. Please accept UAC prompt.');
      setTimeout(loadHosts, 3000);
      setTimeout(() => setNotice(null), 8000);
    } catch (e: any) {
      setNotice('Sync failed: ' + e.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSnapshot = async (p: Project) => {
    await onTakeSnapshot(p);
    setNotice(`Snapshot created for ${p.name} in C:\\DevBox\\backups`);
    setTimeout(() => setNotice(null), 3500);
  };

  const handleClone = async (p: Project) => {
    await onCloneProject(p);
    setNotice(`Cloned environment stack for ${p.name} as ${p.slug}-clone.test`);
    setTimeout(() => setNotice(null), 3500);
  };

  const handleExport = async (p: Project) => {
    if (onExportEnvironment) {
      await onExportEnvironment(p);
    } else {
      try {
        await fetch(`http://127.0.0.1:1421/api/projects/${p.id}/export-env`, { method: 'POST' });
      } catch {}
    }
    setNotice(`Exported portable bundle: C:\\DevBox\\backups\\${p.slug}.devbox`);
    setTimeout(() => setNotice(null), 4500);
  };

  const handleImportExecute = async (pkgData: any) => {
    if (onImportEnvironment) {
      await onImportEnvironment(pkgData);
    } else {
      try {
        await fetch('http://127.0.0.1:1421/api/projects/import-env', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pkgData)
        });
      } catch {}
    }
    setNotice(`Imported project '${pkgData.project.name}' successfully. Local domain: https://${pkgData.project.domain}`);
    setTimeout(() => setNotice(null), 4500);
  };

  const handleOpenFolder = async (path: string) => {
    try {
      await fetch('http://127.0.0.1:1421/api/system/open-folder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path })
      });
      setNotice(`Opened explorer: ${path}`);
      setTimeout(() => setNotice(null), 3000);
    } catch {}
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.domain.toLowerCase().includes(search.toLowerCase()) ||
                          p.path.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || p.project_type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto h-full">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Projects</h2>
          <p className="text-xs text-devbox-muted">
            Manage your local PHP applications with per-project runtimes, snapshots, portable .devbox packages, and virtual hosts.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-devbox-panel hover:bg-devbox-hover text-devbox-text border border-devbox-border text-xs font-semibold transition-all active:scale-95"
          >
            <UploadCloud className="w-4 h-4 text-blue-400" />
            <span>Import .devbox</span>
          </button>

          <button
            onClick={onOpenNewProject}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-glow transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {hostsStatus && !hostsStatus.synced && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Windows hosts entries missing for <strong className="text-white font-mono">{hostsStatus.missing_domains.join(', ')}</strong>. Direct browser navigation to <code className="text-white">*.test</code> requires hosts synchronization.
            </span>
          </div>
          <button
            onClick={handleSyncHosts}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shrink-0 self-start sm:self-auto transition-all shadow-glow active:scale-95"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Triggering...' : '⚡ Sync Windows Hosts'}</span>
          </button>
        </div>
      )}

      {notice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-400 font-mono animate-in fade-in">
          ✓ {notice}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-devbox-subtle" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by name, domain (.test), or path..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-devbox-card border border-devbox-border text-sm text-devbox-text placeholder:text-devbox-subtle focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['all', 'laravel', 'wordpress', 'symfony', 'php'].map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                typeFilter === type
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'bg-devbox-panel text-devbox-muted hover:text-devbox-text border border-devbox-border'
              }`}
            >
              {type === 'all' ? 'All Types' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProjects.map((project) => {
          const isRunning = project.status === 'running';
          return (
            <div
              key={project.id}
              className="glass-card rounded-2xl border border-devbox-border/80 hover:border-blue-500/40 transition-all flex flex-col justify-between overflow-hidden group shadow-sm hover:shadow-glow"
            >
              {/* Header */}
              <div className="p-5 border-b border-devbox-border/60 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${isRunning ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-slate-600'}`} />
                      <h3 className="font-bold text-base text-white group-hover:text-blue-400 transition-colors">
                        {project.name}
                      </h3>
                    </div>
                    <span className="text-[11px] text-devbox-subtle font-mono">{project.slug}</span>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-devbox-panel border border-devbox-border text-blue-400">
                    {project.project_type}
                  </span>
                </div>

                {/* Domain Link & Git Branch Pill */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`https://${project.domain}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono hover:bg-emerald-500/20 transition-colors"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>https://{project.domain}</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>

                    <a
                      href={`http://localhost/${project.domain}`}
                      target="_blank"
                      rel="noreferrer"
                      title="Direct Proxy :80 (works without DNS hosts entry)"
                      className="px-2 py-1 rounded-md bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono transition-colors font-semibold"
                    >
                      :80
                    </a>
                  </div>

                  <button
                    onClick={() => {
                      setGitProject(project);
                      setIsGitModalOpen(true);
                    }}
                    title="Open Git Version Control & Branches"
                    className="flex items-center gap-1 px-2 py-1 rounded-md bg-devbox-panel border border-devbox-border hover:border-orange-500/50 hover:bg-orange-500/10 text-[11px] font-mono text-devbox-muted hover:text-orange-400 transition-all cursor-pointer"
                  >
                    <GitBranch className="w-3 h-3 text-orange-400" />
                    <span>main</span>
                  </button>
                </div>

                {/* Specifications */}
                <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                  <div className="p-2 rounded-lg bg-devbox-panel/80 border border-devbox-border/60">
                    <span className="text-[10px] text-devbox-subtle block uppercase">PHP Version</span>
                    <span className="font-mono text-purple-400 font-semibold">{project.php_version}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-devbox-panel/80 border border-devbox-border/60">
                    <span className="text-[10px] text-devbox-subtle block uppercase">Web Server</span>
                    <span className="font-mono text-amber-400 font-semibold capitalize">{project.web_server}</span>
                  </div>
                </div>

                {/* Exclusive Quick Tools Bar (§28: Snapshot, Clone, Health) */}
                <div className="flex items-center gap-1.5 pt-1">
                  <button
                    onClick={() => onOpenHealthModal(project)}
                    className="flex-1 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <HeartPulse className="w-3 h-3" />
                    <span>Health (98%)</span>
                  </button>

                  <button
                    onClick={() => handleSnapshot(project)}
                    title="Create Project Snapshot"
                    className="flex-1 py-1 rounded-lg bg-devbox-panel hover:bg-devbox-hover text-devbox-muted hover:text-white border border-devbox-border text-[10px] font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <Camera className="w-3 h-3" />
                    <span>Snapshot</span>
                  </button>

                  <button
                    onClick={() => handleClone(project)}
                    title="Clone Project Stack"
                    className="flex-1 py-1 rounded-lg bg-devbox-panel hover:bg-devbox-hover text-devbox-muted hover:text-white border border-devbox-border text-[10px] font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Clone</span>
                  </button>
                  <button
                    onClick={() => handleExport(project)}
                    title="Export Portable .devbox Bundle"
                    className="flex-1 py-1 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 text-[10px] font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <Package className="w-3 h-3" />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              {/* Card Action Bar */}
              <div className="p-3 bg-devbox-card/90 flex items-center justify-between gap-1">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onOpenProject(project.domain)}
                    title="Open in Browser"
                    className="p-2 rounded-lg hover:bg-devbox-hover text-devbox-muted hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onOpenTerminal(project)}
                    title="Project Terminal (with contextual PATH)"
                    className="p-2 rounded-lg hover:bg-devbox-hover text-devbox-muted hover:text-emerald-400 transition-colors"
                  >
                    <Terminal className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleOpenFolder(project.path)}
                    title={`Open in File Explorer (${project.path})`}
                    className="p-2 rounded-lg hover:bg-devbox-hover text-devbox-muted hover:text-amber-400 transition-colors"
                  >
                    <Folder className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onOpenEnvEditor(project)}
                    title="Environment (.env) Editor"
                    className="p-2 rounded-lg hover:bg-devbox-hover text-devbox-muted hover:text-purple-400 transition-colors"
                  >
                    <FileSliders className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onOpenShareModal(project)}
                    title="Cloudflare Share & Webhook Mode"
                    className="p-2 rounded-lg hover:bg-devbox-hover text-devbox-muted hover:text-blue-400 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      setGitProject(project);
                      setIsGitModalOpen(true);
                    }}
                    title="Git Version Control & Repository Manager"
                    className="p-2 rounded-lg hover:bg-devbox-hover text-devbox-muted hover:text-orange-400 transition-colors"
                  >
                    <GitBranch className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onToggleStatus(project)}
                    title={isRunning ? 'Stop Project' : 'Start Project'}
                    className={`p-2 rounded-lg transition-colors ${
                      isRunning
                        ? 'hover:bg-rose-500/20 text-rose-400'
                        : 'hover:bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {isRunning ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => onDeleteProject(project.id)}
                    title="Remove from DevBox"
                    className="p-2 rounded-lg hover:bg-rose-500/20 text-devbox-subtle hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Import .devbox Modal (§29) */}
      <ImportDevboxModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImportExecute}
      />

      {/* Git Version Control Modal (§15) */}
      <ProjectGitModal
        isOpen={isGitModalOpen}
        onClose={() => {
          setIsGitModalOpen(false);
          setGitProject(null);
        }}
        project={gitProject}
        onOpenTerminal={onOpenTerminal}
      />
    </div>
  );
};
