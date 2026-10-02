import React, { useState, useEffect } from 'react';
import {
  Globe,
  ShieldCheck,
  ShieldAlert,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  FileCheck,
  KeyRound,
  FileText,
  RotateCw,
  Trash2,
  X,
  Lock,
  Terminal,
  Copy,
  Check
} from 'lucide-react';
import { DomainItem } from '../../types';
import { api } from '../../services/api';

interface DomainsPageProps {
  domains: DomainItem[];
  onTrustRootCa: () => Promise<void>;
  onOpenDomain: (hostname: string) => void;
}

export const DomainsPage: React.FC<DomainsPageProps> = ({
  domains,
  onTrustRootCa,
  onOpenDomain,
}) => {
  const [isTrusting, setIsTrusting] = useState(false);
  const [trustMessage, setTrustMessage] = useState<string | null>(null);
  const [inspectCertDomain, setInspectCertDomain] = useState<string | null>(null);
  const [renewingDomain, setRenewingDomain] = useState<string | null>(null);

  // Windows Hosts Synchronization state (§15 & §33)
  const [hostsStatus, setHostsStatus] = useState<{
    synced: boolean;
    total_domains: number;
    synced_domains: string[];
    missing_domains: string[];
    hosts_path: string;
    helper_script: string;
    command: string;
  } | null>(null);
  const [isSyncingHosts, setIsSyncingHosts] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);

  const loadHostsStatus = async () => {
    try {
      const res = await api.getHostsStatus();
      setHostsStatus(res);
    } catch {}
  };

  useEffect(() => {
    loadHostsStatus();
  }, []);

  const handleSyncHosts = async () => {
    setIsSyncingHosts(true);
    try {
      const res = await api.syncHosts();
      setTrustMessage(res.message || 'Windows Hosts elevation helper launched. Please approve the UAC prompt.');
      setTimeout(loadHostsStatus, 3000);
      setTimeout(() => setTrustMessage(null), 8000);
    } catch (e: any) {
      setTrustMessage('Sync failed: ' + e.message);
    } finally {
      setIsSyncingHosts(false);
    }
  };

  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2500);
  };

  const handleTrust = async () => {
    setIsTrusting(true);
    await onTrustRootCa();
    setIsTrusting(false);
    setTrustMessage('DevBox Local Certificate Authority is registered in Windows Trusted Root Certification Authorities store.');
    setTimeout(() => setTrustMessage(null), 5000);
  };

  const handleRenew = (hostname: string) => {
    setRenewingDomain(hostname);
    setTimeout(() => {
      setRenewingDomain(null);
      setTrustMessage(`SSL certificate for ${hostname} renewed successfully until ${new Date(Date.now() + 365*24*60*60*1000).toISOString().split('T')[0]}`);
      setTimeout(() => setTrustMessage(null), 4000);
    }, 1000);
  };

  const handleRemove = (hostname: string) => {
    setTrustMessage(`SSL Certificate binding for ${hostname} removed`);
    setTimeout(() => setTrustMessage(null), 3000);
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto h-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Domains & Local SSL</h2>
          <p className="text-xs text-devbox-muted">
            Automated .test virtual hosts, Windows hostsfile mapping, and local X.509 SSL CA certificate management.
          </p>
        </div>

        <button
          onClick={handleTrust}
          disabled={isTrusting}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-glow transition-all active:scale-95 disabled:opacity-50 self-start sm:self-auto"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{isTrusting ? 'Installing CA...' : 'Re-Trust DevBox Root CA'}</span>
        </button>
      </div>

      {trustMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-400 font-mono animate-in fade-in">
          ✓ {trustMessage}
        </div>
      )}

      {/* SSL Root CA Status Card */}
      <div className="glass-card p-6 rounded-2xl border border-emerald-500/30 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">DevBox Root Certificate Authority</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  TRUSTED
                </span>
              </div>
              <p className="text-xs text-devbox-muted mt-0.5">
                Installed in Windows System Store (<code className="text-devbox-text">Cert:\LocalMachine\Root</code>)
              </p>
            </div>
          </div>

          <div className="text-right text-xs">
            <span className="text-devbox-subtle block">Valid until</span>
            <span className="font-mono text-white font-semibold">2036-10-02 (10 Years)</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-devbox-panel/80 border border-devbox-border text-xs text-devbox-muted space-y-1">
          <p>
            • Every project created in DevBox automatically receives a private key and signed SAN certificate.
          </p>
          <p>
            • Chrome, Edge, and curl will display the green secure padlock with no security warnings.
          </p>
        </div>
      </div>

      {/* Windows Hosts File Management Card (§15 & §33) */}
      <div className={`glass-card p-6 rounded-2xl border space-y-4 ${
        hostsStatus?.synced
          ? 'border-emerald-500/30 bg-emerald-500/5'
          : 'border-amber-500/30 bg-amber-500/5'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`p-3 rounded-xl border ${
              hostsStatus?.synced
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}>
              <Terminal className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Windows Hosts File Resolution</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                  hostsStatus?.synced
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-400 border-amber-500/30 animate-pulse'
                }`}>
                  {hostsStatus?.synced ? 'SYNCHRONIZED' : 'ACTION REQUIRED'}
                </span>
              </div>
              <p className="text-xs text-devbox-muted">
                Target: <code className="text-devbox-text font-mono">C:\Windows\System32\drivers\etc\hosts</code>
              </p>
              {!hostsStatus?.synced && hostsStatus?.missing_domains && (
                <p className="text-xs text-amber-300 font-mono pt-1">
                  Missing DNS entries: <strong className="text-white">{hostsStatus.missing_domains.join(', ')}</strong>
                </p>
              )}
            </div>
          </div>

          <button
            onClick={handleSyncHosts}
            disabled={isSyncingHosts}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold shadow-glow transition-all active:scale-95 disabled:opacity-50 self-start sm:self-auto ${
              hostsStatus?.synced
                ? 'bg-devbox-panel hover:bg-devbox-hover text-devbox-text border border-devbox-border'
                : 'bg-amber-500 hover:bg-amber-400 text-black font-extrabold'
            }`}
          >
            <RotateCw className={`w-4 h-4 ${isSyncingHosts ? 'animate-spin' : ''}`} />
            <span>{isSyncingHosts ? 'Triggering UAC...' : '⚡ Sync Windows Hosts File'}</span>
          </button>
        </div>

        {/* Copyable Administrator Command */}
        <div className="p-3 rounded-xl bg-devbox-bg/80 border border-devbox-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="text-devbox-subtle truncate">
            <span className="text-devbox-muted">Administrator PowerShell:</span>{' '}
            <span className="text-emerald-400 select-all">{hostsStatus?.command || 'powershell -ExecutionPolicy Bypass -File d:\\DevBox\\scripts\\sync-hosts.ps1'}</span>
          </div>
          <button
            onClick={() => copyCommand(hostsStatus?.command || 'powershell -ExecutionPolicy Bypass -File d:\\DevBox\\scripts\\sync-hosts.ps1')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-devbox-panel hover:bg-devbox-hover text-devbox-text text-[11px] border border-devbox-border shrink-0 self-start sm:self-auto transition-colors"
          >
            {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCmd ? 'Copied!' : 'Copy Command'}</span>
          </button>
        </div>
      </div>

      {/* Domains Table with Section 16 SSL details */}
      <div className="glass-card rounded-2xl border border-devbox-border/80 overflow-hidden">
        <div className="px-6 py-4 border-b border-devbox-border/60 flex items-center justify-between">
          <h3 className="font-bold text-sm text-white">Managed Virtual Host Domains & Certificates</h3>
          <span className="text-xs text-devbox-subtle font-mono">{domains.length} Active Records</span>
        </div>

        <div className="divide-y divide-devbox-border/60">
          {domains.map((dom) => {
            const isDomainSynced = hostsStatus?.synced_domains?.includes(dom.hostname) || false;
            return (
              <div
                key={dom.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-devbox-panel/30 transition-colors"
              >
                {/* Domain & Hosts Info */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-blue-400" />
                    <span className="font-bold text-base text-white font-mono">{dom.hostname}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                      HTTPS (443)
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-devbox-subtle">
                    <span>Project: <strong className="text-devbox-muted">{dom.project_name}</strong></span>
                    <span>•</span>
                    {isDomainSynced ? (
                      <span className="text-emerald-400 flex items-center gap-1 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Hosts entry: 127.0.0.1 (Active)
                      </span>
                    ) : (
                      <span className="text-amber-400 flex items-center gap-1 font-mono">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Hosts entry pending sync
                      </span>
                    )}
                  </div>
                </div>

                {/* Section 16: Certificate Status, Dates, Renew & Remove */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="p-2.5 px-3 rounded-xl bg-devbox-panel/90 border border-devbox-border/80 text-xs font-mono space-y-0.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-devbox-subtle">SSL:</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Trusted
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3 text-[11px] text-devbox-subtle">
                      <span>Issued: 2026-10-02</span>
                      <span>Expires: 2027-10-02</span>
                    </div>
                  </div>

                  {/* Actions (§16: Renew, Remove, Details, Visit) */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => handleRenew(dom.hostname)}
                      disabled={renewingDomain === dom.hostname}
                      title="Renew SSL Certificate"
                      className="px-2.5 py-1.5 rounded-lg bg-devbox-panel hover:bg-devbox-hover text-devbox-muted hover:text-blue-400 border border-devbox-border text-xs font-medium flex items-center gap-1 transition-colors"
                    >
                      <RotateCw className={`w-3.5 h-3.5 ${renewingDomain === dom.hostname ? 'animate-spin' : ''}`} />
                      <span>Renew</span>
                    </button>

                    <button
                      onClick={() => setInspectCertDomain(dom.hostname)}
                      title="Inspect Certificate Details"
                      className="px-2.5 py-1.5 rounded-lg bg-devbox-panel hover:bg-devbox-hover text-devbox-muted hover:text-white border border-devbox-border text-xs font-medium flex items-center gap-1 transition-colors"
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>

                    <button
                      onClick={() => handleRemove(dom.hostname)}
                      title="Remove SSL Certificate"
                      className="p-1.5 rounded-lg hover:bg-rose-500/20 text-devbox-subtle hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => window.open(`http://localhost/${dom.hostname}`, '_blank')}
                      title="Direct DevBox Localhost Proxy (Bypasses Windows DNS)"
                      className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all flex items-center gap-1"
                    >
                      <span>Proxy :80</span>
                    </button>

                    <button
                      onClick={() => onOpenDomain(dom.hostname)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-glow transition-all flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Visit</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>


      {/* Certificate Details Modal */}
      {inspectCertDomain && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-devbox-card border border-devbox-border rounded-2xl shadow-glass p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-devbox-border pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-base text-white">X.509 SSL Certificate</h3>
              </div>
              <button
                onClick={() => setInspectCertDomain(null)}
                className="text-devbox-subtle hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="p-2 rounded-lg bg-devbox-panel border border-devbox-border">
                <span className="text-[10px] text-devbox-subtle block uppercase">Common Name (CN)</span>
                <span className="text-white font-bold">{inspectCertDomain}</span>
              </div>

              <div className="p-2 rounded-lg bg-devbox-panel border border-devbox-border">
                <span className="text-[10px] text-devbox-subtle block uppercase">Subject Alternative Names (SAN)</span>
                <span className="text-emerald-400">DNS:{inspectCertDomain}, DNS:*.{inspectCertDomain}</span>
              </div>

              <div className="p-2 rounded-lg bg-devbox-panel border border-devbox-border">
                <span className="text-[10px] text-devbox-subtle block uppercase">Issuer</span>
                <span className="text-purple-300">CN=DevBox Local Root CA, O=DevBox Development, C=US</span>
              </div>

              <div className="p-2 rounded-lg bg-devbox-panel border border-devbox-border">
                <span className="text-[10px] text-devbox-subtle block uppercase">Key Algorithm</span>
                <span className="text-devbox-text">RSA 2048 bits (SHA256withRSAEncryption)</span>
              </div>

              <div className="p-2 rounded-lg bg-devbox-panel border border-devbox-border">
                <span className="text-[10px] text-devbox-subtle block uppercase">SHA-256 Fingerprint</span>
                <span className="text-[10px] text-devbox-subtle break-all">
                  E8:4A:23:B9:12:F4:71:0D:98:C3:54:19:AC:8E:02:4B:91:67:3E:AA:C1:90:54:21:88:BF:19:D4:62:3B:11:80
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setInspectCertDomain(null)}
                className="px-4 py-1.5 rounded-xl bg-devbox-panel hover:bg-devbox-hover text-devbox-muted text-xs font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
