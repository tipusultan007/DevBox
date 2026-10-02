import React, { useState } from 'react';
import {
  Layers,
  CheckCircle2,
  ArrowRightLeft,
  Sparkles,
  Server,
  Database,
  Shield,
  Zap,
  Boxes,
  Plus
} from 'lucide-react';
import { EnvironmentProfile } from '../../types';

export const EnvironmentProfilesPage: React.FC = () => {
  const [profiles, setProfiles] = useState<EnvironmentProfile[]>([
    {
      id: 'modern_laravel',
      name: 'Modern Laravel Stack',
      description: 'Bleeding-edge PHP 8.4 stack with Apache/Nginx, MySQL 8.4, and Redis cache enabled.',
      php_version: '8.4.4',
      web_server: 'Apache 2.4',
      database: 'MySQL 8.4 LTS',
      redis: true,
      node_version: 'Node.js 22 LTS',
      ssl_enabled: true,
      is_active: true,
    },
    {
      id: 'client_legacy',
      name: 'Client Legacy Profile',
      description: 'Compatible legacy runtime profile designed for older WordPress and custom PHP 7.4 codebases.',
      php_version: '7.4.33',
      web_server: 'Apache 2.4 (FastCGI)',
      database: 'MySQL 5.7 / MariaDB 10',
      redis: false,
      node_version: 'Node.js 18',
      ssl_enabled: true,
      is_active: false,
    },
    {
      id: 'symfony_microservices',
      name: 'Symfony & API Profile',
      description: 'High-throughput microservices environment with PHP 8.3 OPcache and Mailpit email testing.',
      php_version: '8.3.17',
      web_server: 'Nginx 1.26',
      database: 'MySQL 8.4',
      redis: true,
      node_version: 'Node.js 20',
      ssl_enabled: true,
      is_active: false,
    },
    {
      id: 'future_preview',
      name: 'PHP 8.5 Nightly Preview',
      description: 'Testing environment with upcoming PHP 8.5 JIT engine and experimental extensions.',
      php_version: '8.5.0-dev',
      web_server: 'Apache 2.4',
      database: 'MySQL 8.4',
      redis: true,
      node_version: 'Node.js 24',
      ssl_enabled: true,
      is_active: false,
    },
  ]);

  const [isSwitching, setIsSwitching] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const handleSwitch = (id: string) => {
    setIsSwitching(id);
    setTimeout(() => {
      setProfiles(prev => prev.map(p => ({ ...p, is_active: p.id === id })));
      setIsSwitching(null);
      const target = profiles.find(p => p.id === id);
      setNotification(`Switched active global environment to: ${target?.name}`);
      setTimeout(() => setNotification(null), 4000);
    }, 700);
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-white tracking-tight">Environment Profiles</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              EXCLUSIVE FEATURE
            </span>
          </div>
          <p className="text-xs text-devbox-muted mt-0.5">
            Switch entire runtime configurations (PHP, Web Server, Database, Cache, and Node) in a single click.
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-glow transition-all active:scale-95 self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          <span>New Profile</span>
        </button>
      </div>

      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-400 font-mono animate-in fade-in">
          ✓ {notification}
        </div>
      )}

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profiles.map((profile) => {
          const isActive = profile.is_active;
          return (
            <div
              key={profile.id}
              className={`p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-5 ${
                isActive
                  ? 'bg-purple-600/10 border-purple-500 shadow-glow'
                  : 'glass-card border-devbox-border/80 hover:border-devbox-border'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-bold text-base text-white">{profile.name}</h3>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                          Active Profile
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-devbox-muted">{profile.description}</p>
                  </div>

                  <div className={`p-2.5 rounded-xl ${isActive ? 'bg-purple-500/20 text-purple-400' : 'bg-devbox-panel text-devbox-subtle'}`}>
                    <Layers className="w-5 h-5" />
                  </div>
                </div>

                {/* Configuration Specs Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-devbox-panel/80 border border-devbox-border/60">
                    <span className="text-[10px] text-devbox-subtle block uppercase">PHP Runtime</span>
                    <span className="font-mono text-purple-400 font-bold">{profile.php_version}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-devbox-panel/80 border border-devbox-border/60">
                    <span className="text-[10px] text-devbox-subtle block uppercase">Web Server</span>
                    <span className="font-mono text-amber-400 font-bold">{profile.web_server}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-devbox-panel/80 border border-devbox-border/60">
                    <span className="text-[10px] text-devbox-subtle block uppercase">Database</span>
                    <span className="font-mono text-blue-400 font-bold">{profile.database}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-devbox-panel/80 border border-devbox-border/60">
                    <span className="text-[10px] text-devbox-subtle block uppercase">Redis Cache</span>
                    <span className="font-mono text-emerald-400 font-bold">{profile.redis ? 'Enabled' : 'Disabled'}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-devbox-panel/80 border border-devbox-border/60">
                    <span className="text-[10px] text-devbox-subtle block uppercase">Node CLI</span>
                    <span className="font-mono text-devbox-text font-bold">{profile.node_version}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-devbox-panel/80 border border-devbox-border/60">
                    <span className="text-[10px] text-devbox-subtle block uppercase">Trusted SSL</span>
                    <span className="font-mono text-emerald-400 font-bold">Enabled</span>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-2 border-t border-devbox-border/60 flex items-center justify-between">
                <span className="text-[11px] text-devbox-subtle">
                  {isActive ? 'Current environment configuration' : 'Reconfigures Apache, FastCGI, and PATH'}
                </span>

                {isActive ? (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold font-mono">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Active Now</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleSwitch(profile.id)}
                    disabled={isSwitching === profile.id}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-glow transition-all active:scale-95 disabled:opacity-50"
                  >
                    <ArrowRightLeft className={`w-3.5 h-3.5 ${isSwitching === profile.id ? 'animate-spin' : ''}`} />
                    <span>{isSwitching === profile.id ? 'Switching Stack...' : 'Switch Environment'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
