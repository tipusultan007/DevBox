# DevBox — Master Task List & Execution Tracker

> **Instructions**: Each task represents a verifiable engineering milestone. As each milestone is implemented and validated, its checkbox is marked checked (`[x]`).

---

## Phase 0: Workspace Architecture & Scaffolding
- [x] Initialize repository monorepo structure (`apps/desktop`, `src-tauri`, `runtime/manifests`, `scripts`, `docs`)
- [x] Setup `package.json`, Vite configuration, TypeScript configs, and Tailwind CSS
- [x] Setup Tauri 2 workspace configuration (`tauri.conf.json`, `Cargo.toml`, capabilities)
- [x] Initialize runtime directory structure and default manifest files (`php/7.4.json`, `php/8.1.json`, `php/8.2.json`, `php/8.3.json`, `php/8.4.json`, `php/8.5.json`, `apache.json`, `mysql.json`, `redis.json`)
- [x] Create core SQLite schema initialization and migration scripts (`devbox.sqlite`)

---

## Phase 1: Modern Desktop Shell & UI Component Library
- [x] Build responsive desktop application frame with custom window controls / titlebar
- [x] Implement Sidebar navigation (Dashboard, Projects, Services, PHP Versions, Databases, Domains & SSL, Cloudflare Tunnels, Diagnostics, Logs, Settings)
- [x] Build Header with global system status pills (Web Server, Database, Cache, Tunnel active indicators)
- [x] Create core UI design system (Glassmorphism cards, badges, switch toggles, modal dialogs, data tables, code viewers)
- [x] Implement Dashboard screen with real-time stats overview, service quick toggles, and recent projects list
- [x] Implement Projects screen with search, filtering, card grid, and quick actions (Open, Terminal, DB, Share)
- [x] Implement Services screen with per-service controls (Start, Stop, Restart, Port, PID, Logs view)
- [x] Implement Settings screen for root paths, default runtimes, and theme preferences

---

## Phase 2: Core Rust Process Manager & Job Objects
- [x] Implement `ProcessManager` struct in Rust with Windows Job Object integration for reliable process cleanup
- [x] Implement asynchronous child process spawning with stdout and stderr capture into log files
- [x] Implement process health monitoring, PID tracking, and exit status notifications
- [x] Expose Tauri IPC commands for service start, stop, restart, status query, and log streaming
- [x] Wire Services UI to Tauri IPC commands with optimistic UI updates and error alerts

---

## Phase 3: Runtime Manager & PHP Multi-Version Manifest System
- [x] Implement `RuntimeManager` in Rust to parse runtime manifests (`runtime/manifests/**/*.json`)
- [x] Implement safe download and checksum verification for official Windows binary zips
- [x] Implement binary extractor to unpack runtimes to `C:\DevBox\runtimes\{type}\{version}`
- [x] Implement PHP configuration generator (`php.ini` with standard development extensions enabled)
- [x] Implement global CLI switcher (updating Windows PATH shim or DevBox bin pointer)
- [x] Build PHP Manager UI with installed versions list, one-click installation, version switcher, and extension toggles

---

## Phase 4: Web Server Adapters (Apache & Nginx)
- [x] Define `WebServerAdapter` trait in Rust
- [x] Implement `ApacheAdapter`:
  - [x] VirtualHost configuration template generation with PHP FastCGI support
  - [x] SSL VirtualHost configuration template generation (`SSLEngine on`, cert/key paths)
  - [x] Configuration validation (`httpd -t`) and graceful reload command
  - [x] Per-vhost access and error log aggregation
- [x] Implement `NginxAdapter`:
  - [x] Server block configuration generation with PHP-FPM upstream sockets
  - [x] Configuration test (`nginx -t`) and reload (`nginx -s reload`)
- [x] Integrate Web Server management into Project and Services UI

---

## Phase 5: Domain Manager, Windows Hosts & Local SSL CA
- [x] Implement `DomainManager` to parse and safely update `C:\Windows\System32\drivers\etc\hosts`
- [x] Implement delimited DevBox hosts section (`# BEGIN DEVBOX MANAGED HOSTS ... # END`)
- [x] Implement Windows elevation / UAC handling for hosts file modifications
- [x] Implement `SslManager` with local Root CA generation using `rcgen`
- [x] Implement Root CA installation into Windows `Cert:\LocalMachine\Root` store
- [x] Implement automated wildcard / per-domain SAN certificate issuance for `.test` domains
- [x] Build Domains & SSL UI with certificate list, expiration dates, trust status badge, and renewal trigger

---

