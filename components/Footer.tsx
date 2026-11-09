'use client';

import Link from 'next/link';
import { Sun, Shield, HardHat, Phone, Mail, MapPin, Award, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center shadow-md shadow-amber-500/20">
                <Sun className="w-5 h-5 text-slate-950 font-bold" />
              </div>
              <span className="font-extrabold text-lg text-white">
                Solar<span className="text-amber-400">Science</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'hi'
                ? 'भारत की प्रमुख सौर ऊर्जा EPC कंपनी। प्रमाणित इंजीनियरिंग, गुणवत्तापूर्ण सामग्री, और लाइव मोबाइल ट्रैकिंग के साथ आपकी छत को बनाएं आत्मनिर्भर।'
                : 'India’s premier Rooftop Solar EPC specialist. Certified Tier-1 components, guaranteed 25-year performance, and real-time mobile tracking.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <Award className="w-4 h-4" />
              <span>MNRE & PM Surya Ghar Certified</span>
            </div>
          </div>

          {/* Quick Customer Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              {language === 'hi' ? 'ग्राहक सेवाएं' : 'Customer Services'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/track" className="hover:text-amber-400 transition-colors">
                  {language === 'hi' ? 'लाइव रूफटॉप सोलर ट्रैकिंग' : 'Live Installation Tracker'}
                </Link>
              </li>
              <li>
                <a href="/#calculator" className="hover:text-amber-400 transition-colors">
                  {language === 'hi' ? 'सोलर बचत कैलकुलेटर' : 'Solar Savings Estimator'}
                </a>
              </li>
              <li>
                <a href="/#roadmap" className="hover:text-amber-400 transition-colors">
                  {language === 'hi' ? '8-चरणीय स्थापना प्रक्रिया' : '8-Stage SOP Roadmap'}
                </a>
              </li>
              <li>
                <a href="/#reviews" className="hover:text-amber-400 transition-colors">
                  {language === 'hi' ? 'ग्राहक समीक्षा एवं रेटिंग' : 'Client Reviews & Ratings'}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              {language === 'hi' ? 'संपर्क एवं सहायता' : 'Help & Support'}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>+91 1800-889-SOLAR (Toll-Free)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>care@solarscienceportal.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Solar EPC Tower, Cyber City, India</span>
              </li>
            </ul>
          </div>

          {/* Internal Portals (Discrete & Separated for Company Personnel) */}
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              {language === 'hi' ? 'आंतरिक स्टाफ पोर्टल' : 'Authorized Personnel'}
            </h4>
            <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
              {language === 'hi'
                ? 'यह लॉगिन केवल कंपनी के प्रमाणित इंजीनियरों एवं प्रबंधकों के लिए है।'
                : 'Restricted access for field technicians, engineers, and operational staff.'}
            </p>

            <div className="space-y-2">
              <Link
                href="/employee/login"
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 font-semibold text-xs flex items-center justify-between transition-colors border border-slate-700/80"
              >
                <span className="flex items-center gap-1.5">
                  <HardHat className="w-3.5 h-3.5 text-sky-400" />
                  {t('footer_staff_login')}
                </span>
                <span className="text-[10px] text-slate-400">Login →</span>
              </Link>

              <Link
                href="/admin/login"
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs flex items-center justify-between transition-colors border border-slate-700/80"
              >
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  {t('footer_admin_login')}
                </span>
                <span className="text-[10px] text-slate-400">Login →</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright & status */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>{t('footer_rights')}</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle className="w-3 h-3" /> System Operational
            </span>
            <span>Security Protected</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
