/**
 * Internationalization Context
 * 
 * Provides language switching and translation functionality.
 * Default language is English as specified in requirements.
 */

'use client';

import { createContext, useState, useContext, useEffect } from 'react';
import type { Language, TranslationKeys, Translations } from '@/types/i18n';

const translations: Translations = {
  en: {
    // Navigation
    home: 'Home',
    authors: 'Authors',
    categories: 'Categories',
    search: 'Search',
    works: 'Works',
    chapters: 'Chapters',
    
    // Actions
    play: 'Play',
    pause: 'Pause',
    next: 'Next',
    previous: 'Previous',
    speed: 'Speed',
    
    // Labels
    title: 'Title',
    description: 'Description',
    author: 'Author',
    category: 'Category',
    duration: 'Duration',
    chapter_order: 'Chapter Order',
    
    // Messages
    search_results_for: 'Search Results for',
    no_results_found: 'No results found',
    loading: 'Loading...',
    error_occurred: 'An error occurred',
    
    // Admin
    admin_dashboard: 'Admin Dashboard',
    create_new: 'Create New',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    confirm_delete: 'Are you sure you want to delete this item?',
  },
  ja: {
    // Navigation
    home: 'ホーム',
    authors: '著者',
    categories: 'カテゴリ',
    search: '検索',
    works: '作品',
    chapters: 'チャプター',
    
    // Actions
    play: '再生',
    pause: '一時停止',
    next: '次へ',
    previous: '前へ',
    speed: '速度',
    
    // Labels
    title: 'タイトル',
    description: '説明',
    author: '著者',
    category: 'カテゴリ',
    duration: '再生時間',
    chapter_order: '章順序',
    
    // Messages
    search_results_for: 'の検索結果',
    no_results_found: '結果が見つかりませんでした',
    loading: '読み込み中...',
    error_occurred: 'エラーが発生しました',
    
    // Admin
    admin_dashboard: '管理画面',
    create_new: '新規作成',
    edit: '編集',
    delete: '削除',
    save: '保存',
    cancel: 'キャンセル',
    confirm_delete: 'このアイテムを削除してもよろしいですか？',
  },
};

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof TranslationKeys) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // Default language is English as per requirements (2.1.4)
  const [lang, setLang] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  // Persist language preference in localStorage (client-side only)
  useEffect(() => {
    setMounted(true);
    
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('preferred-language') as Language;
      if (savedLang && (savedLang === 'en' || savedLang === 'ja')) {
        setLang(savedLang);
      }
    }
  }, []);

  const handleSetLang = (newLang: Language) => {
    setLang(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-language', newLang);
    }
  };

  const t = (key: keyof TranslationKeys): string => {
    return translations[lang][key] || key;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
