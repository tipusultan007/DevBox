import React, { useState } from 'react';
import { Share2, X, Cloud, Lock, Clock, Copy, Check, ExternalLink, Webhook, ShieldCheck } from 'lucide-react';
import { Project } from '../../types';

interface ShareProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onGenerateTunnel: (projectId: number) => Promise<any>;
  activeTunnel?: any | null;
}

export const ShareProjectModal: React.FC<ShareProjectModalProps> = ({
  isOpen,
  onClose,
  project,
  onGenerateTunnel,
  activeTunnel,
}) => {
  const [duration, setDuration] = useState<'1h' | '4h' | 'permanent'>('permanent');
  const [accessMode, setAccessMode] = useState<'public' | 'password'>('password');
  const [passwordPin, setPasswordPin] = useState('demo-9824');
  const [isWebhookMode, setIsWebhookMode] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(activeTunnel?.public_url || null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tunnelError, setTunnelError] = useState<string | null>(null);

  React.useEffect(() => {
    if (activeTunnel?.public_url) {
      setGeneratedUrl(activeTunnel.public_url);
    } else {
      setGeneratedUrl(null);
    }
    setTunnelError(null);
  }, [project, activeTunnel, isOpen]);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!project) return;
    setIsGenerating(true);
    setTunnelError(null);
    try {
      const res = await onGenerateTunnel(project.id);
      if (res && res.public_url) {
        setGeneratedUrl(res.public_url);
      }
    } catch (err: any) {
      console.error('Tunnel launch error:', err);
      setTunnelError(err?.message || 'Failed to start Cloudflare Tunnel');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (generatedUrl) {
      navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-devbox-card border border-devbox-border rounded-2xl shadow-glass flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-devbox-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Share Project</h3>
              <p className="text-[11px] text-devbox-subtle font-mono">
                {project?.name || 'Project'} • {project?.domain || 'myshop.test'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-devbox-subtle hover:text-white hover:bg-devbox-hover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Mode Switcher */}
          <div className="flex rounded-xl bg-devbox-panel p-1 border border-devbox-border">
            <button
              onClick={() => setIsWebhookMode(false)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                !isWebhookMode ? 'bg-blue-600 text-white shadow-sm' : 'text-devbox-muted hover:text-white'
              }`}
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>Client Preview</span>
            </button>
            <button
              onClick={() => setIsWebhookMode(true)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                isWebhookMode ? 'bg-emerald-600 text-white shadow-sm' : 'text-devbox-muted hover:text-white'
              }`}
            >
              <Webhook className="w-3.5 h-3.5" />
              <span>Webhook Mode</span>
            </button>
          </div>

          {tunnelError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono animate-in fade-in">
              ⚠ {tunnelError}
            </div>
          )}

          {isWebhookMode ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
              <h4 className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                <Webhook className="w-3.5 h-3.5" />
                <span>One-Click Webhook Receiver</span>
              </h4>
              <p className="text-xs text-devbox-muted leading-relaxed">
                Creates an ultra-low latency trycloudflare.com tunnel optimized for Stripe, PayPal, Shopify, WhatsApp, and GitHub webhook event streams.
              </p>
            </div>
          ) : (
            <>
              {/* Duration */}
              <div>
                <label className="block text-xs font-semibold text-devbox-muted uppercase tracking-wider mb-2">
                  Preview Duration
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: '1h', label: '1 Hour' },
                    { id: '4h', label: '4 Hours' },
                    { id: 'permanent', label: 'Until Stopped' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setDuration(item.id as any)}
                      className={`p-2.5 rounded-xl text-center border text-xs font-semibold transition-colors ${
                        duration === item.id
                          ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-bold'
                          : 'bg-devbox-panel border-devbox-border text-devbox-muted hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Access Protection */}
              <div>
                <label className="block text-xs font-semibold text-devbox-muted uppercase tracking-wider mb-2">
                  Access Security
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setAccessMode('public')}
                    className={`p-3 rounded-xl border text-left transition-colors ${
                      accessMode === 'public'
                        ? 'bg-blue-600/20 border-blue-500 text-white'
                        : 'bg-devbox-panel border-devbox-border text-devbox-muted'
                    }`}
                  >
                    <span className="font-bold text-xs block">Public Access</span>
                    <span className="text-[10px] text-devbox-subtle">Anyone with URL can view</span>
                  </button>

                  <button
                    onClick={() => setAccessMode('password')}
                    className={`p-3 rounded-xl border text-left transition-colors ${
                      accessMode === 'password'
                        ? 'bg-blue-600/20 border-blue-500 text-white'
                        : 'bg-devbox-panel border-devbox-border text-devbox-muted'
                    }`}
                  >
                    <span className="font-bold text-xs block">Password Protected</span>
                    <span className="text-[10px] text-devbox-subtle">Requires security PIN</span>
                  </button>
                </div>

                {accessMode === 'password' && (
                  <div className="mt-2.5 flex items-center justify-between p-2.5 rounded-xl bg-devbox-panel border border-devbox-border text-xs">
                    <span className="text-devbox-subtle">Client Passcode:</span>
                    <span className="font-mono text-emerald-400 font-bold tracking-wider">{passwordPin}</span>
                  </div>
                )}
              </div>
            </>
          )}

          {generatedUrl && (
            <div className="p-3.5 rounded-xl bg-blue-600/10 border border-blue-500/30 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-blue-400 uppercase font-bold tracking-wider block">Live Cloudflare Tunnel:</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active Online
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <a
                  href={generatedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono text-emerald-400 hover:underline flex items-center gap-1 truncate"
                >
                  {generatedUrl}
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 rounded-lg bg-devbox-card hover:bg-devbox-hover text-white text-xs flex items-center gap-1 border border-devbox-border shrink-0"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* QR Code for Mobile Device Testing (Features.md §29) */}
              <div className="pt-2 border-t border-blue-500/20 flex items-center gap-3">
                <div className="w-16 h-16 bg-white p-1 rounded-lg shrink-0 flex items-center justify-center">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(generatedUrl)}`}
                    alt="Scan with phone"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-xs space-y-0.5">
                  <span className="font-bold text-white block">Mobile Device Preview</span>
                  <p className="text-[11px] text-devbox-subtle leading-tight">
                    Scan with your iPhone or Android camera to test this project on mobile cellular data.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-devbox-border flex items-center justify-between bg-devbox-card/90">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-devbox-panel hover:bg-devbox-hover text-devbox-muted text-xs font-semibold transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-glow transition-all active:scale-95 disabled:opacity-50"
          >
            <Cloud className="w-4 h-4" />
            <span>{isGenerating ? 'Deploying Tunnel...' : 'Generate Preview'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
