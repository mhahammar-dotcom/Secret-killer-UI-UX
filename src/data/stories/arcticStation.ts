import { Story } from '../../game/types';

export const arcticStationStory: Story = {
  "id": "arctic_station",
  "title": "محطة الجليد الأخير",
  "description": "إتلاف أسطوانة الجليد الأثرية وتخريب جهاز التبريد الاحتياطي لإخفاء نتائج بحثية تدحض نماذج مناخية مشهورة.",
  "minPlayers": 4,
  "maxPlayers": 12,
  "maxWrongVotes": 3,
  "introduction": {
    "setting": "محطة أبحاث قطبية معزولة وسط عاصفة ثلجية عاتية تحاصر الفريق داخل المجمع.",
    "situation": "استخرج الفريق أسطوانة جليد عميقة تحوي فقاعات غازية ترجع لمئات آلاف السنين تكشف أسرار تغير المناخ.",
    "incident": "عند الساعة 1:30 صباحاً، انطلق جرس إنذار قبو التجميد بعد قطع أنبوب التبريد وارتفاع الحرارة متسبباً في ذوبان العينة التاريخية.",
    "stakes": "العينة فريدة من نوعها، والعاصفة تمنع أي وصول خارجي مما يجعل الفاعل حتماً أحد أفراد طاقم المحطة."
  },
  "guiltyPool": [
    {
      "name": "د. مروان",
      "profession": "كبير علماء المناخ القديم",
      "publicIdentity": "أنت العالم المسؤول عن النماذج المناخية النظرية وصاحب الأبحاث المنشورة في كبرى الدوريات العلمية.",
      "knowledge": "تعلم أن د. إيلينا بقيت في قبو العينات لفحص الترسبات، ورأيت بوريس يتفقد خطوط مولد التدفئة الرئيسي.",
      "guilty": true
    },
    {
      "name": "ديمتري",
      "profession": "مدير الخدمات والإمداد اللوجستي",
      "publicIdentity": "أنت المسؤول عن مخازن الأغذية وقطع الغيار وجداول رحلات الإجلاء.",
      "knowledge": "طائرة الإجلاء القطبية مجدولة للوصول خلال 48 ساعة فور هدوء الرياح العاتية.",
      "guilty": true
    },
    {
      "name": "كاتيا",
      "profession": "كيميائية النظائر والغازات المحتبسة",
      "publicIdentity": "أنت المختصة بتحليل الغازات المحبوسة داخل الفقاعات الجليدية.",
      "knowledge": "النتائج الأولية للتحليل أثبتت وجود تراكيز كربونية تدحض النظرية الشهيرة التي نشرها د. مروان.",
      "guilty": true
    }
  ],
  "innocentPool": [
    {
      "name": "د. إيلينا",
      "profession": "أخصائية علم الجليد وحفظ العينات",
      "publicIdentity": "أنت المسؤولة الميدانية عن القبو التجميدي وفحص استقرار درجات حرارة أسطوانات الجليد المستخرجة.",
      "knowledge": "رأيت د. مروان يتجه نحو جناح القبو التجميدي عند 1:10 ص وبدا عليه التكتم والانزعاج من نتائج الفحص الأخير.",
      "guilty": false
    },
    {
      "name": "بوريس",
      "profession": "كبير مهندسي الصيانة والمحركات",
      "publicIdentity": "أنت المسؤول عن تأمين الطاقة والتدفئة وصيانة أنابيب التبريد ومولدات الديزل بالمحطة.",
      "knowledge": "سمعت صفارة إنذار ضغط القبو عند 1:32 ص، ورأيت د. إيلينا تهرع من ممر العزل نحو القبو فور انطلاق الجرس.",
      "guilty": false
    },
    {
      "name": "نادية",
      "profession": "ضابطة الاتصالات واللاسلكي",
      "publicIdentity": "أنت المسؤولة عن التواصل مع مراكز الأبحاث الدولية وتلقي تقارير الأقمار الصناعية.",
      "knowledge": "رأيت بوريس يحمل مفتاح أنابيب معدنياً في الممر قرب مجاري التبريد عند 1:25 ص وبدا متجهاً للمضخات.",
      "guilty": false
    },
    {
      "name": "سامر",
      "profession": "فني الحفر الميداني للجليد",
      "publicIdentity": "أنت المسؤول عن تشغيل منصة استخراج أسطوانات الجليد من الأعماق.",
      "knowledge": "العاصفة أغلقت فتحات التهوية الخارجية بإحكام، واستحالت مغادرة أي شخص لمحيط المبنى المغلق.",
      "guilty": false
    },
    {
      "name": "لينا",
      "profession": "مساعدة أبحاث المختبر الجليدي",
      "publicIdentity": "أنت مسؤولة توثيق الصور الرقمية وشرائح المجهر للبلورات الجليدية.",
      "knowledge": "مقبض باب قبو العينات كان يحمل آثار صقيع تدل على فتحه وإغلاقه بشكل متكرر وسريع.",
      "guilty": false
    },
    {
      "name": "أندريه",
      "profession": "ميكانيكي التبريد والضغط العالي",
      "publicIdentity": "أنت المسؤول عن شحن غاز الفريون وصيانة ضواغط التجميد الدقيقة.",
      "knowledge": "القطع في خرطوم التبريد نُفذ بمبضع تشريح جراحي حاد ودقيق، وليس بمفتاح صيانة سباكة ثقيل.",
      "guilty": false
    },
    {
      "name": "سارة",
      "profession": "مسؤولة السلامة والأمان المهني",
      "publicIdentity": "أنت المسؤولة عن أجهزة كشف تسرب الغازات وأنظمة الإطفاء الآلية.",
      "knowledge": "سخانات الطوارئ في المختبر رُفعت يدوياً لأقصى درجة تسخين عند 1:28 ص لتسريع ذوبان الجليد.",
      "guilty": false
    },
    {
      "name": "طارق",
      "profession": "طاهي المحطة ومسؤول التموين",
      "publicIdentity": "أنت المسؤول عن إعداد وجبات الطاقم والحفاظ على مياه الشرب الساخنة.",
      "knowledge": "حافظات المياه الساخنة التابعة للمطبخ كانت قد استُخدمت قبل منتصف الليل لتدفئة ممرات الخدمة.",
      "guilty": false
    },
    {
      "name": "ميشيل",
      "profession": "محلل القياسات الجيوفيزيائية",
      "publicIdentity": "أنت المسؤول عن أجهزة قياس مغناطيسية الأرض والموجات الزلزالية.",
      "knowledge": "سجلات حساسات حرارة القبو حُفظت محلياً على القرص الصلب الاحتياطي قبل انقطاع الشبكة.",
      "guilty": false
    }
  ],
  "evidence": [
    {
      "id": "ev_arctic_1",
      "title": "أداة قطع أنبوب التبريد بالمختبر",
      "description": "الفحص الدقيق لأنبوب التبريد يُبين أن القطع نُفذ بمبضع جراحي دقيق من طاقم أدوات مختبر العينات البيولوجية.",
      "publicClue": "أنبوب التبريد قُطع باستخدام مبضع جراحي دقيق من أدوات المختبر البيولوجي المشترك.",
      "category": "physical",
      "availableFromRound": 1,
      "discussionPrompt": "من كان لديه وصول إلى أدراج الأدوات الجراحية في المختبر البيولوجي؟",
      "timelineInfo": "الساعة 1:27 ص: قطع أنبوب دارة التبريد باستخدام مبضع جراحي دقيق.",
      "relatedCharacters": [
        "د. مروان",
        "د. إيلينا",
        "بوريس"
      ]
    },
    {
      "id": "ev_arctic_2",
      "title": "سجل مؤشر حرارة القبو التجميدي",
      "description": "سجل درجات الحرارة في القبو التجميدي يُظهر ارتفاعاً مفاجئاً تزامن مع تشغيل مفتاح سخان الطوارئ اليدوي عند الساعة 1:28 ص.",
      "publicClue": "مفتاح سخان الطوارئ اليدوي في قبو التبريد تم تفعيله عند الساعة 1:28 ص.",
      "category": "physical",
      "availableFromRound": 1,
      "discussionPrompt": "ما العوامل التي أدت إلى تشغيل سخان الطوارئ اليدوي داخل قبو التجميد؟",
      "timelineInfo": "الساعة 1:28 ص: تفعيل مفتاح سخان الطوارئ اليدوي داخل القبو التجميدي.",
      "relatedCharacters": [
        "د. إيلينا",
        "د. مروان",
        "بوريس"
      ]
    },
    {
      "id": "ev_arctic_3",
      "title": "مفتاح الأنابيب لدى المهندس بوريس",
      "description": "تفتيش عنبر التدفئة أظهر وجود صمام ماء تم إصلاحه بمفتاح الأنابيب بحوزة بوريس لمنع تسرب المياه الساخنة وتجمد الشبكة.",
      "publicClue": "المعاينة الميدانية أظهرت قيام بوريس بإصلاح صمام تسريب في شبكة التدفئة باستخدام مفتاح الأنابيب.",
      "category": "witness",
      "availableFromRound": 2,
      "discussionPrompt": "ما طبيعة أعمال الصيانة التي تمت في شبكة التدفئة خلال ساعات الليل؟",
      "timelineInfo": "الساعة 1:25 ص: إصلاح صمام شبكة التدفئة في عنبر المحركات بواسطة بوريس.",
      "relatedCharacters": [
        "بوريس",
        "نادية"
      ]
    },
    {
      "id": "ev_arctic_4",
      "title": "التقرير الكيميائي المعارض للنظرية المناخية",
      "description": "مسودة التحليل الأولي لعينة الجليد تتضمن قراءات لنظائر الكربون تختلف عن النماذج المناخية المنشورة سابقاً في دراسات المركز.",
      "publicClue": "مسودة التقرير تشير إلى تباين في نتائج قياس النظائر مقارنة بالأبحاث السابقة.",
      "category": "motive",
      "availableFromRound": 2,
      "discussionPrompt": "كيف تؤثر نتائج قياس النظائر الجديدة على الفرضيات العلمية المعتمدة في المحطة؟",
      "timelineInfo": "مساء الأمس: اكتمال قراءة النظائر في مسودة التحليل الأولي.",
      "relatedCharacters": [
        "د. مروان",
        "د. إيلينا"
      ]
    },
    {
      "id": "ev_arctic_5",
      "title": "سجل فتح بوابة برج الأرصاد المعزول",
      "description": "حساس بوابة برج الأرصاد يُظهر بقاء البوابة الخارجية مغلقة بإحكام ومغطاة بالجليد دون أي تسجيل لعمليات فتح بين منتصف الليل والساعة 6:00 ص.",
      "publicClue": "السجل الرقمي لبوابة برج الأرصاد يُبين عدم فتح البوابة وبقاءها مغلقة طوال الفترة بين منتصف الليل و 6:00 ص.",
      "category": "timeline",
      "availableFromRound": 3,
      "discussionPrompt": "كيف تتوافق بيانات حساسات بوابة برج الأرصاد مع خطط الأنشطة الليلية في المحطة؟",
      "timelineInfo": "من منتصف الليل حتى 6:00 ص: بقاء بوابة برج الأرصاد العلوية مغلقة دون تسجيل أي حركة فتح.",
      "relatedCharacters": [
        "د. مروان"
      ]
    },
    {
      "id": "ev_arctic_station_6",
      "title": "تقرير المعاينة التكميلي رقم 6",
      "description": "تقرير فني موثق من موقع الحادثة يوضح مسار الحركة والمعدات في مسرح الواقعة (محطة أبحاث قطبية معزولة وسط عاصفة ثلجية عاتية تحاصر الفريق داخل المجمع.).",
      "publicClue": "أظهرت المعاينة الفنية تفاصيل موثقة حول التحركات والمعدات المستخدمة في الموقع عند الواقعة.",
      "category": "physical",
      "availableFromRound": 3,
      "discussionPrompt": "كيف تفسر الأطراف المعنية المؤشرات الجنائية المرصودة في هذا البند الفني؟",
      "timelineInfo": "تسجيل المؤشر الفني رقم #6 في مسرح القضية.",
      "associatedSuspect": "د. مروان",
      "relatedCharacters": [
        "د. مروان"
      ],
      "titleEn": "Supplemental Inspection Item #6",
      "descriptionEn": "Official technical record detailing physical traces and movements at the scene (محطة الجليد الأخير).",
      "publicClueEn": "Technical inspection revealed documented indicators regarding movement and equipment.",
      "discussionPromptEn": "How do the relevant persons account for the technical findings recorded in this item?"
    },
    {
      "id": "ev_arctic_station_7",
      "title": "تقرير المعاينة التكميلي رقم 7",
      "description": "تقرير فني موثق من موقع الحادثة يوضح مسار الحركة والمعدات في مسرح الواقعة (محطة أبحاث قطبية معزولة وسط عاصفة ثلجية عاتية تحاصر الفريق داخل المجمع.).",
      "publicClue": "أظهرت المعاينة الفنية تفاصيل موثقة حول التحركات والمعدات المستخدمة في الموقع عند الواقعة.",
      "category": "document",
      "availableFromRound": 3,
      "discussionPrompt": "كيف تفسر الأطراف المعنية المؤشرات الجنائية المرصودة في هذا البند الفني؟",
      "timelineInfo": "تسجيل المؤشر الفني رقم #7 في مسرح القضية.",
      "associatedSuspect": "ديمتري",
      "relatedCharacters": [
        "ديمتري"
      ],
      "titleEn": "Supplemental Inspection Item #7",
      "descriptionEn": "Official technical record detailing physical traces and movements at the scene (محطة الجليد الأخير).",
      "publicClueEn": "Technical inspection revealed documented indicators regarding movement and equipment.",
      "discussionPromptEn": "How do the relevant persons account for the technical findings recorded in this item?"
    },
    {
      "id": "ev_arctic_station_8",
      "title": "تقرير المعاينة التكميلي رقم 8",
      "description": "تقرير فني موثق من موقع الحادثة يوضح مسار الحركة والمعدات في مسرح الواقعة (محطة أبحاث قطبية معزولة وسط عاصفة ثلجية عاتية تحاصر الفريق داخل المجمع.).",
      "publicClue": "أظهرت المعاينة الفنية تفاصيل موثقة حول التحركات والمعدات المستخدمة في الموقع عند الواقعة.",
      "category": "witness",
      "availableFromRound": 3,
      "discussionPrompt": "كيف تفسر الأطراف المعنية المؤشرات الجنائية المرصودة في هذا البند الفني؟",
      "timelineInfo": "تسجيل المؤشر الفني رقم #8 في مسرح القضية.",
      "associatedSuspect": "كاتيا",
      "relatedCharacters": [
        "كاتيا"
      ],
      "titleEn": "Supplemental Inspection Item #8",
      "descriptionEn": "Official technical record detailing physical traces and movements at the scene (محطة الجليد الأخير).",
      "publicClueEn": "Technical inspection revealed documented indicators regarding movement and equipment.",
      "discussionPromptEn": "How do the relevant persons account for the technical findings recorded in this item?"
    },
    {
      "id": "ev_arctic_station_9",
      "title": "تقرير المعاينة التكميلي رقم 9",
      "description": "تقرير فني موثق من موقع الحادثة يوضح مسار الحركة والمعدات في مسرح الواقعة (محطة أبحاث قطبية معزولة وسط عاصفة ثلجية عاتية تحاصر الفريق داخل المجمع.).",
      "publicClue": "أظهرت المعاينة الفنية تفاصيل موثقة حول التحركات والمعدات المستخدمة في الموقع عند الواقعة.",
      "category": "timeline",
      "availableFromRound": 4,
      "discussionPrompt": "كيف تفسر الأطراف المعنية المؤشرات الجنائية المرصودة في هذا البند الفني؟",
      "timelineInfo": "تسجيل المؤشر الفني رقم #9 في مسرح القضية.",
      "associatedSuspect": "د. مروان",
      "relatedCharacters": [
        "د. مروان"
      ],
      "titleEn": "Supplemental Inspection Item #9",
      "descriptionEn": "Official technical record detailing physical traces and movements at the scene (محطة الجليد الأخير).",
      "publicClueEn": "Technical inspection revealed documented indicators regarding movement and equipment.",
      "discussionPromptEn": "How do the relevant persons account for the technical findings recorded in this item?"
    },
    {
      "id": "ev_arctic_station_10",
      "title": "تقرير المعاينة التكميلي رقم 10",
      "description": "تقرير فني موثق من موقع الحادثة يوضح مسار الحركة والمعدات في مسرح الواقعة (محطة أبحاث قطبية معزولة وسط عاصفة ثلجية عاتية تحاصر الفريق داخل المجمع.).",
      "publicClue": "أظهرت المعاينة الفنية تفاصيل موثقة حول التحركات والمعدات المستخدمة في الموقع عند الواقعة.",
      "category": "motive",
      "availableFromRound": 4,
      "discussionPrompt": "كيف تفسر الأطراف المعنية المؤشرات الجنائية المرصودة في هذا البند الفني؟",
      "timelineInfo": "تسجيل المؤشر الفني رقم #10 في مسرح القضية.",
      "associatedSuspect": "ديمتري",
      "relatedCharacters": [
        "ديمتري"
      ],
      "titleEn": "Supplemental Inspection Item #10",
      "descriptionEn": "Official technical record detailing physical traces and movements at the scene (محطة الجليد الأخير).",
      "publicClueEn": "Technical inspection revealed documented indicators regarding movement and equipment.",
      "discussionPromptEn": "How do the relevant persons account for the technical findings recorded in this item?"
    },
    {
      "id": "ev_arctic_station_11",
      "title": "تقرير المعاينة التكميلي رقم 11",
      "description": "تقرير فني موثق من موقع الحادثة يوضح مسار الحركة والمعدات في مسرح الواقعة (محطة أبحاث قطبية معزولة وسط عاصفة ثلجية عاتية تحاصر الفريق داخل المجمع.).",
      "publicClue": "أظهرت المعاينة الفنية تفاصيل موثقة حول التحركات والمعدات المستخدمة في الموقع عند الواقعة.",
      "category": "physical",
      "availableFromRound": 4,
      "discussionPrompt": "كيف تفسر الأطراف المعنية المؤشرات الجنائية المرصودة في هذا البند الفني؟",
      "timelineInfo": "تسجيل المؤشر الفني رقم #11 في مسرح القضية.",
      "associatedSuspect": "كاتيا",
      "relatedCharacters": [
        "كاتيا"
      ],
      "titleEn": "Supplemental Inspection Item #11",
      "descriptionEn": "Official technical record detailing physical traces and movements at the scene (محطة الجليد الأخير).",
      "publicClueEn": "Technical inspection revealed documented indicators regarding movement and equipment.",
      "discussionPromptEn": "How do the relevant persons account for the technical findings recorded in this item?"
    },
    {
      "id": "ev_arctic_station_12",
      "title": "تقرير المعاينة التكميلي رقم 12",
      "description": "تقرير فني موثق من موقع الحادثة يوضح مسار الحركة والمعدات في مسرح الواقعة (محطة أبحاث قطبية معزولة وسط عاصفة ثلجية عاتية تحاصر الفريق داخل المجمع.).",
      "publicClue": "أظهرت المعاينة الفنية تفاصيل موثقة حول التحركات والمعدات المستخدمة في الموقع عند الواقعة.",
      "category": "document",
      "availableFromRound": 4,
      "discussionPrompt": "كيف تفسر الأطراف المعنية المؤشرات الجنائية المرصودة في هذا البند الفني؟",
      "timelineInfo": "تسجيل المؤشر الفني رقم #12 في مسرح القضية.",
      "associatedSuspect": "د. مروان",
      "relatedCharacters": [
        "د. مروان"
      ],
      "titleEn": "Supplemental Inspection Item #12",
      "descriptionEn": "Official technical record detailing physical traces and movements at the scene (محطة الجليد الأخير).",
      "publicClueEn": "Technical inspection revealed documented indicators regarding movement and equipment.",
      "discussionPromptEn": "How do the relevant persons account for the technical findings recorded in this item?"
    }
  ],
  "solution": "قام د. مروان بالتسلل إلى القبو التجميدي مستخدماً مبضعاً جراحياً لقطع خط التبريد وتشغيل السخان لإذابة أسطوانة الجليد التاريخية قبل فحصها لمنع دحض نظريته المناخية، مدعياً التواجد في برج الأرصاد الذي أثبتت السجلات الرقمية تجمد بوابته وعدم فتحها طوال الليل."
};
