import storiesJson from './repoStories.json';
import { StoryData, StoryCharacterData } from '../types';
import { ENGLISH_STORIES } from './englishStories';
import { getKillerCount } from '../game/PlayerManager';

// Enriched solutions for scalable stories to provide an amazing climax for every story
const STORY_SOLUTIONS: Record<string, string> = {
  dreams: `من هو الفاعل؟
نادر (مبرمج الـCore الرئيسي) هو من فتح الممر السري بالتعاون مع المتواطئين داخل المنشأة.

ماذا فعل؟
استغل صلاحيات البرمجة لفتح ممر غير مسجل على الخريطة في الساعة 21:43، وقام بنسخ جزء حيوي من الـCore ومسح سجل الذاكرة المشتركة.

لماذا فعل ذلك؟
لبيع الشيفرة الأصلية لأحد الممولين المنافسين الذين طلبوا نسخة سرية قبل الاختبار بيوم واحد بمبلغ طائل.

كيف حدثت الجريمة؟
استخدم بطاقة دخول استثنائية وأنشأ فجوة زمنية مدروسة قبل دورة المسح التلقائي للذاكرة، مستغلاً نوم الحاضرين في الحلم المشترك.

أي الأدلة أشارت إليه؟
توقيت فتح الممر (21:43)، مستوى الصلاحيات العالي المطلوب لحذف سجل الذاكرة، وبطاقة الدخول المستخدمة في وقت غير مصرح به.`,

  museum: `من هو الفاعل؟
بسام (مسؤول التوثيق والأرشفة) بمساعدة المتسللين من فريق الإغلاق.

ماذا فعل؟
قام باستبدال اللوحة الأصلية بنسخة مقلدة بإتقان وتمريرها خارج المتحف أثناء فترة إعادة ضبط كاميرات المراقبة.

لماذا فعل ذلك؟
لتغطية ديون متراكمة وتهريب التحفة النادرة لصالح جامع تحف غير قانوني.

كيف حدثت الجريمة؟
استغل توقف سجل حركة الأبواب لمدة ثلاث دقائق وعطّل جهاز الاستشعار تحت إطار اللوحة بصفته المسؤول عن الصيانة والتوثيق.

أي الأدلة أشارت إليه؟
ألياف القفازات المخملية الموجودة في إطار اللوحة، وتطابق وقت توقف الكاميرات مع مسار الخروج الخاص به.`,

  train: `من هو الفاعل؟
فارس (مساعد قائد القطار) والمتآمرون في عربة الشحن.

ماذا فعل؟
قام بفصل صندوق الطوارئ وعرقلة الاتصال ببرج المراقبة أثناء مرور القطار في النفق المظلم لسرقة الوثائق الدبلوماسية.

لماذا فعل ذلك؟
لابتزاز شركة الخطوط الحديدية ومنع تسليم وثائق سرية تدين شبكة تهريب.

كيف حدثت الجريمة؟
استخدم مفتاح التحكم الرئيسي المخصص فقط لطاقم القيادة للدخول إلى قمرة الشحن أثناء انشغال الركاب بتوقف المحرك المؤقت.

أي الأدلة أشارت إليه؟
آثار الزيت المميز على لوحة التحكم اليدوية، وتسجيل انقطاع الطاقة من داخل قمرة القيادة تحديداً.`,

  observatory: `من هو الفاعل؟
إياد (فني التلسكوب الرئيسي).

ماذا فعل؟
سرق العينة النيزكية النادرة من قبة المرصد واستبدلها بحجر بازلتي أثناء انطفاء أجهزة التتبع.

لماذا فعل ذلك؟
العينة تحتوي على نظائر نادرة كان ينوي بيعها لمختبر أبحاث خاص بصفقة سرية.

كيف حدثت الجريمة؟
استغل معرفته بجدول صيانة مولد الطاقة الرئيسي فقطع التغذية لـ 90 ثانية وفتح القبة يدوياً.`,

  desert_archive: `من هو الفاعل؟
عزام (دليل القافلة والمكلف بالخرائط).

ماذا فعل؟
أخفى المخطوطة الأثرية النادرة التي ترشد إلى المدينة المطمورة واستبدل صفحاتها قبل انطلاق القافلة فجراً.

لماذا فعل ذلك؟
للاحتفاظ بموقع المدينة المطمورة لنفسه وإرشاد بعثة خاصة أخرى مقابل حصة من الكنز.`,

  drowned_village: `من هو الفاعل؟
فؤاد (كبير الغواصين ومسؤول معدات الأكسجين).

ماذا فعل؟
انتشل صندوق الأجراس الأثري من المدرسة المغمورة وخبأه في خزان ضغط خلفي قبل خروج الفريق إلى السطح.

لماذا فعل ذلك؟
للتهرب من تسليم الصندوق للجنة التراث وبيعه في السوق السوداء للآثار البحرية.`,

  arctic_station: `من هو الفاعل؟
د. مروان (الباحث الجيولوجي).

ماذا فعل؟
قام بتهريب أسطوانة الجليد الأثرية وتخريب جهاز التبريد الاحتياطي لإخفاء أثر التلف.

لماذا فعل ذلك؟
لاحتواء العينة على تركيبة كيميائية غير مسبوقة تضمن له براءة اختراع حصرية.`,

  film_set: `من هو الفاعل؟
جلال (مدير الديكور والإكسسوارات).

ماذا فعل؟
استبدل خاتم البطولة الأثري الحقيقي بخاتم زائف من النحاس قبل تصوير المشهد الأخير.

لماذا فعل ذلك؟
الخاتم ملكية تاريخية عائلية نادرة بيعت في مزاد بدون علمه، وأراد استعادتها.`,

  submarine: `من هو الفاعل؟
مهند (ضابط السونار والملاحة).

ماذا فعل؟
سحب شريحة بيانات الملاحة المشفرة قبل الغوص في الأخدود لتوجيه الغواصة نحو إحداثيات مجهولة.

لماذا فعل ذلك؟
لإجبار الطاقم على التوقف عند موقع حطام سفينة سرية كان يخطط لتوثيقها.`,

  court: `من هو الفاعل؟
المستشار عادل (أمين سر المحكمة).

ماذا فعل؟
أتلف مستند الإدانة الأصلي من داخل غرفة الأدلة المحكمة واستبدله بورقة بيضاء ملغية.

لماذا فعل ذلك؟
لحماية أحد المتهمين النافذين مقابل رشوة ضخمة قبل النطق النهائي بالحكم.`,

  greenhouse: `من هو الفاعل؟
د. سهيل (خبير علم النبات الجيني).

ماذا فعل؟
قطف النبتة الطبية النادرة ومحا السجل الجيني من حاسوب الدفيئة.

لماذا فعل ذلك؟
لإنتاج الدواء في مختبره الخاص خارج البلاد قبل إعلان حقوق الملكية للمركز.`,

  royal_kitchen: `من هو الفاعل؟
شادي (رئيس الخدم الخاص بالقصر).

ماذا فعل؟
أخفى الرسالة الملكية المختومة من صينية التقديم أثناء عبور الممر الملكي المظلم.

لماذا فعل ذلك؟
الرسالة كانت تتضمن قراراً بعزل عائلته من منصب التشريفات الملكية.`,

  gala_toast: `من هو الفاعل؟
سامية، محامية العائلة، هي من سمّمت مراد.

ماذا فعلت؟
استبدلت جرعة دوائه المعتاد بجرعة مضاعفة قاتلة، ودسّتها في كأسه بينما كان بعيداً عن الأنظار.

لماذا فعلت ذلك؟
لأنها اكتشفت أن مراد ينوي حذف اسمها من الوصية الجديدة في اللحظة الأخيرة، بعد سنوات من العمل معه.

كيف حدثت الجريمة؟
استغلت الدقائق التي بقي فيها كأس مراد على الطاولة الجانبية دون مراقبة، وكانت تعرف جرعة دوائه القاتلة لأنها اطّلعت على ملفاته الطبية أثناء إعداد الوصية.

أي الأدلة أشارت إليها؟
الحديث المتوتر الذي جرى بينها وبين مراد في الممر الخلفي كان اللحظة التي أدركت فيها خطته، وعلبة الدواء الفارغة أكثر من المتوقع كانت من نصيبها.

كيف ساعدت معرفة الآخرين؟
ملاحظة هند بأن الكأس بقي دون مراقبة حددت النافذة الزمنية، ومعرفة د. كريم بخطورة جرعة الدواء المضاعفة أكدت وسيلة الجريمة.`
};

