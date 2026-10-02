use std::path::Path;

pub struct SecurityManager;

impl SecurityManager {
    const PERMITTED_EXECUTABLES: &'static [&'static str] = &[
        "php.exe",
        "php-cgi.exe",
        "httpd.exe",
        "nginx.exe",
        "mysqld.exe",
        "mysql.exe",
        "mysqldump.exe",
        "mysqladmin.exe",
        "redis-server.exe",
        "redis-cli.exe",
        "cloudflared.exe",
        "mailpit.exe",
    ];

    /// Verifies that an executable filename belongs to the verified DevBox whitelist
    pub fn is_executable_permitted(executable: &Path) -> bool {
        if let Some(file_name) = executable.file_name().and_then(|n| n.to_str()) {
            Self::PERMITTED_EXECUTABLES.contains(&file_name.to_lowercase().as_str())
        } else {
            false
        }
    }

    /// Checks if current process is running with elevated Administrator privileges on Windows
    #[cfg(windows)]
    pub fn is_elevated() -> bool {
        // Simple check via Windows token elevation or shell command test
        std::process::Command::new("net")
            .arg("session")
            .stdout(std::process::Stdio::null())
            .stderr(std::process::Stdio::null())
            .status()
            .map(|s| s.success())
            .unwrap_or(false)
    }

    #[cfg(not(windows))]
    pub fn is_elevated() -> bool {
        false
    }
}
