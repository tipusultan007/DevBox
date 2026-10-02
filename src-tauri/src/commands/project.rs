use crate::models::{CreateProjectInput, Project};

#[tauri::command]
pub async fn list_projects() -> Result<Vec<Project>, String> {
    // In production, loads from devbox.sqlite
    Ok(vec![
        Project {
            id: 1,
            name: "Laravel ERP".to_string(),
            slug: "laravel-erp".to_string(),
            path: "D:\\Projects\\erp".to_string(),
            project_type: "laravel".to_string(),
            domain: "erp.test".to_string(),
            https_enabled: true,
            php_version: "8.3".to_string(),
            web_server: "apache".to_string(),
            status: "running".to_string(),
            created_at: "2026-09-28 10:00:00".to_string(),
            updated_at: "2026-10-02 11:20:00".to_string(),
        },
        Project {
            id: 2,
            name: "My Shop".to_string(),
            slug: "myshop".to_string(),
            path: "D:\\Projects\\myshop".to_string(),
            project_type: "laravel".to_string(),
            domain: "myshop.test".to_string(),
            https_enabled: true,
            php_version: "8.3".to_string(),
            web_server: "apache".to_string(),
            status: "running".to_string(),
            created_at: "2026-09-30 14:15:00".to_string(),
            updated_at: "2026-10-02 12:00:00".to_string(),
        },
        Project {
            id: 3,
            name: "Client WP".to_string(),
            slug: "client-wp".to_string(),
            path: "D:\\Projects\\client-wp".to_string(),
            project_type: "wordpress".to_string(),
            domain: "client.test".to_string(),
            https_enabled: true,
            php_version: "8.1".to_string(),
            web_server: "apache".to_string(),
            status: "stopped".to_string(),
            created_at: "2026-09-20 09:30:00".to_string(),
            updated_at: "2026-10-01 16:45:00".to_string(),
        },
    ])
}

#[tauri::command]
pub async fn get_project(id: i64) -> Result<Option<Project>, String> {
    let projects = list_projects().await?;
    Ok(projects.into_iter().find(|p| p.id == id))
}

#[tauri::command]
pub async fn create_project(input: CreateProjectInput) -> Result<Project, String> {
    let slug = input.name.to_lowercase().replace(' ', "-");
    let project = Project {
        id: chrono::Utc::now().timestamp_millis(),
        name: input.name,
        slug,
        path: input.path,
        project_type: input.project_type,
        domain: input.domain,
        https_enabled: input.https_enabled,
        php_version: input.php_version,
        web_server: input.web_server,
        status: "running".to_string(),
        created_at: chrono::Local::now().format("%Y-%m-%d %H:%M:%S").to_string(),
        updated_at: chrono::Local::now().format("%Y-%m-%d %H:%M:%S").to_string(),
    };
    Ok(project)
}

#[tauri::command]
pub async fn delete_project(_id: i64) -> Result<(), String> {
    Ok(())
}

#[tauri::command]
pub async fn start_project(id: i64) -> Result<String, String> {
    Ok(format!("Project {} started", id))
}

#[tauri::command]
pub async fn stop_project(id: i64) -> Result<String, String> {
    Ok(format!("Project {} stopped", id))
}
