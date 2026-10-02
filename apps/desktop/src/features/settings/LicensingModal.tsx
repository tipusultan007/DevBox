import React, { useState } from 'react';
import { Award, Check, Sparkles, X, Shield, Key } from 'lucide-react';

interface LicensingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LicensingModal: React.FC<LicensingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activePlan, setActivePlan] = useState<'free' | 'pro' | 'team'>('pro');
  const [licenseKey, setLicenseKey] = useState('DEVBOX-PRO-8924-X901');
  const [activated, setActivated] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl bg-devbox-card border border-devbox-border rounded-2xl shadow-glass flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-devbox-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">DevBox Licensing & Editions</h3>
              <p className="text-[11px] text-devbox-subtle">
                Currently activated as <strong className="text-amber-400 uppercase">{activePlan} Edition</strong>
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
        <div className="p-6 space-y-6">
          {/* Plan Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Free */}
            <div className="p-4 rounded-xl bg-devbox-panel/70 border border-devbox-border space-y-3">
              <div>
                <h4 className="font-bold text-sm text-white">Community</h4>
                <span className="text-xs text-devbox-subtle">Free Forever</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-devbox-muted">
                <li>✓ Multi-PHP 7.4 - 8.5</li>
                <li>✓ Apache & MySQL</li>
                <li>✓ .test Virtual Hosts</li>
                <li>✓ Basic Quick Tunnel</li>
              </ul>
            </div>

            {/* Pro */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/40 space-y-3 relative shadow-glow">
              <span className="absolute -top-2 right-3 px-2 py-0.2 rounded-full text-[9px] font-bold bg-amber-400 text-black uppercase">
                Active
              </span>
              <div>
                <h4 className="font-bold text-sm text-white">DevBox Pro</h4>
                <span className="text-xs text-amber-400 font-semibold">Single Developer</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-devbox-muted">
                <li>✓ Everything in Community</li>
                <li>✓ Persistent Cloudflare Tunnels</li>
                <li>✓ Environment Profiles (§41)</li>
                <li>✓ 1-Click Project Snapshots</li>
                <li>✓ AI Troubleshooting Engine</li>
              </ul>
            </div>

            {/* Team */}
            <div className="p-4 rounded-xl bg-devbox-panel/70 border border-devbox-border space-y-3">
              <div>
                <h4 className="font-bold text-sm text-white">DevBox Team</h4>
                <span className="text-xs text-devbox-subtle">Agencies & Teams</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-devbox-muted">
                <li>✓ Everything in Pro</li>
                <li>✓ Environment Sharing Bundles</li>
                <li>✓ Team Templates</li>
                <li>✓ Centralized Cloud Config</li>
              </ul>
            </div>
          </div>

          {/* Key Input */}
          <div className="p-4 rounded-xl bg-devbox-panel border border-devbox-border space-y-2">
            <label className="block text-xs font-semibold text-devbox-muted uppercase tracking-wider">
              License Key
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-devbox-subtle" />
                <input
                  type="text"
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-devbox-card border border-devbox-border text-xs font-mono text-devbox-text focus:outline-none focus:border-amber-400"
                />
              </div>
              <button
                onClick={() => setActivated(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all shadow-glow"
              >
                Activate Key
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-devbox-border flex items-center justify-between bg-devbox-card/90">
          <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" />
            License valid indefinitely
          </span>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-devbox-panel hover:bg-devbox-hover text-white text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
