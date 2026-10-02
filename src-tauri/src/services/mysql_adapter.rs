use crate::services::traits::{ServiceAdapter, ServiceState};

pub struct MySqlAdapter {
    pub pid: Option<u32>,
    pub port: u16,
}

impl MySqlAdapter {
    pub fn new() -> Self {
        Self { pid: None, port: 3306 }
    }
}

impl ServiceAdapter for MySqlAdapter {
    fn service_name(&self) -> &str { "MySQL Server" }
    fn service_type(&self) -> &str { "mysql" }
    fn port(&self) -> u16 { self.port }
    fn is_running(&self) -> bool { self.pid.is_some() }
    fn start(&mut self) -> Result<u32, String> {
        self.pid = Some(5128);
        Ok(5128)
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
        Ok(vec!["[Server] C:\\DevBox\\runtimes\\mysql\\bin\\mysqld.exe: ready for connections. Version: '8.4.4' socket: '' port: 3306".to_string()])
    }
}
