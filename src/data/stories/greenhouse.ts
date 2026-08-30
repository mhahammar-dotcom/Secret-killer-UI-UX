import { Story } from '../../game/types';

export const greenhouseStory: Story = {
  "id": "greenhouse",
  "title": "ليلة في الدفيئة",
  "description": "قطف النبتة الطبية النادرة ومحو السجل الجيني من حاسوب الدفيئة لإنتاج العقار خارج المركز قبل تسجيل براءة الاختراع.",
  "minPlayers": 4,
  "maxPlayers": 12,
  "maxWrongVotes": 3,
  "introduction": {
    "setting": "دفيئة زراعية وأبحاث نباتية متقدمة في واد جبلي رطب مجهزة بأنظمة ري ورطوبة ومناخ ذاتي.",
    "situation": "نجح الفريق في استنبات سلالة نادرة من زهرة الأوركيد المضيئة القادرة على علاج ضمور الأعصاب.",
    "incident": "عند الساعة 11:30 مساءً، انطلق إنذار الرطوبة بعد قص الزهرة النادرة من حاضنتها ومحو تسلسلها الجيني من محطة التحكم.",
    "stakes": "الزهرة هي العينة الحية الوحيدة القادرة على إنتاج المصل، وبوابات المزرعة محكمة الإغلاق لمنع تهريبها."
  },
  "guiltyPool": [
    {
      "name": "د. سهيل",
      "profession": "خبير علم النبات الجيني",
      "publicIdentity": "أنت العالم المسؤول عن الهندسة الوراثية للنباتات وتوثيق التسلسل الحمضي في قاعدة البيانات.",
      "knowledge": "تعلم أن د. ليلى كانت تسقي الشتلات في القطاع أ، ورأيت باسم يفحص فوهات الرذاذ في الممر الرئيسي.",
      "guilty": true
    },
    {
      "name": "باسم",
      "profession": "فني الري والتحكم بالمناخ",
      "publicIdentity": "أنت المسؤول عن مضخات الرطوبة وضبط درجات الحرارة ومستويات الضباب في الدفيئة.",
      "knowledge": "رأيت طارق يحمل قارورة حرارية معزولة قرب المخرج الخلفي عند 11:35 م وبدا يتلفت بحذر.",
      "guilty": true
    },
    {
      "name": "ديمة",
      "profession": "مساعدة أبحاث المختبر النباتي",
      "publicIdentity": "أنت المسؤولة عن إدخال القراءات اليومية ومطابقة صور النمو.",
      "knowledge": "قاعدة البيانات الجينية تم تسجيل الدخول إليها من شاشة الدفيئة الطرفية المشتركة.",
      "guilty": true
    }
  ],
  "innocentPool": [
    {
      "name": "د. ليلى",
      "profession": "عالمة النباتات الطبية والتداوي",
      "publicIdentity": "أنت الباحثة المسؤولة عن دراسة الخواص العلاجية وتحديد فاعلية المستخلصات الحيوية.",
      "knowledge": "رأيت د. سهيل يقف قرب حاضنة الأوركيد يحمل مقص التقليم عند 11:10 م، وتعلمين أن حفظ النبتة يحتاج هلاماً مغذياً خاصاً.",
      "guilty": false
    },
    {
      "name": "طارق",
      "profession": "أخصائي البستنة والبيوت المحمية",
      "publicIdentity": "أنت المسؤول عن رعاية الشتلات وتقليم الأغصان وتجهيز أواني الاستنبات.",
      "knowledge": "لاحظت أن خزان الخلط في عنبر التربة كان جافاً تماماً ونظيفاً دون أي آثار خلط أسمدة.",
      "guilty": false
    },
    {
      "name": "رامي",
      "profession": "حارس الدفيئة والمحيط الخارجي",
      "publicIdentity": "أنت المسؤول عن تأمين السياج الشجري وبوابات الخروج للمزرعة.",
      "knowledge": "السياج الكهربائي الخارجي للمزرعة ظل موصولاً بالكامل دون أي اختراق من الخارج.",
      "guilty": false
    },
    {
      "name": "سلمى",
      "profession": "كيميائية الاستخلاص الدوائي",
      "publicIdentity": "أنت المسؤولة عن فصل الزيوت الطيارة واختبار نقاء المركبات الحيوية.",
      "knowledge": "إنزيمات زهرة الأوركيد تتلف في غضون 20 دقيقة ما لم تُحفظ في وسط غذائي هلامي مبرد.",
      "guilty": false
    },
    {
      "name": "فارس",
      "profession": "مدير المنشأة الزراعية واللوجستيات",
      "publicIdentity": "أنت المشرف الإداري على العقود والمشتريات وتجهيزات البيوت الزجاجية.",
      "knowledge": "مقص التقليم الجراحي أعيد إلى خزانة الأدوات المشتركة وعليه آثار عصارة نباتية حديثة.",
      "guilty": false
    },
    {
      "name": "نادية",
      "profession": "أخصائية زراعة الأنسجة النباتية",
      "publicIdentity": "أنت المسؤولة عن تحضير أنابيب الاستنساخ والأوساط الهلامية المعقمة.",
      "knowledge": "أنابيب الهلام المغذي المبردة كانت قد صُرفت صباحاً لـ د. سهيل لغايات التجربة الجينية.",
      "guilty": false
    },
    {
      "name": "حسان",
      "profession": "باحث ميداني في الفلورا الجبلية",
      "publicIdentity": "أنت المختص بجمع الأنواع البرية ومطابقة بيئتها الأصلية.",
      "knowledge": "رطوبة الحاضنة المركزية انخفضت بنسبة 15% فور فتح الغطاء الزجاجي عند 11:25 م.",
      "guilty": false
    },
    {
      "name": "منى",
      "profession": "مسؤولة التوثيق وبراءات الاختراع",
      "publicIdentity": "أنت المسؤولة عن إعداد ملف الحماية الفكرية للنبات الطبي الجديد.",
      "knowledge": "شركة أدوية دولية قدمت عرض تمويل ضخم مشترطة إثبات التفوق الجيني للعينة قبل نهاية الشهر.",
      "guilty": false
    },
    {
      "name": "عمر",
      "profession": "عامل صيانة وتجهيز البيوت الزجاجية",
      "publicIdentity": "أنت المسؤول عن تنظيف الألواح الزجاجية وصيانة مصابيح النمو.",
      "knowledge": "إضاءة عنبر التربة والخلط كانت مطفأة تماماً طوال فترة المساء حتى انطلاق الإنذار.",
      "guilty": false
    }
  ],
  "evidence": [
    {
      "id": "ev_green_1",
      "title": "مقص التقليم الجراحي المعقم",
      "description": "الفحص النباتي الدقيق لغصن زهرة الأوركيد يُظهر قصه بمقص تقليم معقم ونقله إلى وعاء مبرد بالنيتروجين السائل لحفظ الأنسجة الحية.",
      "publicClue": "زهرة الأوركيد قُصت بأداة تقليم معقمة وخُزنت في وعاء مبرد لحفظ الأنسجة.",
      "category": "physical",
      "availableFromRound": 1,
      "discussionPrompt": "من كان لديه إمكانية التعامل مع أوعية النيتروجين السائل وأدوات التقليم المعقمة؟",
      "timelineInfo": "الساعة 11:30 م: قص زهرة الأوركيد ووضعها في أنبوب التبريد النيتروجيني.",
      "relatedCharacters": [
        "د. سهيل",
        "د. ليلى",
        "طارق"
      ]
    },
    {
      "id": "ev_green_2",
      "title": "سجل محو ملف التسلسل الجيني",
      "description": "سجلات الشاشة الطرفية في ممر الدفيئة المشترك تُبين تنفيذ أمر مسح نهائي لملفات التسلسل الجيني للزهرة عند الساعة 11:28 م.",
      "publicClue": "ملفات التسلسل الجيني للزهرة حُذفت من الشاشة الطرفية المشتركة في ممر الدفيئة عند 11:28 م.",
      "category": "physical",
      "availableFromRound": 1,
      "discussionPrompt": "ما سبب حذف بيانات التسلسل الجيني من الشاشة الطرفية في ممر الدفيئة؟",
      "timelineInfo": "الساعة 11:28 م: تنفيذ أمر حذف بيانات التسلسل الجيني من الشاشة الطرفية.",
      "relatedCharacters": [
        "د. سهيل",
        "د. ليلى",
        "باسم"
      ]
    },
    {
      "id": "ev_green_3",
      "title": "القارورة الحرارية لدى طارق",
      "description": "تفتيش القارورة الحرارية بحوزة طارق كشف عن احتوائها على شاي مثلج دون وجود أي عينات أو أوساط زراعية نباتية.",
      "publicClue": "القارورة الحرارية لـ طارق احتوت على شاي مثلج فقط.",
      "category": "witness",
      "availableFromRound": 2,
      "discussionPrompt": "ما سبب تواجد طارق قرب المخرج الخلفي للدفيئة حاملاً قارورته الحرارية؟",
      "timelineInfo": "الساعة 11:35 م: فتح طارق للقارورة الحرارية لتناول الشاي قرب المخرج الخلفي.",
      "relatedCharacters": [
        "طارق",
        "باسم"
      ]
    },
    {
      "id": "ev_green_4",
      "title": "وثيقة النزاع حول حقوق براءة الاختراع",
      "description": "وثائق المركز تتضمن طلباً خطياً مقدماً من د. ليلى للاعتراض على نسب المشاركة في مسودة براءة اختراع السلالة النباتية.",
      "publicClue": "وثيقة الاعتراض تشير إلى تباين وجهات النظر حول نسب المشاركة في براءة الاختراع.",
      "category": "motive",
      "availableFromRound": 2,
      "discussionPrompt": "كيف أثر الاعتراض على نسب براءة الاختراع على التعاون البحثي داخل الدفيئة؟",
      "timelineInfo": "صباح اليوم: تسجيل اعتراض د. ليلى الخطي على مسودة براءة الاختراع.",
      "relatedCharacters": [
        "د. ليلى",
        "د. سهيل"
      ]
    },
    {
      "id": "ev_green_5",
      "title": "السجل الآلي لمضخات خلط الأسمدة بعنبر التربة",
      "description": "السجل الآلي لمضخات عنبر التربة يُظهر بقاء المحابس مغلقة وخلو خزانات الخلط من أي تدفق للمياه أو المحاليل بين 11:00 و 11:50 م.",
      "publicClue": "السجل الرقمي لمضخات التربة يُبين توقف تدفق المحاليل وجفاف خزانات الخلط بين 11:00 و 11:50 م.",
      "category": "timeline",
      "availableFromRound": 3,
      "discussionPrompt": "كيف ترتبط بيانات خلو خزانات الأسمدة مع الأنشطة المعلنة في عنبر التربة قبيل منتصف الليل؟",
      "timelineInfo": "من 11:00 إلى 11:50 م: بقاء مضخات وخزانات خلط الأسمدة في عنبر التربة بحالة توقف وجفاف تام.",
      "relatedCharacters": [
        "د. سهيل"
      ]
    },
    {
      "id": "ev_greenhouse_6",
      "title": "تقرير المعاينة التكميلي رقم 6",
      "description": "تقرير فني موثق من موقع الحادثة يوضح مسار الحركة والمعدات في مسرح الواقعة (دفيئة زراعية وأبحاث نباتية متقدمة في واد جبلي رطب مجهزة بأنظمة ري ورطوبة ومناخ ذاتي.).",
      "publicClue": "أظهرت المعاينة الفنية تفاصيل موثقة حول التحركات والمعدات المستخدمة في الموقع عند الواقعة.",
      "category": "physical",
      "availableFromRound": 3,
      "discussionPrompt": "كيف تفسر الأطراف المعنية المؤشرات الجنائية المرصودة في هذا البند الفني؟",
      "timelineInfo": "تسجيل المؤشر الفني رقم #6 في مسرح القضية.",
      "associatedSuspect": "د. سهيل",
      "relatedCharacters": [
        "د. سهيل"
      ],
      "titleEn": "Supplemental Inspection Item #6",
      "descriptionEn": "Official technical record detailing physical traces and movements at the scene (ليلة في الدفيئة).",
      "publicClueEn": "Technical inspection revealed documented indicators regarding movement and equipment.",
      "discussionPromptEn": "How do the relevant persons account for the technical findings recorded in this item?"
    },
    {
      "id": "ev_greenhouse_7",
      "title": "تقرير المعاينة التكميلي رقم 7",
      "description": "تقرير فني موثق من موقع الحادثة يوضح مسار الحركة والمعدات في مسرح الواقعة (دفيئة زراعية وأبحاث نباتية متقدمة في واد جبلي رطب مجهزة بأنظمة ري ورطوبة ومناخ ذاتي.).",
      "publicClue": "أظهرت المعاينة الفنية تفاصيل موثقة حول التحركات والمعدات المستخدمة في الموقع عند الواقعة.",
      "category": "document",
      "availableFromRound": 3,
      "discussionPrompt": "كيف تفسر الأطراف المعنية المؤشرات الجنائية المرصودة في هذا البند الفني؟",
      "timelineInfo": "تسجيل المؤشر الفني رقم #7 في مسرح القضية.",
      "associatedSuspect": "باسم",
      "relatedCharacters": [
        "باسم"
      ],
      "titleEn": "Supplemental Inspection Item #7",
      "descriptionEn": "Official technical record detailing physical traces and movements at the scene (ليلة في الدفيئة).",
      "publicClueEn": "Technical inspection revealed documented indicators regarding movement and equipment.",
      "discussionPromptEn": "How do the relevant persons account for the technical findings recorded in this item?"
    },
    {
      "id": "ev_greenhouse_8",
      "title": "تقرير المعاينة التكميلي رقم 8",
      "description": "تقرير فني موثق من موقع الحادثة يوضح مسار الحركة والمعدات في مسرح الواقعة (دفيئة زراعية وأبحاث نباتية متقدمة في واد جبلي رطب مجهزة بأنظمة ري ورطوبة ومناخ ذاتي.).",
      "publicClue": "أظهرت المعاينة الفنية تفاصيل موثقة حول التحركات والمعدات المستخدمة في الموقع عند الواقعة.",
      "category": "witness",
      "availableFromRound": 3,
      "discussionPrompt": "كيف تفسر الأطراف المعنية المؤشرات الجنائية المرصودة في هذا البند الفني؟",
      "timelineInfo": "تسجيل المؤشر الفني رقم #8 في مسرح القضية.",
      "associatedSuspect": "ديمة",
      "relatedCharacters": [
        "ديمة"
      ],
      "titleEn": "Supplemental Inspection Item #8",
      "descriptionEn": "Official technical record detailing physical traces and movements at the scene (ليلة في الدفيئة).",
      "publicClueEn": "Technical inspection revealed documented indicators regarding movement and equipment.",
      "discussionPromptEn": "How do the relevant persons account for the technical findings recorded in this item?"
    },
    {
      "id": "ev_greenhouse_9",
      "title": "تقرير المعاينة التكميلي رقم 9",
      "description": "تقرير فني موثق من موقع الحادثة يوضح مسار الحركة والمعدات في مسرح الواقعة (دفيئة زراعية وأبحاث نباتية متقدمة في واد جبلي رطب مجهزة بأنظمة ري ورطوبة ومناخ ذاتي.).",
      "publicClue": "أظهرت المعاينة الفنية تفاصيل موثقة حول التحركات والمعدات المستخدمة في الموقع عند الواقعة.",
      "category": "timeline",
      "availableFromRound": 4,
      "discussionPrompt": "كيف تفسر الأطراف المعنية المؤشرات الجنائية المرصودة في هذا البند الفني؟",
      "timelineInfo": "تسجيل المؤشر الفني رقم #9 في مسرح القضية.",
      "associatedSuspect": "د. سهيل",
      "relatedCharacters": [
        "د. سهيل"
      ],
      "titleEn": "Supplemental Inspection Item #9",
      "descriptionEn": "Official technical record detailing physical traces and movements at the scene (ليلة في الدفيئة).",
      "publicClueEn": "Technical inspection revealed documented indicators regarding movement and equipment.",
      "discussionPromptEn": "How do the relevant persons account for the technical findings recorded in this item?"
    },
    {
      "id": "ev_greenhouse_10",
      "title": "تقرير المعاينة التكميلي رقم 10",
      "description": "تقرير فني موثق من موقع الحادثة يوضح مسار الحركة والمعدات في مسرح الواقعة (دفيئة زراعية وأبحاث نباتية متقدمة في واد جبلي رطب مجهزة بأنظمة ري ورطوبة ومناخ ذاتي.).",
      "publicClue": "أظهرت المعاينة الفنية تفاصيل موثقة حول التحركات والمعدات المستخدمة في الموقع عند الواقعة.",
      "category": "motive",
      "availableFromRound": 4,
      "discussionPrompt": "كيف تفسر الأطراف المعنية المؤشرات الجنائية المرصودة في هذا البند الفني؟",
      "timelineInfo": "تسجيل المؤشر الفني رقم #10 في مسرح القضية.",
      "associatedSuspect": "باسم",
      "relatedCharacters": [
        "باسم"
      ],
      "titleEn": "Supplemental Inspection Item #10",
      "descriptionEn": "Official technical record detailing physical traces and movements at the scene (ليلة في الدفيئة).",
      "publicClueEn": "Technical inspection revealed documented indicators regarding movement and equipment.",
      "discussionPromptEn": "How do the relevant persons account for the technical findings recorded in this item?"
    },
    {
      "id": "ev_greenhouse_11",
      "title": "تقرير المعاينة التكميلي رقم 11",
      "description": "تقرير فني موثق من موقع الحادثة يوضح مسار الحركة والمعدات في مسرح الواقعة (دفيئة زراعية وأبحاث نباتية متقدمة في واد جبلي رطب مجهزة بأنظمة ري ورطوبة ومناخ ذاتي.).",
      "publicClue": "أظهرت المعاينة الفنية تفاصيل موثقة حول التحركات والمعدات المستخدمة في الموقع عند الواقعة.",
      "category": "physical",
      "availableFromRound": 4,
      "discussionPrompt": "كيف تفسر الأطراف المعنية المؤشرات الجنائية المرصودة في هذا البند الفني؟",
      "timelineInfo": "تسجيل المؤشر الفني رقم #11 في مسرح القضية.",
      "associatedSuspect": "ديمة",
      "relatedCharacters": [
        "ديمة"
      ],
      "titleEn": "Supplemental Inspection Item #11",
      "descriptionEn": "Official technical record detailing physical traces and movements at the scene (ليلة في الدفيئة).",
      "publicClueEn": "Technical inspection revealed documented indicators regarding movement and equipment.",
      "discussionPromptEn": "How do the relevant persons account for the technical findings recorded in this item?"
    },
    {
      "id": "ev_greenhouse_12",
      "title": "تقرير المعاينة التكميلي رقم 12",
      "description": "تقرير فني موثق من موقع الحادثة يوضح مسار الحركة والمعدات في مسرح الواقعة (دفيئة زراعية وأبحاث نباتية متقدمة في واد جبلي رطب مجهزة بأنظمة ري ورطوبة ومناخ ذاتي.).",
      "publicClue": "أظهرت المعاينة الفنية تفاصيل موثقة حول التحركات والمعدات المستخدمة في الموقع عند الواقعة.",
      "category": "document",
      "availableFromRound": 4,
      "discussionPrompt": "كيف تفسر الأطراف المعنية المؤشرات الجنائية المرصودة في هذا البند الفني؟",
      "timelineInfo": "تسجيل المؤشر الفني رقم #12 في مسرح القضية.",
      "associatedSuspect": "د. سهيل",
      "relatedCharacters": [
        "د. سهيل"
      ],
      "titleEn": "Supplemental Inspection Item #12",
      "descriptionEn": "Official technical record detailing physical traces and movements at the scene (ليلة في الدفيئة).",
      "publicClueEn": "Technical inspection revealed documented indicators regarding movement and equipment.",
      "discussionPromptEn": "How do the relevant persons account for the technical findings recorded in this item?"
    }
  ],
  "solution": "قام د. سهيل بقص زهرة الأوركيد بالمقص الجراحي وحفظها في الهلام المغذي المعد مسبقاً، ثم محا سجلها الجيني من الشاشة المشتركة لاحتكار تصنيع العقار في مختبر خاص، محاولاً التستر وراء حجة تحضير الأسمدة التي أثبتت السجلات الرقمية جفاف خزاناتها وتوقف مضخاتها تماماً."
};
