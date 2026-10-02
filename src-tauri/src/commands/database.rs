use crate::models::DatabaseItem;

#[tauri::command]
pub async fn list_databases() -> Result<Vec<DatabaseItem>, String> {
    Ok(vec![
        DatabaseItem {
            id: 1,
            project_id: Some(1),
            project_name: Some("Laravel ERP".to_string()),
            engine: "mysql".to_string(),
            name: "erp".to_string(),
            username: "root".to_string(),
            host: "127.0.0.1".to_string(),
            port: 3306,
            size_mb: 82.4,
            created_at: "2026-09-28 10:05:00".to_string(),
        },
        DatabaseItem {
            id: 2,
            project_id: Some(2),
            project_name: Some("My Shop".to_string()),
            engine: "mysql".to_string(),
            name: "myshop".to_string(),
            username: "root".to_string(),
            host: "127.0.0.1".to_string(),
            port: 3306,
            size_mb: 24.1,
            created_at: "2026-09-30 14:20:00".to_string(),
        },
        DatabaseItem {
            id: 3,
            project_id: Some(3),
            project_name: Some("Client WP".to_string()),
            engine: "mysql".to_string(),
            name: "wordpress".to_string(),
            username: "root".to_string(),
            host: "127.0.0.1".to_string(),
            port: 3306,
            size_mb: 12.8,
            created_at: "2026-09-20 09:35:00".to_string(),
        },
    ])
}

#[tauri::command]
pub async fn create_database(name: String, _engine: Option<String>) -> Result<DatabaseItem, String> {
    Ok(DatabaseItem {
        id: chrono::Utc::now().timestamp_millis(),
        project_id: None,
        project_name: None,
        engine: "mysql".to_string(),
        name,
        username: "root".to_string(),
        host: "127.0.0.1".to_string(),
        port: 3306,
        size_mb: 0.1,
        created_at: chrono::Local::now().format("%Y-%m-%d %H:%M:%S").to_string(),
    })
}

#[tauri::command]
pub async fn delete_database(_id: i64) -> Result<(), String> {
    Ok(())
}

#[tauri::command]
pub async fn backup_database(name: String) -> Result<String, String> {
    let filename = format!("C:\\DevBox\\backups\\{}_{}.sql", name, chrono::Local::now().format("%Y%m%d_%H%M%S"));
    Ok(filename)
}
