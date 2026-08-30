import { Story } from '../../game/types';

export const galaToastStory: Story = {
  "id": "gala_toast",
  "title": "نخب أخير",
  "description": "تسميم كأس رجل الأعمال مراد بجرعة مميتة من دوائه الخاص أثناء الحفل السنوي الفاخر في الفيلا الجبلية.",
  "minPlayers": 4,
  "maxPlayers": 12,
  "maxWrongVotes": 3,
  "introduction": {
    "setting": "فيلا جبلية فاخرة تطل على البحر أثناء حفل استقبال خاص لكبار رجال الأعمال والمستشارين.",
    "situation": "أعلن المضيف الملياردير مراد عن نيته تعديل وصيته وتوزيع ثروته على جمعيات خيرية بدلاً من المقربين.",
    "incident": "عند الساعة 10:30 مساءً، سقط مراد مغشياً عليه بعد احتساء كأسه الخاص، وكشف الفحص الطبي السريع عن تسممه بجرعة مركزة مضاعفة من قطرات قلبه.",
    "stakes": "السم مستخلص من دواء شخصي، وبوابات الفيلا مغلقة بأمر الشرطة حتى كشف من دس الجرعة القاتلة."
  },
  "guiltyPool": [
    {
      "name": "سامية",
      "profession": "محامية العائلة والمستشارة القانونية",
      "publicIdentity": "أنت المسؤولة عن صياغة الوصايا وإدارة الأصول الاستثمارية لمراد ومتابعة الشؤون القضائية للأسرة.",
      "knowledge": "تعلم أن د. كريم كان يتحدث مع هند قرب شرفة الحديقة، ورأيت الشريك التجاري فارس يتجادل مع مراد حول أسهم الشركة.",
      "guilty": true
    },
    {
      "name": "د. كريم",
      "profession": "الطبيب الشخصي لمراد",
      "publicIdentity": "أنت المشرف على علاج مراد الصحي وصاحب الوصفة الطبية لقطرات تنظيم ضربات القلب.",
      "knowledge": "رأيت سامية تقف قرب طاولة المشروبات الخاصة في ممر المكتبة عند 10:20 م، وقطرات القلب عديمة اللون والرائحة تماماً.",
      "guilty": true
    },
    {
      "name": "فارس",
      "profession": "الشريك التجاري الرئيسي",
      "publicIdentity": "أنت شريك مراد في الصفقات العقارية والمسؤول عن إدارة الاستثمارات المشتركة.",
      "knowledge": "رأيت مديرة القصر هند تحمل علبة دواء مراد في الممر عند 10:10 م وبدت في عجلة من أمرها.",
      "guilty": true
    }
  ],
  "innocentPool": [
    {
      "name": "هند",
      "profession": "مديرة القصر والمشرفة على الضيافة",
      "publicIdentity": "أنت المسؤولة عن إدارة طاقم الخدمة وتنظيم بوفيه الحفل وتلبية طلبات مراد الخاصة.",
      "knowledge": "كأس مراد الخاص بالكريستال بقي على طاولة الخدمة الجانبية بالمكتبة دون مراقبة لمدة 10 دقائق.",
      "guilty": false
    },
    {
      "name": "منى",
      "profession": "ابنة شقيق مراد والوريثة السابقة",
      "publicIdentity": "أنت القريبة التي كانت تنتظر إدارة أوقاف العائلة قبل إعلان الوصية الجديدة.",
      "knowledge": "مراد أعلن نيته حرمان جميع الورثة التقليديين من العائدات المباشرة قبل الحفل بساعة.",
      "guilty": false
    },
    {
      "name": "طارق",
      "profession": "نادل الحفل والمشرف على المشروبات",
      "publicIdentity": "أنت المسؤول عن سكب المشروبات في الأكواب الكريستالية وتقديمها للمضيف.",
      "knowledge": "طاولة المشروبات الخاصة في ممر المكتبة كانت مخصصة لمراد وضيوفه المقربين فقط.",
      "guilty": false
    },
    {
      "name": "ليلى",
      "profession": "تاجرة اللوحات الفنية وصديقة العائلة",
      "publicIdentity": "أنت الضيفة التي كانت تفاوض مراد على بيع مجموعة لوحات نادرة.",
      "knowledge": "مراد رفض تمويل صفقة اللوحات الجديدة وأنهى النقاش بحدة قبل بدء حفل العشاء.",
      "guilty": false
    },
    {
      "name": "عمر",
      "profession": "رئيس حرس الفيلا والبوابات",
      "publicIdentity": "أنت المسؤول عن تأمين الأسوار وكاميرات المراقبة المحيطية للبوابة الرئيسية.",
      "knowledge": "البوابات الإلكترونية الخارجية أغلقت عند التاسعة مساءً ولم يدخل أي شخص غريب.",
      "guilty": false
    },
    {
      "name": "رانيا",
      "profession": "مشرفة طاقم الضيافة الخارجية",
      "publicIdentity": "أنت المسؤولة عن تنظيم عمل الطهاة والمساعدين في قاعة الطعام.",
      "knowledge": "حقيبة د. كريم الطبية كانت متروكة في غرفة المعاطف المشتركة بجوار المدخل.",
      "guilty": false
    },
    {
      "name": "يوسف",
      "profession": "السائق الخاص لمراد",
      "publicIdentity": "أنت المسؤول عن تنقلات مراد ومواعيد لقاءاته الرسمية خارج الفيلا.",
      "knowledge": "سامية طلبت لقاءً منفرداً مع مراد في مكتبه قبل العشاء وخرجت منه غاضبة.",
      "guilty": false
    },
    {
      "name": "سلمى",
      "profession": "المحاسبة القانونية لشركات مراد",
      "publicIdentity": "أنت المسؤولة عن تدقيق الحسابات والتحويلات المصرفية الخارجية.",
      "knowledge": "حسابات الشركة كانت تخضع لتدقيق خارجي كشف عن استقطاعات غير مبررة في الرسوم القانونية.",
      "guilty": false
    },
    {
      "name": "خالد",
      "profession": "خادم الصالون الخاص",
      "publicIdentity": "أنت المسؤول عن ترتيب طاولات القراءة والصحف في المكتبة.",
      "knowledge": "مراد كان ينوي توقيع استبدال محامي العائلة رسمياً صباح يوم الاثنين.",
      "guilty": false
    }
  ],
  "evidence": [
    {
      "id": "ev_gala_1",
      "title": "كأس الكريستال والتقرير السمومي السريع",
      "description": "الفحص السمومي السريع للكأس الكريستالي أظهر وجود تركيز مرتفع من محلول دواء تنظيم ضربات القلب المذاب في المشروب.",
      "publicClue": "التقرير السمومي يُظهر وجود تركيز مضاعف من قطرات دواء القلب الخاصة بمراد في الكأس الكريستالي.",
      "category": "physical",
      "availableFromRound": 1,
      "discussionPrompt": "من كان يعلم نوعية الدواء الخاص بمراد وموقع حفظه داخل الفيلا؟",
      "timelineInfo": "الساعة 10:22 م: إضافة قطرات الدواء المركزة في الكأس الكريستالي على طاولة الخدمة.",
      "relatedCharacters": [
        "سامية",
        "د. كريم",
        "فارس",
        "هند"
      ]
    },
    {
      "id": "ev_gala_2",
      "title": "معاينة طاولة المشروبات الخاصة بالمكتبة",
      "description": "المعاينة الميدانية توضح بقاء الكأس على طاولة الخدمة الجانبية بممر المكتبة بين 10:15 و 10:28 م قبل تقديمه لمراد.",
      "publicClue": "الكأس وُضع على طاولة الخدمة الجانبية بممر المكتبة من 10:15 حتى 10:28 م متاحاً لمرور من بالفيلا.",
      "category": "physical",
      "availableFromRound": 1,
      "discussionPrompt": "من مر بممر المكتبة أثناء فترة بقاء الكأس على الطاولة الجانبية دون مراقبة؟",
      "timelineInfo": "من 10:15 إلى 10:28 م: بقاء الكأس على الطاولة الجانبية قرب مدخل المكتبة.",
      "relatedCharacters": [
        "سامية",
        "هند",
        "د. كريم"
      ]
    },
    {
      "id": "ev_gala_3",
      "title": "علبة الدواء لدى مديرة القصر هند",
      "description": "فحص مكتب مراد أظهر وجود علبة الدواء داخل الدرج المغلق جزئياً بعد تسليم هند للجرعة اليومية المعتادة بناءً على طلبه المسبق.",
      "publicClue": "علبة الدواء وُجدت في درج مكتب مراد بعد وضعها هناك بواسطة مديرة القصر هند عند 10:10 م.",
      "category": "witness",
      "availableFromRound": 2,
      "discussionPrompt": "ما سبب وضع علبة الدواء في درج مكتب مراد عند الساعة 10:10 م؟",
      "timelineInfo": "الساعة 10:10 م: إيداع هند لعلبة الدواء في درج مكتب مراد تنفيذاً لطلبه.",
      "relatedCharacters": [
        "هند",
        "فارس"
      ]
    },
    {
      "id": "ev_gala_4",
      "title": "المشادة المالية للشريك فارس",
      "description": "شهادات الحضور تشير إلى نقاش مالي حاد بين فارس ومراد في صالون التدخين حول إعادة هيكلة أسهم الشركة المشتركة.",
      "publicClue": "النقاش المالي في صالون التدخين كشف عن تباين الآراء بين الشريكين حول إدارة أصول الشركة.",
      "category": "motive",
      "availableFromRound": 2,
      "discussionPrompt": "كيف أثرت الخلافات المالية حول إدارة الشركة على أجواء الحفل قبل نخب المساء؟",
      "timelineInfo": "الساعة 9:45 م: نقاش مالي حول أسهم الشركة بين فارس ومراد في صالون التدخين.",
      "relatedCharacters": [
        "فارس",
        "سامية"
      ]
    },
    {
      "id": "ev_gala_5",
      "title": "سجل حاسوب المحامية في المكتبة الخاصة",
      "description": "السجل الرقمي لحاسوب سامية المحمول يُظهر فتح ملف الحسابات عند 10:00 م وبقاء النظام في وضع الخمول دون أي مدخلات أو حركة للفأرة حتى 10:50 م.",
      "publicClue": "السجل الرقمي للحاسوب المحمول يُبين بقاء الجهاز في وضع الخمول دون أي نشاط كتابي بين 10:00 و 10:50 م.",
      "category": "timeline",
      "availableFromRound": 3,
      "discussionPrompt": "ما دلالة خمول الحاسوب المحمول في المكتبة خلال الفترة بين 10:00 و 10:50 م؟",
      "timelineInfo": "من 10:00 إلى 10:50 م: بقاء الحاسوب المحمول في وضع الخمول التام دون أي مدخلات أو نشاط.",
      "relatedCharacters": [
        "سامية"
      ]
    },
    {
      "id": "ev_gala_toast_6",
      "title": "تقرير المعاينة التكميلي رقم 6",
      "description": "تقرير فني موثق من موقع الحادثة يوضح مسار الحركة والمعدات في مسرح الواقعة (فيلا جبلية فاخرة تطل على البحر أثناء حفل استقبال خاص لكبار رجال الأعمال والمستشارين.).",
      "publicClue": "أظهرت المعاينة الفنية تفاصيل موثقة حول التحركات والمعدات المستخدمة في الموقع عند الواقعة.",
      "category": "physical",
      "availableFromRound": 3,
      "discussionPrompt": "كيف تفسر الأطراف المعنية المؤشرات الجنائية المرصودة في هذا البند الفني؟",
      "timelineInfo": "تسجيل المؤشر الفني رقم #6 في مسرح القضية.",
      "associatedSuspect": "سامية",
      "relatedCharacters": [
        "سامية"
      ],
      "titleEn": "Supplemental Inspection Item #6",
      "descriptionEn": "Official technical record detailing physical traces and movements at the scene (نخب أخير).",
      "publicClueEn": "Technical inspection revealed documented indicators regarding movement and equipment.",
      "discussionPromptEn": "How do the relevant persons account for the technical findings recorded in this item?"
    },
    {
      "id": "ev_gala_toast_7",
      "title": "تقرير المعاينة التكميلي رقم 7",
      "description": "تقرير فني موثق من موقع الحادثة يوضح مسار الحركة والمعدات في مسرح الواقعة (فيلا جبلية فاخرة تطل على البحر أثناء حفل استقبال خاص لكبار رجال الأعمال والمستشارين.).",
      "publicClue": "أظهرت المعاينة الفنية تفاصيل موثقة حول التحركات والمعدات المستخدمة في الموقع عند الواقعة.",
      "category": "document",
      "availableFromRound": 3,
      "discussionPrompt": "كيف تفسر الأطراف المعنية المؤشرات الجنائية المرصودة في هذا البند الفني؟",
      "timelineInfo": "تسجيل المؤشر الفني رقم #7 في مسرح القضية.",
      "associatedSuspect": "د. كريم",
      "relatedCharacters": [
        "د. كريم"
      ],
      "titleEn": "Supplemental Inspection Item #7",
      "descriptionEn": "Official technical record detailing physical traces and movements at the scene (نخب أخير).",
      "publicClueEn": "Technical inspection revealed documented indicators regarding movement and equipment.",
      "discussionPromptEn": "How do the relevant persons account for the technical findings recorded in this item?"
    },
    {
      "id": "ev_gala_toast_8",
      "title": "تقرير المعاينة التكميلي رقم 8",
      "description": "تقرير فني موثق من موقع الحادثة يوضح مسار الحركة والمعدات في مسرح الواقعة (فيلا جبلية فاخرة تطل على البحر أثناء حفل استقبال خاص لكبار رجال الأعمال والمستشارين.).",
      "publicClue": "أظهرت المعاينة الفنية تفاصيل موثقة حول التحركات والمعدات المستخدمة في الموقع عند الواقعة.",
      "category": "witness",
      "availableFromRound": 3,
      "discussionPrompt": "كيف تفسر الأطراف المعنية المؤشرات الجنائية المرصودة في هذا البند الفني؟",
      "timelineInfo": "تسجيل المؤشر الفني رقم #8 في مسرح القضية.",
      "associatedSuspect": "فارس",
      "relatedCharacters": [
        "فارس"
      ],
      "titleEn": "Supplemental Inspection Item #8",
      "descriptionEn": "Official technical record detailing physical traces and movements at the scene (نخب أخير).",
      "publicClueEn": "Technical inspection revealed documented indicators regarding movement and equipment.",
      "discussionPromptEn": "How do the relevant persons account for the technical findings recorded in this item?"
    },
    {
      "id": "ev_gala_toast_9",
      "title": "تقرير المعاينة التكميلي رقم 9",
      "description": "تقرير فني موثق من موقع الحادثة يوضح مسار الحركة والمعدات في مسرح الواقعة (فيلا جبلية فاخرة تطل على البحر أثناء حفل استقبال خاص لكبار رجال الأعمال والمستشارين.).",
      "publicClue": "أظهرت المعاينة الفنية تفاصيل موثقة حول التحركات والمعدات المستخدمة في الموقع عند الواقعة.",
      "category": "timeline",
      "availableFromRound": 4,
      "discussionPrompt": "كيف تفسر الأطراف المعنية المؤشرات الجنائية المرصودة في هذا البند الفني؟",
      "timelineInfo": "تسجيل المؤشر الفني رقم #9 في مسرح القضية.",
      "associatedSuspect": "سامية",
      "relatedCharacters": [
        "سامية"
      ],
      "titleEn": "Supplemental Inspection Item #9",
      "descriptionEn": "Official technical record detailing physical traces and movements at the scene (نخب أخير).",
      "publicClueEn": "Technical inspection revealed documented indicators regarding movement and equipment.",
      "discussionPromptEn": "How do the relevant persons account for the technical findings recorded in this item?"
    },
    {
      "id": "ev_gala_toast_10",
      "title": "تقرير المعاينة التكميلي رقم 10",
      "description": "تقرير فني موثق من موقع الحادثة يوضح مسار الحركة والمعدات في مسرح الواقعة (فيلا جبلية فاخرة تطل على البحر أثناء حفل استقبال خاص لكبار رجال الأعمال والمستشارين.).",
      "publicClue": "أظهرت المعاينة الفنية تفاصيل موثقة حول التحركات والمعدات المستخدمة في الموقع عند الواقعة.",
      "category": "motive",
      "availableFromRound": 4,
      "discussionPrompt": "كيف تفسر الأطراف المعنية المؤشرات الجنائية المرصودة في هذا البند الفني؟",
      "timelineInfo": "تسجيل المؤشر الفني رقم #10 في مسرح القضية.",
      "associatedSuspect": "د. كريم",
      "relatedCharacters": [
        "د. كريم"
      ],
      "titleEn": "Supplemental Inspection Item #10",
      "descriptionEn": "Official technical record detailing physical traces and movements at the scene (نخب أخير).",
      "publicClueEn": "Technical inspection revealed documented indicators regarding movement and equipment.",
      "discussionPromptEn": "How do the relevant persons account for the technical findings recorded in this item?"
    },
    {
      "id": "ev_gala_toast_11",
      "title": "تقرير المعاينة التكميلي رقم 11",
      "description": "تقرير فني موثق من موقع الحادثة يوضح مسار الحركة والمعدات في مسرح الواقعة (فيلا جبلية فاخرة تطل على البحر أثناء حفل استقبال خاص لكبار رجال الأعمال والمستشارين.).",
      "publicClue": "أظهرت المعاينة الفنية تفاصيل موثقة حول التحركات والمعدات المستخدمة في الموقع عند الواقعة.",
      "category": "physical",
      "availableFromRound": 4,
      "discussionPrompt": "كيف تفسر الأطراف المعنية المؤشرات الجنائية المرصودة في هذا البند الفني؟",
      "timelineInfo": "تسجيل المؤشر الفني رقم #11 في مسرح القضية.",
      "associatedSuspect": "فارس",
      "relatedCharacters": [
        "فارس"
      ],
      "titleEn": "Supplemental Inspection Item #11",
      "descriptionEn": "Official technical record detailing physical traces and movements at the scene (نخب أخير).",
      "publicClueEn": "Technical inspection revealed documented indicators regarding movement and equipment.",
      "discussionPromptEn": "How do the relevant persons account for the technical findings recorded in this item?"
    },
    {
      "id": "ev_gala_toast_12",
      "title": "تقرير المعاينة التكميلي رقم 12",
      "description": "تقرير فني موثق من موقع الحادثة يوضح مسار الحركة والمعدات في مسرح الواقعة (فيلا جبلية فاخرة تطل على البحر أثناء حفل استقبال خاص لكبار رجال الأعمال والمستشارين.).",
      "publicClue": "أظهرت المعاينة الفنية تفاصيل موثقة حول التحركات والمعدات المستخدمة في الموقع عند الواقعة.",
      "category": "document",
      "availableFromRound": 4,
      "discussionPrompt": "كيف تفسر الأطراف المعنية المؤشرات الجنائية المرصودة في هذا البند الفني؟",
      "timelineInfo": "تسجيل المؤشر الفني رقم #12 في مسرح القضية.",
      "associatedSuspect": "سامية",
      "relatedCharacters": [
        "سامية"
      ],
      "titleEn": "Supplemental Inspection Item #12",
      "descriptionEn": "Official technical record detailing physical traces and movements at the scene (نخب أخير).",
      "publicClueEn": "Technical inspection revealed documented indicators regarding movement and equipment.",
      "discussionPromptEn": "How do the relevant persons account for the technical findings recorded in this item?"
    }
  ],
  "solution": "قامت سامية باستغلال وجودها في المكتبة للاطلاع على مسودة الوصية الجديدة التي تقضي بعزلها، وأخذت قطرات القلب من درج المكتب ودست جرعة مضاعفة قاتلة في كأس مراد بينما كان على الطاولة الجانبية، مدعية الانشغال بمراجعة الحسابات على حاسوبها الذي أثبتت السجلات الرقمية خموله التام طوال تلك الفترة."
};
