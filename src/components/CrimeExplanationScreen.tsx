import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Target, FileText, Syringe, Trash2, ArrowLeft, ShieldAlert, Sparkles, ChevronLeft, Home } from 'lucide-react';
import { StoryData, PlayerData } from '../types';
import { sound } from '../utils/audio';

interface CrimeExplanationScreenProps {
  story: StoryData;
  players: PlayerData[];
  onProceedToResults: () => void;
  onBack: () => void;
  onNavigateHome?: () => void;
}

export const CrimeExplanationScreen: React.FC<CrimeExplanationScreenProps> = ({
  story,
  players,
  onProceedToResults,
  onBack,
  onNavigateHome,
}) => {
  const getExplanationCards = () => {
    if (story.id === 'dreams') {
      return [
        {
          id: 'motive',
          title: 'الدافع',
          icon: Target,
          iconColor: 'text-[#f3cb79] bg-[#c8923a]/20 border-[#c8923a]/50',
          content: 'نادر كان يخطط لسرقة الكود الأساسي (Core) وبيعه لأحد الممولين المنافسين لبدء شركته الخاصة بمبلغ طائل.',
        },
        {
          id: 'plan',
          title: 'الخطة',
          icon: FileText,
          iconColor: 'text-blue-400 bg-blue-500/20 border-blue-500/40',
          content: 'أراد التخلص من د. سامر وتعطيل كاميرات الممر الغربي عند انقطاع الطاقة حتى يصبح المسؤول الوحيد عن المشروع.',
        },
        {
          id: 'execution',
          title: 'تنفيذ الجريمة',
          icon: Syringe,
          iconColor: 'text-red-400 bg-red-500/20 border-red-500/40',
          content: 'دخل مختبر د. سامر عند الساعة 21:43 مستغلاً صلاحياته الاستثنائية وفتح الممر السري أثناء نوم الحاضرين في الحلم المشترك.',
        },
        {
          id: 'concealment',
          title: 'إخفاء الأدلة',
          icon: Trash2,
          iconColor: 'text-purple-400 bg-purple-500/20 border-purple-500/40',
          content: 'مسح سجلات الذاكرة المشتركة ورمى بطاقة الدخول بالقرب من الجثة لتشتيت الشبهات نحو حراس الأمن الليلي.',
        },
      ];
    }

    if (story.id === 'gala_toast') {
      return [
        {
          id: 'motive',
          title: 'الدافع',
          icon: Target,
          iconColor: 'text-[#f3cb79] bg-[#c8923a]/20 border-[#c8923a]/50',
          content: 'سامية اكتشفت أن مراد ينوي استبعاد اسمها من الوصية المعدلة بعد سنوات من العمل الدؤوب معه.',
        },
        {
          id: 'plan',
          title: 'الخطة',
          icon: FileText,
          iconColor: 'text-blue-400 bg-blue-500/20 border-blue-500/40',
          content: 'معرفتها بالملفات الطبية الدقيقة مكنتها من استبدال دوائه بجرعة مضاعفة قاتلة لا تترك أثراً فورياً.',
        },
        {
          id: 'execution',
          title: 'تنفيذ الجريمة',
          icon: Syringe,
          iconColor: 'text-red-400 bg-red-500/20 border-red-500/40',
          content: 'استغلت اللحظات التي تُرك فيها كأس مراد على الطاولة الجانبية ودسّت المادة القاتلة ببراعة.',
        },
        {
          id: 'concealment',
          title: 'إخفاء الأدلة',
          icon: Trash2,
          iconColor: 'text-purple-400 bg-purple-500/20 border-purple-500/40',
          content: 'تخلصت من شريط الدواء الفارغ في الممر الخلفي وادعت انشغالها بإجراء مكالمة قانونية عاجلة.',
        },
      ];
    }

    return [
      {
        id: 'motive',
        title: 'الدافع',
        icon: Target,
        iconColor: 'text-[#f3cb79] bg-[#c8923a]/20 border-[#c8923a]/50',
        content: story.introduction?.stakes || 'تحقيق مكاسب شخصية وإخفاء أسرار خطيرة عن أعين المحققين.',
      },
      {
        id: 'plan',
        title: 'الخطة',
        icon: FileText,
        iconColor: 'text-blue-400 bg-blue-500/20 border-blue-500/40',
        content: story.introduction?.situation || 'استغلال ثغرات التوقيت والمكان لتنفيذ المخطط دون لفت الانتباه.',
      },
      {
        id: 'execution',
        title: 'تنفيذ الجريمة',
        icon: Syringe,
        iconColor: 'text-red-400 bg-red-500/20 border-red-500/40',
        content: story.introduction?.incident || story.description,
      },
      {
        id: 'concealment',
        title: 'إخفاء الأدلة',
        icon: Trash2,
        iconColor: 'text-purple-400 bg-purple-500/20 border-purple-500/40',
        content: 'تشتيت أصابع الاتهام وتلفيق أدلة مضللة لعرقلة الوصول للحقيقة.',
      },
    ];
  };

  const cards = getExplanationCards();

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center bg-[#07080c] select-none text-slate-100 pb-16 pt-4 px-3 sm:px-6" dir="rtl">
      {/* Background Subtle Gradient & Ambient Noir Vignettes */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#0e1117] via-[#090b0f] to-[#050608] pointer-events-none" />
      <div className="fixed top-0 inset-x-0 h-64 bg-[radial-gradient(ellipse_at_top,rgba(200,146,58,0.08),transparent_70%)] pointer-events-none" />

      {/* Main Page Container */}
      <div className="relative z-10 w-full max-w-xl flex flex-col gap-5">
        {/* Top Header Bar */}
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
              شرح الجريمة
            </h1>
            <p className="text-xs sm:text-sm text-[#9b988f] font-medium font-['Cairo'] mt-0.5">
              {story.title} • كيف تم التخطيط والتنفيذ؟
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

        {/* 4 Explanation Cards */}
        <div className="flex flex-col gap-3 max-h-[56vh] overflow-y-auto pr-1 custom-scrollbar">
          {cards.map((card, idx) => {
            const IconComponent = card.icon;
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="p-4 sm:p-5 rounded-[22px] bg-[#0d0f16] border border-[#7a5c2b]/50 shadow-md flex items-start gap-4"
              >
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${card.iconColor}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-black font-['Cairo'] text-[#f3cb79] mb-1">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#d4cfc7] font-medium leading-relaxed font-['Cairo']">
                    {card.content}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA to Results */}
        <div className="pt-2">
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              sound.playClick();
              onProceedToResults();
            }}
            className="w-full rounded-[24px] py-4 px-6 bg-gradient-to-r from-[#d49e3d] via-[#f1bf66] to-[#c8923a] text-slate-950 font-black font-['Cairo'] text-base sm:text-lg shadow-[0_6px_22px_rgba(200,146,58,0.3)] hover:brightness-105 flex items-center justify-center gap-3 transition-all cursor-pointer"
          >
            <span>عرض الحقيقة الكاملة والنتائج</span>
            <ArrowLeft className="w-5 h-5 stroke-[2.5] rtl:rotate-0" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};
