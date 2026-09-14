import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Volume2, VolumeX, Clock, ShieldCheck, Sparkles, Settings, Globe, Zap, Shield, FileText, ChevronLeft, ExternalLink } from 'lucide-react';
import { GameSettings } from '../types';
import { sound } from '../utils/audio';
import { AR_STRINGS, EN_STRINGS } from '../data/translations';
import { PRIVACY_POLICY_URL } from '../config/privacy';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const isEn = settings.language === 'en';
  const t = isEn ? EN_STRINGS : AR_STRINGS;
  const isRtl = !isEn;

  const handleSetLanguage = (lang: 'ar' | 'en') => {
    sound.playClick();
    onUpdateSettings({ ...settings, language: lang });
  };

  const handleToggleSound = () => {
    sound.playClick();
    const updated = !settings.soundEnabled;
    sound.setMuted(!updated);
    onUpdateSettings({ ...settings, soundEnabled: updated });
  };

  const handleSetTimer = (minutes: number) => {
    sound.playClick();
    onUpdateSettings({ ...settings, timerMinutes: minutes });
  };

  const handleToggleSecretBallot = () => {
    sound.playClick();
    onUpdateSettings({ ...settings, secretBallotMode: !settings.secretBallotMode });
  };

  const handleToggleFastVoting = () => {
    sound.playClick();
    onUpdateSettings({ ...settings, fastVotingMode: !settings.fastVotingMode });
  };

  const [showPrivacyViewer, setShowPrivacyViewer] = useState(false);

  const handleOpenPrivacyPolicy = () => {
    sound.playClick();
    if (PRIVACY_POLICY_URL) {
      window.open(PRIVACY_POLICY_URL, '_blank', 'noopener,noreferrer');
      return;
    }
    setShowPrivacyViewer(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 pt-safe pb-safe" dir={isRtl ? 'rtl' : 'ltr'}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg rounded-[28px] bg-[#0d0f16] border-2 border-[#c8923a]/50 p-5 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.9)] flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
      >
        {showPrivacyViewer ? (
          /* Privacy Policy Viewer Sub-view */
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-amber-900/30 pb-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setShowPrivacyViewer(false);
                  }}
                  className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-[#e5b35a] border border-[#c8923a]/50 flex items-center justify-center cursor-pointer transition-all"
                  title={isRtl ? 'رجوع' : 'Back'}
                >
                  <ChevronLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                </button>
                <div className="w-8 h-8 rounded-full bg-black/60 border border-[#c8923a]/60 flex items-center justify-center text-[#f3cb79]">
                  <Shield className="w-4 h-4" />
                </div>
                <h3 className={`text-base sm:text-lg font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-[#f5ebd9]`}>
                  {t.privacyPolicyTitle}
                </h3>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  setShowPrivacyViewer(false);
                  onClose();
                }}
                className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-[#e5b35a] border border-[#c8923a]/50 flex items-center justify-center cursor-pointer transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Policy Summary Content */}
            <div className={`flex flex-col gap-3 text-xs sm:text-sm text-[#d4cfc7] bg-black/40 border border-[#7a5c2b]/40 rounded-2xl p-4 leading-relaxed ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
              <div className="flex items-center gap-2 text-[#f3cb79] font-bold pb-1 border-b border-amber-900/20">
                <span>Secret Killer (سيكرت كيلر)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-900/30 text-[#e5b35a]">v1.0</span>
              </div>

              {isRtl ? (
                <>
                  <p>
                    <strong className="text-white">اللعب بدون إنترنت والتخزين المحلي:</strong> تعمل اللعبة بنظام Pass-and-Play دون الحاجة لتسجيل حساب أو بيانات هوية. تُحفظ إعداداتك والقضايا المخصصة محلياً على جهازك فقط.
                  </p>
                  <p>
                    <strong className="text-white">التقييمات والملاحظات (Firebase):</strong> إرسال التقييمات اختياري تماماً. تُرسل الملاحظات مشفرة عبر HTTPS/TLS إلى قاعدة بيانات Firestore المخصصة لتحسين اللعبة دون أي بيانات هوية.
                  </p>
                  <p>
                    <strong className="text-white">الإعلانات (Google AdMob):</strong> يعرض التطبيق إعلانات بانر على الشاشة الرئيسية وإعلانات بينية أثناء الانتقالات بين الجولات وفقاً لسياسات Google وتفضيلات الموافقة (UMP).
                  </p>
                  <p>
                    <strong className="text-white">معالجة الذكاء الاصطناعي (Gemini):</strong> لا يتم إرسال أي نصوص أو بيانات لعب أو تسجيلات من تطبيق الهاتف إلى نماذج الذكاء الاصطناعي.
                  </p>
                  <p>
                    <strong className="text-white">حذف البيانات:</strong> يمكنك حذف البيانات المحلية بمسح بيانات التطبيق من جهازك، أو طلب حذف التقييمات عبر التواصل مع المطور.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong className="text-white">Offline Play & Local Storage:</strong> Secret Killer is a pass-and-play party game that requires no account or login. All game settings and custom cases remain on your device.
                  </p>
                  <p>
                    <strong className="text-white">Ratings & Feedback (Firebase):</strong> Submitting ratings or feedback is entirely voluntary. Data is encrypted in transit (HTTPS/TLS) to Firestore for product improvement without personal identifiers.
                  </p>
                  <p>
                    <strong className="text-white">Advertising (Google AdMob):</strong> Displays Home banner ads and transition interstitials in compliance with Google policies and Google UMP consent standards.
                  </p>
                  <p>
                    <strong className="text-white">AI / Gemini Processing:</strong> No user-created story text, audio, or gameplay data is transmitted to AI models or Gemini from the mobile app.
                  </p>
                  <p>
                    <strong className="text-white">Data Deletion:</strong> Clear app storage in Android settings to remove local data, or contact support to request deletion of submitted feedback.
                  </p>
                </>
              )}

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  window.open(PRIVACY_POLICY_URL || './privacy.html', '_blank', 'noopener,noreferrer');
                }}
                className="mt-2 w-full py-2.5 px-3 rounded-xl bg-black/60 hover:bg-black/90 border border-[#c8923a]/50 text-[#f3cb79] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{isRtl ? 'عرض الصفحة الكاملة في المتصفح' : 'Open Full Policy in Browser'}</span>
              </button>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                setShowPrivacyViewer(false);
              }}
              className={`w-full py-3 rounded-2xl bg-gradient-to-r from-[#d49e3d] via-[#f1bf66] to-[#c8923a] text-slate-950 font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-sm shadow-md cursor-pointer`}
            >
              {isRtl ? 'العودة للإعدادات' : 'Back to Settings'}
            </button>
          </div>
        ) : (
          /* Normal Settings View */
          <>
            <div className="flex items-center justify-between border-b border-amber-900/30 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-black/60 border border-[#c8923a]/60 flex items-center justify-center text-[#f3cb79]">
                  <Settings className="w-5 h-5" />
                </div>
                <h3 className={`text-xl font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-[#f5ebd9]`}>
                  {t.gameSettings}
                </h3>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-[#e5b35a] border border-[#c8923a]/50 flex items-center justify-center cursor-pointer transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Setting options */}
            <div className={`flex flex-col gap-3 ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
              {/* Language Selector (Arabic / English) */}
              <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-black/40 border border-[#c8923a]/60 shadow-inner">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#e5b35a]" />
                    <span className="text-sm sm:text-base font-black text-[#f5ebd9]">{t.languageSelect}</span>
                  </div>
                  <span className="text-xs text-[#f3cb79] font-black uppercase">{settings.language || 'ar'}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleSetLanguage('ar')}
                    className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      settings.language !== 'en'
                        ? 'bg-gradient-to-r from-[#d49e3d] to-[#c8923a] text-slate-950 font-bold shadow-md'
                        : 'bg-black/60 text-[#d4cfc7] border border-[#7a5c2b]/40 hover:border-[#c8923a]'
                    }`}
                  >
                    <span>🇸🇦</span>
                    <span>{t.arabicLang}</span>
                  </button>
                  <button
                    onClick={() => handleSetLanguage('en')}
                    className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      settings.language === 'en'
                        ? 'bg-gradient-to-r from-[#d49e3d] to-[#c8923a] text-slate-950 font-bold shadow-md'
                        : 'bg-black/60 text-[#d4cfc7] border border-[#7a5c2b]/40 hover:border-[#c8923a]'
                    }`}
                  >
                    <span>🇺🇸</span>
                    <span>{t.englishLang}</span>
                  </button>
                </div>
              </div>

              {/* Sound Effects */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/40 border border-[#7a5c2b]/40">
                <div>
                  <span className="text-sm sm:text-base font-black text-[#f5ebd9] block">{t.soundEffects}</span>
                  <span className="text-xs text-[#a39a8c]">{t.soundEffectsDesc}</span>
                </div>
                <button
                  onClick={handleToggleSound}
                  className={`w-13 h-7 rounded-full transition-colors relative cursor-pointer border border-[#c8923a]/40 shrink-0 ${
                    settings.soundEnabled ? 'bg-[#c8923a]' : 'bg-black/60'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-slate-950 transition-transform absolute top-0.5 ${
                      settings.soundEnabled ? (isRtl ? 'left-1' : 'right-1') : (isRtl ? 'left-6' : 'right-6')
                    }`}
                  />
                </button>
              </div>

              {/* Timer per round */}
              <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-black/40 border border-[#7a5c2b]/40">
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base font-black text-[#f5ebd9]">{t.discussionTimer}</span>
                  <span className="text-xs text-[#f3cb79] font-black">{settings.timerMinutes} {t.minutes}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {[2, 3, 5, 8].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => handleSetTimer(mins)}
                      className={`py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                        settings.timerMinutes === mins
                          ? 'bg-[#c8923a] text-slate-950 shadow-md'
                          : 'bg-black/60 text-[#d4cfc7] border border-[#7a5c2b]/40 hover:border-[#c8923a]'
                      }`}
                    >
                      {mins} {t.minShort}
                    </button>
                  ))}
                </div>
              </div>

              {/* Secret ballot mode */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/40 border border-[#7a5c2b]/40">
                <div>
                  <span className="text-sm sm:text-base font-black text-[#f5ebd9] block">{t.secretBallot}</span>
                  <span className="text-xs text-[#a39a8c]">{t.secretBallotDesc}</span>
                </div>
                <button
                  onClick={handleToggleSecretBallot}
                  className={`w-13 h-7 rounded-full transition-colors relative cursor-pointer border border-[#c8923a]/40 shrink-0 ${
                    settings.secretBallotMode ? 'bg-[#c8923a]' : 'bg-black/60'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-slate-950 transition-transform absolute top-0.5 ${
                      settings.secretBallotMode ? (isRtl ? 'left-1' : 'right-1') : (isRtl ? 'left-6' : 'right-6')
                    }`}
                  />
                </button>
              </div>

              {/* Fast voting mode */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/40 border border-[#7a5c2b]/40">
                <div>
                  <span className="text-sm sm:text-base font-black text-[#f5ebd9] block">{t.fastVoting}</span>
                  <span className="text-xs text-[#a39a8c]">{t.fastVotingDesc}</span>
                </div>
                <button
                  onClick={handleToggleFastVoting}
                  className={`w-13 h-7 rounded-full transition-colors relative cursor-pointer border border-[#c8923a]/40 shrink-0 ${
                    settings.fastVotingMode ? 'bg-[#c8923a]' : 'bg-black/60'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-slate-950 transition-transform absolute top-0.5 ${
                      settings.fastVotingMode ? (isRtl ? 'left-1' : 'right-1') : (isRtl ? 'left-6' : 'right-6')
                    }`}
                  />
                </button>
              </div>

              {/* Privacy Policy */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/40 border border-[#7a5c2b]/40">
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-[#e5b35a] shrink-0" />
                  <div>
                    <span className="text-sm sm:text-base font-black text-[#f5ebd9] block">{t.privacyPolicy}</span>
                    <span className="text-xs text-[#a39a8c]">{t.privacyPolicyDesc}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleOpenPrivacyPolicy}
                  className="py-1.5 px-3 rounded-xl bg-black/60 hover:bg-black/90 text-[#f3cb79] border border-[#c8923a]/50 hover:border-[#c8923a] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 active:scale-95"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{t.viewPolicy}</span>
                </button>
              </div>

            </div>

            {/* Save/Close Button */}
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className={`mt-1 w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#d49e3d] via-[#f1bf66] to-[#c8923a] text-slate-950 font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-sm sm:text-base shadow-md cursor-pointer`}
            >
              {t.saveAndClose}
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
};

