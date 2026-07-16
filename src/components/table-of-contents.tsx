'use client';

import { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState('');
  const [showMobile, setShowMobile] = useState(false);

  useEffect(() => {
    // 提取文章标题
    const article = document.querySelector('article');
    if (!article) return;

    const headings = article.querySelectorAll('h1, h2, h3, h4');
    const items: TocItem[] = [];

    headings.forEach((heading, index) => {
      const id = `heading-${index}`;
      heading.id = id;
      items.push({
        id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName[1]),
      });
    });

    setToc(items);

    // 监听滚动高亮
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setShowMobile(false);
    }
  };

  if (toc.length === 0) return null;

  return (
    <>
      {/* Mobile TOC Button */}
      <button
        onClick={() => setShowMobile(true)}
        className="fixed bottom-6 right-6 z-40 md:hidden bg-primary text-primary-foreground rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
        aria-label="Show table of contents"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      </button>

      {/* Mobile TOC Drawer */}
      {showMobile && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowMobile(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] bg-background rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom">
            <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-base font-semibold text-foreground">文章目录</h2>
              <button
                onClick={() => setShowMobile(false)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Close"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <nav className="overflow-y-auto px-6 py-4" style={{ maxHeight: 'calc(80vh - 80px)' }}>
              <ul className="space-y-2">
                {toc.map((item) => (
                  <li
                    key={item.id}
                    style={{ paddingLeft: `${(item.level - 1) * 16}px` }}
                  >
                    <button
                      onClick={() => scrollToHeading(item.id)}
                      className={`text-sm text-left w-full truncate transition-colors hover:text-primary ${
                        activeId === item.id
                          ? 'text-primary font-medium'
                          : 'text-muted-foreground'
                      }`}
                      title={item.text}
                    >
                      {item.text}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Desktop TOC */}
      <nav className="hidden md:block sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto rounded-xl border border-border/60 bg-background/80 p-4 backdrop-blur-md">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          目录
        </h3>
        <ul className="space-y-1.5">
          {toc.map((item) => (
            <li
              key={item.id}
              style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
            >
              <button
                onClick={() => scrollToHeading(item.id)}
                className={`text-xs text-left w-full truncate transition-colors hover:text-primary ${
                  activeId === item.id
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground'
                }`}
                title={item.text}
              >
                {item.text}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
