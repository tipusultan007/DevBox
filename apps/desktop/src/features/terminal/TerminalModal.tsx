import React, { useState, useRef, useEffect } from 'react';
import { X, Terminal as TerminalIcon, Maximize2, Minimize2, CornerDownLeft, Sparkles } from 'lucide-react';
import { Project } from '../../types';

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

export const TerminalModal: React.FC<TerminalModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const [history, setHistory] = useState<Array<{ cmd: string; output: string[] }>>([
    {
      cmd: '',
      output: [
        'DevBox Integrated Project Terminal [Version 0.1.0]',
        '(c) DevBox Systems. Context-injected runtime environment.',
        '',
        `Injected PATH: C:\\DevBox\\runtimes\\php\\${project?.php_version || '8.3'};C:\\DevBox\\bin`,
        `Target Directory: ${project?.path || 'D:\\Projects'}`,
        '',
        'Type "help" or run "php -v", "composer", or artisan commands.',
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (!isOpen) return null;

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    let output: string[] = [];
    const lower = cmd.toLowerCase();

    if (lower === 'help') {
      output = [
        'Available contextual commands:',
        '  php -v                   Display active project PHP binary version',
        '  php artisan migrate      Execute database migrations',
        '  php artisan list         List available framework artisan commands',
        '  composer install         Install composer dependencies',
        '  clear                    Clear terminal screen',
      ];
    } else if (lower === 'clear') {
      setHistory([]);
      setInput('');
      return;
    } else if (lower.startsWith('php -v')) {
      output = [
        `PHP ${project?.php_version || '8.3.17'} (cli) (built: Feb 2026)`,
        'Copyright (c) The PHP Group',
        'Zend Engine v4.3.17, Copyright (c) Zend Technologies',
        '    with Zend OPcache v8.3.17, Copyright (c), by Zend Technologies',
      ];
    } else if (lower.includes('artisan migrate')) {
      output = [
        'INFO  Running migrations.',
        '2026_09_28_000001_create_users_table ........................... 14.20ms DONE',
        '2026_09_28_000002_create_orders_table .......................... 21.05ms DONE',
        '2026_09_28_000003_create_products_table ........................ 18.60ms DONE',
      ];
    } else if (lower.startsWith('composer')) {
      output = [
        'Composer version 2.7.2 2024-03-11',
        'Installing dependencies from lock file...',
        'Nothing to install, update or remove. Generating autoload files.',
        'Generated optimized autoload files containing 3420 classes.',
      ];
    } else {
      output = [
        `Executed: ${cmd}`,
        `[DevBox PTY]: Process completed with exit code 0.`,
      ];
    }

    setHistory((prev) => [...prev, { cmd, output }]);
    setInput('');
  };

  const projectPath = project ? project.path : 'D:\\Projects';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-4xl h-[560px] bg-devbox-bg border border-devbox-border rounded-2xl shadow-glass flex flex-col overflow-hidden font-mono text-xs">
        {/* Terminal Header */}
        <div className="px-4 py-3 bg-devbox-card border-b border-devbox-border flex items-center justify-between select-none">
          <div className="flex items-center gap-2.5">
            <TerminalIcon className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white font-sans text-sm">
              {project ? project.name : 'DevBox'} Terminal
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30">
              PHP {project?.php_version || '8.3'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-devbox-subtle hover:text-white hover:bg-devbox-hover transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Command Chips */}
        <div className="px-4 py-2 bg-devbox-panel/60 border-b border-devbox-border flex items-center gap-2 overflow-x-auto select-none">
          <span className="text-[10px] text-devbox-subtle font-sans font-semibold uppercase">Quick Actions:</span>
          {['php -v', 'php artisan migrate', 'composer install', 'clear'].map((q) => (
            <button
              key={q}
              onClick={() => {
                setInput(q);
              }}
              className="px-2 py-0.5 rounded bg-devbox-card hover:bg-devbox-hover text-devbox-muted hover:text-white border border-devbox-border text-[11px] transition-colors whitespace-nowrap"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Terminal Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#080B11] text-devbox-text">
          {history.map((h, i) => (
            <div key={i} className="space-y-1">
              {h.cmd && (
                <div className="flex items-center gap-2 text-devbox-muted">
                  <span className="text-emerald-400 font-bold">{projectPath}&gt;</span>
                  <span className="text-white font-semibold">{h.cmd}</span>
                </div>
              )}
              {h.output.map((line, idx) => (
                <p key={idx} className="text-devbox-muted leading-relaxed whitespace-pre-wrap">
                  {line}
                </p>
              ))}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleCommand}
          className="p-3 bg-devbox-card border-t border-devbox-border flex items-center gap-2"
        >
          <span className="text-emerald-400 font-bold shrink-0">{projectPath}&gt;</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
            placeholder="Type a command (e.g. php artisan migrate)..."
            className="flex-1 bg-transparent text-white focus:outline-none placeholder:text-devbox-subtle"
          />
          <button
            type="submit"
            className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
