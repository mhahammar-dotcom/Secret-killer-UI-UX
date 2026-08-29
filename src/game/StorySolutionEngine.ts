import { Story, StoryCharacter, Player } from './types';
import { PlayerData, StoryData } from '../types';

export interface GuiltyProfile {
  name: string;
  nameEn: string;
  professionAr: string;
  professionEn: string;
  actionAr: string;
  actionEn: string;
  motiveAr: string;
  motiveEn: string;
  methodAr: string;
  methodEn: string;
  cluesAr: string;
  cluesEn: string;
}

export interface StoryCaseDeduction {
  storyId: string;
  culprits: Record<string, GuiltyProfile>;
  innocentsExplanationAr: string;
  innocentsExplanationEn: string;
  sharedEvidenceAr: string;
  sharedEvidenceEn: string;
}

export const STORY_DEDUCTION_DATABASE: Record<string, StoryCaseDeduction> = {
  dreams: {
    storyId: 'dreams',
    culprits: {
      'د. فراس': {
        name: 'د. فراس',
        nameEn: 'Dr. Firas',
        professionAr: 'باحث رئيسي في علم الأعصاب',
        professionEn: 'Lead Neuroscientist',
        actionAr: 'استغل تصريحه الإداري لفتح الممر غير المخطط ونسخ الخوارزمية العصبية المشفرة.',
        actionEn: 'Exploited administrative credentials to unlock the unmapped corridor and extract the neural algorithm.',
        motiveAr: 'بيع الشيفرة العصبية لجهة استثمارية منافسة مقابل صفقة بملايين الدولارات قبل بدء التجارب السريرية.',
        motiveEn: 'Sell proprietary neural code to rival tech investors before public clinical trials for a massive buyout.',
        methodAr: 'استخدم بطاقة الدخول الطارئة وحساب المشرف أثناء دورة النوم العميق لجميع الباحثين.',
        methodEn: 'Used the emergency admin keycard during the synchronized deep-sleep immersion cycle.',
        cluesAr: 'سجل الدخول الإداري عند الساعة 21:43 واستخدام التشفير الخاص بأبحاثه.',
        cluesEn: 'Administrative login timestamp at 21:43 and use of his specific encryption signatures.'
      },
      'كريم': {
        name: 'كريم',
        nameEn: 'Karim',
        professionAr: 'مهندس الخوادم والشبكات',
        professionEn: 'Server & Network Engineer',
        actionAr: 'عطّل صمام التبريد يدوياً وزرع برمجية مسح سجلات الذاكرة في محطة التحكم بالممر.',
        actionEn: 'Manually closed the server cooling valve and planted a buffer-purge script from the hallway terminal.',
        motiveAr: 'تلقى رشوة خارجية لتعطيل البنية التحتية ومحو الأدلة الرقمية لعملية الاختراق.',
        motiveEn: 'Received an illicit offshore bribe to sabotage the cooling grid and wipe intrusion logs.',
        methodAr: 'استغل وصوله المباشر لغرفة الخوادم وأغلق الصمام باليد المجردة دون أدوات معقدة.',
        methodEn: 'Leveraged direct physical server bay access to shut the valve and trigger memory purging.',
        cluesAr: 'فحص كابلات التبريد قبل الحادث بربع ساعة وبصمات الزيت الحراري على الصمام.',
        cluesEn: 'Thermal coolant traces on the manual valve and inspection of rack cables 15 minutes prior.'
      },
      'ياسمين': {
        name: 'ياسمين',
        nameEn: 'Yasmine',
        professionAr: 'باحثة مساعدة في الذكاء الاصطناعي',
        professionEn: 'AI Research Assistant',
        actionAr: 'جدولت أمر تصدير البيانات المخفي ومسحت النسخ الاحتياطية لتضليل التحقيق.',
        actionEn: 'Scheduled the hidden data-export queue and initiated the deletion of localized backup clusters.',
        motiveAr: 'سرقة نماذج التدريب الرياضية ونسب الاكتشاف العلمي لنفسها في أطروحتها المستقلة.',
        motiveEn: 'Steal the machine-learning training weights to publish the breakthrough under her own independent patent.',
        methodAr: 'وضعت أمراً مجدولاً عند 11:15 للتصدير المؤتمت قبل انطلاق صافرة الطوارئ بدقائق.',
        methodEn: 'Queued an automated export batch at 11:15 to execute right before the emergency alert triggered.',
        cluesAr: 'الأمر المجدول المتبقي في قائمة انتظار خادم الذكاء الاصطناعي ومطابقة توقيت مسح الـ 90 ثانية.',
        cluesEn: 'The automated batch queue found on the AI server and matching the exact 90-second purge window.'
      }
    },
    innocentsExplanationAr: 'أما باقي أعضاء الفريق فكانت تحركاتهم مبررة؛ فدكتورة مريم كانت تراقب المؤشرات الحيوية للمتطوعين، وطارق كان يفحص المجسات، وسامي أثبت مغادرة المتطوعين مبكراً، ولبنى ونادر كانا يقومان بإجراءات الفحص الدورية.',
    innocentsExplanationEn: 'The remaining team members had legitimate alibis: Dr. Maryam was monitoring volunteer biometrics, Tariq was calibrating EEG sensors, Sami verified volunteer exits, and Lubna and Nader were conducting safety checks.',
    sharedEvidenceAr: 'تطابق توقيت مسح الذاكرة، وبصمات الوصول لغرفة التبريد، وسجلات الخادم المركزي.',
    sharedEvidenceEn: 'Matching memory-wipe timestamps, cooling valve forensics, and central server audit logs.'
  },

  museum: {
    storyId: 'museum',
    culprits: {
      'عمر': {
        name: 'عمر',
        nameEn: 'Omar',
        professionAr: 'مشغل أنظمة المراقبة والتحكم',
        professionEn: 'Surveillance & Control Room Operator',
        actionAr: 'جمّد بث كاميرات القاعة الملكية على تسجيل مكرر لمدة 4 دقائق أثناء انقطاع الكهرباء ومرر شفرة الإنذار.',
        actionEn: 'Looped security camera footage of the Royal Hall for 4 minutes during the blackout and bypassed alarm feeds.',
        motiveAr: 'الحصول على حصة مالية مجزية لتسديد ديون متراكمة وتأمين عملية نقل التاج دون توثيق صور المشتبه بهم.',
        motiveEn: 'Secure a massive financial payout to clear debts by ensuring an unrecorded window for the crown extraction.',
        methodAr: 'استغل صلاحياته داخل غرفة التحكم المركزية لتجاوز مجسات الليزر وتغذية الشاشات بتسجيل وهمي.',
        methodEn: 'Used central control room clearances to override laser sensors and feed loop footage to display monitors.',
        cluesAr: 'سجل التعديل اليدوي على موزع طاقة الكاميرات وبصمات أصابعه على وحدة التحكم الاحتياطية.',
        cluesEn: 'Manual power redistribution logs on the camera terminal and his fingerprints on the backup console.'
      },
      'منصور': {
        name: 'منصور',
        nameEn: 'Mansour',
        professionAr: 'حارس الوردية الليلية الرئيسي',
        professionEn: 'Night Security Supervisor',
        actionAr: 'عطّل دورية الحراسة في الجناح الشرقي وفتح البوابة الجانبية لخروج التاج.',
        actionEn: 'Delayed the eastern wing security patrol and opened the side exit gate for the crown extraction.',
        motiveAr: 'تلقى رشوة كبيرة لتأمين ممر آمن وتغطية مسار الهروب دون تفتيش.',
        motiveEn: 'Received a hefty bribe to provide an unmonitored escape corridor and skip standard exit checks.',
        methodAr: 'استخدم المفتاح الرئيسي لغرفة الحراسة لفتح مسار الطوارئ الخلفي أثناء انقطاع الكهرباء.',
        methodEn: 'Used the guard station master key to unlock the rear emergency exit during the blackout.',
        cluesAr: 'سجل فتح البوابة الجانبية في توقيت الانقطاع وآثار أقدامه في الممر غير المخصص لدوريته.',
        cluesEn: 'Side gate unlock timestamps during the power outage and boot prints in the off-route corridor.'
      },
      'سلمى': {
        name: 'سلمى',
        nameEn: 'Salma',
        professionAr: 'أمينة الترميم والمقتنيات الملكية',
        professionEn: 'Restoration & Relics Specialist',
        actionAr: 'استخدمت شفرة الفصل المغناطيسي لفتح فاترينة التاج ونقلته داخل حقيبة العينات المبطنة.',
        actionEn: 'Used the magnetic bypass tool to open the crown showcase and concealed the artifact in a padded case.',
        motiveAr: 'تهريب التاج لبيعه لجامع تحف أجنبي بذريعة نقله للمعالجة الكيميائية المخبرية.',
        motiveEn: 'Smuggle the crown to a foreign private collector under the pretense of lab chemical conservation.',
        methodAr: 'استغلت خبرتها في آليات أقفال الفاترينات الزجاجية لفصل القفل المغناطيسي دون كسر الزجاج.',
        methodEn: 'Leveraged specialist expertise in showcase locking mechanisms to detach the magnetic seal cleanly.',
        cluesAr: 'شفرة الفصل المغناطيسي الخاصة بورشة الترميم وألياف الحقيبة المبطنة داخل الفاترينة.',
        cluesEn: 'Specialized magnetic bypass tool from the restoration lab and padded case fabric fibers inside the case.'
      }
    },
    innocentsExplanationAr: 'باقي العاملين مثل خالد وفاطمة ورامي ونادية وطارق وزينب وسعيد ومنى وزياد كانوا يقومون بمهامهم الرسمية، وتواجدهم في القاعات كان مسجلاً وفق جدول الحراسة والصيانة والتنظيف المعتاد دون أي تدخل في أنظمة الأمان أو فاترينة التاج.',
    innocentsExplanationEn: 'The other staff (Khaled, Fatima, Rami, Nadia, Tariq, Zeinab, Said, Mona, Ziad) performed routine duties, and their presence aligned with verified schedules without security tampering or unauthorized access to the crown showcase.',
    sharedEvidenceAr: 'انقطاع التيار الكهربائي لمدة 4 دقائق، وبصمات غرفة التحكم، وشفرة الفصل المغناطيسي.',
    sharedEvidenceEn: 'The 4-minute blackout window, control room console telemetry, and the magnetic bypass tool trace.'
  },

  train: {
    storyId: 'train',
    culprits: {
      'فارس': {
        name: 'فارس',
        nameEn: 'Faris',
        professionAr: 'مساعد قائد القطار',
        professionEn: 'Assistant Train Engineer',
        actionAr: 'فصل صمام الطاقة الإضافي في قمرة القيادة لقطع الإنارة في النفق المظلم.',
        actionEn: 'Disconnected the auxiliary power relay in the locomotive to kill carriage lights inside the mountain tunnel.',
        motiveAr: 'ابتزاز شركة الخطوط ومنع تسليم وثائق سرية تدين شبكة تهريب دولية.',
        motiveEn: 'Blackmail the rail authority and prevent delivery of secret ledgers exposing a smuggling syndicate.',
        methodAr: 'استخدم مفتاح التحكم اليدوي المخصص لطاقم القيادة أثناء عبور النفق الجبلي.',
        methodEn: 'Used the crew-only manual override switch right as the train entered the unlit mountain tunnel.',
        cluesAr: 'آثار الشحم الميكانيكي المميز لقمرة المحرك على لوحة القواطع الكهربائية.',
        cluesEn: 'Locomotive gear grease found on the freight breaker box and isolated cabin power logs.'
      },
      'بسام': {
        name: 'بسام',
        nameEn: 'Bassam',
        professionAr: 'نادل عربة الضيافة الأولى',
        professionEn: 'First-Class Dining Steward',
        actionAr: 'استولى على المفتاح الاحتياطي لعربة الشحن من معطف ناظر القطار أثناء تقديم العشاء.',
        actionEn: 'Swiped the spare freight compartment key from the conductor coat while serving dinner.',
        motiveAr: 'الحصول على أوراق الضغط الدبلوماسية لبيعها لممثلين سياسيين منافسين.',
        motiveEn: 'Acquire diplomatic leverage documents to sell to rival political interests for a fortune.',
        methodAr: 'استغل انشغال الركاب بارتجاج القطار داخل النفق لفتح باب الشحن الجانبي.',
        methodEn: 'Leveraged the pitch-black blackout and carriage sway to slip into the freight car.',
        cluesAr: 'مفتاح عربة الشحن المسترجع من خزانة البياضات وتطابق جدول خدمته في الممر.',
        cluesEn: 'Freight key recovered from the linen pantry and his verified corridor service timing.'
      },
      'كمال': {
        name: 'كمال',
        nameEn: 'Kamal',
        professionAr: 'مفتش أمتعة عربة الشحن',
        professionEn: 'Freight Baggage Inspector',
        actionAr: 'كسر الختم الشمعي لخزينة الشحن واستبدل الحقيبة الدبلوماسية بأوراق عديمة القيمة.',
        actionEn: 'Cracked the wax seal on the cargo vault and swapped the diplomatic pouch with blank decoy files.',
        motiveAr: 'التخلص من تقارير التفتيش السابقة التي تثبت تورطه في تسهيل شحنات غير قانونية.',
        motiveEn: 'Destroy prior cargo inspection audit logs that proved his complicity in illicit contraband shipments.',
        methodAr: 'جهّز مسبقاً حقيبة مطابقة وحقيبة أدوات لفك أقفال الصناديق الفولاذية بسرعة.',
        methodEn: 'Prepared an identical decoy briefcase and rapid lock-shims to bypass steel strongbox latches.',
        cluesAr: 'بقايا الشمع الأحمر المكسور داخل حقيبة أدوات الفحص وتناقض سجل الأوزان.',
        cluesEn: 'Red wax seal fragments inside his inspection toolkit and cargo scale weight discrepancies.'
      }
    },
    innocentsExplanationAr: 'أما الركاب والناظر نبيل والميكانيكي يوسف فقد تواجدوا في مقاعدهم أو مقصوراتهم المثبتة بشهادة الشهود، ولم تكن لديهم إمكانية الوصول المشترك لكل من قمرة الطاقة وخزينة الشحن.',
    innocentsExplanationEn: 'The passengers, Conductor Nabil, and Mechanic Youssef remained accounted for in their cabins/stations with verified testimonies and lacked dual access to power switches and secure cargo vaults.',
    sharedEvidenceAr: 'انقطاع الطاقة في النفق، وكسر الختم الشمعي، ومفتاح عربة الشحن المفقود.',
    sharedEvidenceEn: 'Tunnel blackout telemetry, cracked wax vault seal, and the misplaced freight key.'
  },

  observatory: {
    storyId: 'observatory',
    culprits: {
      'إياد': {
        name: 'إياد',
        nameEn: 'Eyad',
        professionAr: 'فني التلسكوب الرئيسي',
        professionEn: 'Telescope Operations Tech',
        actionAr: 'عطّل محرك تدوير القبة وسرق العينة النيزكية من حجرة الرصد البصري.',
        actionEn: 'Jammed the dome rotation drive and extracted the meteorite core from the optical observation chamber.',
        motiveAr: 'بيع النظائر الفضائية النادرة لمختبر أبحاث مواد متقدمة بصفقة سرية.',
        motiveEn: 'Sell rare extraterrestrial isotopes to a private materials laboratory via black-market brokers.',
        methodAr: 'استغل درايته اليدوية بتروس القبة لفتحها يدوياً أثناء انقطاع التتبع التلقائي.',
        methodEn: 'Used mechanical knowledge of the dome gearing to manually unlock the hatch during calibration.',
        cluesAr: 'أداة المعايرة الدقيقة المتروكة قرب منصة التلسكوب وبصمات الزيت الخاص بالتروس.',
        cluesEn: 'Precision calibration wrench left near the telescope mounting and gear lubricant traces.'
      },
      'د. رؤوف': {
        name: 'د. رؤوف',
        nameEn: 'Dr. Raouf',
        professionAr: 'كبير علماء الفلك والفيزياء الفلكية',
        professionEn: 'Senior Astrophysicist',
        actionAr: 'استبدل العينة النيزكية بحجر بازلتي محلي متطابق في المظهر لإخفاء السرقة.',
        actionEn: 'Swapped the authentic meteorite sample with a terrestrial basalt stone to mask the theft.',
        motiveAr: 'حرمان فريقه المنافس من إثبات نظرية فلكية تدحض أبحاثه المنشورة سابقاً.',
        motiveEn: 'Suppress competing spectral findings that would invalidate his lifetime academic publications.',
        methodAr: 'استخدم بطاقة الصلاحيات العلمية لفتح خزانة العزل الكيميائي المبردة.',
        methodEn: 'Used high-level scientific clearances to access the cryogenic specimen containment locker.',
        cluesAr: 'مطابقة قياسات الحجر البازلتي مع صخور معمله الخاص وسجل فك العزل عند منتصف الليل.',
        cluesEn: 'Basalt specimen matching rocks from his private lab and midnight specimen locker unlock logs.'
      },
      'مايا': {
        name: 'مايا',
        nameEn: 'Maya',
        professionAr: 'أخصائية أجهزة الاستشعار والليزر',
        professionEn: 'Optics & Laser Specialist',
        actionAr: 'فصلت حساسات الإنذار الضوئي حول منصة النيزك لمدة 90 ثانية.',
        actionEn: 'Suppressed optical alarm sensors around the meteorite plinth for a 90-second window.',
        motiveAr: 'الانتقام من إدارة المرصد بعد تهميش مساهمتها في تصميم مستشعرات الأشعة تحت الحمراء.',
        motiveEn: 'Retaliate against observatory management after being stripped of credit for sensor patents.',
        methodAr: 'أعادت توجيه ليزر الحماية نحو عاكس ثابت لتظهر المنصة وكأنها محمية على الشاشات.',
        methodEn: 'Redirected security laser beams onto static mirrors to create a false green status on monitors.',
        cluesAr: 'العاكس الضوئي الإضافي المثبت بلاصق حراري والرمز البرمجي لتجميد شاشة المراقبة.',
        cluesEn: 'Auxiliary optical reflector fixed with thermal tape and script logs freezing sensor feeds.'
      }
    },
    innocentsExplanationAr: 'باقي الفريق من تقنيي الطقس وحراس المولدات تواجدوا في محطاتهم؛ فزياد كان يراقب المولد الخارجي، وطارق كان يسجل بيانات الضغط الجوي، وديمة كانت توثق الصور الفلكية.',
    innocentsExplanationEn: 'Other team members (Ziad, Tariq, Deema) were verified at their respective stations: generator checks, atmospheric logging, and camera archiving with unbroken logs.',
    sharedEvidenceAr: 'تعطيل ليزر الحماية لـ 90 ثانية، والحجر البازلتي البديل، وبقايا زيت تروس القبة.',
    sharedEvidenceEn: '90-second laser bypass, the decoy basalt replacement, and dome gear oil residue.'
  },

  desert_archive: {
    storyId: 'desert_archive',
    culprits: {
      'عزام': {
        name: 'عزام',
        nameEn: 'Azzam',
        professionAr: 'دليل القافلة وخبير المسالك الصحراوية',
        professionEn: 'Expedition Scout & Navigator',
        actionAr: 'أخفى المخطوطة الأثرية التي تحدد إحداثيات المدينة المطمورة واستبدل صفحاتها.',
        actionEn: 'Concealed the ancient parchment charting the sunken city coordinates and swapped map leaves.',
        motiveAr: 'إرشاد بعثة تنقيب خاصة مأجورة إلى موقع الكنز واقتسام الأرباح معهم.',
        motiveEn: 'Guide a rival illicit salvage team to the hidden desert ruins for a massive share of the spoils.',
        methodAr: 'استغل معرفته بمداخل الخيام الحجرية وتسلل إلى صندوق المخطوطات قبل الفجر.',
        methodEn: 'Used his intimate knowledge of stone tent pathways to infiltrate the archive trunk before dawn.',
        cluesAr: 'حبات الرمل الأحمر المميزة للممرات الوعرة التي سلكها وخيط الخريطة المقطوع.',
        cluesEn: 'Red dune sand unique to outer pass routes and severed binding thread from the manuscript.'
      },
      'د. ليلى': {
        name: 'د. ليلى',
        nameEn: 'Dr. Layla',
        professionAr: 'رئيسة فريق الآثار والنقوش',
        professionEn: 'Lead Epigrapher & Historian',
        actionAr: 'نسخت النصوص السريالية المشفرة ومحت الترجمة الأصلية من سجل البعثة الميداني.',
        actionEn: 'Copied ancient cipher glyphs and erased field notebook translations to monopolize the find.',
        motiveAr: 'احتكار حق النشر والفك التاريخي للغة الأثرية باسمها دون إشراك الجامعة.',
        motiveEn: 'Monopolize scientific discovery rights and international academic glory exclusively in her name.',
        methodAr: 'استخدمت حمض التنظيف الخفيف لطمس الأسطر التوضيحية على اللوح الحجري التذكاري.',
        methodEn: 'Applied mild acid solvent to dissolve contextual translation markings on the memorial stone.',
        cluesAr: 'قارورة الحمض المخفف في حقيبتها الميدانية ودفتر الملاحظات المفرغ من صفحات الإحداثيات.',
        cluesEn: 'Acid solvent vial in her field satchel and missing coordinate pages from her field binder.'
      },
      'راشد': {
        name: 'راشد',
        nameEn: 'Rashed',
        professionAr: 'أمين مخزن القطع والأختام الأثرية',
        professionEn: 'Archive Vault Custodian',
        actionAr: 'فتح قفل الصندوق الحجري الثقيل وسلّم اللوح المنقوش ليتم تهريبه مع مؤن الفجر.',
        actionEn: 'Unlocked the heavy stone repository and smuggled the engraved tablet inside early supply sacks.',
        motiveAr: 'تلقى دفعة نقدية كبيرة لتأمين إخراج اللوح قبل موعد جرد اللجنة الوزارية.',
        motiveEn: 'Paid off to facilitate artifact removal before the ministry inspection committee arrived.',
        methodAr: 'استخدم مفتاح القفل البرونزي القديم الذي يحتفظ به وحده في عهدته الرسمية.',
        methodEn: 'Used the antique bronze key held solely under his personal inventory authority.',
        cluesAr: 'آثار شمع القفل على عباءته ونسخة مفتاح البرونز المعدلة.',
        cluesEn: 'Wax seal residue on his cloak and the modified bronze lock-shim found in the storeroom.'
      }
    },
    innocentsExplanationAr: 'باقي أفراد المعسكر مثل منصور وطارق وسلمى وخديجة كانوا في خيامهم أو يحرسون المياه والجمال، وأثبتت سجلات الحراسة الليلية براءتهم التامة.',
    innocentsExplanationEn: 'The rest of the camp (Mansour, Tariq, Salma, Khadija) remained verified at camp perimeter posts, water stations, and supply tents throughout the night.',
    sharedEvidenceAr: 'خيط المخطوط المقطوع، ومفتاح الصندوق الحجري، وآثار الحمض على اللوح المنقوش.',
    sharedEvidenceEn: 'Severed manuscript binding cord, bronze repository key marks, and acid traces on the stone.'
  },

  drowned_village: {
    storyId: 'drowned_village',
    culprits: {
      'فؤاد': {
        name: 'فؤاد',
        nameEn: 'Fouad',
        professionAr: 'كبير الغواصين ومسؤول السلامة البحرية',
        professionEn: 'Lead Deep-Sea Diver',
        actionAr: 'انتشل صندوق الأجراس الأثري من حطام الكنيسة المغمورة وأخفاه في خزان الضغط الخلفي.',
        actionEn: 'Salvaged the antique bell-chest from submerged ruins and stashed it inside the rear ballast tank.',
        motiveAr: 'بيعه في مزاد سري لآثار السفن الغارقة عبر وسيط أجنبي.',
        motiveEn: 'Traffic the sunken relic through illicit maritime auction rings for an offshore windfall.',
        methodAr: 'استغل رحلة الغوص الاستكشافية الأخيرة وفصل خط الأمان لدقائق لتحريك الصندوق.',
        methodEn: 'Detached his safety tether during the final dive to drag the heavy chest to the ballast inlet.',
        cluesAr: 'علامات الاحتكاك المعدني على حزام غوصه وبقايا الطحالب البحرية في خزان الضغط.',
        cluesEn: 'Metal friction scuffs on his diving harness and deep-sea silt inside the vessel ballast tank.'
      },
      'د. زياد': {
        name: 'د. زياد',
        nameEn: 'Dr. Ziad',
        professionAr: 'باحث الآثار البحرية والتنقيب المائي',
        professionEn: 'Marine Archaeologist',
        actionAr: 'زوّر تقرير فحص الموقع وادعى أن صندوق الأجراس انهار وتفتت تحت ضغط المياه.',
        actionEn: 'Falsified site dive logs, claiming the bell-chest had disintegrated under water pressure.',
        motiveAr: 'طمس القيمة الحقيقية للآثار المستخرجة لإخراجها من وصاية هيئة التراث الوطني.',
        motiveEn: 'Devalue the site registry to bypass national heritage tracking and enable private export.',
        methodAr: 'استخدم شريحة كاميرا مفبركة تُظهر حطاماً خاوياً لإقناع بقية الفريق بضياع الأثر.',
        methodEn: 'Swapped camera SD cards with pre-recorded empty footage to mislead the dive review board.',
        cluesAr: 'شريحة الذاكرة البديلة في حقيبة معداته والبيانات الزمنية المعدلة للصور.',
        cluesEn: 'The swapped SD memory card in his gear case and altered image timestamp metadata.'
      },
      'ماجد': {
        name: 'ماجد',
        nameEn: 'Majid',
        professionAr: 'فني قارب الأبحاث وصمامات الضغط',
        professionEn: 'Dive Boat Technician & Ballast Operator',
        actionAr: 'فرّغ هواء الخزان الجانبي لتهيئة مخبأ جاف للصندوق قبل رسو القارب في الميناء.',
        actionEn: 'Purged the starboard auxiliary ballast tank to create a dry concealment cache before docking.',
        motiveAr: 'الحصول على حصة مالية تمكنه من شراء قارب صيد مستقل والتقاعد.',
        motiveEn: 'Secure enough payoff money to purchase his own private charter vessel.',
        methodAr: 'تلاعب بصمامات التصريف الهيدروليكية من لوحة التحكم في غرفة المحركات.',
        methodEn: 'Manipulated hydraulic drainage valves from the engine room sub-panel during surface ascent.',
        cluesAr: 'سجل التلاعب بضغط الخزان الجانبي وتطابق أداة الربط مع براغي فتحة التفتيش.',
        cluesEn: 'Starboard tank pressure anomaly logs and wrench marks on the inspection hatch bolts.'
      }
    },
    innocentsExplanationAr: 'باقي الفريق مثل سارة وريما وسامي وطارق كانوا منشغلين بقياس نسب الأكسجين وفحص السونار وإدارة خطوط النجاة دون أي علم بما حدث في خزان الضغط.',
    innocentsExplanationEn: 'The remaining crew (Sarah, Rima, Sami, Tariq) were focused on oxygen ratios, sonar telemetry, and safety-line management with verified station logs.',
    sharedEvidenceAr: 'تغير ضغط الخزان الجانبي، وعلامات الاحتكاك بحزام الغوص، وشريحة الكاميرا البديلة.',
    sharedEvidenceEn: 'Starboard ballast pressure shift, harness abrasion marks, and the swapped camera memory card.'
  },

  arctic_station: {
    storyId: 'arctic_station',
    culprits: {
      'د. مروان': {
        name: 'د. مروان',
        nameEn: 'Dr. Marwan',
        professionAr: 'كبير باحثي الجيولوجيا والجليد',
        professionEn: 'Chief Paleoclimatologist',
        actionAr: 'سرق أسطوانة الجليد الأثرية الحاوية على بكتيريا ما قبل التاريخ وخبأها في حقيبة النيتروجين.',
        actionEn: 'Stole the prehistoric ice-core cylinder containing ancient enzymes and packed it into a nitrogen carrier.',
        motiveAr: 'تسجيل براءة اختراع طبية حصرية باسمه مع شركة أدوية كبرى بملايين الدولارات.',
        motiveEn: 'Secure exclusive pharmaceutical patent royalties with a multinational biotech syndicate.',
        methodAr: 'استغل شفرة الوصول لغرفة التجميد الفائق (-80) أثناء العاصفة الثلجية.',
        methodEn: 'Used cryogenic access codes to enter the -80°C vault during peak blizzard interference.',
        cluesAr: 'سجل فتح خزانة العينات المحمية وآثار النيتروجين السائل على قفازاته الحرارية.',
        cluesEn: 'Cryo-vault unlock timestamps and liquid nitrogen residue on his thermal field gloves.'
      },
      'ديمتري': {
        name: 'ديمتري',
        nameEn: 'Dimitri',
        professionAr: 'مهندس التبريد والطاقة الحيوية',
        professionEn: 'Cold-Storage & Power Engineer',
        actionAr: 'خرّب دارة التبريد الاحتياطية للإيحاء بأن العينة ذابت وتلفت بسبب عطل كهربائي.',
        actionEn: 'Sabotaged the backup refrigeration circuit to stage a fake thermal breakdown and mask the theft.',
        motiveAr: 'تلقى رشوة لتدمير أبحاث المحطة وتبرير خسارة العينات كحادث بيئي عارض.',
        motiveEn: 'Bribed to ruin station findings and write off the missing specimens as accidental spoilage.',
        methodAr: 'فصل صمام غاز الفريون وقطع كابل الحساس الحراري في القبو السفلي.',
        methodEn: 'Severed the thermal sensor line and bled freon refrigerant in the lower generator crawlway.',
        cluesAr: 'قاطع الأسلاك المعزول في صندوق أدواته وتسريب الفريون حول الصمام اليدوي.',
        cluesEn: 'Insulated wire-cutters in his tool chest and localized freon leaks around the manual valve.'
      },
      'كاتيا': {
        name: 'كاتيا',
        nameEn: 'Katia',
        professionAr: 'مسؤولة الاتصالات والرادار',
        professionEn: 'Communications & Radar Officer',
        actionAr: 'شفرت سجلات الرادار وأرسلت إحداثيات طائرة الإجلاء السرية لتهريب العينة.',
        actionEn: 'Scrambled radar telemetry and beamed rendezvous coordinates to an offshore extraction flight.',
        motiveAr: 'تأمين خروج آمن ومكافأة مالية ضخمة لمغادرة المحطة القطبية نهائياً.',
        motiveEn: 'Secure an extraction ticket and massive payout to leave the polar outpost permanently.',
        methodAr: 'استخدمت قناة التردد العالي المشفرة الخاصة بالطوارئ دون تسجيل البث في السجل العام.',
        methodEn: 'Used the emergency high-frequency channel to bypass the public transmission log.',
        cluesAr: 'حزمة البث اللاسلكي المشفرة غير الموثقة في السجل وتطابق توقيت الإرسال مع انقطاع الطاقة.',
        cluesEn: 'Encrypted outgoing radio burst logs matching the exact generator blackout window.'
      }
    },
    innocentsExplanationAr: 'باقي الفريق كالقائد بوريس والدكتورة إيلينا وسامر ولينا التزموا غرفهم أو باشروا صيانة المولدات وفق بروتوكول العواصف القطبية المعتمد دون أي مساس بخزائن العينات.',
    innocentsExplanationEn: 'Station Commander Boris, Dr. Elena, Samer, and Lina followed polar blizzard protocols in common living quarters and generator rooms without approaching the cryogenic chambers.',
    sharedEvidenceAr: 'انقطاع التبريد المتعمد، وبقايا النيتروجين السائل، والبث اللاسلكي المشفر.',
    sharedEvidenceEn: 'Intentional refrigerant bleed, liquid nitrogen canister traces, and encrypted radio transmission logs.'
  },

  film_set: {
    storyId: 'film_set',
    culprits: {
      'جلال': {
        name: 'جلال',
        nameEn: 'Jalal',
        professionAr: 'مدير الديكور والإكسسوارات التاريخية',
        professionEn: 'Props & Master Decorator',
        actionAr: 'استبدل خاتم البطولة الأثري الحقيقي بنسخة مقلدة من النحاس المطلي قبل تصوير المشهد الأخير.',
        actionEn: 'Substituted the genuine antique hero ring with a polished brass replica before the final take.',
        motiveAr: 'استعادة الخاتم العائلي الموروث الذي بيع في مزاد دون علمه قبل سنوات.',
        motiveEn: 'Reclaim a treasured family heirloom that had been auctioned off without his consent.',
        methodAr: 'استغل مسؤوليته المباشرة عن تسليم الإكسسوارات للممثلين وبدّل الصندوق المخملي.',
        methodEn: 'Exploited his role as prop master handing props to actors to swap the velvet presentation box.',
        cluesAr: 'بقايا طلاء النحاس على طاولة ورشته وعلبة المجوهرات المبطنة في حقيبته الخاصة.',
        cluesEn: 'Brass polish residue on his workbench and the lined jeweler pouch found in his bag.'
      },
      'كريم': {
        name: 'كريم',
        nameEn: 'Karim',
        professionAr: 'فني الإضاءة والمؤثرات الكهربائية',
        professionEn: 'Stage Lighting Technician',
        actionAr: 'فصل القاطع الرئيسي لكشافات المسرح لمدة 45 ثانية أثناء تبديل ملابس المشهد.',
        actionEn: 'Tripped the main spotlight circuit breaker for 45 seconds during the scene costume change.',
        motiveAr: 'تلقى مبلغاً مالياً لتوفير ثغرة الظلام التام داخل البلاتوه.',
        motiveEn: 'Paid off to create a total darkness blindspot across the main studio soundstage.',
        methodAr: 'سحب فيش التغذية المركزي من لوحة التحكم بجوار موقع تصوير المشهد الحاسم.',
        methodEn: 'Pulled the master feed breaker on the studio distribution board next to the set.',
        cluesAr: 'سجل انقطاع الطاقة اليدوي من لوحة الإضاءة وبصماته على مفتاح الطوارئ.',
        cluesEn: 'Manual power trip logs on the dimmer board and fingerprints on the emergency blackout switch.'
      },
      'ريتا': {
        name: 'ريتا',
        nameEn: 'Rita',
        professionAr: 'مشرفة الأزياء والملابس السينمائية',
        professionEn: 'Costume & Wardrobe Supervisor',
        actionAr: 'خبأت الخاتم الحقيقي داخل بطانة فستان البطولة لتمريره خارج الاستوديو مع شحنة المغسلة.',
        actionEn: 'Stitched the authentic diamond ring into the corset lining of the lead gown for laundry exit.',
        motiveAr: 'تمويل فيلمها المستقل الخاص بعد رفض شركات الإنتاج تمويل مشروعها السينمائي.',
        motiveEn: 'Fund her own independent directorial debut after major studios rejected her screenplay.',
        methodAr: 'استغلت غرفة تبديل الملابس السريعة لتخييط الخاتم في البطانة المزدوجة.',
        methodEn: 'Used the rapid change tent to stitch the artifact inside the reinforced gown seam.',
        cluesAr: 'خيوط الحرير المقواة المطابقة لبطانة الفستان ومقص الخياطة الصغير بجوار موقع الخاتم.',
        cluesEn: 'Reinforced silk thread matching the gown lining and miniature seam shears found in her kit.'
      }
    },
    innocentsExplanationAr: 'باقي طاقم الفيلم كالممثلة ميا والمخرج سامر ومهندس الصوت طارق كانوا متواجدين أمام الشاشات وغرف المونتاج بانتظار عودة الإضاءة لتصوير المشهد الأخير.',
    innocentsExplanationEn: 'The rest of the cast (Lead Actress Mia, DP Samer, Sound Tech Tariq) remained in the monitor village waiting for lights to restore to shoot the final take.',
    sharedEvidenceAr: 'انقطاع الإضاءة لـ 45 ثانية، والنسخة النحاسية المقلدة، وخيوط الحرير في بطانة الفستان.',
    sharedEvidenceEn: 'The 45-second blackout, the polished brass fake ring, and silk stitching in the gown lining.'
  },

  submarine: {
    storyId: 'submarine',
    culprits: {
      'مهند': {
        name: 'مهند',
        nameEn: 'Mohanad',
        professionAr: 'ضابط السونار والملاحة البحرية',
        professionEn: 'Sonar & Navigation Officer',
        actionAr: 'سحب شريحة بيانات الملاحة المشفرة لتغيير مسار الغواصة نحو إحداثيات سفينة غارقة.',
        actionEn: 'Removed the encrypted navigation telemetry card to reroute the vessel toward an uncharted wreck.',
        motiveAr: 'إجبار البعثة على توثيق موقع كنز حطام سفينة حربية قديمة كان يمتلك خريطتها سراً.',
        motiveEn: 'Force the sub to document a treasure galleon wreck whose coordinates he acquired privately.',
        methodAr: 'استغل لوحة الملاحة المتقدمة وفصل الشريحة أثناء عبور الأخدود المظلم.',
        methodEn: 'Accessed the primary navigation bay to pull the module while descending into the abyssal trench.',
        cluesAr: 'الشريحة المشفرة المخبأة في حجرة السونار ومطابقة وقت السحب مع انحراف البوصلة.',
        cluesEn: 'Encrypted drive recovered from the sonar station and compass deviation timing logs.'
      },
      'رامز': {
        name: 'رامز',
        nameEn: 'Ramez',
        professionAr: 'كبير مهندسي الدفع والمحركات',
        professionEn: 'Chief Propulsion Engineer',
        actionAr: 'تلاعب بضغط التوربين الرئيسي لإحداث هبوط اضطراري نحو قاع الأخدود المستهدف.',
        actionEn: 'Altered main turbine pressure to simulate engine stall, forcing an emergency descent toward the trench.',
        motiveAr: 'تقاسم أرباح توثيق الحطام وتفادي المساءلة عن إخفاقات المحرك السابقة.',
        motiveEn: 'Share in salvage profits and escape scrutiny for prior unreported engine valve overhauls.',
        methodAr: 'أغلق صمام التغذية الوقودية الثانوية يدوياً من غرفة المحركات الخلفية.',
        methodEn: 'Manually choked the auxiliary fuel bypass valve in the aft propulsion bay.',
        cluesAr: 'مفتاح الصمام المعزول وبصمات الزيت الهيدروليكي على صمام التوربين رقم 2.',
        cluesEn: 'Isolated valve wrench and hydraulic oil prints on the turbine #2 override lever.'
      },
      'دانية': {
        name: 'دانية',
        nameEn: 'Dania',
        professionAr: 'أخصائية بيانات المحيطات والمسح السيزمي',
        professionEn: 'Oceanographic Data Specialist',
        actionAr: 'مسحت السجلات الصوتية الحقيقية وسجلت صدى مضللاً يوحي بوجود خطر تصادم وهمي.',
        actionEn: 'Erased acoustic sonar logs and injected synthetic echo feedback simulating an impending hull collision.',
        motiveAr: 'تأمين مسار الغوص السري دون أن تكتشف محطة المراقبة الساحلية تغيير الاتجاه.',
        motiveEn: 'Mask the unauthorized dive path from coastal monitoring stations and satellite uplinks.',
        methodAr: 'قامت بتشغيل ملف محاكاة مسجل مسبقاً عبر حاسوب تحليل الأعماق.',
        methodEn: 'Loaded a pre-recorded simulation file into the depth-mapping workstation.',
        cluesAr: 'الملف الصوتي المفبرك المسترجع من سلة المحذوفات وتطابق شفرة الحقن البرمجية.',
        cluesEn: 'Recovered dummy acoustic audio file in the recycle buffer and injected code signatures.'
      }
    },
    innocentsExplanationAr: 'باقي الطاقم كالقبطان طارق ومسؤول الضغط سامي وخالد كانوا يتبعون بروتوكول الهبوط الاضطراري ويحاولون الحفاظ على اتزان الغواصة دون علم بالتلاعب المسبق.',
    innocentsExplanationEn: 'The remaining crew (Captain Tariq, Pressure Tech Sami, Khaled) were managing emergency dive trim and life-support ballast with complete verified diligence.',
    sharedEvidenceAr: 'انحراف البوصلة المفاجئ، وشريحة الملاحة المسحوبة، وصمام التوربين المغلق يدوياً.',
    sharedEvidenceEn: 'Abrupt compass drift, extracted navigation module, and manual turbine valve choking.'
  },

  court: {
    storyId: 'court',
    culprits: {
      'عادل': {
        name: 'عادل',
        nameEn: 'Adel',
        professionAr: 'أمين سر المحكمة وسجلات القضايا',
        professionEn: 'Court Records Clerk & Secretary',
        actionAr: 'أتلف مستند الإدانة الأصلي من داخل غرفة الأدلة واستبدله بورقة بيضاء ملغية.',
        actionEn: 'Destroyed the primary conviction document in the evidence vault and replaced it with a blank dossier.',
        motiveAr: 'الحصول على رشوة مالية ضخمة من محامي الدفاع لتبرئة المتهم الرئيسي قبل النطق بالحكم.',
        motiveEn: 'Received a massive bribery payoff to exonerate the high-profile defendant before sentencing.',
        methodAr: 'استغل مفتاح غرفة السجلات المودع لديه لدخول القبو أثناء الاستراحة القضائية.',
        methodEn: 'Used his authorized archive key to slip into the evidence lockup during judicial recess.',
        cluesAr: 'بقايا الورق الممزق في آلة إتلاف الأوراق الخاصة بمكتبه وختم القيد الممسوح.',
        cluesEn: 'Shredded document fibers in his private office shredder and wiped ledger entry stamps.'
      },
      'المستشار منصور': {
        name: 'المستشار منصور',
        nameEn: 'Counselor Mansour',
        professionAr: 'المساعد القضائي الأول',
        professionEn: 'Senior Judicial Assistant',
        actionAr: 'أخّر توثيق ملف القضية في المنظومة الإلكترونية لمنع التدقيق المسبق قبل الجلسة.',
        actionEn: 'Delayed digital filing in the judicial database to prevent automated pre-session audit checks.',
        motiveAr: 'التستر على تضارب مصالح مالي سابق يربطه بالشركات المتورطة في القضية.',
        motiveEn: 'Conceal a past financial conflict of interest linking him to the indicted syndicate firm.',
        methodAr: 'علق المزامنة السحابية بحجة تحديث نظام التشفير الداخلي للمحكمة.',
        methodEn: 'Suspended cloud registry sync under the pretense of an internal encryption update.',
        cluesAr: 'سجل تأخير المزامنة اليدوي من حسابه وتطابق رمز الإلغاء مع محطته الشخصية.',
        cluesEn: 'Manual database sync delay logs and authorization codes originating from his desktop terminal.'
      },
      'سلمى': {
        name: 'سلمى',
        nameEn: 'Salma',
        professionAr: 'أمينة خزينة الأدلة والأحراز الجنائية',
        professionEn: 'Evidence Vault Custodian',
        actionAr: 'فتحت الخزانة الفولاذية دون تسجيل رقم الإذن القضائي في السجل الورقي.',
        actionEn: 'Unlocked the steel evidence safe without logging the judicial warrant number in the logbook.',
        motiveAr: 'تسهيل وصول المتواطئين لإتلاف الأحراز مقابل وعد بترقيتها ونقلها لمنصب دبلوماسي.',
        motiveEn: 'Facilitate safe access in exchange for guaranteed career advancement to a diplomatic post.',
        methodAr: 'استخدمت الرقم السري اليومي وعطلت كاميرا مدخل الخزينة بستار التفتيش.',
        methodEn: 'Used the daily combination code while masking the vault entrance camera with an inspection screen.',
        cluesAr: 'بصمات أصابعها على مزلاج الخزانة الداخلي والصفحة الممزقة من دفتر توثيق الأحراز.',
        cluesEn: 'Her fingerprints on the inner safe bolt and the missing page in the physical vault logbook.'
      }
    },
    innocentsExplanationAr: 'باقي الحضور كالقاضي ومسؤول الأمن نادر والمحامية هدى والمحققة ريم كانوا يراجعون المذكرات القانونية ويؤمنون قاعة الجلسة دون أي وصول لخزينة الأحراز السرية.',
    innocentsExplanationEn: 'The judge, Bailiff Nader, Attorney Huda, and Investigator Reem reviewed legal briefs and secured the courtroom with verified public presence.',
    sharedEvidenceAr: 'الملف المستبدل في الخزانة الفولاذية، وأوراق الإتلاف المفرومة، وسجل المزامنة المعطل.',
    sharedEvidenceEn: 'Substituted safe dossier, shredded evidence fibers, and suppressed cloud database sync logs.'
  },

  greenhouse: {
    storyId: 'greenhouse',
    culprits: {
      'د. سهيل': {
        name: 'د. سهيل',
        nameEn: 'Dr. Souhail',
        professionAr: 'خبير علم النبات الجيني والهندسة الوراثية',
        professionEn: 'Lead Genetic Botanist',
        actionAr: 'قطف النبتة الطبية النادرة ومحا السجل الجيني من حاسوب الدفيئة المركزي.',
        actionEn: 'Harvested the rare pharmaceutical hybrid orchid and purged genetic sequencing logs from the main terminal.',
        motiveAr: 'إنتاج العقار في مختبره الخاص خارج البلاد واحتكار العوائد المالية لصالحه.',
        motiveEn: 'Synthesize the life-saving compound in an offshore private lab to retain 100% of global drug profits.',
        methodAr: 'استخدم مشرطاً جراحياً معقماً لقطع الساق الرئيسية وتخزينها في أنبوب تبريد محكم.',
        methodEn: 'Used a sterile surgical scalpel to excise the stem and sealed it in a pressurized cryo-vial.',
        cluesAr: 'أثر القطع الجراحي الدقيق على النبات الأم وأنبوب النيتروجين المفقود من خزانته.',
        cluesEn: 'Precision surgical cut marks on the mother plant and the missing cryo-tube from his rack.'
      },
      'باسم': {
        name: 'باسم',
        nameEn: 'Bassem',
        professionAr: 'فني أنظمة الري والمناخ الآلي',
        professionEn: 'Irrigation & Climate Systems Tech',
        actionAr: 'شغّل نظام الرذاذ الكثيف لحجب الرؤية داخل الدفيئة ومسح آثار الأقدام.',
        actionEn: 'Triggered high-density misting cycles to obscure visibility inside the dome and wash away footprints.',
        motiveAr: 'الحصول على حصة مالية لتسديد التزاماته ومساعدته في تأمين خروج النبتة.',
        motiveEn: 'Receive a financial payoff to pay off debts and assist in smuggling the specimen past security.',
        methodAr: 'عدّل مؤقتات الرشاشات اليدوية من لوحة تحكم الرطوبة المركزية.',
        methodEn: 'Overrode automated sprinkler timers from the central humidity regulation board.',
        cluesAr: 'سجل التعديل اليدوي على دورة الرذاذ وبقع الماء الكثيفة حول لوحة المفاتيح.',
        cluesEn: 'Manual override logs on the misting system and concentrated water pooling by the controls.'
      },
      'ديمة': {
        name: 'ديمة',
        nameEn: 'Deema',
        professionAr: 'أخصائية زراعة الأنسجة النباتية',
        professionEn: 'Tissue Culture Lab Specialist',
        actionAr: 'نسخت الشيفرة الجينية للنبتة على ذاكرة وميضية مشفرة وحذفت النسخ الاحتياطية.',
        actionEn: 'Cloned the plant gene-sequence onto an encrypted flash drive and deleted cloud backup copies.',
        motiveAr: 'تأمين مستقبلها الأكاديمي والعمل كشريكة أبحاث في المختبر الدولي الجديد.',
        motiveEn: 'Secure a lucrative co-founder research role in the new international biotechnology firm.',
        methodAr: 'استخدمت بطاقة الوصول لمختبر الأنسجة لمسح بنك الجينات قبل انطلاق الإنذار.',
        methodEn: 'Used laboratory keycard clearances to access the gene-bank terminal right before the breach.',
        cluesAr: 'الذاكرة المشفرة في حقيبتها وبقايا ملف التصدير على حاسوب زراعة الأنسجة.',
        cluesEn: 'Encrypted USB drive found in her satchel and export buffer logs on the tissue culture workstation.'
      }
    },
    innocentsExplanationAr: 'باقي الباحثين كالدكتورة ليلى وطارق ورامي وسلمى كانوا يقومون بتسجيل عينات التربة وحراسة المداخل العامة وفق الجداول المعتمدة دون أي دخول لغرفة الاستنبات الحساسة.',
    innocentsExplanationEn: 'The other botanists (Dr. Layla, Tariq, Rami, Salma) conducted routine soil testing and general greenhouse patrols with verified logs outside the isolated incubator.',
    sharedEvidenceAr: 'القطع الجراحي الدقيق للساق، ودورة الرذاذ الكثيف غير المجدولة، وحذف السجل الجيني.',
    sharedEvidenceEn: 'Surgical stem incision, unscheduled heavy misting cycle, and purged genetic sequencing archives.'
  },

  royal_kitchen: {
    storyId: 'royal_kitchen',
    culprits: {
      'شادي': {
        name: 'شادي',
        nameEn: 'Shadi',
        professionAr: 'رئيس الخدم الخاص بالقصر الملكي',
        professionEn: 'Royal Head Butler',
        actionAr: 'سحب الرسالة الملكية المختومة من صينية التقديم أثناء عبور الممر المظلم.',
        actionEn: 'Intercepted the sealed royal decree letter from the silver service platter in the service corridor.',
        motiveAr: 'الرسالة تتضمن أمراً ملكياً بعزل عائلته من منصب التشريفات والمراسم المتوارث.',
        motiveEn: 'The decree ordered the immediate dismissal and stripping of his family royal ceremonial titles.',
        methodAr: 'استغل انشغال الحراس بتقديم الأطباق الرئيسية وأخفى الرسالة في طيات سترته الرسمية.',
        methodEn: 'Leveraged the rush of main banquet courses to conceal the parchment inside his formal coat lining.',
        cluesAr: 'بقايا الشمع الأحمر الملكي المكسور في جيب سترته ومطابقة توقيت مروره في الممر.',
        cluesEn: 'Red royal wax seal flakes in his coat pocket and his verified presence in the pantry corridor.'
      },
      'مروان': {
        name: 'مروان',
        nameEn: 'Marwan',
        professionAr: 'كبير طهاة الحلويات الملكية',
        professionEn: 'Executive Pastry Chef',
        actionAr: 'أعدّ غطاء التقديم الفضي المزدوج لإخفاء الرسالة وتمريرها نحو مخزن التموين.',
        actionEn: 'Constructed a false-bottomed silver banquet cloche to smuggle the letter into the dry pantry.',
        motiveAr: 'الحصول على دعم مالي لافتتاح سلاسل مخابز فاخرة في العواصم المجاورة.',
        motiveEn: 'Secure massive financial backing to launch luxury bakery chains across neighboring capitals.',
        methodAr: 'وضع الرسالة في التجويف السفلي لصينية الحلوى الذهبية أثناء خروجها من المطبخ.',
        methodEn: 'Slid the parchment into the hollow base of the grand dessert platter during final plating.',
        cluesAr: 'آثار سكر التزيين على حواف الرسالة المسترجعة والغطاء الفضي المعدل.',
        cluesEn: 'Confectioner sugar dusting on the recovered envelope and the modified platter base.'
      },
      'هند': {
        name: 'هند',
        nameEn: 'Hind',
        professionAr: 'منسقة مائدة التشريفات الملكية',
        professionEn: 'Royal Table Decorator & Sommelier',
        actionAr: 'أطفأت شمعدانات الممر الخلفي لمدة دقيقة بحجة تغيير الشموع المعيبة لخلق ساتر مظلم.',
        actionEn: 'Extinguished the service corridor candelabras under the guise of replacing defective candles.',
        motiveAr: 'الانتقام من كاتب البلاط الذي حرم شقيقها من منحة البعثة الدبلوماسية.',
        motiveEn: 'Retaliate against the royal scribe who revoked her brother diplomatic academy scholarship.',
        methodAr: 'استخدمت قاطعة الشموع النحاسية لإطفاء 6 شموع دفعة واحدة في ممر الخدمة.',
        methodEn: 'Used a copper candle snuffer to douse all corridor candles simultaneously.',
        cluesAr: 'قاطعة الشموع التي تحمل آثار الشمع الطازج ومطابقة توقيت الظلام مع اختفاء الرسالة.',
        cluesEn: 'Candle snuffer bearing fresh wax and corridor darkness timing aligning with the platter transit.'
      }
    },
    innocentsExplanationAr: 'باقي الطهاة والخدم كالشيف نبيل وحارس القصر فارس وجميلة وسامر كانوا متواجدين في مواقعهم الرسمية لإعداد الوليمة وتقديمها وفق البروتوكول الصارم.',
    innocentsExplanationEn: 'The remaining kitchen staff (Chef Nabil, Guard Captain Faris, Jamila, Samer) were stationed at cooking ranges and banquet checkpoints under constant mutual supervision.',
    sharedEvidenceAr: 'بقايا الشمع الملكي الأحمر، وغطاء الصينية المزدوج، والشموع المطفأة في ممر الخدمة.',
    sharedEvidenceEn: 'Red royal wax flakes, false-bottomed dessert platter, and extinguished corridor candelabras.'
  },

  gala_toast: {
    storyId: 'gala_toast',
    culprits: {
      'سامية': {
        name: 'سامية',
        nameEn: 'Samia',
        professionAr: 'محامية العائلة والمستشارة القانونية',
        professionEn: 'Family Estate Lawyer',
        actionAr: 'استبدلت جرعة الدواء المعتادة بجرعة مضاعفة قاتلة ودستها في كأس مراد.',
        actionEn: 'Substituted Murad regular medication with a lethal concentrated dose into his champagne glass.',
        motiveAr: 'اكتشافها أن مراد ينوي تعديل الوصية وإلغاء حصتها وأتعاب إدارتها الائتمانية.',
        motiveEn: 'Discovered Murad planned to rewrite his final testament, stripping her of trust management fees.',
        methodAr: 'استغلت الدقائق التي بقي فيها الكأس دون مراقبة على الطاولة الجانبية.',
        methodEn: 'Exploited the minutes Murad champagne flute sat unattended on the terrace side table.',
        cluesAr: 'علبة الدواء المفرغة في حقيبتها والحديث المتوتر المسجل بينها وبين مراد قبل الحادثة.',
        cluesEn: 'Empty medication blister pack in her clutch and heated argument overheard in the rear hallway.'
      },
      'د. كريم': {
        name: 'د. كريم',
        nameEn: 'Dr. Kareem',
        professionAr: 'الطبيب الخاص لمراد',
        professionEn: 'Personal Physician',
        actionAr: 'جهّز المركب الدوائي المركز وقدم تعليمات مضللة لطاقم الإسعاف لتأخير التدخل.',
        actionEn: 'Compounded the lethal concentrated dosage and provided misleading initial triage advice.',
        motiveAr: 'منع مراد من كشف إهمال طبي سابق أدى إلى وفاة شريك تجاري في مستشفاه الخاص.',
        motiveEn: 'Prevent Murad from exposing past clinical malpractice that caused a fatal investor death.',
        methodAr: 'صرف الجرعة المركزة من عيادته الخاصة وسلمها بذريعة تجربة علاجية جديدة.',
        methodEn: 'Dispensed the high-concentration ampoule from his private clinic under an experimental label.',
        cluesAr: 'سجل صرف الدواء من عيادته الخاصة وزجاجة المحلول المطابقة لمحتوى الكأس.',
        cluesEn: 'Prescription logs from his private practice and chemical residue matching the glass contents.'
      },
      'فارس': {
        name: 'فارس',
        nameEn: 'Faris',
        professionAr: 'الشريك التجاري والمدير المالي',
        professionEn: 'Business Partner & CFO',
        actionAr: 'شتّت انتباه مراد والضيوف في الشرفة لضمان بقاء الكأس دون حراسة.',
        actionEn: 'Distracted Murad and terrace guests with an impromptu toast to leave the champagne glass unguarded.',
        motiveAr: 'تفادي تدقيق مالي وشيك كان سيكشف اختلاسات بملايين الدولارات من حسابات الشركة المشتركة.',
        motiveEn: 'Avert a scheduled forensic audit that would expose millions in embezzled corporate funds.',
        methodAr: 'دعا مراد لمشاهدة الألعاب النارية من زاوية الشرفة البعيدة بينما وُضع السم في الكأس.',
        methodEn: 'Steered Murad toward the balcony fireworks viewing rail while the drink was spiked.',
        cluesAr: 'سجلات التحويلات المالية المشبوهة وتطابق مسار وقوفه مع توقيت دس المركب.',
        cluesEn: 'Embezzlement audit records and timeline placing him at the terrace staging point.'
      }
    },
    innocentsExplanationAr: 'باقي الحضور كمنسقة الحفل هند والساقي طارق وسكرتيرته منى وحارس الأمن عمر كانوا يقومون بخدمة الضيوف وتنسيق بروتوكول الحفل دون أي صلة بالخلافات المالية والوصية.',
    innocentsExplanationEn: 'The other guests and staff (Event Hostess Hind, Bartender Tariq, Secretary Mona, Guard Omar) attended to guests with verified public interactions throughout the gala.',
    sharedEvidenceAr: 'كأس الشمبانيا المسمم، وعلبة الدواء المفرغة، والحديث المتوتر في الممر الخلفي.',
    sharedEvidenceEn: 'The spiked champagne glass, empty concentrated medication vial, and corridor argument logs.'
  }
};

