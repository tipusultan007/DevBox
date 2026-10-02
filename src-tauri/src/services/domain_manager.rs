use std::fs;
use std::path::{Path, PathBuf};

pub struct DomainManager {
    hosts_path: PathBuf,
}

impl DomainManager {
    const BEGIN_MARKER: &'static str = "# BEGIN DEVBOX MANAGED HOSTS";
    const END_MARKER: &'static str = "# END DEVBOX MANAGED HOSTS";

    pub fn new(hosts_path: Option<PathBuf>) -> Self {
        let p = hosts_path.unwrap_or_else(|| {
            PathBuf::from(r"C:\Windows\System32\drivers\etc\hosts")
        });
        Self { hosts_path: p }
    }

    /// Reads currently managed DevBox host entries
    pub fn get_managed_domains(&self) -> Result<Vec<String>, String> {
        let content = fs::read_to_string(&self.hosts_path)
            .map_err(|e| format!("Failed to read hosts file: {}", e))?;

        let mut list = Vec::new();
        let mut in_block = false;

        for line in content.lines() {
            let trimmed = line.trim();
            if trimmed == Self::BEGIN_MARKER {
                in_block = true;
                continue;
            }
            if trimmed == Self::END_MARKER {
                in_block = false;
                break;
            }
            if in_block && !trimmed.is_empty() && !trimmed.starts_with('#') {
                let parts: Vec<&str> = trimmed.split_whitespace().collect();
                if parts.len() >= 2 {
                    list.push(parts[1].to_string());
                }
            }
        }

        Ok(list)
    }

    /// Syncs list of active project domains into the bounded hosts file section
    pub fn sync_domains(&self, domains: &[String]) -> Result<(), String> {
        let existing = fs::read_to_string(&self.hosts_path).unwrap_or_default();

        let mut clean_lines = Vec::new();
        let mut in_block = false;

        for line in existing.lines() {
            let trimmed = line.trim();
            if trimmed == Self::BEGIN_MARKER {
                in_block = true;
                continue;
            }
            if trimmed == Self::END_MARKER {
                in_block = false;
                continue;
            }
            if !in_block {
                clean_lines.push(line.to_string());
            }
        }

        let mut output = clean_lines.join("\r\n");
        if !output.is_empty() && !output.ends_with("\r\n") {
            output.push_str("\r\n");
        }

        // Append managed block
        output.push_str(Self::BEGIN_MARKER);
        output.push_str("\r\n");
        for dom in domains {
            output.push_str(&format!("127.0.0.1  {}\r\n", dom));
        }
        output.push_str(Self::END_MARKER);
        output.push_str("\r\n");

        fs::write(&self.hosts_path, output)
            .map_err(|e| format!("Failed to update hosts file (run as administrator if required): {}", e))?;

        Ok(())
    }
}