## Phase 6: Database Manager (MySQL, MariaDB) & Redis
- [x] Define `ServiceAdapter` trait and implement `MySQLAdapter` and `MariaDBAdapter`
- [x] Implement automated database initialization (`mysqld --initialize-insecure`)
- [x] Implement MySQL user and database provisioning commands (Create DB, Drop DB, List DBs, Calculate size)
- [x] Implement database backup (dump `.sql`) and restore pipeline
- [x] Implement `RedisAdapter` (Windows port / native binary service lifecycle)
- [x] Build Database Manager UI with table browser, create database dialog, backup/restore buttons, and direct CLI launcher

---

## Phase 7: Project Manager & Scaffolding Wizard
- [x] Implement `ProjectManager` in Rust with SQLite CRUD operations
- [x] Implement `.devbox/project.json` project configuration generator
- [x] Build 5-step New Project Wizard in React:
  - [x] Step 1: Framework selection (Laravel, WordPress, Symfony, Custom PHP)
  - [x] Step 2: Project name, local directory, and domain (`.test`)
  - [x] Step 3: PHP version and Web Server (Apache / Nginx) selection
  - [x] Step 4: Auxiliary services (MySQL, Redis, Mailpit) selection
  - [x] Step 5: HTTPS & SSL configuration
- [x] Implement automated project scaffolding pipeline:
  - [x] Composer create-project execution for Laravel
  - [x] WordPress package download and extraction
  - [x] Automatic database creation and `.env` / `wp-config.php` injection
  - [x] Automatic VHost creation, Hosts entry addition, and SSL cert generation

---

## Phase 8: Project Terminal & Environment Variable Editor
- [x] Implement embedded PTY terminal using `portable-pty`
- [x] Configure project-specific environment injection:
  - [x] Inject project's assigned PHP version path at the head of `PATH`
  - [x] Inherit Composer, Node.js, and Git paths
  - [x] Auto-chdir to project directory
- [x] Implement xterm.js or modern terminal component in the desktop UI
- [x] Implement Environment (.env) Editor with secret masking, syntax highlighting, and live validation

---

## Phase 9: Cloudflare Tunnel Integration
- [x] Implement `TunnelManager` in Rust managing `cloudflared.exe`
- [x] Implement **Mode 1: Quick Tunnel** (`cloudflared tunnel --url http://localhost:{port}`):
  - [x] Stream cloudflared logs and regex-capture generated `trycloudflare.com` URL
  - [x] Provide one-click copy and QR code for mobile testing
- [x] Implement **Mode 2: Persistent Tunnel** with local token/config file
- [x] Implement Security Guard: prohibit public exposure of ports 3306, 6379, and internal management APIs
- [x] Build Tunnels UI with active tunnels list, duration counters, share modal, and stop triggers

---

## Phase 10: Diagnostics Engine & Conflict Resolver
- [x] Implement `DiagnosticEngine` in Rust:
  - [x] Port conflict scanner (checks ports 80, 443, 3306, 6379 using Windows APIs/netstat)
  - [x] Windows IIS (`W3SVC`, `HTTP.sys`) detection
  - [x] PHP extensions verification for selected project / active CLI
  - [x] Hosts file write permissions and DNS resolution validation
  - [x] Windows Certificate Store DevBox Root CA trust check
  - [x] Available disk space and system memory checks
- [x] Implement Auto-Fix actions:
  - [x] Stop IIS service / free Port 80
  - [x] Switch web server port to 8080 fallback
  - [x] Re-trust Root CA in Windows store
- [x] Build Diagnostics screen with health score gauge, category breakdown, and "Fix Issue" buttons

---

## Phase 11: Snapshots, Environment Export/Import & Cloning
- [x] Implement Snapshot engine:
  - [x] Package project files, database dump, `.devbox` metadata, and environment into `.devbox` archive
- [x] Implement Clone Project Environment:
  - [x] Duplicate runtime profile (PHP version, web server config, database structure) to a new project
- [x] Implement Environment Export & Import for seamless portability across machines

---

## Phase 12: Production Hardening, System Tray & Final Polish
- [x] Implement Windows System Tray menu with quick service toggles and notifications
- [x] Implement Windows startup toggle (run DevBox minimized on boot)
- [x] Audit all IPC commands for path traversal protection and input validation
- [x] Verify error handling and recovery across all services
- [x] Complete end-to-end integration testing and user validation

---

