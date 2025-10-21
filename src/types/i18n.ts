/**
 * Internationalization types
 */

export type Language = 'en' | 'ja';

export interface TranslationKeys {
  // Navigation
  home: string;
  authors: string;
  categories: string;
  search: string;
  works: string;
  chapters: string;
  
  // Actions
  play: string;
  pause: string;
  next: string;
  previous: string;
  speed: string;
  
  // Labels
  title: string;
  description: string;
  author: string;
  category: string;
  duration: string;
  chapter_order: string;
  
  // Messages
  search_results_for: string;
  no_results_found: string;
  loading: string;
  error_occurred: string;
  
  // Admin
  admin_dashboard: string;
  create_new: string;
  edit: string;
  delete: string;
  save: string;
  cancel: string;
  confirm_delete: string;
}

export type Translations = Record<Language, TranslationKeys>;

