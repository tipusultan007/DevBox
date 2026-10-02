use crate::services::traits::{ServiceAdapter, ServiceState};

pub struct RedisAdapter {
    pub pid: Option<u32>,
    pub port: u16,
}

impl RedisAdapter {
    pub fn new() -> Self {
        Self { pid: None, port: 6379 }
    }
}

impl ServiceAdapter for RedisAdapter {
    fn service_name(&self) -> &str { "Redis In-Memory Data Store" }
    fn service_type(&self) -> &str { "redis" }
    fn port(&self) -> u16 { self.port }
    fn is_running(&self) -> bool { self.pid.is_some() }
    fn start(&mut self) -> Result<u32, String> {
        self.pid = Some(6044);
        Ok(6044)
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
        Ok(vec!["* Ready to accept connections tcp".to_string()])
    }
}
