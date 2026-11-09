'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Sun, 
  Search, 
  Zap, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Calculator, 
  TrendingUp, 
  Leaf, 
  IndianRupee, 
  Layers, 
  Star, 
  ArrowRight, 
  ChevronRight, 
  Award, 
  Clock, 
  Users, 
  PhoneCall,
  Volume2,
  Globe
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { SOLAR_INSTALLATION_STAGES } from '@/lib/constants';

export default function HomePage() {
  const router = useRouter();
  const { language, setLanguage, hasChosenLang, chooseInitialLanguage, speakWelcome, t } = useLanguage();

  // Search input for Customer Live Tracker
  const [trackQuery, setTrackQuery] = useState('');

  // Solar Calculator State
  const [monthlyBill, setMonthlyBill] = useState<number>(4500);

  // Derived Solar Calculations
  const recommendedKW = Math.max(1, parseFloat((monthlyBill / 900).toFixed(1)));
  const monthlySavings = Math.round(monthlyBill * 0.92);
  const lifetimeSavings = Math.round(monthlySavings * 12 * 25);
  const co2ReductionTons = Math.round(recommendedKW * 1.3 * 25);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackQuery.trim()) return;
    router.push(`/track?query=${encodeURIComponent(trackQuery.trim())}`);
  };

  const sampleReviews = [
    {
      name: 'Ramesh Chandra Sharma',
      city: 'Rohini, New Delhi',
      system: '5.0 kW Rooftop',
      rating: 5,
      comment: 'Superb transparency! Through this portal, I watched every stage: shadow survey, structure, wiring, and meter change. Engineer Vikram did clean electrical wiring.',
      date: '2 days ago'
    },
    {
      name: 'Sunita Singhania',
      city: 'DLF Cyber City, Gurugram',
      system: '10.0 kW Commercial',
      rating: 5,
      comment: 'Very professional team. Got my DISCOM net-metering feasibility approved in just 4 days. Bill reduced from ₹18,000 to almost zero!',
      date: '1 week ago'
    },
    {
      name: 'Col. Rajesh Bakshi',
      city: 'Noida Sector 62',
      system: '3.5 kW Residential',
      rating: 5,
      comment: 'The mobile live status tracker is just like Amazon delivery tracking. Great customer experience and solid heavy galvanized iron structure.',
      date: '2 weeks ago'
    }
  ];

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen">
      {/* INITIAL WELCOME LANGUAGE SELECTION MODAL */}
      {!hasChosenLang && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-200 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-300">
              <Sun className="w-9 h-9 text-amber-600 animate-spin" style={{ animationDuration: '20s' }} />
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 mb-2">
              Welcome to SolarScience Portal
            </h3>
            <p className="text-xs text-slate-600 mb-6">
              Please choose your preferred language to proceed / कृपया अपनी भाषा चुनें:
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => chooseInitialLanguage('en')}
                className="p-4 rounded-2xl border-2 border-amber-400 bg-amber-50 hover:bg-amber-100 text-slate-900 font-bold text-sm transition-all shadow-sm hover:scale-[1.02] flex flex-col items-center gap-1"
              >
                <span className="text-base">English</span>
                <span className="text-[11px] text-amber-700 font-normal">Welcome greeting</span>
              </button>

              <button
                onClick={() => chooseInitialLanguage('hi')}
                className="p-4 rounded-2xl border-2 border-amber-400 bg-amber-50 hover:bg-amber-100 text-slate-900 font-bold text-sm transition-all shadow-sm hover:scale-[1.02] flex flex-col items-center gap-1"
              >
                <span className="text-base">हिन्दी</span>
                <span className="text-[11px] text-amber-700 font-normal">ध्वनि स्वागत संदेश</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <Volume2 className="w-3.5 h-3.5 text-amber-500" />
              Includes 10-second voice greeting of company name
            </p>
          </div>
        </div>
      )}

      {/* HERO SECTION WITH LIVE ROOFTOP TRACKER */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-amber-100/60 via-amber-50/40 to-slate-50 border-b border-amber-200/50">
        <div className="absolute top-0 right-10 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-amber-800 text-xs font-extrabold shadow-sm border border-amber-200 mb-5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              {language === 'hi' ? 'प्रमाणित रूफटॉप सोलर EPC एवं लाइव ट्रैकिंग' : 'Certified Rooftop Solar EPC & Milestone Tracking'}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 mb-5 leading-[1.15]">
              {t('hero_title')}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8">
              {t('hero_sub')}
            </p>

            {/* LIVE CUSTOMER TRACKER SEARCH CARD */}
            <div className="max-w-2xl mx-auto bg-white p-3 sm:p-4 rounded-3xl shadow-xl shadow-amber-500/10 border-2 border-amber-300">
              <div className="flex items-center justify-between px-2 mb-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-amber-600" />
                  {language === 'hi' ? 'अपने सोलर प्रोजेक्ट का लाइव स्टेटस देखें:' : 'Track Live Installation Progress:'}
                </span>
                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  ● Realtime Live
                </span>
              </div>

              <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={trackQuery}
                    onChange={(e) => setTrackQuery(e.target.value)}
                    placeholder={t('track_input_ph')}
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-extrabold text-sm shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2 whitespace-nowrap hover:scale-[1.02]"
                >
                  <Search className="w-4 h-4 stroke-[2.5]" />
                  <span>{t('track_btn')}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-8">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-center">
              <p className="text-2xl font-black text-slate-900">550+ kW</p>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">Rooftop Solar Installed</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-center">
              <p className="text-2xl font-black text-amber-600">90%</p>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">Average Bill Reduction</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-center">
              <p className="text-2xl font-black text-emerald-600">25 Years</p>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">Performance Warranty</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-center">
              <p className="text-2xl font-black text-sky-600">4.9 / 5.0</p>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">Customer Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* SOLAR ROI & SAVINGS CALCULATOR SECTION */}
      <section id="calculator" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white border border-amber-200/80 shadow-xl shadow-amber-500/5 p-6 sm:p-10 relative overflow-hidden">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 mb-3">
              <Calculator className="w-3.5 h-3.5 text-amber-500" />
              {t('calc_title')}
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
              {language === 'hi' ? 'जानिए सोलर से आपकी कितनी बचत होगी' : 'Estimate Your Rooftop Solar Potential'}
            </h2>
            <p className="text-sm text-slate-600">
              {t('calc_desc')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Input Slider */}
            <div className="lg:col-span-5 space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div>
                <label className="flex items-center justify-between text-sm font-bold text-slate-800 mb-2">
                  <span>{t('calc_bill_label')}</span>
                  <span className="text-xl font-extrabold text-amber-600">₹{monthlyBill.toLocaleString('en-IN')}</span>
                </label>
                <input
                  type="range"
                  min="1500"
                  max="30000"
                  step="500"
                  value={monthlyBill}
                  onChange={(e) => setMonthlyBill(parseInt(e.target.value, 10))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-semibold">
                  <span>₹1,500</span>
                  <span>₹15,000</span>
                  <span>₹30,000+</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                💡 <strong>PM Surya Ghar Muft Bijli Yojana:</strong> Eligible homeowners can get government subsidy up to ₹78,000 directly deposited to bank accounts!
              </div>

              <Link
                href="/track"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition-all"
              >
                <span>Track or Book Free Rooftop Survey</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Calculated Output Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200/90 shadow-sm">
                <div className="flex items-center gap-2 text-amber-700 text-xs font-bold mb-1">
                  <Sun className="w-4 h-4 text-amber-500" />
                  {t('calc_kw_rec')}
                </div>
                <p className="text-3xl font-black text-slate-900 mt-2">{recommendedKW} kW</p>
                <p className="text-xs text-slate-500 mt-1">Requires ~{Math.round(recommendedKW * 90)} sq.ft roof area</p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200/90 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold mb-1">
                  <IndianRupee className="w-4 h-4 text-emerald-500" />
                  {t('calc_month_save')}
                </div>
                <p className="text-3xl font-black text-emerald-700 mt-2">₹{monthlySavings.toLocaleString('en-IN')}</p>
                <p className="text-xs text-slate-500 mt-1">Saves ~90% on monthly electric bills</p>
              </div>

              <div className="p-5 rounded-2xl bg-sky-50 border border-sky-200/90 shadow-sm">
                <div className="flex items-center gap-2 text-sky-700 text-xs font-bold mb-1">
                  <TrendingUp className="w-4 h-4 text-sky-500" />
                  {t('calc_year_save')}
                </div>
                <p className="text-3xl font-black text-sky-800 mt-2">₹{(lifetimeSavings / 100000).toFixed(1)} Lakhs</p>
                <p className="text-xs text-slate-500 mt-1">ROI guaranteed in less than 3.5 years</p>
              </div>

              <div className="p-5 rounded-2xl bg-teal-50 border border-teal-200/90 shadow-sm">
                <div className="flex items-center gap-2 text-teal-700 text-xs font-bold mb-1">
                  <Leaf className="w-4 h-4 text-teal-500" />
                  {t('calc_co2')}
                </div>
                <p className="text-3xl font-black text-teal-800 mt-2">{co2ReductionTons} Tons</p>
                <p className="text-xs text-slate-500 mt-1">Equivalent to planting ~{co2ReductionTons * 16} trees</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8-STAGE ROADMAP ROADMAP SECTION */}
      <section id="roadmap" className="py-16 bg-gradient-to-b from-white to-slate-50 border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-3 border border-amber-200">
              <Layers className="w-3.5 h-3.5 text-amber-500" />
              {t('roadmap_title')}
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
              {language === 'hi' ? 'छत के सर्वे से लेकर ग्रिड ऑन होने तक 8 पारदर्शी चरण' : 'How We Power Your Rooftop: Step-by-Step SOP'}
            </h2>
            <p className="text-slate-600 text-sm">
              {t('roadmap_sub')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SOLAR_INSTALLATION_STAGES.map((stg) => (
              <div
                key={stg.stageNumber}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center shadow-sm">
                      #{stg.stageNumber}
                    </span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                      {stg.requiredRole}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 mb-2 leading-snug">
                    {stg.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    {stg.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-600">
                  <p className="font-semibold text-amber-700 flex items-center gap-1 mb-1">
                    <CheckCircle2 className="w-3 h-3 text-amber-500" /> Key Checklist:
                  </p>
                  <p className="truncate text-slate-500">• {stg.defaultChecklist[0]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VERIFIED CUSTOMER REVIEWS & 5-STAR RATINGS */}
      <section id="reviews" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-3">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            {t('reviews_title')}
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
            {language === 'hi' ? 'संतुष्ट ग्राहकों के अनुभव एवं रेटिंग्स' : 'Loved by 450+ Rooftop Homeowners'}
          </h2>
          <p className="text-slate-600 text-sm">{t('reviews_sub')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sampleReviews.map((rev, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-1">5.0</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4 italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{rev.name}</h4>
                  <p className="text-[10px] text-slate-500">{rev.city} • {rev.system}</p>
                </div>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Verified Client
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
