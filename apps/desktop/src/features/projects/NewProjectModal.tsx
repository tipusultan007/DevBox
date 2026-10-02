import React, { useState } from 'react';
import {
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  Folder,
  Globe,
  Database,
  ShieldCheck,
  Sparkles,
  Layers,
  Server,
  Loader2,
  GitBranch
} from 'lucide-react';
import { CreateProjectInput, ProjectType, WebServerType } from '../../types';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateProjectInput) => Promise<void>;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [step, setStep] = useState<number>(1);
  const [projectType, setProjectType] = useState<ProjectType>('laravel');
  const [name, setName] = useState<string>('myshop');
  const [path, setPath] = useState<string>('D:\\Projects\\myshop');
  const [domain, setDomain] = useState<string>('myshop.test');
  const [phpVersion, setPhpVersion] = useState<string>('8.3');
  const [webServer, setWebServer] = useState<WebServerType>('apache');
  const [services, setServices] = useState<string[]>(['mysql', 'redis']);
  const [httpsEnabled, setHttpsEnabled] = useState<boolean>(true);
  const [trustCert, setTrustCert] = useState<boolean>(true);
  const [initGit, setInitGit] = useState<boolean>(true);
  const [gitCloneUrl, setGitCloneUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [installLogs, setInstallLogs] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    const slug = val.toLowerCase().replace(/[^a-z0-9]/g, '-');
    setDomain(`${slug}.test`);
    setPath(`D:\\Projects\\${slug}`);
  };

  const toggleService = (s: string) => {
    setServices((prev) =>
      prev.includes(s) ? prev.filter((item) => item !== s) : [...prev, s]
    );
  };

  const handleCreate = async () => {
    setIsSubmitting(true);
    setInstallLogs([
      'Initializing project environment...',
      `Configuring PHP ${phpVersion} runtime profile...`,
      'Provisioning ' + webServer.toUpperCase() + ' virtual host for ' + domain + '...',
      'Generating local SSL certificate & registering with DevBox Root CA...',
      'Binding Windows hosts file entry (127.0.0.1 -> ' + domain + ')...',
      ...(initGit ? [
        gitCloneUrl ? `Cloning Git repository from ${gitCloneUrl}...` : 'Initializing local Git repository (git init -b main)...',
        'Creating initial commit: Project boilerplate & .devbox configuration...'
      ] : []),
      'Configuring SQLite metadata in .devbox/project.json...',
      'Project ready!'
    ]);

    try {
      await onSubmit({
        name,
        path,
        project_type: projectType,
        domain,
        https_enabled: httpsEnabled,
        php_version: phpVersion,
        web_server: webServer,
        services,
      });
      setTimeout(() => {
        setIsSubmitting(false);
        onClose();
        setStep(1);
      }, 1200);
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-devbox-card border border-devbox-border rounded-2xl shadow-glass flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-devbox-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Create New Project</h3>
              <p className="text-[11px] text-devbox-subtle">Step {step} of 5</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-devbox-subtle hover:text-white hover:bg-devbox-hover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-devbox-panel w-full">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Step Content */}
        <div className="p-6 min-h-[300px] flex flex-col justify-center">
          {/* STEP 1: Framework */}
          {step === 1 && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-white">Select Application Framework</h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'laravel', label: 'Laravel', desc: 'Modern PHP MVC framework with Artisan' },
                  { id: 'wordpress', label: 'WordPress', desc: 'World most popular CMS & blogging engine' },
                  { id: 'symfony', label: 'Symfony', desc: 'High-performance PHP application framework' },
                  { id: 'generic_php', label: 'Custom PHP', desc: 'Clean PHP script with custom composer' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setProjectType(item.id as ProjectType)}
                    className={`p-3.5 rounded-xl text-left border transition-all ${
                      projectType === item.id
                        ? 'bg-blue-600/15 border-blue-500 text-white shadow-glow'
                        : 'bg-devbox-panel border-devbox-border/80 text-devbox-muted hover:border-devbox-border hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm">{item.label}</span>
                      {projectType === item.id && <Check className="w-4 h-4 text-blue-400" />}
                    </div>
                    <p className="text-[11px] text-devbox-subtle mt-1">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Name & Paths */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-devbox-muted uppercase tracking-wider mb-1.5">
                  Project Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-devbox-panel border border-devbox-border text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-devbox-muted uppercase tracking-wider mb-1.5">
                  Local Directory
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={path}
                    onChange={(e) => setPath(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-devbox-panel border border-devbox-border text-sm font-mono text-devbox-text focus:outline-none focus:border-blue-500"
                  />
                  <button className="px-3 rounded-xl bg-devbox-panel hover:bg-devbox-hover border border-devbox-border text-devbox-muted hover:text-white transition-colors">
                    <Folder className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-devbox-muted uppercase tracking-wider mb-1.5">
                  Local Domain (.test)
                </label>
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-devbox-panel border border-devbox-border">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="flex-1 bg-transparent text-sm font-mono text-emerald-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Git Version Control Setup (§15) */}
              <div className="p-3.5 rounded-xl bg-devbox-panel/80 border border-devbox-border space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-orange-400" />
                    <span className="text-xs font-semibold text-white">Initialize Git Repository</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={initGit}
                    onChange={(e) => setInitGit(e.target.checked)}
                    className="w-4 h-4 accent-orange-500 rounded cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-devbox-subtle">
                  Automatically initializes <code className="text-orange-300">git init -b main</code> and commits the initial boilerplate.
                </p>
                {initGit && (
                  <div className="pt-1">
                    <input
                      type="text"
                      value={gitCloneUrl}
                      onChange={(e) => setGitCloneUrl(e.target.value)}
                      placeholder="Optional: Clone from remote URL (https://github.com/...)"
                      className="w-full px-3 py-1.5 rounded-lg bg-devbox-card border border-devbox-border text-xs text-white placeholder:text-devbox-subtle font-mono focus:outline-none focus:border-orange-500"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: PHP & Web Server */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-devbox-muted uppercase tracking-wider mb-1.5">
                  Select PHP Version
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['8.5', '8.4', '8.3', '8.2', '8.1', '7.4'].map((ver) => (
                    <button
                      key={ver}
                      onClick={() => setPhpVersion(ver)}
                      className={`p-2.5 rounded-xl text-center border font-mono text-sm transition-all ${
                        phpVersion === ver
                          ? 'bg-purple-600/20 border-purple-500 text-purple-300 font-bold'
                          : 'bg-devbox-panel border-devbox-border text-devbox-muted hover:text-white'
                      }`}
                    >
                      PHP {ver}
                      {ver === '8.3' && <span className="block text-[9px] text-emerald-400">Recommended</span>}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-devbox-muted uppercase tracking-wider mb-1.5">
                  Web Server Architecture
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'apache', label: 'Apache 2.4', desc: 'FastCGI with .htaccess rewrite rules' },
                    { id: 'nginx', label: 'Nginx 1.26', desc: 'Upstream PHP-FPM socket configuration' },
                  ].map((ws) => (
                    <button
                      key={ws.id}
                      onClick={() => setWebServer(ws.id as WebServerType)}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        webServer === ws.id
                          ? 'bg-amber-600/20 border-amber-500 text-white font-bold'
                          : 'bg-devbox-panel border-devbox-border text-devbox-muted hover:text-white'
                      }`}
                    >
                      <span className="font-bold text-sm block">{ws.label}</span>
                      <span className="text-[10px] text-devbox-subtle">{ws.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Services */}
          {step === 4 && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-white">Enable Auxiliary Services</h4>
              <div className="space-y-2.5">
                {[
                  { id: 'mysql', label: 'MySQL 8.4 Database', desc: 'Creates dedicated project database and user credentials' },
                  { id: 'redis', label: 'Redis Cache & Queues', desc: 'Enables in-memory session/cache support on port 6379' },
                  { id: 'mailpit', label: 'Mailpit Webmail', desc: 'Catches all outgoing email during development' },
                ].map((s) => {
                  const isChecked = services.includes(s.id);
                  return (
                    <div
                      key={s.id}
                      onClick={() => toggleService(s.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-blue-600/10 border-blue-500 text-white'
                          : 'bg-devbox-panel border-devbox-border text-devbox-muted'
                      }`}
                    >
                      <div>
                        <span className="text-sm font-semibold text-white block">{s.label}</span>
                        <span className="text-[11px] text-devbox-subtle">{s.desc}</span>
                      </div>
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                        isChecked ? 'bg-blue-600 border-blue-500 text-white' : 'border-devbox-border'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: SSL & Finalize */}
          {step === 5 && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-white">Security & HTTPS Configuration</h4>
              <div className="p-4 rounded-xl bg-devbox-panel border border-devbox-border space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={httpsEnabled}
                    onChange={(e) => setHttpsEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-0 bg-devbox-card border-devbox-border"
                  />
                  <div>
                    <span className="text-sm font-semibold text-white block">Enable HTTPS VirtualHost</span>
                    <span className="text-[11px] text-devbox-subtle">Generates trusted SAN SSL certificate for {domain}</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={trustCert}
                    onChange={(e) => setTrustCert(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-0 bg-devbox-card border-devbox-border"
                  />
                  <div>
                    <span className="text-sm font-semibold text-white block">Trust local certificate in Windows Store</span>
                    <span className="text-[11px] text-devbox-subtle">Prevents SSL warnings in Chrome, Edge, and curl</span>
                  </div>
                </label>
              </div>

              {/* Summary overview */}
              <div className="p-3.5 rounded-xl bg-blue-600/10 border border-blue-500/20 text-xs text-blue-300 space-y-1">
                <p className="font-semibold text-white">Ready to scaffold:</p>
                <p>• Framework: <span className="capitalize">{projectType}</span> on PHP {phpVersion}</p>
                <p>• Web Server: <span className="capitalize">{webServer}</span> hosting https://{domain}</p>
                <p>• Services: {services.join(', ') || 'None'}</p>
              </div>

              {isSubmitting && (
                <div className="p-3 rounded-xl bg-black/40 border border-devbox-border space-y-1 font-mono text-[11px] text-emerald-400">
                  {installLogs.map((log, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-devbox-subtle">&gt;</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 border-t border-devbox-border flex items-center justify-between bg-devbox-card/90">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              disabled={isSubmitting}
              className="px-3.5 py-1.5 rounded-lg border border-devbox-border hover:bg-devbox-hover text-devbox-muted hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-glow transition-all"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleCreate}
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-glow transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Provisioning Project...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Create Project</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
