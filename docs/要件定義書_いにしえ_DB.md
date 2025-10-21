```sql
-- Drop tables if they exist to ensure a clean state
DROP TABLE IF EXISTS chapter_categories;
DROP TABLE IF EXISTS chapters;
DROP TABLE IF EXISTS works;
DROP TABLE IF EXISTS authors;
DROP TABLE IF EXISTS categories;

-- Create authors table
-- 著者情報を格納します
CREATE TABLE authors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name_jp TEXT NOT NULL,
    name_en TEXT,
    bio_jp TEXT,
    bio_en TEXT,
    created_at TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now', 'localtime')),
    updated_at TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now', 'localtime'))
);

-- Create categories table
-- 作品のカテゴリを格納します
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name_jp TEXT NOT NULL UNIQUE,
    name_en TEXT UNIQUE,
    created_at TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now', 'localtime')),
    updated_at TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now', 'localtime'))
);

-- Create works table
-- 作品のメタデータを格納します
CREATE TABLE works (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author_id INTEGER NOT NULL,
    title_jp TEXT NOT NULL,
    title_en TEXT,
    description_jp TEXT,
    description_en TEXT,
    created_at TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now', 'localtime')),
    updated_at TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now', 'localtime')),
    FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE
);

-- Create chapters table
-- 各作品のチャプター（朗読コンテンツ）を格納します
CREATE TABLE chapters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    work_id INTEGER NOT NULL,
    chapter_order INTEGER NOT NULL,
    title_jp TEXT NOT NULL,
    title_en TEXT,
    audio_url TEXT NOT NULL,
    content_jp TEXT,
    content_en TEXT,
    duration_seconds INTEGER,
    created_at TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now', 'localtime')),
    updated_at TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now', 'localtime')),
    FOREIGN KEY (work_id) REFERENCES works(id) ON DELETE CASCADE
);

-- Create chapter_categories join table
-- チャプターとカテゴリの中間テーブルです
CREATE TABLE chapter_categories (
    chapter_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (chapter_id, category_id),
    FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_works_author_id ON works(author_id);
CREATE INDEX idx_chapters_work_id ON chapters(work_id);

```