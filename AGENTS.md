**DevBox — a complete PHP/Windows local development environment with per-project runtimes, automatic domains/SSL, databases, Cloudflare sharing, diagnostics, and developer automation.**

---

# 1. Product architecture

![Image](https://images.openai.com/static-rsc-4/QmEQSKhenkyhn91Vay5SP31ucY49hI21kUVa0M_XgIwwBkgjxdJLy1Gz-L7iMVbi8lufSWqOS_A2Szgn94b0TECThGEEjcVqJUSCDWVWe1rhpnG_7njYVKppD3_cCIteRfmf0NscV9qmiiq3vsUnlwMweLSm-0dwVjvR-B-uyhgioTxvD0KR4A6Qc-F5xbY-?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/9l81eePozRSvELODCCTp--X-ZV6J_k7gipfTBxmsoTaiz4OgElStdTxFlhB-MWpMAVZtwIkvqC7PI3UJTlu4nAht8WYRxwb_wnwoLJ7WpEoaCClSjctP83AzJLPMQnbHguYt3W8PIKNfcxvTMLtkiQqWwvlbsKki8M1tYAV09L-I3P0X68lLtSbcau6WXeaM?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/Bs78ZlSZNnXVReRM09K4R7QRbIMVNp4dhlRAJm0WZKLb8xtd7eeFxkPxRQWgWF-FiBmOP86gjWFSknSpjmXudaI9KIcaL_ZXjkcF94CTSFbEtKv44rxLN6VSyH8WIcLE-P0UQXlqjUDsgLXfmA4M6Sqhu1m-CGmI8_dqCt43i3GBfFNCSCM0h8weqUzgRQSK?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/Y09DUFVzHTsFjTpPQ_MLYaTn2_ZCD9NAfPD1D7p8tWAVtQi8JsnwgGN-ohxyJvRRcDTeL3d1foJk9cnZjU7lQ0y-QJXnpx6vsXfVQ8FlbcxtvDKJXCGyQjry4SBr-WnbQHoA-1b3taRBPGnox6PQVgAJ9SkVNfmagWxgz_c01l3Hx1Cgz1s5D13k0lIMy39-?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/eNctrrj4urNMQ0LfTxlLfpb6hIfEfgZRyQHLKQuZ6dU8HBpM-BoRs-o515ytBKBViSpgHXo3ZbyZcLaTfpinZj9SpFrUtzG6kO-ONw9VoWQdMGbvFb34IhPwRcxjjJVljr-v5usXGxzc8H8djNuqoQAAMe7JqsODapVVArpgNUEqn_7GlXq5R7ppLt-dJVBk?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/NDzt52Ep0jGX7h5d6jcpOB1QdKztWE60e5C28f3wsQ29Zq2RNMG7SwsJ4crB-lU5zdFhQskDgPcVJqN5nV9okh4UgWjjYMY-kcHUXvGHONdzzUwqFJZQqv1kL0FkwKXmz8ymy0SoEP43Szv-_Yd-Nmxg7xh25Drk16-PMge3nn55mbB2WWVU4sRy3THss7Ti?purpose=fullsize)

I'd use:

* **Tauri 2**
* React
* TypeScript
* Tailwind CSS
* Rust
* SQLite
* Apache
* Nginx
* PHP
* MySQL/MariaDB
* Redis
* Node.js
* Composer
* Git
* Cloudflare `cloudflared`

Tauri is particularly appropriate because it gives you a native desktop shell while keeping the frontend web-based; its security model also lets you explicitly control which native operations the frontend can invoke. Its updater supports checking, downloading and installing application updates through configured permissions. ([Tauri][1])

---

# 2. High-level architecture

```text
                         ┌───────────────────────────┐
                         │        DEVBOX APP         │
                         │                           │
                         │   React + TypeScript      │
                         │   Tailwind CSS             │
                         └─────────────┬─────────────┘
                                       │
                              Tauri Commands/API
                                       │
                         ┌─────────────▼─────────────┐
                         │       Rust Core            │
                         │                           │
                         │ Process Manager            │
                         │ Runtime Manager            │
                         │ Project Manager            │
                         │ Web Server Manager         │
                         │ Database Manager           │
                         │ Domain Manager             │
                         │ SSL Manager                │
                         │ Tunnel Manager             │
                         │ Environment Manager        │
                         │ Diagnostic Engine           │
                         └─────────────┬─────────────┘
                                       │
              ┌────────────────────────┼────────────────────────┐
              │                        │                        │
              ▼                        ▼                        ▼
        Runtime Layer             Project Layer           Network Layer
              │                        │                        │
       ┌──────┼──────┐          ┌──────┼──────┐          ┌──────┼──────┐
       │      │      │          │      │      │          │      │      │
      PHP   Apache  MySQL     Laravel WordPress PHP     SSL  Hosts Cloudflare
       │      │      │
     Redis  Nginx  MariaDB
```

The most important principle:

> **The UI should never directly manage Apache/PHP/MySQL/filesystem.**

Everything goes through Rust services.

That gives you one controlled API and makes the application much easier to maintain.

---

# 3. Recommended project structure

```text
devbox/
│
├── apps/
│   │
│   ├── desktop/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── layouts/
│   │   │   ├── pages/
│   │   │   ├── features/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── projects/
│   │   │   │   ├── runtimes/
│   │   │   │   ├── databases/
│   │   │   │   ├── services/
│   │   │   │   ├── tunnels/
│   │   │   │   ├── domains/
│   │   │   │   ├── ssl/
│   │   │   │   ├── logs/
│   │   │   │   ├── diagnostics/
│   │   │   │   └── settings/
│   │   │   │
│   │   │   ├── hooks/
│   │   │   ├── stores/
│   │   │   ├── services/
│   │   │   ├── types/
│   │   │   ├── utils/
│   │   │   └── main.tsx
│   │   │
│   │   ├── public/
│   │   └── package.json
│   │
│   └── docs/
│
├── src-tauri/
│   │
│   ├── src/
│   │   ├── main.rs
│   │   ├── lib.rs
│   │   │
│   │   ├── commands/
│   │   │   ├── project.rs
│   │   │   ├── runtime.rs
│   │   │   ├── service.rs
│   │   │   ├── database.rs
│   │   │   ├── domain.rs
│   │   │   ├── ssl.rs
│   │   │   ├── tunnel.rs
│   │   │   ├── terminal.rs
│   │   │   ├── diagnostic.rs
│   │   │   └── system.rs
│   │   │
│   │   ├── core/
│   │   │   ├── process/
│   │   │   ├── filesystem/
│   │   │   ├── networking/
│   │   │   ├── windows/
│   │   │   └── security/
│   │   │
│   │   ├── services/
│   │   │   ├── project_manager.rs
│   │   │   ├── runtime_manager.rs
│   │   │   ├── apache_manager.rs
│   │   │   ├── nginx_manager.rs
│   │   │   ├── php_manager.rs
│   │   │   ├── mysql_manager.rs
│   │   │   ├── mariadb_manager.rs
│   │   │   ├── redis_manager.rs
│   │   │   ├── node_manager.rs
│   │   │   ├── composer_manager.rs
│   │   │   ├── git_manager.rs
│   │   │   ├── domain_manager.rs
│   │   │   ├── ssl_manager.rs
│   │   │   ├── tunnel_manager.rs
│   │   │   ├── environment_manager.rs
│   │   │   └── diagnostic_manager.rs
│   │   │
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── config/
│   │   ├── database/
│   │   ├── events/
│   │   └── errors/
│   │
│   ├── migrations/
│   ├── capabilities/
│   ├── icons/
│   ├── tauri.conf.json
│   └── Cargo.toml
│
├── runtime/
│   ├── manifests/
│   ├── downloads/
│   ├── cache/
│   └── checksums/
│
├── scripts/
│   ├── build-runtime-index/
│   ├── generate-manifests/
│   └── release/
│
├── tests/
│   ├── frontend/
│   ├── rust/
│   ├── integration/
│   └── fixtures/
│
├── docs/
│   ├── architecture/
│   ├── api/
│   ├── development/
│   └── runtime/
│
├── AGENTS.md
├── README.md
└── LICENSE
```

---

# 4. Separate "App" from "Runtime"

This is extremely important.

Don't make this:

```text
DevBox.exe
 ├── PHP
 ├── Apache
 ├── MySQL
 └── Redis
```

Instead:

```text
DevBox
│
├── Application
│
└── Runtime Manager
       │
       ├── PHP 7.4
       ├── PHP 8.1
       ├── PHP 8.2
       ├── PHP 8.3
       ├── PHP 8.4
       ├── PHP 8.5
       ├── Apache
       ├── Nginx
       ├── MySQL
       ├── MariaDB
       ├── Redis
       ├── Node
       ├── Composer
       ├── Git
       └── cloudflared
```

That allows runtime updates independently of the main application.

---

# 5. Windows filesystem structure

I would use:

```text
C:\DevBox\
```

with:

```text
C:\DevBox\
│
├── app\
│
├── bin\
│
├── runtimes\
│   ├── php\
│   │   ├── 7.4\
│   │   ├── 8.1\
│   │   ├── 8.2\
│   │   ├── 8.3\
│   │   ├── 8.4\
│   │   └── 8.5\
│   │
│   ├── apache\
│   ├── nginx\
│   ├── mysql\
│   ├── mariadb\
│   ├── redis\
│   ├── node\
│   ├── composer\
│   ├── git\
│   └── cloudflared\
│
├── projects\
│   ├── project-a\
│   ├── project-b\
│   └── project-c\
│
├── databases\
│
├── config\
│
├── logs\
│
├── backups\
│
├── cache\
│
└── temp\
```

User-selectable project directory could also be:

```text
D:\Projects
```

or

```text
E:\WebProjects
```

Don't force projects onto C:.

---

# 6. SQLite database

Use SQLite for **DevBox's own metadata**.

Do NOT use MySQL for application configuration.

Database:

```text
C:\DevBox\data\devbox.sqlite
```

## Main tables

### projects

```text
projects
-------------------------
id
name
slug
path
type
domain
https_enabled
php_version
web_server
status
created_at
updated_at
```

Example:

```text
1
Laravel ERP
laravel-erp
D:\Projects\erp
laravel
erp.test
true
8.3
apache
running
```

---

### runtimes

```text
runtimes
-------------------------
id
type
name
version
architecture
path
status
source
checksum
installed_at
```

Example:

```text
PHP
8.3.27
x64
C:\DevBox\runtimes\php\8.3
```

---

### services

```text
services
-------------------------
id
name
type
version
path
port
status
auto_start
config_path
```

---

### project_services

```text
project_services
-------------------------
id
project_id
service_id
enabled
config
```

This allows:

```text
Laravel ERP
 ├── PHP 8.3
 ├── MySQL
 └── Redis

WordPress Site
 ├── PHP 8.2
 └── MySQL
```

---

### domains

```text
domains
-------------------------
id
project_id
hostname
port
protocol
ssl_enabled
hosts_entry
created_at
```

---

### databases

```text
databases
-------------------------
id
project_id
engine
name
username
host
port
created_at
```

Don't store plaintext database passwords unless genuinely required. If stored, use Windows credential protection/DPAPI rather than simply putting them into SQLite.

---

### tunnels

```text
tunnels
-------------------------
id
project_id
provider
type
name
hostname
target
status
credential_ref
config_path
created_at
```

---

### environment_variables

```text
environment_variables
-------------------------
id
project_id
key
value
is_secret
```

For secrets, ideally reference Windows-protected storage rather than storing raw values.

---

### logs

```text
logs
-------------------------
id
service
level
message
timestamp
```

Don't make this your high-volume application log forever; rotate files and retain only important indexed events in SQLite.

---

# 7. Configuration structure

Use TOML or JSON for global configuration.

I'd use TOML/YAML for human-editable config and SQLite for state.

Example:

```text
C:\DevBox\config\
    app.toml
    runtimes.toml
    services.toml
    paths.toml
```

### app.toml

```toml
[app]
name = "DevBox"
version = "0.1.0"

[paths]
projects = "D:\\Projects"
runtime = "C:\\DevBox\\runtimes"
logs = "C:\\DevBox\\logs"
backups = "C:\\DevBox\\backups"

[defaults]
php = "8.3"
web_server = "apache"
database = "mysql"
```

---

# 8. Runtime manifest system

This is one of the most important pieces.

Don't hard-code PHP versions into Rust.

Create manifests:

```text
runtime/manifests/php/
    7.4.json
    8.1.json
    8.2.json
    8.3.json
    8.4.json
    8.5.json
```

Example:

```json
{
  "name": "php",
  "version": "8.3.27",
  "platform": "windows",
  "architecture": "x64",
  "download": {
    "url": "...",
    "sha256": "..."
  },
  "binary": "php.exe",
  "extensions": [
    "curl",
    "fileinfo",
    "mbstring",
    "openssl",
    "pdo_mysql",
    "zip"
  ]
}
```

This lets you add:

```text
PHP 8.6
```

later without rewriting the application.

---

# 9. PHP version switching

There should be **two concepts**.

### Global CLI PHP

```text
Active CLI PHP:

PHP 8.3.27

[Switch]
```

### Project PHP

```text
myshop.test

PHP:
[ 8.3 ▼ ]
```

So:

```text
Project A → PHP 7.4
Project B → PHP 8.2
Project C → PHP 8.3
```

The web server configuration points each virtual host to the appropriate PHP runtime.

For Apache, this can be implemented through the appropriate PHP integration; for Nginx, typically via PHP-FPM.

---

# 10. Project architecture

Every project gets a DevBox metadata directory:

```text
myshop/
│
├── .devbox/
│   └── project.json
│
├── app/
├── public/
├── vendor/
└── ...
```

Example:

```json
{
  "name": "My Shop",
  "type": "laravel",
  "php": "8.3",
  "web_server": "apache",
  "domain": "myshop.test",
  "ssl": true,
  "database": {
    "enabled": true,
    "name": "myshop"
  },
  "redis": true
}
```

This means the project becomes portable between DevBox installations.

---

# 11. Web server abstraction

Don't build your project system around Apache only.

Create:

```text
WebServerAdapter
```

with:

```text
ApacheAdapter
NginxAdapter
```

Interface:

```text
create_vhost()
remove_vhost()
enable_project()
disable_project()
reload()
get_status()
get_logs()
```

Then later you can add:

```text
CaddyAdapter
```

without rebuilding your project architecture.

---

# 12. Service manager

Every service should implement a common interface:

```text
ServiceAdapter

install()
uninstall()
start()
stop()
restart()
status()
logs()
validate_config()
```

Then:

```text
ApacheAdapter
MySQLAdapter
MariaDBAdapter
RedisAdapter
NginxAdapter
MailpitAdapter
CloudflaredAdapter
```

This is much cleaner than having random process-management code everywhere.

---

# 13. Cloudflare Tunnel architecture

Cloudflare Tunnel is particularly suitable for your "Share Local Site" feature because it uses outbound connections rather than requiring an inbound public port. Cloudflare documents Quick Tunnels for temporary development URLs and locally managed tunnels for local-development/testing workflows. ([Cloudflare Docs][2])

I'd support **three modes**.

### Mode 1 — Quick Tunnel

One click:

```text
[ Share ]

Creating tunnel...

✓ Online

https://random-name.trycloudflare.com
```

Cloudflare documents Quick Tunnels as temporary `trycloudflare.com` URLs for local HTTP services. ([Cloudflare Docs][3])

Perfect for:

* client demos
* webhook testing
* temporary sharing

---

### Mode 2 — Persistent Tunnel

```text
Project:
myshop

Cloudflare:
Connected

Hostname:
demo.example.com

[ Start ]
```

For persistent tunnels, DevBox manages the `cloudflared` process and configuration.

Cloudflare's current documentation supports mapping public hostnames to local services and also supports locally managed tunnel configuration files with multiple ingress rules. ([Cloudflare Docs][4])

---

### Mode 3 — Cloudflare account integration

Later:

```text
Connect Cloudflare

[ Login ]

Account
Domains
Tunnels
DNS
```

Then:

```text
Project
 ↓
Select domain
 ↓
Select subdomain
 ↓
Create tunnel
 ↓
DNS route
 ↓
Start
```

The user shouldn't have to manually type `cloudflared` commands.

---

# 14. Tunnel security

This deserves special treatment.

Never expose:

```text
MySQL
Redis
phpMyAdmin
Adminer
```

to the public internet automatically.

Default:

```text
HTTP project       ✓ allowed
HTTPS project      ✓ allowed

MySQL              ✗
Redis               ✗
phpMyAdmin          ✗
DevBox API          ✗
```

The tunnel manager should explicitly require confirmation for anything beyond HTTP/HTTPS.

---

# 15. Local domains

Support:

```text
project.test
project.localhost
project.devbox
```

I'd make `.test` the default.

Example:

```text
myshop.test
erp.test
client.test
wordpress.test
```

Project creation automatically:

```text
Create project
      ↓
Generate vhost
      ↓
Add Windows hosts entry
      ↓
Generate SSL
      ↓
Start server
```

---

# 16. HTTPS

This should be built into the project workflow.

```text
myshop.test
```

becomes:

```text
https://myshop.test
```

Use a local certificate mechanism and install the local CA into the Windows trust store.

UI:

```text
SSL

Status: ✓ Trusted

Certificate:
myshop.test

Issued:
2026-10-02

Expires:
2027-10-02

[ Renew ]
[ Remove ]
```

---

# 17. Main UI

I'd make the interface feel more like a modern IDE than old WAMP.

![Image](https://images.openai.com/static-rsc-4/Y09DUFVzHTsFjTpPQ_MLYaTn2_ZCD9NAfPD1D7p8tWAVtQi8JsnwgGN-ohxyJvRRcDTeL3d1foJk9cnZjU7lQ0y-QJXnpx6vsXfVQ8FlbcxtvDKJXCGyQjry4SBr-WnbQHoA-1b3taRBPGnox6PQVgAJ9SkVNfmagWxgz_c01l3Hx1Cgz1s5D13k0lIMy39-?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/Bs78ZlSZNnXVReRM09K4R7QRbIMVNp4dhlRAJm0WZKLb8xtd7eeFxkPxRQWgWF-FiBmOP86gjWFSknSpjmXudaI9KIcaL_ZXjkcF94CTSFbEtKv44rxLN6VSyH8WIcLE-P0UQXlqjUDsgLXfmA4M6Sqhu1m-CGmI8_dqCt43i3GBfFNCSCM0h8weqUzgRQSK?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/t3MJJw4VGbC6ALsN69uJuW1by4Kt3Gl78NKAR7T2ztCxczNTAI3H3zj8y9kJUKmnDtvLu5GSqEE2C8fSrIqKXqGHzj492y5gOoav9Ile4qTsXYSeAmiT47dQ42I3Z0aJOcd4fGVBkbfCiis7ZYy2GNSj-_fkjM5Dma7frI01rlYFy1jKuu-F2vHxOYkKLHoZ?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/NDzt52Ep0jGX7h5d6jcpOB1QdKztWE60e5C28f3wsQ29Zq2RNMG7SwsJ4crB-lU5zdFhQskDgPcVJqN5nV9okh4UgWjjYMY-kcHUXvGHONdzzUwqFJZQqv1kL0FkwKXmz8ymy0SoEP43Szv-_Yd-Nmxg7xh25Drk16-PMge3nn55mbB2WWVU4sRy3THss7Ti?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/iq9D_0Vr4vHJ4DPbYAdfNm5vVaENkLICQpVxMX1we8bj-kwTQOZC1pxZ4Ja7LGpfYDGdhgPrnPrttVrB-2aYMwHY_tMm8OBYHH3ieMvwPWhTCU85T_Q_EcXlgl9YodbRUIHpZD5zPgvG7tBp7cj2nzduiZevrsrkE7KE8OSyBv-6YHjDlYQMmW37MXRU6zjJ?purpose=fullsize)

### Sidebar

```text
┌─────────────────────┐
│ DEVBOX              │
│                     │
│ 🏠 Dashboard        │
│ 📁 Projects         │
│ ⚡ Services         │
│ 🐘 PHP              │
│ 🗄 Databases        │
│ 🌐 Domains          │
│ 🔒 SSL              │
│ ☁ Tunnels           │
│ 📋 Logs             │
│ 🩺 Diagnostics      │
│                     │
│ ──────────────────  │
│ ⚙ Settings          │
└─────────────────────┘
```

---

# 18. Dashboard

```text
┌───────────────────────────────────────────────────┐
│ Dashboard                                         │
├───────────────────────────────────────────────────┤
│                                                   │
│  Projects       Services       PHP       Tunnels │
│     8              4           8.3        2      │
│                                                   │
├───────────────────────────────────────────────────┤
│ Services                                         │
│                                                   │
│ Apache       ● Running       :80                 │
│ MySQL        ● Running       :3306               │
│ Redis        ● Running       :6379               │
│ Cloudflare   ● Connected                         │
│                                                   │
├───────────────────────────────────────────────────┤
│ Recent Projects                                   │
│                                                   │
│ My Shop       PHP 8.3      ● Running             │
│ ERP           PHP 8.2      ● Running             │
│ Client WP     PHP 8.1      ○ Stopped             │
└───────────────────────────────────────────────────┘
```

---

# 19. Projects screen

```text
Projects

[ + New Project ]

Search...

┌─────────────────────────────────────────────┐
│ My Shop                                     │
│ Laravel                                     │
│ PHP 8.3 | MySQL | Redis                     │
│ https://myshop.test                          │
│                                             │
│ [Open] [Terminal] [Database] [Share]        │
└─────────────────────────────────────────────┘
```

---

# 20. New Project wizard

This could become one of the strongest features.

### Step 1

```text
Create Project

○ Laravel
○ WordPress
○ PHP
○ Symfony
○ Custom
```

### Step 2

```text
Project Name
myshop

Location
D:\Projects

Domain
myshop.test
```

### Step 3

```text
PHP
[ 8.3 ▼ ]

Web Server
● Apache
○ Nginx
```

### Step 4

```text
Services

☑ MySQL
☑ Redis
☐ Mailpit
```

### Step 5

```text
HTTPS

☑ Enable HTTPS
☑ Trust local certificate
```

### Step 6

```text
[ Create Project ]

Installing...

✓ PHP
✓ Apache
✓ Database
✓ Virtual Host
✓ SSL
✓ Laravel

Project ready.
```

---

# 21. PHP Manager

```text
PHP Versions

┌──────────────────────────────────────┐
│ 8.5.1          Installed             │
│ [Set CLI] [Remove]                   │
├──────────────────────────────────────┤
│ 8.4.15         Installed             │
│ [Set CLI] [Remove]                   │
├──────────────────────────────────────┤
│ 8.3.27         Installed             │
│ [Active]                             │
├──────────────────────────────────────┤
│ 8.2.29         Not Installed         │
│ [Install]                            │
└──────────────────────────────────────┘

[ + Install PHP Version ]
```

---

# 22. Services

```text
Services

Apache       ● Running    80
MySQL        ● Running    3306
Redis        ● Running    6379
Nginx        ○ Stopped    8080
Mailpit      ○ Stopped    8025

                 [Start All]
```

Clicking a service:

```text
Apache

Status: Running
PID: 4216
Port: 80

[Restart]
[Stop]

Configuration
Logs
Error Logs
```

---

# 23. Database manager

```text
Databases

[ + Create Database ]

myshop
MySQL 8.4
24 MB

erp
MariaDB 11
82 MB

wordpress
MySQL 8.4
12 MB
```

Actions:

```text
Open
Backup
Restore
Delete
CLI
```

---

# 24. Project terminal

This would be extremely useful.

```text
My Shop

[Terminal]

D:\Projects\myshop>

php artisan migrate

INFO  Running migrations.

D:\Projects\myshop>
```

The terminal should inherit the project's:

```text
PHP
Composer
Node
npm
Git
environment
```

So if the project uses PHP 8.3:

```text
php
```

automatically points to PHP 8.3.

---

# 25. Environment editor

For Laravel:

```text
Environment

APP_NAME       My Shop
APP_ENV        local
APP_DEBUG      true
APP_URL        https://myshop.test

DB_CONNECTION  mysql
DB_HOST        127.0.0.1
DB_PORT        3306
DB_DATABASE    myshop
DB_USERNAME    root
DB_PASSWORD    ********

REDIS_HOST     127.0.0.1
REDIS_PORT     6379
```

Actions:

```text
[Save]
[Reveal Secrets]
[Copy]
[Validate]
```

---

# 26. Diagnostics engine

This can make your product stand out.

Button:

**Run Diagnostics**

```text
System Check

✓ Windows
✓ 16 GB RAM
✓ Disk Space

PHP
✓ PHP 8.3
✓ OpenSSL
✓ PDO
✓ Mbstring
✓ Curl

Apache
✓ Installed
✓ Configuration valid
✗ Port 80 conflict

MySQL
✓ Installed
✓ Running

Hosts
✓ myshop.test

SSL
✓ Certificate trusted
```

For every error:

```text
Port 80 is occupied by IIS.

[View Process]
[Stop IIS]
[Use Port 8080]
```

---

# 27. Port manager

This deserves its own screen.

```text
Ports

80      Apache       Running
443     Apache SSL   Running
3306    MySQL        Running
6379    Redis        Running
8025    Mailpit      Stopped

Port 8080
Currently used by:
PID 8124
nginx.exe

[Inspect]
```

This will save developers a lot of frustration.

---

# 28. Exclusive features

This is where I'd differentiate the product.

### A. Project snapshots

```text
My Shop

Snapshot:
2026-10-02 11:30

[Create Snapshot]
```

Snapshot:

```text
Project files
Database
PHP version
Services
Environment metadata
Domain configuration
```

---

### B. "Clone Project Environment"

Imagine:

```text
Client A
PHP 7.4
MySQL 5.7
Apache
```

You can clone it:

```text
[Clone Environment]
```

and reproduce the same setup for another project.

This could be extremely valuable for agencies.

---

### C. Project Health

```text
My Shop

Health: 94%

PHP             ✓
Composer        ✓
Extensions      ✓
Database        ✓
SSL             ✓
Redis           ✓
Environment     ✓
```

---

### D. Webhook mode

One button:

```text
[Expose Webhooks]
```

Creates:

```text
https://webhook-example.trycloudflare.com
```

Useful for:

* Stripe
* PayPal
* Facebook
* WhatsApp
* Shopify
* Laravel webhooks

---

### E. Temporary client preview

```text
Share Project

Duration:
○ 1 hour
○ 4 hours
● Until stopped

Access:
○ Public
● Password protected

[Generate Preview]
```

---

# 29. Backup architecture

Project backup should include:

```text
project/
database/
.devbox/
configuration/
```

But don't blindly copy runtime binaries.

Create:

```text
.devbox/
    project.json
    environment.json
    services.json
```

Then:

```text
Export Environment
```

produces:

```text
myshop.devbox
```

Another computer:

```text
Import Environment
```

DevBox recreates:

```text
PHP
Apache
MySQL
Redis
Domain
SSL
Database
Project configuration
```

This is potentially a **major product feature**.

---

# 30. Plugin architecture

Eventually support:

```text
plugins/
```

Each plugin:

```text
plugin.json
```

Example:

```json
{
  "name": "mailpit",
  "version": "1.0",
  "type": "service",
  "entry": "plugin.dll"
}
```

Possible plugins:

```text
Mailpit
Meilisearch
Elasticsearch
MongoDB
PostgreSQL
RabbitMQ
Memcached
MinIO
Cloudflare
Ngrok
```

Don't build this in v1, but architect for it.

---

# 31. AI integration — later

A future feature could be:

```text
DevBox AI

"Why isn't my Laravel project starting?"
```

DevBox can inspect:

```text
Apache logs
PHP errors
Laravel logs
Port status
PHP version
extensions
.env
database connection
```

and explain:

```text
Problem:
PDO MySQL extension is missing.

Detected:
PHP 8.3

Required:
pdo_mysql

[Enable Extension]
```

This would be a genuinely interesting differentiator.

---

# 32. Security architecture

Because this application controls the machine, security is extremely important.

Frontend should **never** be allowed to execute arbitrary commands.

Bad:

```text
frontend → shell("whatever user typed")
```

Instead:

```text
frontend
   ↓
Rust command
   ↓
validated operation
   ↓
specific executable
   ↓
specific arguments
```

For example:

```text
start_service("mysql")
```

not:

```text
execute("anything")
```

Also:

* validate all paths
* prevent `..` traversal
* whitelist executables
* validate ports
* protect credentials
* use Windows DPAPI/Credential Manager for secrets
* require elevation only when needed
* maintain an audit log for privileged operations
* never expose DevBox's internal API through Cloudflare by default

---

# 33. Windows administrator model

Some operations require administrator privileges:

```text
Hosts file
Windows services
Firewall
Certificate trust store
Certain network configuration
```

Don't run the entire application permanently as administrator.

Instead:

```text
Normal DevBox process
       │
       ├── normal operations
       │
       └── privileged helper
                ↓
          Windows UAC
```

This is a much safer design.

---

# 34. Update architecture

Separate:

```text
DevBox application updates
```

from:

```text
Runtime updates
```

For example:

```text
DevBox 1.4.0
```

and:

```text
PHP 8.3.27
Apache 2.x
MySQL 8.x
```

can update independently.

Tauri's updater can handle the application update workflow, while your Runtime Manager can manage runtime manifests and checksums. ([Tauri][1])

---

# 35. Licensing architecture

Don't hard-code commercial licensing into the core.

Create:

```text
LicenseManager
```

with:

```text
license_type
license_key
expiration
features
activation_status
```

Possible editions:

### Free

```text
PHP
Apache
MySQL
Projects
Domains
SSL
Basic tunnel
```

### Pro

```text
Unlimited projects
Cloudflare persistent tunnels
Snapshots
Environment export
Advanced diagnostics
Multiple runtime profiles
```

### Team

```text
Environment sharing
Team templates
Centralized configuration
```

You can decide the actual pricing later.

---

# 36. Development roadmap

I would **not** attempt everything at once.

## Phase 0 — Architecture

**Goal: 2–3 days**

Build:

```text
AGENTS.md
architecture.md
coding-rules.md
runtime-spec.md
security.md
```

Define Rust commands and TypeScript interfaces before implementing features.

---

# Phase 1 — Desktop shell

**Goal: 3–5 days**

Build:

* Tauri
* React
* sidebar
* routing
* theme
* settings
* notifications
* command bridge

Screens:

```text
Dashboard
Projects
Services
Settings
```

No real server management yet.

---

# Phase 2 — Process Manager

**Goal: 4–7 days**

Implement:

```text
start()
stop()
restart()
status()
logs()
```

Support:

```text
Apache
MySQL
Redis
```

First milestone:

> User can start/stop/check actual services from the GUI.

---

# Phase 3 — PHP Manager

**Goal: 5–8 days**

Implement:

```text
Install PHP
Remove PHP
Detect PHP
Switch CLI
Extensions
php.ini
```

Support multiple versions.

Example:

```text
7.4
8.1
8.2
8.3
8.4
8.5
```

Don't initially support every historical version.

---

# Phase 4 — Project Manager

**Goal: 5–7 days**

Implement:

```text
Create
Delete
Rename
Open
Start
Stop
Terminal
```

Project metadata:

```text
.devbox/project.json
```

---

# Phase 5 — Apache + Domains

**Goal: 5–8 days**

Implement:

```text
Virtual hosts
Hosts file
Project domains
Port detection
Automatic configuration
```

Then:

```text
myshop.test
erp.test
client.test
```

---

# Phase 6 — SSL

**Goal: 4–6 days**

Implement:

```text
Local CA
Certificate generation
Windows trust
Automatic renewal
```

Then:

```text
https://myshop.test
```

---

# Phase 7 — Database Manager

**Goal: 5–8 days**

Implement:

```text
MySQL
MariaDB
Database creation
Delete
Backup
Restore
Import
Export
```

Then integrate Adminer/phpMyAdmin.

---

# Phase 8 — Laravel/WordPress installers

**Goal: 5–7 days**

### Laravel

```text
New Laravel Project
↓
Select PHP
↓
Create DB
↓
Install Laravel
↓
Configure .env
↓
Create domain
↓
SSL
↓
Ready
```

### WordPress

Same concept.

---

# Phase 9 — Cloudflare

**Goal: 5–10 days**

Start with:

### Quick Tunnel

```text
[Share]
```

Then persistent tunnels.

Cloudflare's current documentation distinguishes Quick Tunnels from account-backed/local tunnel workflows, so keeping those as separate internal modes will make the implementation cleaner. ([Cloudflare Docs][5])

---

# Phase 10 — Diagnostics

**Goal: 4–6 days**

Build:

```text
Port diagnostics
PHP diagnostics
Apache diagnostics
MySQL diagnostics
SSL diagnostics
Hosts diagnostics
Disk diagnostics
```

---

# Phase 11 — Snapshots

**Goal: 5–8 days**

Implement:

```text
Project backup
Database backup
Environment export
Environment import
Clone environment
```

---

# Phase 12 — Production polish

**Goal: 1–2 weeks**

Add:

* installer
* uninstaller
* auto updater
* crash reporting
* logs
* error recovery
* startup handling
* Windows startup option
* system tray
* notifications
* file associations
* documentation
* licensing

---

# 37. AI coding strategy

This is particularly important if you're going to use vibe coding.

Create an `AGENTS.md` at the root.

Something like:

```text
# DevBox Development Rules

## Architecture

Frontend:
React + TypeScript

Desktop:
Tauri

Backend:
Rust

Database:
SQLite

## Rules

1. Never execute arbitrary shell commands from frontend.
2. All OS operations must go through typed Tauri commands.
3. Never hard-code runtime versions.
4. Runtime information must come from manifests.
5. Never store plaintext credentials when secure storage is available.
6. Every service must implement ServiceAdapter.
7. Every web server must implement WebServerAdapter.
8. Never mix UI logic with Rust process management.
9. Every feature must have unit tests.
10. Do not introduce unnecessary abstractions.
11. Do not use a global mutable state when a scoped service works.
12. All privileged Windows operations require explicit elevation.
```

---

# 38. Give AI agents small missions

Don't say:

> Build DevBox.

Instead:

### Prompt 1

> Implement the Rust ProcessManager abstraction. It must support start, stop, restart, status, PID tracking and stdout/stderr capture. Do not implement any UI.

Then:

### Prompt 2

> Implement ApacheAdapter using ProcessManager. Add configuration validation and log retrieval.

Then:

### Prompt 3

> Create the React Services page using mock service data. Do not connect it to Rust yet.

Then:

### Prompt 4

> Connect Services page to the Rust service commands.

This makes AI-generated code much more controllable.

---

# 39. Recommended MVP

Don't try to launch with 30 features.

Your **first usable version** should be:

```text
DEVBOX MVP

✓ Dashboard
✓ Projects
✓ Apache
✓ PHP 8.1–8.5
✓ PHP version switching
✓ MySQL
✓ Redis
✓ Virtual hosts
✓ .test domains
✓ HTTPS
✓ Laravel installer
✓ WordPress installer
✓ Terminal
✓ Logs
✓ Port diagnostics
✓ Cloudflare Quick Tunnel
```

That's already a very substantial product.

---

# 40. Version 1.0

Then:

```text
DEVBOX 1.0

Projects
├── Laravel
├── WordPress
├── PHP
└── Custom

Runtime
├── PHP
├── Apache
├── Nginx
├── MySQL
├── MariaDB
├── Redis
├── Node
├── Composer
└── Git

Networking
├── Domains
├── SSL
├── Hosts
└── Cloudflare

Developer Tools
├── Terminal
├── Environment
├── Logs
├── Diagnostics
├── Database
└── Backups

Advanced
├── Snapshots
├── Environment Export
├── Environment Import
└── Project Sharing
```

---

# 41. The feature that could make this genuinely different

I'd make **Environment Profiles** a core concept.

Imagine you're maintaining an old WordPress client site:

```text
Client Legacy Profile

PHP:       7.4
Apache:    2.4
MySQL:     5.7
WordPress: 6.x
SSL:       Enabled
Domain:    client.test
```

Another:

```text
Modern Laravel Profile

PHP:       8.5
Nginx:     Enabled
MySQL:     8.4
Redis:     Enabled
Node:      24
```

Then:

> **Switch Environment**

and DevBox handles the required runtime configuration.

That is much more powerful than simply having a "PHP version dropdown."

---

# 42. Long-term vision

Eventually the product could look like:

```text
                         DEVBOX
                           │
          ┌────────────────┼────────────────┐
          │                │                │
       CREATE            RUN              SHARE
          │                │                │
       Laravel          PHP             Cloudflare
       WordPress        Apache          Tunnel
       Symfony          Nginx           HTTPS
       PHP              MySQL           Public URL
          │             Redis
          │                │
          └────────────────┼────────────────┘
                           │
                    ENVIRONMENT
                           │
             ┌─────────────┼─────────────┐
             │             │             │
          Snapshot       Export        Clone
```

That becomes much more than **WAMP**.

It becomes a **Windows PHP development platform**.

And I think that is the right direction for a vibe-coded product because the individual components are relatively isolated: the AI can implement `PHPManager`, `ServiceManager`, `ProjectManager`, `TunnelManager`, etc. separately rather than generating one enormous fragile codebase.

One technical point worth preserving from the beginning: Cloudflare currently recommends remotely managed tunnels for most general use, while locally managed tunnels are specifically documented for development/testing scenarios. Your UI should therefore support both models rather than baking the product around only a local `config.yml`. ([Cloudflare Docs][5])

### My recommended build order

**Tauri shell → Rust ProcessManager → RuntimeManager → PHPManager → ProjectManager → Apache/Nginx → Domains → SSL → MySQL/Redis → Laravel/WordPress installer → Cloudflare → Diagnostics → Snapshots → Plugin system.**

That order minimizes rework and gives you a working product very early.

[1]: https://v2.tauri.app/plugin/updater/?utm_source=chatgpt.com "Updater | Tauri"
[2]: https://developers.cloudflare.com/tunnel/?utm_source=chatgpt.com "Cloudflare Tunnel · Cloudflare Docs"
[3]: https://developers.cloudflare.com/tunnel/get-started/?utm_source=chatgpt.com "Set up Cloudflare Tunnel · Cloudflare Docs"
[4]: https://developers.cloudflare.com/tunnel/features/locally-managed-tunnels/configuration-file/?utm_source=chatgpt.com "Configuration file · Cloudflare Docs"
[5]: https://developers.cloudflare.com/tunnel/features/locally-managed-tunnels/?utm_source=chatgpt.com "Locally-managed tunnels · Cloudflare Docs"
