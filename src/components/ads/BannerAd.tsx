import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Info, X, ShieldAlert, Sparkles } from 'lucide-react';
import { adService } from '../../services/adService';

interface BannerAdProps {
  language?: 'ar' | 'en';
  position?: 'bottom' | 'top';
  className?: string;
}

export const BannerAd: React.FC<BannerAdProps> = ({
  language = 'ar',
  position = 'bottom',
  className = '',
}) => {
  const [adConfig, setAdConfig] = useState(adService.getConfig());
  const [isDismissed, setIsDismissed] = useState(false);
  const isEn = language === 'en';
  const isRtl = !isEn;

  useEffect(() => {
    return adService.subscribe(() => {
      setAdConfig(adService.getConfig());
    });
  }, []);

  if (!adConfig.adsEnabled || isDismissed) {
    return null;
  }

  return (
    <div
      className={`w-full z-30 px-3 py-1 flex justify-center items-center pointer-events-auto ${className}`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="w-full max-w-lg bg-[#0c0e15]/95 border border-amber-900/40 hover:border-amber-700/50 rounded-2xl p-2 sm:p-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-md flex items-center justify-between gap-2.5 transition-all">
        {/* Ad Badge & Icon */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 via-red-500/20 to-amber-700/20 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-inner">
            <ShieldAlert className="w-5 h-5 text-[#f3cb79]" />
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-black/80 border border-amber-500/40 text-[#f3cb79] tracking-wider shrink-0">
                {isEn ? 'Ad • Google AdMob' : 'إعلان • Google AdMob'}
              </span>
              <span className="text-xs font-bold text-[#f5ebd9] truncate">
                {isEn ? 'CyberNoir Detective Syndicate' : 'نقابة محققي الظلال: أسرار القضايا'}
              </span>
            </div>
            <p className="text-[10px] text-[#a39a8c] truncate">
              {isEn ? 'Free crime puzzle game • Install on Play Store' : 'أقوى ألعاب الغموض والذكاء • متاحة مجاناً للتحميل'}
            </p>
          </div>
        </div>

        {/* CTA & Dismiss Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <a
            href="https://play.google.com/store/apps"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-[#d49e3d] to-[#c8923a] text-slate-950 font-black text-[11px] shadow-sm hover:brightness-110 active:scale-95 transition-all flex items-center gap-1"
          >
            <span>{isEn ? 'Install' : 'تثبيت'}</span>
            <ExternalLink className="w-3 h-3 stroke-[2.5]" />
          </a>

          <button
            onClick={() => setIsDismissed(true)}
            title={isEn ? 'Hide banner' : 'إغلاق الإعلان'}
            className="p-1 text-slate-500 hover:text-slate-300 transition-colors rounded-lg hover:bg-white/5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
