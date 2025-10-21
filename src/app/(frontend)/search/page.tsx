import SearchPageContent from './search-page-content';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'edge';

interface SearchResult {
  type: 'work' | 'chapter';
  id: number;
  title: string;
  work_id?: number;
}

export default function SearchPage() {
  // TODO: Implement actual search functionality
  const query = '';
  const results: SearchResult[] = [];

  return <SearchPageContent query={query} results={results} />;
}