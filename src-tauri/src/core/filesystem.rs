use std::path::{Path, PathBuf};

pub struct FilesystemManager {
    pub root_dir: PathBuf,
}

impl FilesystemManager {
    pub fn new(root: impl Into<PathBuf>) -> Self {
        Self {
            root_dir: root.into(),
        }
    }

    /// Initializes all required DevBox system directories
    pub fn initialize_structure(&self) -> Result<(), std::io::Error> {
        let dirs = [
            self.root_dir.join("app"),
            self.root_dir.join("bin"),
            self.root_dir.join("runtimes"),
            self.root_dir.join("runtimes").join("php"),
            self.root_dir.join("runtimes").join("apache"),
            self.root_dir.join("runtimes").join("nginx"),
            self.root_dir.join("runtimes").join("mysql"),
            self.root_dir.join("runtimes").join("redis"),
            self.root_dir.join("runtimes").join("cloudflared"),
            self.root_dir.join("data"),
            self.root_dir.join("config"),
            self.root_dir.join("logs"),
            self.root_dir.join("backups"),
            self.root_dir.join("cache"),
            self.root_dir.join("temp"),
            self.root_dir.join("ssl"),
            self.root_dir.join("ssl").join("ca"),
            self.root_dir.join("ssl").join("certs"),
        ];

        for d in &dirs {
            std::fs::create_dir_all(d)?;
        }

        Ok(())
    }

    /// Sanitizes target paths to prohibit directory traversal attacks (.. sequences)
    pub fn sanitize_path(base: &Path, user_path: &Path) -> Result<PathBuf, String> {
        let canonical_base = base.canonicalize().map_err(|e| e.to_string())?;
        let full = base.join(user_path);
        let canonical_full = full.canonicalize().map_err(|e| e.to_string())?;

        if canonical_full.starts_with(&canonical_base) {
            Ok(canonical_full)
        } else {
            Err("Directory traversal detected: access outside allowed base path is prohibited".to_string())
        }
    }
}
