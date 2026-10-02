use std::path::{Path, PathBuf};

pub struct TunnelManager {
    binary_path: PathBuf,
}

impl TunnelManager {
    // Prohibited ports from public internet exposure
    const BLOCKED_PORTS: &'static [u16] = &[3306, 6379, 8025];

    pub fn new(binary_path: impl Into<PathBuf>) -> Self {
        Self {
            binary_path: binary_path.into(),
        }
    }

    /// Validates that target port is safe to expose through Cloudflare Tunnel
    pub fn validate_target_safety(port: u16) -> Result<(), String> {
        if Self::BLOCKED_PORTS.contains(&port) {
            Err(format!(
                "Security policy violation: Exposing database/internal port {} is prohibited.",
                port
            ))
        } else {
            Ok(())
        }
    }

    /// Generates Cloudflare Quick Tunnel command arguments
    pub fn build_quick_tunnel_args(target_url: &str) -> Vec<String> {
        vec![
            "tunnel".to_string(),
            "--url".to_string(),
            target_url.to_string(),
            "--no-autoupdate".to_string(),
        ]
    }
}
