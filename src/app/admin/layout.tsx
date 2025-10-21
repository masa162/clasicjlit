/**
 * Admin Layout
 * 
 * Protected by Basic Authentication (see middleware.ts)
 */

// Force dynamic rendering for all admin pages
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Inishie no Ne - Admin Panel</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
