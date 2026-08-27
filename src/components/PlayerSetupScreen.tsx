import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Trash2, ChevronLeft, ArrowLeft, Plus, Home } from 'lucide-react';
import { StoryData } from '../types';
import { sound } from '../utils/audio';
import { AR_STRINGS, EN_STRINGS } from '../data/translations';

interface PlayerSetupScreenProps {
  story: StoryData;
  onConfirmPlayers: (playerNames: string[]) => void;
  onBack: () => void;
  onNavigateHome?: () => void;
  language?: 'ar' | 'en';
}

const DEFAULT_NAMES_AR = [
  'أحمد', 'سارة', 'عمر', 'ليلى', 'نادر', 'سلمى', 'أيمن', 'نور', 'طارق', 'ريم', 'خالد', 'منى'
];

const DEFAULT_NAMES_EN = [
  'Alex', 'Sarah', 'Omar', 'Emma', 'David', 'Sophia', 'Liam', 'Olivia', 'James', 'Maya', 'Noah', 'Elena'
];

export const PlayerSetupScreen: React.FC<PlayerSetupScreenProps> = ({
  story,
  onConfirmPlayers,
  onBack,
  onNavigateHome,
  language = 'ar',
}) => {
  const isEn = language === 'en';
  const t = isEn ? EN_STRINGS : AR_STRINGS;
  const isRtl = !isEn;

  const minPlayers = story.minPlayers;
  const maxPlayers = story.maxPlayers;
  const defaultList = isEn ? DEFAULT_NAMES_EN : DEFAULT_NAMES_AR;

  const listEndRef = useRef<HTMLDivElement>(null);

  const [names, setNames] = useState<string[]>(() => {
    return defaultList.slice(0, Math.max(4, minPlayers));
  });

  const handleNameChange = (index: number, value: string) => {
    const next = [...names];
    next[index] = value;
    setNames(next);
  };

  const handleRemovePlayer = (index: number) => {
    sound.playClick();
    if (names.length <= minPlayers) return;
    const next = names.filter((_, i) => i !== index);
    setNames(next);
  };

  const handleAddSlot = () => {
    sound.playClick();
    if (names.length >= maxPlayers) return;
    const nextName = defaultList[names.length % defaultList.length] || `${isEn ? 'Player' : 'لاعب'} ${names.length + 1}`;
    setNames((prev) => [...prev, nextName]);
    setTimeout(() => {
      listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 60);
  };

  const handleStartGame = () => {
    sound.playClick();
    const fallbackPrefix = isEn ? 'Player' : 'لاعب';
    const validatedNames = names.map((n, i) => n.trim() || `${fallbackPrefix} ${i + 1}`);
    
    // Check uniqueness
    const seen = new Set<string>();
    const uniqueNames: string[] = [];
    validatedNames.forEach((name) => {
      let uniqueName = name;
      let counter = 2;
      while (seen.has(uniqueName.toLowerCase())) {
        uniqueName = `${name} ${counter++}`;
      }
      seen.add(uniqueName.toLowerCase());
      uniqueNames.push(uniqueName);
    });

    onConfirmPlayers(uniqueNames);
  };

  return (
    <div className="relative h-[100dvh] w-full flex flex-col items-center bg-[#07080c] select-none text-slate-100 px-3 sm:px-6 overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Background Subtle Gradient & Ambient Noir Vignettes */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#0e1117] via-[#090b0f] to-[#050608] pointer-events-none" />
      <div className="fixed top-0 inset-x-0 h-64 bg-[radial-gradient(ellipse_at_top,rgba(200,146,58,0.08),transparent_70%)] pointer-events-none" />

      {/* Main Page Container */}
      <div className="relative z-10 w-full max-w-xl h-full flex flex-col pt-3 sm:pt-4 pb-3 sm:pb-5">
        {/* Top Header Bar */}
        <div className="shrink-0 flex items-center justify-between w-full pt-1 pb-2 border-b border-amber-900/20">
          {/* Back Button */}
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
            <h1 className={`text-xl sm:text-2xl font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-[#f5ebd9] tracking-wide leading-tight drop-shadow-md`}>
              {t.playerSetupTitle}
            </h1>
            <p className={`text-xs sm:text-sm text-[#9b988f] font-medium ${isRtl ? "font-['Cairo']" : 'font-sans'} mt-0.5`}>
              {isEn ? `Enter player names (${minPlayers}-${maxPlayers})` : `أدخل أسماء اللاعبين (${minPlayers}-${maxPlayers})`}
            </p>
          </div>

          {/* Home Action Button */}
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

        {/* Count Bar */}
        <div className={`shrink-0 flex items-center justify-between px-2 py-2 text-xs sm:text-sm ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
          <span className="text-[#f3cb79] font-black flex items-center gap-2">
            <Users className="w-4 h-4 text-[#c8923a]" />
            <span>{isEn ? `${names.length} of ${maxPlayers} players` : `${names.length} من أصل ${maxPlayers} لاعبين`}</span>
          </span>
          <span className="text-xs text-[#a39a8c]">
            {isEn ? 'Tap to edit name or add slot' : 'انقر لتعديل الاسم أو الإضافة'}
          </span>
        </div>

        {/* Scrollable Player Slots List */}
        <div className="flex-1 overflow-y-auto min-h-0 pr-1 py-1.5 flex flex-col gap-2.5 custom-scrollbar">
          <AnimatePresence initial={false}>
            {names.map((name, slotIdx) => (
              <motion.div
                key={slotIdx}
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.18 }}
                className="flex items-center justify-between p-3 sm:p-3.5 rounded-[20px] bg-[#0d0f16] border border-[#7a5c2b]/50 hover:border-[#c8923a] transition-colors shadow-md group shrink-0"
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="w-8 h-8 rounded-xl bg-black/70 text-[#f3cb79] text-sm font-black flex items-center justify-center shrink-0 border border-[#7a5c2b]/60 font-mono shadow-inner">
                    {slotIdx + 1}
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleNameChange(slotIdx, e.target.value)}
                    placeholder={isEn ? `Player ${slotIdx + 1} Name` : `اسم اللاعب ${slotIdx + 1}`}
                    className={`w-full bg-transparent text-[#f5ebd9] font-bold text-sm sm:text-base ${isRtl ? "font-['Cairo']" : 'font-sans'} focus:outline-none placeholder-slate-600`}
                  />
                </div>

                {names.length > minPlayers && (
                  <button
                    onClick={() => handleRemovePlayer(slotIdx)}
                    className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
                    title={isEn ? 'Remove Player' : 'حذف اللاعب'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={listEndRef} className="h-1 shrink-0" />
        </div>

        {/* Fixed Bottom Action Controls */}
        <div className="shrink-0 mt-auto pt-2 sm:pt-3 flex flex-col gap-2.5 sm:gap-3 w-full border-t border-amber-900/20 bg-gradient-to-t from-[#07080c] via-[#07080c]/90 to-transparent">
          {/* Add Extra Player Button (Fixed) */}
          {names.length < maxPlayers ? (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddSlot}
              className={`w-full p-3 sm:p-3.5 rounded-[20px] border border-dashed border-[#7a5c2b]/70 hover:border-[#c8923a] text-[#e5b35a] hover:text-[#f3cb79] bg-[#0d0f16]/80 hover:bg-[#131722] flex items-center justify-center gap-2 text-sm sm:text-base font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} transition-all cursor-pointer shadow-md active:scale-95`}
            >
              <Plus className="w-4 h-4 text-[#c8923a]" />
              <span>{isEn ? `Add Extra Player (${names.length + 1})` : `إضافة لاعب إضافي (${names.length + 1})`}</span>
            </motion.button>
          ) : (
            <div className={`w-full py-2.5 px-4 rounded-[18px] border border-[#7a5c2b]/30 bg-[#0d0f16]/50 text-center text-xs sm:text-sm text-[#9b988f] ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
              {isEn ? `Maximum player limit reached (${maxPlayers})` : `تم الوصول للحد الأقصى من اللاعبين (${maxPlayers})`}
            </div>
          )}

          {/* Start Game Proceed Button */}
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStartGame}
            className={`w-full rounded-[22px] sm:rounded-[24px] py-3.5 sm:py-4 px-6 bg-gradient-to-r from-[#d49e3d] via-[#f1bf66] to-[#c8923a] text-slate-950 font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-base sm:text-lg shadow-[0_6px_22px_rgba(200,146,58,0.3)] hover:brightness-105 flex items-center justify-center gap-3 transition-all cursor-pointer active:scale-95`}
          >
            <span>{t.startSecretRoleAssignment}</span>
            <ArrowLeft className={`w-5 h-5 stroke-[2.5] ${isRtl ? '' : 'rotate-180'}`} />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

