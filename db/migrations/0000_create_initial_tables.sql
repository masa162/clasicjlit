-- Drop tables if they exist
DROP TABLE IF EXISTS chapter_categories;
DROP TABLE IF EXISTS chapters;
DROP TABLE IF EXISTS works;
DROP TABLE IF EXISTS authors;
DROP TABLE IF EXISTS categories;

-- Create authors table
CREATE TABLE authors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create works table
CREATE TABLE works (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author_id INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES authors(id)
);

-- Create chapters table
CREATE TABLE chapters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    work_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    audio_url TEXT,
    chapter_order INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (work_id) REFERENCES works(id)
);

-- Create chapter_categories join table
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
