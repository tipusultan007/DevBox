use crate::models::DomainItem;

#[tauri::command]
pub async fn list_domains() -> Result<Vec<DomainItem>, String> {
    Ok(vec![
        DomainItem {
            id: 1,
            project_id: 1,
            project_name: "Laravel ERP".to_string(),
            hostname: "erp.test".to_string(),
            port: 80,
            ssl_port: 443,
            protocol: "https".to_string(),
            ssl_enabled: true,
            hosts_entry_active: true,
        },
        DomainItem {
            id: 2,
            project_id: 2,
            project_name: "My Shop".to_string(),
            hostname: "myshop.test".to_string(),
            port: 80,
            ssl_port: 443,
            protocol: "https".to_string(),
            ssl_enabled: true,
            hosts_entry_active: true,
        },
        DomainItem {
            id: 3,
            project_id: 3,
            project_name: "Client WP".to_string(),
            hostname: "client.test".to_string(),
            port: 80,
            ssl_port: 443,
            protocol: "https".to_string(),
            ssl_enabled: true,
            hosts_entry_active: true,
        },
    ])
}

#[tauri::command]
pub async fn create_domain(project_id: i64, hostname: String) -> Result<DomainItem, String> {
    Ok(DomainItem {
        id: chrono::Utc::now().timestamp_millis(),
        project_id,
        project_name: "New Project".to_string(),
        hostname,
        port: 80,
        ssl_port: 443,
        protocol: "https".to_string(),
        ssl_enabled: true,
        hosts_entry_active: true,
    })
}
