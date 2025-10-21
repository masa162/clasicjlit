/**
 * Database type definitions
 * Based on the Cloudflare D1 schema
 */

export interface Author {
  id: string;
  name_jp: string;
  name_en: string | null;
  bio_jp: string | null;
  bio_en: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name_jp: string;
  name_en: string | null;
  created_at: string;
  updated_at: string;
}

export interface Work {
  id: string;
  author_id: string;
  title_jp: string;
  title_en: string | null;
  description_jp: string | null;
  description_en: string | null;
  created_at: string;
  updated_at: string;
}

export interface Chapter {
  id: string;
  work_id: string;
  chapter_order: number;
  title_jp: string;
  title_en: string | null;
  audio_url: string;
  content_jp: string | null;
  content_en: string | null;
  duration_seconds: number | null;
  created_at: string;
  updated_at: string;
}

export interface ChapterCategory {
  chapter_id: string;
  category_id: string;
}

// Extended types with joins
export interface WorkWithAuthor extends Work {
  author_name_jp: string;
  author_name_en: string | null;
}

export interface ChapterWithWork extends Chapter {
  work_title_jp: string;
  work_title_en: string | null;
}

export interface ChapterWithCategories extends Chapter {
  categories: Category[];
}

// API Request/Response types
export interface CreateAuthorRequest {
  id: string;
  name_jp: string;
  name_en?: string;
  bio_jp?: string;
  bio_en?: string;
}

export interface UpdateAuthorRequest {
  name_jp?: string;
  name_en?: string;
  bio_jp?: string;
  bio_en?: string;
}

export interface CreateWorkRequest {
  id: string;
  author_id: string;
  title_jp: string;
  title_en?: string;
  description_jp?: string;
  description_en?: string;
}

export interface UpdateWorkRequest {
  author_id?: string;
  title_jp?: string;
  title_en?: string;
  description_jp?: string;
  description_en?: string;
}

export interface CreateChapterRequest {
  id: string;
  work_id: string;
  chapter_order: number;
  title_jp: string;
  title_en?: string;
  audio_url: string;
  content_jp?: string;
  content_en?: string;
  duration_seconds?: number;
  category_ids?: string[];
}

export interface UpdateChapterRequest {
  work_id?: string;
  chapter_order?: number;
  title_jp?: string;
  title_en?: string;
  audio_url?: string;
  content_jp?: string;
  content_en?: string;
  duration_seconds?: number;
  category_ids?: string[];
}

export interface CreateCategoryRequest {
  id: string;
  name_jp: string;
  name_en?: string;
}

export interface UpdateCategoryRequest {
  name_jp?: string;
  name_en?: string;
}

