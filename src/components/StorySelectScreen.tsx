import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, ChevronLeft, SlidersHorizontal, Check, Home } from 'lucide-react';
import { StoryData } from '../types';
import { sound } from '../utils/audio';

interface StorySelectScreenProps {
  stories: StoryData[];
  onSelectStory: (story: StoryData) => void;
  onOpenCustomStoryModal: () => void;
  onBack: () => void;
  onNavigateHome?: () => void;
}

// Story metadata mapping: difficulty, difficulty level (1=easy, 2=medium, 3=hard), unique thematic image, and badge
interface StoryMeta {
  difficultyText: string;
  difficultyLevel: 1 | 2 | 3; // 1: easy (green), 2: medium (gold/yellow), 3: hard (red)
  isNew?: boolean;
  image: string;
}

// Highly specific, curated, cinematic images directly reflecting each story's mystery and location
const STORY_META_MAP: Record<string, StoryMeta> = {
  // 1. مدينة الأحلام (Cyberpunk neural network, glowing digital mind/dream laboratory)
  dreams: {
    difficultyText: 'متوسط',
    difficultyLevel: 2,
    isNew: true,
    image: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?w=800&auto=format&fit=crop&q=80',
  },
  // 2. نخب أخير (Luxury gala champagne toast & poisoned glass at dark banquet)
  gala_toast: {
    difficultyText: 'سهل',
    difficultyLevel: 1,
    isNew: true,
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=80',
  },
  // 3. سرقة المتحف الأسود (Dark historical museum / classic art gallery with golden frames & stolen painting spotlight)
  museum: {
    difficultyText: 'صعب',
    difficultyLevel: 3,
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
  },
  // 4. قطار منتصف الليل (Classic luxury train interior / vintage train racing through dark night)
  train: {
    difficultyText: 'متوسط',
    difficultyLevel: 2,
    image: 'https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?w=800&auto=format&fit=crop&q=80',
  },
  // 5. مرصد النجم الساقط (Huge astronomy telescope dome pointing at starry galaxy & meteor trail)
  observatory: {
    difficultyText: 'صعب',
    difficultyLevel: 3,
    image: 'https://images.unsplash.com/photo-1538370965046-79c0d6907d47?w=800&auto=format&fit=crop&q=80',
  },
  // 6. أرشيف الرمال (Ancient lost desert city, papyrus parchment and expedition ruins)
  desert_archive: {
    difficultyText: 'متوسط',
    difficultyLevel: 2,
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80',
  },
  // 7. قرية تحت الماء (Submerged ancient stone bell tower & flooded village ruins underwater)
  drowned_village: {
    difficultyText: 'صعب',
    difficultyLevel: 3,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80',
  },
  // 8. محطة الجليد الأخير (Extreme polar blizzard research station / arctic ice cores lab)
  arctic_station: {
    difficultyText: 'متوسط',
    difficultyLevel: 2,
    image: 'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?w=800&auto=format&fit=crop&q=80',
  },
  // 9. المشهد الأخير (Vintage cinema film set, spotlights, clapperboard & historic studio)
  film_set: {
    difficultyText: 'سهل',
    difficultyLevel: 1,
    image: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=800&auto=format&fit=crop&q=80',
  },
  // 10. نداء من الأعماق (Deep sea submersible navigation console and deep ocean trench exploration)
  submarine: {
    difficultyText: 'صعب',
    difficultyLevel: 3,
    image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800&auto=format&fit=crop&q=80',
  },
  // 11. القضية الصامتة (Grand courtroom judge gavel, law books & archive evidence room)
  court: {
    difficultyText: 'متوسط',
    difficultyLevel: 2,
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
  },
  // 12. ليلة في الدفيئة (Mysterious glass botanical greenhouse with glowing rare flora and night mist)
  greenhouse: {
    difficultyText: 'سهل',
    difficultyLevel: 1,
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&auto=format&fit=crop&q=80',
  },
  // 13. وليمة القصر (Grand palace banquet dining hall with candlelit chandeliers and royal trays)
  royal_kitchen: {
    difficultyText: 'متوسط',
    difficultyLevel: 2,
    image: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=800&auto=format&fit=crop&q=80',
  },
};

