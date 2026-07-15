"use client";

import { useState, useEffect, useRef } from "react";
import lunr from "lunr";

interface SearchResult {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
}

interface SearchIndex {
  ref: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string;
}

export default function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [index, setIndex] = useState<lunr.Index | null>(null);
  const [documents, setDocuments] = useState<Map<string, SearchIndex>>(new Map());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    // 从 API 获取所有文章数据
    fetch("/api/search-index")
      .then((res) => res.json())
      .then((data: SearchIndex[]) => {
        const docMap = new Map<string, SearchIndex>();
        data.forEach((doc) => {
          docMap.set(doc.ref, doc);
        });

        const idx = lunr(function () {
          this.field("title", { boost: 10 });
          this.field("tags", { boost: 5 });
          this.field("excerpt");
          this.ref("ref");

          data.forEach((doc) => {
            this.add(doc);
          });
        });

        setIndex(idx);
        setDocuments(docMap);
      })
      .catch((err) => console.error("Failed to load search index:", err));
  }, []);

  useEffect(() => {
    if (!index || !query.trim()) {
      setResults([]);
      return;
    }

    try {
      const searchResults = index.search(query);
      const mappedResults: SearchResult[] = searchResults.map((result) => {
        const doc = documents.get(result.ref);
        return {
          slug: result.ref,
          title: doc?.title || "",
          date: doc?.date || "",
          excerpt: doc?.excerpt || "",
          tags: doc?.tags ? doc.tags.split(",") : [],
        };
      });
      setResults(mappedResults);
    } catch (err) {
      console.error("Search error:", err);
    }
  }, [query, index, documents]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 pt-20 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[600px] flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索文章标题、标签、内容..."
              className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 outline-none"
            />
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {query.trim() === "" ? (
            <div className="text-center text-gray-400 py-8">输入关键词开始搜索</div>
          ) : results.length === 0 ? (
            <div className="text-center text-gray-400 py-8">未找到相关文章</div>
          ) : (
            <div className="space-y-4">
              {results.map((result) => (
                <a
                  key={result.slug}
                  href={`/posts/${result.slug}`}
                  onClick={onClose}
                  className="block p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                        {result.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {result.excerpt}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-400">{result.date}</span>
                        {result.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-400 text-center">
          按 ESC 关闭
        </div>
      </div>
    </div>
  );
}
