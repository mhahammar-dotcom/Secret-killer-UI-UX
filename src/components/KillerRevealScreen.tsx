import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Swords, Eye, ArrowLeft, Skull, ShieldAlert, ChevronLeft, Home } from 'lucide-react';
import { StoryData, PlayerData } from '../types';
import { sound } from '../utils/audio';

interface KillerRevealScreenProps {
  story: StoryData;
  players: PlayerData[];
  winner: 'innocents' | 'guilty';
  onProceedToExplanation: () => void;
  onBack?: () => void;
  onNavigateHome?: () => void;
}

export const KillerRevealScreen: React.FC<KillerRevealScreenProps> = ({
  story,
  players,
  winner,
  onProceedToExplanation,
  onBack,
  onNavigateHome,
}) => {
  const guiltyPlayers = players.filter((p) => p.guilty);
  const primaryKiller = guiltyPlayers[0] || {
    name: 'نادر',
    character: {
      name: 'نادر',
      profession: 'مبرمج الـ Core الرئيسي',
    },
  };

  useEffect(() => {
    sound.playRoleReveal();
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center bg-[#07080c] select-none text-slate-100 pb-16 pt-4 px-3 sm:px-6" dir="rtl">
      {/* Background Subtle Gradient & Ambient Noir Vignettes */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#0e1117] via-[#090b0f] to-[#050608] pointer-events-none" />
      <div className="fixed top-0 inset-x-0 h-64 bg-[radial-gradient(ellipse_at_top,rgba(200,146,58,0.08),transparent_70%)] pointer-events-none" />

      {/* Main Page Container */}
      <div className="relative z-10 w-full max-w-xl flex flex-col justify-between flex-1 gap-5">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between w-full pt-2 pb-1 border-b border-amber-900/20">
          {/* Back Button */}
          <button
            onClick={() => {
              sound.playClick();
              if (onBack) onBack();
            }}
            className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-[#c8923a]/70 text-[#e5b35a] flex items-center justify-center hover:bg-black/90 hover:border-[#f3cb79] transition-all cursor-pointer active:scale-95 shadow-lg shadow-black/80"
            title="رجوع"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.4] rtl:rotate-180" />
          </button>

          <div className="text-center">
            <h1 className="text-2xl font-black font-['Cairo'] text-[#f5ebd9] tracking-wide leading-tight drop-shadow-md">
              كشف القاتل
            </h1>
            <p className="text-xs sm:text-sm text-[#9b988f] font-medium font-['Cairo'] mt-0.5">
              {winner === 'innocents' ? '🏆 فاز الأبرياء' : '☠️ فاز القاتل'}
            </p>
          </div>

          {/* Home Button */}
          <button
            onClick={() => {
              sound.playClick();
              if (onNavigateHome) onNavigateHome();
            }}
            className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-[#c8923a]/70 text-[#e5b35a] flex items-center justify-center hover:bg-black/90 hover:border-[#f3cb79] transition-all cursor-pointer active:scale-95 shadow-lg shadow-black/80"
            title="الرئيسية"
          >
            <Home className="w-5 h-5" />
          </button>
        </div>

        {/* Killer Portrait / Reveal Stage */}
        <div className="my-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative w-full max-w-sm rounded-[28px] bg-[#0d0f16] border-2 border-[#c8923a]/55 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.8)] flex flex-col items-center text-center overflow-hidden"
          >
            {/* Subtle Crime Lights Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-red-950/25 via-[#0d0f16] to-black pointer-events-none" />

            {/* Portrait Container */}
            <div className="relative z-10 w-48 h-48 sm:w-56 sm:h-56 rounded-[22px] overflow-hidden border-2 border-[#c8923a]/70 shadow-2xl bg-black flex items-center justify-center mb-4">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80"
                alt="القاتل"
                className="w-full h-full object-cover grayscale contrast-125 brightness-90"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* Skewed Red STAMP */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="stamp-killer text-2xl sm:text-3xl font-black tracking-widest">
                  القاتل
                </span>
              </div>
            </div>

            {/* Killer Name & Info */}
            <div className="relative z-10 flex flex-col items-center">
              <h3 className="text-3xl sm:text-4xl font-black font-['Cairo'] text-[#f5ebd9] drop-shadow-md">
                {primaryKiller.character.name}
              </h3>
              <span className="text-xs sm:text-sm font-bold text-[#e5b35a] font-['Cairo'] mt-1">
                ({primaryKiller.name}) • {primaryKiller.character.profession}
              </span>

              {/* Short confession */}
              <div className="mt-4 px-4 py-2.5 rounded-2xl bg-[#141724] border border-[#c8923a]/40 text-[#f5ebd9] text-xs sm:text-sm font-bold font-['Cairo'] leading-relaxed">
                {story.id === 'dreams'
                  ? 'لقد عطلت الأنظمة وفتحت الممر السري لمسح سجلات الذاكرة!'
                  : story.id === 'gala_toast'
                  ? 'لقد دسست السم في كأس مراد أثناء انشغال الجميع بالحفل!'
                  : 'لقد نفذت الجريمة وضللت أصابع الاتهام طوال الجلسة!'}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Action Button: Go to Crime Explanation */}
        <div className="pt-2">
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              sound.playClick();
              onProceedToExplanation();
            }}
            className="w-full rounded-[24px] py-4 px-6 bg-gradient-to-r from-[#d49e3d] via-[#f1bf66] to-[#c8923a] text-slate-950 font-black font-['Cairo'] text-base sm:text-lg shadow-[0_6px_22px_rgba(200,146,58,0.3)] hover:brightness-105 flex items-center justify-center gap-3 transition-all cursor-pointer"
          >
            <span>عرض التفاصيل وشرح الجريمة</span>
            <ArrowLeft className="w-5 h-5 stroke-[2.5] rtl:rotate-0" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};
