'use client';

import { useI18n } from '@/contexts/i18n';
import Link from 'next/link';
import { getLocalizedText } from '@/lib/utils';
import type { WorkWithAuthor } from '@/types/database';

export default function HomePageContent({ works }: { works: WorkWithAuthor[] }) {
  const { t, lang } = useI18n();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center font-serif">
        {lang === 'ja' ? '古の音（いにしえのね）' : 'Inishie no Ne'}
      </h1>
      <h2 className="text-2xl font-semibold mb-6">{t('works')}</h2>
      
      {works.length === 0 ? (
        <p className="text-gray-500 text-center py-8">{t('no_results_found')}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {works.map((work) => (
            <Link
              key={work.id}
              href={`/works/${work.id}`}
              className="block border border-gray-300 p-6 rounded-lg hover:shadow-lg transition-shadow bg-white"
            >
              <h3 className="text-xl font-bold mb-2 text-blue-600 hover:text-blue-800">
                {getLocalizedText(work.title_jp, work.title_en, lang)}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {t('author')}: {getLocalizedText(work.author_name_jp, work.author_name_en, lang)}
              </p>
              {(work.description_jp || work.description_en) && (
                <p className="text-gray-700 line-clamp-3">
                  {getLocalizedText(
                    work.description_jp || '',
                    work.description_en,
                    lang
                  )}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