/**
 * Generates a comprehensive, dynamic final solution tailored to the actual selected culprits.
 */
export class StorySolutionEngine {
  /**
   * Builds the complete solution text for the game outcome
   */
  static generateSolution(
    story: Story | StoryData,
    guiltyPlayers: Array<Player | PlayerData>,
    innocentPlayers?: Array<Player | PlayerData>,
    language: string = 'ar'
  ): string {
    const isEn = language === 'en';
    const caseData = STORY_DEDUCTION_DATABASE[story.id];

    if (!caseData || !guiltyPlayers || guiltyPlayers.length === 0) {
      // Fallback to static solution
      return story.solution?.trim()
        ? story.solution
        : isEn
        ? 'The culprits have been identified and the investigation is successfully closed.'
        : 'تم كشف الفاعلين واكتمال التحقيق بنجاح.';
    }

    const culpritsData: GuiltyProfile[] = [];
    guiltyPlayers.forEach(p => {
      const charName = p.character.name;
      // Match by exact name or partial
      const foundKey = Object.keys(caseData.culprits).find(
        k => k === charName || charName.includes(k) || k.includes(charName)
      );
      if (foundKey) {
        culpritsData.push(caseData.culprits[foundKey]);
      } else {
        // Strict error: no generic fallback allowed in production
        throw new Error(
          `Story ${story.id}: selected guilty character "${p.character.name}" has no GuiltyProfile in STORY_DEDUCTION_DATABASE.`
        );
      }
    });

    if (culpritsData.length === 0) {
      return story.solution || (isEn ? 'The investigation is complete.' : 'تم اكتمال التحقيق.');
    }

    const count = culpritsData.length;

    if (isEn) {
      let whoHeader = '';
      if (count === 1) {
        whoHeader = `${culpritsData[0].nameEn} (${culpritsData[0].professionEn}) acted alone to execute the crime.`;
      } else if (count === 2) {
        whoHeader = `${culpritsData[0].nameEn} (${culpritsData[0].professionEn}) and ${culpritsData[1].nameEn} (${culpritsData[1].professionEn}) coordinated together to carry out the crime.`;
      } else {
        const names = culpritsData.map(c => `${c.nameEn} (${c.professionEn})`).join(', ');
        whoHeader = `${names} formed a coordinated conspiracy, each fulfilling specific roles to execute the crime.`;
      }

      const actionsText = culpritsData.map(c => `• ${c.nameEn}: ${c.actionEn}`).join('\n');
      const motivesText = culpritsData.map(c => `• ${c.nameEn}: ${c.motiveEn}`).join('\n');
      const methodsText = culpritsData.map(c => `• ${c.nameEn}: ${c.methodEn}`).join('\n');
      const cluesText = culpritsData.map(c => `• ${c.nameEn}: ${c.cluesEn}`).join('\n');

      return `Who is the Culprit?
${whoHeader}

What did they do?
${actionsText}

Why did they do it? (Motive)
${motivesText}

How was the crime executed?
${methodsText}

Which clues pointed to them?
${cluesText}
• Shared Evidence: ${caseData.sharedEvidenceEn}

Why were the other suspects innocent?
${caseData.innocentsExplanationEn}`;
    } else {
      // Arabic Formatting
      let whoHeader = '';
      if (count === 1) {
        whoHeader = `${culpritsData[0].name} (${culpritsData[0].professionAr}) نفّذ الجريمة بمفرده.`;
      } else if (count === 2) {
        whoHeader = `تواطأ كلاً من ${culpritsData[0].name} (${culpritsData[0].professionAr}) و${culpritsData[1].name} (${culpritsData[1].professionAr}) معاً لتنفيذ الجريمة بتنسيق مشترك.`;
      } else {
        const names = culpritsData.map(c => `${c.name} (${c.professionAr})`).join('، و');
        whoHeader = `شكّل كل من ${names} شبكة تآمرية متكاملة الأدوار، حيث وزعوا المهام بينهم لإحكام تنفيذ الجريمة.`;
      }

      const actionsText = culpritsData.map(c => `• ${c.name}: ${c.actionAr}`).join('\n');
      const motivesText = culpritsData.map(c => `• ${c.name}: ${c.motiveAr}`).join('\n');
      const methodsText = culpritsData.map(c => `• ${c.name}: ${c.methodAr}`).join('\n');
      const cluesText = culpritsData.map(c => `• ${c.name}: ${c.cluesAr}`).join('\n');

      return `من هو الفاعل؟
${whoHeader}

ماذا فعلوا؟
${actionsText}

لماذا فعلوا ذلك؟ (الدوافع)
${motivesText}

كيف نُفّذت الجريمة؟
${methodsText}

أي الأدلة أشارت إليهم؟
${cluesText}
• الأدلة المشتركة: ${caseData.sharedEvidenceAr}

لماذا كان باقي المشتبه بهم أبرياء؟
${caseData.innocentsExplanationAr}`;
    }
  }

