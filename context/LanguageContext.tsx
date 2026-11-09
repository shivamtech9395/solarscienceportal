'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  speakWelcome: (lang?: Language) => void;
  isSpeaking: boolean;
  hasChosenLang: boolean;
  chooseInitialLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    brand_tagline: "Smart Rooftop Solar & Milestone Tracking",
    nav_home: "Home",
    nav_track: "Track Installation",
    nav_features: "Features",
    nav_calculator: "Solar Calculator",
    nav_speak: "Listen Welcome",
    hero_title: "Power Your Home With Clean Rooftop Solar",
    hero_sub: "Experience transparent, milestone-by-milestone rooftop solar installation. Track site survey, DISCOM net-metering, and grid commissioning live on your phone.",
    track_input_ph: "Enter Registered Mobile Number (e.g. 9810012345)...",
    track_btn: "Track My Solar Site",
    calc_title: "Calculate Your Solar Savings & Capacity",
    calc_desc: "Enter your average monthly electricity bill to calculate required rooftop solar capacity and 25-year financial savings.",
    calc_bill_label: "Monthly Electricity Bill (₹)",
    calc_kw_rec: "Recommended Solar Capacity",
    calc_month_save: "Monthly Bill Savings",
    calc_year_save: "25-Year Cumulative Savings",
    calc_co2: "CO₂ Lifetime Reduction",
    roadmap_title: "Transparent 8-Stage Solar Roadmap",
    roadmap_sub: "From rooftop feasibility survey to electricity board net-meter synchronization.",
    reviews_title: "What Our Solar Clients Say",
    reviews_sub: "Real reviews and ratings from residential and commercial rooftop owners.",
    footer_rights: "© 2026 SolarSciencePortal. Certified Clean Energy EPC.",
    footer_staff_login: "Field Staff Portal Login",
    footer_admin_login: "Admin Operations Dispatch",
    modal_welcome_title: "Welcome to SolarScience Portal",
    modal_welcome_sub: "Please choose your preferred language to proceed / कृपया अपनी भाषा चुनें:",
    lang_en: "English",
    lang_hi: "हिन्दी (Hindi)",
  },
  hi: {
    brand_tagline: "सोलर रूफटॉप एवं कर्मचारी ट्रैकिंग सिस्टम",
    nav_home: "मुख्य पृष्ठ",
    nav_track: "सोलर ट्रैक करें",
    nav_features: "सुविधाएं",
    nav_calculator: "सोलर कैलकुलेटर",
    nav_speak: "स्वागत संदेश सुनें",
    hero_title: "स्वच्छ सोलर ऊर्जा से अपने घर को बनाएं आत्मनिर्भर",
    hero_sub: "सोलर पैनल स्थापना की पारदर्शी एवं सुरक्षित प्रक्रिया। साइट सर्वे से लेकर डिस्कॉम नेट-मीटरिंग और ग्रिड चालू होने तक हर कदम अपने फोन पर लाइव ट्रैक करें।",
    track_input_ph: "अपना पंजीकृत मोबाइल नंबर दर्ज करें (उदा. 9810012345)...",
    track_btn: "लाइव सोलर ट्रैक करें",
    calc_title: "सोलर क्षमता एवं बिजली बचत कैलकुलेटर",
    calc_desc: "अपना मासिक बिजली बिल दर्ज करें और जानें कि आपकी छत के लिए कितने किलोवाट का सोलर सिस्टम उपयुक्त है।",
    calc_bill_label: "औसत मासिक बिजली बिल (₹)",
    calc_kw_rec: "अनुशंसित सोलर क्षमता",
    calc_month_save: "मासिक बिजली बिल में बचत",
    calc_year_save: "25 वर्षों में कुल बचत",
    calc_co2: "जीवनकाल में कार्बन उत्सर्जन कमी",
    roadmap_title: "सोलर पैनल स्थापना के 8 प्रमाणित चरण",
    roadmap_sub: "छत के सर्वे से लेकर बिजली विभाग के नेट-मीटरिंग मीटर तक संपूर्ण पारदर्शिता।",
    reviews_title: "हमारे संतुष्ट ग्राहकों के विचार एवं रेटिंग",
    reviews_sub: "घर और व्यापारिक प्रतिष्ठानों पर सोलर लगाने वाले ग्राहकों के सत्यापित अनुभव।",
    footer_rights: "© 2026 सोलर साइंस पोर्टल। प्रमाणित सौर ऊर्जा समाधान।",
    footer_staff_login: "कर्मचारी / फील्ड स्टाफ लॉगिन",
    footer_admin_login: "प्रशासनिक (Admin) लॉगिन",
    modal_welcome_title: "सोलर साइंस पोर्टल में आपका स्वागत है",
    modal_welcome_sub: "कृपया आगे बढ़ने के लिए अपनी पसंदीदा भाषा चुनें:",
    lang_en: "English",
    lang_hi: "हिन्दी (Hindi)",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasChosenLang, setHasChosenLang] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('solar_lang') as Language;
    if (saved) {
      setLanguageState(saved);
      setHasChosenLang(true);
    } else {
      setHasChosenLang(false);
    }
  }, []);

  const speakWelcome = (targetLang?: Language) => {
    const lang = targetLang || language;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const text =
      lang === 'hi'
        ? "सोलर साइंस पोर्टल में आपका स्वागत है। स्वच्छ और आत्मनिर्भर सौर ऊर्जा में आपका विश्वसनीय साथी।"
        : "Welcome to SolarScience Portal. Powering your rooftop with smart, clean solar energy.";

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('solar_lang', lang);
  };

  const chooseInitialLanguage = (lang: Language) => {
    setLanguage(lang);
    setHasChosenLang(true);
    // Voice welcome announcement upon selecting language
    setTimeout(() => {
      speakWelcome(lang);
    }, 400);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        speakWelcome,
        isSpeaking,
        hasChosenLang,
        chooseInitialLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
