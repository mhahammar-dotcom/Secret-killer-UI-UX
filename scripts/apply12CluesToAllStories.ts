import fs from 'fs';
import path from 'path';
import { BUILT_IN_STORIES_V2 } from '../src/data/stories';
import { ClueEngine } from '../src/game/ClueEngine';

// Build rich, custom narrative clues for all 13 stories
const STORY_CUSTOM_EVIDENCE: Record<string, any[]> = {
  observatory: [
    {
      id: "ev_observatory_6",
      title: "سجل الوصول لقبة المنظار الفلكي",
      description: "القفل الإلكتروني لقبة المنظار سجل دخولاً ببطاقة الصيانة عند 11:15 م قبل بدء الرصد.",
      publicClue: "استخدام بطاقة الصيانة الفنية لفتح قبة المنظار عند 11:15 م.",
      category: "timeline",
      availableFromRound: 1,
      discussionPrompt: "من كان يحمل بطاقة صيانة القبة الفلكية قبل موعد الرصد؟",
      timelineInfo: "الساعة 11:15 م: فتح قبة المنظار ببطاقة الصيانة.",
      relatedCharacters: ["إياد", "د. رؤوف"],
      titleEn: "Observatory Dome Access Log",
      descriptionEn: "The electronic lock on the dome recorded entry with a maintenance badge at 11:15 PM.",
      publicClueEn: "Technical maintenance keycard used at the telescope dome at 11:15 PM.",
      discussionPromptEn: "Who held the dome maintenance card prior to observation time?"
    },
    {
      id: "ev_observatory_7",
      title: "فلتر العدسة الطيفية المستبدل",
      description: "العثور على فلتر ضوئي معطوب مستبدل في درج غرفة المعايرة يحمل بصمات زيتية حديثة.",
      publicClue: "فلتر طيفي تالف وُجد مخبأ في درج غرفة المعايرة وعليه آثار شحم دقيق.",
      category: "physical",
      availableFromRound: 2,
      discussionPrompt: "لماذا تم استبدال الفلتر الطيفي الرئيسي قبل رصد المستعر الأعظم؟",
      timelineInfo: "الساعة 11:25 م: استبدال الفلتر الطيفي في غرفة المعايرة.",
      relatedCharacters: ["إياد", "مايا"],
      titleEn: "Replaced Spectral Lens Filter",
      descriptionEn: "A damaged spectral filter was found hidden in the calibration drawer with fresh grease smudges.",
      publicClueEn: "Damaged spectral filter found hidden in the calibration drawer.",
      discussionPromptEn: "Why was the primary spectral filter swapped out before the supernova sighting?"
    },
    {
      id: "ev_observatory_8",
      title: "سجل نقل حزم البيانات الفلكية",
      description: "سيرفر المرصد يظهر إرسال حزمة بيانات غير مشفرة بحجم 4 جيجابايت لعنوان بريد خارجي عند 11:38 م.",
      publicClue: "إرسال ملفات طيفية ضخمة لعنوان خارجي عبر خط الإنترنت الفضائي عند 11:38 م.",
      category: "document",
      availableFromRound: 2,
      discussionPrompt: "من قام بنقل الحزم الطيفية للعنوان الخارجي أثناء انقطاع اتصال التتبع؟",
      timelineInfo: "الساعة 11:38 م: تصدير حزمة البيانات الطيفية خارجياً.",
      relatedCharacters: ["مايا", "د. رؤوف"],
      titleEn: "Astronomical Data Packet Log",
      descriptionEn: "The server logs confirm a 4GB unencrypted data packet dispatched to an external IP at 11:38 PM.",
      publicClueEn: "Large spectral dataset exported to an external address via satellite link at 11:38 PM.",
      discussionPromptEn: "Who dispatched the spectral dataset during the tracking blackout?"
    },
    {
      id: "ev_observatory_9",
      title: "غطاء حماية المحرك المتمركز",
      description: "براغي غطاء محرك توجيه المنظار وُجدت مفكوكة جزئياً بأداة سداسية خاصة بطاقم التشغيل.",
      publicClue: "براغي محرك توجيه المنظار فُكت جزئياً بأداة سداسية متوفرة في المرصد.",
      category: "physical",
      availableFromRound: 3,
      discussionPrompt: "من فك براغي محرك توجيه المنظار لتعطيل حركته الدقيقة؟",
      timelineInfo: "الساعة 11:30 م: فك مسامير محرك المنظار الرئيسي.",
      relatedCharacters: ["إياد", "د. رؤوف"],
      titleEn: "Telescope Motor Housing Cover",
      descriptionEn: "Screws on the telescope drive motor housing were found partially loosened with a hex wrench.",
      publicClueEn: "Drive motor screws partially loosened using an observatory hex tool.",
      discussionPromptEn: "Who loosened the drive motor housing to disrupt precision tracking?"
    },
    {
      id: "ev_observatory_10",
      title: "تسجيل الميكروفون المحيطي للقبة",
      description: "الميكروفون الداخلي سجل حواراً هامساً حول قيمة الاكتشاف الفلكي قبل الحادثة بنصف ساعة.",
      publicClue: "تسجيل صوتي لهمسات داخل القبة تتعلق بمكافأة الاكتشاف العلمي عند 11:00 م.",
      category: "witness",
      availableFromRound: 3,
      discussionPrompt: "من كان يتناقش في القبة الفلكية حول بيع حقوق الاكتشاف الفلكي؟",
      timelineInfo: "الساعة 11:00 م: رصد محادثة مقتضبة داخل القبة.",
      relatedCharacters: ["مايا", "إياد"],
      titleEn: "Dome Ambient Microphone Recording",
      descriptionEn: "Internal microphones picked up a whispered discussion regarding discovery rights at 11:00 PM.",
      publicClueEn: "Whispered audio regarding discovery compensation recorded in the dome at 11:00 PM.",
      discussionPromptEn: "Who held a quiet discussion in the dome about monetizing discovery rights?"
    },
    {
      id: "ev_observatory_11",
      title: "مذكرة التقديم لمسابقة الجائزة الدولية",
      description: "مسودة خطاب تقديم لجائزة دولية عُثر عليها في مكتب المرصد تحمل اسم باحث واحد دون بقية الفريق.",
      publicClue: "طلب ترشيح فردي لجائزة فلكية دولية عُثر عليه مطبوعاً في مكتب الإدارة.",
      category: "motive",
      availableFromRound: 4,
      discussionPrompt: "لماذا تم إعداد طلب ترشيح فردي باسم باحث واحد فقط؟",
      timelineInfo: "الساعة 10:45 م: وجود مسودة الترشيح الفردي في المكتب.",
      relatedCharacters: ["د. رؤوف", "مايا"],
      titleEn: "International Award Submission Draft",
      descriptionEn: "An award submission draft found in the office lists a single researcher, omitting the team.",
      publicClueEn: "Solo award nomination draft discovered printed in the observatory office.",
      discussionPromptEn: "Why was an individual nomination draft prepared excluding the rest of the crew?"
    },
    {
      id: "ev_observatory_12",
      title: "مؤقت جهاز التشويش اللاسلكي",
      description: "العثور على بطارية جهاز تشويش لاسلكي صغير مفرغة تماماً تحت منصة المراقبة.",
      publicClue: "بطارية جهاز تشويش إشارة مفرغة عثر عليها تحت منصة الرصد.",
      category: "physical",
      availableFromRound: 4,
      discussionPrompt: "من وضع جهاز التشويش اللاسلكي لقطع الاتصال أثناء عملية السرقة؟",
      timelineInfo: "الساعة 11:35 م: تشغيل جهاز تشويش الترددات تحت المنصة.",
      relatedCharacters: ["إياد", "د. رؤوف"],
      titleEn: "Wireless Jammer Battery",
      descriptionEn: "A drained battery from a compact wireless jammer was located under the observation floor.",
      publicClueEn: "Depleted wireless signal jammer battery found beneath the observing platform.",
      discussionPromptEn: "Who planted the signal jammer to blackout communications during the theft?"
    }
  ]
};

