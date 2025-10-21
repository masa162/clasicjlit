export const runtime = 'edge';

import Link from 'next/link';

export default function AdminPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Authors Management */}
        <Link
          href="/admin/authors"
          className="block p-6 bg-white border border-gray-300 rounded-lg hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2 text-blue-600">👤 Authors</h2>
          <p className="text-gray-600">Manage authors and their biographies</p>
        </Link>

        {/* Works Management */}
        <Link
          href="/admin/works"
          className="block p-6 bg-white border border-gray-300 rounded-lg hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2 text-blue-600">📚 Works</h2>
          <p className="text-gray-600">Manage literary works and collections</p>
        </Link>

        {/* Chapters Management */}
        <Link
          href="/admin/chapters"
          className="block p-6 bg-white border border-gray-300 rounded-lg hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2 text-blue-600">📖 Chapters</h2>
          <p className="text-gray-600">Manage chapters and audio content</p>
        </Link>

        {/* Categories Management */}
        <Link
          href="/admin/categories"
          className="block p-6 bg-white border border-gray-300 rounded-lg hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2 text-blue-600">🏷️ Categories</h2>
          <p className="text-gray-600">Manage content categories and tags</p>
        </Link>
      </div>

      {/* Quick Links */}
      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
        <div className="flex gap-4 flex-wrap">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            View Public Site →
          </a>
          <a
            href="https://dash.cloudflare.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Cloudflare Dashboard →
          </a>
        </div>
      </div>
    </div>
  );
}
