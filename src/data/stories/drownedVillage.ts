import { Story } from '../../game/types';

export const drownedVillageStory: Story = {
  "id": "drowned_village",
  "title": "قرية تحت الماء",
  "description": "انتشال صندوق الأجراس البرونزية الأثري من الكاتدرائية الغارقة وإخفاؤه في خزان ضغط سري قبل الغطسة الرسمية.",
  "minPlayers": 4,
  "maxPlayers": 12,
  "maxWrongVotes": 3,
  "introduction": {
    "setting": "سفينة أبحاث بحرية ترسو فوق بقايا قرية بيزنطية غارقة على عمق 40 متراً.",
    "situation": "كان الفريق يستعد لتوثيق برج الكاتدرائية الأثري وانتشال الأجراس الاحتفالية النادرة في بث علمي مباشر.",
    "incident": "عند الساعة 6:00 صباحاً قبل موعد الغطسة الرسمية، عُثر على خزان الأجراس في البرج مفتوحاً وقد اختفت التحفة الثمينة.",
    "stakes": "القطع البرونزية الغارقة إرث تاريخي لا يعوض، والسفينة معزولة في عرض البحر بانتظار تحديد المسؤول."
  },
  "guiltyPool": [
    {
      "name": "فؤاد",
      "profession": "كبير الغواصين ومسؤول المعدات",
      "publicIdentity": "أنت المشرف على تجهيز أسطوانات الغاز ومعدات الغوص العميق وصيانة أجهزة الضغط.",
      "knowledge": "تعلم أن د. زياد كان يراقب كاميرات المسبار الآلي، ورأيت سارة تجهز كاميرات الأعماق في المقصورة.",
      "guilty": true
    },
    {
      "name": "د. زياد",
      "profession": "عالم الآثار البحرية ورئيس المهمة",
      "publicIdentity": "أنت المسؤول العلمي عن تحديد مواقع الآثار وتوثيق المكتشفات تحت الماء.",
      "knowledge": "رأيت سارة تغادر منصة الغوص حاملة حقيبة مضادة للماء ثقيلة عند 6:15 ص وبدت متوترة للغاية.",
      "guilty": true
    },
    {
      "name": "ماجد",
      "profession": "ضابط السطح ومسؤول الرافعة الهيدروليكية",
      "publicIdentity": "أنت المسؤول عن أمان السطح وتشغيل ونش الإنزال ورفع المعدات الثقيلة من البحر.",
      "knowledge": "سمعت صوت ارتداد سلم الغوص المائي عند 5:55 ص قبل موعد النزول المجدول بنصف ساعة.",
      "guilty": true
    }
  ],
  "innocentPool": [
    {
      "name": "سارة",
      "profession": "مصورة الأعماق والتوثيق المرئي",
      "publicIdentity": "أنت المسؤولة عن تصوير المعالم الغارقة والتأكد من إضاءة الكاميرات تحت الضغط العالي.",
      "knowledge": "رأيت فؤاد ينقل أسطوانة غاز تريمكس ثلاثية الخليط نحو منصة الإنزال الخلفية عند 5:50 ص.",
      "guilty": false
    },
    {
      "name": "ريما",
      "profession": "أخصائية معالجة المعادن البحرية",
      "publicIdentity": "أنت المسؤولة عن تنظيف البرونز من الترسبات الملحية والصدأ فور خروجه للسطح.",
      "knowledge": "صندوق الأجراس يحتاج لمحلول تحييد مائي خاص فور رفعه لتجنب تآكل نقوشه بالهواء الجوي.",
      "guilty": false
    },
    {
      "name": "سامي",
      "profession": "طبيب الغوص وعلاج الضغط",
      "publicIdentity": "أنت المسؤول عن غرفة تخفيف الضغط وفحص لياقة الغواصين الطبية.",
      "knowledge": "فؤاد و د. زياد هما الوحيدان المصرح لهما بالغطس المنفرد إلى أعماق تتجاوز 35 متراً.",
      "guilty": false
    },
    {
      "name": "منى",
      "profession": "مشغلة طائرة الاستكشاف المائي المسيرة",
      "publicIdentity": "أنت المسؤولة عن توجيه الروبوت الغاطس وفحص الممرات الضيقة.",
      "knowledge": "كاميرا الروبوت الغاطس تم توجيهها يدوياً نحو القاع الرملي لحجب الرؤية عن برج الكاتدرائية.",
      "guilty": false
    },
    {
      "name": "طارق",
      "profession": "ربان سفينة الأبحاث",
      "publicIdentity": "أنت المسؤول الأول عن سلامة الملاحة وبقاء السفينة ثابتة فوق الإحداثيات.",
      "knowledge": "محركات التثبيت الآلي حافظت على موقع السفينة بدقة دون أي انحراف عن موقع الغرق.",
      "guilty": false
    },
    {
      "name": "ندى",
      "profession": "أخصائية الجغرافيا البحرية",
      "publicIdentity": "أنت المسؤولة عن خرائط القاع وتيارات الأعماق السفلية.",
      "knowledge": "حساسات الإزاحة رصدت اضطراباً مائياً مفاجئاً قرب فوهة البرج عند 6:05 ص.",
      "guilty": false
    },
    {
      "name": "عمر",
      "profession": "بحار ومساعد إنزال الغواصين",
      "publicIdentity": "أنت المسؤول عن تثبيت حبال الغطس وفحص زعانف وبدلات الغواصين.",
      "knowledge": "دراجة الدفع المائي السريعة كانت مفصولة من شاحنها على المنصة السفلية في الصباح الباكر.",
      "guilty": false
    },
    {
      "name": "ليلى",
      "profession": "مساعدة مسح الآثار المغمورة",
      "publicIdentity": "أنت المسؤولة عن أرقام بطاقات التعريف والتسجيل الشبكي للموقع.",
      "knowledge": "صندوق الأجراس تم تثبيته وتوثيق موقعه في البرج عصر الأمس بدقة متناهية.",
      "guilty": false
    },
    {
      "name": "خالد",
      "profession": "ضابط الاتصالات البحرية",
      "publicIdentity": "أنت المسؤول عن التواصل مع خفر السواحل وتلقي التنبؤات الجوية.",
      "knowledge": "لم تصدر أي نداءات لاسلكية استثنائية من السفينة قبل بدء حالة الاستنفار.",
      "guilty": false
    }
  ],
  "evidence": [
    {
      "id": "ev_drowned_1",
      "title": "سجل استهلاك أسطوانات غاز الأعماق",
      "description": "قراءات مقياس الضغط تشير إلى انخفاض غاز خليط التريمكس في إحدى أسطوانات الغوص العميق بما يعادل استهلاك غطسة قصيرة قبل الساعة 6:00 ص.",
      "publicClue": "سجل ضغط أسطوانات التريمكس يُظهر استهلاك غاز كافٍ لغطسة عميقة قبيل الساعة 6:00 ص.",
      "category": "physical",
      "availableFromRound": 1,
      "discussionPrompt": "من كان لديه التدريب والمعدات اللازمة للقيام بغطسة عميقة في مياه الأخدود قبل الفجر؟",
      "timelineInfo": "الساعة 5:50 ص: تسجيل انخفاض ضغط أسطوانة غاز التريمكس في منصة الغوص.",
      "relatedCharacters": [
        "فؤاد",
        "د. زياد",
        "سارة"
      ]
    },
    {
      "id": "ev_drowned_2",
      "title": "قاطع السلاسل الهيدروليكي الميداني",
      "description": "الفحص تحت الماء يُظهر قطع سلسلة تثبيت الصندوق بواسطة قاطع هيدروليكي يدوي مطابق للأداة المحفوظة في صندوق منصة الغوص المشترك.",
      "publicClue": "سلسلة التثبيت قُطعت باستخدام قاطع هيدروليكي يدوي من طاقم أدوات المنصة المتاحة للغواصين.",
      "category": "physical",
      "availableFromRound": 1,
      "discussionPrompt": "كيف أُخرج القاطع الهيدروليكي من صندوق الأدوات المشترك وأُعيد إلى مكانه؟",
      "timelineInfo": "الساعة 6:02 ص: قطع سلسلة التثبيت المعدنية وسحب صندوق الأجراس من موقع الكاتدرائية.",
      "relatedCharacters": [
        "فؤاد",
        "ماجد",
        "د. زياد"
      ]
    },
    {
      "id": "ev_drowned_3",
      "title": "الحقيبة المضادة للماء لدى سارة",
      "description": "فحص الحقيبة المضادة للماء بحوزة سارة كشف عن احتوائها على عدسات تصوير بحري متضررة بالرطوبة دون وجود أي قطع أثرية.",
      "publicClue": "حقيبة سارة المضادة للماء احتوت على معدات وعدسات تصوير بحري متضررة.",
      "category": "witness",
      "availableFromRound": 2,
      "discussionPrompt": "ما سبب نقل سارة لمعدات التصوير إلى قمرة التجفيف في ذلك التوقيت؟",
      "timelineInfo": "الساعة 6:15 ص: نقل سارة للعدسات المتضررة إلى قمرة التجفيف.",
      "relatedCharacters": [
        "سارة",
        "د. زياد"
      ]
    },
    {
      "id": "ev_drowned_4",
      "title": "اتفاقية حقوق النشر والتسمية الحصرية",
      "description": "المراسلات الرسمية تُبين وجود نزاع حول حقوق التوثيق الإعلامي والبث الحصري لعمليات الانتشال بين رئيس البعثة وإدارة التراث.",
      "publicClue": "المراسلات تشير إلى تباين المواقف حول أسبقية توثيق الاكتشافات البحرية ونشرها.",
      "category": "motive",
      "availableFromRound": 2,
      "discussionPrompt": "كيف أثر النزاع حول حقوق التوثيق على إدارة عمليات الغوص والاستكشاف؟",
      "timelineInfo": "مساء الأمس: خلاف رسمي حول حقوق البث الإعلامي للغطسات الاستكشافية.",
      "relatedCharacters": [
        "د. زياد",
        "فؤاد"
      ]
    },
    {
      "id": "ev_drowned_5",
      "title": "السجل الرقمي لضاغط الهواء الآلي",
      "description": "السجل التقني لضاغط الهواء الآلي يُظهر تشغيل دورات التعبئة الذاتية المبرمجة مسبقاً دون تسجيل أي تعديل أو تشغيل يدوي بين 5:30 و 6:45 ص.",
      "publicClue": "السجل الرقمي لضاغط الهواء يُبين عمل المضخات بالنظام الآلي المبرمج دون أي تشغيل يدوي بين 5:30 و 6:45 ص.",
      "category": "timeline",
      "availableFromRound": 3,
      "discussionPrompt": "ما دلالة عمل ضاغط الهواء بنظام التعبئة الذاتية المبرمجة خلال الفترة الصباحية؟",
      "timelineInfo": "من 5:30 إلى 6:45 ص: عمل ضاغط الهواء بالنمط الآلي المبرمج دون أي إدخال يدوي.",
      "relatedCharacters": [
        "فؤاد"
      ]
    },
    {
      "id": "ev_drowned_village_6",
      "title": "تقرير المعاينة التكميلي رقم 6",
      "description": "تقرير فني موثق من موقع الحادثة يوضح مسار الحركة والمعدات في مسرح الواقعة (سفينة أبحاث بحرية ترسو فوق بقايا قرية بيزنطية غارقة على عمق 40 متراً.).",
      "publicClue": "أظهرت المعاينة الفنية تفاصيل موثقة حول التحركات والمعدات المستخدمة في الموقع عند الواقعة.",
      "category": "physical",
      "availableFromRound": 3,
      "discussionPrompt": "كيف تفسر الأطراف المعنية المؤشرات الجنائية المرصودة في هذا البند الفني؟",
      "timelineInfo": "تسجيل المؤشر الفني رقم #6 في مسرح القضية.",
      "associatedSuspect": "فؤاد",
      "relatedCharacters": [
        "فؤاد"
      ],
      "titleEn": "Supplemental Inspection Item #6",
      "descriptionEn": "Official technical record detailing physical traces and movements at the scene (قرية تحت الماء).",
      "publicClueEn": "Technical inspection revealed documented indicators regarding movement and equipment.",
      "discussionPromptEn": "How do the relevant persons account for the technical findings recorded in this item?"
    },
    {
      "id": "ev_drowned_village_7",
      "title": "تقرير المعاينة التكميلي رقم 7",
      "description": "تقرير فني موثق من موقع الحادثة يوضح مسار الحركة والمعدات في مسرح الواقعة (سفينة أبحاث بحرية ترسو فوق بقايا قرية بيزنطية غارقة على عمق 40 متراً.).",
      "publicClue": "أظهرت المعاينة الفنية تفاصيل موثقة حول التحركات والمعدات المستخدمة في الموقع عند الواقعة.",
      "category": "document",
      "availableFromRound": 3,
      "discussionPrompt": "كيف تفسر الأطراف المعنية المؤشرات الجنائية المرصودة في هذا البند الفني؟",
      "timelineInfo": "تسجيل المؤشر الفني رقم #7 في مسرح القضية.",
      "associatedSuspect": "د. زياد",
      "relatedCharacters": [
        "د. زياد"
      ],
      "titleEn": "Supplemental Inspection Item #7",
      "descriptionEn": "Official technical record detailing physical traces and movements at the scene (قرية تحت الماء).",
      "publicClueEn": "Technical inspection revealed documented indicators regarding movement and equipment.",
      "discussionPromptEn": "How do the relevant persons account for the technical findings recorded in this item?"
    },
    {
      "id": "ev_drowned_village_8",
      "title": "تقرير المعاينة التكميلي رقم 8",
      "description": "تقرير فني موثق من موقع الحادثة يوضح مسار الحركة والمعدات في مسرح الواقعة (سفينة أبحاث بحرية ترسو فوق بقايا قرية بيزنطية غارقة على عمق 40 متراً.).",
      "publicClue": "أظهرت المعاينة الفنية تفاصيل موثقة حول التحركات والمعدات المستخدمة في الموقع عند الواقعة.",
      "category": "witness",
      "availableFromRound": 3,
      "discussionPrompt": "كيف تفسر الأطراف المعنية المؤشرات الجنائية المرصودة في هذا البند الفني؟",
      "timelineInfo": "تسجيل المؤشر الفني رقم #8 في مسرح القضية.",
      "associatedSuspect": "ماجد",
      "relatedCharacters": [
        "ماجد"
      ],
      "titleEn": "Supplemental Inspection Item #8",
      "descriptionEn": "Official technical record detailing physical traces and movements at the scene (قرية تحت الماء).",
      "publicClueEn": "Technical inspection revealed documented indicators regarding movement and equipment.",
      "discussionPromptEn": "How do the relevant persons account for the technical findings recorded in this item?"
    },
    {
      "id": "ev_drowned_village_9",
      "title": "تقرير المعاينة التكميلي رقم 9",
      "description": "تقرير فني موثق من موقع الحادثة يوضح مسار الحركة والمعدات في مسرح الواقعة (سفينة أبحاث بحرية ترسو فوق بقايا قرية بيزنطية غارقة على عمق 40 متراً.).",
      "publicClue": "أظهرت المعاينة الفنية تفاصيل موثقة حول التحركات والمعدات المستخدمة في الموقع عند الواقعة.",
      "category": "timeline",
      "availableFromRound": 4,
      "discussionPrompt": "كيف تفسر الأطراف المعنية المؤشرات الجنائية المرصودة في هذا البند الفني؟",
      "timelineInfo": "تسجيل المؤشر الفني رقم #9 في مسرح القضية.",
      "associatedSuspect": "فؤاد",
      "relatedCharacters": [
        "فؤاد"
      ],
      "titleEn": "Supplemental Inspection Item #9",
      "descriptionEn": "Official technical record detailing physical traces and movements at the scene (قرية تحت الماء).",
      "publicClueEn": "Technical inspection revealed documented indicators regarding movement and equipment.",
      "discussionPromptEn": "How do the relevant persons account for the technical findings recorded in this item?"
    },
    {
      "id": "ev_drowned_village_10",
      "title": "تقرير المعاينة التكميلي رقم 10",
      "description": "تقرير فني موثق من موقع الحادثة يوضح مسار الحركة والمعدات في مسرح الواقعة (سفينة أبحاث بحرية ترسو فوق بقايا قرية بيزنطية غارقة على عمق 40 متراً.).",
      "publicClue": "أظهرت المعاينة الفنية تفاصيل موثقة حول التحركات والمعدات المستخدمة في الموقع عند الواقعة.",
      "category": "motive",
      "availableFromRound": 4,
      "discussionPrompt": "كيف تفسر الأطراف المعنية المؤشرات الجنائية المرصودة في هذا البند الفني؟",
      "timelineInfo": "تسجيل المؤشر الفني رقم #10 في مسرح القضية.",
      "associatedSuspect": "د. زياد",
      "relatedCharacters": [
        "د. زياد"
      ],
      "titleEn": "Supplemental Inspection Item #10",
      "descriptionEn": "Official technical record detailing physical traces and movements at the scene (قرية تحت الماء).",
      "publicClueEn": "Technical inspection revealed documented indicators regarding movement and equipment.",
      "discussionPromptEn": "How do the relevant persons account for the technical findings recorded in this item?"
    },
    {
      "id": "ev_drowned_village_11",
      "title": "تقرير المعاينة التكميلي رقم 11",
      "description": "تقرير فني موثق من موقع الحادثة يوضح مسار الحركة والمعدات في مسرح الواقعة (سفينة أبحاث بحرية ترسو فوق بقايا قرية بيزنطية غارقة على عمق 40 متراً.).",
      "publicClue": "أظهرت المعاينة الفنية تفاصيل موثقة حول التحركات والمعدات المستخدمة في الموقع عند الواقعة.",
      "category": "physical",
      "availableFromRound": 4,
      "discussionPrompt": "كيف تفسر الأطراف المعنية المؤشرات الجنائية المرصودة في هذا البند الفني؟",
      "timelineInfo": "تسجيل المؤشر الفني رقم #11 في مسرح القضية.",
      "associatedSuspect": "ماجد",
      "relatedCharacters": [
        "ماجد"
      ],
      "titleEn": "Supplemental Inspection Item #11",
      "descriptionEn": "Official technical record detailing physical traces and movements at the scene (قرية تحت الماء).",
      "publicClueEn": "Technical inspection revealed documented indicators regarding movement and equipment.",
      "discussionPromptEn": "How do the relevant persons account for the technical findings recorded in this item?"
    },
    {
      "id": "ev_drowned_village_12",
      "title": "تقرير المعاينة التكميلي رقم 12",
      "description": "تقرير فني موثق من موقع الحادثة يوضح مسار الحركة والمعدات في مسرح الواقعة (سفينة أبحاث بحرية ترسو فوق بقايا قرية بيزنطية غارقة على عمق 40 متراً.).",
      "publicClue": "أظهرت المعاينة الفنية تفاصيل موثقة حول التحركات والمعدات المستخدمة في الموقع عند الواقعة.",
      "category": "document",
      "availableFromRound": 4,
      "discussionPrompt": "كيف تفسر الأطراف المعنية المؤشرات الجنائية المرصودة في هذا البند الفني؟",
      "timelineInfo": "تسجيل المؤشر الفني رقم #12 في مسرح القضية.",
      "associatedSuspect": "فؤاد",
      "relatedCharacters": [
        "فؤاد"
      ],
      "titleEn": "Supplemental Inspection Item #12",
      "descriptionEn": "Official technical record detailing physical traces and movements at the scene (قرية تحت الماء).",
      "publicClueEn": "Technical inspection revealed documented indicators regarding movement and equipment.",
      "discussionPromptEn": "How do the relevant persons account for the technical findings recorded in this item?"
    }
  ],
  "solution": "قام فؤاد باستغلال خبرته واستخدام دراجة الدفع وأسطوانة التريمكس للغطس سراً قبل الموعد الرسمي، حيث قطع السلسلة وسحب صندوق الأجراس لإخفائه وبيعه لحسابه، محاولاً التستر وراء حجة تشغيل ضاغط الهواء الذي أثبتت السجلات الرقمية عمله آلياً دون تدخله."
};
