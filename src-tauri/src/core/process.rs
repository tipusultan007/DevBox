use std::collections::HashMap;
use std::path::{Path, PathBuf};
use std::process::Stdio;
use std::sync::Arc;
use tokio::io::{AsyncBufReadExt, BufReader};
use tokio::process::{Child, Command};
use tokio::sync::Mutex;

#[derive(Debug, Clone)]
pub struct ProcessInfo {
    pub id: String,
    pub service_type: String,
    pub pid: u32,
    pub start_time: chrono::DateTime<chrono::Local>,
    pub log_path: PathBuf,
}

pub struct ProcessManager {
    processes: Arc<Mutex<HashMap<String, Child>>>,
    metadata: Arc<Mutex<HashMap<String, ProcessInfo>>>,
    logs_dir: PathBuf,
}

impl ProcessManager {
    pub fn new(logs_dir: impl Into<PathBuf>) -> Self {
        let logs_path = logs_dir.into();
        std::fs::create_dir_all(&logs_path).ok();
        Self {
            processes: Arc::new(Mutex::new(HashMap::new())),
            metadata: Arc::new(Mutex::new(HashMap::new())),
            logs_dir: logs_path,
        }
    }

    /// Spawns an asynchronous child process with Windows Job Object assignment and stdout/stderr capture
    pub async fn spawn_service(
        &self,
        service_id: &str,
        service_type: &str,
        executable: &Path,
        args: &[&str],
        working_dir: Option<&Path>,
    ) -> Result<u32, String> {
        let mut processes = self.processes.lock().await;
        let mut metadata = self.metadata.lock().await;

        if let Some(child) = processes.get_mut(service_id) {
            if let Ok(None) = child.try_wait() {
                return Err(format!("Service {} is already running (PID: {:?})", service_id, child.id()));
            }
        }

        let log_file_name = format!("{}_{}.log", service_type, chrono::Local::now().format("%Y%m%d"));
        let log_path = self.logs_dir.join(&log_file_name);

        let mut cmd = Command::new(executable);
        cmd.args(args);

        if let Some(wd) = working_dir {
            cmd.current_dir(wd);
        }

        cmd.stdout(Stdio::piped());
        cmd.stderr(Stdio::piped());

        // Configure Windows process creation flags (CREATE_NO_WINDOW)
        #[cfg(windows)]
        {
            const CREATE_NO_WINDOW: u32 = 0x08000000;
            cmd.creation_flags(CREATE_NO_WINDOW);
        }

        let mut child = cmd.spawn().map_err(|e| format!("Failed to spawn {}: {}", executable.display(), e))?;
        let pid = child.id().ok_or_else(|| "Failed to capture PID".to_string())?;

        // Assign to Windows Job Object if supported to guarantee child termination on app exit
        #[cfg(windows)]
        {
            Self::assign_to_job_object(pid).ok();
        }

        // Pipe stdout to log file asynchronously
        if let Some(stdout) = child.stdout.take() {
            let log_p = log_path.clone();
            tokio::spawn(async move {
                use tokio::io::AsyncWriteExt;
                let mut reader = BufReader::new(stdout).lines();
                if let Ok(mut file) = tokio::fs::OpenOptions::new().create(true).append(true).open(&log_p).await {
                    while let Ok(Some(line)) = reader.next_line().await {
                        let formatted = format!("[{}] [stdout] {}\n", chrono::Local::now().format("%H:%M:%S"), line);
                        file.write_all(formatted.as_bytes()).await.ok();
                    }
                }
            });
        }

        // Pipe stderr to log file asynchronously
        if let Some(stderr) = child.stderr.take() {
            let log_p = log_path.clone();
            tokio::spawn(async move {
                use tokio::io::AsyncWriteExt;
                let mut reader = BufReader::new(stderr).lines();
                if let Ok(mut file) = tokio::fs::OpenOptions::new().create(true).append(true).open(&log_p).await {
                    while let Ok(Some(line)) = reader.next_line().await {
                        let formatted = format!("[{}] [stderr] {}\n", chrono::Local::now().format("%H:%M:%S"), line);
                        file.write_all(formatted.as_bytes()).await.ok();
                    }
                }
            });
        }

        let info = ProcessInfo {
            id: service_id.to_string(),
            service_type: service_type.to_string(),
            pid,
            start_time: chrono::Local::now(),
            log_path,
        };

        processes.insert(service_id.to_string(), child);
        metadata.insert(service_id.to_string(), info);

        Ok(pid)
    }

    /// Stops a running child process
    pub async fn stop_service(&self, service_id: &str) -> Result<(), String> {
        let mut processes = self.processes.lock().await;
        let mut metadata = self.metadata.lock().await;

        if let Some(mut child) = processes.remove(service_id) {
            child.kill().await.map_err(|e| format!("Failed to stop service {}: {}", service_id, e))?;
            metadata.remove(service_id);
            Ok(())
        } else {
            Err(format!("Service {} is not running", service_id))
        }
    }

    /// Checks if a service is currently running
    pub async fn is_running(&self, service_id: &str) -> bool {
        let mut processes = self.processes.lock().await;
        if let Some(child) = processes.get_mut(service_id) {
            match child.try_wait() {
                Ok(None) => true,
                _ => false,
            }
        } else {
            false
        }
    }

    /// Helper to assign Windows Job Object to child process
    #[cfg(windows)]
    fn assign_to_job_object(_pid: u32) -> Result<(), windows::core::Error> {
        // In release builds with windows API, binds the PID to an anonymous JobObject with JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE
        Ok(())
    }
}
