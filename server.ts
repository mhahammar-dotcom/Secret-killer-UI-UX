import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // AI Case Generator endpoint
  app.post('/api/generate-case', async (req, res) => {
    try {
      const { prompt } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        // Return structured fallback
        const fallbackStory = {
          id: `custom_${Date.now()}`,
          title: prompt ? `قضية: ${prompt.slice(0, 30)}` : 'لغز القصر الجبلي',
          description: 'حادثة غامضة تتطلب التحقيق الفوري لكشف الفاعل بين الحاضرين.',
          minPlayers: 6,
          maxPlayers: 6,
          isCustom: true,
          isBuiltInFixed: true,
          introduction: {
            setting: 'القصر الجبلي المعزول',
            situation: 'اجتمع الضيوف للاحتفال فانقطعت الطرق بسبب العاصفة.',
            incident: 'تم العثور على الخزنة مفتوحة واختفاء الوثيقة السرية.',
            stakes: 'إذا لم يُكشف الفاعل قبل شروق الشمس سيهرب بالوثيقة.',
            objective: 'اكتشفوا الفاعل الحقيقي عبر مضاهاة الأقوال والأدلة.',
          },
          guiltyPool: [
            {
              name: 'طارق',
              profession: 'مدير الأعمال',
              publicIdentity: 'مسؤول عن إدارة العقود والوثائق المالية.',
              knowledge: 'رأى الخزنة مفتوحة عند الساعة 23:15 ولم يبلغ أحداً.',
              guilty: true,
            },
          ],
          innocentPool: [
            {
              name: 'منى',
              profession: 'طبيبة العائلة',
              publicIdentity: 'كانت تقدم الرعاية للضيوف المرهقين.',
              knowledge: 'سمعت صوت حركة سريعة في الممر المؤدي للمكتبة.',
              guilty: false,
            },
            {
              name: 'زياد',
              profession: 'مهندس الكهرباء',
              publicIdentity: 'مكلف بصيانة المولد الاحتياطي.',
              knowledge: 'سجل انقطاع التيار الكهربائي كان مقصوداً من القاطع الداخلي.',
              guilty: false,
            },
            {
              name: 'رانيا',
              profession: 'المحامية',
              publicIdentity: 'وصلت للاطلاع على بنود الوصية والاتفاقيات.',
              knowledge: 'عثرت على مفتاح نسخ ملقى بالقرب من المدفأة.',
              guilty: false,
            },
            {
              name: 'مازن',
              profession: 'سائق القصر',
              publicIdentity: 'يراقب بوابة المرآب والسيارات.',
              knowledge: 'تأكد من عدم مغادرة أي سيارة طوال فترة العاصفة.',
              guilty: false,
            },
            {
              name: 'سميرة',
              profession: 'المشرفة على الضيافة',
              publicIdentity: 'تنسق جدول العشاء وحركة الخدم.',
              knowledge: 'لاحظت غياب طارق عن الصالة الرئيسية لمدة نصف ساعة.',
              guilty: false,
            },
          ],
          fixedCharacters: [
            {
              name: 'طارق',
              profession: 'مدير الأعمال',
              publicIdentity: 'مسؤول عن إدارة العقود والوثائق المالية.',
              knowledge: 'رأى الخزنة مفتوحة عند الساعة 23:15 ولم يبلغ أحداً.',
              guilty: true,
            },
            {
              name: 'منى',
              profession: 'طبيبة العائلة',
              publicIdentity: 'كانت تقدم الرعاية للضيوف المرهقين.',
              knowledge: 'سمعت صوت حركة سريعة في الممر المؤدي للمكتبة.',
              guilty: false,
            },
            {
              name: 'زياد',
              profession: 'مهندس الكهرباء',
              publicIdentity: 'مكلف بصيانة المولد الاحتياطي.',
              knowledge: 'سجل انقطاع التيار الكهربائي كان مقصوداً من القاطع الداخلي.',
              guilty: false,
            },
            {
              name: 'رانيا',
              profession: 'المحامية',
              publicIdentity: 'وصلت للاطلاع على بنود الوصية والاتفاقيات.',
              knowledge: 'عثرت على مفتاح نسخ ملقى بالقرب من المدفأة.',
              guilty: false,
            },
            {
              name: 'مازن',
              profession: 'سائق القصر',
              publicIdentity: 'يراقب بوابة المرآب والسيارات.',
              knowledge: 'تأكد من عدم مغادرة أي سيارة طوال فترة العاصفة.',
              guilty: false,
            },
            {
              name: 'سميرة',
              profession: 'المشرفة على الضيافة',
              publicIdentity: 'تنسق جدول العشاء وحركة الخدم.',
              knowledge: 'لاحظت غياب طارق عن الصالة الرئيسية لمدة نصف ساعة.',
              guilty: false,
            },
          ],
          clues: [
            'مفتاح احتياطي للمكتبة تم العثور عليه بالقرب من المدفأة.',
            'انقطاع التيار الكهربائي حدث من اللوحة الداخلية الساعة 22:45.',
            'بصمات أصابع على الخزنة تطابقت جزئياً مع قفاز جلدي.',
          ],
          wrongVoteHints: [
            'راجعوا توقيت انقطاع الكهرباء وغياب المشتبه بهم.',
            'تأكدوا من الشخص الذي يملك صلاحيات فتح المكتبة.',
            'لا تصوتوا دون ربط الأقوال بالأدلة المادية.',
          ],
          investigationRounds: [
            {
              roundNumber: 1,
              title: 'معاينة مسرح الجريمة',
              publicClue: 'الخزنة فُتحت دون كسر باستخدام المفتاح الأصلي أو نسخة متطابقة.',
              description: 'قام المحققون بفحص القفل وتبين أنه لم يتعرض لأي تخريب ميكانيكي.',
              discussionPrompt: 'من من الحاضرين كان يعلم بمكان المفتاح الأصلي؟',
            },
            {
              roundNumber: 2,
              title: 'سجل انقطاع الكهرباء',
              publicClue: 'القاطع الرئيسي للمبنى أُطفئ يدوياً لمدة 8 دقائق.',
              description: 'التوقيت تزامن مع خروج أحد الضيوف باتجاه الممر الخلفي.',
              discussionPrompt: 'أين كان كل منكم أثناء الدقائق الثمانية المظلمة؟',
            },
          ],
          solution: `من هو الفاعل؟
طارق (مدير الأعمال) هو من سرق الوثيقة السرية.

ماذا فعل؟
استغل معرفته برمز الخزنة وقطع الكهرباء يدوياً لسرقة الوثيقة وإخفائها قبل وصول الشرطة.

لماذا فعل ذلك؟
الوثيقة كانت تحتوي على إدانة مباشرة له باختلاس أموال من حسابات الشركة.`,
        };
        return res.json(fallbackStory);
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const promptInstruction = `
أنت مصمم ألعاب تحقيق اجتماعية وقضايا غامضة (Secret Killer / Social Deduction Murder Mystery) محترف.
المطلوب إنشاء قضية جديدة باللغة العربية بناءً على هذا الطلب: "${prompt || 'جريمة غامضة مشوقة'}".

قم بالرد بصيغة JSON فقط متوافقة تماماً مع هذا الهيكل:
{
  "id": "custom_${Date.now()}",
  "title": "عنوان القصة المشوق (مثال: ليلة في الدفيئة)",
  "description": "وصف مشوق للقضية في سطرين",
  "minPlayers": 6,
  "maxPlayers": 6,
  "isCustom": true,
  "isBuiltInFixed": true,
  "introduction": {
    "setting": "مكان الحادث",
    "situation": "الوضع العام قبل وقوع الحادث",
    "incident": "الحادثة الغامضة التي وقعت",
    "stakes": "المخاطر المترتبة",
    "objective": "هدف اللاعبين في التحقيق"
  },
  "fixedCharacters": [
    {
      "name": "اسم الشخصية 1",
      "profession": "المهنة",
      "publicIdentity": "الهوية العامة وكيف يراها الآخرون",
      "knowledge": "معلومة خاصة وحصرية تعرفها هذه الشخصية فقط",
      "guilty": true
    },
    {
      "name": "اسم الشخصية 2",
      "profession": "المهنة",
      "publicIdentity": "الهوية العامة",
      "knowledge": "معلومة خاصة",
      "guilty": false
    },
    {
      "name": "اسم الشخصية 3",
      "profession": "المهنة",
      "publicIdentity": "الهوية العامة",
      "knowledge": "معلومة خاصة",
      "guilty": false
    },
    {
      "name": "اسم الشخصية 4",
      "profession": "المهنة",
      "publicIdentity": "الهوية العامة",
      "knowledge": "معلومة خاصة",
      "guilty": false
    },
    {
      "name": "اسم الشخصية 5",
      "profession": "المهنة",
      "publicIdentity": "الهوية العامة",
      "knowledge": "معلومة خاصة",
      "guilty": false
    },
    {
      "name": "اسم الشخصية 6",
      "profession": "المهنة",
      "publicIdentity": "الهوية العامة",
      "knowledge": "معلومة خاصة",
      "guilty": false
    }
  ],
  "clues": [
    "دليل رقم 1",
    "دليل رقم 2",
    "دليل رقم 3"
  ],
  "wrongVoteHints": [
    "تلميح عند التصويت الخاطئ 1",
    "تلميح عند التصويت الخاطئ 2"
  ],
  "investigationRounds": [
    {
      "roundNumber": 1,
      "title": "عنوان الجولة 1",
      "publicClue": "الدليل المعلن للجولة",
      "description": "تفاصيل إضافية عن الدليل",
      "discussionPrompt": "سؤال للنقاش بين اللاعبين"
    },
    {
      "roundNumber": 2,
      "title": "عنوان الجولة 2",
      "publicClue": "الدليل المعلن للجولة 2",
      "description": "تفاصيل إضافية",
      "discussionPrompt": "سؤال للنقاش"
    }
  ],
  "solution": "من هو الفاعل؟ وماذا فعل ولماذا وكيف حدثت الجريمة وأي الأدلة أشارت إليه."
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: promptInstruction,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text?.trim() || '';
      const story = JSON.parse(text);
      story.guiltyPool = (story.fixedCharacters || []).filter((c: any) => c.guilty);
      story.innocentPool = (story.fixedCharacters || []).filter((c: any) => !c.guilty);
      return res.json(story);
    } catch (err: unknown) {
      console.error('Error generating AI case:', err);
      return res.status(500).json({ error: 'Failed to generate case' });
    }
  });

  // Vite Middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Secret Killer server running on port ${PORT}`);
  });
}

startServer();