## Phase 13: Exclusive Product Features (§27, §28, §30, §31, §35, §41)
- [x] **Dedicated Port Manager Screen (§27)**: Visual table of all TCP listeners (80, 443, 3306, 6379, 9083, etc.) with PID, process name, and Free Port termination
- [x] **Environment Profiles Engine (§41)**: 1-Click switching between complete runtime profiles (Modern Laravel Stack vs Client Legacy Profile vs Symfony API)
- [x] **Plugin Ecosystem (§30)**: Modular add-ons for Mailpit, Meilisearch, PostgreSQL, MongoDB, MinIO, RabbitMQ, and Ngrok
- [x] **DevBox AI Troubleshooter (§31)**: Automated error log analyzer and 1-click extension fixer for Laravel/PHP errors
- [x] **Temporary Client Preview Modal (§28E)**: Configurable duration (1h, 4h, Permanent) and Password Protection with PIN
- [x] **Webhook Mode (§28D)**: One-click tunnel generator optimized for Stripe, PayPal, Shopify, and GitHub webhooks
- [x] **Project Health Scorecard (§28C)**: 98% integrity checker evaluating PHP, Composer, Extensions, Database, SSL, Redis, and .env
- [x] **Licensing & Editions Manager (§35)**: Free, Pro, and Team edition tier activation and license key management

---

## Phase 14: Specification Conformance & Completeness (§13, §14, §16, §21, §22, §23, §29, §33, §34)
- [x] **Adminer Web Database GUI (§23)**: Integrated web database administration interface with table browser, SQL command runner, schema explorer, and SQL dump export
- [x] **Database Restore Pipeline (§23)**: One-click SQL dump archive importer (`.sql`, `.sql.gz`) with schema merging
- [x] **Service Inspector Tabs (§22)**: Configuration editor for `httpd.conf` / `my.ini` / `redis.conf` with real-time saving, Access logs stream, and Error logs stream
- [x] **Cloudflare Tunnels Full Tri-Mode (§13)**:
  - [x] Mode 1: Quick Tunnel (`trycloudflare.com`)
  - [x] Mode 2: Persistent Tunnel (`demo.example.com` custom hostname with secret token)
  - [x] Mode 3: Cloudflare Account Integration (API Token, Zone selector, Subdomain prefix, DNS CNAME proxy preview)
- [x] **Tunnel Security Boundary Guard (§14)**: Explicit security policy blocking MySQL (:3306), Redis (:6379), Adminer, and DevBox API from public internet exposure
- [x] **Complete SSL Lifecycle (§16)**: Domain cards displaying Issued date, Expiration date, Trust status, `[Renew]` action, `[Remove]` action, and X.509 SAN Certificate Inspector modal
- [x] **PHP Runtime Lifecycle (§21)**: `+ Install PHP Version` modal with manifest downloads, `[Remove]` for non-active versions, and real-time extension toggling
- [x] **Portable Environment Bundles (§29)**: `Import .devbox` modal and `Export .devbox` pipeline recreating project, PHP, Apache, MySQL, Redis, Domain, SSL, and DB schema
- [x] **Windows Administrator Model (§33)**: Unprivileged user mode status with on-demand UAC Privileged Helper verification
- [x] **Dual Update Architecture (§34)**: Independent check for desktop application updates and runtime manifest index updates

---

## Phase 15: Features.md Verification & Polish (Checklist Complete)
- [x] **Host System Resources Monitor (Features.md §2)**: Real-time CPU usage (% and cores), Memory (used/total GB and %), and Disk usage (free/total GB) with automatic polling and gradient progress bars
- [x] **Global Command Palette (Features.md §41)**: Instant `Ctrl+K` modal with fuzzy search across views, projects, core services, and quick actions
- [x] **Mobile QR Code Generator (Features.md §28 & §29)**: Dynamic QR Code matrix rendered for instant mobile phone preview of Cloudflare quick tunnels
- [x] **Windows Explorer & Git SCM Integration (Features.md §3 & §15)**: One-click "Open in Explorer" folder launcher and real-time Git branch indicators (`main`) on project cards
- [x] **MariaDB 11.4 & Database Tooling (Features.md §10 & §11)**: Engine filter tabs (All, MySQL 8.4, MariaDB 11.4), engine selector in Create Database dialog, 1-click URI copying, and live latency ping test
- [x] **Developer Toolchains & Package Managers (Features.md §13, §14, §15)**: Dedicated dashboard panels for Node.js v22.11 LTS (`npm` & `npx` v10.9), Composer v2.7.9, and Git SCM v2.45.2 with Windows DPAPI credentials
- [x] **Comprehensive Git SCM & Repository Manager (AGENTS.md & Features.md §15)**: Dedicated `ProjectGitModal` with real-time Git status, branch creation & switching, latest commit history, working tree change tracker, stage & commit form, `Git Pull`, `Git Push`, `git init -b main` initialization, remote cloning in New Project wizard, and contextual Git Terminal launcher
- [x] **End-to-End Verification**: Clean production build (`npm run build` passed with 0 errors) and automated browser subagent validation of all views and workflows
