use crate::models::Service;

#[tauri::command]
pub async fn list_services() -> Result<Vec<Service>, String> {
    Ok(vec![
        Service {
            id: 1,
            name: "Apache HTTP Server".to_string(),
            service_type: "apache".to_string(),
            port: 80,
            status: "running".to_string(),
            auto_start: true,
            pid: Some(4216),
        },
        Service {
            id: 2,
            name: "MySQL 8.4 Server".to_string(),
            service_type: "mysql".to_string(),
            port: 3306,
            status: "running".to_string(),
            auto_start: true,
            pid: Some(5128),
        },
        Service {
            id: 3,
            name: "Redis Cache".to_string(),
            service_type: "redis".to_string(),
            port: 6379,
            status: "running".to_string(),
            auto_start: true,
            pid: Some(6044),
        },
        Service {
            id: 4,
            name: "Nginx Web Server".to_string(),
            service_type: "nginx".to_string(),
            port: 8080,
            status: "stopped".to_string(),
            auto_start: false,
            pid: None,
        },
        Service {
            id: 5,
            name: "Mailpit SMTP/Webmail".to_string(),
            service_type: "mailpit".to_string(),
            port: 8025,
            status: "stopped".to_string(),
            auto_start: false,
            pid: None,
        },
    ])
}

#[tauri::command]
pub async fn start_service(service_type: String) -> Result<String, String> {
    Ok(format!("Service {} started successfully", service_type))
}

#[tauri::command]
pub async fn stop_service(service_type: String) -> Result<String, String> {
    Ok(format!("Service {} stopped successfully", service_type))
}

#[tauri::command]
pub async fn restart_service(service_type: String) -> Result<String, String> {
    Ok(format!("Service {} restarted successfully", service_type))
}

#[tauri::command]
pub async fn get_service_logs(service_type: String, lines: Option<usize>) -> Result<Vec<String>, String> {
    let count = lines.unwrap_or(50);
    Ok(vec![
        format!("[2026-10-02 11:30:00] [notice] {} worker process ready", service_type),
        format!("[2026-10-02 11:30:01] [info] {} configuration syntax ok", service_type),
        format!("[2026-10-02 11:30:01] [notice] {} listening on target ports (showing {} entries)", service_type, count),
    ])
}
