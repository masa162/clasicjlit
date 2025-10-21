
'use client';

import { useI18n } from '@/contexts/i18n';
import Link from 'next/link';

interface SearchResult {
  type: 'work' | 'chapter';
  id: number;
  title: string;
  work_id?: number;
}

export default function SearchPageContent({ query, results }: { query: string; results: SearchResult[] }) {
  const { t } = useI18n();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{`${t('search_results_for')} "${query}"`}</h2>
      <ul>
        {results.map((result) => (
          <li key={`${result.type}-${result.id}`}>
            {result.type === 'work' ? (
              <Link href={`/works/${result.id}`}>{result.title}</Link>
            ) : (
              <Link href={`/works/${result.work_id}/chapters/${result.id}`}>{result.title}</Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
