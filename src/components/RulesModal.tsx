import React from 'react';
import { motion } from 'motion/react';
import { X, CheckCircle2, ShieldAlert, KeyRound, Skull, Users, MessageSquare, Scale, Award } from 'lucide-react';
import { sound } from '../utils/audio';
import { AR_STRINGS, EN_STRINGS } from '../data/translations';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'ar' | 'en';
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose, language = 'ar' }) => {
  if (!isOpen) return null;

  const isEn = language === 'en';
  const t = isEn ? EN_STRINGS : AR_STRINGS;
  const isRtl = !isEn;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4" dir={isRtl ? 'rtl' : 'ltr'}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg max-h-[85vh] rounded-[28px] bg-[#0d0f16] border-2 border-[#c8923a]/50 p-5 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.9)] overflow-y-auto flex flex-col gap-4 text-left rtl:text-right custom-scrollbar"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-900/30 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-black/60 border border-[#c8923a]/60 flex items-center justify-center text-[#f3cb79]">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className={`text-xl font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-[#f5ebd9]`}>
              {t.rulesTitle}
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

        {/* Quick Highlights */}
        <div className={`grid grid-cols-2 gap-2 text-xs ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
          <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-black/40 border border-[#7a5c2b]/40 text-[#f5ebd9]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{isEn ? 'Free debate & contradiction hunt' : 'مناقشة حرة وبحث عن تناقضات'}</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-black/40 border border-[#7a5c2b]/40 text-[#f5ebd9]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{isEn ? 'Secret info for your eyes only' : 'معلوماتك السرية لك وحدك'}</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-black/40 border border-[#7a5c2b]/40 text-[#f5ebd9]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{isEn ? 'Public evidence rounds' : 'أدلة تحقيق متاحة للجميع'}</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-black/40 border border-[#7a5c2b]/40 text-[#f5ebd9]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{isEn ? 'Secret ballot majority votes' : 'تصويت سري وحسم بالأغلبية'}</span>
          </div>
        </div>

        {/* Step-by-step How to Play */}
        <div className={`space-y-3 text-xs sm:text-sm text-[#d4cfc7] leading-relaxed ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
          <div className="p-3.5 rounded-2xl bg-black/40 border border-[#7a5c2b]/40">
            <strong className="text-[#f3cb79] block font-black text-sm mb-1">
              {isEn ? '1. Case Briefing & Role Passing 🔒' : '1. قراءة القضية وتوزيع الأدوار 🔒'}
            </strong>
            <p>
              {isEn
                ? 'Everyone reads the case introduction (setting, situation, incident, stakes, objective). Pass the phone to each player secretly to discover their secret identity and private knowledge.'
                : 'يقرأ الجميع مقدمة القضية وأبعادها الخمسة (المكان، الوضع، الحادث، المخاطر، والهدف). ثم يمر الهاتف على كل لاعب لمعاينة دوره السري وما يعرفه سراً دون إظهاره لأحد.'}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-[#7a5c2b]/40">
            <strong className="text-[#f3cb79] block font-black text-sm mb-1">
              {isEn ? '2. Free Discussion & Evidence 🕵️‍♂️' : '2. المناقشة الحرة واستعراض الأدلة 🕵️‍♂️'}
            </strong>
            <p>
              {isEn
                ? 'Debate openly, cross-examine alibis, and interrogate suspicious statements. Browse available evidence clues and suggested questions to crack the case.'
                : 'يتحدث الجميع بحرية، يتبادلون الشكوك، ويطرحون الأسئلة لاكتشاف المتناقضين. يمكن مراجعة أدلة جولات التحقيق والأسئلة المقترحة لمساعدة المحققين.'}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-[#7a5c2b]/40">
            <strong className="text-[#f3cb79] block font-black text-sm mb-1">
              {isEn ? '3. Secret Voting & Elimination 🗳️' : '3. التصويت السري وحسم الجولة 🗳️'}
            </strong>
            <p>
              {isEn
                ? 'Pass the device to cast secret votes. The player with majority votes is eliminated and their innocence or guilt is revealed.'
                : 'يمر الهاتف ليصوت كل لاعب في سرية تامة لمن يشتبه به. يُستبعد الحاصل على الأغلبية ويُكشف إن كان مذنباً أو بريئاً.'}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-[#7a5c2b]/40">
            <strong className="text-[#f3cb79] block font-black text-sm mb-1">
              {isEn ? '4. Ties & Extra Evidence ⚖️' : '4. التعادل والأدلة الإضافية ⚖️'}
            </strong>
            <p>
              {isEn
                ? 'In case of a voting tie, no player is eliminated and a fresh piece of critical evidence is unlocked for the next round.'
                : 'في حال تعادل الأصوات، لا يُستبعد أي لاعب ويُكشف دليل إضافي لمساعدة المجموعة في كسر التعادل في الجولة القادمة.'}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-[#7a5c2b]/40">
            <strong className="text-[#f3cb79] block font-black text-sm mb-1">
              {isEn ? '5. Win Conditions & Full Truth 🏆' : '5. شروط النصر وكشف الحقيقة 🏆'}
            </strong>
            <p>
              {isEn
                ? 'Innocents win if all culprits are caught. The killer wins if living culprits equal or outnumber living innocents.'
                : 'يفوز الأبرياء إذا تم استبعاد جميع المذنبين. ويفوز القاتل إذا تساوى عدد المذنبين الأحياء مع عدد الأبرياء.'}
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className={`mt-1 w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#d49e3d] via-[#f1bf66] to-[#c8923a] text-slate-950 font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-sm sm:text-base shadow-md cursor-pointer`}
        >
          {isEn ? 'Understood, Let’s Play' : 'فهمت القواعد، فلنبدأ'}
        </button>
      </motion.div>
    </div>
  );
};

