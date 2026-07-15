"use client";

import { useState } from "react";
import { toPng } from "html-to-image";

interface SharePosterProps {
  title: string;
  date: string;
  slug: string;
}

export default function SharePoster({ title, date, slug }: SharePosterProps) {
  const [showPoster, setShowPoster] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleShare = async () => {
    setGenerating(true);
    // 延迟以确保 DOM 渲染完成
    await new Promise((resolve) => setTimeout(resolve, 100));

    const element = document.getElementById("share-poster-content");
    if (element) {
      try {
        const dataUrl = await toPng(element, {
          backgroundColor: "#ffffff",
          width: 800,
          height: 600,
        });
        const link = document.createElement("a");
        link.download = `${slug}-share.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error("Failed to generate poster:", err);
      }
    }
    setGenerating(false);
  };

  return (
    <>
      <button
        onClick={() => setShowPoster(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-all"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
        分享
      </button>

      {showPoster && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                分享海报
              </h3>
              <button
                onClick={() => setShowPoster(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div
              id="share-poster-content"
              className="p-12 rounded-lg text-gray-900"
              style={{ 
                width: "800px", 
                height: "600px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              }}
            >
              <div className="h-full flex flex-col justify-between">
                <div>
                  <div className="text-lg text-white/80 mb-4">{date}</div>
                  <h2 className="text-4xl font-bold mb-6 text-white leading-tight">
                    {title}
                  </h2>
                  <div className="w-20 h-1 bg-white/50 rounded"></div>
                </div>
                <div className="border-t border-white/20 pt-6">
                  <div className="text-xl text-white font-medium mb-1">HalfSugar - 半甜不要腻</div>
                  <div className="text-sm text-white/60">alwayszhang.cn</div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowPoster(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleShare}
                disabled={generating}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                {generating ? "生成中..." : "下载海报"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
