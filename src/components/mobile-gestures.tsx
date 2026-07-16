'use client';

import { useEffect } from 'react';

export default function MobileGestures() {
  useEffect(() => {
    let lastTap = 0;
    let touchStartX = 0;
    let touchStartY = 0;

    const handleDoubleTap = (e: TouchEvent) => {
      const now = Date.now();
      const timeDiff = now - lastTap;

      if (timeDiff < 300 && timeDiff > 0) {
        // 双击返回顶部
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      lastTap = now;
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      // 从屏幕左边缘右滑返回（仅在最左侧 20px 范围内触发）
      if (touchStartX < 20 && deltaX > 100 && Math.abs(deltaY) < 50) {
        if (window.history.length > 1) {
          window.history.back();
        }
      }
    };

    // 添加事件监听
    document.addEventListener('touchend', handleDoubleTap, { passive: false });
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchend', handleDoubleTap);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return null;
}
