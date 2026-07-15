"use client";

import Giscus from "@giscus/react";

interface CommentsProps {
  slug: string;
  title: string;
}

export default function Comments({ slug, title }: CommentsProps) {
  return (
    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        评论
      </h3>
      <Giscus
        id="comments"
        repo="alwaysPKU/alwayszhang.github.io"
        repoId="R_kgDOMGxJXw"
        category="Announcements"
        categoryId="DIC_kwDOMGxJX84CjXxJ"
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="light"
        lang="zh-CN"
        loading="lazy"
      />
    </div>
  );
}