// Fallback high-res detective / investigation image for any newly created or custom story
const DEFAULT_STORY_IMAGE = 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80';

export const StorySelectScreen: React.FC<StorySelectScreenProps> = ({
  stories,
  onSelectStory,
  onOpenCustomStoryModal,
  onBack,
  onNavigateHome,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'easy' | 'medium' | 'hard' | 'custom'>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Filter logic
  const filteredStories = stories.filter((s) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'custom') return !!s.isCustom;
    const meta = STORY_META_MAP[s.id] || { difficultyLevel: 2 };
    if (activeFilter === 'easy') return meta.difficultyLevel === 1;
    if (activeFilter === 'medium') return meta.difficultyLevel === 2;
    if (activeFilter === 'hard') return meta.difficultyLevel === 3;
    return true;
  });

  const handleRandomPick = () => {
    sound.playClick();
    if (stories.length === 0) return;
    const randomIndex = Math.floor(Math.random() * stories.length);
    onSelectStory(stories[randomIndex]);
  };

  const getDifficultyMeta = (story: StoryData): StoryMeta => {
    if (STORY_META_MAP[story.id]) {
      return STORY_META_MAP[story.id];
    }
    return {
      difficultyText: 'متوسط',
      difficultyLevel: 2,
      isNew: story.isCustom,
      image: DEFAULT_STORY_IMAGE,
    };
  };

  const getStoryImage = (story: StoryData): string => {
    if (STORY_META_MAP[story.id]?.image) {
      return STORY_META_MAP[story.id].image;
    }
    return DEFAULT_STORY_IMAGE;
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center bg-[#07080c] select-none text-slate-100 pb-16 pt-4 px-3 sm:px-6" dir="rtl">
      
      {/* Background Subtle Gradient & Ambient Noir Vignettes */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#0e1117] via-[#090b0f] to-[#050608] pointer-events-none" />
      <div className="fixed top-0 inset-x-0 h-64 bg-[radial-gradient(ellipse_at_top,rgba(200,146,58,0.08),transparent_70%)] pointer-events-none" />

      {/* Main Page Container - Generous Max-Width for Comfortable Scrolling & Large Cards */}
      <div className="relative z-10 w-full max-w-xl flex flex-col gap-5">
        
        {/* 1. Header Bar: Gold Circular Back Button + Centered Title + Filter & Home Buttons */}
        <div className="flex items-center justify-between w-full pt-2 pb-1 border-b border-amber-900/20">
          {/* Back Circular Button (Gold Outline) */}
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

          {/* Title & Subtitle in Center */}
          <div className="text-center">
            <h1 className="text-2xl font-black font-['Cairo'] text-[#f5ebd9] tracking-wide leading-tight drop-shadow-md">
              اختر قصة
            </h1>
            <p className="text-xs sm:text-sm text-[#9b988f] font-medium font-['Cairo'] mt-0.5">
              اختر لغزك المفضل وابدأ التحقيق
            </p>
          </div>

          {/* Actions: Filter + Home Button */}
          <div className="flex items-center gap-2">
            {/* Filter Button */}
            <div className="relative">
              <button
                onClick={() => {
                  sound.playClick();
                  setShowFilterDropdown(!showFilterDropdown);
                }}
                className={`px-3 py-2 rounded-xl border flex items-center gap-1.5 text-xs sm:text-sm font-bold font-['Cairo'] transition-all cursor-pointer shadow-md ${
                  activeFilter !== 'all'
                    ? 'bg-[#c8923a]/30 text-[#f5ebd9] border-[#e5b35a]'
                    : 'bg-black/60 border-[#c8923a]/60 text-[#e5b35a] hover:border-[#f3cb79] hover:text-[#f3cb79]'
                }`}
                title="تصفية القصص"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">تصفية</span>
              </button>

              {/* Filter Dropdown Popover */}
              <AnimatePresence>
                {showFilterDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    className="absolute left-0 top-full mt-2 w-44 rounded-2xl bg-[#0f121a] border border-[#c8923a]/60 shadow-2xl p-2 z-30 flex flex-col gap-1 backdrop-blur-xl"
                  >
                    {[
                      { key: 'all', label: 'جميع القصص' },
                      { key: 'easy', label: 'سهل' },
                      { key: 'medium', label: 'متوسط' },
                      { key: 'hard', label: 'صعب' },
                      { key: 'custom', label: 'القصص المخصصة' },
                    ].map((filterItem) => (
                      <button
                        key={filterItem.key}
                        onClick={() => {
                          sound.playClick();
                          setActiveFilter(filterItem.key as any);
                          setShowFilterDropdown(false);
                        }}
                        className={`w-full text-right px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold font-['Cairo'] flex items-center justify-between transition-colors cursor-pointer ${
                          activeFilter === filterItem.key
                            ? 'bg-[#c8923a]/25 text-[#f3cb79]'
                            : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                        }`}
                      >
                        <span>{filterItem.label}</span>
                        {activeFilter === filterItem.key && <Check className="w-4 h-4 text-[#e5b35a]" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Home Button */}
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

        {/* 2. Stories List - Spacious, Highly Legible, Beautiful Cards with Custom Images */}
        <div className="flex flex-col gap-4 w-full">
          {filteredStories.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400 gap-4 bg-[#0c0e14] rounded-3xl border border-amber-900/20">
              <p className="text-base font-bold text-slate-300">لا توجد قصص مطابقة لهذا الفلتر</p>
              <button
                onClick={() => setActiveFilter('all')}
                className="px-5 py-2.5 rounded-xl bg-[#c8923a]/20 text-[#f3cb79] border border-[#c8923a]/50 text-sm font-bold font-['Cairo'] cursor-pointer"
              >
                عرض كل القصص
              </button>
            </div>
          ) : (
            filteredStories.map((story, idx) => {
              const meta = getDifficultyMeta(story);
              const isNew = meta.isNew || idx === 0;
              const storyImg = getStoryImage(story);

              return (
                <motion.div
                  key={story.id}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => {
                    sound.playClick();
                    onSelectStory(story);
                  }}
                  className="relative w-full rounded-[24px] bg-[#0d0f16] border border-[#7a5c2b]/50 hover:border-[#c8923a] p-4 sm:p-5 shadow-[0_6px_22px_rgba(0,0,0,0.7)] transition-all cursor-pointer flex items-center gap-4 sm:gap-5 overflow-hidden group"
                >
                  {/* Left Thumbnail Image with High Clarity & Optional "جديد" Ribbon Badge */}
                  <div className="relative w-[130px] sm:w-[155px] h-[115px] sm:h-[130px] rounded-[18px] overflow-hidden shrink-0 border border-[#3b3223] shadow-md bg-black">
                    <img
                      src={storyImg}
                      alt={story.title}
                      className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    
                    {/* Atmospheric Shadow Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

                    {/* Ribbon Tag "جديد" in Rich Red matching reference */}
                    {isNew && (
                      <div className="absolute -top-1 -right-1 overflow-hidden w-14 h-14 pointer-events-none">
                        <div className="absolute transform rotate-45 bg-[#c52222] text-white text-[10.5px] font-black font-['Cairo'] text-center py-0.5 right-[-24px] top-[12px] w-[80px] shadow-md tracking-wider">
                          جديد
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Story Content & Large Legible Data Fields */}
                  <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
                    
                    {/* Title & Direction Arrow */}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base sm:text-lg font-black font-['Cairo'] text-[#f0caa0] group-hover:text-[#fae0be] transition-colors leading-snug line-clamp-1">
                        {story.title}
                      </h3>
                      <ChevronLeft className="w-5 h-5 text-[#9a886c] group-hover:text-[#f0caa0] group-hover:translate-x-[-3px] transition-transform shrink-0 mt-0.5 rtl:rotate-0" />
                    </div>

                    {/* Story Description (Spacious, Clear & High Contrast) */}
                    <p className="text-xs sm:text-[13px] text-[#c4beb3] font-normal font-['Cairo'] line-clamp-2 leading-relaxed mt-1 text-right">
                      {story.description}
                    </p>

                    {/* Bottom Metadata Fields: Players (4-12 اللاعبين) & Difficulty (متوسط / سهل / صعب) */}
                    <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-amber-900/25 text-xs sm:text-sm font-['Cairo']">
                      
                      {/* Players Count Field */}
                      <div className="flex items-center gap-1.5 text-[#ede6d8]">
                        <Users className="w-4 h-4 text-[#c8923a]" />
                        <span className="font-extrabold text-xs sm:text-sm">
                          {story.minPlayers === story.maxPlayers
                            ? `${story.minPlayers}`
                            : `${story.minPlayers}-${story.maxPlayers}`}
                        </span>
                        <span className="text-[11px] sm:text-xs text-[#a39a8c]">اللاعبين</span>
                      </div>

                      {/* Difficulty Field with Signal Bars & Dynamic Colors */}
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-[#ede6d8] text-xs sm:text-sm">
                          {meta.difficultyText}
                        </span>
                        
                        {/* Custom 3-Bar Difficulty Signal Icon */}
                        <div className="flex items-end gap-[3px] h-4 px-0.5">
                          <div
                            className={`w-[4px] rounded-sm transition-all ${
                              meta.difficultyLevel >= 1
                                ? meta.difficultyLevel === 1
                                  ? 'h-2 bg-[#4ade80] shadow-[0_0_8px_rgba(74,222,128,0.5)]' // Green for easy
                                  : meta.difficultyLevel === 2
                                  ? 'h-2 bg-[#facc15] shadow-[0_0_8px_rgba(250,204,21,0.5)]' // Yellow for medium
                                  : 'h-2 bg-[#ef4444] shadow-[0_0_8px_rgba(239,68,68,0.5)]' // Red for hard
                                : 'h-2 bg-slate-700'
                            }`}
                          />
                          <div
                            className={`w-[4px] rounded-sm transition-all ${
                              meta.difficultyLevel >= 2
                                ? meta.difficultyLevel === 2
                                  ? 'h-3 bg-[#facc15] shadow-[0_0_8px_rgba(250,204,21,0.5)]' // Yellow for medium
                                  : 'h-3 bg-[#ef4444] shadow-[0_0_8px_rgba(239,68,68,0.5)]' // Red for hard
                                : 'h-3 bg-slate-700'
                            }`}
                          />
                          <div
                            className={`w-[4px] rounded-sm transition-all ${
                              meta.difficultyLevel >= 3
                                ? 'h-4 bg-[#ef4444] shadow-[0_0_8px_rgba(239,68,68,0.5)]' // Red for hard
                                : 'h-4 bg-slate-700'
                            }`}
                          />
                        </div>

                        <span className="text-[11px] sm:text-xs text-[#a39a8c]">الصعوبة</span>
                      </div>

                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* 3. Bottom Action: "قصة عشوائية" (Random Story Box) */}
        <div className="pt-3">
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRandomPick}
            className="w-full rounded-[24px] py-4 px-6 bg-[#0d0f16] border border-[#c8923a]/65 hover:border-[#f3cb79] shadow-xl flex items-center justify-center gap-4 transition-all cursor-pointer group"
          >
            {/* 3D Gold Dice Icon */}
            <div className="text-3xl transition-transform group-hover:rotate-12">
              🎲
            </div>

            {/* Centered Text */}
            <div className="text-center">
              <span className="text-base font-black font-['Cairo'] text-[#f5ebd9] group-hover:text-amber-200 block leading-tight">
                قصة عشوائية
              </span>
              <span className="text-xs text-[#9b988f] font-medium font-['Cairo'] block mt-1">
                دع الحظ يختار لك قصة
              </span>
            </div>
          </motion.button>
        </div>

      </div>
    </div>
  );
};
