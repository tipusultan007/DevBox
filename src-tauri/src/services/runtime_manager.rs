use serde::{Deserialize, Serialize};
use std::fs;
use std::path::{Path, PathBuf};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RuntimeManifest {
    pub name: String,
    pub version: String,
    pub display_name: Option<String>,
    pub platform: String,
    pub architecture: String,
    pub download: Option<ManifestDownload>,
    pub binary: String,
    pub cgi_binary: Option<String>,
    pub fastcgi_port: Option<u16>,
    pub extensions: Option<Vec<String>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ManifestDownload {
    pub url: String,
    pub sha256: String,
}

pub struct RuntimeManager {
    manifests_dir: PathBuf,
    runtimes_dir: PathBuf,
}

impl RuntimeManager {
    pub fn new(manifests_dir: impl Into<PathBuf>, runtimes_dir: impl Into<PathBuf>) -> Self {
        Self {
            manifests_dir: manifests_dir.into(),
            runtimes_dir: runtimes_dir.into(),
        }
    }

    /// Discovers all runtime manifests for a given type (e.g. "php")
    pub fn load_manifests(&self, runtime_type: &str) -> Vec<RuntimeManifest> {
        let type_dir = self.manifests_dir.join(runtime_type);
        let mut list = Vec::new();

        if let Ok(entries) = fs::read_dir(type_dir) {
            for entry in entries.flatten() {
                let path = entry.path();
                if path.extension().and_then(|s| s.to_str()) == Some("json") {
                    if let Ok(content) = fs::read_to_string(&path) {
                        if let Ok(manifest) = serde_json::from_str::<RuntimeManifest>(&content) {
                            list.push(manifest);
                        }
                    }
                }
            }
        }

        list.sort_by(|a, b| b.version.cmp(&a.version));
        list
    }

    /// Generates a complete php.ini file with common development extensions enabled
    pub fn generate_php_ini(
        &self,
        php_dir: &Path,
        extensions: &[String],
    ) -> Result<PathBuf, std::io::Error> {
        let ini_path = php_dir.join("php.ini");
        let ext_dir = php_dir.join("ext");

        let mut content = String::new();
        content.push_str("; DevBox Managed php.ini Configuration\n");
        content.push_str("[PHP]\n");
        content.push_str("engine = On\n");
        content.push_str("short_open_tag = Off\n");
        content.push_str("precision = 14\n");
        content.push_str("output_buffering = 4096\n");
        content.push_str("zlib.output_compression = Off\n");
        content.push_str("implicit_flush = Off\n");
        content.push_str("max_execution_time = 120\n");
        content.push_str("max_input_time = 60\n");
        content.push_str("memory_limit = 512M\n");
        content.push_str("error_reporting = E_ALL\n");
        content.push_str("display_errors = On\n");
        content.push_str("display_startup_errors = On\n");
        content.push_str("log_errors = On\n");
        content.push_str("post_max_size = 64M\n");
        content.push_str("upload_max_filesize = 64M\n");
        content.push_str("default_mimetype = \"text/html\"\n");
        content.push_str("default_charset = \"UTF-8\"\n\n");

        content.push_str(&format!("extension_dir = \"{}\"\n\n", ext_dir.display()));

        content.push_str("; Core Extensions\n");
        for ext in extensions {
            content.push_str(&format!("extension={}\n", ext));
        }

        content.push_str("\n[Date]\ndate.timezone = \"UTC\"\n");
        content.push_str("\n[curl]\ncurl.cainfo = \"C:\\DevBox\\ssl\\ca\\cacert.pem\"\n");
        content.push_str("\n[openssl]\nopenssl.cafile = \"C:\\DevBox\\ssl\\ca\\cacert.pem\"\n");

        fs::write(&ini_path, content)?;
        Ok(ini_path)
    }
}
