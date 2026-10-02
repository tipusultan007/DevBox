use crate::models::Runtime;

#[tauri::command]
pub async fn list_runtimes() -> Result<Vec<Runtime>, String> {
    Ok(vec![
        Runtime {
            id: 1,
            runtime_type: "php".to_string(),
            name: "PHP 8.5 (Nightly)".to_string(),
            version: "8.5.0-dev".to_string(),
            architecture: "x64".to_string(),
            install_path: "C:\\DevBox\\runtimes\\php\\8.5".to_string(),
            is_installed: true,
            is_default: false,
        },
        Runtime {
            id: 2,
            runtime_type: "php".to_string(),
            name: "PHP 8.4".to_string(),
            version: "8.4.4".to_string(),
            architecture: "x64".to_string(),
            install_path: "C:\\DevBox\\runtimes\\php\\8.4".to_string(),
            is_installed: true,
            is_default: false,
        },
        Runtime {
            id: 3,
            runtime_type: "php".to_string(),
            name: "PHP 8.3 (LTS Recommended)".to_string(),
            version: "8.3.17".to_string(),
            architecture: "x64".to_string(),
            install_path: "C:\\DevBox\\runtimes\\php\\8.3".to_string(),
            is_installed: true,
            is_default: true,
        },
        Runtime {
            id: 4,
            runtime_type: "php".to_string(),
            name: "PHP 8.2".to_string(),
            version: "8.2.27".to_string(),
            architecture: "x64".to_string(),
            install_path: "C:\\DevBox\\runtimes\\php\\8.2".to_string(),
            is_installed: false,
            is_default: false,
        },
        Runtime {
            id: 5,
            runtime_type: "php".to_string(),
            name: "PHP 8.1".to_string(),
            version: "8.1.31".to_string(),
            architecture: "x64".to_string(),
            install_path: "C:\\DevBox\\runtimes\\php\\8.1".to_string(),
            is_installed: true,
            is_default: false,
        },
        Runtime {
            id: 6,
            runtime_type: "php".to_string(),
            name: "PHP 7.4 (Legacy)".to_string(),
            version: "7.4.33".to_string(),
            architecture: "x64".to_string(),
            install_path: "C:\\DevBox\\runtimes\\php\\7.4".to_string(),
            is_installed: true,
            is_default: false,
        },
    ])
}

#[tauri::command]
pub async fn install_runtime(runtime_type: String, version: String) -> Result<String, String> {
    Ok(format!("Successfully initiated install for {} {}", runtime_type, version))
}

#[tauri::command]
pub async fn set_active_cli_php(version: String) -> Result<String, String> {
    Ok(format!("Global CLI PHP set to {}", version))
}
