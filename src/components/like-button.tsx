"use client";

import { useState, useEffect } from "react";

export default function LikeButton({ slug }: { slug: string }) {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(`likes-${slug}`);
    if (stored) {
      const data = JSON.parse(stored);
      setLikes(data.count || 0);
      setLiked(data.liked || false);
    }
  }, [slug]);

  const handleLike = () => {
    const newLiked = !liked;
    const newCount = newLiked ? likes + 1 : Math.max(0, likes - 1);
    setLiked(newLiked);
    setLikes(newCount);
    localStorage.setItem(
      `likes-${slug}`,
      JSON.stringify({ count: newCount, liked: newLiked })
    );
  };

  return (
    <button
      onClick={handleLike}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
        liked
          ? "bg-red-500 text-white hover:bg-red-600"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
      }`}
    >
      <svg
        className={`w-5 h-5 ${liked ? "fill-current" : "fill-none stroke-current"}`}
        viewBox="0 0 24 24"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span className="font-medium">{likes}</span>
    </button>
  );
}