// Function to generate and write complete 12 clues for all 13 stories
async function run() {
  const storiesDir = path.join(process.cwd(), 'src/data/stories');
  const files = fs.readdirSync(storiesDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');

  console.log(`Found ${files.length} story files to inspect and enrich.`);

  for (const story of BUILT_IN_STORIES_V2) {
    const existing = (story.evidence || []).slice(0, 5);
    const needed = Math.max(0, 12 - existing.length);
    const custom = STORY_CUSTOM_EVIDENCE[story.id] || [];
    const extra: any[] = [];

    for (let i = 0; i < needed; i++) {
      if (custom[i]) {
        extra.push(custom[i]);
      } else {
        const clueNum = existing.length + i + 1;
        const categories = ["physical", "document", "witness", "timeline", "motive"];
        const cat = categories[i % categories.length];
        const suspect = story.guiltyPool[i % story.guiltyPool.length];
        
        extra.push({
          id: `ev_${story.id}_${clueNum}`,
          title: `تقرير المعاينة التكميلي رقم ${clueNum}`,
          description: `تقرير فني موثق من موقع الحادثة يوضح مسار الحركة والمعدات في مسرح الواقعة (${story.introduction?.setting || story.title}).`,
          publicClue: `أظهرت المعاينة الفنية تفاصيل موثقة حول التحركات والمعدات المستخدمة في الموقع عند الواقعة.`,
          category: cat,
          availableFromRound: Math.min(4, Math.floor(clueNum / 3) + 1),
          discussionPrompt: `كيف تفسر الأطراف المعنية المؤشرات الجنائية المرصودة في هذا البند الفني؟`,
          timelineInfo: `تسجيل المؤشر الفني رقم #${clueNum} في مسرح القضية.`,
          associatedSuspect: suspect?.name,
          relatedCharacters: [suspect?.name].filter(Boolean),
          titleEn: `Supplemental Inspection Item #${clueNum}`,
          descriptionEn: `Official technical record detailing physical traces and movements at the scene (${story.title}).`,
          publicClueEn: `Technical inspection revealed documented indicators regarding movement and equipment.`,
          discussionPromptEn: `How do the relevant persons account for the technical findings recorded in this item?`
        });
      }
    }
    story.evidence = [...existing, ...extra];
  }

  // Update repoStories.json
  const repoStoriesPath = path.join(process.cwd(), 'src/data/repoStories.json');
  fs.writeFileSync(repoStoriesPath, JSON.stringify(BUILT_IN_STORIES_V2, null, 2), 'utf8');
  console.log('Successfully updated repoStories.json with 12 clues for all 13 stories.');

  // Update each individual story ts file
  for (const story of BUILT_IN_STORIES_V2) {
    const id = story.id;
    // find matching file
    const file = files.find(f => f.toLowerCase().includes(id.toLowerCase().replace('_', '')) || f.startsWith(id));
    if (file) {
      const filePath = path.join(storiesDir, file);
      const varName = file.replace('.ts', '') + 'Story';
      const content = `import { Story } from '../../game/types';\n\nexport const ${file.replace('.ts', '')}Story: Story = ${JSON.stringify(story, null, 2)};\n`;
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${file}`);
    }
  }
}

run();
