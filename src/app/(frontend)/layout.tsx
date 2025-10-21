
import { I18nProvider, useI18n } from '@/contexts/i18n';
import Link from 'next/link';

function Header() {
  const { lang, setLang, t } = useI18n();

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">
        <Link href="/">古の音</Link>
      </h1>
      <div className="flex items-center">
        <form action="/search" method="get" className="hidden md:block">
          <input type="search" name="q" placeholder={`${t('search')}...`} className="text-black" />
          <button type="submit">{t('search')}</button>
        </form>
        <div className="ml-4">
          <button onClick={() => setLang(lang === 'en' ? 'ja' : 'en')}>
            {lang === 'en' ? '日本語' : 'English'}
          </button>
        </div>
      </div>
    </header>
  );
}

function SideNav() {
  const { t } = useI18n();
  return (
    <nav className="w-full md:w-64 bg-gray-200 p-4">
      <form action="/search" method="get" className="md:hidden mb-4">
        <input type="search" name="q" placeholder={`${t('search')}...`} className="text-black w-full" />
        <button type="submit" className="w-full bg-gray-800 text-white mt-2">{t('search')}</button>
      </form>
      <ul>
        <li>
          <Link href="/">{t('home')}</Link>
        </li>
        <li>
          <Link href="/authors">{t('authors')}</Link>
        </li>
        <li>
          <Link href="/categories">{t('categories')}</Link>
        </li>
      </ul>
    </nav>
  );
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-col md:flex-row flex-1">
          <SideNav />
          <main className="flex-1 p-4">{children}</main>
        </div>
        <footer className="bg-gray-800 text-white p-4 text-center">
          <p>&copy; 2025 古の音</p>
        </footer>
      </div>
    </I18nProvider>
  );
}