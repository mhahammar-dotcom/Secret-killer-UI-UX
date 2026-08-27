import React from 'react';
import { motion } from 'motion/react';
import { Clock, BarChart2, Users, ChevronLeft, Shield, AlertTriangle, ArrowLeft, Home } from 'lucide-react';
import { StoryData } from '../types';
import { sound } from '../utils/audio';
import { STORY_COVERS, DEFAULT_STORY_COVER } from '../assets/covers';
import { AR_STRINGS, EN_STRINGS } from '../data/translations';

interface CaseIntroScreenProps {
  story: StoryData;
  onProceedToSetup: () => void;
  onBack: () => void;
  onNavigateHome?: () => void;
  language?: 'ar' | 'en';
}

export const CaseIntroScreen: React.FC<CaseIntroScreenProps> = ({
  story,
  onProceedToSetup,
  onBack,
  onNavigateHome,
  language = 'ar',
}) => {
  const isEn = language === 'en';
  const t = isEn ? EN_STRINGS : AR_STRINGS;
  const isRtl = !isEn;

  const bannerImg = STORY_COVERS[story.id] || DEFAULT_STORY_COVER;

  const intro = story.introduction || {
    setting: isEn ? 'Unspecified Location' : 'موقع غير محدد',
    situation: isEn ? 'The suspects gathered at this location.' : 'اجتمع المشتبه بهم في هذا المكان.',
    incident: story.description,
    stakes: isEn ? 'The culprit may escape unpunished.' : 'قد يفلت الجاني دون عقاب.',
    objective: isEn ? 'Who committed the crime? And why?' : 'من قتل الضحية؟ ولماذا؟',
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center bg-[#07080c] select-none text-slate-100 pb-16 pt-4 px-3 sm:px-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Background Subtle Gradient & Ambient Noir Vignettes */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#0e1117] via-[#090b0f] to-[#050608] pointer-events-none" />
      <div className="fixed top-0 inset-x-0 h-64 bg-[radial-gradient(ellipse_at_top,rgba(200,146,58,0.08),transparent_70%)] pointer-events-none" />

      {/* Main Page Container */}
      <div className="relative z-10 w-full max-w-xl flex flex-col gap-5">
        {/* Header Bar: Back Button + Centered Title + Home Button */}
        <div className="flex items-center justify-between w-full pt-2 pb-1 border-b border-amber-900/20">
          <button
            onClick={() => {
              sound.playClick();
              onBack();
            }}
            className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-[#c8923a]/70 text-[#e5b35a] flex items-center justify-center hover:bg-black/90 hover:border-[#f3cb79] transition-all cursor-pointer active:scale-95 shadow-lg shadow-black/80"
            title={t.back}
          >
            <ChevronLeft className={`w-6 h-6 stroke-[2.4] ${isRtl ? 'rotate-180' : ''}`} />
          </button>

          <div className="text-center">
            <h1 className={`text-2xl font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-[#f5ebd9] tracking-wide leading-tight drop-shadow-md`}>
              {t.caseFile}
            </h1>
            <p className={`text-xs sm:text-sm text-[#e5b35a] font-bold ${isRtl ? "font-['Cairo']" : 'font-sans'} mt-0.5`}>
              {story.title}
            </p>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              if (onNavigateHome) onNavigateHome();
              else onBack();
            }}
            className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-[#c8923a]/70 text-[#e5b35a] flex items-center justify-center hover:bg-black/90 hover:border-[#f3cb79] transition-all cursor-pointer active:scale-95 shadow-lg shadow-black/80"
            title={t.home}
          >
            <Home className="w-5 h-5" />
          </button>
        </div>

        {/* Case Banner Artwork Card */}
        <div className="relative w-full h-48 sm:h-56 rounded-[24px] overflow-hidden border border-[#7a5c2b]/50 shadow-[0_6px_22px_rgba(0,0,0,0.7)] bg-black shrink-0">
          <img
            src={bannerImg}
            alt={story.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07080c] via-black/30 to-black/30" />
          <div className="absolute bottom-4 right-4 left-4 flex items-center justify-between">
            <h3 className={`text-xl sm:text-2xl font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-[#f5ebd9] drop-shadow-md`}>
              {story.title}
            </h3>
            <span className={`text-xs font-black px-3 py-1 rounded-xl bg-[#c52222] text-white shadow-md ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
              {isEn ? 'Criminal Case' : 'تحقيق جنائي'}
            </span>
          </div>
        </div>

        {/* Narrative Box with Golden Border */}
        <div className="rounded-[24px] bg-[#0d0f16] border border-[#7a5c2b]/50 p-5 sm:p-6 shadow-[0_6px_22px_rgba(0,0,0,0.7)] flex flex-col gap-3">
          <p className={`text-xs sm:text-sm text-[#d4cfc7] leading-relaxed font-normal ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
            {intro.situation}
          </p>

          <p className={`text-xs sm:text-sm text-[#d4cfc7] leading-relaxed font-normal ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
            {intro.incident}
          </p>

          <div className="pt-3 mt-1 border-t border-amber-900/30">
            <span className={`text-xs sm:text-sm font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-[#e5b35a] block mb-1`}>
              {t.primaryObjective}
            </span>
            <p className={`text-sm sm:text-base font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-[#ef4444]`}>
              {intro.objective || (isEn ? 'Who committed the crime? And why?' : 'من ارتكب الجريمة؟ ولماذا؟')}
            </p>
          </div>
        </div>

        {/* 3-Pill Stat Row */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-[#0d0f16] border border-[#7a5c2b]/40 shadow-md flex flex-col items-center justify-center">
            <span className={`text-xs text-[#9b988f] font-medium ${isRtl ? "font-['Cairo']" : 'font-sans'} mb-1 flex items-center gap-1`}>
              <Clock className="w-3.5 h-3.5 text-[#c8923a]" /> {isEn ? 'Duration' : 'المدة'}
            </span>
            <span className={`text-xs sm:text-sm font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-[#f5ebd9]`}>
              {isEn ? '45-60 min' : '45-60 دقيقة'}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-[#0d0f16] border border-[#7a5c2b]/40 shadow-md flex flex-col items-center justify-center">
            <span className={`text-xs text-[#9b988f] font-medium ${isRtl ? "font-['Cairo']" : 'font-sans'} mb-1 flex items-center gap-1`}>
              <BarChart2 className="w-3.5 h-3.5 text-[#c8923a]" /> {t.difficulty}
            </span>
            <span className={`text-xs sm:text-sm font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-[#f5ebd9]`}>
              {t.medium}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-[#0d0f16] border border-[#7a5c2b]/40 shadow-md flex flex-col items-center justify-center">
            <span className={`text-xs text-[#9b988f] font-medium ${isRtl ? "font-['Cairo']" : 'font-sans'} mb-1 flex items-center gap-1`}>
              <Users className="w-3.5 h-3.5 text-[#c8923a]" /> {t.players}
            </span>
            <span className={`text-xs sm:text-sm font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-[#f5ebd9]`}>
              {story.minPlayers === story.maxPlayers ? `${story.minPlayers}` : `${story.minPlayers}-${story.maxPlayers}`}
            </span>
          </div>
        </div>

        {/* Bottom Continue Action Button */}
        <div className="pt-2">
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              sound.playClick();
              onProceedToSetup();
            }}
            className={`w-full rounded-[24px] py-4 px-6 bg-gradient-to-r from-[#d49e3d] via-[#f1bf66] to-[#c8923a] text-slate-950 font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-base sm:text-lg shadow-[0_6px_22px_rgba(200,146,58,0.3)] hover:brightness-105 flex items-center justify-center gap-3 transition-all cursor-pointer active:scale-95`}
          >
            <span>{t.setupPlayers}</span>
            <ArrowLeft className={`w-5 h-5 stroke-[2.5] ${isRtl ? '' : 'rotate-180'}`} />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