  /**
   * Normalizes Arabic text for robust name matching
   */
  public static normalizeArabic(text: string): string {
    if (!text) return '';
    return text
      .trim()
      .replace(/[\u064B-\u065F\u0670]/g, '') // Remove tashkeel/diacritics
      .replace(/[إأآا]/g, 'ا')               // Normalize Alef variations
      .replace(/ة/g, 'ه')                    // Normalize Ta Marbuta
      .replace(/ى/g, 'ي')                    // Normalize Alef Maksura
      .replace(/[\s\-_]+/g, ' ')             // Normalize spaces/dashes
      .toLowerCase();
  }

  /**
   * Validates that every guiltyPool candidate has a corresponding GuiltyProfile,
   * and that every GuiltyProfile in STORY_DEDUCTION_DATABASE corresponds to a guiltyPool candidate.
   * Throws an Error if any mismatch is found.
   */
  static validateStoryProfiles(story: Story | StoryData): void {
    const caseData = STORY_DEDUCTION_DATABASE[story.id];
    if (!caseData) {
      throw new Error(`Story "${story.id}" has no entry in STORY_DEDUCTION_DATABASE.`);
    }

    const guiltyNames = (story.guiltyPool || []).map(g => g.name);
    const profileKeys = Object.keys(caseData.culprits);

    const missingProfiles: string[] = [];
    for (const gName of guiltyNames) {
      const hasMatch = profileKeys.some(
        pk => pk === gName ||
              StorySolutionEngine.normalizeArabic(pk) === StorySolutionEngine.normalizeArabic(gName) ||
              caseData.culprits[pk]?.nameEn.toLowerCase() === gName.toLowerCase()
      );
      if (!hasMatch) {
        missingProfiles.push(gName);
      }
    }

    const extraProfiles: string[] = [];
    for (const pk of profileKeys) {
      const prof = caseData.culprits[pk];
      const hasMatch = guiltyNames.some(
        gn => gn === pk ||
              StorySolutionEngine.normalizeArabic(gn) === StorySolutionEngine.normalizeArabic(pk) ||
              prof.nameEn.toLowerCase() === gn.toLowerCase()
      );
      if (!hasMatch) {
        extraProfiles.push(pk);
      }
    }

    if (missingProfiles.length > 0 || extraProfiles.length > 0) {
      const parts: string[] = [];
      if (missingProfiles.length > 0) {
        parts.push(`guiltyPool character(s) without profile: [${missingProfiles.join(', ')}]`);
      }
      if (extraProfiles.length > 0) {
        parts.push(`GuiltyProfile(s) without guiltyPool character: [${extraProfiles.join(', ')}]`);
      }
      throw new Error(`Story "${story.id}" has GuiltyProfile mismatch: ${parts.join('; ')}`);
    }
  }

