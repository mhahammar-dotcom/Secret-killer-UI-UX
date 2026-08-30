import { Story } from '../../game/types';

export const observatoryStory: Story = {
  "id": "observatory",
  "title": "مرصد قمة الجبل",
  "description": "سرقة العينة النيزكية النادرة من قبة المرصد واستبدالها بحجر بازلتي أثناء انطفاء أجهزة التتبع والتحويل الكهربائي.",
  "minPlayers": 4,
  "maxPlayers": 12,
  "maxWrongVotes": 3,
  "introduction": {
    "setting": "مرصد فلكي معزول على قمة جبلية شاهقة محاطة بالضباب والرياح القوية.",
    "situation": "كان الفريق يحلل نواة نيزك مريخي نادر يحتوي على نظائر كيميائية غير مسبوقة.",
    "incident": "عند الساعة 1:15 صباحاً، أثناء تحويل التغذية الكهربائية لمدة 90 ثانية، اختفت العينة النيزكية من حجرة الطيف المفرغة.",
    "stakes": "العينة لا تقدر بثمن، والطريق الجبلي مقطوع بالثلوج مما يحصر السارق بين الحاضرين في المرصد."
  },
  "guiltyPool": [
    {
      "name": "إياد",
      "profession": "فني التلسكوب الرئيسي",
      "publicIdentity": "أنت المسؤول عن معايرة المحركات الميكانيكية للتلسكوب وصيانة حجرة القياس الطيفي.",
      "knowledge": "تعلم أن د. رؤوف مكث متأخراً في القبة الرئيسية، ورأيت مايا تسجل إشارات الخطأ على شاشات التحليل.",
      "guilty": true
    },
    {
      "name": "د. رؤوف",
      "profession": "كبير علماء الفلك والمشرف",
      "publicIdentity": "أنت المشرف العلمي على أبحاث المرصد وصاحب صلاحية الإشراف على العينات النيزكية.",
      "knowledge": "رأيت إياد يتفقد لوحة التحكم بحجرة الطيف عند 1:00 ص، وسمعت صوت تفريغ الضغط الهيدروليكي أثناء تحويل الكهرباء.",
      "guilty": true
    },
    {
      "name": "مايا",
      "profession": "محللة بيانات ومصورة فلكية",
      "publicIdentity": "أنت المسؤولة عن معالجة الصور الرقمية وتحليل الأطياف الضوئية على المحطات الحاسوبية.",
      "knowledge": "رأيت د. رؤوف يغادر القبة حاملاً حافظة جلدية سوداء عند 1:10 ص وبدا عليه التكتم الشديد.",
      "guilty": true
    }
  ],
  "innocentPool": [
    {
      "name": "طارق",
      "profession": "فني كهرباء المنشأة",
      "publicIdentity": "أنت المسؤول عن بنك البطاريات ومولدات الطاقة الاحتياطية للمرصد.",
      "knowledge": "التحويل الكهربائي تم تقديمه 5 دقائق عن موعده المجدول عبر أمر صدر من شاشة القبة الرئيسية.",
      "guilty": false
    },
    {
      "name": "ديمة",
      "profession": "باحثة زائرة في علم الصخور",
      "publicIdentity": "أنت الباحثة المنتدبة لمقارنة النظائر مع العينات الأرضية.",
      "knowledge": "العينة النيزكية كانت مبرمجة للنقل إلى مؤسسة أبحاث دولية الأسبوع المقبل مما كان سينهي أبحاث الفريق المحلي.",
      "guilty": false
    },
    {
      "name": "زياد",
      "profession": "مشغل فتحات القبة الميكانيكية",
      "publicIdentity": "أنت المسؤول عن تدوير قبة التلسكوب وفتح الستائر العلوية.",
      "knowledge": "ستار القبة العلوي تم إغلاقه يدوي لحجب الرؤية عن ممر الصيانة عند 1:05 ص.",
      "guilty": false
    },
    {
      "name": "سامر",
      "profession": "راصد الغلاف الجوي",
      "publicIdentity": "أنت المسؤول عن محطة الرصد الجوي ومقاييس سرعة الرياح.",
      "knowledge": "الضباب الكثيف حجب ممر السير الخارجي المؤدي لكوخ المولد بين 1:00 و 1:30 ص.",
      "guilty": false
    },
    {
      "name": "حنان",
      "profession": "المنسقة الإدارية للمرصد",
      "publicIdentity": "أنت المسؤولة عن الشؤون المالية وتراخيص البعثات العلمية.",
      "knowledge": "إدارة المرصد أعلنت تقليصاً وشيكاً في ميزانية الصيانة للموسم القادم.",
      "guilty": false
    },
    {
      "name": "فراس",
      "profession": "مهندس اتصالات الأقمار الصناعية",
      "publicIdentity": "أنت المسؤول عن ربط بيانات المرصد بالشبكة الجامعية المركزية.",
      "knowledge": "رابط الإرسال الفضائي تم إيقافه مؤقتاً قبل التحويل الكهربائي بدقائق.",
      "guilty": false
    },
    {
      "name": "وفاء",
      "profession": "كيميائية المختبر التحليلي",
      "publicIdentity": "أنت المسؤولة عن الكواشف الكيميائية وحفظ العينات تحت الضغط.",
      "knowledge": "فتح حجرة التفريغ يتطلب استخدام مفتاح التنفيس الميكانيكي المعلق في ورشة الصيانة المشتركة.",
      "guilty": false
    },
    {
      "name": "عاصم",
      "profession": "حارس البوابة الجبلية",
      "publicIdentity": "أنت المسؤول عن بوابة المدق الجبلي وأجهزة المراقبة المحيطية.",
      "knowledge": "الثلوج سدت الطريق تماماً ولم تقترب أي مركبة من محيط المرصد طوال الليل.",
      "guilty": false
    },
    {
      "name": "منى",
      "profession": "أخصائية التوجيه الليزري",
      "publicIdentity": "أنت المسؤولة عن ليزر التتبع البصري الدقيق للأجرام السماوية.",
      "knowledge": "شعاع الليزر أُطفئ يدوياً قبل موعد التحويل بدقيقتين من لوحة المراقبة.",
      "guilty": false
    }
  ],
  "evidence": [
    {
      "id": "ev_obs_1",
      "title": "مفتاح تنفيس حجرة الطيف المفرغة",
      "description": "المعاينة الفنية لحجرة الطيف المفرغة أظهرت استخدام مفتاح التنفيس الميكانيكي المودع في ورشة الأدوات لفك الضغط وسحب العينة دون كسر.",
      "publicClue": "حجرة الطيف فُتحت باستخدام مفتاح التنفيس المشترك المحفوظ في ورشة الصيانة.",
      "category": "physical",
      "availableFromRound": 1,
      "discussionPrompt": "من كان لديه إمكانية الوصول إلى ورشة الصيانة قبل انقطاع التيار الكهربائي؟",
      "timelineInfo": "الساعة 1:14 ص: استخدام مفتاح التنفيس لتفريغ ضغط الحجرة وسحب العينة.",
      "relatedCharacters": [
        "إياد",
        "د. رؤوف",
        "مايا"
      ]
    },
    {
      "id": "ev_obs_2",
      "title": "سجل تقديم موعد التحويل الكهربائي",
      "description": "سجل وحدة التحكم الرئيسية يوضح إدخال أمر تقديم التحويل الكهربائي من كونسول القبة قبل 5 دقائق من الوقت المجدول.",
      "publicClue": "أمر تقديم التحويل الكهربائي أُدخل من كونسول القبة الرئيسي عند الساعة 1:10 ص.",
      "category": "physical",
      "availableFromRound": 1,
      "discussionPrompt": "ما سبب تعديل توقيت التحويل الكهربائي على كونسول القبة الرئيسي؟",
      "timelineInfo": "الساعة 1:10 ص: إدخال أمر تقديم موعد التحويل الكهربائي على شاشة التحكم.",
      "relatedCharacters": [
        "د. رؤوف",
        "مايا",
        "إياد"
      ]
    },
    {
      "id": "ev_obs_3",
      "title": "الحافظة الجلدية لـ د. رؤوف",
      "description": "تفتيش الحافظة الجلدية التي كان يحملها د. رؤوف أظهر احتواءها على مسودات حسابات وأبحاث فلكية غير منشورة دون وجود العينة النيزكية.",
      "publicClue": "الحافظة الجلدية لـ د. رؤوف احتوت على مسودات أبحاث فلكية خاصة.",
      "category": "witness",
      "availableFromRound": 2,
      "discussionPrompt": "ما أسباب نقل د. رؤوف لمسودات أبحاثه الفلكية إلى خزانته الشخصية في ذلك التوقيت؟",
      "timelineInfo": "الساعة 1:10 ص: نقل د. رؤوف لمسودات أبحاثه الفلكية في الحافظة الجلدية.",
      "relatedCharacters": [
        "د. رؤوف",
        "مايا"
      ]
    },
    {
      "id": "ev_obs_4",
      "title": "تقرير إلغاء المنحة البحثية للمرصد",
      "description": "عُثر على إشعار رسمي من الجهة المانحة يفيد بإنهاء تمويل المشروع الفلكي مع نهاية الشهر الجاري.",
      "publicClue": "إشعار إنهاء التمويل البحثي يوضح الضغوط المالية التي تواجه إدارة المرصد.",
      "category": "motive",
      "availableFromRound": 2,
      "discussionPrompt": "كيف انعكس قرار إنهاء التمويل البحثي على أولويات طاقم المرصد؟",
      "timelineInfo": "صباح الأمس: استلام إشعار إنهاء تمويل المشروع الفلكي.",
      "relatedCharacters": [
        "د. رؤوف",
        "إياد"
      ]
    },
    {
      "id": "ev_obs_5",
      "title": "حساسات الحركة الحرارية لكوخ المولد الخارجي",
      "description": "سجل الحساس الحراري لكوخ المولد الخارجي يُبين بقاء الباب مغلقاً وتراكم طبقة الصقيع دون أي حركة دخول أو خروج بين 1:00 و 1:30 ص.",
      "publicClue": "الحساس الحراري يُظهر بقاء باب كوخ المولد الخارجي مغلقاً دون أي حركة فتح بين 1:00 و 1:30 ص.",
      "category": "timeline",
      "availableFromRound": 3,
      "discussionPrompt": "كيف ترتبط بيانات حساسات باب المولد الخارجي بالجداول الزمنية المعلنة أثناء فترة التحويل؟",
      "timelineInfo": "من 1:00 إلى 1:30 ص: انعدام تام لحركة فتح باب كوخ المولد الخارجي وبقاء الحساسات في وضع السكون.",
      "relatedCharacters": [
        "إياد"
      ]
    },
    {
      "id": "ev_observatory_6",
      "title": "سجل الوصول لقبة المنظار الفلكي",
      "description": "القفل الإلكتروني لقبة المنظار سجل دخولاً ببطاقة الصيانة عند 11:15 م قبل بدء الرصد.",
      "publicClue": "استخدام بطاقة الصيانة الفنية لفتح قبة المنظار عند 11:15 م.",
      "category": "timeline",
      "availableFromRound": 1,
      "discussionPrompt": "من كان يحمل بطاقة صيانة القبة الفلكية قبل موعد الرصد؟",
      "timelineInfo": "الساعة 11:15 م: فتح قبة المنظار ببطاقة الصيانة.",
      "relatedCharacters": [
        "إياد",
        "د. رؤوف"
      ],
      "titleEn": "Observatory Dome Access Log",
      "descriptionEn": "The electronic lock on the dome recorded entry with a maintenance badge at 11:15 PM.",
      "publicClueEn": "Technical maintenance keycard used at the telescope dome at 11:15 PM.",
      "discussionPromptEn": "Who held the dome maintenance card prior to observation time?"
    },
    {
      "id": "ev_observatory_7",
      "title": "فلتر العدسة الطيفية المستبدل",
      "description": "العثور على فلتر ضوئي معطوب مستبدل في درج غرفة المعايرة يحمل بصمات زيتية حديثة.",
      "publicClue": "فلتر طيفي تالف وُجد مخبأ في درج غرفة المعايرة وعليه آثار شحم دقيق.",
      "category": "physical",
      "availableFromRound": 2,
      "discussionPrompt": "لماذا تم استبدال الفلتر الطيفي الرئيسي قبل رصد المستعر الأعظم؟",
      "timelineInfo": "الساعة 11:25 م: استبدال الفلتر الطيفي في غرفة المعايرة.",
      "relatedCharacters": [
        "إياد",
        "مايا"
      ],
      "titleEn": "Replaced Spectral Lens Filter",
      "descriptionEn": "A damaged spectral filter was found hidden in the calibration drawer with fresh grease smudges.",
      "publicClueEn": "Damaged spectral filter found hidden in the calibration drawer.",
      "discussionPromptEn": "Why was the primary spectral filter swapped out before the supernova sighting?"
    },
    {
      "id": "ev_observatory_8",
      "title": "سجل نقل حزم البيانات الفلكية",
      "description": "سيرفر المرصد يظهر إرسال حزمة بيانات غير مشفرة بحجم 4 جيجابايت لعنوان بريد خارجي عند 11:38 م.",
      "publicClue": "إرسال ملفات طيفية ضخمة لعنوان خارجي عبر خط الإنترنت الفضائي عند 11:38 م.",
      "category": "document",
      "availableFromRound": 2,
      "discussionPrompt": "من قام بنقل الحزم الطيفية للعنوان الخارجي أثناء انقطاع اتصال التتبع؟",
      "timelineInfo": "الساعة 11:38 م: تصدير حزمة البيانات الطيفية خارجياً.",
      "relatedCharacters": [
        "مايا",
        "د. رؤوف"
      ],
      "titleEn": "Astronomical Data Packet Log",
      "descriptionEn": "The server logs confirm a 4GB unencrypted data packet dispatched to an external IP at 11:38 PM.",
      "publicClueEn": "Large spectral dataset exported to an external address via satellite link at 11:38 PM.",
      "discussionPromptEn": "Who dispatched the spectral dataset during the tracking blackout?"
    },
    {
      "id": "ev_observatory_9",
      "title": "غطاء حماية المحرك المتمركز",
      "description": "براغي غطاء محرك توجيه المنظار وُجدت مفكوكة جزئياً بأداة سداسية خاصة بطاقم التشغيل.",
      "publicClue": "براغي محرك توجيه المنظار فُكت جزئياً بأداة سداسية متوفرة في المرصد.",
      "category": "physical",
      "availableFromRound": 3,
      "discussionPrompt": "من فك براغي محرك توجيه المنظار لتعطيل حركته الدقيقة؟",
      "timelineInfo": "الساعة 11:30 م: فك مسامير محرك المنظار الرئيسي.",
      "relatedCharacters": [
        "إياد",
        "د. رؤوف"
      ],
      "titleEn": "Telescope Motor Housing Cover",
      "descriptionEn": "Screws on the telescope drive motor housing were found partially loosened with a hex wrench.",
      "publicClueEn": "Drive motor screws partially loosened using an observatory hex tool.",
      "discussionPromptEn": "Who loosened the drive motor housing to disrupt precision tracking?"
    },
    {
      "id": "ev_observatory_10",
      "title": "تسجيل الميكروفون المحيطي للقبة",
      "description": "الميكروفون الداخلي سجل حواراً هامساً حول قيمة الاكتشاف الفلكي قبل الحادثة بنصف ساعة.",
      "publicClue": "تسجيل صوتي لهمسات داخل القبة تتعلق بمكافأة الاكتشاف العلمي عند 11:00 م.",
      "category": "witness",
      "availableFromRound": 3,
      "discussionPrompt": "من كان يتناقش في القبة الفلكية حول بيع حقوق الاكتشاف الفلكي؟",
      "timelineInfo": "الساعة 11:00 م: رصد محادثة مقتضبة داخل القبة.",
      "relatedCharacters": [
        "مايا",
        "إياد"
      ],
      "titleEn": "Dome Ambient Microphone Recording",
      "descriptionEn": "Internal microphones picked up a whispered discussion regarding discovery rights at 11:00 PM.",
      "publicClueEn": "Whispered audio regarding discovery compensation recorded in the dome at 11:00 PM.",
      "discussionPromptEn": "Who held a quiet discussion in the dome about monetizing discovery rights?"
    },
    {
      "id": "ev_observatory_11",
      "title": "مذكرة التقديم لمسابقة الجائزة الدولية",
      "description": "مسودة خطاب تقديم لجائزة دولية عُثر عليها في مكتب المرصد تحمل اسم باحث واحد دون بقية الفريق.",
      "publicClue": "طلب ترشيح فردي لجائزة فلكية دولية عُثر عليه مطبوعاً في مكتب الإدارة.",
      "category": "motive",
      "availableFromRound": 4,
      "discussionPrompt": "لماذا تم إعداد طلب ترشيح فردي باسم باحث واحد فقط؟",
      "timelineInfo": "الساعة 10:45 م: وجود مسودة الترشيح الفردي في المكتب.",
      "relatedCharacters": [
        "د. رؤوف",
        "مايا"
      ],
      "titleEn": "International Award Submission Draft",
      "descriptionEn": "An award submission draft found in the office lists a single researcher, omitting the team.",
      "publicClueEn": "Solo award nomination draft discovered printed in the observatory office.",
      "discussionPromptEn": "Why was an individual nomination draft prepared excluding the rest of the crew?"
    },
    {
      "id": "ev_observatory_12",
      "title": "مؤقت جهاز التشويش اللاسلكي",
      "description": "العثور على بطارية جهاز تشويش لاسلكي صغير مفرغة تماماً تحت منصة المراقبة.",
      "publicClue": "بطارية جهاز تشويش إشارة مفرغة عثر عليها تحت منصة الرصد.",
      "category": "physical",
      "availableFromRound": 4,
      "discussionPrompt": "من وضع جهاز التشويش اللاسلكي لقطع الاتصال أثناء عملية السرقة؟",
      "timelineInfo": "الساعة 11:35 م: تشغيل جهاز تشويش الترددات تحت المنصة.",
      "relatedCharacters": [
        "إياد",
        "د. رؤوف"
      ],
      "titleEn": "Wireless Jammer Battery",
      "descriptionEn": "A drained battery from a compact wireless jammer was located under the observation floor.",
      "publicClueEn": "Depleted wireless signal jammer battery found beneath the observing platform.",
      "discussionPromptEn": "Who planted the signal jammer to blackout communications during the theft?"
    }
  ],
  "solution": "قام إياد بتقديم أمر التحويل الكهربائي من كونسول القبة، وأثناء فترة الظلام لـ 90 ثانية استخدم مفتاح التنفيس الميكانيكي لسحب النواة النيزكية واستبدالها بحجر بازلتي، مدعياً الذهاب لكوخ المولد الذي أثبتت الحساسات عدم فتحه إطلاقاً."
};
