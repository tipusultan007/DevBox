# DevBox ⚡

> **A Complete, Modern PHP & Web Local Development Environment for Windows**  
> *Per-project runtimes, automatic `*.test` domains, zero-config trusted SSL, isolated databases, Cloudflare public sharing, and diagnostic automation.*

---

[![Windows](https://img.shields.io/badge/Platform-Windows%2010%20%7C%2011%20x64-0078D6?logo=windows&logoColor=white)](https://github.com/tipusultan007/DevBox)
[![Tauri 2](https://img.shields.io/badge/Tauri-2.0-FFC131?logo=tauri&logoColor=black)](https://tauri.app/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PHP](https://img.shields.io/badge/PHP-7.4%20%7C%208.1%20%7C%208.2%20%7C%208.3%20%7C%208.4%20%7C%208.5-777BB4?logo=php&logoColor=white)](https://www.php.net/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🌟 Why DevBox?

Legacy Windows stacks like XAMPP, WAMP, and Laragon rely on global environment variables, single PHP versions, and fragile manual virtual host edits. 

**DevBox** rethinks local web development from the ground up:
* 🐘 **Per-Project PHP Versions**: Run a legacy PHP 7.4 WordPress client alongside a modern PHP 8.4 Laravel 11 application simultaneously without touching your global system PATH.
* 🔒 **Automatic Trusted HTTPS**: Valid X.509 local certificates generated and trusted in the Windows Certificate Store automatically for every `*.test` domain.
* 🌐 **Reverse-Proxy Virtual Host Router**: Built-in VHost engine listening on ports `80` and `443` routes directly to project hubs, documents, or custom upstream proxies.
* ☁️ **Cloudflare Tunnel Sharing**: Share your local work with clients or test on mobile devices using one-click Quick Tunnels (`https://*.trycloudflare.com`) with instant QR codes.
* 🗄️ **Integrated Database Manager**: MySQL 8.4 and MariaDB with automatic database creation, one-click `.sql` backup dumps, TCP latency testing, and embedded Adminer web studio.
* 🔌 **Windows Port Collision Manager**: Real-time inspection of listening TCP ports (IIS, Skype, MySQL collisions) with one-click process termination (`taskkill`).
* 🩺 **Automated Diagnostics**: Self-healing checks that identify missing hosts file entries, port clashes, certificate expirations, and configuration errors with 1-click fixes.

---

## 🏗️ High-Level Architecture

```text
                        ┌───────────────────────────────┐
                        │          DEVBOX GUI           │
                        │                               │
                        │   React 18 + TypeScript       │
                        │   Tailwind CSS + Lucide Icons │
                        └───────────────┬───────────────┘
                                        │
                           Tauri IPC / Local Engine REST
                                        │
                        ┌───────────────▼───────────────┐
                        │      DEVBOX ENGINE CORE       │
                        │                               │
                        │ Process Confinement Manager   │
                        │ VirtualHost Router (80/443)   │
                        │ SQLite State (devbox.sqlite)  │
                        │ Hosts Synchronizer & SSL CA   │
                        │ Hardware Resource Monitor     │
                        └───────────────┬───────────────┘
                                        │
           ┌────────────────────────────┼────────────────────────────┐
           │                            │                            │
           ▼                            ▼                            ▼
     Runtime Layer                Project Layer                Network Layer
  PHP 7.4 - PHP 8.5          Laravel / WordPress / Custom    Local DNS (*.test)
  Apache / Nginx             Physical .devbox metadata       Trusted SSL (443)
  MySQL 8.4 / Redis          Scaffolded public/index.php     Cloudflare Quick Tunnels
```

---

## 🚀 Key Features

### 1. Per-Project PHP Runtime Isolation
Never worry about switching global PHP versions again:
* Manage PHP **7.4**, **8.1**, **8.2**, **8.3**, **8.4**, and **8.5**.
* Configure and toggle PECL extensions (`curl`, `mbstring`, `openssl`, `pdo_mysql`, `zip`, `xdebug`, `opcache`) on the fly.
* Set an active global CLI PHP version while preserving independent per-project runtime assignments.

### 2. Zero-Config Local Domains (`*.test`)
* Creating a project automatically provisions its Virtual Host configuration for Apache and Nginx.
* The privileged Windows Hosts Synchronizer keeps `C:\Windows\System32\drivers\etc\hosts` in sync with your local domain registry.

### 3. One-Click Cloudflare Tunnel Sharing
* Test webhooks or demonstrate progress to clients without port forwarding, dynamic DNS, or router configuration.
* Generates live public HTTPS preview URLs and mobile-friendly QR codes in under 2 seconds.

### 4. Database Management & Instant Dumps
* View all local MySQL schemas, attached projects, and disk sizes in one place.
* Export timestamped `.sql` backups directly into `D:\DevBox\backups\` with one click.
* Run real-time TCP connection latency probes directly to `127.0.0.1:3306`.

### 5. Windows TCP Port Conflict Resolver
* Real-time monitoring of all local development ports (`80`, `443`, `1420`, `1421`, `3306`, `6379`, `8080`, `8025`).
* Displays process names (`httpd.exe`, `mysqld.exe`, `system.exe`) and PIDs.
* Safely terminate conflicting processes blocking ports with single-click precision.

---

## 📦 Project Structure

```text
DevBox/
│
├── apps/
│   └── desktop/                 # Frontend React Application & Node Engine
│       ├── src/
│       │   ├── app/             # Application root
│       │   ├── components/      # Navigation, modals, shared UI
│       │   ├── features/        # Feature modules:
│       │   │   ├── dashboard/   # Live system metrics, project cards
│       │   │   ├── projects/    # Project wizard, health, sharing
│       │   │   ├── runtimes/    # PHP version & extension management
│       │   │   ├── services/    # Apache, MySQL, Redis daemons
│       │   │   ├── databases/   # Schema management & backups
│       │   │   ├── domains/     # Local domain & SSL registry
│       │   │   ├── tunnels/     # Cloudflare sharing
│       │   │   ├── ports/       # TCP port collision manager
│       │   │   ├── logs/        # Real-time event & audit stream
│       │   │   ├── diagnostics/ # Self-healing diagnostic checks
│       │   │   └── settings/    # Config persistence (app.toml)
│       │   ├── services/        # Strongly-typed API client
│       │   └── types/           # TypeScript interfaces
│       ├── devbox-engine.cjs    # Windows background daemon & VHost router
│       └── package.json
│
├── src-tauri/                   # Tauri 2 Native Rust Core
│   ├── src/                     # Rust commands, job objects, services
│   ├── migrations/              # SQLite database schema migrations
│   ├── icons/                   # High-DPI Windows application icons
│   └── tauri.conf.json          # Desktop window & bundle configuration
│
├── runtime/
│   └── manifests/               # JSON manifests for PHP, Apache, MySQL, Redis
│
├── scripts/
│   ├── devbox-setup.iss         # Inno Setup Windows installer compiler
│   ├── DevBox.bat / DevBox.vbs  # Desktop application launchers
│   └── sync-hosts.bat / .ps1    # Privileged Windows Hosts synchronizer
│
├── data/                        # Local SQLite database & SSL certificates
├── config/                      # app.toml, vhosts, and service configurations
├── backups/                     # Generated database dumps & environment packages
└── package.json                 # Monorepo workspaces & build scripts
```

---

## 🛠️ Getting Started

### Prerequisites
* **Windows 10 or 11 (64-bit)**
* **Node.js 20+** (Node.js 22 LTS recommended)
* **Git for Windows**

### Quick Install (Pre-built Setup Wizard)
Download the latest installer from the [Releases](https://github.com/tipusultan007/DevBox/releases) page:
* Run **`DevBox_Setup_v1.0.0.exe`**
* Follow the setup wizard to choose your install location and create desktop shortcuts.
* Launch DevBox!

---

### Running from Source

1. **Clone the repository:**
   ```powershell
   git clone https://github.com/tipusultan007/DevBox.git
   cd DevBox
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Start the DevBox Engine Daemon:**
   ```powershell
   node apps/desktop/devbox-engine.cjs
   ```

4. **Start the Frontend Development Server:**
   ```powershell
   npm run dev
   ```
   Open [http://localhost:1420](http://localhost:1420) in your browser.

---

## 🔨 Building the Installer

DevBox includes a one-command automated build pipeline that compiles the React frontend, packages the SQLite database, and compiles a native Windows setup wizard:

```powershell
npm run build:installer
```

The resulting standalone setup wizard is generated in:
```text
release/DevBox_Setup_v1.0.0.exe
```

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

## 👨‍💻 Author

Crafted with care by [Tipu Sultan](https://github.com/tipusultan007).
Contributions, feature requests, and bug reports are always welcome!
