import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Sparkles, X, Users, Wifi, Bell } from 'lucide-react';
import { sound } from '../utils/audio';

interface OnlineComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnlineComingSoonModal: React.FC<OnlineComingSoonModalProps> = ({
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
        className="w-full max-w-sm rounded-[28px] bg-[#0d0f16] border-2 border-[#c8923a]/50 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.9)] flex flex-col items-center text-center gap-4 font-['Cairo']"
      >
        {/* Animated Globe Icon */}
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600/20 via-amber-500/20 to-red-600/20 border border-[#c8923a]/50 flex items-center justify-center text-[#f3cb79] shadow-xl shadow-amber-950/40">
            <Globe className="w-8 h-8 animate-spin-slow" />
          </div>
          <span className="absolute -top-1 -right-1 px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black shadow-md border border-red-400">
            قريباً
          </span>
        </div>

        <div>
          <h3 className="text-xl font-black text-[#f5ebd9]">
            طور اللعب الجماعي أونلاين
          </h3>
          <p className="text-xs text-[#d4cfc7] leading-relaxed mt-2 max-w-[280px]">
            نعمل حالياً على إطلاق ميزة الغرف العامة والخاصة للعب مع الأصدقاء عن بُعد عبر الإنترنت بدون الحاجة لتمرير الهاتف!
          </p>
        </div>

        {/* Features Preview */}
        <div className="w-full flex flex-col gap-2 text-right text-xs text-[#d4cfc7] bg-black/40 p-3.5 rounded-2xl border border-[#7a5c2b]/40">
          <div className="flex items-center gap-2">
            <span className="text-[#f3cb79] font-bold">✨</span>
            <span>غرف سرية برمز دخول سريع (Room Code)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#f3cb79] font-bold">🎙️</span>
            <span>محادثات صوتية مباشرة وجلسات تصويت حية</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#f3cb79] font-bold">⚡</span>
            <span>متوافق مع الهواتف والحواسيب بدون تحميل</span>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#d49e3d] via-[#f1bf66] to-[#c8923a] text-slate-950 font-black text-sm shadow-md cursor-pointer transition-all active:scale-95"
        >
          حسناً، بانتظار الإطلاق
        </button>
      </motion.div>
    </div>
  );
};
