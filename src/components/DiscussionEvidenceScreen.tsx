import React, { useState, useEffect } from 'react';
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
  Eye,
  Play,
  Pause,
  RotateCcw,
  Plus,
} from 'lucide-react';
import { StoryData, PlayerData } from '../types';
import { StoryEngine, Story, EvidenceItem, EvidenceType } from '../game';
import { sound } from '../utils/audio';
import { AR_STRINGS, EN_STRINGS } from '../data/translations';
import { getEvidenceCoverImage } from '../assets/evidenceCovers';

interface DiscussionEvidenceScreenProps {
  story: StoryData;
  players: PlayerData[];
  round: number;
  revealedEvidenceIds?: string[];
  revealedClues?: string[];
  totalClues?: number;
  remainingClues?: number;
  clueRevealedThisRound?: boolean;
  canRevealClue?: boolean;
  onRevealNextEvidence?: () => void;
  hasMoreEvidence?: boolean;
  onProceedToVoting: () => void;
  onBack?: () => void;
  onNavigateHome?: () => void;
  language?: 'ar' | 'en';
  timerMinutes?: number;
}

type TabType = 'evidence' | 'suspects' | 'briefing' | 'prompts';

export const DiscussionEvidenceScreen: React.FC<DiscussionEvidenceScreenProps> = ({
  story,
  players,
  round,
  revealedEvidenceIds = [],
  revealedClues = [],
  totalClues,
  remainingClues,
  clueRevealedThisRound = false,
  canRevealClue,
  onRevealNextEvidence,
  hasMoreEvidence = false,
  onProceedToVoting,
  onBack,
  onNavigateHome,
  language = 'ar',
  timerMinutes = 4,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('evidence');
  const [activeEvidenceIndex, setActiveEvidenceIndex] = useState<number>(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const isEn = language === 'en';
  const t = isEn ? EN_STRINGS : AR_STRINGS;
  const isRtl = !isEn;

  // Round Discussion Timer State
  const initialTotalSeconds = Math.max(1, timerMinutes || 4) * 60;
  const [totalSeconds, setTotalSeconds] = useState<number>(initialTotalSeconds);
  const [secondsLeft, setSecondsLeft] = useState<number>(initialTotalSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  // Sync when timerMinutes or round changes
  useEffect(() => {
    const s = Math.max(1, timerMinutes || 4) * 60;
    setTotalSeconds(s);
    setSecondsLeft(s);
    setIsTimerRunning(true);
  }, [timerMinutes, round]);

  // Countdown effect
  useEffect(() => {
    if (!isTimerRunning || secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimerRunning(false);
          sound.playGong();
          return 0;
        }

        // Play tick on final 5 seconds (5, 4, 3, 2, 1)
        if (prev <= 6 && prev > 1) {
          sound.playTick();
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerRunning, secondsLeft]);

  const handleToggleTimer = () => {
    sound.playClick();
    setIsTimerRunning((prev) => !prev);
  };

  const handleResetTimer = () => {
    sound.playClick();
    const s = Math.max(1, timerMinutes || 4) * 60;
    setTotalSeconds(s);
    setSecondsLeft(s);
    setIsTimerRunning(true);
  };

  const handleAddMinute = () => {
    sound.playClick();
    setSecondsLeft((prev) => prev + 60);
    setTotalSeconds((prev) => Math.max(prev, secondsLeft + 60));
    setIsTimerRunning(true);
  };

  const formatTime = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = totalSeconds > 0 ? Math.max(0, Math.min(100, (secondsLeft / totalSeconds) * 100)) : 0;
  const isTimeLow = secondsLeft > 0 && secondsLeft <= 30;
  const isTimeUp = secondsLeft === 0;

  // Normalize all available evidence from StoryEngine to compute counts and metadata
  const allStoryEvidence: EvidenceItem[] = StoryEngine.getStoryEvidence(story as unknown as Story);
  
  // Filter revealed evidence strictly based on GameState IDs (ONLY revealed items are visible)
  const revealedItems: EvidenceItem[] = allStoryEvidence.filter(e => 
    revealedEvidenceIds.includes(e.id)
  );

  // Strictly ONLY revealed evidence items are accessible to the UI
  const visibleEvidence: EvidenceItem[] = revealedItems;

  const currentEvidence = visibleEvidence[activeEvidenceIndex] || visibleEvidence[0] || null;
  const totalRevealedCount = visibleEvidence.length;
  const totalAllCount = allStoryEvidence.length;
  const currentPhoto = getEvidenceCoverImage(
    currentEvidence?.category,
    activeEvidenceIndex,
    story?.id
  );

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
        return { label: isEn ? 'Timeline' : 'جدول زمني', icon: Clock, color: 'text-amber-300 border-amber-500/40 bg-amber-950/40' };
      case 'witness':
        return { label: isEn ? 'Witness Testimony' : 'إفادة شاهد', icon: Users, color: 'text-sky-300 border-sky-500/40 bg-sky-950/40' };
      case 'document':
        return { label: isEn ? 'Records & Docs' : 'سجلات ومستندات', icon: FileText, color: 'text-emerald-300 border-emerald-500/40 bg-emerald-950/40' };
      case 'location':
        return { label: isEn ? 'Crime Scene' : 'موقع الحدث', icon: MapPin, color: 'text-purple-300 border-purple-500/40 bg-purple-950/40' };
      case 'contradiction':
        return { label: isEn ? 'Contradiction' : 'تناقض روايات', icon: AlertCircle, color: 'text-rose-300 border-rose-500/40 bg-rose-950/40' };
      case 'relationship':
        return { label: isEn ? 'Motives & Ties' : 'علاقات ودوافع', icon: Eye, color: 'text-indigo-300 border-indigo-500/40 bg-indigo-950/40' };
      case 'motive':
        return { label: isEn ? 'Suspected Motive' : 'شبهة دافع', icon: Sparkles, color: 'text-orange-300 border-orange-500/40 bg-orange-950/40' };
      default:
        return { label: isEn ? 'Physical Clue' : 'أثر مادي', icon: Search, color: 'text-amber-200 border-[#c8923a]/50 bg-[#161a26]' };
    }
  };

  // General open-ended discussion prompts
  const generalPrompts = isEn ? [
    {
      title: 'Review the Timeline',
      text: 'Compare the timing of the crime with the whereabouts of each person in the critical minutes. Do their stories match or are there gaps?',
    },
    {
      title: 'Examine Alibis & Statements',
      text: 'Question the suspects about what they saw or heard. Does anyone directly corroborate another suspect\'s alibi?',
    },
    {
      title: 'Motives & Opportunities',
      text: 'Who among the suspects had the strongest motive or technical means to execute the crime without drawing attention?',
    },
  ] : [
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
      dir={isRtl ? 'rtl' : 'ltr'}
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
            title={t.back}
          >
            <ChevronLeft className={`w-6 h-6 stroke-[2.4] ${isRtl ? 'rotate-180' : ''}`} />
          </button>

          <div className="text-center px-2">
            <h1 className={`text-xl sm:text-2xl font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-[#f5ebd9] tracking-wide leading-tight drop-shadow-md`}>
              {t.discussionInvestigation}
            </h1>
            <p className={`text-xs text-[#b0a99c] font-medium ${isRtl ? "font-['Cairo']" : 'font-sans'} mt-0.5`}>
              {isEn ? `Round ${round} • ${story.title}` : `الجولة ${round} • ${story.title}`}
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
            title={t.home}
          >
            <Home className="w-5 h-5" />
          </button>
        </div>

        {/* Discussion Investigation Timer Bar */}
        <div
          id="discussion_timer_card"
          className={`rounded-2xl p-3 sm:p-3.5 bg-gradient-to-b from-[#11141e] via-[#0d1017] to-[#0a0c12] border transition-all duration-300 shadow-lg ${
            isTimeUp
              ? 'border-red-600/80 shadow-[0_0_20px_rgba(239,68,68,0.25)]'
              : isTimeLow
              ? 'border-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
              : 'border-[#7a5c2b]/40 shadow-black/60'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            {/* Left: Clock Title & Status */}
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-colors shrink-0 ${
                  isTimeUp
                    ? 'bg-red-950/70 border-red-500/60 text-red-400'
                    : isTimeLow
                    ? 'bg-amber-950/70 border-amber-500/60 text-amber-400 animate-pulse'
                    : 'bg-black/50 border-[#c8923a]/40 text-[#f3cb79]'
                }`}
              >
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className={`text-xs sm:text-sm font-black text-[#f5ebd9] ${isRtl ? "font-['Cairo']" : 'font-sans'} leading-tight`}>
                  {t.discussionTimer}
                </span>
                <span className="text-[11px] font-medium text-[#a39a8c] mt-0.5 flex items-center gap-1.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isTimeUp ? 'bg-red-500' : isTimerRunning ? 'bg-emerald-400 animate-ping' : 'bg-amber-500'
                    }`}
                  />
                  <span>
                    {isTimeUp
                      ? (isEn ? "Time's Up!" : 'انتهى الوقت!')
                      : isTimerRunning
                      ? (isEn ? 'Timer Active' : 'المؤقت يعمل')
                      : t.timerPaused}
                  </span>
                </span>
              </div>
            </div>

            {/* Right: Digital Monospace Timer Display */}
            <div className="flex items-center gap-2">
              <div
                className={`px-3 py-1.5 rounded-xl font-mono text-xl sm:text-2xl font-black tracking-wider transition-all border ${
                  isTimeUp
                    ? 'bg-red-950/80 border-red-500 text-red-300 animate-bounce'
                    : isTimeLow
                    ? 'bg-amber-950/80 border-amber-500 text-amber-300 animate-pulse'
                    : 'bg-black/70 border-[#7a5c2b]/50 text-[#f3cb79]'
                }`}
              >
                {formatTime(secondsLeft)}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-black/60 h-1.5 rounded-full overflow-hidden mt-3 border border-white/5">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                isTimeUp
                  ? 'bg-red-600'
                  : isTimeLow
                  ? 'bg-gradient-to-r from-amber-500 to-red-500'
                  : 'bg-gradient-to-r from-[#c8923a] via-[#f1bf66] to-[#d49e3d]'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between pt-2.5 gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              {/* Play / Pause */}
              <button
                id="timer_toggle_btn"
                onClick={handleToggleTimer}
                disabled={isTimeUp}
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
                  isTimeUp
                    ? 'opacity-40 cursor-not-allowed border-slate-800 bg-black/30 text-slate-500'
                    : isTimerRunning
                    ? 'bg-black/50 border-amber-600/40 text-amber-300 hover:bg-black/80'
                    : 'bg-amber-500/20 border-amber-400 text-amber-200 hover:bg-amber-500/30'
                }`}
              >
                {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isTimerRunning ? t.pauseTimer : t.resumeTimer}</span>
              </button>

              {/* +1 Minute */}
              <button
                id="timer_add_minute_btn"
                onClick={handleAddMinute}
                className="px-2.5 py-1.5 rounded-xl border border-[#7a5c2b]/40 bg-black/40 text-[#f5ebd9] hover:bg-black/70 hover:border-[#c8923a] flex items-center gap-1 font-bold transition-all cursor-pointer"
                title={t.addMinute}
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.addMinute}</span>
              </button>
            </div>

            {/* Reset */}
            <button
              id="timer_reset_btn"
              onClick={handleResetTimer}
              className="px-2.5 py-1.5 rounded-xl border border-[#7a5c2b]/30 bg-black/30 text-[#a39a8c] hover:text-[#f5ebd9] hover:bg-black/60 flex items-center gap-1 font-medium transition-all cursor-pointer"
              title={isEn ? 'Reset Timer' : 'إعادة ضبط المؤقت'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isEn ? 'Reset' : 'إعادة'}</span>
            </button>
          </div>

          {/* Time Up Banner */}
          {isTimeUp && (
            <div className="mt-2.5 p-2.5 rounded-xl bg-red-950/70 border border-red-500/60 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-red-200">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{isEn ? 'Discussion time is up! Ready to vote?' : 'انتهى وقت النقاش! حان موعد التصويت'}</span>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  onProceedToVoting();
                }}
                className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-black shrink-0 cursor-pointer shadow-md"
              >
                {isEn ? 'Vote Now' : 'التصويت الآن'}
              </button>
            </div>
          )}
        </div>

        {/* Noir Tab Navigation */}
        <div className="grid grid-cols-4 gap-1.5 p-1.5 rounded-2xl bg-[#0e111a] border border-[#7a5c2b]/35 shadow-inner">
          <button
            id="tab_evidence"
            onClick={() => {
              sound.playClick();
              setActiveTab('evidence');
            }}
            className={`py-2 px-1 rounded-xl text-xs font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} flex flex-col items-center gap-1 transition-all cursor-pointer ${
              activeTab === 'evidence'
                ? 'bg-gradient-to-r from-[#c8923a] to-[#d49e3d] text-slate-950 shadow-md'
                : 'text-[#b0a99c] hover:text-[#f5ebd9] hover:bg-black/30'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>{t.evidenceTab} ({visibleEvidence.length})</span>
          </button>

          <button
            id="tab_suspects"
            onClick={() => {
              sound.playClick();
              setActiveTab('suspects');
            }}
            className={`py-2 px-1 rounded-xl text-xs font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} flex flex-col items-center gap-1 transition-all cursor-pointer ${
              activeTab === 'suspects'
                ? 'bg-gradient-to-r from-[#c8923a] to-[#d49e3d] text-slate-950 shadow-md'
                : 'text-[#b0a99c] hover:text-[#f5ebd9] hover:bg-black/30'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{t.suspectsTab} ({players.length})</span>
          </button>

          <button
            id="tab_briefing"
            onClick={() => {
              sound.playClick();
              setActiveTab('briefing');
            }}
            className={`py-2 px-1 rounded-xl text-xs font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} flex flex-col items-center gap-1 transition-all cursor-pointer ${
              activeTab === 'briefing'
                ? 'bg-gradient-to-r from-[#c8923a] to-[#d49e3d] text-slate-950 shadow-md'
                : 'text-[#b0a99c] hover:text-[#f5ebd9] hover:bg-black/30'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{t.caseBriefingTab}</span>
          </button>

          <button
            id="tab_prompts"
            onClick={() => {
              sound.playClick();
              setActiveTab('prompts');
            }}
            className={`py-2 px-1 rounded-xl text-xs font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} flex flex-col items-center gap-1 transition-all cursor-pointer ${
              activeTab === 'prompts'
                ? 'bg-gradient-to-r from-[#c8923a] to-[#d49e3d] text-slate-950 shadow-md'
                : 'text-[#b0a99c] hover:text-[#f5ebd9] hover:bg-black/30'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>{t.discussionPromptsTab}</span>
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
                        <div className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} px-3 py-1 rounded-xl text-xs font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} shadow-md flex items-center gap-1.5 border ${badge.color}`}>
                          <BadgeIcon className="w-3.5 h-3.5" />
                          <span>{badge.label}</span>
                        </div>
                      );
                    })()}

                    <div className={`absolute bottom-3 ${isRtl ? 'right-3' : 'left-3'} px-3 py-1 rounded-xl bg-black/80 backdrop-blur-sm border border-amber-500/30 text-[#f3cb79] text-xs font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} shadow-md`}>
                      {isEn ? `Evidence Clue ${activeEvidenceIndex + 1} of ${totalRevealedCount}` : `دليل تحقيقي ${activeEvidenceIndex + 1} من ${totalRevealedCount}`}
                    </div>
                  </div>

                  {/* Evidence Details */}
                  <div className="flex flex-col gap-2">
                    <h3 className={`text-lg sm:text-xl font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-[#f3cb79]`}>
                      {currentEvidence.title}
                    </h3>
                    <p className={`text-xs sm:text-sm text-[#f5ebd9] leading-relaxed font-semibold ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
                      {currentEvidence.publicClue || currentEvidence.description}
                    </p>
                    {currentEvidence.description && currentEvidence.description !== currentEvidence.publicClue && (
                      <p className={`text-xs text-[#a39a8c] leading-relaxed ${isRtl ? "font-['Cairo']" : 'font-sans'} mt-1`}>
                        {currentEvidence.description}
                      </p>
                    )}
                  </div>

                  {/* Discussion Question */}
                  {currentEvidence.discussionPrompt && (
                    <div className={`p-3.5 rounded-2xl bg-[#141724] border border-[#c8923a]/35 text-xs sm:text-sm ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
                      <span className="text-[#f3cb79] font-black block mb-1">
                        {isEn ? 'Discussion & Inquiry Topic:' : 'محور مطروح للنقاش والتحقق:'}
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
                        title={isEn ? 'Previous Clue' : 'الدليل السابق'}
                      >
                        <ChevronLeft className={`w-5 h-5 stroke-[2.4] ${isRtl ? 'rotate-180' : ''}`} />
                      </button>

                      <span className={`text-xs font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-[#f5ebd9]`}>
                        {activeEvidenceIndex + 1} / {totalRevealedCount}
                      </span>

                      <button
                        disabled={activeEvidenceIndex === totalRevealedCount - 1}
                        onClick={handleNextEvidence}
                        className="p-2.5 rounded-xl bg-black/60 text-[#e5b35a] hover:text-[#f3cb79] disabled:opacity-30 border border-[#7a5c2b]/50 transition-colors cursor-pointer"
                        title={isEn ? 'Next Clue' : 'الدليل التالي'}
                      >
                        <ChevronRight className={`w-5 h-5 stroke-[2.4] ${isRtl ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className={`rounded-[24px] bg-[#0d0f16] border border-amber-900/30 p-6 text-center text-[#b0a99c] ${isRtl ? "font-['Cairo']" : 'font-sans'} flex flex-col items-center gap-2`}>
                  <Search className="w-10 h-10 text-[#c8923a]/60 mb-1" />
                  <p className="text-sm font-bold text-[#f5ebd9]">
                    {totalAllCount === 0 
                      ? (isEn ? 'No additional physical clues in this case file' : 'لا توجد أدلة مادية إضافية في هذا الملف') 
                      : (isEn ? 'No physical clue has been revealed yet' : 'لم يتم فحص أي دليل مادي بعد')}
                  </p>
                  <p className="text-xs leading-relaxed max-w-sm">
                    {totalAllCount === 0
                      ? (isEn ? 'Rely on the case briefing and suspects\' statements to discover the truth.' : 'اعتمدوا على ملف الوقائع وإفادات الحاضرين للوصول إلى الحقيقة.')
                      : (isEn ? `The case file contains (${totalAllCount}) clues available for investigation.` : `ملف القضية يحتوي على (${totalAllCount}) أدلة ومسارات قابلة للفحص والتحري.`)}
                  </p>
                </div>
              )}

              {/* Reveal Next Evidence CTA & Status */}
              {(() => {
                const maxClues = totalClues || totalAllCount;
                const remaining = remainingClues !== undefined ? remainingClues : (maxClues - totalRevealedCount);

                if (clueRevealedThisRound) {
                  return (
                    <div className={`w-full py-3 px-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200/90 font-bold ${isRtl ? "font-['Cairo']" : 'font-sans'} text-xs text-center flex items-center justify-center gap-2 shadow-sm`}>
                      <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>
                        {isEn
                          ? `Clue revealed for this round (1 clue max per round). Remaining: ${remaining} of ${maxClues}`
                          : `تم كشف دليل هذه الجولة (دليل واحد كحد أقصى لكل جولة). المتبقي: ${remaining} من ${maxClues}`}
                      </span>
                    </div>
                  );
                }

                if (remaining <= 0) {
                  return (
                    <div className={`w-full py-2.5 px-4 rounded-2xl bg-black/40 border border-emerald-900/30 text-emerald-300/80 font-bold ${isRtl ? "font-['Cairo']" : 'font-sans'} text-xs text-center flex items-center justify-center gap-2`}>
                      <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>
                        {isEn
                          ? `All allocated clues for this game have been revealed (${maxClues} clues total)`
                          : `تم الكشف عن جميع الأدلة المخصصة لهذه القضية (${maxClues} أدلة)`}
                      </span>
                    </div>
                  );
                }

                if (hasMoreEvidence && onRevealNextEvidence) {
                  return (
                    <button
                      id="btn_reveal_next_evidence"
                      onClick={() => {
                        sound.playClick();
                        onRevealNextEvidence();
                        setActiveEvidenceIndex(totalRevealedCount);
                      }}
                      className={`w-full py-3.5 px-4 rounded-2xl bg-[#141724] border border-[#c8923a]/60 hover:border-[#f3cb79] hover:bg-[#1a1f30] text-[#f3cb79] font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md`}
                    >
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>
                        {isEn
                          ? `Request Next Clue (${totalRevealedCount} / ${maxClues} revealed)`
                          : `طلب فحص دليل إضافي (${totalRevealedCount} / ${maxClues} مكشوف)`}
                      </span>
                    </button>
                  );
                }

                return null;
              })()}
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
              <div className={`text-xs text-[#9b988f] font-medium ${isRtl ? "font-['Cairo']" : 'font-sans'} px-1`}>
                {isEn ? 'List of all persons present (secret roles and hidden identities remain concealed):' : 'قائمة الحاضرين في مسرح الأحداث (لا تظهر أي هويات سرية أو أدوار خاصة):'}
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
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-[#1c2030] to-black border border-[#c8923a]/40 flex items-center justify-center text-[#f3cb79] font-black text-sm ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
                        {p.character.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className={`text-sm font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-[#f5ebd9]`}>
                            {p.character.name}
                          </h4>
                          <span className={`text-[11px] px-2 py-0.5 rounded-full bg-[#181c2b] text-[#c8923a] border border-[#c8923a]/30 font-medium ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
                            {p.character.profession}
                          </span>
                        </div>
                        <p className={`text-xs text-[#9b988f] ${isRtl ? "font-['Cairo']" : 'font-sans'} mt-0.5`}>
                          {isEn ? 'Player: ' : 'اللاعب: '}<span className="text-[#f5ebd9] font-bold">{p.name}</span>
                        </p>
                      </div>
                    </div>

                    <div className={`shrink-0 ${isRtl ? 'text-right' : 'text-left'}`}>
                      {p.eliminated ? (
                        <span className={`text-[11px] font-bold ${isRtl ? "font-['Cairo']" : 'font-sans'} px-2 py-1 rounded-lg bg-red-950/60 text-red-400 border border-red-800/40`}>
                          {isEn ? 'Eliminated' : 'مستبعد'}
                        </span>
                      ) : (
                        <span className={`text-[11px] font-bold ${isRtl ? "font-['Cairo']" : 'font-sans'} px-2 py-1 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/40`}>
                          {isEn ? 'Active' : 'نشط'}
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
                <span className="text-xs font-black text-[#c8923a] block mb-1">{isEn ? 'Setting & Location:' : 'المكان والسياق:'}</span>
                <p className={`text-xs sm:text-sm text-[#f5ebd9] leading-relaxed font-semibold ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
                  {story.introduction.setting}
                </p>
              </div>

              <div>
                <span className="text-xs font-black text-[#c8923a] block mb-1">{isEn ? 'Situation:' : 'الوضع القائم:'}</span>
                <p className={`text-xs sm:text-sm text-[#d4cfc7] leading-relaxed font-medium ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
                  {story.introduction.situation}
                </p>
              </div>

              <div>
                <span className="text-xs font-black text-[#c8923a] block mb-1">{isEn ? 'Incident:' : 'الحادثة:'}</span>
                <p className={`text-xs sm:text-sm text-[#f5ebd9] leading-relaxed font-semibold ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
                  {story.introduction.incident}
                </p>
              </div>

              <div>
                <span className="text-xs font-black text-[#c8923a] block mb-1">{isEn ? 'Stakes & Risks:' : 'المخاطر والرهانات:'}</span>
                <p className={`text-xs sm:text-sm text-[#d4cfc7] leading-relaxed font-medium ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
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
              <div className={`text-xs text-[#9b988f] font-medium ${isRtl ? "font-['Cairo']" : 'font-sans'} px-1`}>
                {isEn ? 'Open-ended guideline questions for detective discussion:' : 'محاور استرشادية مفتوحة للنقاش (ليست مهام إلزامية):'}
              </div>
              {generalPrompts.map((prompt, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl p-4 bg-[#0d0f16] border border-[#7a5c2b]/35 shadow-md flex flex-col gap-1.5"
                >
                  <h4 className={`text-sm font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-[#f3cb79] flex items-center gap-2`}>
                    <MessageSquare className="w-4 h-4 text-amber-400" />
                    <span>{prompt.title}</span>
                  </h4>
                  <p className={`text-xs sm:text-sm text-[#d4cfc7] leading-relaxed ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
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
            className={`w-full rounded-[24px] py-4 px-6 bg-gradient-to-r from-[#d49e3d] via-[#f1bf66] to-[#c8923a] text-slate-950 font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-base sm:text-lg shadow-[0_6px_22px_rgba(200,146,58,0.3)] hover:brightness-105 flex items-center justify-center gap-3 transition-all cursor-pointer active:scale-95`}
          >
            <Vote className="w-5 h-5 stroke-[2.4]" />
            <span>{t.proceedToVoting}</span>
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
              className={`w-full max-w-sm rounded-[24px] bg-[#0e111a] border-2 border-amber-500/40 p-6 text-center text-slate-100 flex flex-col gap-4 shadow-2xl ${isRtl ? "font-['Cairo']" : 'font-sans'}`}
            >
              <h3 className="text-lg font-black text-[#f3cb79]">
                {isEn ? 'Leave Investigation Session?' : 'مغادرة جلسة التحقيق؟'}
              </h3>
              <p className="text-xs sm:text-sm text-[#b0a99c] leading-relaxed">
                {isEn ? 'Are you sure you want to leave the active investigation session and return to home?' : 'هل أنت متأكد من رغبتك في مغادرة جلسة التحقيق الحالية والعودة إلى القائمة؟'}
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 py-3 rounded-xl bg-black/50 border border-slate-700 text-slate-300 font-bold text-sm hover:bg-black/70 cursor-pointer"
                >
                  {isEn ? 'Continue' : 'متابعة التحقيق'}
                </button>
                <button
                  onClick={() => {
                    setShowExitConfirm(false);
                    if (onNavigateHome) onNavigateHome();
                    else if (onBack) onBack();
                  }}
                  className="flex-1 py-3 rounded-xl bg-red-900/80 border border-red-600 text-red-100 font-bold text-sm hover:bg-red-800 cursor-pointer"
                >
                  {isEn ? 'Yes, Leave' : 'نعم، مغادرة'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