export const BUILT_IN_STORIES: StoryData[] = (storiesJson as StoryData[]).map((s) => {
  return {
    ...s,
    solution: s.solution || STORY_SOLUTIONS[s.id] || 'تم كشف الحقيقة واكتمال التحقيق بنجاح.'
  };
});

// Custom Story Storage LocalStorage helper matching CustomStoryStore.java
const CUSTOM_STORAGE_KEY = 'secret_killer_custom_stories';

export function loadCustomStories(): StoryData[] {
  try {
    const raw = localStorage.getItem(CUSTOM_STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return [];
    return list.map((item: any) => ({
      id: item.id || `custom_${Date.now()}`,
      title: item.title || 'قصة مخصصة',
      description: item.description || '',
      minPlayers: item.characters?.length || 4,
      maxPlayers: item.characters?.length || 12,
      isCustom: true,
      introduction: item.introduction || {
        setting: 'موقع الجريمة',
        situation: 'اجتمع المشتبه بهم في مكان الحادث.',
        incident: item.description || 'وقعت حادثة غامضة.',
        stakes: 'قد يفلت الفاعل أو يُدان بريء.',
        objective: 'اكتشفوا الفاعل الحقيقي قبل فوات الأوان.'
      },
      guiltyPool: item.characters?.filter((c: any) => c.guilty) || [],
      innocentPool: item.characters?.filter((c: any) => !c.guilty) || [],
      fixedCharacters: item.characters || [],
      clues: (item.clues || []).map((c: any) => typeof c === 'string' ? c : c.text),
      wrongVoteHints: ['راجعوا أقوال المشتبه بهم بعناية.', 'ابحثوا عن التناقضات بين الأدلة.', 'لا تحكموا بناءً على الشكوك فقط.'],
      investigationRounds: item.investigationRounds || [],
      solution: item.solution || item.ending || 'تم كشف القاتل وفك لغز القضية!'
    }));
  } catch (e) {
    console.error('Error loading custom stories', e);
    return [];
  }
}

export function saveCustomStory(story: StoryData): void {
  try {
    const existing = loadCustomStories();
    const updated = [story, ...existing.filter(s => s.id !== story.id)];
    localStorage.setItem(CUSTOM_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving custom story', e);
  }
}

export function deleteCustomStory(id: string): void {
  try {
    const existing = loadCustomStories();
    const updated = existing.filter(s => s.id !== id);
    localStorage.setItem(CUSTOM_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error deleting custom story', e);
  }
}

// Logic: Select cast based on player count matching Story.java charactersFor()
export function selectCastForStory(story: StoryData, playerCount: number): StoryCharacterData[] {
  if (story.isBuiltInFixed || story.isCustom) {
    if (story.fixedCharacters && story.fixedCharacters.length > 0) {
      return [...story.fixedCharacters].slice(0, playerCount);
    }
  }

  // Centralized authoritative killer count scaling (4-6: 1, 7-9: 2, 10-12: 3)
  const guiltyCount = getKillerCount(playerCount);
  const guiltyPool = story.guiltyPool || [];

  if (guiltyPool.length < guiltyCount) {
    throw new Error(
      `Story "${story.title || story.id}" does not support ${guiltyCount} killers. Guilty pool contains ${guiltyPool.length} candidates, but ${guiltyCount} are required for ${playerCount} players.`
    );
  }

  // Shuffle guilty pool and pick exactly guiltyCount killers
  const shuffledGuilty = [...guiltyPool].sort(() => Math.random() - 0.5);
  const selectedGuilty = shuffledGuilty.slice(0, guiltyCount);
  const remainingGuilty = shuffledGuilty.slice(guiltyCount);

  const cast: StoryCharacterData[] = [];
  selectedGuilty.forEach((c) => {
    cast.push({ ...c, guilty: true });
  });

  // Remaining candidates come from remaining unselected guilty pool (as innocents) and innocent pool
  const candidateInnocents = [
    ...remainingGuilty.map((c) => ({ ...c, guilty: false })),
    ...(story.innocentPool || []).map((c) => ({ ...c, guilty: false }))
  ];

  const shuffledInnocents = candidateInnocents.sort(() => Math.random() - 0.5);
  const innocentsNeeded = playerCount - guiltyCount;

  for (let i = 0; i < innocentsNeeded; i++) {
    cast.push(shuffledInnocents[i % shuffledInnocents.length]);
  }

  // Shuffle final cast
  return cast.sort(() => Math.random() - 0.5);
}

// Localize story based on selected language
export function localizeStory(story: StoryData, language: 'ar' | 'en'): StoryData {
  if (language === 'ar' || story.isCustom) {
    return story;
  }

  const enOverride = ENGLISH_STORIES[story.id];
  if (!enOverride) {
    return story;
  }

  // Merge guiltyPool 1-to-1 so count is guaranteed
  const guiltyPool = (story.guiltyPool || []).map((char, idx) => {
    const enChar = enOverride.guiltyPool?.[idx];
    if (enChar) {
      return {
        ...char,
        name: enChar.name || char.name,
        profession: enChar.profession || char.profession,
        publicIdentity: enChar.publicIdentity || char.publicIdentity,
        knowledge: enChar.knowledge || char.knowledge,
        guilty: true
      };
    }
    return char;
  });

  // Merge innocentPool 1-to-1 so count is guaranteed
  const innocentPool = (story.innocentPool || []).map((char, idx) => {
    const enChar = enOverride.innocentPool?.[idx];
    if (enChar) {
      return {
        ...char,
        name: enChar.name || char.name,
        profession: enChar.profession || char.profession,
        publicIdentity: enChar.publicIdentity || char.publicIdentity,
        knowledge: enChar.knowledge || char.knowledge,
        guilty: false
      };
    }
    return char;
  });

  // Merge fixedCharacters if present
  const fixedCharacters = story.fixedCharacters
    ? story.fixedCharacters.map((char, idx) => {
        const enChar = enOverride.fixedCharacters?.[idx];
        if (enChar) {
          return {
            ...char,
            name: enChar.name || char.name,
            profession: enChar.profession || char.profession,
            publicIdentity: enChar.publicIdentity || char.publicIdentity,
            knowledge: enChar.knowledge || char.knowledge,
            guilty: char.guilty
          };
        }
        return char;
      })
    : (enOverride.fixedCharacters || story.fixedCharacters);

  return {
    ...story,
    title: enOverride.title || story.title,
    description: enOverride.description || story.description,
    introduction: enOverride.introduction ? { ...story.introduction, ...enOverride.introduction } : story.introduction,
    solution: enOverride.solution || story.solution,
    guiltyPool: guiltyPool.length > 0 ? guiltyPool : (enOverride.guiltyPool || story.guiltyPool),
    innocentPool: innocentPool.length > 0 ? innocentPool : (enOverride.innocentPool || story.innocentPool),
    fixedCharacters,
    investigationRounds: enOverride.investigationRounds || story.investigationRounds,
    clues: enOverride.clues || story.clues,
    wrongVoteHints: enOverride.wrongVoteHints || story.wrongVoteHints,
  };
}

export function localizeStories(storiesList: StoryData[], language: 'ar' | 'en'): StoryData[] {
  return storiesList.map(s => localizeStory(s, language));
}
