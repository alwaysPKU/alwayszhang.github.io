"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

export function TipButton() {
  const [showTip, setShowTip] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowTip(true)}
        className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
        title="打赏作者"
      >
        <Heart className="w-4 h-4" />
        <span className="text-sm">打赏</span>
      </button>

      {showTip && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowTip(false)}
        >
          <div
            className="bg-background border border-border rounded-lg p-6 max-w-sm mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">感谢支持</h3>
              <p className="text-sm text-muted-foreground mb-4">
                如果觉得文章有帮助，可以请作者喝杯咖啡 ☕
              </p>
              <div className="aspect-square max-w-[240px] mx-auto bg-muted rounded-lg flex items-center justify-center mb-4">
                <img
                  src="/images/wechat-tip-qr.jpg"
                  alt="微信收款码"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                微信扫码打赏
              </p>
              <button
                onClick={() => setShowTip(false)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
