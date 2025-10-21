-- Drop tables if they exist
DROP TABLE IF EXISTS chapter_categories;
DROP TABLE IF EXISTS chapters;
DROP TABLE IF EXISTS works;
DROP TABLE IF EXISTS authors;
DROP TABLE IF EXISTS categories;

-- Create authors table
CREATE TABLE authors (
    id TEXT PRIMARY KEY,
    name_jp TEXT NOT NULL,
    name_en TEXT,
    bio_jp TEXT,
    bio_en TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Create categories table
CREATE TABLE categories (
    id TEXT PRIMARY KEY,
    name_jp TEXT NOT NULL,
    name_en TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Create works table
CREATE TABLE works (
    id TEXT PRIMARY KEY,
    author_id TEXT NOT NULL,
    title_jp TEXT NOT NULL,
    title_en TEXT,
    description_jp TEXT,
    description_en TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE
);

-- Create chapters table
CREATE TABLE chapters (
    id TEXT PRIMARY KEY,
    work_id TEXT NOT NULL,
    chapter_order INTEGER NOT NULL,
    title_jp TEXT NOT NULL,
    title_en TEXT,
    audio_url TEXT NOT NULL,
    content_jp TEXT,
    content_en TEXT,
    duration_seconds INTEGER,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (work_id) REFERENCES works(id) ON DELETE CASCADE
);

-- Create chapter_categories join table
CREATE TABLE chapter_categories (
    chapter_id TEXT NOT NULL,
    category_id TEXT NOT NULL,
    PRIMARY KEY (chapter_id, category_id),
    FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_works_author_id ON works(author_id);
CREATE INDEX idx_chapters_work_id ON chapters(work_id);
CREATE INDEX idx_chapters_order ON chapters(work_id, chapter_order);
