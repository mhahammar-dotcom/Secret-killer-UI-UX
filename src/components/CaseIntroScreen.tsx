import React from 'react';
import { motion } from 'motion/react';
import { Clock, BarChart2, Users, ChevronLeft, Shield, AlertTriangle, ArrowLeft, Home } from 'lucide-react';
import { StoryData } from '../types';
import { sound } from '../utils/audio';

interface CaseIntroScreenProps {
  story: StoryData;
  onProceedToSetup: () => void;
  onBack: () => void;
  onNavigateHome?: () => void;
}

const STORY_BANNERS: Record<string, string> = {
  dreams: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?w=800&auto=format&fit=crop&q=80',
  gala_toast: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=80',
  museum: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800&auto=format&fit=crop&q=80',
  train: 'https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?w=800&auto=format&fit=crop&q=80',
  observatory: 'https://images.unsplash.com/photo-1538370965046-79c0d6907d47?w=800&auto=format&fit=crop&q=80',
};

export const CaseIntroScreen: React.FC<CaseIntroScreenProps> = ({
  story,
  onProceedToSetup,
  onBack,
  onNavigateHome,
}) => {
  const bannerImg =
    STORY_BANNERS[story.id] ||
    'https://images.unsplash.com/photo-1507499739999-097706ad8914?w=800&auto=format&fit=crop&q=80';

  const intro = story.introduction || {
    setting: 'موقع غير محدد',
    situation: 'اجتمع المشتبه بهم في هذا المكان.',
    incident: story.description,
    stakes: 'قد يفلت الجاني دون عقاب.',
    objective: 'من قتل الضحية؟ ولماذا؟',
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center bg-[#07080c] select-none text-slate-100 pb-16 pt-4 px-3 sm:px-6" dir="rtl">
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
            title="رجوع"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.4] rtl:rotate-180" />
          </button>

          <div className="text-center">
            <h1 className="text-2xl font-black font-['Cairo'] text-[#f5ebd9] tracking-wide leading-tight drop-shadow-md">
              ملف القضية
            </h1>
            <p className="text-xs sm:text-sm text-[#e5b35a] font-bold font-['Cairo'] mt-0.5">
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
            title="الرئيسية"
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
            <h3 className="text-xl sm:text-2xl font-black font-['Cairo'] text-[#f5ebd9] drop-shadow-md">
              {story.title}
            </h3>
            <span className="text-xs font-black px-3 py-1 rounded-xl bg-[#c52222] text-white shadow-md font-['Cairo']">
              تحقيق جنائي
            </span>
          </div>
        </div>

        {/* Narrative Box with Golden Border */}
        <div className="rounded-[24px] bg-[#0d0f16] border border-[#7a5c2b]/50 p-5 sm:p-6 shadow-[0_6px_22px_rgba(0,0,0,0.7)] flex flex-col gap-3">
          <p className="text-xs sm:text-sm text-[#d4cfc7] leading-relaxed font-normal font-['Cairo']">
            {intro.situation}
          </p>

          <p className="text-xs sm:text-sm text-[#d4cfc7] leading-relaxed font-normal font-['Cairo']">
            {intro.incident}
          </p>

          <div className="pt-3 mt-1 border-t border-amber-900/30">
            <span className="text-xs sm:text-sm font-black font-['Cairo'] text-[#e5b35a] block mb-1">
              الهدف والتحقيق المطلوب:
            </span>
            <p className="text-sm sm:text-base font-black font-['Cairo'] text-[#ef4444]">
              {intro.objective || 'من ارتكب الجريمة؟ ولماذا؟'}
            </p>
          </div>
        </div>

        {/* 3-Pill Stat Row */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-[#0d0f16] border border-[#7a5c2b]/40 shadow-md flex flex-col items-center justify-center">
            <span className="text-xs text-[#9b988f] font-medium font-['Cairo'] mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#c8923a]" /> المدة
            </span>
            <span className="text-xs sm:text-sm font-black font-['Cairo'] text-[#f5ebd9]">45-60 دقيقة</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#0d0f16] border border-[#7a5c2b]/40 shadow-md flex flex-col items-center justify-center">
            <span className="text-xs text-[#9b988f] font-medium font-['Cairo'] mb-1 flex items-center gap-1">
              <BarChart2 className="w-3.5 h-3.5 text-[#c8923a]" /> الصعوبة
            </span>
            <span className="text-xs sm:text-sm font-black font-['Cairo'] text-[#f5ebd9]">متوسط</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#0d0f16] border border-[#7a5c2b]/40 shadow-md flex flex-col items-center justify-center">
            <span className="text-xs text-[#9b988f] font-medium font-['Cairo'] mb-1 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#c8923a]" /> اللاعبون
            </span>
            <span className="text-xs sm:text-sm font-black font-['Cairo'] text-[#f5ebd9]">
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
            className="w-full rounded-[24px] py-4 px-6 bg-gradient-to-r from-[#d49e3d] via-[#f1bf66] to-[#c8923a] text-slate-950 font-black font-['Cairo'] text-base sm:text-lg shadow-[0_6px_22px_rgba(200,146,58,0.3)] hover:brightness-105 flex items-center justify-center gap-3 transition-all cursor-pointer active:scale-95"
          >
            <span>بدء إعداد اللاعبين</span>
            <ArrowLeft className="w-5 h-5 stroke-[2.5] rtl:rotate-0" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};
