import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const VIEWS_DIR = path.join(process.cwd(), "data", "article-views");

function getViewsFile(slug: string): number {
  // 确保目录存在
  if (!fs.existsSync(VIEWS_DIR)) {
    fs.mkdirSync(VIEWS_DIR, { recursive: true });
  }

  const filePath = path.join(VIEWS_DIR, `${slug}.json`);

  // 读取或初始化阅读量
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({ views: 0 }));
    return 0;
  }

  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return data.views || 0;
}

function saveViews(slug: string, views: number): void {
  if (!fs.existsSync(VIEWS_DIR)) {
    fs.mkdirSync(VIEWS_DIR, { recursive: true });
  }

  const filePath = path.join(VIEWS_DIR, `${slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify({ views }));
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const views = getViewsFile(slug);

    // 检查 cookie 判断是否已读过
    const cookieHeader = request.headers.get("cookie") || "";
    const hasRead = cookieHeader.includes(`read-${slug}=1`);

    let newViews = views;
    if (!hasRead) {
      newViews = views + 1;
      saveViews(slug, newViews);
    }

    // 设置 cookie 标记
    const headers = new Headers();
    if (!hasRead) {
      headers.set(
        "Set-Cookie",
        `read-${slug}=1; Path=/; Max-Age=31536000; SameSite=Lax`
      );
    }

    return NextResponse.json(
      {
        success: true,
        views: newViews,
        isNewView: !hasRead,
      },
      { headers }
    );
  } catch (error) {
    console.error("Failed to record view:", error);
    return NextResponse.json({ error: "Failed to record view" }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const views = getViewsFile(slug);

    return NextResponse.json({ views });
  } catch (error) {
    console.error("Failed to fetch views:", error);
    return NextResponse.json({ error: "Failed to fetch views" }, { status: 500 });
  }
}
