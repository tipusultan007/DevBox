-- DevBox Core SQLite Schema Migration 001
-- Tables: projects, runtimes, services, project_services, domains, databases, tunnels, logs, settings

CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    path TEXT NOT NULL,
    project_type TEXT NOT NULL DEFAULT 'laravel', -- laravel, wordpress, symfony, php, custom
    domain TEXT NOT NULL,
    https_enabled INTEGER NOT NULL DEFAULT 1,
    php_version TEXT NOT NULL DEFAULT '8.3',
    web_server TEXT NOT NULL DEFAULT 'apache',     -- apache, nginx
    status TEXT NOT NULL DEFAULT 'stopped',        -- running, stopped, error
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS runtimes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    runtime_type TEXT NOT NULL,                    -- php, apache, nginx, mysql, redis, etc.
    name TEXT NOT NULL,
    version TEXT NOT NULL,
    architecture TEXT NOT NULL DEFAULT 'x64',
    install_path TEXT NOT NULL,
    is_installed INTEGER NOT NULL DEFAULT 0,
    is_default INTEGER NOT NULL DEFAULT 0,
    checksum TEXT,
    installed_at DATETIME
);

CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    service_type TEXT NOT NULL,                    -- apache, nginx, mysql, mariadb, redis, mailpit
    port INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'stopped',        -- running, stopped, restarting, error
    auto_start INTEGER NOT NULL DEFAULT 1,
    config_path TEXT,
    pid INTEGER
);

CREATE TABLE IF NOT EXISTS project_services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    service_id INTEGER NOT NULL,
    enabled INTEGER NOT NULL DEFAULT 1,
    config_override TEXT,
    FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY(service_id) REFERENCES services(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS domains (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    hostname TEXT UNIQUE NOT NULL,
    port INTEGER NOT NULL DEFAULT 80,
    ssl_port INTEGER NOT NULL DEFAULT 443,
    protocol TEXT NOT NULL DEFAULT 'https',
    ssl_enabled INTEGER NOT NULL DEFAULT 1,
    hosts_entry_active INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS databases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER,
    engine TEXT NOT NULL DEFAULT 'mysql',          -- mysql, mariadb
    name TEXT NOT NULL,
    username TEXT NOT NULL DEFAULT 'root',
    host TEXT NOT NULL DEFAULT '127.0.0.1',
    port INTEGER NOT NULL DEFAULT 3306,
    size_mb REAL DEFAULT 0.0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS tunnels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    provider TEXT NOT NULL DEFAULT 'cloudflare',
    mode TEXT NOT NULL DEFAULT 'quick',            -- quick, persistent, account
    name TEXT,
    hostname TEXT,
    target_url TEXT NOT NULL,
    public_url TEXT,
    status TEXT NOT NULL DEFAULT 'inactive',       -- active, inactive, error
    pid INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS system_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service TEXT NOT NULL,
    level TEXT NOT NULL DEFAULT 'info',            -- debug, info, warning, error
    message TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

-- Seed initial default services
INSERT OR IGNORE INTO services (id, name, service_type, port, status, auto_start) VALUES
    (1, 'Apache HTTP Server', 'apache', 80, 'stopped', 1),
    (2, 'MySQL Server', 'mysql', 3306, 'stopped', 1),
    (3, 'Redis Cache', 'redis', 6379, 'stopped', 1),
    (4, 'Nginx Web Server', 'nginx', 8080, 'stopped', 0),
    (5, 'Mailpit Mail Testing', 'mailpit', 8025, 'stopped', 0);
