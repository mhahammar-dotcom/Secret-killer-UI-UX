import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  ChevronRight,
  ChevronLeft,
  Users,
  Clock,
  HelpCircle,
  FileText,
  Vote,
  Home,
  Sparkles,
  MapPin,
  MessageSquare,
  BookOpen,
  AlertCircle,
  Shield,
  Eye
} from 'lucide-react';
import { StoryData, PlayerData } from '../types';
import { StoryEngine, Story, EvidenceItem, EvidenceType } from '../game';
import { sound } from '../utils/audio';

interface DiscussionEvidenceScreenProps {
  story: StoryData;
  players: PlayerData[];
  round: number;
  revealedEvidenceIds?: string[];
  revealedClues?: string[];
  onRevealNextEvidence?: () => void;
  hasMoreEvidence?: boolean;
  onProceedToVoting: () => void;
  onBack?: () => void;
  onNavigateHome?: () => void;
}

type TabType = 'evidence' | 'suspects' | 'briefing' | 'prompts';

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
  revealedEvidenceIds = [],
  revealedClues = [],
  onRevealNextEvidence,
  hasMoreEvidence = false,
  onProceedToVoting,
  onBack,
  onNavigateHome,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('evidence');
  const [activeEvidenceIndex, setActiveEvidenceIndex] = useState<number>(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Normalize all available evidence from StoryEngine
  const allStoryEvidence: EvidenceItem[] = StoryEngine.getStoryEvidence(story as unknown as Story);
  
  // Filter revealed evidence based on GameState IDs or fallback to initial items
  const revealedItems: EvidenceItem[] = allStoryEvidence.filter(e => 
    revealedEvidenceIds.includes(e.id)
  );

  // If revealedItems is empty but story has evidence, show the first item as active baseline
  const visibleEvidence: EvidenceItem[] = revealedItems.length > 0
    ? revealedItems
    : allStoryEvidence.slice(0, 1);

  const currentEvidence = visibleEvidence[activeEvidenceIndex] || visibleEvidence[0];
  const totalRevealedCount = visibleEvidence.length;
  const totalAllCount = allStoryEvidence.length;
  const currentPhoto = EVIDENCE_PHOTOS[activeEvidenceIndex % EVIDENCE_PHOTOS.length];

  const handleNextEvidence = () => {
    sound.playClick();
    if (activeEvidenceIndex < totalRevealedCount - 1) {
      setActiveEvidenceIndex(prev => prev + 1);
    }
  };

  const handlePrevEvidence = () => {
    sound.playClick();
    if (activeEvidenceIndex > 0) {
      setActiveEvidenceIndex(prev => prev - 1);
    }
  };

  const getCategoryBadge = (category: EvidenceType) => {
    switch (category) {
      case 'timeline':
        return { label: 'جدول زمني', icon: Clock, color: 'text-amber-300 border-amber-500/40 bg-amber-950/40' };
      case 'witness':
        return { label: 'إفادة شاهد', icon: Users, color: 'text-sky-300 border-sky-500/40 bg-sky-950/40' };
      case 'document':
        return { label: 'سجلات ومستندات', icon: FileText, color: 'text-emerald-300 border-emerald-500/40 bg-emerald-950/40' };
      case 'location':
        return { label: 'موقع الحدث', icon: MapPin, color: 'text-purple-300 border-purple-500/40 bg-purple-950/40' };
      case 'contradiction':
        return { label: 'تناقض روايات', icon: AlertCircle, color: 'text-rose-300 border-rose-500/40 bg-rose-950/40' };
      case 'relationship':
        return { label: 'علاقات ودوافع', icon: Eye, color: 'text-indigo-300 border-indigo-500/40 bg-indigo-950/40' };
      case 'motive':
        return { label: 'شبهة دافع', icon: Sparkles, color: 'text-orange-300 border-orange-500/40 bg-orange-950/40' };
      default:
        return { label: 'أثر مادي', icon: Search, color: 'text-amber-200 border-[#c8923a]/50 bg-[#161a26]' };
    }
  };

  // General open-ended discussion prompts
  const generalPrompts = [
    {
      title: 'مراجعة الجدول الزمني',
      text: 'قارنوا بين توقيت الحادث ومواقع كل شخص في الدقائق الحرجة. هل تتطابق الشهادات أم هناك فجوات زمنية؟',
    },
    {
      title: 'فحص الأعذار والشهادات',
      text: 'استجوبوا الحاضرين حول ما رأوه أو سمعوه. هل يؤكد أحد عذر شخص آخر بشكل مباشر؟',
    },
    {
      title: 'الدوافع والمصالح',
      text: 'من بين الحاضرين يملك المصلحة الأكبر أو القدرة التقنية لتنفيذ ما حدث دون لفت الانتباه؟',
    },
  ];

  return (
    <div
      id="discussion_evidence_screen"
      className="relative min-h-screen w-full flex flex-col items-center bg-[#07080c] select-none text-slate-100 pb-24 pt-3 px-3 sm:px-6"
      dir="rtl"
    >
      {/* Ambient Noir Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#0c0e14] via-[#08090d] to-[#040507] pointer-events-none" />
      <div className="fixed top-0 inset-x-0 h-72 bg-[radial-gradient(ellipse_at_top,rgba(200,146,58,0.12),transparent_70%)] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-xl flex flex-col gap-4">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between w-full pt-1 pb-2 border-b border-amber-900/30">
          {/* Back Button */}
          <button
            id="discussion_back_btn"
            onClick={() => {
              sound.playClick();
              setShowExitConfirm(true);
            }}
            className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-[#c8923a]/70 text-[#e5b35a] flex items-center justify-center hover:bg-black/90 hover:border-[#f3cb79] transition-all cursor-pointer active:scale-95 shadow-lg shadow-black/80"
            title="رجوع"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.4] rtl:rotate-180" />
          </button>

          <div className="text-center px-2">
            <h1 className="text-xl sm:text-2xl font-black font-['Cairo'] text-[#f5ebd9] tracking-wide leading-tight drop-shadow-md">
              جلسة التحري والنقاش
            </h1>
            <p className="text-xs text-[#b0a99c] font-medium font-['Cairo'] mt-0.5">
              الجولة {round} • {story.title}
            </p>
          </div>

          {/* Home Button */}
          <button
            id="discussion_home_btn"
            onClick={() => {
              sound.playClick();
              setShowExitConfirm(true);
            }}
            className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-[#c8923a]/70 text-[#e5b35a] flex items-center justify-center hover:bg-black/90 hover:border-[#f3cb79] transition-all cursor-pointer active:scale-95 shadow-lg shadow-black/80"
            title="الرئيسية"
          >
            <Home className="w-5 h-5" />
          </button>
        </div>

        {/* Noir Tab Navigation */}
        <div className="grid grid-cols-4 gap-1.5 p-1.5 rounded-2xl bg-[#0e111a] border border-[#7a5c2b]/35 shadow-inner">
          <button
            id="tab_evidence"
            onClick={() => {
              sound.playClick();
              setActiveTab('evidence');
            }}
            className={`py-2 px-1 rounded-xl text-xs font-black font-['Cairo'] flex flex-col items-center gap-1 transition-all cursor-pointer ${
              activeTab === 'evidence'
                ? 'bg-gradient-to-r from-[#c8923a] to-[#d49e3d] text-slate-950 shadow-md'
                : 'text-[#b0a99c] hover:text-[#f5ebd9] hover:bg-black/30'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>الأدلة ({visibleEvidence.length})</span>
          </button>

          <button
            id="tab_suspects"
            onClick={() => {
              sound.playClick();
              setActiveTab('suspects');
            }}
            className={`py-2 px-1 rounded-xl text-xs font-black font-['Cairo'] flex flex-col items-center gap-1 transition-all cursor-pointer ${
              activeTab === 'suspects'
                ? 'bg-gradient-to-r from-[#c8923a] to-[#d49e3d] text-slate-950 shadow-md'
                : 'text-[#b0a99c] hover:text-[#f5ebd9] hover:bg-black/30'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>المشتبه بهم ({players.length})</span>
          </button>

          <button
            id="tab_briefing"
            onClick={() => {
              sound.playClick();
              setActiveTab('briefing');
            }}
            className={`py-2 px-1 rounded-xl text-xs font-black font-['Cairo'] flex flex-col items-center gap-1 transition-all cursor-pointer ${
              activeTab === 'briefing'
                ? 'bg-gradient-to-r from-[#c8923a] to-[#d49e3d] text-slate-950 shadow-md'
                : 'text-[#b0a99c] hover:text-[#f5ebd9] hover:bg-black/30'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>الوقائع</span>
          </button>

          <button
            id="tab_prompts"
            onClick={() => {
              sound.playClick();
              setActiveTab('prompts');
            }}
            className={`py-2 px-1 rounded-xl text-xs font-black font-['Cairo'] flex flex-col items-center gap-1 transition-all cursor-pointer ${
              activeTab === 'prompts'
                ? 'bg-gradient-to-r from-[#c8923a] to-[#d49e3d] text-slate-950 shadow-md'
                : 'text-[#b0a99c] hover:text-[#f5ebd9] hover:bg-black/30'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>محاور النقاش</span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="w-full">
          {/* TAB 1: EVIDENCE & INVESTIGATION */}
          {activeTab === 'evidence' && (
            <motion.div
              key="evidence_tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-4"
            >
              {visibleEvidence.length > 0 && currentEvidence ? (
                <div className="rounded-[26px] bg-[#0d0f16] border-2 border-[#c8923a]/50 p-5 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.8)] flex flex-col gap-4">
                  {/* Evidence Photo */}
                  <div className="relative w-full h-44 sm:h-52 rounded-[20px] overflow-hidden border border-[#7a5c2b]/50 bg-black shrink-0">
                    <img
                      src={currentPhoto}
                      alt={currentEvidence.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f16] via-transparent to-black/40" />

                    {/* Badge Category */}
                    {(() => {
                      const badge = getCategoryBadge(currentEvidence.category);
                      const BadgeIcon = badge.icon;
                      return (
                        <div className={`absolute top-3 right-3 px-3 py-1 rounded-xl text-xs font-black font-['Cairo'] shadow-md flex items-center gap-1.5 border ${badge.color}`}>
                          <BadgeIcon className="w-3.5 h-3.5" />
                          <span>{badge.label}</span>
                        </div>
                      );
                    })()}

                    <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-black/80 backdrop-blur-sm border border-amber-500/30 text-[#f3cb79] text-xs font-black font-['Cairo'] shadow-md">
                      دليل تحقيقي {activeEvidenceIndex + 1} من {totalRevealedCount}
                    </div>
                  </div>

                  {/* Evidence Details */}
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg sm:text-xl font-black font-['Cairo'] text-[#f3cb79]">
                      {currentEvidence.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#f5ebd9] leading-relaxed font-semibold font-['Cairo']">
                      {currentEvidence.publicClue || currentEvidence.description}
                    </p>
                    {currentEvidence.description && currentEvidence.description !== currentEvidence.publicClue && (
                      <p className="text-xs text-[#a39a8c] leading-relaxed font-['Cairo'] mt-1">
                        {currentEvidence.description}
                      </p>
                    )}
                  </div>

                  {/* Discussion Question */}
                  {currentEvidence.discussionPrompt && (
                    <div className="p-3.5 rounded-2xl bg-[#141724] border border-[#c8923a]/35 text-xs sm:text-sm font-['Cairo']">
                      <span className="text-[#f3cb79] font-black block mb-1">
                        محور مطروح للنقاش والتحقق:
                      </span>
                      <p className="text-[#d4cfc7] font-medium leading-relaxed">
                        {currentEvidence.discussionPrompt}
                      </p>
                    </div>
                  )}

                  {/* Evidence Carousel Pagination */}
                  {totalRevealedCount > 1 && (
                    <div className="flex items-center justify-between pt-2 border-t border-amber-900/30">
                      <button
                        disabled={activeEvidenceIndex === 0}
                        onClick={handlePrevEvidence}
                        className="p-2.5 rounded-xl bg-black/60 text-[#e5b35a] hover:text-[#f3cb79] disabled:opacity-30 border border-[#7a5c2b]/50 transition-colors cursor-pointer"
                        title="الدليل السابق"
                      >
                        <ChevronRight className="w-5 h-5 stroke-[2.4]" />
                      </button>

                      <span className="text-xs font-black font-['Cairo'] text-[#f5ebd9]">
                        {activeEvidenceIndex + 1} / {totalRevealedCount}
                      </span>

                      <button
                        disabled={activeEvidenceIndex === totalRevealedCount - 1}
                        onClick={handleNextEvidence}
                        className="p-2.5 rounded-xl bg-black/60 text-[#e5b35a] hover:text-[#f3cb79] disabled:opacity-30 border border-[#7a5c2b]/50 transition-colors cursor-pointer"
                        title="الدليل التالي"
                      >
                        <ChevronLeft className="w-5 h-5 stroke-[2.4]" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-[24px] bg-[#0d0f16] border border-amber-900/30 p-6 text-center text-[#b0a99c] font-['Cairo']">
                  <FileText className="w-10 h-10 mx-auto mb-2 text-[#c8923a]/60" />
                  <p className="text-sm font-bold text-[#f5ebd9]">لا توجد أدلة إضافية مكتشفة</p>
                  <p className="text-xs mt-1">استندوا إلى ملف الوقائع وشهادات الحاضرين للوصول إلى الحقيقة.</p>
                </div>
              )}

              {/* Reveal Next Evidence CTA (Controlled by GameEngine) */}
              {hasMoreEvidence && onRevealNextEvidence ? (
                <button
                  id="btn_reveal_next_evidence"
                  onClick={() => {
                    sound.playClick();
                    onRevealNextEvidence();
                    // Set active index to new clue
                    setActiveEvidenceIndex(totalRevealedCount);
                  }}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#141724] border border-[#c8923a]/60 hover:border-[#f3cb79] hover:bg-[#1a1f30] text-[#f3cb79] font-black font-['Cairo'] text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>طلب فحص دليل إضافي ({totalRevealedCount} / {totalAllCount} مكتشف)</span>
                </button>
              ) : totalAllCount > 0 ? (
                <div className="w-full py-2.5 px-4 rounded-2xl bg-black/40 border border-emerald-900/30 text-emerald-300/80 font-bold font-['Cairo'] text-xs text-center flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>تم الكشف عن جميع الأدلة المتاحة في ملف القضية ({totalRevealedCount})</span>
                </div>
              ) : null}
            </motion.div>
          )}

          {/* TAB 2: SUSPECTS / CHARACTERS */}
          {activeTab === 'suspects' && (
            <motion.div
              key="suspects_tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-3"
            >
              <div className="text-xs text-[#9b988f] font-medium font-['Cairo'] px-1">
                قائمة الحاضرين في مسرح الأحداث (لا تظهر أي هويات سرية أو أدوار خاصة):
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {players.map((p, idx) => (
                  <div
                    key={p.id || idx}
                    className={`rounded-2xl p-4 bg-[#0d0f16] border ${
                      p.eliminated ? 'border-red-900/40 opacity-60' : 'border-[#7a5c2b]/35'
                    } flex items-center justify-between gap-3 shadow-md`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1c2030] to-black border border-[#c8923a]/40 flex items-center justify-center text-[#f3cb79] font-black text-sm font-['Cairo']">
                        {p.character.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black font-['Cairo'] text-[#f5ebd9]">
                            {p.character.name}
                          </h4>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#181c2b] text-[#c8923a] border border-[#c8923a]/30 font-medium font-['Cairo']">
                            {p.character.profession}
                          </span>
                        </div>
                        <p className="text-xs text-[#9b988f] font-['Cairo'] mt-0.5">
                          اللاعب: <span className="text-[#f5ebd9] font-bold">{p.name}</span>
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      {p.eliminated ? (
                        <span className="text-[11px] font-bold font-['Cairo'] px-2 py-1 rounded-lg bg-red-950/60 text-red-400 border border-red-800/40">
                          مستبعد
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold font-['Cairo'] px-2 py-1 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                          نشط
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 3: CASE BRIEFING */}
          {activeTab === 'briefing' && (
            <motion.div
              key="briefing_tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-[26px] bg-[#0d0f16] border border-[#c8923a]/40 p-5 sm:p-6 shadow-xl flex flex-col gap-4"
            >
              <div>
                <span className="text-xs font-black text-[#c8923a] block mb-1">المكان والسياق:</span>
                <p className="text-xs sm:text-sm text-[#f5ebd9] leading-relaxed font-semibold font-['Cairo']">
                  {story.introduction.setting}
                </p>
              </div>

              <div>
                <span className="text-xs font-black text-[#c8923a] block mb-1">الوضع القائم:</span>
                <p className="text-xs sm:text-sm text-[#d4cfc7] leading-relaxed font-medium font-['Cairo']">
                  {story.introduction.situation}
                </p>
              </div>

              <div>
                <span className="text-xs font-black text-[#c8923a] block mb-1">الحادثة:</span>
                <p className="text-xs sm:text-sm text-[#f5ebd9] leading-relaxed font-semibold font-['Cairo']">
                  {story.introduction.incident}
                </p>
              </div>

              <div>
                <span className="text-xs font-black text-[#c8923a] block mb-1">المخاطر والرهانات:</span>
                <p className="text-xs sm:text-sm text-[#d4cfc7] leading-relaxed font-medium font-['Cairo']">
                  {story.introduction.stakes}
                </p>
              </div>
            </motion.div>
          )}

          {/* TAB 4: DISCUSSION PROMPTS */}
          {activeTab === 'prompts' && (
            <motion.div
              key="prompts_tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-3"
            >
              <div className="text-xs text-[#9b988f] font-medium font-['Cairo'] px-1">
                محاور استرشادية مفتوحة للنقاش (ليست مهام إلزامية):
              </div>
              {generalPrompts.map((prompt, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl p-4 bg-[#0d0f16] border border-[#7a5c2b]/35 shadow-md flex flex-col gap-1.5"
                >
                  <h4 className="text-sm font-black font-['Cairo'] text-[#f3cb79] flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-amber-400" />
                    <span>{prompt.title}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-[#d4cfc7] leading-relaxed font-['Cairo']">
                    {prompt.text}
                  </p>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Bottom Sticky Action: Proceed to Voting */}
        <div className="pt-3">
          <motion.button
            id="btn_proceed_to_voting"
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

      {/* Confirmation Modal when Leaving Active Session */}
      <AnimatePresence>
        {showExitConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-[24px] bg-[#0e111a] border-2 border-amber-500/40 p-6 text-center text-slate-100 flex flex-col gap-4 shadow-2xl"
            >
              <h3 className="text-lg font-black font-['Cairo'] text-[#f3cb79]">
                مغادرة جلسة التحقيق؟
              </h3>
              <p className="text-xs sm:text-sm text-[#b0a99c] font-['Cairo'] leading-relaxed">
                هل أنت متأكد من رغبتك في مغادرة جلسة التحقيق الحالية والعودة إلى القائمة؟
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 py-3 rounded-xl bg-black/50 border border-slate-700 text-slate-300 font-bold font-['Cairo'] text-sm hover:bg-black/70 cursor-pointer"
                >
                  متابعة التحقيق
                </button>
                <button
                  onClick={() => {
                    setShowExitConfirm(false);
                    if (onNavigateHome) onNavigateHome();
                    else if (onBack) onBack();
                  }}
                  className="flex-1 py-3 rounded-xl bg-red-900/80 border border-red-600 text-red-100 font-bold font-['Cairo'] text-sm hover:bg-red-800 cursor-pointer"
                >
                  نعم، مغادرة
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
