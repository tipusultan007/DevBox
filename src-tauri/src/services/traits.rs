// DevBox Common Interfaces for Services and Web Servers

#[derive(Debug, Clone, PartialEq)]
pub enum ServiceState {
    Stopped,
    Starting,
    Running(u32), // PID
    Stopping,
    Error(String),
}

pub trait ServiceAdapter: Send + Sync {
    fn service_name(&self) -> &str;
    fn service_type(&self) -> &str;
    fn port(&self) -> u16;
    fn is_running(&self) -> bool;
    fn start(&mut self) -> Result<u32, String>;
    fn stop(&mut self) -> Result<(), String>;
    fn restart(&mut self) -> Result<(), String>;
    fn get_state(&self) -> ServiceState;
    fn get_logs(&self, lines: usize) -> Result<Vec<String>, String>;
}

pub trait WebServerAdapter: Send + Sync {
    fn name(&self) -> &str;
    fn is_installed(&self) -> bool;
    fn start(&mut self) -> Result<u32, String>;
    fn stop(&mut self) -> Result<(), String>;
    fn restart(&mut self) -> Result<(), String>;
    fn create_vhost(&self, project_name: &str, domain: &str, project_path: &str, php_version: &str, ssl: bool) -> Result<(), String>;
    fn remove_vhost(&self, domain: &str) -> Result<(), String>;
    fn validate_config(&self) -> Result<bool, String>;
    fn reload(&self) -> Result<(), String>;
}
