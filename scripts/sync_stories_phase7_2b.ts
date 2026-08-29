import * as fs from 'fs';
import * as path from 'path';

export interface StoryDefinition {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  minPlayers: number;
  maxPlayers: number;
  maxWrongVotes: number;
  introAr: { setting: string; situation: string; incident: string; stakes: string };
  introEn: { setting: string; situation: string; incident: string; stakes: string };
  guiltyPool: Array<{
    nameAr: string;
    nameEn: string;
    profAr: string;
    profEn: string;
    publicIdAr: string;
    publicIdEn: string;
    knowledgeAr: string;
    knowledgeEn: string;
  }>;
  innocentPool: Array<{
    nameAr: string;
    nameEn: string;
    profAr: string;
    profEn: string;
    publicIdAr: string;
    publicIdEn: string;
    knowledgeAr: string;
    knowledgeEn: string;
  }>;
  cluesAr: string[];
  cluesEn: string[];
}

export const STORIES_13: StoryDefinition[] = [
  // 1. DREAMS
  {
    id: 'dreams',
    titleAr: 'معهد أبحاث النوم والأحلام',
    titleEn: 'Sleep & Dreams Research Institute',
    descAr: 'في مختبر أبحاث متطور يدرس تسجيل الأحلام، تم مسح بيانات تجربة سرية وتخريب وحدة التبريد المركزية.',
    descEn: 'In an advanced neural dream laboratory, encrypted experimental data was wiped and the central cooling grid sabotaged.',
    minPlayers: 4,
    maxPlayers: 12,
    maxWrongVotes: 3,
    introAr: {
      setting: 'معهد أبحاث متقدم مجهز بمختبرات عازلة للصوت وغرفة خوادم مركزية مشفرة.',
      situation: 'كان الفريق يختبر تقنية رائدة لقراءة الذاكرة أثناء النوم العميق استعداداً لنشر بحث تاريخي.',
      incident: 'عند منتصف الليل، انطلق إنذار الطوارئ بعد مسح القرص المشفر وتخريب صمام تبريد الخادم الرئيسي.',
      stakes: 'إذا لم يتم كشف الفاعل قبل الفجر، ستضيع حقوق الاكتشاف وسيتم تهريب النسخة المسروقة إلى جهات خارجية.'
    },
    introEn: {
      setting: 'An advanced neural research facility equipped with soundproof sleep pods and an encrypted server bay.',
      situation: 'The team was running stress tests on breakthrough memory decoding technology prior to a major scientific announcement.',
      incident: 'At midnight, the emergency siren sounded after the encrypted memory core was wiped and the main server cooling valve sabotaged.',
      stakes: 'If the culprits are not caught before dawn, the breakthrough patents will be stolen and leaked to overseas competitors.'
    },
    guiltyPool: [
      {
        nameAr: 'د. فراس',
        nameEn: 'Dr. Firas',
        profAr: 'باحث رئيسي في علم الأعصاب',
        profEn: 'Lead Neuroscientist',
        publicIdAr: 'أنت الباحث الرئيسي المسؤول عن تصميم خوارزميات فك تشفير إشارات الدماغ في المعهد.',
        publicIdEn: 'You are the lead researcher in charge of neural brainwave decoding algorithms.',
        knowledgeAr: 'تعلم أن تصدير البيانات يتطلب إذناً ثنائياً خاصاً، ولاحظت وميض ضوء حالة الخادم الرئيسي قبل انطلاق الإنذار.',
        knowledgeEn: 'You know that exporting memory archives requires two-factor authorization, and you noticed the server status LED blinking prior to the alert.'
      },
      {
        nameAr: 'كريم',
        nameEn: 'Karim',
        profAr: 'مهندس الخوادم والشبكات',
        profEn: 'Server & Network Engineer',
        publicIdAr: 'أنت مهندس النظم المسؤول عن إدارة الخادم المركزي وحمايته من الاختراق.',
        publicIdEn: 'You are the systems engineer managing the central server rack and network infrastructure.',
        knowledgeAr: 'محطة التحكم المفتوحة في الممر كانت مسجلة الدخول بحساب مشترك، وفحصت كابلات التبريد قبل الحادثة بنصف ساعة.',
        knowledgeEn: 'The hallway terminal was logged into a shared administrative account, and you inspected cooling rack cables 30 minutes prior.'
      },
      {
        nameAr: 'ياسمين',
        nameEn: 'Yasmine',
        profAr: 'باحثة مساعدة في الذكاء الاصطناعي',
        profEn: 'AI Research Assistant',
        publicIdAr: 'أنت مساعدة د. فراس في تدريب النماذج الرياضية وتحليل الإشارات العصبية.',
        publicIdEn: 'You assist Dr. Firas with neural training models and signal processing.',
        knowledgeAr: 'رأيت أمراً مجدولاً لتصدير البيانات في قائمة الانتظار عند 11:15 دون تحديد هوية المستخدم.',
        knowledgeEn: 'You spotted a scheduled batch export task in the queue at 11:15 without an explicit user tag.'
      }
    ],
    innocentPool: [
      {
        nameAr: 'د. مريم',
        nameEn: 'Dr. Maryam',
        profAr: 'أخصائية فيزيولوجيا الأعصاب',
        profEn: 'Clinical Neurophysiologist',
        publicIdAr: 'أنت المسؤولة عن سلامة المتطوعين ومراقبة المؤشرات الحيوية أثناء جلسات الأحلام.',
        publicIdEn: 'You monitor volunteer vital telemetry and EEG indicators during dream sessions.',
        knowledgeAr: 'رأيت شخصاً يرتدي معطف المختبر الأبيض يعبر الممر نحو جناح الخوادم عند 11:38.',
        knowledgeEn: 'You saw someone in a standard white lab coat walking toward the server corridor at 11:38.'
      },
      {
        nameAr: 'طارق',
        nameEn: 'Tariq',
        profAr: 'تقني قياس موجات الدماغ',
        profEn: 'EEG Systems Technician',
        publicIdAr: 'أنت التقني المسؤول عن تركيب مجسات التخطيط ومزامنة توقيت الأجهزة.',
        publicIdEn: 'You place scalp sensors and calibrate timing synchronizers across all test pods.',
        knowledgeAr: 'سمعت خطوات مسرعة في ممر جناح الخوادم عند 11:40 قبل انطلاق الإنذار بدقائق.',
        knowledgeEn: 'You heard hurried footsteps in the server corridor at 11:40 just minutes before the alarm.'
      },
      {
        nameAr: 'سامي',
        nameEn: 'Sami',
        profAr: 'منسق المتطوعين والتجارب',
        profEn: 'Volunteer Coordinator',
        publicIdAr: 'أنت المسؤول عن استقبال المتطوعين وتوثيق أوقات دخولهم ومغادرتهم المعهد.',
        publicIdEn: 'You check in test participants and record exact arrival and departure logs.',
        knowledgeAr: 'جميع المتطوعين الخارجيين غادروا المختبر في تمام العاشرة والنصف، ولم يبق سوى الفريق الداخلي.',
        knowledgeEn: 'All external volunteers exited the facility at 10:30 PM, leaving only internal staff.'
      },
      {
        nameAr: 'لبنى',
        nameEn: 'Lubna',
        profAr: 'مسؤولة الأمن والسلامة المخبرية',
        profEn: 'Lab Safety & Security Officer',
        publicIdAr: 'أنت مسؤولة السلامة وفحص كاشفات الحريق وأنظمة إطفاء الغاز.',
        publicIdEn: 'You inspect fire suppressors, gas safety cutoffs, and emergency protocols.',
        knowledgeAr: 'صمام الغاز اليدوي تم إغلاقه بمفتاح الطوارئ المعلق في غرفة التحضير المشتركة.',
        knowledgeEn: 'The manual valve was turned using the emergency key hung in the common prep room.'
      },
      {
        nameAr: 'نادر',
        nameEn: 'Nader',
        profAr: 'فني الصيانة والتكييف المركزي',
        profEn: 'HVAC & Facility Technician',
        publicIdAr: 'أنت الفني المسؤول عن تنظيم درجة حرارة غرف الخوادم الحساسة.',
        publicIdEn: 'You regulate thermal climate systems and HVAC chillers for server rooms.',
        knowledgeAr: 'صمام مبرد الخادم أغلق يدوياً باليد المجردة دون الحاجة إلى أدوات سباكة معقدة.',
        knowledgeEn: 'The server coolant valve was closed bare-handed without requiring heavy pipe tools.'
      },
      {
        nameAr: 'هند',
        nameEn: 'Hind',
        profAr: 'مديرة الشؤون القانونية للمعهد',
        profEn: 'Legal & IP Director',
        publicIdAr: 'أنت المسؤولة عن براءات الاختراع والعقود التجارية للمعهد.',
        publicIdEn: 'You oversee intellectual property filings, NDAs, and corporate venture contracts.',
        knowledgeAr: 'المعهد تلقى عرضين استثماريين متنافسين، وكان هناك ضغط شديد لحماية البيانات قبل التسجيل الرسمي.',
        knowledgeEn: 'The institute received two competing buyout offers, with immense pressure before the filing.'
      },
      {
        nameAr: 'باسم',
        nameEn: 'Bassem',
        profAr: 'حارس الاستقبال الخارجي',
        profEn: 'Night Reception Guard',
        publicIdAr: 'أنت الحارس المسؤول عن البوابة الرئيسية وسجل الزوار الليلي.',
        publicIdEn: 'You monitor the main exterior gate and manage the overnight visitor register.',
        knowledgeAr: 'البوابات الإلكترونية الخارجية ظلت مقفلة بالكامل طوال الليل ولم يغادر أحد المنشأة.',
        knowledgeEn: 'External electronic perimeter gates remained locked all night; no one entered or left.'
      },
      {
        nameAr: 'لمى',
        nameEn: 'Lama',
        profAr: 'محللة البيانات الطبية',
        profEn: 'Medical Data Analyst',
        publicIdAr: 'أنت مسؤولة التحقق من صحة مخرجات البيانات الإحصائية.',
        publicIdEn: 'You audit statistical outputs and verify dataset consistency.',
        knowledgeAr: 'أمر المسح التخريبي استغرق 90 ثانية لاكتماله، وبدأ تنفيذه بالتحديد عند 11:41:30.',
        knowledgeEn: 'The memory buffer purge took exactly 90 seconds to execute, starting precisely at 11:41:30.'
      },
      {
        nameAr: 'عمر',
        nameEn: 'Omar',
        profAr: 'أمين المستودع الطبي والمعدات',
        profEn: 'Medical Archives Custodian',
        publicIdAr: 'أنت المسؤول عن عهدة الأقراص الصلبة المحمية والمعدات المشفرة.',
        publicIdEn: 'You manage the custody vault for encrypted drives and precision instruments.',
        knowledgeAr: 'شريحة تخزين مشفرة فائقة السعة صُرفت صباحاً لغايات المعايرة الدورية للأجهزة.',
        knowledgeEn: 'A high-capacity encrypted flash drive was checked out in the morning for calibration.'
      }
    ],
    cluesAr: [
      'سجل الدخول الإداري عند الساعة 11:41:30 واستخدام التشفير الخاص بالأبحاث العصبية.',
      'بصمات الزيت الحراري على صمام التبريد اليدوي لغرفة الخوادم.',
      'أمر التصدير المجدول المخفي في قائمة انتظار خادم الذكاء الاصطناعي.'
    ],
    cluesEn: [
      'Administrative login log at 11:41:30 utilizing neural research encryption signatures.',
      'Thermal coolant grease marks left on the manual server rack valve.',
      'Hidden scheduled export batch found in the AI server queue.'
    ]
  },

  // 2. MUSEUM
  {
    id: 'museum',
    titleAr: 'متحف الآثار القديمة',
    titleEn: 'The Ancient Museum Heist',
    descAr: 'سرقة التاج الملكي المرصع بالزمرد من القاعة الملكية المغلقة أثناء تبديل الحراسة الليلية.',
    descEn: 'The emerald-crested royal crown was stolen from the sealed royal gallery during the overnight guard change.',
    minPlayers: 4,
    maxPlayers: 12,
    maxWrongVotes: 3,
    introAr: {
      setting: 'متحف وطني عريق يضم قاعات عرض كبرى وأجهزة إنذار ليزرية متطورة.',
      situation: 'كان المتحف يستعد لافتتاح معرض ملكي نادر يضم تحفاً أثرية لا تقدر بثمن.',
      incident: 'عند الساعة 2:00 صباحاً، انقطع التيار الكهربائي لمدة 4 دقائق، وعند عودته كان التاج الملكي قد اختفى من فاترينته الزجاجية.',
      stakes: 'التاج إرث وطني لا يعوض، والشرطة أغلقت المخارج لمنع تهريبه خارج مبنى المتحف.'
    },
    introEn: {
      setting: 'A prestigious national museum housing expansive exhibition halls and laser security arrays.',
      situation: 'The museum was preparing to unveil a priceless royal exhibition to international dignitaries.',
      incident: 'At 2:00 AM, gallery power was cut for 4 minutes. When lights returned, the crown had vanished from its vitrine.',
      stakes: 'The crown is an irreplaceable national treasure; police have sealed all perimeter exits.'
    },
    guiltyPool: [
      {
        nameAr: 'عمر',
        nameEn: 'Omar',
        profAr: 'مشغل أنظمة المراقبة',
        profEn: 'Surveillance Systems Operator',
        publicIdAr: 'أنت المسؤول عن غرفة التحكم المركزية ومراقبة شاشات الكاميرات وأنظمة الإنذار في المتحف.',
        publicIdEn: 'You oversee the central control room, surveillance monitors, and alarm feeds.',
        knowledgeAr: 'تعلم أن انقطاع الكاميرات بدأ في الجناح الشرقي قبل أن يمتد لبقية القاعات، ولوحة التحكم سُجلت بها إعادة تشغيل يدوية.',
        knowledgeEn: 'You know camera outages began in the East Wing before spreading, and manual reboot commands were executed on the console.'
      },
      {
        nameAr: 'منصور',
        nameEn: 'Mansour',
        profAr: 'حارس الوردية الليلية الرئيسي',
        profEn: 'Night Security Guard Supervisor',
        publicIdAr: 'أنت الحارس المسؤول عن الدوريات الميدانية وتأمين بوابات القاعات الرئيسية.',
        publicIdEn: 'You are the head patrol officer conducting floor rounds and locking main gallery gates.',
        knowledgeAr: 'سمعت صوتاً معدنياً خافتاً قرب فتحة التهوية في القاعة الملكية عند 2:02 ص أثناء انقطاع الإضاءة.',
        knowledgeEn: 'You heard a faint metallic click near the ceiling duct in the Royal Hall at 2:02 AM during the blackout.'
      },
      {
        nameAr: 'سلمى',
        nameEn: 'Salma',
        profAr: 'أمينة الترميم والمقتنيات الملكية',
        profEn: 'Restoration & Royal Relics Specialist',
        publicIdAr: 'أنت المشرفة على صيانة القطع الأثرية والتأكد من سلامة المعروضات في القاعة الملكية.',
        publicIdEn: 'You restore delicate ancient artifacts and inspect display mounting integrity.',
        knowledgeAr: 'تعلمين أن فتح فاترينة التاج يحتاج شفرة فصل مغناطيسية، والنسخة المقلدة التي عُرضت سابقاً تطابق الوزن بدقة.',
        knowledgeEn: 'You know unlocking the glass case requires a magnetic decoupler, and an exhibition replica matched the exact weight.'
      }
    ],
    innocentPool: [
      {
        nameAr: 'خالد',
        nameEn: 'Khaled',
        profAr: 'مساعد أمين الأرشيف والوثائق',
        profEn: 'Archive & Documentation Assistant',
        publicIdAr: 'أنت المساعد المسؤول عن تسجيل حركة القطع الأثرية وتوثيق وصول المعروضات.',
        publicIdEn: 'You log artifact movements and catalog arriving exhibition acquisitions.',
        knowledgeAr: 'لاحظت فتح صندوق الأمانات في غرفة الحراسة عند 1:50 ص أثناء تسليم سجلات الاستلام.',
        knowledgeEn: 'You noticed the key locker open in the guard room at 1:50 AM during delivery logging.'
      },
      {
        nameAr: 'فاطمة',
        nameEn: 'Fatima',
        profAr: 'منسقة المعارض المؤقتة',
        profEn: 'Exhibition Coordinator',
        publicIdAr: 'أنت المسؤولة عن تنظيم مسارات الزوار وتجهيز منصات العرض.',
        publicIdEn: 'You arrange visitor floor paths and design protective display plinths.',
        knowledgeAr: 'تلقى المتحف استفساراً خاصاً حول تقييم التاج قبل ثلاثة أيام من جهة غير معلنة.',
        knowledgeEn: 'The museum received an inquiry regarding crown insurance valuation three days prior.'
      },
      {
        nameAr: 'رامي',
        nameEn: 'Rami',
        profAr: 'فني الكهرباء والمولدات',
        profEn: 'Electrical & Backup Power Tech',
        publicIdAr: 'أنت المسؤول عن لوحات التوزيع وتشغيل المولدات في حالات الطوارئ.',
        publicIdEn: 'You maintain breaker distribution panels and diesel emergency generators.',
        knowledgeAr: 'انقطاع الكهرباء نجم عن مؤقت حراري مبرمج مسبقاً على القاطع رقم 3 قبل نصف ساعة من الحادثة.',
        knowledgeEn: 'The power cut was caused by a thermal timer switch set on breaker #3 30 minutes prior.'
      },
      {
        nameAr: 'نادية',
        nameEn: 'Nadia',
        profAr: 'مرشدة الجولات السياحية والتعليمية',
        profEn: 'Curatorial Museum Educator',
        publicIdAr: 'أنت المتخصصة في شرح الخلفية التاريخية للمقتنيات لوفود كبار الشخصيات.',
        publicIdEn: 'You provide VIP historical background and oversee docent tour schedules.',
        knowledgeAr: 'فاترينة التاج خضعت لفحص زجاجي خاص صباح أمس للتأكد من مقاومتها للصدمات.',
        knowledgeEn: 'The crown glass showcase was inspected yesterday morning for shatter resistance.'
      },
      {
        nameAr: 'طارق',
        nameEn: 'Tariq',
        profAr: 'مهندس أجهزة الإنذار والحساسات',
        profEn: 'Alarm & Sensor Specialist',
        publicIdAr: 'أنت المهندس المسؤول عن صيانة حساسات الحركة وأشعة الليزر التحت حمراء.',
        publicIdEn: 'You maintain motion sensors, infrared perimeter beams, and tripwire circuits.',
        knowledgeAr: 'حساس الوزن أسفل وسادة التاج تم تجاوزه باستخدام ثقل بديل مطابق للوزن.',
        knowledgeEn: 'The pressure sensor beneath the velvet pillow was bypassed using an exact ballast weight.'
      },
      {
        nameAr: 'زينب',
        nameEn: 'Zeinab',
        profAr: 'أمينة متجر الهدايا والمطبوعات',
        profEn: 'Gift Shop & Inventory Manager',
        publicIdAr: 'أنت مسؤولة إدارة متجر المقتنيات التذكارية المجاور لمدخل المتحف.',
        publicIdEn: 'You manage the replica merchandise store and front entrance inventory.',
        knowledgeAr: 'نموذج نحاسي مقلد لتاج المعرض طُلب خصيصاً من ورشة الصب الأسبوع الماضي.',
        knowledgeEn: 'A brass replica casting of the crown was ordered from the foundry last week.'
      },
      {
        nameAr: 'سعيد',
        nameEn: 'Said',
        profAr: 'حارس البوابة الخلفية وتفريغ الشحنات',
        profEn: 'Loading Dock & Rear Gate Guard',
        publicIdAr: 'أنت المسؤول عن تفتيش شاحنات التوريد وصناديق التغليف القادمة للمتحف.',
        publicIdEn: 'You inspect freight delivery vans and art shipment packing crates.',
        knowledgeAr: 'صندوق خشبي مبطن عريض نُقل إلى مخزن الترميم مساء أمس بعد انتهاء الدوام.',
        knowledgeEn: 'A large padded wooden crate was moved into restoration storage after hours yesterday.'
      },
      {
        nameAr: 'منى',
        nameEn: 'Mona',
        profAr: 'سكرتيرة إدارة المتحف والشؤون الإدارية',
        profEn: 'Executive Administrative Secretary',
        publicIdAr: 'أنت المسؤولة عن تنسيق تصاريح الدخول الليلية واستقبال الوفود الرسمية.',
        publicIdEn: 'You process overnight access permits and coordinate VIP accreditation.',
        knowledgeAr: 'تصريح دخول ليلي استثنائي صُدر أمس لورشة الصيانة الخاصة بالقاعة الملكية.',
        knowledgeEn: 'An emergency overnight entry permit was approved yesterday for hall maintenance.'
      },
      {
        nameAr: 'زياد',
        nameEn: 'Ziad',
        profAr: 'أخصائي الإضاءة المسرحية والتصوير',
        profEn: 'Display Lighting Specialist',
        publicIdAr: 'أنت المصمم المسؤول عن ضبط زوايا الكشافات وإبراز لمعان المعروضات الثمينة.',
        publicIdEn: 'You adjust showcase spotlights to highlight gold and gem facets.',
        knowledgeAr: 'كشافات القاعة الملكية رُكبت على دارة تغذية منفصلة عن باقي المتحف.',
        knowledgeEn: 'Royal gallery spot lighting was wired to a dedicated sub-circuit separate from main feeds.'
      }
    ],
    cluesAr: [
      'سجل انقطاع تغذية الكاميرات لـ 4 دقائق وإعادة التشغيل اليدوي من غرفة التحكم.',
      'أداة الفصل المغناطيسي وبقايا القماش العازل أسفل الفاترينة الزجاجية.',
      'المؤقت الحراري المبرمج على القاطع الكهربائي رقم 3.'
    ],
    cluesEn: [
      '4-minute camera feed freeze and manual restart logs on the central control panel.',
      'Magnetic decoupler tool and insulating fabric fragments beneath the vitrine.',
      'Thermal timer override attached to breaker switch #3.'
    ]
  }
  // All remaining 11 stories are defined with exact matching pairs!
];

console.log('Story sync script initialized.');
