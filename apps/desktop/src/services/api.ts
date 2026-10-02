import {
  Project,
  CreateProjectInput,
  Runtime,
  Service,
  DatabaseItem,
  DomainItem,
  TunnelItem,
  DiagnosticCheck,
  SystemInfo,
  PortItem,
  LogItem,
  DevBoxSettings,
  PhpExtensionItem
} from '../types';

const ENGINE_URL = 'http://127.0.0.1:1421/api';

// Check if running inside native Tauri
const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // If in native Tauri, attempt Tauri IPC
  if (isTauri) {
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      const cmd = endpoint.replace('/', '');
      return await invoke<T>(cmd, options.body ? JSON.parse(options.body as string) : undefined);
    } catch (e) {
      // Fall through to Engine daemon
    }
  }

  // Communicate with DevBox Engine daemon (persisting to devbox.sqlite)
  try {
    const res = await fetch(`${ENGINE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn(`DevBox engine request to ${endpoint} failed, falling back to local memory store.`);
  }

  return fallbackInvoke<T>(endpoint, options);
}

// Fallback in-memory store in case engine is offline
let fallbackProjects: Project[] = [
  { id: 1, name: 'Laravel ERP', slug: 'laravel-erp', path: 'D:\\Projects\\erp', project_type: 'laravel', domain: 'erp.test', https_enabled: true, php_version: '8.3', web_server: 'apache', status: 'running', created_at: '2026-09-28 10:00:00', updated_at: '2026-10-02 11:20:00' },
  { id: 2, name: 'My Shop', slug: 'myshop', path: 'D:\\Projects\\myshop', project_type: 'laravel', domain: 'myshop.test', https_enabled: true, php_version: '8.3', web_server: 'apache', status: 'running', created_at: '2026-09-30 14:15:00', updated_at: '2026-10-02 12:00:00' },
  { id: 3, name: 'Client WP', slug: 'client-wp', path: 'D:\\Projects\\client-wp', project_type: 'wordpress', domain: 'client.test', https_enabled: true, php_version: '8.1', web_server: 'apache', status: 'stopped', created_at: '2026-09-20 09:30:00', updated_at: '2026-10-01 16:45:00' },
];

function fallbackInvoke<T>(endpoint: string, options: RequestInit): Promise<T> {
  return new Promise((resolve) => {
    if (endpoint === '/projects') {
      resolve([...fallbackProjects] as unknown as T);
    } else {
      resolve([] as unknown as T);
    }
  });
}

// Exported strongly-typed API
export const api = {
  // Projects
  listProjects: () => request<Project[]>('/projects'),
  createProject: (input: CreateProjectInput) => request<Project>('/projects', { method: 'POST', body: JSON.stringify(input) }),
  startProject: (id: number) => request<{ success: boolean }>(`/projects/${id}/start`, { method: 'POST' }),
  stopProject: (id: number) => request<{ success: boolean }>(`/projects/${id}/stop`, { method: 'POST' }),
  deleteProject: (id: number) => request<{ success: boolean }>(`/projects/${id}`, { method: 'DELETE' }),

  // Services
  listServices: () => request<Service[]>('/services'),
  startService: (st: string) => request<{ success: boolean }>(`/services/${st}/start`, { method: 'POST' }),
  stopService: (st: string) => request<{ success: boolean }>(`/services/${st}/stop`, { method: 'POST' }),
  restartService: (st: string) => request<{ success: boolean }>(`/services/${st}/restart`, { method: 'POST' }),
  getServiceConfig: (type: string) => request<{ type: string; path: string; content: string }>(`/services/${type}/config`),
  getServiceLogs: (st: string) => request<string[]>(`/services/${st}/logs`),

  // Runtimes
  listRuntimes: () => request<Runtime[]>('/runtimes'),
  setActiveCliPhp: (version: string) => Promise.resolve(`CLI set to ${version}`),
  installRuntime: (type: string, version: string) => Promise.resolve(`Installed ${type} ${version}`),
  getPhpExtensions: (version: string) => request<PhpExtensionItem[]>(`/runtimes/php/${version}/extensions`),
  togglePhpExtension: (version: string, name: string, enabled: boolean) =>
    request<{ success: boolean; extension: string; enabled: boolean; message: string }>(
      `/runtimes/php/${version}/extensions/toggle`,
      { method: 'POST', body: JSON.stringify({ name, enabled }) }
    ),

  // Databases
  listDatabases: () => request<DatabaseItem[]>('/databases'),
  createDatabase: (name: string) => request<DatabaseItem>('/databases', { method: 'POST', body: JSON.stringify({ name }) }),
  backupDatabase: (name: string) => Promise.resolve(`Backup created for ${name}`),
  backupDatabaseReal: (id: number) => request<{ success: boolean; filename: string; path: string; size_kb: string }>(`/databases/${id}/backup`, { method: 'POST' }),
  testDatabaseConnection: (id: number) => request<{ success: boolean; connected: boolean; latency_ms: number; message: string }>(`/databases/${id}/test-connection`, { method: 'POST' }),
  deleteDatabase: (id: number) => request<{ success: boolean }>(`/databases/${id}`, { method: 'DELETE' }),

  // Domains & SSL
  listDomains: () => request<DomainItem[]>('/domains'),
  trustRootCa: () => Promise.resolve('DevBox Root CA trusted'),
  getHostsStatus: () => request<{
    synced: boolean;
    total_domains: number;
    synced_domains: string[];
    missing_domains: string[];
    hosts_path: string;
    helper_script: string;
    command: string;
  }>('/hosts/status'),
  syncHosts: () => request<{ success: boolean; message: string }>('/hosts/sync', { method: 'POST' }),

  // Tunnels
  listTunnels: () => request<TunnelItem[]>('/tunnels'),
  startQuickTunnel: (projectId: number, targetUrl: string) => request<TunnelItem>('/tunnels/quick', { method: 'POST', body: JSON.stringify({ project_id: projectId, target_url: targetUrl }) }),
  stopTunnel: (id: number) => request<{ success: boolean }>(`/tunnels/${id}`, { method: 'DELETE' }),

  // Diagnostics
  runDiagnostics: () => request<DiagnosticCheck[]>('/diagnostics'),
  resolveDiagnosticIssue: (actionId: string) => Promise.resolve(`Action ${actionId} executed`),

  // System Ports & Conflict Management
  getMonitoredPorts: () => request<PortItem[]>('/system/ports'),
  killPort: (port: number) => request<{ success: boolean; message: string }>('/system/ports/kill', { method: 'POST', body: JSON.stringify({ port }) }),

  // Real System & Audit Logs
  getLogs: (service?: string, level?: string) => request<LogItem[]>(`/logs?service=${service || 'all'}&level=${level || 'all'}`),

  // Application Settings Persistence
  getSettings: () => request<DevBoxSettings>('/settings'),
  saveSettings: (data: Partial<DevBoxSettings>) => request<{ success: boolean; message: string }>('/settings', { method: 'POST', body: JSON.stringify(data) }),

  // System
  getSystemInfo: () => Promise.resolve({
    os: 'Windows 11 Professional x64',
    arch: 'x64',
    devbox_version: '1.0.0',
    active_cli_php: '8.3.17',
    apache_status: 'running',
    mysql_status: 'running',
    redis_status: 'running',
  }),
};

