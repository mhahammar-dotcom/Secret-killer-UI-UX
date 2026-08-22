import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Plus, Trash2, BookOpen, AlertCircle, Sparkles, Check } from 'lucide-react';
import { StoryData, StoryCharacterData } from '../types';
import { sound } from '../utils/audio';

interface CustomStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveStory: (newStory: StoryData) => void;
}

export const CustomStoryModal: React.FC<CustomStoryModalProps> = ({
  isOpen,
  onClose,
  onSaveStory,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [solution, setSolution] = useState('');
  const [characters, setCharacters] = useState<StoryCharacterData[]>([
    {
      name: 'شخصية 1',
      profession: 'المهنة',
      publicIdentity: 'الهوية المعروفة للجميع',
      knowledge: 'المعلومة السرية أو خطة الجريمة',
      guilty: true,
    },
    {
      name: 'شخصية 2',
      profession: 'المهنة',
      publicIdentity: 'الهوية المعروفة للجميع',
      knowledge: 'المعلومة السرية التي رآها',
      guilty: false,
    },
    {
      name: 'شخصية 3',
      profession: 'المهنة',
      publicIdentity: 'الهوية المعروفة للجميع',
      knowledge: 'المعلومة السرية التي رآها',
      guilty: false,
    },
    {
      name: 'شخصية 4',
      profession: 'المهنة',
      publicIdentity: 'الهوية المعروفة للجميع',
      knowledge: 'المعلومة السرية التي رآها',
      guilty: false,
    },
  ]);

  const handleAddCharacter = () => {
    sound.playClick();
    if (characters.length >= 10) return;
    const newId = characters.length + 1;
    setCharacters([
      ...characters,
      {
        name: `شخصية ${newId}`,
        profession: 'المهنة',
        publicIdentity: 'الهوية المعروفة للجميع',
        knowledge: 'المعلومة السرية',
        guilty: false,
      },
    ]);
  };

  const handleRemoveCharacter = (idx: number) => {
    sound.playClick();
    if (characters.length <= 3) return;
    const next = characters.filter((_, i) => i !== idx);
    setCharacters(next);
  };

  const handleCharChange = (idx: number, field: keyof StoryCharacterData, val: any) => {
    const next = [...characters];
    next[idx] = { ...next[idx], [field]: val };
    setCharacters(next);
  };

  const handleToggleGuilty = (idx: number) => {
    sound.playClick();
    const next = characters.map((c, i) => ({
      ...c,
      guilty: i === idx,
    }));
    setCharacters(next);
  };

  const handleSave = () => {
    if (!title.trim() || !description.trim()) {
      alert('يرجى إدخال عنوان ووصف القضية');
      return;
    }

    sound.playVoteConfirm();

    const guiltyPool = characters.filter((c) => c.guilty);
    const innocentPool = characters.filter((c) => !c.guilty);

    const newStory: StoryData = {
      id: `custom_${Date.now()}`,
      title,
      description,
      minPlayers: characters.length,
      maxPlayers: characters.length,
      isCustom: true,
      guiltyPool: guiltyPool.length > 0 ? guiltyPool : [characters[0]],
      innocentPool: innocentPool.length > 0 ? innocentPool : characters.slice(1),
      fixedCharacters: characters,
      clues: ['دليل عام تم اكتشافه في مسرح الجريمة'],
      wrongVoteHints: ['راجعوا الأدلة بعناية قبل التسرع في التصويت القادم.'],
      solution: solution || 'تم حل لغز القضية المخصصة.',
      introduction: {
        setting: 'الموقع المخصص',
        situation: description,
        incident: 'وقعت الجريمة الغامضة.',
        stakes: 'كشف الحقيقة أو إفلات الجاني.',
        objective: 'من القاتل؟',
      },
      investigationRounds: [
        {
          roundNumber: 1,
          title: 'الأثر الأول',
          publicClue: 'أدلة أولية في مسرح الحادث.',
          description: 'تفاصيل الأثر المستخلص من موقع الحادث.',
          discussionPrompt: 'ناقشوا التحركات الأولية للمشتبه بهم.',
        },
      ],
    };

    onSaveStory(newStory);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4" dir="rtl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-xl max-h-[90vh] rounded-[28px] bg-[#0d0f16] border-2 border-[#c8923a]/50 p-5 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.9)] overflow-y-auto flex flex-col gap-4 text-right custom-scrollbar font-['Cairo']"
      >
        <div className="flex items-center justify-between border-b border-amber-900/30 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-black/60 border border-[#c8923a]/60 flex items-center justify-center text-[#f3cb79]">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-black text-[#f5ebd9]">تأليف قضية مخصصة جديدة</h3>
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

        {/* Story details */}
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-black text-[#f3cb79] block mb-1">
              عنوان القضية *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: سرقة الجوهرة في القصر المعزول"
              className="w-full p-3 rounded-xl bg-black/40 border border-[#7a5c2b]/50 text-[#f5ebd9] text-sm focus:outline-none focus:border-[#c8923a]"
            />
          </div>

          <div>
            <label className="text-xs font-black text-[#f3cb79] block mb-1">
              وصف وملابسات الجريمة *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب تفاصيل القصة وما حدث في مسرح الجريمة..."
              rows={3}
              className="w-full p-3 rounded-xl bg-black/40 border border-[#7a5c2b]/50 text-[#f5ebd9] text-sm focus:outline-none focus:border-[#c8923a]"
            />
          </div>

          <div>
            <label className="text-xs font-black text-[#f3cb79] block mb-1">
              الحل والاعتراف الكامل (يُعرض في النهاية)
            </label>
            <textarea
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              placeholder="كيف تمت الجريمة وما هي دوافع القاتل بالتفصيل..."
              rows={2}
              className="w-full p-3 rounded-xl bg-black/40 border border-[#7a5c2b]/50 text-[#f5ebd9] text-sm focus:outline-none focus:border-[#c8923a]"
            />
          </div>
        </div>

        {/* Characters section */}
        <div className="flex flex-col gap-2.5 pt-2 border-t border-amber-900/30">
          <div className="flex items-center justify-between">
            <span className="text-sm font-black text-[#f5ebd9]">
              شخصيات القضية ({characters.length})
            </span>
            <span className="text-xs text-[#a39a8c]">حدد القاتل بالنقر على زر المذنب</span>
          </div>

          <div className="flex flex-col gap-2.5 max-h-[35vh] overflow-y-auto pr-1 custom-scrollbar">
            {characters.map((char, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl border flex flex-col gap-2 ${
                  char.guilty
                    ? 'bg-red-950/30 border-red-500/50'
                    : 'bg-black/40 border-[#7a5c2b]/40'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={char.name}
                    onChange={(e) => handleCharChange(idx, 'name', e.target.value)}
                    placeholder="اسم الشخصية"
                    className="w-1/2 p-2 rounded-lg bg-black/50 border border-slate-700 text-xs text-[#f5ebd9] font-bold focus:outline-none"
                  />
                  <input
                    type="text"
                    value={char.profession}
                    onChange={(e) => handleCharChange(idx, 'profession', e.target.value)}
                    placeholder="المهنة / الصفة"
                    className="w-1/2 p-2 rounded-lg bg-black/50 border border-slate-700 text-xs text-[#f5ebd9] focus:outline-none"
                  />
                </div>

                <input
                  type="text"
                  value={char.publicIdentity}
                  onChange={(e) => handleCharChange(idx, 'publicIdentity', e.target.value)}
                  placeholder="الهوية العامة أمام الجميع"
                  className="w-full p-2 rounded-lg bg-black/50 border border-slate-700 text-xs text-[#d4cfc7] focus:outline-none"
                />

                <input
                  type="text"
                  value={char.knowledge}
                  onChange={(e) => handleCharChange(idx, 'knowledge', e.target.value)}
                  placeholder="المعلومة السرية الخاصة به فقط"
                  className="w-full p-2 rounded-lg bg-black/50 border border-slate-700 text-xs text-[#d4cfc7] focus:outline-none"
                />

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => handleToggleGuilty(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                      char.guilty
                        ? 'bg-red-600 text-white shadow-md'
                        : 'bg-black/50 text-[#a39a8c] border border-slate-700'
                    }`}
                  >
                    {char.guilty ? <Check className="w-3.5 h-3.5" /> : null}
                    <span>{char.guilty ? 'القاتل (مذنب)' : 'جعله القاتل'}</span>
                  </button>

                  {characters.length > 3 && (
                    <button
                      onClick={() => handleRemoveCharacter(idx)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {characters.length < 10 && (
            <button
              onClick={handleAddCharacter}
              className="w-full py-2.5 rounded-xl border border-dashed border-[#7a5c2b]/60 text-[#e5b35a] hover:bg-black/40 text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة شخصية أخرى ({characters.length + 1})</span>
            </button>
          )}
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          className="mt-2 w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#d49e3d] via-[#f1bf66] to-[#c8923a] text-slate-950 font-black text-sm sm:text-base shadow-md cursor-pointer"
        >
          حفظ القضية والبدء باللعب
        </button>
      </motion.div>
    </div>
  );
};
