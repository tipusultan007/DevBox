use crate::models::TunnelItem;

#[tauri::command]
pub async fn list_tunnels() -> Result<Vec<TunnelItem>, String> {
    Ok(vec![
        TunnelItem {
            id: 1,
            project_id: 2,
            project_name: "My Shop".to_string(),
            provider: "cloudflare".to_string(),
            mode: "quick".to_string(),
            target_url: "http://localhost:80".to_string(),
            public_url: Some("https://myshop-preview-7389.trycloudflare.com".to_string()),
            status: "active".to_string(),
            pid: Some(7112),
            created_at: "2026-10-02 11:45:00".to_string(),
        }
    ])
}

#[tauri::command]
pub async fn start_quick_tunnel(project_id: i64, target_url: String) -> Result<TunnelItem, String> {
    // Generate random subdomain for quick tunnel
    let sub = format!("devbox-{:x}", chrono::Utc::now().timestamp_millis() % 0xFFFFF);
    let public_url = format!("https://{}.trycloudflare.com", sub);

    Ok(TunnelItem {
        id: chrono::Utc::now().timestamp_millis(),
        project_id,
        project_name: "Project".to_string(),
        provider: "cloudflare".to_string(),
        mode: "quick".to_string(),
        target_url,
        public_url: Some(public_url),
        status: "active".to_string(),
        pid: Some(8920),
        created_at: chrono::Local::now().format("%Y-%m-%d %H:%M:%S").to_string(),
    })
}

#[tauri::command]
pub async fn stop_tunnel(_id: i64) -> Result<(), String> {
    Ok(())
}
