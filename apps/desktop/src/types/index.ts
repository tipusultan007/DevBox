export type ProjectType = 'laravel' | 'wordpress' | 'symfony' | 'generic_php' | 'custom';
export type WebServerType = 'apache' | 'nginx';
export type ProjectStatus = 'running' | 'stopped' | 'error';
export type ServiceType = 'apache' | 'nginx' | 'mysql' | 'mariadb' | 'redis' | 'mailpit' | 'meilisearch' | 'postgresql' | 'mongodb' | 'minio' | 'rabbitmq';

export interface Project {
  id: number;
  name: string;
  slug: string;
  path: string;
  project_type: ProjectType;
  domain: string;
  https_enabled: boolean;
  php_version: string;
  web_server: WebServerType;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectInput {
  name: string;
  path: string;
  project_type: ProjectType;
  domain: string;
  https_enabled: boolean;
  php_version: string;
  web_server: WebServerType;
  services: string[];
}

export interface Runtime {
  id: number;
  runtime_type: string;
  name: string;
  version: string;
  architecture: string;
  install_path: string;
  is_installed: boolean;
  is_default: boolean;
}

export interface Service {
  id: number;
  name: string;
  service_type: ServiceType;
  port: number;
  status: 'running' | 'stopped' | 'restarting' | 'error';
  auto_start: boolean;
  pid?: number;
}

export interface DatabaseItem {
  id: number;
  project_id?: number;
  project_name?: string;
  engine: string;
  name: string;
  username: string;
  host: string;
  port: number;
  size_mb: number;
  created_at: string;
}

export interface DomainItem {
  id: number;
  project_id: number;
  project_name: string;
  hostname: string;
  port: number;
  ssl_port: number;
  protocol: 'http' | 'https';
  ssl_enabled: boolean;
  hosts_entry_active: boolean;
}

export interface TunnelItem {
  id: number;
  project_id: number;
  project_name: string;
  provider: 'cloudflare';
  mode: 'quick' | 'persistent';
  target_url: string;
  public_url?: string;
  status: 'active' | 'inactive' | 'error';
  pid?: number;
  created_at: string;
}

export interface DiagnosticCheck {
  id: string;
  category: string;
  title: string;
  status: 'pass' | 'warn' | 'fail';
  message: string;
  action_label?: string;
  action_id?: string;
}

export interface EnvironmentProfile {
  id: string;
  name: string;
  description: string;
  php_version: string;
  web_server: string;
  database: string;
  redis: boolean;
  node_version: string;
  ssl_enabled: boolean;
  is_active?: boolean;
}

export interface PluginItem {
  id: string;
  name: string;
  version: string;
  type: string;
  description: string;
  default_port: number;
  is_installed: boolean;
  is_running: boolean;
  icon: string;
}

export interface SystemInfo {
  os: string;
  arch: string;
  devbox_version: string;
  active_cli_php: string;
  apache_status: string;
  mysql_status: string;
  redis_status: string;
}

export type NavigationTab = 
  | 'dashboard'
  | 'projects'
  | 'services'
  | 'php'
  | 'databases'
  | 'domains'
  | 'tunnels'
  | 'ports'
  | 'profiles'
  | 'plugins'
  | 'diagnostics'
  | 'logs'
  | 'settings';

export interface PortItem {
  port: number;
  protocol: string;
  service: string;
  description: string;
  status: 'active' | 'free';
  pid: number | null;
  processName: string | null;
}

export interface LogItem {
  timestamp: string;
  service: string;
  level: 'info' | 'warn' | 'error';
  message: string;
}

export interface DevBoxSettings {
  devboxRoot: string;
  projectsDir: string;
  defaultPhp: string;
  defaultWebServer: string;
  autoStartWindows: boolean;
  autoTrustCa: boolean;
}

export interface PhpExtensionItem {
  name: string;
  enabled: boolean;
  desc: string;
}

