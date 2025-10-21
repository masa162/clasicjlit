'use client';

import { useI18n } from '@/contexts/i18n';
import Link from 'next/link';
import { getLocalizedText } from '@/lib/utils';
import type { Work, Chapter } from '@/types/database';

interface WorkWithAuthor extends Work {
  author_name_jp: string;
  author_name_en: string | null;
}

interface WorkPageContentProps {
  work: WorkWithAuthor;
  chapters: Chapter[];
}

export default function WorkPageContent({ work, chapters }: WorkPageContentProps) {
  const { t, lang } = useI18n();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Work Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2 font-serif">
          {getLocalizedText(work.title_jp, work.title_en, lang)}
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          {t('author')}: {getLocalizedText(work.author_name_jp, work.author_name_en, lang)}
        </p>
        {(work.description_jp || work.description_en) && (
          <p className="text-gray-700 leading-relaxed">
            {getLocalizedText(work.description_jp || '', work.description_en, lang)}
          </p>
        )}
      </header>

      {/* Chapters List */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">{t('chapters')}</h2>
        {chapters.length === 0 ? (
          <p className="text-gray-500">{t('no_results_found')}</p>
        ) : (
          <ul className="space-y-3">
            {chapters.map((chapter) => (
              <li key={chapter.id}>
                <Link
                  href={`/works/${work.id}/chapters/${chapter.id}`}
                  className="block p-4 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-500 transition-colors"
                >
                  <span className="font-semibold text-gray-700 mr-2">
                    {chapter.chapter_order}.
                  </span>
                  <span className="text-lg text-blue-600 hover:text-blue-800">
                    {getLocalizedText(chapter.title_jp, chapter.title_en, lang)}
                  </span>
                  {chapter.duration_seconds && (
                    <span className="text-sm text-gray-500 ml-3">
                      ({Math.floor(chapter.duration_seconds / 60)}:{(chapter.duration_seconds % 60).toString().padStart(2, '0')})
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
