import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Users, UserPlus, Trash2, Shuffle, ChevronLeft, ArrowLeft, Plus, Home } from 'lucide-react';
import { StoryData } from '../types';
import { sound } from '../utils/audio';

interface PlayerSetupScreenProps {
  story: StoryData;
  onConfirmPlayers: (playerNames: string[]) => void;
  onBack: () => void;
  onNavigateHome?: () => void;
}

const DEFAULT_NAMES = [
  'أحمد', 'سارة', 'عمر', 'ليلى', 'نادر', 'سلمى', 'أيمن', 'نور', 'طارق', 'ريم', 'خالد', 'منى'
];

export const PlayerSetupScreen: React.FC<PlayerSetupScreenProps> = ({
  story,
  onConfirmPlayers,
  onBack,
  onNavigateHome,
}) => {
  const minPlayers = story.minPlayers;
  const maxPlayers = story.maxPlayers;

  const [names, setNames] = useState<string[]>(() => {
    return DEFAULT_NAMES.slice(0, Math.max(4, minPlayers));
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
    const nextName = DEFAULT_NAMES[names.length % DEFAULT_NAMES.length] || `لاعب ${names.length + 1}`;
    setNames([...names, nextName]);
  };

  const handleRandomizeNames = () => {
    sound.playClick();
    const shuffled = [...DEFAULT_NAMES].sort(() => Math.random() - 0.5);
    setNames(shuffled.slice(0, names.length));
  };

  const handleStartGame = () => {
    sound.playClick();
    // Validate names are non-empty and unique
    const validatedNames = names.map((n, i) => n.trim() || `لاعب ${i + 1}`);
    
    // Check uniqueness
    const seen = new Set<string>();
    const uniqueNames: string[] = [];
    validatedNames.forEach((name, idx) => {
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
    <div className="relative min-h-screen w-full flex flex-col items-center bg-[#07080c] select-none text-slate-100 pb-16 pt-4 px-3 sm:px-6" dir="rtl">
      {/* Background Subtle Gradient & Ambient Noir Vignettes */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#0e1117] via-[#090b0f] to-[#050608] pointer-events-none" />
      <div className="fixed top-0 inset-x-0 h-64 bg-[radial-gradient(ellipse_at_top,rgba(200,146,58,0.08),transparent_70%)] pointer-events-none" />

      {/* Main Page Container */}
      <div className="relative z-10 w-full max-w-xl flex flex-col gap-5">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between w-full pt-2 pb-1 border-b border-amber-900/20">
          {/* Back Button */}
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
              إعداد اللاعبين
            </h1>
            <p className="text-xs sm:text-sm text-[#9b988f] font-medium font-['Cairo'] mt-0.5">
              أدخل أسماء اللاعبين ({minPlayers}-{maxPlayers})
            </p>
          </div>

          {/* Action Buttons: Shuffle + Home */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRandomizeNames}
              className="px-3 py-2 rounded-xl bg-black/60 border border-[#c8923a]/60 text-[#e5b35a] hover:border-[#f3cb79] hover:text-[#f3cb79] text-xs font-bold font-['Cairo'] transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
              title="تعبئة أسماء عشوائية"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">اقتراح</span>
            </button>

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
        </div>

        {/* Count Bar */}
        <div className="flex items-center justify-between px-2 text-xs sm:text-sm font-['Cairo']">
          <span className="text-[#f3cb79] font-black flex items-center gap-2">
            <Users className="w-4 h-4 text-[#c8923a]" />
            <span>{names.length} من أصل {maxPlayers} لاعبين</span>
          </span>
          <span className="text-xs text-[#a39a8c]">انقر لتعديل الاسم أو الإضافة</span>
        </div>

        {/* Player Slots List */}
        <div className="flex flex-col gap-2.5 w-full max-h-[52vh] overflow-y-auto pr-1 custom-scrollbar">
          {names.map((name, slotIdx) => (
            <motion.div
              key={slotIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-3 sm:p-3.5 rounded-[20px] bg-[#0d0f16] border border-[#7a5c2b]/50 hover:border-[#c8923a] transition-colors shadow-md group"
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="w-8 h-8 rounded-xl bg-black/70 text-[#f3cb79] text-sm font-black flex items-center justify-center shrink-0 border border-[#7a5c2b]/60 font-mono shadow-inner">
                  {slotIdx + 1}
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(slotIdx, e.target.value)}
                  placeholder={`اسم اللاعب ${slotIdx + 1}`}
                  className="w-full bg-transparent text-[#f5ebd9] font-bold text-sm sm:text-base font-['Cairo'] focus:outline-none placeholder-slate-600"
                />
              </div>

              {names.length > minPlayers && (
                <button
                  onClick={() => handleRemovePlayer(slotIdx)}
                  className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
                  title="حذف اللاعب"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          ))}

          {names.length < maxPlayers && (
            <button
              onClick={handleAddSlot}
              className="w-full p-3.5 rounded-[20px] border border-dashed border-[#7a5c2b]/60 hover:border-[#c8923a] text-[#e5b35a] hover:bg-[#0d0f16] flex items-center justify-center gap-2 text-sm font-black font-['Cairo'] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة لاعب إضافي ({names.length + 1})</span>
            </button>
          )}
        </div>

        {/* Start Game CTA */}
        <div className="pt-2">
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStartGame}
            className="w-full rounded-[24px] py-4 px-6 bg-gradient-to-r from-[#d49e3d] via-[#f1bf66] to-[#c8923a] text-slate-950 font-black font-['Cairo'] text-base sm:text-lg shadow-[0_6px_22px_rgba(200,146,58,0.3)] hover:brightness-105 flex items-center justify-center gap-3 transition-all cursor-pointer active:scale-95"
          >
            <span>بدء توزيع الأدوار السرية</span>
            <ArrowLeft className="w-5 h-5 stroke-[2.5] rtl:rotate-0" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};
