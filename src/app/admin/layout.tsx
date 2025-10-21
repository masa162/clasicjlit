'use client';

/**
 * Admin Layout
 * 
 * Protected by Basic Authentication (see middleware.ts)
 * Features left sidebar navigation and main content area
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/admin' && pathname === '/admin') return true;
    if (path !== '/admin' && pathname?.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Left Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex-shrink-0">
        {/* Top Brand */}
        <div className="p-4 border-b border-gray-700">
          <Link href="/admin" className="block">
            <h1 className="text-xl font-bold hover:text-blue-300">
              Inishie no Ne
            </h1>
            <p className="text-sm text-gray-400">Admin Panel</p>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/admin"
                className={`block px-3 py-2 rounded ${
                  pathname === '/admin'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                📊 Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/admin/authors"
                className={`block px-3 py-2 rounded ${
                  isActive('/admin/authors')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                👤 Authors
              </Link>
            </li>
            <li>
              <Link
                href="/admin/works"
                className={`block px-3 py-2 rounded ${
                  isActive('/admin/works')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                📚 Works
              </Link>
            </li>
            <li>
              <Link
                href="/admin/chapters"
                className={`block px-3 py-2 rounded ${
                  isActive('/admin/chapters')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                📖 Chapters
              </Link>
            </li>
            <li>
              <Link
                href="/admin/categories"
                className={`block px-3 py-2 rounded ${
                  isActive('/admin/categories')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                🏷️ Categories
              </Link>
            </li>
          </ul>

          {/* Quick Links */}
          <div className="mt-8 pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-400 mb-2 px-3">QUICK LINKS</p>
            <ul className="space-y-1">
              <li>
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded"
                >
                  🌐 View Site
                </a>
              </li>
              <li>
                <a
                  href="https://dash.cloudflare.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded"
                >
                  ☁️ Cloudflare
                </a>
              </li>
              <li>
                <a
                  href="/api/debug"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded"
                >
                  🔧 Debug Info
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-300 px-6 py-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            {pathname === '/admin' && 'Dashboard'}
            {pathname === '/admin/authors' && 'Authors Management'}
            {pathname === '/admin/works' && 'Works Management'}
            {pathname?.startsWith('/admin/chapters') && 'Chapters Management'}
            {pathname === '/admin/categories' && 'Categories Management'}
          </h2>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
