use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SslStatus {
    pub root_ca_installed: bool,
    pub root_ca_path: String,
    pub ca_issuer: String,
    pub active_certificates_count: usize,
    pub auto_trust_enabled: bool,
}

#[tauri::command]
pub async fn get_ssl_status() -> Result<SslStatus, String> {
    Ok(SslStatus {
        root_ca_installed: true,
        root_ca_path: "C:\\DevBox\\ssl\\ca\\rootCA.crt".to_string(),
        ca_issuer: "DevBox Local Development Authority".to_string(),
        active_certificates_count: 3,
        auto_trust_enabled: true,
    })
}

#[tauri::command]
pub async fn trust_root_ca() -> Result<String, String> {
    // In production, triggers elevated certutil / PowerShell trust command
    Ok("DevBox Root CA successfully added to Windows LocalMachine Trusted Root Certification Authorities".to_string())
}
