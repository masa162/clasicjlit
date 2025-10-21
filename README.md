# 古の音（いにしえのね）- Inishie no Ne

**Japanese Classical Literature Audio Platform**

Experience authentic readings of Japanese classical literature by native speakers. This platform delivers timeless works like Genji Monogatari (源氏物語), Heike Monogatari (平家物語), and other masterpieces through high-quality audio narration.

---

## 📚 Project Overview

**Inishie no Ne** (古の音 - "Sounds of Antiquity") is a modern web platform designed to make Japanese classical literature accessible through audio. By combining native speaker narrations with a beautiful, minimalist interface, we aim to bring these timeless works to:

- International learners of Japanese language and culture
- Enthusiasts of Japanese classical literature
- Educators and students of Japanese studies

### Key Features

- 🎧 **Native Speaker Narrations**: Authentic readings of classical texts
- 🌏 **Bilingual Interface**: English and Japanese UI support
- ⚡ **Fast & Responsive**: Built on edge computing for global performance
- 🎛️ **Advanced Audio Controls**: Speed adjustment, seek, continuous playback
- 📱 **Mobile Optimized**: Seamless experience across all devices
- 🔒 **Secure Admin Panel**: Content management with Basic Authentication

---

## 🛠️ Technology Stack

### Core Framework
- **Next.js 14** (App Router) - React framework with SSG/SSR
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling

### Cloudflare Edge Platform
- **Cloudflare Pages** - Global CDN hosting
- **Cloudflare D1** - Serverless SQL database (SQLite)
- **Cloudflare R2** - Object storage for audio files
- **Cloudflare Workers** - Edge API routes

### Libraries & Tools
- `react-markdown` - Markdown content rendering
- `react-simplemde-editor` - Markdown editing for admin
- `uuid` - Unique identifier generation
- `@cloudflare/next-on-pages` - Next.js adapter for Cloudflare

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Wrangler CLI (Cloudflare's CLI tool)
- Cloudflare account (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd clasicjlit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and set:
   ```env
   BASIC_AUTH_USER=your_admin_username
   BASIC_AUTH_PASS=your_secure_password
   ```

4. **Set up Cloudflare D1 Database**
   ```bash
   # Create D1 database
   npx wrangler d1 create clasicjlit-db
   
   # Update wrangler.toml with the database_id
   # Run migrations
   npx wrangler d1 migrations apply clasicjlit-db --local
   npx wrangler d1 migrations apply clasicjlit-db --remote
   ```

5. **Set up Cloudflare R2 Bucket**
   ```bash
   npx wrangler r2 bucket create clasicjlit-audio
   npx wrangler r2 bucket create clasicjlit-audio-preview
   ```

### Development

**Option 1: Standard Next.js Development (without Cloudflare bindings)**
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

**Option 2: Local Development with Cloudflare Bindings (Recommended)**
```bash
npm run preview
```
This uses Wrangler to simulate the Cloudflare environment locally.

### Building for Production

```bash
# Build for Cloudflare Pages
npm run pages:build

# Deploy to Cloudflare Pages
npm run deploy
```

---

## 📁 Project Structure

```
clasicjlit/
├── db/
│   └── migrations/           # Database migration files
├── docs/                     # Project documentation
├── public/                   # Static assets
├── src/
│   ├── app/
│   │   ├── (frontend)/       # Public-facing pages
│   │   │   ├── page.tsx      # Home page
│   │   │   ├── works/        # Work listing & details
│   │   │   └── search/       # Search functionality
│   │   ├── admin/            # Admin panel (protected)
│   │   │   ├── authors/      # Author management
│   │   │   ├── categories/   # Category management
│   │   │   ├── chapters/     # Chapter management
│   │   │   └── works/        # Work management
│   │   ├── api/              # API routes (Cloudflare Workers)
│   │   │   ├── authors/
│   │   │   ├── categories/
│   │   │   ├── chapters/
│   │   │   ├── works/
│   │   │   └── upload/       # File upload to R2
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   ├── components/           # Shared React components
│   │   └── AudioPlayer.tsx   # Audio player component
│   ├── contexts/             # React contexts
│   │   └── i18n.tsx          # Internationalization
│   ├── lib/                  # Utility libraries
│   │   ├── d1.ts             # D1 database client
│   │   └── r2.ts             # R2 storage client
│   └── types/                # TypeScript type definitions
│       ├── database.ts       # Database models
│       ├── cloudflare.ts     # Cloudflare env types
│       └── i18n.ts           # i18n types
├── .gitignore
├── next.config.ts            # Next.js configuration
├── package.json
├── tailwind.config.ts        # Tailwind CSS config
├── tsconfig.json             # TypeScript config
└── wrangler.toml             # Cloudflare config
```

---

## 🗄️ Database Schema

The application uses Cloudflare D1 (SQLite) with the following schema:

### Tables
- **authors** - Author information (bilingual)
- **categories** - Content categories (bilingual)
- **works** - Literary works/books (bilingual)
- **chapters** - Individual audio chapters (bilingual)
- **chapter_categories** - Many-to-many relationship

All tables support Japanese (`_jp`) and English (`_en`) fields for full bilingual content.

See `db/migrations/0000_create_initial_tables.sql` for complete schema.

---

## 🔐 Admin Panel

Access the admin panel at `/admin` with Basic Authentication.

### Features
- Create, edit, and delete authors, works, chapters, and categories
- Upload audio files to Cloudflare R2
- Manage bilingual content (Japanese & English)
- Markdown editor for chapter content

---

## 🌍 Internationalization

The platform supports two languages:
- **English** (default) - Primary UI language
- **Japanese** - Alternative UI language

Content (narrations and articles) is primarily in Japanese, with optional English translations.

---

## 📝 License

This project is private and proprietary.

---

## 🤝 Contributing

This is a private project. For inquiries, please contact the project maintainer.

---

## 📞 Support

For technical issues or questions, please refer to:
- Project documentation in `/docs`
- [Next.js Documentation](https://nextjs.org/docs)
- [Cloudflare Developers](https://developers.cloudflare.com/)

---

**Built with ❤️ for preserving and sharing Japanese cultural heritage**
