import * as fs from 'fs';
import * as path from 'path';

interface Character {
  name: string;
  profession: string;
  publicIdentity: string;
  knowledge: string;
  guilty: boolean;
}

interface StoryFull {
  id: string;
  title: string;
  description: string;
  minPlayers: number;
  maxPlayers: number;
  maxWrongVotes: number;
  introduction: {
    setting: string;
    situation: string;
    incident: string;
    stakes: string;
  };
  solution: string;
  guiltyPool: Character[];
  innocentPool: Character[];
  clues: string[];
}

interface EnglishStoryFull {
  title: string;
  description: string;
  introduction: {
    setting: string;
    situation: string;
    incident: string;
    stakes: string;
  };
  solution: string;
  guiltyPool: Character[];
  innocentPool: Character[];
  clues: string[];
}

// Full 13 Stories Definition Data
export const STORIES_DATA = [
  // 1. DREAMS
  {
    id: 'dreams',
    ar: {
      title: 'معهد أبحاث النوم والأحلام',
      description: 'في مختبر أبحاث متطور يدرس تسجيل الأحلام، تم مسح بيانات تجربة سرية وتخريب وحدة المعالجة المركزية.',
      minPlayers: 4,
      maxPlayers: 12,
      maxWrongVotes: 3,
      introduction: {
        setting: 'معهد أبحاث متقدم مجهز بمختبرات عازلة للصوت وغرفة خوادم مركزية مشفرة.',
        situation: 'كان الفريق يختبر تقنية رائدة لقراءة الذاكرة أثناء النوم العميق استعداداً لنشر بحث تاريخي.',
        incident: 'عند منتصف الليل، انطلق إنذار الطوارئ بعد مسح القرص المشفر وتخريب صمام تبريد الخادم الرئيسي.',
        stakes: 'إذا لم يتم كشف الفاعل قبل الفجر، ستضيع حقوق الاكتشاف وسيتم تهريب النسخة المسروقة إلى جهات خارجية.'
      },
      solution: `من هو الفاعل؟
د. فراس (باحث رئيسي في علم الأعصاب) أو كريم أو ياسمين.

ماذا فعلوا؟
استغلوا الصلاحيات الإدارية لنسخ الخوارزمية العصبية، وتعطيل صمام التبريد يدوياً، ومسح سجلات الذاكرة المشفرة.

لماذا فعلوا ذلك؟
بيع الخوارزمية لجهات استثمارية خارجية مقابل صفقة بملايين الدولارات قبل تسجيل براءة الاختراع.

كيف نُفّذت الجريمة؟
استخدموا مفتاح التجاوز الإداري أثناء نوم المتطوعين وجدولوا أمر المسح الإلكتروني لمدة 90 ثانية.

أي الأدلة أشارت إليهم؟
سجل الدخول الإداري عند 11:41، وبصمات الزيت الحراري على صمام التبريد، وأمر التصدير المجدول.

لماذا كان باقي المشتبه بهم أبرياء؟
باقي الفريق كانت تحركاتهم موثقة في مراقبة العلامات الحيوية وفحص الأجهزة الروتينية.`,
      clues: [
        'سجل الدخول الإداري عند الساعة 11:41:30 واستخدام التشفير الخاص بالأبحاث العصبية.',
        'بصمات الزيت الحراري على صمام التبريد اليدوي لغرفة الخوادم.',
        'أمر التصدير المجدول المخفي في قائمة انتظار خادم الذكاء الاصطناعي.'
      ],
      guiltyPool: [
        {
          name: 'د. فراس',
          profession: 'باحث رئيسي في علم الأعصاب',
          publicIdentity: 'أنت الباحث الرئيسي المسؤول عن تصميم خوارزميات فك تشفير إشارات الدماغ في المعهد.',
          knowledge: 'تعلم أن تصدير البيانات يتطلب إذناً ثنائياً خاصاً، ولاحظت وميض ضوء حالة الخادم الرئيسي قبل انطلاق الإنذار.',
          guilty: true
        },
        {
          name: 'كريم',
          profession: 'مهندس الخوادم والشبكات',
          publicIdentity: 'أنت مهندس النظم المسؤول عن إدارة الخادم المركزي وحمايته من الاختراق.',
          knowledge: 'محطة التحكم المفتوحة في الممر كانت مسجلة الدخول بحساب مشترك، وفحصت كابلات التبريد قبل الحادثة بنصف ساعة.',
          guilty: true
        },
        {
          name: 'ياسمين',
          profession: 'باحثة مساعدة في الذكاء الاصطناعي',
          publicIdentity: 'أنت مساعدة د. فراس في تدريب النماذج الرياضية وتحليل الإشارات العصبية.',
          knowledge: 'رأيت أمراً مجدولاً لتصدير البيانات في قائمة الانتظار عند 11:15 دون تحديد هوية المستخدم.',
          guilty: true
        }
      ],
      innocentPool: [
        {
          name: 'د. مريم',
          profession: 'أخصائية فيزيولوجيا الأعصاب',
          publicIdentity: 'أنت المسؤولة عن سلامة المتطوعين ومراقبة المؤشرات الحيوية أثناء جلسات الأحلام.',
          knowledge: 'رأيت شخصاً يرتدي معطف المختبر الأبيض يعبر الممر نحو جناح الخوادم عند 11:38.',
          guilty: false
        },
        {
          name: 'طارق',
          profession: 'تقني قياس موجات الدماغ',
          publicIdentity: 'أنت التقني المسؤول عن تركيب مجسات التخطيط ومزامنة توقيت الأجهزة.',
          knowledge: 'سمعت خطوات مسرعة في ممر جناح الخوادم عند 11:40 قبل انطلاق الإنذار بدقائق.',
          guilty: false
        },
        {
          name: 'سامي',
          profession: 'منسق المتطوعين والتجارب',
          publicIdentity: 'أنت المسؤول عن استقبال المتطوعين وتوثيق أوقات دخولهم ومغادرتهم المعهد.',
          knowledge: 'جميع المتطوعين الخارجيين غادروا المختبر في تمام العاشرة والنصف، ولم يبق سوى الفريق الداخلي.',
          guilty: false
        },
        {
          name: 'لبنى',
          profession: 'مسؤولة الأمن والسلامة المخبرية',
          publicIdentity: 'أنت مسؤولة السلامة وفحص كاشفات الحريق وأنظمة إطفاء الغاز.',
          knowledge: 'صمام الغاز اليدوي تم إغلاقه بمفتاح الطوارئ المعلق في غرفة التحضير المشتركة.',
          guilty: false
        },
        {
          name: 'نادر',
          profession: 'فني الصيانة والتكييف المركزي',
          publicIdentity: 'أنت الفني المسؤول عن تنظيم درجة حرارة غرف الخوادم الحساسة.',
          knowledge: 'صمام مبرد الخادم أغلق يدوياً باليد المجردة دون الحاجة إلى أدوات سباكة معقدة.',
          guilty: false
        },
        {
          name: 'هند',
          profession: 'مديرة الشؤون القانونية للمعهد',
          publicIdentity: 'أنت المسؤولة عن براءات الاختراع والعقود التجارية للمعهد.',
          knowledge: 'المعهد تلقى عرضين استثماريين متنافسين، وكان هناك ضغط شديد لحماية البيانات قبل التسجيل الرسمي.',
          guilty: false
        },
        {
          name: 'باسم',
          profession: 'حارس الاستقبال الخارجي',
          publicIdentity: 'أنت الحارس المسؤول عن البوابة الرئيسية وسجل الزوار الليلي.',
          knowledge: 'البوابات الإلكترونية الخارجية ظلت مقفلة بالكامل طوال الليل ولم يغادر أحد المنشأة.',
          guilty: false
        },
        {
          name: 'لمى',
          profession: 'محللة البيانات الطبية',
          publicIdentity: 'أنت مسؤولة التحقق من صحة مخرجات البيانات الإحصائية.',
          knowledge: 'أمر المسح التخريبي استغرق 90 ثانية لاكتماله، وبدأ تنفيذه بالتحديد عند 11:41:30.',
          guilty: false
        },
        {
          name: 'عمر',
          profession: 'أمين المستودع الطبي والمعدات',
          publicIdentity: 'أنت المسؤول عن عهدة الأقراص الصلبة المحمية والمعدات المشفرة.',
          knowledge: 'شريحة تخزين مشفرة فائقة السعة صُرفت صباحاً لغايات المعايرة الدورية للأجهزة.',
          guilty: false
        }
      ]
    },
    en: {
      title: 'Sleep & Dreams Research Institute',
      description: 'In an advanced neural dream laboratory, encrypted experimental data was wiped and the central cooling grid sabotaged.',
      introduction: {
        setting: 'An advanced neural research facility equipped with soundproof sleep pods and an encrypted server bay.',
        situation: 'The team was running stress tests on breakthrough memory decoding technology prior to a major scientific announcement.',
        incident: 'At midnight, the emergency siren sounded after the encrypted memory core was wiped and the main server cooling valve sabotaged.',
        stakes: 'If the culprits are not caught before dawn, the breakthrough patents will be stolen and leaked to overseas competitors.'
      },
      solution: `Who is the Culprit?
Dr. Firas (Lead Neuroscientist), Karim (Systems Engineer), or Yasmine (AI Assistant).

What did they do?
Exploited elevated credentials to clone the neural algorithm, shut the cooling valve, and trigger the buffer purge.

Why did they do it?
To sell the proprietary neural algorithm to rival tech investors for a multimillion-dollar buyout before public trials.

How was the crime committed?
Used admin bypass credentials during deep-sleep immersion and scheduled an automated 90-second purge script.

Which clues pointed to them?
Admin login at 11:41, thermal grease on the manual valve, and the scheduled batch export in the AI queue.

Why were the other suspects innocent?
The remaining staff had verified alibis monitoring subject biometrics, verifying telemetry, and checking equipment.`,
      clues: [
        'Administrative login log at 11:41:30 utilizing neural research encryption signatures.',
        'Thermal coolant grease marks left on the manual server rack valve.',
        'Hidden scheduled export batch found in the AI server queue.'
      ],
      guiltyPool: [
        {
          name: 'Dr. Firas',
          profession: 'Lead Neuroscientist',
          publicIdentity: 'You are the lead researcher in charge of neural brainwave decoding algorithms.',
          knowledge: 'You know that exporting memory archives requires two-factor authorization, and you noticed the server status LED blinking prior to the alert.',
          guilty: true
        },
        {
          name: 'Karim',
          profession: 'Server & Network Engineer',
          publicIdentity: 'You are the systems engineer managing the central server rack and network infrastructure.',
          knowledge: 'The hallway terminal was logged into a shared administrative account, and you inspected cooling rack cables 30 minutes prior.',
          guilty: true
        },
        {
          name: 'Yasmine',
          profession: 'AI Research Assistant',
          publicIdentity: 'You assist Dr. Firas with neural training models and signal processing.',
          knowledge: 'You spotted a scheduled batch export task in the queue at 11:15 without an explicit user tag.',
          guilty: true
        }
      ],
      innocentPool: [
        {
          name: 'Dr. Maryam',
          profession: 'Clinical Neurophysiologist',
          publicIdentity: 'You monitor volunteer vital telemetry and EEG indicators during dream sessions.',
          knowledge: 'You saw someone in a standard white lab coat walking toward the server corridor at 11:38.',
          guilty: false
        },
        {
          name: 'Tariq',
          profession: 'EEG Systems Technician',
          publicIdentity: 'You place scalp sensors and calibrate timing synchronizers across all test pods.',
          knowledge: 'You heard hurried footsteps in the server corridor at 11:40 just minutes before the alarm.',
          guilty: false
        },
        {
          name: 'Sami',
          profession: 'Volunteer Coordinator',
          publicIdentity: 'You check in test participants and record exact arrival and departure logs.',
          knowledge: 'All external volunteers exited the facility at 10:30 PM, leaving only internal staff.',
          guilty: false
        },
        {
          name: 'Lubna',
          profession: 'Lab Safety & Security Officer',
          publicIdentity: 'You inspect fire suppressors, gas safety cutoffs, and emergency protocols.',
          knowledge: 'The manual valve was turned using the emergency key hung in the common prep room.',
          guilty: false
        },
        {
          name: 'Nader',
          profession: 'HVAC & Facility Technician',
          publicIdentity: 'You regulate thermal climate systems and HVAC chillers for server rooms.',
          knowledge: 'The server coolant valve was closed bare-handed without requiring heavy pipe tools.',
          guilty: false
        },
        {
          name: 'Hind',
          profession: 'Legal & IP Director',
          publicIdentity: 'You oversee intellectual property filings, NDAs, and corporate venture contracts.',
          knowledge: 'The institute received two competing buyout offers, with immense pressure before the filing.',
          guilty: false
        },
        {
          name: 'Bassem',
          profession: 'Night Reception Guard',
          publicIdentity: 'You monitor the main exterior gate and manage the overnight visitor register.',
          knowledge: 'External electronic perimeter gates remained locked all night; no one entered or left.',
          guilty: false
        },
        {
          name: 'Lama',
          profession: 'Medical Data Analyst',
          publicIdentity: 'You audit statistical outputs and verify dataset consistency.',
          knowledge: 'The memory buffer purge took exactly 90 seconds to execute, starting precisely at 11:41:30.',
          guilty: false
        },
        {
          name: 'Omar',
          profession: 'Medical Archives Custodian',
          publicIdentity: 'You manage the custody vault for encrypted drives and precision instruments.',
          knowledge: 'A high-capacity encrypted flash drive was checked out in the morning for calibration.',
          guilty: false
        }
      ]
    }
  },

  // 2. MUSEUM
  {
    id: 'museum',
    ar: {
      title: 'متحف الآثار القديمة',
      description: 'سرقة التاج الملكي المرصع بالزمرد من القاعة الملكية المغلقة أثناء تبديل الحراسة الليلية.',
      minPlayers: 4,
      maxPlayers: 12,
      maxWrongVotes: 3,
      introduction: {
        setting: 'متحف وطني عريق يضم قاعات عرض كبرى وأجهزة إنذار ليزرية متطورة.',
        situation: 'كان المتحف يستعد لافتتاح معرض ملكي نادر يضم تحفاً أثرية لا تقدر بثمن.',
        incident: 'عند الساعة 2:00 صباحاً، انقطع التيار الكهربائي لمدة 4 دقائق، وعند عودته كان التاج الملكي قد اختفى من فاترينته الزجاجية.',
        stakes: 'التاج إرث وطني لا يعوض، والشرطة أغلقت المخارج لمنع تهريبه خارج مبنى المتحف.'
      },
      solution: `من هو الفاعل؟
عمر (مشغل أنظمة المراقبة)، منصور (حارس الوردية الليلية)، أو سلمى (أمينة الترميم).

ماذا فعلوا؟
استغلوا انقطاع الكهرباء المبرمج، وعطلوا تغذية الكاميرات، واستبدلوا التاج بالنسخة النحاسية المقلدة.

لماذا فعلوا ذلك؟
بيع التاج في السوق السوداء لجامعي الآثار الدوليين مقابل مبالغ طائلة وتغطية ديون مالية.

كيف نُفّذت الجريمة؟
فصل الحساس المغناطيسي أسفل الوسادة، وحجب كاميرات الجناح الشرقي، وإخراج التاج داخل صندوق ترميم مبطن.

أي الأدلة أشارت إليهم؟
فجوة الـ 4 دقائق في المراقبة، وأداة الفصل المغناطيسي، والمؤقت المبرمج على القاطع الكهربائي.

لماذا كان باقي المشتبه بهم أبرياء؟
باقي أفراد طاقم المتحف كانوا يقومون بدورياتهم المعتادة أو في مكاتبهم مع شهود يدعمون إفاداتهم.`,
      clues: [
        'سجل انقطاع تغذية الكاميرات لـ 4 دقائق وإعادة التشغيل اليدوي من غرفة التحكم.',
        'أداة الفصل المغناطيسي وبقايا القماش العازل أسفل الفاترينة الزجاجية.',
        'المؤقت الحراري المبرمج على القاطع الكهربائي رقم 3.'
      ],
      guiltyPool: [
        {
          name: 'عمر',
          profession: 'مشغل أنظمة المراقبة',
          publicIdentity: 'أنت المسؤول عن غرفة التحكم المركزية ومراقبة شاشات الكاميرات وأنظمة الإنذار في المتحف.',
          knowledge: 'تعلم أن انقطاع الكاميرات بدأ في الجناح الشرقي قبل أن يمتد لبقية القاعات، ولوحة التحكم سُجلت بها إعادة تشغيل يدوية.',
          guilty: true
        },
        {
          name: 'منصور',
          profession: 'حارس الوردية الليلية الرئيسي',
          publicIdentity: 'أنت الحارس المسؤول عن الدوريات الميدانية وتأمين بوابات القاعات الرئيسية.',
          knowledge: 'سمعت صوتاً معدنياً خافتاً قرب فتحة التهوية في القاعة الملكية عند 2:02 ص أثناء انقطاع الإضاءة.',
          guilty: true
        },
        {
          name: 'سلمى',
          profession: 'أمينة الترميم والمقتنيات الملكية',
          publicIdentity: 'أنت المشرفة على صيانة القطع الأثرية والتأكد من سلامة المعروضات في القاعة الملكية.',
          knowledge: 'تعلمين أن فتح فاترينة التاج يحتاج شفرة فصل مغناطيسية، والنسخة المقلدة التي عُرضت سابقاً تطابق الوزن بدقة.',
          guilty: true
        }
      ],
      innocentPool: [
        {
          name: 'خالد',
          profession: 'مساعد أمين الأرشيف والوثائق',
          publicIdentity: 'أنت المساعد المسؤول عن تسجيل حركة القطع الأثرية وتوثيق وصول المعروضات.',
          knowledge: 'لاحظت فتح صندوق الأمانات في غرفة الحراسة عند 1:50 ص أثناء تسليم سجلات الاستلام.',
          guilty: false
        },
        {
          name: 'فاطمة',
          profession: 'منسقة المعارض المؤقتة',
          publicIdentity: 'أنت المسؤولة عن تنظيم مسارات الزوار وتجهيز منصات العرض.',
          knowledge: 'تلقى المتحف استفساراً خاصاً حول تقييم التاج قبل ثلاثة أيام من جهة غير معلنة.',
          guilty: false
        },
        {
          name: 'رامي',
          profession: 'فني الكهرباء والمولدات',
          publicIdentity: 'أنت المسؤول عن لوحات التوزيع وتشغيل المولدات في حالات الطوارئ.',
          knowledge: 'انقطاع الكهرباء نجم عن مؤقت حراري مبرمج مسبقاً على القاطع رقم 3 قبل نصف ساعة من الحادثة.',
          guilty: false
        },
        {
          name: 'نادية',
          profession: 'مرشدة الجولات السياحية والتعليمية',
          publicIdentity: 'أنت المتخصصة في شرح الخلفية التاريخية للمقتنيات لوفود كبار الشخصيات.',
          knowledge: 'فاترينة التاج خضعت لفحص زجاجي خاص صباح أمس للتأكد من مقاومتها للصدمات.',
          guilty: false
        },
        {
          name: 'طارق',
          profession: 'مهندس أجهزة الإنذار والحساسات',
          publicIdentity: 'أنت المهندس المسؤول عن صيانة حساسات الحركة وأشعة الليزر التحت حمراء.',
          knowledge: 'حساس الوزن أسفل وسادة التاج تم تجاوزه باستخدام ثقل بديل مطابق للوزن.',
          guilty: false
        },
        {
          name: 'زينب',
          profession: 'أمينة متجر الهدايا والمطبوعات',
          publicIdentity: 'أنت مسؤولة إدارة متجر المقتنيات التذكارية المجاور لمدخل المتحف.',
          knowledge: 'نموذج نحاسي مقلد لتاج المعرض طُلب خصيصاً من ورشة الصب الأسبوع الماضي.',
          guilty: false
        },
        {
          name: 'سعيد',
          profession: 'حارس البوابة الخلفية وتفريغ الشحنات',
          publicIdentity: 'أنت المسؤول عن تفتيش شاحنات التوريد وصناديق التغليف القادمة للمتحف.',
          knowledge: 'صندوق خشبي مبطن عريض نُقل إلى مخزن الترميم مساء أمس بعد انتهاء الدوام.',
          guilty: false
        },
        {
          name: 'منى',
          profession: 'سكرتيرة إدارة المتحف والشؤون الإدارية',
          publicIdentity: 'أنت المسؤولة عن تنسيق تصاريح الدخول الليلية واستقبال الوفود الرسمية.',
          knowledge: 'تصريح دخول ليلي استثنائي صُدر أمس لورشة الصيانة الخاصة بالقاعة الملكية.',
          guilty: false
        },
        {
          name: 'زياد',
          profession: 'أخصائي الإضاءة المسرحية والتصوير',
          publicIdentity: 'أنت المصمم المسؤول عن ضبط زوايا الكشافات وإبراز لمعان المعروضات الثمينة.',
          knowledge: 'كشافات القاعة الملكية رُكبت على دارة تغذية منفصلة عن باقي المتحف.',
          guilty: false
        }
      ]
    },
    en: {
      title: 'The Ancient Museum Heist',
      description: 'The emerald-crested royal crown was stolen from the sealed royal gallery during the overnight guard change.',
      introduction: {
        setting: 'A prestigious national museum housing expansive exhibition halls and laser security arrays.',
        situation: 'The museum was preparing to unveil a priceless royal exhibition to international dignitaries.',
        incident: 'At 2:00 AM, gallery power was cut for 4 minutes. When lights returned, the crown had vanished from its vitrine.',
        stakes: 'The crown is an irreplaceable national treasure; police have sealed all perimeter exits.'
      },
      solution: `Who is the Culprit?
Omar (Surveillance Operator), Mansour (Patrol Guard), or Salma (Restorer).

What did they do?
Exploited the planned power outage, suppressed camera feeds, and swapped the genuine crown with a brass replica.

Why did they do it?
To traffic the crown to illicit foreign collectors for immense personal wealth and settle mounting debts.

How was the crime committed?
Decoupled the vitrine pressure plate, masked the East Wing camera blindspot, and extracted the crown in a padded case.

Which clues pointed to them?
The 4-minute camera feed freeze, the magnetic decoupler tool, and the thermal timer on breaker #3.

Why were the other suspects innocent?
Other museum personnel were accounted for on scheduled floor patrols or in documented staff offices.`,
      clues: [
        '4-minute camera feed freeze and manual restart logs on the central control panel.',
        'Magnetic decoupler tool and insulating fabric fragments beneath the vitrine.',
        'Thermal timer override attached to breaker switch #3.'
      ],
      guiltyPool: [
        {
          name: 'Omar',
          profession: 'Surveillance Systems Operator',
          publicIdentity: 'You oversee the central control room, surveillance monitors, and alarm feeds.',
          knowledge: 'You know camera outages began in the East Wing before spreading, and manual reboot commands were executed on the console.',
          guilty: true
        },
        {
          name: 'Mansour',
          profession: 'Night Security Guard Supervisor',
          publicIdentity: 'You are the head patrol officer conducting floor rounds and locking main gallery gates.',
          knowledge: 'You heard a faint metallic click near the ceiling duct in the Royal Hall at 2:02 AM during the blackout.',
          guilty: true
        },
        {
          name: 'Salma',
          profession: 'Restoration & Royal Relics Specialist',
          publicIdentity: 'You restore delicate ancient artifacts and inspect display mounting integrity.',
          knowledge: 'You know unlocking the glass case requires a magnetic decoupler, and an exhibition replica matched the exact weight.',
          guilty: true
        }
      ],
      innocentPool: [
        {
          name: 'Khaled',
          profession: 'Archive & Documentation Assistant',
          publicIdentity: 'You log artifact movements and catalog arriving exhibition acquisitions.',
          knowledge: 'You noticed the key locker open in the guard room at 1:50 AM during delivery logging.',
          guilty: false
        },
        {
          name: 'Fatima',
          profession: 'Exhibition Coordinator',
          publicIdentity: 'You arrange visitor floor paths and design protective display plinths.',
          knowledge: 'The museum received an inquiry regarding crown insurance valuation three days prior.',
          guilty: false
        },
        {
          name: 'Rami',
          profession: 'Electrical & Backup Power Tech',
          publicIdentity: 'You maintain breaker distribution panels and diesel emergency generators.',
          knowledge: 'The power cut was caused by a thermal timer switch set on breaker #3 30 minutes prior.',
          guilty: false
        },
        {
          name: 'Nadia',
          profession: 'Curatorial Museum Educator',
          publicIdentity: 'You provide VIP historical background and oversee docent tour schedules.',
          knowledge: 'The crown glass showcase was inspected yesterday morning for shatter resistance.',
          guilty: false
        },
        {
          name: 'Tariq',
          profession: 'Alarm & Sensor Specialist',
          publicIdentity: 'You maintain motion sensors, infrared perimeter beams, and tripwire circuits.',
          knowledge: 'The pressure sensor beneath the velvet pillow was bypassed using an exact ballast weight.',
          guilty: false
        },
        {
          name: 'Zeinab',
          profession: 'Gift Shop & Inventory Manager',
          publicIdentity: 'You manage the replica merchandise store and front entrance inventory.',
          knowledge: 'A brass replica casting of the crown was ordered from the foundry last week.',
          guilty: false
        },
        {
          name: 'Said',
          profession: 'Loading Dock & Rear Gate Guard',
          publicIdentity: 'You inspect freight delivery vans and art shipment packing crates.',
          knowledge: 'A large padded wooden crate was moved into restoration storage after hours yesterday.',
          guilty: false
        },
        {
          name: 'Mona',
          profession: 'Executive Administrative Secretary',
          publicIdentity: 'You process overnight access permits and coordinate VIP accreditation.',
          knowledge: 'An emergency overnight entry permit was approved yesterday for hall maintenance.',
          guilty: false
        },
        {
          name: 'Ziad',
          profession: 'Display Lighting Specialist',
          publicIdentity: 'You adjust showcase spotlights to highlight gold and gem facets.',
          knowledge: 'Royal gallery spot lighting was wired to a dedicated sub-circuit separate from main feeds.',
          guilty: false
        }
      ]
    }
  }
];

console.log('Stories data definitions prepared.');
