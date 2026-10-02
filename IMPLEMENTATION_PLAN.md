# DevBox — Comprehensive Implementation Plan & Engineering Blueprint

## Executive Overview
**DevBox** is a professional-grade, isolated PHP and web development environment engineered specifically for Windows. Unlike legacy monolithic stacks (such as XAMPP, WampServer, or Laragon), DevBox separates the desktop management shell from the underlying runtime binaries, isolates runtimes on a per-project basis, automates `.test` domain generation with trusted local SSL certificates, integrates Cloudflare Tunnels for one-click sharing, provides an intelligent diagnostics engine for Windows-specific pain points (like port 80/IIS conflicts), and delivers a modern, IDE-grade developer experience.

---

## 1. System Architecture

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DevBox Desktop Shell                              │
│         React 18/19 + TypeScript + Tailwind CSS + Lucide Icons + Vite       │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Strongly Typed Tauri 2 IPC
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                               Rust Core Engine                              │
│                                                                             │
│  ┌─────────────────────────┐ ┌─────────────────────────┐ ┌───────────────┐ │
│  │     ProcessManager      │ │     RuntimeManager      │ │  SQLite Meta  │ │
│  │ (Job Objects / Signals) │ │   (Manifests / Cache)   │ │  (rusqlite)   │ │
│  └────────────┬────────────┘ └────────────┬────────────┘ └───────┬───────┘ │
│               │                           │                      │         │
│  ┌────────────▼────────────┐ ┌────────────▼────────────┐        │         │
│  │    WebServerAdapter     │ │     ServiceAdapter      │        │         │
│  │    (Apache / Nginx)     │ │  (MySQL, Redis, Mailpit)│        │         │
│  └────────────┬────────────┘ └────────────┬────────────┘        │         │
│               │                           │                      │         │
│  ┌────────────▼────────────┐ ┌────────────▼────────────┐ ┌───────▼───────┐ │
│  │  Domain & Hosts Engine  │ │     SSL / CA Manager    │ │Tunnel Manager │ │
│  │   (Windows Hostfile)    │ │ (rcgen / Local Trust)   │ │(cloudflared)  │ │
│  └─────────────────────────┘ └─────────────────────────┘ └───────────────┘ │
│                                                                             │
│  ┌─────────────────────────┐ ┌─────────────────────────┐ ┌───────────────┐ │
│  │    Diagnostic Engine    │ │    Project Scaffolder   │ │Terminal PTY   │ │
│  │ (Port/IIS/PHP/Extensions│ │   (Laravel / WordPress) │ │(portable-pty) │ │
│  └─────────────────────────┘ └─────────────────────────┘ └───────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Directory & Filesystem Layout

### 2.1 DevBox Installation & Runtime Root (`C:\DevBox\` or User-Configured)
```text
C:\DevBox\
├── app\                     # DevBox desktop application binaries
├── bin\                     # Global CLI shim executables (php, composer, cloudflared)
├── data\
│   └── devbox.sqlite        # SQLite database for project & runtime metadata
├── config\
│   ├── app.toml             # Global application configuration
│   ├── runtimes.toml        # Registered runtime versions
│   ├── services.toml        # Active background services
│   └── paths.toml           # Configured root paths
├── runtimes\
│   ├── php\
│   │   ├── 7.4.33-Win32-VC15-x64\
│   │   ├── 8.1.31-Win32-vs16-x64\
│   │   ├── 8.2.27-Win32-vs16-x64\
│   │   ├── 8.3.17-Win32-vs16-x64\
│   │   ├── 8.4.4-Win32-vs17-x64\
│   │   └── 8.5.0-alpha\
│   ├── apache\
│   │   └── httpd-2.4.62-win64-VS17\
│   ├── nginx\
│   │   └── nginx-1.26.2\
│   ├── mysql\
│   │   └── mysql-8.4.4-winx64\
│   ├── mariadb\
│   │   └── mariadb-11.4.5-winx64\
│   ├── redis\
│   │   └── redis-7.2-windows\
│   ├── mailpit\
│   │   └── mailpit-windows-amd64\
│   ├── composer\
│   │   └── composer.phar
│   └── cloudflared\
│       └── cloudflared.exe
├── ssl\
│   ├── ca\
│   │   ├── rootCA.crt       # DevBox Root CA installed into Windows Certificate Store
│   │   └── rootCA.key
│   └── certs\               # Per-domain generated SSL certificates
│       ├── myshop.test.crt
│       └── myshop.test.key
├── projects\                # Default project root (or user selectable, e.g. D:\Projects)
│   └── myshop\
│       ├── .devbox\
│       │   └── project.json # Portable project configuration
│       └── ...
├── logs\
│   ├── apache\
│   ├── nginx\
│   ├── mysql\
│   ├── php\
│   └── devbox.log
├── backups\                 # Database and snapshot archives (.devbox packages)
├── cache\                   # Downloaded zip packages & runtime checksum cache
└── temp\
```

---

## 3. Data Architecture (SQLite Schema)

Database file: `C:\DevBox\data\devbox.sqlite`

### 3.1 Tables
1. **`projects`**:
   - `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
   - `name` (TEXT NOT NULL)
   - `slug` (TEXT UNIQUE NOT NULL)
   - `path` (TEXT NOT NULL)
   - `project_type` (TEXT NOT NULL) -- `laravel`, `wordpress`, `symfony`, `generic_php`, `static`
   - `domain` (TEXT NOT NULL)       -- e.g. `myshop.test`
   - `https_enabled` (INTEGER NOT NULL DEFAULT 1)
   - `php_version` (TEXT NOT NULL)  -- e.g. `8.3`
   - `web_server` (TEXT NOT NULL)   -- `apache` | `nginx`
   - `status` (TEXT NOT NULL DEFAULT 'stopped') -- `running` | `stopped` | `error`
   - `created_at` (DATETIME DEFAULT CURRENT_TIMESTAMP)
   - `updated_at` (DATETIME DEFAULT CURRENT_TIMESTAMP)

2. **`runtimes`**:
   - `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
   - `runtime_type` (TEXT NOT NULL) -- `php`, `apache`, `nginx`, `mysql`, `redis`, etc.
   - `name` (TEXT NOT NULL)
   - `version` (TEXT NOT NULL)
   - `architecture` (TEXT NOT NULL DEFAULT 'x64')
   - `install_path` (TEXT NOT NULL)
   - `is_installed` (INTEGER NOT NULL DEFAULT 0)
   - `is_default` (INTEGER NOT NULL DEFAULT 0)
   - `checksum` (TEXT)
   - `installed_at` (DATETIME)

3. **`services`**:
   - `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
   - `name` (TEXT NOT NULL)
   - `service_type` (TEXT NOT NULL)
   - `port` (INTEGER NOT NULL)
   - `status` (TEXT NOT NULL DEFAULT 'stopped')
   - `auto_start` (INTEGER NOT NULL DEFAULT 1)
   - `config_path` (TEXT)
   - `pid` (INTEGER)

4. **`project_services`**:
   - `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
   - `project_id` (INTEGER REFERENCES projects(id) ON DELETE CASCADE)
   - `service_id` (INTEGER REFERENCES services(id) ON DELETE CASCADE)
   - `enabled` (INTEGER NOT NULL DEFAULT 1)
   - `config_override` (TEXT)

5. **`domains`**:
   - `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
   - `project_id` (INTEGER REFERENCES projects(id) ON DELETE CASCADE)
   - `hostname` (TEXT UNIQUE NOT NULL)
   - `port` (INTEGER NOT NULL DEFAULT 80)
   - `ssl_port` (INTEGER NOT NULL DEFAULT 443)
   - `ssl_enabled` (INTEGER NOT NULL DEFAULT 1)
   - `hosts_entry_active` (INTEGER NOT NULL DEFAULT 0)
   - `created_at` (DATETIME DEFAULT CURRENT_TIMESTAMP)

6. **`databases`**:
   - `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
   - `project_id` (INTEGER REFERENCES projects(id) ON DELETE SET NULL)
   - `engine` (TEXT NOT NULL DEFAULT 'mysql')
   - `name` (TEXT NOT NULL)
   - `username` (TEXT NOT NULL DEFAULT 'root')
   - `host` (TEXT NOT NULL DEFAULT '127.0.0.1')
   - `port` (INTEGER NOT NULL DEFAULT 3306)
   - `size_mb` (REAL DEFAULT 0.0)
   - `created_at` (DATETIME DEFAULT CURRENT_TIMESTAMP)

7. **`tunnels`**:
   - `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
   - `project_id` (INTEGER REFERENCES projects(id) ON DELETE CASCADE)
   - `mode` (TEXT NOT NULL) -- `quick` | `persistent` | `account`
   - `public_url` (TEXT)
   - `tunnel_id` (TEXT)
   - `status` (TEXT NOT NULL DEFAULT 'inactive')
   - `pid` (INTEGER)
   - `created_at` (DATETIME DEFAULT CURRENT_TIMESTAMP)

8. **`audit_logs` & `system_logs`**:
   - `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
   - `service` (TEXT NOT NULL)
   - `level` (TEXT NOT NULL) -- `info`, `warning`, `error`
   - `message` (TEXT NOT NULL)
   - `timestamp` (DATETIME DEFAULT CURRENT_TIMESTAMP)

---

## 4. Core Rust Modules & Abstractions

### 4.1 Process Manager (`src-tauri/src/core/process/`)
- Windows Job Objects implementation to ensure child processes (Apache, PHP-FPM, MySQL, Redis, Cloudflared) are safely terminated when DevBox exits or restarts, preventing zombie/orphaned processes.
- Asynchronous stdout/stderr streaming via Tokio channels into rotating log files.
- Process status and PID monitoring with health check polling.

### 4.2 Web Server Abstraction (`src-tauri/src/services/`)
- **`WebServerAdapter` trait**:
  ```rust
  pub trait WebServerAdapter: Send + Sync {
      fn name(&self) -> &str;
      fn is_installed(&self) -> bool;
      fn start(&self) -> Result<(), DevBoxError>;
      fn stop(&self) -> Result<(), DevBoxError>;
      fn restart(&self) -> Result<(), DevBoxError>;
      fn status(&self) -> ServiceStatus;
      fn create_vhost(&self, project: &Project, domain: &str, php_version: &str, ssl: bool) -> Result<(), DevBoxError>;
      fn remove_vhost(&self, project_slug: &str) -> Result<(), DevBoxError>;
      fn reload_config(&self) -> Result<(), DevBoxError>;
      fn validate_config(&self) -> Result<ValidationResult, DevBoxError>;
      fn get_logs(&self, lines: usize) -> Result<Vec<LogEntry>, DevBoxError>;
  }
  ```
- **`ApacheAdapter`**: Generates VirtualHost configurations with `mod_proxy_fcgi` targeting the corresponding PHP version's FastCGI port, or dynamic PHP FastCGI wrapper. Includes SSL directives with generated `.crt`/`.key`.
- **`NginxAdapter`**: Generates upstream PHP-FPM sockets/ports blocks with SSL configurations.

### 4.3 Service Manager Abstraction (`src-tauri/src/services/`)
- **`ServiceAdapter` trait**:
  ```rust
  pub trait ServiceAdapter: Send + Sync {
      fn service_type(&self) -> &str;
      fn port(&self) -> u16;
      fn is_running(&self) -> bool;
      fn start(&self) -> Result<u32, DevBoxError>; // Returns PID
      fn stop(&self) -> Result<(), DevBoxError>;
      fn restart(&self) -> Result<(), DevBoxError>;
      fn get_status(&self) -> ServiceStatus;
      fn get_logs(&self) -> Result<Vec<String>, DevBoxError>;
  }
  ```
- Implementations: `ApacheAdapter`, `NginxAdapter`, `MySQLAdapter`, `MariaDBAdapter`, `RedisAdapter`, `MailpitAdapter`, `CloudflaredAdapter`.

### 4.4 Runtime Manifest Engine (`src-tauri/src/services/runtime_manager.rs`)
- Version declarations stored in JSON manifests under `runtime/manifests/{type}/{version}.json`.
- Supports downloading pre-compiled Windows zip binaries (windows.php.net, Apache Lounge, MySQL Community, tporadowski/redis, Axllent/mailpit).
- Automated SHA-256 integrity verification, safe extraction to `C:\DevBox\runtimes\{type}\{version}`, and default configuration file templating (e.g. `php.ini-development` -> `php.ini` with standard extensions enabled).

### 4.5 Domain & Windows Hosts Manager (`src-tauri/src/services/domain_manager.rs`)
- Safe manipulation of `C:\Windows\System32\drivers\etc\hosts`.
- Isolates DevBox entries between clear delimiters:
  ```text
  # BEGIN DEVBOX MANAGED HOSTS
  127.0.0.1  myshop.test
  127.0.0.1  erp.test
  # END DEVBOX MANAGED HOSTS
  ```
- Privileged elevation handling via Windows UAC when writing to the protected hosts file.

### 4.6 Local SSL & Certificate Authority (`src-tauri/src/services/ssl_manager.rs`)
- Built-in root CA generation using modern Rust cryptography (`rcgen`).
- Installation of DevBox Root CA into Windows `Cert:\LocalMachine\Root` store.
- Instant, on-demand generation of Subject Alternative Name (SAN) X.509 certificates for all `.test` domains with trusted status in Chrome, Edge, and Firefox.

### 4.7 Cloudflare Tunnel Manager (`src-tauri/src/services/tunnel_manager.rs`)
- **Mode 1: Quick Tunnel**: Launches `cloudflared tunnel --url http://localhost:{port}` and captures the dynamically assigned `https://*.trycloudflare.com` URL.
- **Mode 2: Persistent Tunnel**: Manages local tunnel tokens, configuration files (`config.yml`), and named hostname mappings.
- **Tunnel Security Filter**: Blocks exposure of sensitive ports (3306 MySQL, 6379 Redis, DevBox internal ports) to public endpoints.

### 4.8 Diagnostics Engine (`src-tauri/src/services/diagnostic_manager.rs`)
- Comprehensive diagnostics with actionable resolutions:
  - Port 80 conflict detection (checks for Windows `HTTP.sys`, IIS `W3SVC`, Skype, or other web servers via `netstat` / Windows API).
  - Port 443, 3306, 6379 availability.
  - PHP extensions verification (e.g., `curl`, `mbstring`, `openssl`, `pdo_mysql`, `zip`, `fileinfo`).
  - Hosts file writeability and DNS resolution check.
  - Root CA trust status in Windows cert store.
  - Disk space and memory checks.
- One-click resolution actions (e.g. "Stop IIS Service", "Change Default Port to 8080").

### 4.9 Embedded Terminal & Developer Tools (`src-tauri/src/commands/terminal.rs`)
- PTY integration (via `portable-pty`) spawning PowerShell/CMD sessions.
- Injects a project-specific environment:
  - Prefixes `PATH` with the project's specific PHP version (`C:\DevBox\runtimes\php\8.3`), Composer, Node.js, and Git.
  - Populates environment variables from the project's `.env`.

---

## 5. Modern Desktop UI Design System

### 5.1 Technology Stack & Aesthetics
- **Framework**: React 18/19 with TypeScript, Vite, Tailwind CSS, Lucide React icons, and Framer Motion for smooth transitions.
- **Theme**: Premium dark IDE aesthetic (deep slate/charcoal `#0F172A`, `#1E293B`, subtle glassmorphism borders `#334155`, vivid emerald/indigo/amber accents).
- **Navigation Layout**:
  - **Sidebar**: Dashboard, Projects, Services, PHP Versions, Databases, Domains & SSL, Cloudflare Tunnels, Diagnostics, Logs, Settings.
  - **Header**: Global service status badges (Apache, MySQL, Redis, Tunnel), Quick Add Project button, Active CLI PHP indicator.
  - **Sub-panels & Modals**: New Project Wizard (5-step interactive wizard), Port Conflict Resolver, Environment (.env) Editor, Database Viewer, Terminal drawer.

---

## 6. Development & Phased Delivery Strategy

To ensure rock-solid stability and zero regressions, development proceeds in clear, verifiable phases:
- **Phase 0**: Project Scaffolding, Architecture & Configuration Foundation
- **Phase 1**: Desktop Shell, Navigation, UI Component Library & Mock Engine
- **Phase 2**: Core Process Manager & Windows Job Objects Engine
- **Phase 3**: Runtime Manager & PHP Multi-Version Manifest System
- **Phase 4**: Web Server Adapters (Apache & Nginx) & Virtual Host Automation
- **Phase 5**: Domain Manager, Windows Hosts Integration & Local SSL CA
- **Phase 6**: Database Manager (MySQL/MariaDB, Backups & CLI) & Redis
- **Phase 7**: Project Manager, Scaffolding Wizard (Laravel & WordPress) & .devbox Engine
- **Phase 8**: Project Terminal (PTY & Contextual PATH Injection) & Environment Editor
- **Phase 9**: Cloudflare Tunnel Sharing (Quick & Persistent Tunnels)
- **Phase 10**: Diagnostic Engine & Auto-Fix System (Port 80/IIS conflicts, Extensions)
- **Phase 11**: Snapshots, Environment Export/Import & Project Cloning
- **Phase 12**: Polish, Packaging, Production Build & End-to-End Validation
