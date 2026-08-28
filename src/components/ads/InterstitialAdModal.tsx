import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, ExternalLink, ShieldAlert, Sparkles, Volume2, VolumeX, Info } from 'lucide-react';
import { adService } from '../../services/adService';
import { sound } from '../../utils/audio';

interface InterstitialAdModalProps {
  language?: 'ar' | 'en';
}

export const InterstitialAdModal: React.FC<InterstitialAdModalProps> = ({
  language = 'ar',
}) => {
  const [activeState, setActiveState] = useState(adService.getActiveInterstitial());
  const [secondsRemaining, setSecondsRemaining] = useState<number>(5);
  const [canSkip, setCanSkip] = useState<boolean>(false);
  const [isAdMuted, setIsAdMuted] = useState<boolean>(false);

  const isEn = language === 'en';
  const isRtl = !isEn;

  useEffect(() => {
    return adService.subscribe(() => {
      const current = adService.getActiveInterstitial();
      setActiveState(current);
      if (current.isOpen) {
        setSecondsRemaining(5);
        setCanSkip(false);
      }
    });
  }, []);

  useEffect(() => {
    if (!activeState.isOpen) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanSkip(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeState.isOpen]);

  if (!activeState.isOpen) {
    return null;
  }

  const handleClose = () => {
    sound.playClick();
    adService.closeInterstitial();
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-between p-4 select-none overflow-hidden"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Top AdBar Header */}
        <div className="w-full max-w-lg flex items-center justify-between z-20 pt-2">
          {/* AdMob Label */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-black/80 border border-amber-500/50 text-[#f3cb79] tracking-wider">
              {isEn ? 'Google AdMob • Interstitial Ad' : 'إعلان بيني • Google AdMob'}
            </span>
            <span className="text-[10px] text-[#a39a8c] font-medium hidden sm:inline">
              {isEn ? 'Test Ad Unit' : 'وحدة إعلانية تجريبية'}
            </span>
          </div>

          {/* Skip / Close Timer Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAdMuted(!isAdMuted)}
              className="p-1.5 rounded-full bg-black/60 border border-slate-700 text-slate-300 hover:text-white"
            >
              {isAdMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {canSkip ? (
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={handleClose}
                className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-red-600 to-amber-600 text-white font-black text-xs flex items-center gap-1.5 shadow-lg cursor-pointer hover:brightness-110 active:scale-95 transition-all"
              >
                <span>{isEn ? 'Skip Ad' : 'تخطي الإعلان'}</span>
                <X className="w-3.5 h-3.5 stroke-[3]" />
              </motion.button>
            ) : (
              <div className="px-3 py-1.5 rounded-full bg-black/70 border border-amber-500/40 text-[#f3cb79] text-xs font-bold flex items-center gap-1.5">
                <span>{isEn ? `Skip in ${secondsRemaining}s` : `تخطي خلال ${secondsRemaining} ث`}</span>
              </div>
            )}
          </div>
        </div>

        {/* Center Ad Content / Banner Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md my-auto flex flex-col items-center text-center p-6 rounded-[28px] bg-gradient-to-b from-[#151922] via-[#0d0f16] to-[#08090d] border border-amber-500/30 shadow-[0_0_50px_rgba(200,146,58,0.15)] relative overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Ad Creative Poster / Icon */}
          <div className="relative mb-5">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-red-600 via-amber-600 to-amber-400 p-0.5 shadow-xl">
              <div className="w-full h-full rounded-[22px] bg-[#0c0e15] flex flex-col items-center justify-center p-3 text-center">
                <ShieldAlert className="w-10 h-10 text-[#f3cb79] mb-1 drop-shadow" />
                <span className="text-[9px] font-black text-[#f5ebd9] uppercase tracking-wider">Noir Games</span>
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-red-600 rounded-full text-[9px] font-black text-white shadow">
              4.9 ★
            </div>
          </div>

          <h3 className="text-xl font-black text-[#f5ebd9] mb-1.5">
            {isEn ? 'Cyber Crime Syndicate 2026' : 'نقابة الجرائم الغامضة: ملفات المحقق'}
          </h3>
          <p className="text-xs text-[#c4beb3] leading-relaxed max-w-xs mb-5">
            {isEn
              ? 'Immerse yourself in interactive detective mysteries, interrogation puzzles, and high-stakes mafia conspiracies.'
              : 'خض تجربة التحقيق الجنائي الأكثر إثارة، استجوب المشتبه بهم واكشف خيوط الجرائم الغامضة.'}
          </p>

          {/* Interactive Action Button */}
          <a
            href="https://play.google.com/store/apps"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClose}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#d49e3d] via-[#f1bf66] to-[#c8923a] text-slate-950 font-black text-sm shadow-[0_6px_20px_rgba(200,146,58,0.3)] hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-slate-950 stroke-none" />
            <span>{isEn ? 'Install Free from Play Store' : 'تحميل مجاناً من متجر Google Play'}</span>
            <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
          </a>
        </motion.div>

        {/* Bottom AdMob Info Footer */}
        <div className="w-full max-w-lg flex flex-col items-center gap-1 z-20 pb-2">
          <div className="flex items-center gap-1 text-[10px] text-[#7a7469]">
            <Info className="w-3 h-3" />
            <span>
              {isEn
                ? 'Monetized with Google AdMob • Safe & Family Friendly Ads'
                : 'يتم تشغيل الإعلانات بواسطة Google AdMob • إعلانات موثوقة وآمنة'}
            </span>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};
