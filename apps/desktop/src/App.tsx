import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { ProjectsPage } from './features/projects/ProjectsPage';
import { NewProjectModal } from './features/projects/NewProjectModal';
import { ServicesPage } from './features/services/ServicesPage';
import { PhpManagerPage } from './features/runtimes/PhpManagerPage';
import { DatabasesPage } from './features/databases/DatabasesPage';
import { DomainsPage } from './features/domains/DomainsPage';
import { TunnelsPage } from './features/tunnels/TunnelsPage';
import { DiagnosticsPage } from './features/diagnostics/DiagnosticsPage';
import { LogsPage } from './features/logs/LogsPage';
import { SettingsPage } from './features/settings/SettingsPage';
import { PortManagerPage } from './features/ports/PortManagerPage';
import { EnvironmentProfilesPage } from './features/profiles/EnvironmentProfilesPage';
import { PluginsPage } from './features/plugins/PluginsPage';
import { TerminalModal } from './features/terminal/TerminalModal';
import { EnvEditorModal } from './features/environment/EnvEditorModal';
import { AiTroubleshooterModal } from './features/ai/AiTroubleshooterModal';
import { ShareProjectModal } from './features/projects/ShareProjectModal';
import { ProjectHealthModal } from './features/projects/ProjectHealthModal';
import { LicensingModal } from './features/settings/LicensingModal';
import { CommandPaletteModal } from './components/layout/CommandPaletteModal';
import { api } from './services/api';
import {
  Project,
  CreateProjectInput,
  Service,
  Runtime,
  DatabaseItem,
  DomainItem,
  TunnelItem,
  DiagnosticCheck,
  NavigationTab
} from './types';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [runtimes, setRuntimes] = useState<Runtime[]>([]);
  const [databases, setDatabases] = useState<DatabaseItem[]>([]);
  const [domains, setDomains] = useState<DomainItem[]>([]);
  const [tunnels, setTunnels] = useState<TunnelItem[]>([]);
  const [diagnostics, setDiagnostics] = useState<DiagnosticCheck[]>([]);

  // Modals state
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [terminalProject, setTerminalProject] = useState<Project | null>(null);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [envProject, setEnvProject] = useState<Project | null>(null);
  const [isEnvOpen, setIsEnvOpen] = useState(false);

  // Exclusive modals (§28, §31, §35)
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiProject, setAiProject] = useState<Project | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareProject, setShareProject] = useState<Project | null>(null);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  const [healthProject, setHealthProject] = useState<Project | null>(null);
  const [isLicensingOpen, setIsLicensingOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDiagRunning, setIsDiagRunning] = useState(false);

  // Load state
  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const [projList, servList, runList, dbList, domList, tunList, diagList] = await Promise.all([
        api.listProjects(),
        api.listServices(),
        api.listRuntimes(),
        api.listDatabases(),
        api.listDomains(),
        api.listTunnels(),
        api.runDiagnostics(),
      ]);
      setProjects(projList);
      setServices(servList);
      setRuntimes(runList);
      setDatabases(dbList);
      setDomains(domList);
      setTunnels(tunList);
      setDiagnostics(diagList);
    } catch (err) {
      console.error('Failed to load DevBox data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const activeCliPhp = runtimes.find(r => r.is_default)?.version || '8.3.17';

  // Handlers
  const handleStartService = async (type: string) => {
    await api.startService(type);
    const updated = await api.listServices();
    setServices(updated);
  };

  const handleStopService = async (type: string) => {
    await api.stopService(type);
    const updated = await api.listServices();
    setServices(updated);
  };

  const handleRestartService = async (type: string) => {
    await api.restartService(type);
    const updated = await api.listServices();
    setServices(updated);
  };

  const handleStartAll = async () => {
    for (const s of services) {
      await api.startService(s.service_type);
    }
    const updated = await api.listServices();
    setServices(updated);
  };

  const handleStopAll = async () => {
    for (const s of services) {
      await api.stopService(s.service_type);
    }
    const updated = await api.listServices();
    setServices(updated);
  };

  const handleCreateProject = async (input: CreateProjectInput) => {
    await api.createProject(input);
    await loadData();
  };

  const handleDeleteProject = async (id: number) => {
    await api.deleteProject(id);
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const handleToggleProjectStatus = async (project: Project) => {
    if (project.status === 'running') {
      await api.stopProject(project.id);
    } else {
      await api.startProject(project.id);
    }
    const updated = await api.listProjects();
    setProjects(updated);
  };

  const handleOpenDomain = (hostname: string) => {
    window.open(`https://${hostname}`, '_blank');
  };

  const handleStartQuickTunnel = async (projectId: number) => {
    await api.startQuickTunnel(projectId, 'http://localhost:80');
    const updated = await api.listTunnels();
    setTunnels(updated);
  };

  const handleStopTunnel = async (id: number) => {
    await api.stopTunnel(id);
    setTunnels(prev => prev.filter(t => t.id !== id));
  };

  const handleTakeSnapshot = async (p: Project) => {
    try {
      await fetch(`http://127.0.0.1:1421/api/projects/${p.id}/snapshot`, { method: 'POST' });
    } catch {}
  };

  const handleCloneProject = async (p: Project) => {
    try {
      await fetch(`http://127.0.0.1:1421/api/projects/${p.id}/clone`, { method: 'POST' });
      await loadData();
    } catch {}
  };

  const handleSetActiveCli = async (ver: string) => {
    await api.setActiveCliPhp(ver);
    const updated = await api.listRuntimes();
    setRuntimes(updated);
  };

  const handleInstallRuntime = async (ver: string) => {
    await api.installRuntime('php', ver);
    const updated = await api.listRuntimes();
    setRuntimes(updated);
  };

  const handleCreateDatabase = async (name: string) => {
    await api.createDatabase(name);
    const updated = await api.listDatabases();
    setDatabases(updated);
  };

  const handleBackupDatabase = async (name: string) => {
    await api.backupDatabase(name);
  };

  const handleDeleteDatabase = async (id: number) => {
    await api.deleteDatabase(id);
    setDatabases(prev => prev.filter(d => d.id !== id));
  };

  const handleTrustRootCa = async () => {
    await api.trustRootCa();
  };

  const handleRunDiagnostics = async () => {
    setIsDiagRunning(true);
    const updated = await api.runDiagnostics();
    setDiagnostics(updated);
    setIsDiagRunning(false);
  };

  const handleResolveDiagnostic = async (actionId: string) => {
    await api.resolveDiagnosticIssue(actionId);
    await handleRunDiagnostics();
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-devbox-bg text-devbox-text">
      {/* Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenTerminal={() => {
          setTerminalProject(null);
          setIsTerminalOpen(true);
        }}
        onOpenAiTroubleshooter={() => {
          setAiProject(projects[0] || null);
          setIsAiOpen(true);
        }}
        onOpenLicensing={() => setIsLicensingOpen(true)}
        activeCliPhp={activeCliPhp}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <Header
          currentTab={currentTab}
          services={services}
          activeCliPhp={activeCliPhp}
          onOpenNewProject={() => setIsNewProjectOpen(true)}
          onOpenTerminal={() => {
            setTerminalProject(null);
            setIsTerminalOpen(true);
          }}
          onOpenAi={() => {
            setAiProject(projects[0] || null);
            setIsAiOpen(true);
          }}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onRefresh={loadData}
          isRefreshing={isRefreshing}
        />

        {/* View Router */}
        <main className="flex-1 overflow-hidden relative">
          {currentTab === 'dashboard' && (
            <DashboardPage
              projects={projects}
              services={services}
              activeCliPhp={activeCliPhp}
              onNavigate={setCurrentTab}
              onStartService={handleStartService}
              onStopService={handleStopService}
              onRestartService={handleRestartService}
              onOpenProject={handleOpenDomain}
              onOpenProjectTerminal={(p) => {
                setTerminalProject(p);
                setIsTerminalOpen(true);
              }}
              onShareProject={(p) => {
                setShareProject(p);
                setIsShareModalOpen(true);
              }}
              onNewProject={() => setIsNewProjectOpen(true)}
            />
          )}

          {currentTab === 'projects' && (
            <ProjectsPage
              projects={projects}
              onOpenNewProject={() => setIsNewProjectOpen(true)}
              onOpenProject={handleOpenDomain}
              onOpenTerminal={(p) => {
                setTerminalProject(p);
                setIsTerminalOpen(true);
              }}
              onOpenEnvEditor={(p) => {
                setEnvProject(p);
                setIsEnvOpen(true);
              }}
              onOpenShareModal={(p) => {
                setShareProject(p);
                setIsShareModalOpen(true);
              }}
              onOpenHealthModal={(p) => {
                setHealthProject(p);
                setIsHealthModalOpen(true);
              }}
              onTakeSnapshot={handleTakeSnapshot}
              onCloneProject={handleCloneProject}
              onToggleStatus={handleToggleProjectStatus}
              onDeleteProject={handleDeleteProject}
            />
          )}

          {currentTab === 'profiles' && <EnvironmentProfilesPage />}

          {currentTab === 'services' && (
            <ServicesPage
              services={services}
              onStartService={handleStartService}
              onStopService={handleStopService}
              onRestartService={handleRestartService}
              onStartAll={handleStartAll}
              onStopAll={handleStopAll}
            />
          )}

          {currentTab === 'ports' && <PortManagerPage />}

          {currentTab === 'php' && (
            <PhpManagerPage
              runtimes={runtimes}
              onSetActiveCli={handleSetActiveCli}
              onInstallRuntime={handleInstallRuntime}
            />
          )}

          {currentTab === 'databases' && (
            <DatabasesPage
              databases={databases}
              onCreateDatabase={handleCreateDatabase}
              onBackupDatabase={handleBackupDatabase}
              onDeleteDatabase={handleDeleteDatabase}
              onOpenCli={() => {
                setTerminalProject(null);
                setIsTerminalOpen(true);
              }}
            />
          )}

          {currentTab === 'domains' && (
            <DomainsPage
              domains={domains}
              onTrustRootCa={handleTrustRootCa}
              onOpenDomain={handleOpenDomain}
            />
          )}

          {currentTab === 'tunnels' && (
            <TunnelsPage
              tunnels={tunnels}
              projects={projects}
              onStartQuickTunnel={handleStartQuickTunnel}
              onStopTunnel={handleStopTunnel}
            />
          )}

          {currentTab === 'plugins' && <PluginsPage />}

          {currentTab === 'diagnostics' && (
            <DiagnosticsPage
              checks={diagnostics}
              onRunDiagnostics={handleRunDiagnostics}
              onResolveIssue={handleResolveDiagnostic}
              isRunning={isDiagRunning}
            />
          )}

          {currentTab === 'logs' && <LogsPage />}

          {currentTab === 'settings' && <SettingsPage />}
        </main>
      </div>

      {/* Global Modals */}
      <NewProjectModal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
        onSubmit={handleCreateProject}
      />

      <TerminalModal
        isOpen={isTerminalOpen}
        onClose={() => {
          setIsTerminalOpen(false);
          setTerminalProject(null);
        }}
        project={terminalProject}
      />

      <EnvEditorModal
        isOpen={isEnvOpen}
        onClose={() => {
          setIsEnvOpen(false);
          setEnvProject(null);
        }}
        project={envProject}
      />

      {/* Exclusive Feature Modals */}
      <AiTroubleshooterModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        project={aiProject}
      />

      <ShareProjectModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        project={shareProject}
        onGenerateTunnel={handleStartQuickTunnel}
      />

      <ProjectHealthModal
        isOpen={isHealthModalOpen}
        onClose={() => setIsHealthModalOpen(false)}
        project={healthProject}
      />

      <LicensingModal
        isOpen={isLicensingOpen}
        onClose={() => setIsLicensingOpen(false)}
      />

      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        projects={projects}
        services={services}
        onNavigate={(tab) => {
          setCurrentTab(tab);
          setIsCommandPaletteOpen(false);
        }}
        onOpenProject={(domain) => {
          handleOpenDomain(domain);
          setIsCommandPaletteOpen(false);
        }}
        onOpenProjectTerminal={(proj) => {
          setTerminalProject(proj);
          setIsTerminalOpen(true);
          setIsCommandPaletteOpen(false);
        }}
        onStartService={async (type) => {
          await handleStartService(type);
          setIsCommandPaletteOpen(false);
        }}
        onStopService={async (type) => {
          await handleStopService(type);
          setIsCommandPaletteOpen(false);
        }}
        onNewProject={() => {
          setIsCommandPaletteOpen(false);
          setIsNewProjectOpen(true);
        }}
      />
    </div>
  );
};
