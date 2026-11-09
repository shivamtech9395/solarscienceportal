'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sun, Search, Volume2, Globe, Shield, HardHat, LogOut } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage, speakWelcome, isSpeaking, t } = useLanguage();
  const { isAdminAuthenticated, logoutAdmin, currentEmployee, logoutEmployee } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-sm text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-2">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center shadow-md shadow-amber-500/25 group-hover:scale-105 transition-transform">
              <Sun className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="font-extrabold text-xl leading-tight tracking-tight flex items-center gap-1.5 text-slate-900">
                <span>Solar<span className="text-amber-500">Science</span></span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200">
                  Portal
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 hidden sm:block">
                {t('brand_tagline')}
              </p>
            </div>
          </Link>

          {/* Center Public Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-3 text-sm font-semibold text-slate-600">
            <Link
              href="/"
              className={`px-3 py-2 rounded-xl transition-colors hover:text-amber-600 hover:bg-amber-50/60 ${
                pathname === '/' ? 'text-amber-600 font-bold' : ''
              }`}
            >
              {t('nav_home')}
            </Link>
            <Link
              href="/track"
              className={`px-3 py-2 rounded-xl transition-colors hover:text-amber-600 hover:bg-amber-50/60 ${
                pathname === '/track' ? 'text-amber-600 font-bold' : ''
              }`}
            >
              {t('nav_track')}
            </Link>
            <a
              href="/#calculator"
              className="px-3 py-2 rounded-xl transition-colors hover:text-amber-600 hover:bg-amber-50/60"
            >
              {t('nav_calculator')}
            </a>
            <a
              href="/#roadmap"
              className="px-3 py-2 rounded-xl transition-colors hover:text-amber-600 hover:bg-amber-50/60"
            >
              {language === 'hi' ? 'स्थापना चरण' : '8 Milestones'}
            </a>
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Audio Voice Welcome Trigger */}
            <button
              onClick={() => speakWelcome()}
              title="Listen to Company Welcome Greeting"
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                isSpeaking
                  ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse'
                  : 'bg-white text-amber-600 border-amber-200 hover:bg-amber-50'
              }`}
            >
              <Volume2 className="w-4 h-4 text-amber-500" />
              <span className="hidden lg:inline text-xs font-bold text-amber-800">
                {t('nav_speak')}
              </span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-bold border border-slate-200 flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* If Admin is Logged In */}
            {isAdminAuthenticated && (
              <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                <Link
                  href="/admin"
                  className="px-3 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-sm hover:bg-amber-400"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Admin
                </Link>
                <button
                  onClick={logoutAdmin}
                  title="Logout Admin"
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* If Employee is Logged In */}
            {currentEmployee && !isAdminAuthenticated && (
              <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                <Link
                  href="/employee"
                  className="px-3 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-sky-500"
                >
                  <HardHat className="w-3.5 h-3.5" />
                  <span className="max-w-[100px] truncate">{currentEmployee.name}</span>
                </Link>
                <button
                  onClick={logoutEmployee}
                  title="Logout Staff"
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Default CTA if not logged in as Admin or Employee */}
            {!isAdminAuthenticated && !currentEmployee && (
              <Link
                href="/track"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02]"
              >
                <Search className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="hidden sm:inline">{language === 'hi' ? 'लाइव ट्रैक' : 'Track Solar'}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
