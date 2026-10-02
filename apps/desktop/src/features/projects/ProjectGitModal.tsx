import React, { useState, useEffect } from 'react';
import {
  GitBranch,
  GitCommit,
  GitPullRequest,
  Upload,
  Download,
  RotateCw,
  Terminal,
  Check,
  AlertCircle,
  X,
  Plus,
  FileCode,
  ShieldCheck
} from 'lucide-react';
import { Project } from '../../types';

interface ProjectGitModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onOpenTerminal?: (project: Project) => void;
}

export const ProjectGitModal: React.FC<ProjectGitModalProps> = ({
  isOpen,
  onClose,
  project,
  onOpenTerminal,
}) => {
  const [gitStatus, setGitStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [commitMessage, setCommitMessage] = useState('');
  const [newBranchName, setNewBranchName] = useState('');
  const [showNewBranchInput, setShowNewBranchInput] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const fetchStatus = async () => {
    if (!project) return;
    setIsLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:1421/api/git/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: project.path || 'd:\\DevBox' }),
      });
      if (res.ok) {
        const data = await res.json();
        setGitStatus(data);
      }
    } catch (err) {
      console.error('Git status query failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && project) {
      fetchStatus();
    }
  }, [isOpen, project]);

  if (!isOpen || !project) return null;

  const handlePull = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:1421/api/git/pull', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: project.path }),
      });
      const data = await res.json();
      setNotice(data.message || 'Pulled changes successfully.');
      await fetchStatus();
    } catch {}
    setIsLoading(false);
    setTimeout(() => setNotice(null), 3500);
  };

  const handlePush = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:1421/api/git/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: project.path }),
      });
      const data = await res.json();
      setNotice(data.message || 'Branch pushed to origin.');
      await fetchStatus();
    } catch {}
    setIsLoading(false);
    setTimeout(() => setNotice(null), 3500);
  };

  const handleCommit = async () => {
    if (!commitMessage.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:1421/api/git/commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: project.path, message: commitMessage.trim() }),
      });
      const data = await res.json();
      setNotice(data.message || 'Commit created.');
      setCommitMessage('');
      await fetchStatus();
    } catch {}
    setIsLoading(false);
    setTimeout(() => setNotice(null), 3500);
  };

  const handleCreateBranch = async () => {
    if (!newBranchName.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:1421/api/git/branch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: project.path, branch: newBranchName.trim(), create: true }),
      });
      const data = await res.json();
      if (data.success) {
        setNotice(`Switched to new branch: ${newBranchName.trim()}`);
        setNewBranchName('');
        setShowNewBranchInput(false);
        await fetchStatus();
      }
    } catch {}
    setIsLoading(false);
    setTimeout(() => setNotice(null), 3500);
  };

  const handleSwitchBranch = async (branch: string) => {
    setIsLoading(true);
    try {
      await fetch('http://127.0.0.1:1421/api/git/branch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: project.path, branch, create: false }),
      });
      setNotice(`Switched branch to ${branch}`);
      await fetchStatus();
    } catch {}
    setIsLoading(false);
    setTimeout(() => setNotice(null), 3500);
  };

  const handleInitRepo = async () => {
    setIsLoading(true);
    try {
      await fetch('http://127.0.0.1:1421/api/git/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: project.path }),
      });
      setNotice('Initialized new Git repository with default branch main');
      await fetchStatus();
    } catch {}
    setIsLoading(false);
    setTimeout(() => setNotice(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl bg-devbox-card border border-devbox-border rounded-2xl shadow-glass flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-devbox-border/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Git Version Control</h3>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-devbox-panel border border-devbox-border text-devbox-subtle">
                  {project.name}
                </span>
              </div>
              <p className="text-xs text-devbox-muted font-mono">{project.path}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchStatus}
              title="Refresh Git status"
              disabled={isLoading}
              className="p-2 rounded-xl bg-devbox-panel hover:bg-devbox-hover text-devbox-muted hover:text-white transition-colors"
            >
              <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-devbox-panel hover:bg-devbox-hover text-devbox-subtle hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notice alert */}
        {notice && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-400 font-mono flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>{notice}</span>
          </div>
        )}

        {/* Body content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Repository Not Initialized Banner */}
          {gitStatus && !gitStatus.is_repo && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-3">
              <div className="flex items-center gap-2 text-amber-400">
                <AlertCircle className="w-4 h-4" />
                <h4 className="font-bold text-xs uppercase tracking-wider">No Git Repository Detected</h4>
              </div>
              <p className="text-xs text-devbox-muted">
                This project directory is not yet tracked with Git. Initialize a repository to enable branching, history, and synchronization.
              </p>
              <button
                onClick={handleInitRepo}
                disabled={isLoading}
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-glow transition-all"
              >
                Initialize Git Repository (`git init -b main`)
              </button>
            </div>
          )}

          {/* Active Branch and Switcher */}
          <div className="p-4 rounded-xl bg-devbox-panel/80 border border-devbox-border space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-devbox-subtle font-medium">Active Branch:</span>
                <span className="px-2.5 py-1 rounded-lg bg-orange-500/15 text-orange-400 border border-orange-500/25 font-mono font-bold text-xs flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5" />
                  {gitStatus?.current_branch || 'main'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowNewBranchInput((prev) => !prev)}
                  className="px-3 py-1.5 rounded-lg bg-devbox-card hover:bg-devbox-hover text-devbox-text text-xs font-semibold border border-devbox-border flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Branch</span>
                </button>
              </div>
            </div>

            {/* New Branch Form */}
            {showNewBranchInput && (
              <div className="flex items-center gap-2 pt-2 border-t border-devbox-border/60">
                <input
                  type="text"
                  value={newBranchName}
                  onChange={(e) => setNewBranchName(e.target.value)}
                  placeholder="feature/user-auth, hotfix/ssl..."
                  className="flex-1 px-3 py-1.5 rounded-lg bg-devbox-card border border-devbox-border text-xs text-white placeholder:text-devbox-subtle focus:outline-none focus:border-orange-500 font-mono"
                />
                <button
                  onClick={handleCreateBranch}
                  disabled={!newBranchName.trim()}
                  className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold transition-all disabled:opacity-50"
                >
                  Create & Switch
                </button>
              </div>
            )}

            {/* Branch List */}
            {gitStatus?.branches && gitStatus.branches.length > 1 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[11px] text-devbox-subtle">Switch to:</span>
                {gitStatus.branches.map((b: string) => (
                  <button
                    key={b}
                    onClick={() => handleSwitchBranch(b)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                      b === gitStatus.current_branch
                        ? 'bg-orange-500/20 text-orange-400 font-bold border border-orange-500/30'
                        : 'bg-devbox-card hover:bg-devbox-hover text-devbox-muted hover:text-white border border-devbox-border'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Last Commit Info */}
          {gitStatus?.last_commit && (
            <div className="p-4 rounded-xl bg-devbox-panel/80 border border-devbox-border space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-devbox-subtle font-medium flex items-center gap-1.5">
                  <GitCommit className="w-3.5 h-3.5 text-purple-400" />
                  <span>Latest Commit</span>
                </span>
                <span className="font-mono text-[11px] text-devbox-subtle">{gitStatus.last_commit.time}</span>
              </div>
              <p className="text-xs text-white font-medium">{gitStatus.last_commit.message}</p>
              <div className="flex items-center gap-2 text-[11px] text-devbox-subtle font-mono">
                <span className="px-1.5 py-0.5 rounded bg-black/40 text-purple-400">{gitStatus.last_commit.hash}</span>
                <span>by {gitStatus.last_commit.author}</span>
              </div>
            </div>
          )}

          {/* Working Tree Changes / Staging */}
          <div className="p-4 rounded-xl bg-devbox-panel/80 border border-devbox-border space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-white uppercase tracking-wider">Working Tree Changes</h4>
              <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                gitStatus?.clean
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                {gitStatus?.clean ? '✓ Clean Working Directory' : `${gitStatus?.files?.length || 0} Changed Files`}
              </span>
            </div>

            {gitStatus?.files && gitStatus.files.length > 0 ? (
              <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                {gitStatus.files.map((f: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-devbox-card/80 border border-devbox-border/60 flex items-center justify-between text-xs font-mono"
                  >
                    <span className="text-slate-300 truncate max-w-[380px]">{f.file}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                      f.code === 'M' ? 'bg-amber-500/15 text-amber-400' :
                      f.code === 'A' ? 'bg-emerald-500/15 text-emerald-400' :
                      f.code === 'D' ? 'bg-rose-500/15 text-rose-400' :
                      'bg-purple-500/15 text-purple-400'
                    }`}>
                      {f.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-devbox-subtle py-2">
                No uncommitted changes detected. Working tree is clean.
              </p>
            )}

            {/* Commit Form */}
            {gitStatus && !gitStatus.clean && (
              <div className="pt-2 border-t border-devbox-border/60 space-y-2">
                <input
                  type="text"
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  placeholder="Enter commit message (e.g. feat: implement stripe payment)..."
                  className="w-full px-3 py-2 rounded-xl bg-devbox-card border border-devbox-border text-xs text-white placeholder:text-devbox-subtle focus:outline-none focus:border-orange-500"
                />
                <button
                  onClick={handleCommit}
                  disabled={!commitMessage.trim() || isLoading}
                  className="w-full py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-glow transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <GitCommit className="w-4 h-4" />
                  <span>Stage All & Commit Changes</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions: Pull, Push, Terminal */}
        <div className="p-4 bg-devbox-card/90 border-t border-devbox-border flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePull}
              disabled={isLoading}
              title="Pull latest commits from remote"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-devbox-panel hover:bg-devbox-hover text-devbox-text border border-devbox-border text-xs font-semibold transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Git Pull</span>
            </button>

            <button
              onClick={handlePush}
              disabled={isLoading}
              title="Push local commits to remote"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-devbox-panel hover:bg-devbox-hover text-devbox-text border border-devbox-border text-xs font-semibold transition-all active:scale-95"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>Git Push</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onOpenTerminal && (
              <button
                onClick={() => {
                  onClose();
                  onOpenTerminal(project);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-400 border border-emerald-500/25 text-xs font-semibold transition-colors"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Git Terminal</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-devbox-panel hover:bg-devbox-hover text-devbox-muted hover:text-white text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
