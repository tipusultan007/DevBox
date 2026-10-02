use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Project {
    pub id: i64,
    pub name: String,
    pub slug: String,
    pub path: String,
    pub project_type: String,
    pub domain: String,
    pub https_enabled: bool,
    pub php_version: String,
    pub web_server: String,
    pub status: String,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateProjectInput {
    pub name: String,
    pub path: String,
    pub project_type: String,
    pub domain: String,
    pub https_enabled: bool,
    pub php_version: String,
    pub web_server: String,
    pub services: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Runtime {
    pub id: i64,
    pub runtime_type: String,
    pub name: String,
    pub version: String,
    pub architecture: String,
    pub install_path: String,
    pub is_installed: bool,
    pub is_default: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Service {
    pub id: i64,
    pub name: String,
    pub service_type: String,
    pub port: u16,
    pub status: String,
    pub auto_start: bool,
    pub pid: Option<u32>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DatabaseItem {
    pub id: i64,
    pub project_id: Option<i64>,
    pub project_name: Option<String>,
    pub engine: String,
    pub name: String,
    pub username: String,
    pub host: String,
    pub port: u16,
    pub size_mb: f64,
    pub created_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DomainItem {
    pub id: i64,
    pub project_id: i64,
    pub project_name: String,
    pub hostname: String,
    pub port: u16,
    pub ssl_port: u16,
    pub protocol: String,
    pub ssl_enabled: bool,
    pub hosts_entry_active: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TunnelItem {
    pub id: i64,
    pub project_id: i64,
    pub project_name: String,
    pub provider: String,
    pub mode: String,
    pub target_url: String,
    pub public_url: Option<String>,
    pub status: String,
    pub pid: Option<u32>,
    pub created_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DiagnosticCheck {
    pub id: String,
    pub category: String,
    pub title: String,
    pub status: String, // "pass" | "warn" | "fail"
    pub message: String,
    pub action_label: Option<String>,
    pub action_id: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemInfo {
    pub os: String,
    pub arch: String,
    pub devbox_version: String,
    pub active_cli_php: String,
    pub apache_status: String,
    pub mysql_status: String,
    pub redis_status: String,
}
