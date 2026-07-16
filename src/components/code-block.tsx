'use client';

import { useState, useRef } from 'react';

interface CodeBlockProps {
  children: string;
  language?: string;
  filename?: string;
}

export default function CodeBlock({ children, language = 'text', filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);

  const handleCopy = async () => {
    if (codeRef.current) {
      await navigator.clipboard.writeText(codeRef.current.textContent || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const lines = children.split('\n');
  const lineCount = lines.length;

  return (
    <div className="relative group my-4 rounded-xl overflow-hidden border border-border bg-card">
      {/* Code header */}
      <div className="flex items-center justify-between px-3 py-2 sm:px-4 bg-muted/50 border-b border-border">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="flex gap-1.5 shrink-0">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          {filename && (
            <span className="text-xs text-muted-foreground ml-2 truncate hidden sm:inline">{filename}</span>
          )}
          <span className="text-xs text-muted-foreground px-2 py-0.5 rounded bg-primary/10 text-primary shrink-0">
            {language}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-muted-foreground hidden sm:inline">{lineCount} 行</span>
          {lineCount > 20 && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-xs text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded hover:bg-primary/10"
            >
              {collapsed ? '展开' : '折叠'}
            </button>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded hover:bg-primary/10"
          >
            {copied ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                已复制
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                复制
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code content */}
      <div className={`overflow-hidden transition-all duration-300 ${collapsed ? 'max-h-40' : 'max-h-none'}`}>
        <div className="flex overflow-x-auto">
          {/* Line numbers */}
          <div className="flex-shrink-0 py-4 px-3 text-right bg-muted/30 border-r border-border select-none">
            {lines.map((_, i) => (
              <div key={i} className="text-xs text-muted-foreground/60 font-mono leading-6">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Code */}
          <pre ref={codeRef} className="flex-1 py-4 px-4 overflow-x-auto">
            <code className="text-sm font-mono text-foreground leading-6">
              {children}
            </code>
          </pre>
        </div>
      </div>

      {collapsed && (
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-card to-transparent pointer-events-none" />
      )}
    </div>
  );
}
