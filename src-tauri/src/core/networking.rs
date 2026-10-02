use std::net::TcpListener;

#[derive(Debug, Clone)]
pub struct PortCheckResult {
    pub port: u16,
    pub is_available: bool,
    pub occupying_process: Option<String>,
}

pub struct NetworkingManager;

impl NetworkingManager {
    /// Tests whether a TCP port is currently free to bind on 127.0.0.1
    pub fn is_port_available(port: u16) -> bool {
        match TcpListener::bind(("127.0.0.1", port)) {
            Ok(_) => true,
            Err(_) => false,
        }
    }

    /// Scans standard DevBox ports and checks for conflicts
    pub fn scan_devbox_ports() -> Vec<PortCheckResult> {
        let ports = [80, 443, 3306, 6379, 8080, 8025];
        ports
            .iter()
            .map(|&port| {
                let available = Self::is_port_available(port);
                let occupying = if !available {
                    if port == 80 {
                        Some("Possible IIS (W3SVC) or system service".to_string())
                    } else if port == 3306 {
                        Some("Existing MySQL service".to_string())
                    } else {
                        Some("Active process".to_string())
                    }
                } else {
                    None
                };

                PortCheckResult {
                    port,
                    is_available: available,
                    occupying_process: occupying,
                }
            })
            .collect()
    }
}
