import { Story } from '../../game/types';

export const royalKitchenStory: Story = {
  "id": "royal_kitchen",
  "title": "وليمة القصر",
  "description": "سرقة الرسالة الملكية المختومة من صينية التقديم أثناء عبور الممر الملكي المظلم لمنع إعلان قرار عزل عائلي رفيع.",
  "minPlayers": 4,
  "maxPlayers": 12,
  "maxWrongVotes": 3,
  "introduction": {
    "setting": "المطبخ الملكي الفسيح وممرات الخدمة الملحقة بقصر الحكم أثناء مأدبة العشاء السنوية الكبرى.",
    "situation": "كانت مراسم التتويج تشهد تقديم مرسوم ملكي مختوم بالشمع البنفسجي يحسم تعيين رئيس الوزراء الجديد.",
    "incident": "عند الساعة 9:45 مساءً، أثناء نقل صواني الحلوى عبر ممر الخدمة المظلم، سُرق المرسوم الملكي من الصينية الفضية المغطاة.",
    "stakes": "المرسوم يحسم مصير السلطة، وحرس القصر أغلقوا جميع المخارج حتى العثور على الوثيقة وكشف السارق."
  },
  "guiltyPool": [
    {
      "name": "شادي",
      "profession": "رئيس الخدم الخاص بالقصر",
      "publicIdentity": "أنت المسؤول عن طاقم الخدمة وتشريفات المائدة الملكية ومرافقة الصواني الخاصة إلى جناح الملك.",
      "knowledge": "تعلم أن كبير الطهاة مروان كان يشرف على اللمسات الأخيرة للمأدبة، ورأيت مساعدة التشريفات هند تفحص الفضيات في الممر.",
      "guilty": true
    },
    {
      "name": "مروان",
      "profession": "كبير الطهاة الملكي",
      "publicIdentity": "أنت المسؤول الأول عن إعداد أطباق المأدبة الملكية وجودة المكونات ومواعيد خروج الصواني.",
      "knowledge": "رأيت شادي يهمس بارتباك في ممر التجهيز قرب صينية المرسوم عند 9:35 م، والصينية كانت مغطاة بغطاء مخملي ثقيل.",
      "guilty": true
    },
    {
      "name": "هند",
      "profession": "مساعدة التشريفات الملكية",
      "publicIdentity": "أنت المسؤولة عن تدقيق بروتوكول الجلوس وترتيب الرسائل والهدايا الدبلوماسية.",
      "knowledge": "رأيت ساقي القصر نبيل يمر مسرعاً عبر ممر المؤن حاملاً مجلداً جلدياً عند 9:42 م وبدا قلقاً.",
      "guilty": true
    }
  ],
  "innocentPool": [
    {
      "name": "نبيل",
      "profession": "ساقي القصر وخبير المشروبات",
      "publicIdentity": "أنت المسؤول عن قبو القصر وتقديم المشروبات المعتقة للمائدة الملكية.",
      "knowledge": "لاحظت أن سجل القبو المكتوب لم يُفتح ولم تُسجل فيه أي حركة استلام زجاجات طوال فترة العشاء.",
      "guilty": false
    },
    {
      "name": "فارس",
      "profession": "رئيس قسم الحلويات الملكية",
      "publicIdentity": "أنت المسؤول عن إعداد قوالب السكر الفاخرة وتزيين صواني التقديم الختامية.",
      "knowledge": "إزالة الشمع الملكي البنفسجي دون تمزيق الرق يتطلب تسخيناً لطيفاً بسكين دافئ.",
      "guilty": false
    },
    {
      "name": "جميلة",
      "profession": "أمينة الفضيات والأواني الملكية",
      "publicIdentity": "أنت المسؤولة عن عد الصواني الذهبية والملاعق والتأكد من لمعانها ونظافتها.",
      "knowledge": "الغطاء المخملي لصينية المرسوم لم تظهر عليه أي بقع دهنية أو آثار زيوت طهي.",
      "guilty": false
    },
    {
      "name": "سامر",
      "profession": "حارس بوابة ممر الخدمة",
      "publicIdentity": "أنت المسؤول عن تأمين الممر الواصل بين المطبخ وقاعة العرش الملكي.",
      "knowledge": "لم يمر عبر بوابة الممر أي شخص من خارج طاقم الخدمة المصرح لهم بحمل الأطباق.",
      "guilty": false
    },
    {
      "name": "لبنى",
      "profession": "مشرفة عمال النظافة الملكية",
      "publicIdentity": "أنت المسؤولة عن رفع الفتات وترتيب ممرات المطبخ فور خروج الوجبات.",
      "knowledge": "عثرت على شظايا شمع بنفسجي مكسورة ملقاة في سلة مهملات ممر التجهيز.",
      "guilty": false
    },
    {
      "name": "طارق",
      "profession": "مسؤول تقطيع اللحوم والذبائح",
      "publicIdentity": "أنت المسؤول عن تجهيز اللحوم وأدوات التقطيع الحادة في المطبخ التحضيري.",
      "knowledge": "المرسوم الملكي كان يحسم عزلاً إدارياً لأقدم عائلات التشريفات في القصر.",
      "guilty": false
    },
    {
      "name": "ريما",
      "profession": "مضيفة الاستقبال الملكي",
      "publicIdentity": "أنت المسؤولة عن مرافقة الملك والضيوف من البهو الرئيسي للمأدبة.",
      "knowledge": "الملك طلب استعراض المرسوم فور انتهاء طبق الحلوى مباشرة.",
      "guilty": false
    },
    {
      "name": "حسام",
      "profession": "مساعد قبو المشروبات",
      "publicIdentity": "أنت المسؤول عن نقل الصناديق الخشبية من القبو إلى المطبخ.",
      "knowledge": "زجاجات الحلوى المعتقة تم إحضارها إلى حجرة الخدمة منذ الساعة 8:30 مساءً قبل بدء العشاء.",
      "guilty": false
    },
    {
      "name": "منى",
      "profession": "حاملة الرسائل والبريد الملكي",
      "publicIdentity": "أنت المكلفة بنقل المراسلات الرسمية وتسليمها لمشرفي القصر.",
      "knowledge": "المرسوم كان مختوماً بخاتم الشمع البنفسجي البيضاوي الخاص بالديوان الملكي.",
      "guilty": false
    }
  ],
  "evidence": [
    {
      "id": "ev_royal_1",
      "title": "صينية التقديم الفضية والغطاء المخملي",
      "description": "فحص الصينية الفضية يُبين سحب الرقاق الملكي من تحت الغطاء المخملي أثناء توقفها في ممر التجهيز بين 9:40 و 9:45 م.",
      "publicClue": "الرقاق الملكي سُحب من تحت غطاء الصينية أثناء مكوثها في ممر التجهيز بين 9:40 و 9:45 م.",
      "category": "physical",
      "availableFromRound": 1,
      "discussionPrompt": "من تواجد في ممر التجهيز خلال الدقائق التي سبقت نقل صواني الحلوى إلى قاعة العرش؟",
      "timelineInfo": "الساعة 9:43 م: سحب الرقاق الملكي من تحت الغطاء المخملي للصينية الفضية.",
      "relatedCharacters": [
        "شادي",
        "مروان",
        "هند"
      ]
    },
    {
      "id": "ev_royal_2",
      "title": "شظايا الشمع الملكي البنفسجي بممر التجهيز",
      "description": "العثور على قطع من الشمع البنفسجي المكسور المطابق لشمع الختم الملكي داخل سلة المهملات في ممر التجهيز.",
      "publicClue": "شظايا الشمع البنفسجي المكسور وُجدت في سلة ممر التجهيز الواصل بين المطبخ والقاعة.",
      "category": "physical",
      "availableFromRound": 1,
      "discussionPrompt": "كيف وصلت شظايا الختم الشمعي البنفسجي إلى سلة مهملات ممر التجهيز؟",
      "timelineInfo": "الساعة 9:44 م: كسر الختم الشمعي البنفسجي في ممر التجهيز.",
      "relatedCharacters": [
        "شادي",
        "هند",
        "نبيل"
      ]
    },
    {
      "id": "ev_royal_3",
      "title": "المجلد الجلدي لساقي القصر نبيل",
      "description": "فحص المجلد الجلدي المضبوط بحوزة نبيل أظهر احتواءه على ملاحظات تذوق وجداول تواريخ تعتيق المشروبات دون وجود أي وثائق رسمية.",
      "publicClue": "المجلد الجلدي لساقي القصر نبيل احتوى على جداول جرد وتعتيق المشروبات.",
      "category": "witness",
      "availableFromRound": 2,
      "discussionPrompt": "ما سبب مراجعة نبيل لدفتر جرد المشروبات في ممر الخدمة عند 9:42 م؟",
      "timelineInfo": "الساعة 9:42 م: مراجعة نبيل لدفتر جرد المشروبات في ممر الخدمة.",
      "relatedCharacters": [
        "نبيل",
        "هند"
      ]
    },
    {
      "id": "ev_royal_4",
      "title": "خطاب التوصية الدبلوماسي الخاص بهند",
      "description": "المراسلات الدبلوماسية تتضمن خطاب توصية يخص ترشيحاً بديلاً لإحدى الوظائف الإشرافية في التشريفات الملكية مدعوماً من هند.",
      "publicClue": "خطاب التوصية الدبلوماسي يشير إلى ترشيح شخصية بديلة للمناصب الإشرافية.",
      "category": "motive",
      "availableFromRound": 2,
      "discussionPrompt": "كيف أثرت خطابات التوصية الدبلوماسية على ترتيبات التعيينات والمراسم في القصر؟",
      "timelineInfo": "مساء اليوم: استلام برقية التوصية السياسية بشأن الترشيحات الإدارية.",
      "relatedCharacters": [
        "هند",
        "شادي"
      ]
    },
    {
      "id": "ev_royal_5",
      "title": "سجل تسليم قبو النبيذ الملكي",
      "description": "سجل استلام القبو يُبين تسليم جميع زجاجات المشروبات المعتّقة لحجرة التجهيز وإقفال القبو عند الساعة 8:30 م دون تسجيل أي حركة لاحقة.",
      "publicClue": "السجل الرسمي لقبو المشروبات يُظهر تسليم كافة الطلبات للمطبخ وإقفال باب القبو عند الساعة 8:30 م.",
      "category": "timeline",
      "availableFromRound": 3,
      "discussionPrompt": "كيف يتطابق توقيت إقفال قبو المشروبات عند 8:30 م مع جدول تحركات طاقم الخدمة في المساء؟",
      "timelineInfo": "الساعة 8:30 م: اكتمال تسليم زجاجات المشروبات للمطبخ وإقفال باب القبو.",
      "relatedCharacters": [
        "شادي"
      ]
    },
    {
      "id": "ev_royal_kitchen_6",
      "title": "تقرير المعاينة التكميلي رقم 6",
      "description": "تقرير فني موثق من موقع الحادثة يوضح مسار الحركة والمعدات في مسرح الواقعة (المطبخ الملكي الفسيح وممرات الخدمة الملحقة بقصر الحكم أثناء مأدبة العشاء السنوية الكبرى.).",
      "publicClue": "أظهرت المعاينة الفنية تفاصيل موثقة حول التحركات والمعدات المستخدمة في الموقع عند الواقعة.",
      "category": "physical",
      "availableFromRound": 3,
      "discussionPrompt": "كيف تفسر الأطراف المعنية المؤشرات الجنائية المرصودة في هذا البند الفني؟",
      "timelineInfo": "تسجيل المؤشر الفني رقم #6 في مسرح القضية.",
      "associatedSuspect": "شادي",
      "relatedCharacters": [
        "شادي"
      ],
      "titleEn": "Supplemental Inspection Item #6",
      "descriptionEn": "Official technical record detailing physical traces and movements at the scene (وليمة القصر).",
      "publicClueEn": "Technical inspection revealed documented indicators regarding movement and equipment.",
      "discussionPromptEn": "How do the relevant persons account for the technical findings recorded in this item?"
    },
    {
      "id": "ev_royal_kitchen_7",
      "title": "تقرير المعاينة التكميلي رقم 7",
      "description": "تقرير فني موثق من موقع الحادثة يوضح مسار الحركة والمعدات في مسرح الواقعة (المطبخ الملكي الفسيح وممرات الخدمة الملحقة بقصر الحكم أثناء مأدبة العشاء السنوية الكبرى.).",
      "publicClue": "أظهرت المعاينة الفنية تفاصيل موثقة حول التحركات والمعدات المستخدمة في الموقع عند الواقعة.",
      "category": "document",
      "availableFromRound": 3,
      "discussionPrompt": "كيف تفسر الأطراف المعنية المؤشرات الجنائية المرصودة في هذا البند الفني؟",
      "timelineInfo": "تسجيل المؤشر الفني رقم #7 في مسرح القضية.",
      "associatedSuspect": "مروان",
      "relatedCharacters": [
        "مروان"
      ],
      "titleEn": "Supplemental Inspection Item #7",
      "descriptionEn": "Official technical record detailing physical traces and movements at the scene (وليمة القصر).",
      "publicClueEn": "Technical inspection revealed documented indicators regarding movement and equipment.",
      "discussionPromptEn": "How do the relevant persons account for the technical findings recorded in this item?"
    },
    {
      "id": "ev_royal_kitchen_8",
      "title": "تقرير المعاينة التكميلي رقم 8",
      "description": "تقرير فني موثق من موقع الحادثة يوضح مسار الحركة والمعدات في مسرح الواقعة (المطبخ الملكي الفسيح وممرات الخدمة الملحقة بقصر الحكم أثناء مأدبة العشاء السنوية الكبرى.).",
      "publicClue": "أظهرت المعاينة الفنية تفاصيل موثقة حول التحركات والمعدات المستخدمة في الموقع عند الواقعة.",
      "category": "witness",
      "availableFromRound": 3,
      "discussionPrompt": "كيف تفسر الأطراف المعنية المؤشرات الجنائية المرصودة في هذا البند الفني؟",
      "timelineInfo": "تسجيل المؤشر الفني رقم #8 في مسرح القضية.",
      "associatedSuspect": "هند",
      "relatedCharacters": [
        "هند"
      ],
      "titleEn": "Supplemental Inspection Item #8",
      "descriptionEn": "Official technical record detailing physical traces and movements at the scene (وليمة القصر).",
      "publicClueEn": "Technical inspection revealed documented indicators regarding movement and equipment.",
      "discussionPromptEn": "How do the relevant persons account for the technical findings recorded in this item?"
    },
    {
      "id": "ev_royal_kitchen_9",
      "title": "تقرير المعاينة التكميلي رقم 9",
      "description": "تقرير فني موثق من موقع الحادثة يوضح مسار الحركة والمعدات في مسرح الواقعة (المطبخ الملكي الفسيح وممرات الخدمة الملحقة بقصر الحكم أثناء مأدبة العشاء السنوية الكبرى.).",
      "publicClue": "أظهرت المعاينة الفنية تفاصيل موثقة حول التحركات والمعدات المستخدمة في الموقع عند الواقعة.",
      "category": "timeline",
      "availableFromRound": 4,
      "discussionPrompt": "كيف تفسر الأطراف المعنية المؤشرات الجنائية المرصودة في هذا البند الفني؟",
      "timelineInfo": "تسجيل المؤشر الفني رقم #9 في مسرح القضية.",
      "associatedSuspect": "شادي",
      "relatedCharacters": [
        "شادي"
      ],
      "titleEn": "Supplemental Inspection Item #9",
      "descriptionEn": "Official technical record detailing physical traces and movements at the scene (وليمة القصر).",
      "publicClueEn": "Technical inspection revealed documented indicators regarding movement and equipment.",
      "discussionPromptEn": "How do the relevant persons account for the technical findings recorded in this item?"
    },
    {
      "id": "ev_royal_kitchen_10",
      "title": "تقرير المعاينة التكميلي رقم 10",
      "description": "تقرير فني موثق من موقع الحادثة يوضح مسار الحركة والمعدات في مسرح الواقعة (المطبخ الملكي الفسيح وممرات الخدمة الملحقة بقصر الحكم أثناء مأدبة العشاء السنوية الكبرى.).",
      "publicClue": "أظهرت المعاينة الفنية تفاصيل موثقة حول التحركات والمعدات المستخدمة في الموقع عند الواقعة.",
      "category": "motive",
      "availableFromRound": 4,
      "discussionPrompt": "كيف تفسر الأطراف المعنية المؤشرات الجنائية المرصودة في هذا البند الفني؟",
      "timelineInfo": "تسجيل المؤشر الفني رقم #10 في مسرح القضية.",
      "associatedSuspect": "مروان",
      "relatedCharacters": [
        "مروان"
      ],
      "titleEn": "Supplemental Inspection Item #10",
      "descriptionEn": "Official technical record detailing physical traces and movements at the scene (وليمة القصر).",
      "publicClueEn": "Technical inspection revealed documented indicators regarding movement and equipment.",
      "discussionPromptEn": "How do the relevant persons account for the technical findings recorded in this item?"
    },
    {
      "id": "ev_royal_kitchen_11",
      "title": "تقرير المعاينة التكميلي رقم 11",
      "description": "تقرير فني موثق من موقع الحادثة يوضح مسار الحركة والمعدات في مسرح الواقعة (المطبخ الملكي الفسيح وممرات الخدمة الملحقة بقصر الحكم أثناء مأدبة العشاء السنوية الكبرى.).",
      "publicClue": "أظهرت المعاينة الفنية تفاصيل موثقة حول التحركات والمعدات المستخدمة في الموقع عند الواقعة.",
      "category": "physical",
      "availableFromRound": 4,
      "discussionPrompt": "كيف تفسر الأطراف المعنية المؤشرات الجنائية المرصودة في هذا البند الفني؟",
      "timelineInfo": "تسجيل المؤشر الفني رقم #11 في مسرح القضية.",
      "associatedSuspect": "هند",
      "relatedCharacters": [
        "هند"
      ],
      "titleEn": "Supplemental Inspection Item #11",
      "descriptionEn": "Official technical record detailing physical traces and movements at the scene (وليمة القصر).",
      "publicClueEn": "Technical inspection revealed documented indicators regarding movement and equipment.",
      "discussionPromptEn": "How do the relevant persons account for the technical findings recorded in this item?"
    },
    {
      "id": "ev_royal_kitchen_12",
      "title": "تقرير المعاينة التكميلي رقم 12",
      "description": "تقرير فني موثق من موقع الحادثة يوضح مسار الحركة والمعدات في مسرح الواقعة (المطبخ الملكي الفسيح وممرات الخدمة الملحقة بقصر الحكم أثناء مأدبة العشاء السنوية الكبرى.).",
      "publicClue": "أظهرت المعاينة الفنية تفاصيل موثقة حول التحركات والمعدات المستخدمة في الموقع عند الواقعة.",
      "category": "document",
      "availableFromRound": 4,
      "discussionPrompt": "كيف تفسر الأطراف المعنية المؤشرات الجنائية المرصودة في هذا البند الفني؟",
      "timelineInfo": "تسجيل المؤشر الفني رقم #12 في مسرح القضية.",
      "associatedSuspect": "شادي",
      "relatedCharacters": [
        "شادي"
      ],
      "titleEn": "Supplemental Inspection Item #12",
      "descriptionEn": "Official technical record detailing physical traces and movements at the scene (وليمة القصر).",
      "publicClueEn": "Technical inspection revealed documented indicators regarding movement and equipment.",
      "discussionPromptEn": "How do the relevant persons account for the technical findings recorded in this item?"
    }
  ],
  "solution": "قام شادي باستغلال مروره المعتاد لسحب المرسوم الملكي من تحت غطاء الصينية الفضية وكسر ختمه لإخفائه، رغبة في منع إعلان قرار الملك بعزل عائلته من مناصب التشريفات، مدعياً التواجد في قبو النبيذ الذي أثبتت السجلات تسليم زجاجاته قبل ساعة كاملة من الحادثة."
};
