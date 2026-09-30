"use client";

import { useLanguage } from '../context/LanguageContext';

// INSTANT DICTIONARY: 0 API Calls
const dict = {
  en: { "Confirm Logout": "Confirm Logout", "Are you sure you want to logout?": "Are you sure you want to logout?", "Cancel": "Cancel", "Logout": "Logout" },
  hi: { "Confirm Logout": "लॉग आउट की पुष्टि करें", "Are you sure you want to logout?": "क्या आप वाकई लॉग आउट करना चाहते हैं?", "Cancel": "रद्द करें", "Logout": "लॉग आउट" },
  te: { "Confirm Logout": "లాగ్ అవుట్ నిర్ధారించండి", "Are you sure you want to logout?": "మీరు ఖచ్చితంగా లాగ్ అవుట్ చేయాలనుకుంటున్నారా?", "Cancel": "రద్దు చేయి", "Logout": "లాగ్ అవుట్" },
  ta: { "Confirm Logout": "வெளியேறுதலை உறுதிப்படுத்தவும்", "Are you sure you want to logout?": "நீங்கள் நிச்சயமாக வெளியேற வேண்டுமா?", "Cancel": "ரத்துசெய்", "Logout": "வெளியேறு" },
  mr: { "Confirm Logout": "लॉगआउटची पुष्टी करा", "Are you sure you want to logout?": "तुम्हाला नक्की लॉगआउट करायचे आहे का?", "Cancel": "रद्द करा", "Logout": "लॉगआउट" },
  gu: { "Confirm Logout": "લૉગઆઉટની પુષ્ટિ કરો", "Are you sure you want to logout?": "શું તમે ખરેખર લૉગઆઉટ કરવા માંગો છો?", "Cancel": "રદ કરો", "Logout": "લૉગઆઉટ" },
  pa: { "Confirm Logout": "ਲੌਗਆਊਟ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ", "Are you sure you want to logout?": "ਕੀ ਤੁਸੀਂ ਯਕੀਨੀ ਤੌਰ 'ਤੇ ਲੌਗਆਊਟ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ?", "Cancel": "ਰੱਦ ਕਰੋ", "Logout": "ਲੌਗਆਊਟ" },
  ml: { "Confirm Logout": "ലോഗൗട്ട് സ്ഥിരീകരിക്കുക", "Are you sure you want to logout?": "നിങ്ങൾക്ക് ലോഗൗട്ട് ചെയ്യണമെന്ന് ഉറപ്പാണോ?", "Cancel": "റദ്ദാക്കുക", "Logout": "ലോഗൗട്ട്" }
};

const getLangKey = (lang) => {
  const l = (lang || 'en').toLowerCase();
  if (l.includes('te')) return 'te';
  if (l.includes('hi')) return 'hi';
  if (l.includes('ta')) return 'ta';
  if (l.includes('mr')) return 'mr';
  if (l.includes('gu')) return 'gu';
  if (l.includes('pa')) return 'pa';
  if (l.includes('ml')) return 'ml';
  return 'en';
};

export default function LogoutModal({ open, onConfirm, onCancel }) {
  const { language } = useLanguage();
  const t = (key) => dict[getLangKey(language)]?.[key] || key;

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2 className="modal-title">{t("Confirm Logout")}</h2>

        <p className="modal-text">
          {t("Are you sure you want to logout?")}
        </p>

        <div className="modal-actions">
          <button
            className="modal-cancel-btn"
            onClick={onCancel}
          >
            {t("Cancel")}
          </button>

          <button
            className="modal-logout-btn"
            onClick={onConfirm}
          >
            {t("Logout")}
          </button>
        </div>
      </div>
    </div>
  );
}
