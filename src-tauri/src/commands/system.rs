use crate::models::SystemInfo;
use std::collections::HashMap;

#[tauri::command]
pub async fn get_system_info() -> Result<SystemInfo, String> {
    Ok(SystemInfo {
        os: "Windows 11 Professional".to_string(),
        arch: "x64".to_string(),
        devbox_version: "0.1.0".to_string(),
        active_cli_php: "8.3.17".to_string(),
        apache_status: "running".to_string(),
        mysql_status: "running".to_string(),
        redis_status: "running".to_string(),
    })
}

#[tauri::command]
pub async fn get_paths() -> Result<HashMap<String, String>, String> {
    let mut map = HashMap::new();
    map.insert("devbox_root".to_string(), "C:\\DevBox".to_string());
    map.insert("projects".to_string(), "D:\\Projects".to_string());
    map.insert("runtimes".to_string(), "C:\\DevBox\\runtimes".to_string());
    map.insert("data".to_string(), "C:\\DevBox\\data".to_string());
    map.insert("logs".to_string(), "C:\\DevBox\\logs".to_string());
    map.insert("backups".to_string(), "C:\\DevBox\\backups".to_string());
    map.insert("ssl".to_string(), "C:\\DevBox\\ssl".to_string());
    Ok(map)
}
