use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;

pub struct SslManager {
    ssl_dir: PathBuf,
}

impl SslManager {
    pub fn new(ssl_dir: impl Into<PathBuf>) -> Self {
        let p = ssl_dir.into();
        fs::create_dir_all(p.join("ca")).ok();
        fs::create_dir_all(p.join("certs")).ok();
        Self { ssl_dir: p }
    }

    pub fn ca_cert_path(&self) -> PathBuf {
        self.ssl_dir.join("ca").join("rootCA.crt")
    }

    pub fn ca_key_path(&self) -> PathBuf {
        self.ssl_dir.join("ca").join("rootCA.key")
    }

    /// Verifies if the DevBox Root CA files exist
    pub fn root_ca_exists(&self) -> bool {
        self.ca_cert_path().exists() && self.ca_key_path().exists()
    }

    /// Generates domain certificate paths
    pub fn get_domain_cert_paths(&self, domain: &str) -> (PathBuf, PathBuf) {
        let cert = self.ssl_dir.join("certs").join(format!("{}.crt", domain));
        let key = self.ssl_dir.join("certs").join(format!("{}.key", domain));
        (cert, key)
    }

    /// Installs Root CA into Windows LocalMachine Root certificate store using certutil
    #[cfg(windows)]
    pub fn trust_in_windows(&self) -> Result<String, String> {
        let ca_path = self.ca_cert_path();
        if !ca_path.exists() {
            return Err("Root CA certificate does not exist yet".to_string());
        }

        let output = Command::new("certutil")
            .args(&["-addstore", "-f", "ROOT", ca_path.to_str().unwrap()])
            .output()
            .map_err(|e| format!("Failed to execute certutil: {}", e))?;

        if output.status.success() {
            Ok("DevBox Root CA successfully registered in Windows Trusted Root Certification Authorities store".to_string())
        } else {
            let stderr = String::from_utf8_lossy(&output.stderr);
            Err(format!("certutil failed: {}", stderr))
        }
    }

    #[cfg(not(windows))]
    pub fn trust_in_windows(&self) -> Result<String, String> {
        Ok("Not running on Windows".to_string())
    }
}
