pub mod commands;
pub mod core;
pub mod services;
pub mod models;

use tauri::Manager;

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                let window = app.get_webview_window("main");
                if let Some(w) = window {
                    w.open_devtools();
                }
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            // Project commands
            commands::project::list_projects,
            commands::project::get_project,
            commands::project::create_project,
            commands::project::delete_project,
            commands::project::start_project,
            commands::project::stop_project,
            // Runtime commands
            commands::runtime::list_runtimes,
            commands::runtime::install_runtime,
            commands::runtime::set_active_cli_php,
            // Service commands
            commands::service::list_services,
            commands::service::start_service,
            commands::service::stop_service,
            commands::service::restart_service,
            commands::service::get_service_logs,
            // Database commands
            commands::database::list_databases,
            commands::database::create_database,
            commands::database::delete_database,
            commands::database::backup_database,
            // Domain & SSL commands
            commands::domain::list_domains,
            commands::domain::create_domain,
            commands::ssl::get_ssl_status,
            commands::ssl::trust_root_ca,
            // Tunnel commands
            commands::tunnel::start_quick_tunnel,
            commands::tunnel::stop_tunnel,
            commands::tunnel::list_tunnels,
            // Diagnostic commands
            commands::diagnostic::run_diagnostics,
            commands::diagnostic::resolve_diagnostic_issue,
            // System commands
            commands::system::get_system_info,
            commands::system::get_paths,
        ])
        .run(tauri::generate_context!())
        .expect("error while running DevBox desktop application");
}
