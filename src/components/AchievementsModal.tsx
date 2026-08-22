import React from 'react';
import { motion } from 'motion/react';
import { X, Trophy, Award, Star, Flame, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/audio';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ACHIEVEMENTS = [
  {
    id: 'first_win',
    title: 'المحقق المبتدئ',
    description: 'الفوز بأول قضية كشف جريمة',
    icon: '🔍',
    unlocked: true,
    progress: '1/1',
  },
  {
    id: 'master_detective',
    title: 'شارلوك هولمز العرب',
    description: 'كشف القاتل في الجولة الأولى بدقة 100%',
    icon: '🎩',
    unlocked: true,
    progress: '1/1',
  },
  {
    id: 'perfect_crime',
    title: 'الجريمة الكاملة',
    description: 'الفوز بدور القاتل دون أن يحصل على صوت واحد',
    icon: '🗡️',
    unlocked: false,
    progress: '0/1',
  },
  {
    id: 'story_creator',
    title: 'المؤلف الغامض',
    description: 'تأليف وحفظ قضية مخصصة ومشاركتها',
    icon: '✍️',
    unlocked: false,
    progress: '0/1',
  },
  {
    id: 'veteran',
    title: 'خبير التحقيقات',
    description: 'لعب 10 قضايا مختلفة بنجاح',
    icon: '🏆',
    unlocked: false,
    progress: '4/10',
  },
];

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4" dir="rtl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg rounded-[28px] bg-[#0d0f16] border-2 border-[#c8923a]/50 p-5 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.9)] flex flex-col gap-4 text-right font-['Cairo']"
      >
        <div className="flex items-center justify-between border-b border-amber-900/30 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-black/60 border border-[#c8923a]/60 flex items-center justify-center text-[#f3cb79]">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-black text-[#f5ebd9]">الإنجازات والأوسمة</h3>
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

        {/* Achievements list */}
        <div className="flex flex-col gap-2.5 max-h-[55vh] overflow-y-auto pr-1 custom-scrollbar">
          {ACHIEVEMENTS.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                item.unlocked
                  ? 'bg-gradient-to-r from-amber-500/10 via-[#0d0f16] to-[#0d0f16] border-[#c8923a]/60 shadow-md'
                  : 'bg-black/40 border-[#7a5c2b]/30 opacity-70'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-black/60 border border-[#7a5c2b]/50 flex items-center justify-center text-2xl shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-black text-[#f5ebd9]">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#a39a8c] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="text-left shrink-0">
                <span
                  className={`text-xs font-black px-2.5 py-1 rounded-xl ${
                    item.unlocked
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-black/60 text-slate-500 border border-slate-800'
                  }`}
                >
                  {item.progress}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="mt-1 w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#d49e3d] via-[#f1bf66] to-[#c8923a] text-slate-950 font-black text-sm sm:text-base shadow-md cursor-pointer"
        >
          إغلاق
        </button>
      </motion.div>
    </div>
  );
};