  /**
   * Non-throwing checker that returns mismatch details.
   */
  static checkStoryProfiles(story: Story | StoryData): {
    valid: boolean;
    missingProfiles: string[];
    extraProfiles: string[];
  } {
    const caseData = STORY_DEDUCTION_DATABASE[story.id];
    if (!caseData) {
      return {
        valid: false,
        missingProfiles: (story.guiltyPool || []).map(g => g.name),
        extraProfiles: []
      };
    }

    const guiltyNames = (story.guiltyPool || []).map(g => g.name);
    const profileKeys = Object.keys(caseData.culprits);

    const missingProfiles = guiltyNames.filter(gName => {
      return !profileKeys.some(
        pk => pk === gName ||
              StorySolutionEngine.normalizeArabic(pk) === StorySolutionEngine.normalizeArabic(gName) ||
              caseData.culprits[pk]?.nameEn.toLowerCase() === gName.toLowerCase()
      );
    });

    const extraProfiles = profileKeys.filter(pk => {
      const prof = caseData.culprits[pk];
      return !guiltyNames.some(
        gn => gn === pk ||
              StorySolutionEngine.normalizeArabic(gn) === StorySolutionEngine.normalizeArabic(pk) ||
              prof.nameEn.toLowerCase() === gn.toLowerCase()
      );
    });

    return {
      valid: missingProfiles.length === 0 && extraProfiles.length === 0,
      missingProfiles,
      extraProfiles
    };
  }
}
