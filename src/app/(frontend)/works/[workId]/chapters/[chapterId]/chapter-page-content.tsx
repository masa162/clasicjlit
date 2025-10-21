'use client';

import ReactMarkdown from 'react-markdown';
import AudioPlayer from '@/components/AudioPlayer';
import { useI18n } from '@/contexts/i18n';
import { getLocalizedText, formatDuration } from '@/lib/utils';
import type { Chapter } from '@/types/database';

interface ChapterPageContentProps {
  chapter: Chapter;
  nextChapterUrl?: string;
}

export default function ChapterPageContent({
  chapter,
  nextChapterUrl,
}: ChapterPageContentProps) {
  const { t, lang } = useI18n();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Chapter Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2 font-serif">
          {getLocalizedText(chapter.title_jp, chapter.title_en, lang)}
        </h1>
        {chapter.duration_seconds && (
          <p className="text-gray-600">
            {t('duration')}: {formatDuration(chapter.duration_seconds)}
          </p>
        )}
      </header>

      {/* Audio Player */}
      {chapter.audio_url && (
        <div className="mb-8">
          <AudioPlayer
            src={chapter.audio_url}
            nextChapterUrl={nextChapterUrl}
            autoPlayNext={true}
          />
        </div>
      )}

      {/* Chapter Content */}
      {(chapter.content_jp || chapter.content_en) && (
        <article className="prose prose-lg max-w-none">
          <ReactMarkdown>
            {getLocalizedText(
              chapter.content_jp || '',
              chapter.content_en,
              lang
            )}
          </ReactMarkdown>
        </article>
      )}

      {/* Navigation */}
      {nextChapterUrl && (
        <div className="mt-12 pt-8 border-t">
          <a
            href={nextChapterUrl}
            className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {t('next')} →
          </a>
        </div>
      )}
    </div>
  );
}
