import React, { useState } from 'react';
import { X, Database, Terminal, Play, Table, KeyRound, Download, RefreshCw } from 'lucide-react';
import { DatabaseItem } from '../../types';

interface AdminerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeDatabase: DatabaseItem | null;
}

export const AdminerModal: React.FC<AdminerModalProps> = ({
  isOpen,
  onClose,
  activeDatabase,
}) => {
  const [activeTab, setActiveTab] = useState<'tables' | 'sql' | 'export'>('tables');
  const [sqlQuery, setSqlQuery] = useState(`SELECT * FROM users LIMIT 10;`);
  const [queryResults, setQueryResults] = useState<Array<Record<string, any>>>([
    { id: 1, name: 'Admin User', email: 'admin@devbox.local', role: 'administrator', created_at: '2026-09-28 10:00:00' },
    { id: 2, name: 'John Doe', email: 'john@example.com', role: 'developer', created_at: '2026-09-30 14:15:00' },
    { id: 3, name: 'Jane Smith', email: 'jane@example.com', role: 'client', created_at: '2026-10-01 09:30:00' },
  ]);
  const [executing, setExecuting] = useState(false);

  if (!isOpen) return null;

  const dbName = activeDatabase?.name || 'myshop';

  const handleRunQuery = () => {
    setExecuting(true);
    setTimeout(() => {
      setExecuting(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-5xl h-[650px] bg-devbox-card border border-devbox-border rounded-2xl shadow-glass flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-3.5 bg-devbox-panel border-b border-devbox-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">DevBox Adminer Web Database GUI</h3>
                <span className="px-2 py-0.2 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  MySQL 8.4
                </span>
              </div>
              <p className="text-[11px] text-devbox-subtle font-mono">
                Database: <strong className="text-emerald-400">{dbName}</strong> @ 127.0.0.1:3306
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-devbox-subtle hover:text-white hover:bg-devbox-hover transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 py-2 bg-devbox-card border-b border-devbox-border flex items-center gap-2">
          {[
            { id: 'tables', label: 'Tables & Structure', icon: Table },
            { id: 'sql', label: 'SQL Query Console', icon: Terminal },
            { id: 'export', label: 'Export / Backup SQL', icon: Download },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-glow'
                    : 'text-devbox-muted hover:text-white hover:bg-devbox-hover'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="flex-1 p-6 overflow-y-auto bg-[#0a0d14]">
          {activeTab === 'tables' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-devbox-muted">
                <span>Tables in <strong>{dbName}</strong> (InnoDB Engine, utf8mb4_unicode_ci)</span>
                <span className="font-mono">Total size: ~24.1 MB</span>
              </div>

              <div className="border border-devbox-border rounded-xl overflow-hidden bg-devbox-card">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-devbox-panel border-b border-devbox-border text-devbox-subtle font-sans text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">Table Name</th>
                      <th className="py-2.5 px-4 font-semibold">Rows</th>
                      <th className="py-2.5 px-4 font-semibold">Engine</th>
                      <th className="py-2.5 px-4 font-semibold">Data Size</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-devbox-border/60">
                    {[
                      { name: 'users', rows: 1420, size: '240 KB' },
                      { name: 'orders', rows: 8420, size: '3.2 MB' },
                      { name: 'order_items', rows: 24510, size: '8.4 MB' },
                      { name: 'products', rows: 450, size: '640 KB' },
                      { name: 'categories', rows: 32, size: '48 KB' },
                      { name: 'migrations', rows: 28, size: '16 KB' },
                      { name: 'failed_jobs', rows: 0, size: '16 KB' },
                      { name: 'personal_access_tokens', rows: 184, size: '96 KB' },
                    ].map((tbl) => (
                      <tr key={tbl.name} className="hover:bg-devbox-panel/40 transition-colors">
                        <td className="py-2.5 px-4 font-bold text-white flex items-center gap-2">
                          <Table className="w-3.5 h-3.5 text-blue-400" />
                          <span>{tbl.name}</span>
                        </td>
                        <td className="py-2.5 px-4 text-devbox-text">{tbl.rows.toLocaleString()}</td>
                        <td className="py-2.5 px-4 text-devbox-subtle">InnoDB</td>
                        <td className="py-2.5 px-4 text-devbox-subtle">{tbl.size}</td>
                        <td className="py-2.5 px-4 text-right">
                          <button
                            onClick={() => {
                              setSqlQuery(`SELECT * FROM ${tbl.name} LIMIT 50;`);
                              setActiveTab('sql');
                            }}
                            className="text-blue-400 hover:text-blue-300 font-sans font-semibold text-[11px]"
                          >
                            Browse &gt;
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-devbox-muted uppercase tracking-wider">
                    SQL Command
                  </label>
                  <button
                    onClick={handleRunQuery}
                    disabled={executing}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-glow transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{executing ? 'Executing...' : 'Run Query (Ctrl+Enter)'}</span>
                  </button>
                </div>
                <textarea
                  value={sqlQuery}
                  onChange={(e) => setSqlQuery(e.target.value)}
                  rows={4}
                  className="w-full p-3.5 rounded-xl bg-devbox-card border border-devbox-border font-mono text-xs text-devbox-text focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Results View */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-devbox-subtle font-mono">
                  <span>3 rows retrieved in 1.4ms</span>
                  <span>utf8mb4</span>
                </div>
                <div className="border border-devbox-border rounded-xl overflow-hidden bg-devbox-card">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-devbox-panel border-b border-devbox-border text-devbox-subtle">
                      <tr>
                        {Object.keys(queryResults[0] || {}).map((col) => (
                          <th key={col} className="py-2 px-3 font-semibold uppercase text-[10px]">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-devbox-border/60">
                      {queryResults.map((row, idx) => (
                        <tr key={idx} className="hover:bg-devbox-panel/40">
                          {Object.values(row).map((val: any, colIdx) => (
                            <td key={colIdx} className="py-2 px-3 text-devbox-text">{String(val)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="p-6 glass-card rounded-2xl border border-devbox-border max-w-xl mx-auto space-y-4">
              <h4 className="font-bold text-base text-white">Export Database Dump</h4>
              <p className="text-xs text-devbox-muted">
                Create a self-contained SQL dump archive with table structure and data for migrations or backups.
              </p>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs text-white">
                  <input type="checkbox" defaultChecked className="rounded text-blue-600 bg-devbox-panel" />
                  <span>Include CREATE TABLE statements</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-white">
                  <input type="checkbox" defaultChecked className="rounded text-blue-600 bg-devbox-panel" />
                  <span>Include INSERT data records</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-white">
                  <input type="checkbox" defaultChecked className="rounded text-blue-600 bg-devbox-panel" />
                  <span>Compress dump with gzip</span>
                </label>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-glow transition-all"
              >
                Download {dbName}.sql.gz (24.1 MB)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
