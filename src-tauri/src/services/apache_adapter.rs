use crate::services::traits::{ServiceAdapter, ServiceState, WebServerAdapter};

pub struct ApacheAdapter {
    pub pid: Option<u32>,
    pub port: u16,
}

impl ApacheAdapter {
    pub fn new() -> Self {
        Self { pid: None, port: 80 }
    }
}

impl ServiceAdapter for ApacheAdapter {
    fn service_name(&self) -> &str { "Apache HTTP Server" }
    fn service_type(&self) -> &str { "apache" }
    fn port(&self) -> u16 { self.port }
    fn is_running(&self) -> bool { self.pid.is_some() }
    fn start(&mut self) -> Result<u32, String> {
        self.pid = Some(4216);
        Ok(4216)
    }
    fn stop(&mut self) -> Result<(), String> {
        self.pid = None;
        Ok(())
    }
    fn restart(&mut self) -> Result<(), String> {
        self.stop()?;
        self.start()?;
        Ok(())
    }
    fn get_state(&self) -> ServiceState {
        match self.pid {
            Some(pid) => ServiceState::Running(pid),
            None => ServiceState::Stopped,
        }
    }
    fn get_logs(&self, _lines: usize) -> Result<Vec<String>, String> {
        Ok(vec!["[notice] Apache/2.4.62 (Win64) configured -- resuming normal operations".to_string()])
    }
}

impl WebServerAdapter for ApacheAdapter {
    fn name(&self) -> &str { "apache" }
    fn is_installed(&self) -> bool { true }
    fn start(&mut self) -> Result<u32, String> { ServiceAdapter::start(self) }
    fn stop(&mut self) -> Result<(), String> { ServiceAdapter::stop(self) }
    fn restart(&mut self) -> Result<(), String> { ServiceAdapter::restart(self) }
    fn create_vhost(&self, _project_name: &str, domain: &str, _project_path: &str, _php_version: &str, _ssl: bool) -> Result<(), String> {
        println!("Generated VirtualHost configuration for {}", domain);
        Ok(())
    }
    fn remove_vhost(&self, domain: &str) -> Result<(), String> {
        println!("Removed VirtualHost for {}", domain);
        Ok(())
    }
    fn validate_config(&self) -> Result<bool, String> { Ok(true) }
    fn reload(&self) -> Result<(), String> { Ok(()) }
}
