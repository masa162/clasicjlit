import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "古の音",
  description: "日本古典文学 音読コンテンツ配信サイト",
};

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-1/5 bg-gray-100 p-4">
        {/* Left Navigation */}
        <nav>
          <ul>
            <li>作品一覧</li>
            <li>著者一覧</li>
            <li>カテゴリ</li>
            <li>検索</li>
          </ul>
        </nav>
      </aside>
      <main className="w-3/5 p-4">{children}</main>
      <aside className="w-1/5 bg-gray-100 p-4">
        {/* Right Navigation */}
        <nav>
          <ul>
            <li>関連作品</li>
            <li>人気記事</li>
            <li>目次</li>
            <li>広告</li>
          </ul>
        </nav>
      </aside>
    </div>
  );
}
