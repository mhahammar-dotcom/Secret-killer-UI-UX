import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, ChevronRight, ChevronLeft, Users, Clock, HelpCircle, FileText, Vote, ArrowLeft, Home } from 'lucide-react';
import { StoryData, PlayerData, InvestigationRoundData } from '../types';
import { sound } from '../utils/audio';

interface DiscussionEvidenceScreenProps {
  story: StoryData;
  players: PlayerData[];
  round: number;
  onProceedToVoting: () => void;
  onBack?: () => void;
  onNavigateHome?: () => void;
}

const EVIDENCE_PHOTOS: string[] = [
  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600&auto=format&fit=crop&q=80',
];

export const DiscussionEvidenceScreen: React.FC<DiscussionEvidenceScreenProps> = ({
  story,
  players,
  round,
  onProceedToVoting,
  onBack,
  onNavigateHome,
}) => {
  const [activeEvidenceIndex, setActiveEvidenceIndex] = useState<number>(0);

  const investigationRounds: InvestigationRoundData[] =
    story.investigationRounds && story.investigationRounds.length > 0
      ? story.investigationRounds
      : [
          {
            roundNumber: 1,
            title: 'بطاقة دخول المختبر',
            publicClue: 'عُثر على بطاقة دخول مختبر د. سامر على الأرض بجانب جثته ملقاة بعناية.',
            description: 'السجل الإلكتروني يظهر استخدام البطاقة عند الساعة 21:43 تماماً.',
            discussionPrompt: 'من من الحاضرين كان لديه تصريح بالمرور في الممر الغربي في هذا التوقيت؟',
          },
          {
            roundNumber: 2,
            title: 'تسجيلات كاميرات المراقبة',
            publicClue: 'انقطاع غامض في تغذية الكاميرات الرئيسية لمدة دقيقتين وسبع عشرة ثانية.',
            description: 'الظلال المتحركة تشير إلى شخص بطول متوسط يرتدي معطفاً داكناً.',
            discussionPrompt: 'قارنوا بين روايات الحاضرين حول موقع كل منهم أثناء انقطاع التيار.',
          },
          {
            roundNumber: 3,
            title: 'تقرير الطب الشرعي الأولي',
            publicClue: 'وجود آثار مادة كيميائية سريعة التحلل في عينة الدم المسحوبة.',
            description: 'المادة تحتاج إلى خبرة متخصصة للتعامل معها دون ترك آثار ظاهرة.',
            discussionPrompt: 'من يملك الخبرة التقنية أو الطبية لتحضير مثل هذا المركب؟',
          },
        ];

  const currentEvidence = investigationRounds[activeEvidenceIndex] || investigationRounds[0];
  const totalEvidenceCount = investigationRounds.length;
  const currentPhoto = EVIDENCE_PHOTOS[activeEvidenceIndex % EVIDENCE_PHOTOS.length];

  const handleNextEvidence = () => {
    sound.playClick();
    if (activeEvidenceIndex < totalEvidenceCount - 1) {
      setActiveEvidenceIndex((prev) => prev + 1);
    }
  };

  const handlePrevEvidence = () => {
    sound.playClick();
    if (activeEvidenceIndex > 0) {
      setActiveEvidenceIndex((prev) => prev - 1);
    }
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
              if (onBack) onBack();
            }}
            className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-[#c8923a]/70 text-[#e5b35a] flex items-center justify-center hover:bg-black/90 hover:border-[#f3cb79] transition-all cursor-pointer active:scale-95 shadow-lg shadow-black/80"
            title="رجوع"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.4] rtl:rotate-180" />
          </button>

          <div className="text-center">
            <h1 className="text-2xl font-black font-['Cairo'] text-[#f5ebd9] tracking-wide leading-tight drop-shadow-md">
              أدلة القضية
            </h1>
            <p className="text-xs sm:text-sm text-[#9b988f] font-medium font-['Cairo'] mt-0.5">
              الجولة {round} • راجع الأدلة وناقش مع اللاعبين
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

        {/* Evidence Carousel Card */}
        <div className="rounded-[28px] bg-[#0d0f16] border-2 border-[#c8923a]/50 p-5 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.8)] flex flex-col gap-4">
          {/* Evidence Photo */}
          <div className="relative w-full h-44 sm:h-52 rounded-[20px] overflow-hidden border border-[#7a5c2b]/50 bg-black shrink-0">
            <img
              src={currentPhoto}
              alt={currentEvidence.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f16] via-transparent to-black/30" />

            <div className="absolute top-3 right-3 px-3 py-1 rounded-xl bg-[#c8923a] text-slate-950 text-xs font-black font-['Cairo'] shadow-md">
              دليل رقم #{activeEvidenceIndex + 1}
            </div>
          </div>

          {/* Evidence Details */}
          <div className="flex flex-col gap-2">
            <h3 className="text-lg sm:text-xl font-black font-['Cairo'] text-[#f3cb79]">
              {currentEvidence.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#f5ebd9] leading-relaxed font-semibold font-['Cairo']">
              {currentEvidence.publicClue}
            </p>
            {currentEvidence.description && (
              <p className="text-xs text-[#a39a8c] leading-relaxed font-['Cairo'] mt-1">
                {currentEvidence.description}
              </p>
            )}
          </div>

          {/* Discussion Prompt */}
          {currentEvidence.discussionPrompt && (
            <div className="p-3.5 rounded-2xl bg-[#141724] border border-[#c8923a]/35 text-xs sm:text-sm font-['Cairo']">
              <span className="text-[#f3cb79] font-black block mb-1">
                سؤال مطروح للنقاش:
              </span>
              <p className="text-[#d4cfc7] font-medium leading-relaxed">
                {currentEvidence.discussionPrompt}
              </p>
            </div>
          )}

          {/* Pagination Carousel: < 1 / 3 > */}
          <div className="flex items-center justify-between pt-3 border-t border-amber-900/30">
            <button
              disabled={activeEvidenceIndex === 0}
              onClick={handlePrevEvidence}
              className="p-2.5 rounded-xl bg-black/60 text-[#e5b35a] hover:text-[#f3cb79] disabled:opacity-30 border border-[#7a5c2b]/50 transition-colors cursor-pointer"
              title="الدليل السابق"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.4]" />
            </button>

            <span className="text-xs sm:text-sm font-black font-['Cairo'] text-[#f5ebd9]">
              دليل {activeEvidenceIndex + 1} من {totalEvidenceCount}
            </span>

            <button
              disabled={activeEvidenceIndex === totalEvidenceCount - 1}
              onClick={handleNextEvidence}
              className="p-2.5 rounded-xl bg-black/60 text-[#e5b35a] hover:text-[#f3cb79] disabled:opacity-30 border border-[#7a5c2b]/50 transition-colors cursor-pointer"
              title="الدليل التالي"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.4]" />
            </button>
          </div>
        </div>

        {/* Bottom CTA to Proceed to Voting */}
        <div className="pt-2">
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              sound.playClick();
              onProceedToVoting();
            }}
            className="w-full rounded-[24px] py-4 px-6 bg-gradient-to-r from-[#d49e3d] via-[#f1bf66] to-[#c8923a] text-slate-950 font-black font-['Cairo'] text-base sm:text-lg shadow-[0_6px_22px_rgba(200,146,58,0.3)] hover:brightness-105 flex items-center justify-center gap-3 transition-all cursor-pointer active:scale-95"
          >
            <Vote className="w-5 h-5 stroke-[2.4]" />
            <span>الانتقال إلى جلسة التصويت السري</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};
