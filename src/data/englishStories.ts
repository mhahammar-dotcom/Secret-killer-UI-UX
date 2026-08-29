// Complete English Localized Story Data for Secret Killer
// Provides full English translations for all 13 built-in cases,
// matching the 3 guilty and 9 innocent characters 1-to-1 with the Arabic source of truth.

import { StoryData } from '../types';

export const ENGLISH_STORIES: Record<string, Partial<StoryData>> = {
  "dreams": {
    "title": "City of Dreams",
    "description": "A crime committed inside a shared lucid dream. The truth is fragmented across simulated memories, security logs, and the neural Core.",
    "introduction": {
      "setting": "Neural Research Facility - Sublevel 4, where test minds are linked to a synchronized neural network each night to test the \"Core\" technology.",
      "situation": "Tonight is the final stress test before presenting the breakthrough project to prime investors. Everyone in the cleanroom is linked to the same dreamscape, sharing identical memories and corridors.",
      "incident": "At 21:43, an unmapped corridor materialized on the simulation grid. Minutes later, a critical partition of the Core vanished, wiping out complete blocks of the shared memory archive.",
      "stakes": "Without the Core, the simulation could collapse entirely, trapping everyone inside the dream longer than their neural synapses can endure.",
      "objective": "Before an emergency forced-awakening occurs, you must identify who opened the forbidden corridor and who is concealing the truth."
    },
    "solution": "Who is the Culprit?\nNader (Lead Core Systems Programmer), aided by conspirators inside the facility.\n\nWhat did they do?\nExploited elevated system credentials to open an unmapped bypass corridor at 21:43, cloned a proprietary Core module, and initiated a memory buffer purge.\n\nWhy did they do it?\nTo sell the proprietary neural algorithm to a rival tech conglomerate for a multimillion-dollar payout prior to clinical trials.\n\nHow was the crime committed?\nUsed an emergency admin bypass key during the synchronized REM cycle while all participants were immobilized in deep dream immersion.\n\nWhich clues pointed to them?\nThe precise timestamp of the corridor breach (21:43), the level-4 root access required to trigger a memory purge, and unauthorized badge scans.",
    "guiltyPool": [
      {
        "name": "Dr. Firas",
        "profession": "Lead Neuroscientist",
        "publicIdentity": "You are Dr. Firas, serving as the Lead Neuroscientist.",
        "knowledge": "In-universe testimony regarding the incident: تعلم أن د. مريم كانت تعارض نشر النتائج وتطالب بمراجعة إضافية، ورأيت كريم يفحص كابلات التبريد قبل ربع ساعة من الإنذار.",
        "guilty": true
      },
      {
        "name": "Karim",
        "profession": "Systems & Network Engineer",
        "publicIdentity": "You are Karim, serving as the Systems & Network Engineer.",
        "knowledge": "In-universe testimony regarding the incident: محطة التحكم المفتوحة في الممر كانت مسجلة الدخول بحساب مشترك مفتوح الصلاحيات، وسبق أن طلبت د. مريم مراجعة تقارير التدقيق.",
        "guilty": true
      },
      {
        "name": "Yasmine",
        "profession": "AI Research Assistant",
        "publicIdentity": "You are Yasmine, serving as the AI Research Assistant.",
        "knowledge": "In-universe testimony regarding the incident: رأيت أمراً مجدولاً لتصدير البيانات في قائمة الانتظار عند 11:15 دون تحديد هوية المستخدم.",
        "guilty": true
      }
    ],
    "innocentPool": [
      {
        "name": "Dr. Maryam",
        "profession": "Clinical Neurophysiologist",
        "publicIdentity": "You are Dr. Maryam, serving as the Clinical Neurophysiologist.",
        "knowledge": "In-universe testimony regarding the incident: رأيت شخصاً يرتدي معطف المختبر الأبيض يعبر الممر نحو جناح الخوادم عند 11:38، وتناقشتِ مع كريم حول إعدادات حرارة الغرفة سابقاً.",
        "guilty": false
      },
      {
        "name": "Tariq",
        "profession": "EEG Systems Technician",
        "publicIdentity": "You are Tariq, serving as the EEG Systems Technician.",
        "knowledge": "In-universe testimony regarding the incident: سمعت خطوات مسرعة في ممر جناح الخوادم عند 11:40، وظننت أن كريم يقوم بجولة تفقدية للمعدات.",
        "guilty": false
      },
      {
        "name": "Sami",
        "profession": "Volunteer Coordinator",
        "publicIdentity": "You are Sami, serving as the Volunteer Coordinator.",
        "knowledge": "In-universe testimony regarding the incident: جميع المتطوعين الخارجيين غادروا المختبر في تمام العاشرة والنصف، ولم يبق في الجناح سوى الفريق الداخلي.",
        "guilty": false
      },
      {
        "name": "Lubna",
        "profession": "Lab Safety & Security Officer",
        "publicIdentity": "You are Lubna, serving as the Lab Safety & Security Officer.",
        "knowledge": "In-universe testimony regarding the incident: صمام الغاز اليدوي تم إغلاقه بمفتاح الطوارئ المعلق في غرفة التحضير المشتركة.",
        "guilty": false
      },
      {
        "name": "Nader",
        "profession": "HVAC & Climate Tech",
        "publicIdentity": "You are Nader, serving as the HVAC & Climate Tech.",
        "knowledge": "In-universe testimony regarding the incident: صمام مبرد الخادم أغلق يدوياً باليد المجردة دون الحاجة إلى أدوات سباكة معقدة.",
        "guilty": false
      },
      {
        "name": "Hind",
        "profession": "Legal & Intellectual Property Director",
        "publicIdentity": "You are Hind, serving as the Legal & Intellectual Property Director.",
        "knowledge": "In-universe testimony regarding the incident: المعهد تلقى عرضين استثماريين متنافسين، وكان هناك ضغط شديد لنشر النتائج أولاً.",
        "guilty": false
      },
      {
        "name": "Bassem",
        "profession": "Night Reception & Gate Guard",
        "publicIdentity": "You are Bassem, serving as the Night Reception & Gate Guard.",
        "knowledge": "In-universe testimony regarding the incident: البوابات الإلكترونية الخارجية ظلت مقفلة بالكامل طوال الليل ولم يغادر أحد المنشأة.",
        "guilty": false
      },
      {
        "name": "Lama",
        "profession": "Medical Data Analyst",
        "publicIdentity": "You are Lama, serving as the Medical Data Analyst.",
        "knowledge": "In-universe testimony regarding the incident: أمر المسح التخريبي استغرق 90 ثانية لاكتماله، وبدأ تنفيذه بالتحديد عند 11:41:30.",
        "guilty": false
      },
      {
        "name": "Omar",
        "profession": "Equipment & Vault Custodian",
        "publicIdentity": "You are Omar, serving as the Equipment & Vault Custodian.",
        "knowledge": "In-universe testimony regarding the incident: شريحة تخزين مشفرة فائقة السعة صُرفت صباحاً لغايات المعايرة الدورية للأجهزة.",
        "guilty": false
      }
    ],
    "clues": [
      "21:43: An unmapped corridor outside the global layout was opened using elevated administrative credentials.",
      "21:47: The Core module was shifted from its vault, followed immediately by missing surveillance footage.",
      "After the breach, a keycard was detected that should have been completely inactive at that hour."
    ]
  },
  "museum": {
    "title": "The Black Museum Heist",
    "description": "A priceless masterpiece vanishes from an underground vault during closing hours. Someone on the inside disabled the lasers.",
    "introduction": {
      "setting": "In a prestigious historical museum housing the city’s most valuable art collection, locked down each evening for a handful of trusted specialists.",
      "situation": "Tonight is the annual inventory audit, and every staff member in the building has a plausible reason to be near the master vault.",
      "incident": "During closing procedures, the masterpiece vault was unlocked without any signs of forced entry, the painting vanished, and exactly one minute of camera logs disappeared.",
      "stakes": "The masterpiece is insured for tens of millions, but the museum’s global reputation will be destroyed if an insider theft is proven.",
      "objective": "Before morning detectives arrive, discover who among the present staff holds the key to the truth."
    },
    "solution": "Who is the Culprit?\nYoussef (Master Art Restorer), aided by accomplices in the security wing.\n\nWhat did they do?\nUnlocked the masterpiece safe using bypass codes, replaced the original canvas with a forged decoy, and sanitized digital logs.\n\nWhy did they do it?\nTo sell the authentic masterpiece to an illicit private antiquities syndicate to cover crippling debts.\n\nHow was the crime committed?\nExploited scheduled conservation maintenance to disable the frame alarm and slipped the canvas into a drafting tube during the camera reboot.\n\nWhich clues pointed to them?\nMicroscopic velvet fibers on the frame, surgical cut marks on the canvas border, and authorized console access timestamps.",
    "guiltyPool": [
      {
        "name": "Omar",
        "profession": "Equipment & Vault Custodian",
        "publicIdentity": "You are Omar, serving as the Equipment & Vault Custodian.",
        "knowledge": "In-universe testimony regarding the incident: تعلم أن سلمى تركت مفاتيح الخزانة في صندوق الأمانات عند 1:45 ص، ورأيت منصور يبدأ جولته في الجناح الشرقي.",
        "guilty": true
      },
      {
        "name": "Mansour",
        "profession": "Night Security Supervisor",
        "publicIdentity": "You are Mansour, serving as the Night Security Supervisor.",
        "knowledge": "In-universe testimony regarding the incident: سمعت صوتاً معدنياً خافتاً قرب فتحة التهوية في القاعة الملكية عند 2:02 ص، ورأيت سلمى تنزل الدرج بسرعة بعد الإنذار.",
        "guilty": true
      },
      {
        "name": "Salma",
        "profession": "Restoration & Relics Specialist",
        "publicIdentity": "You are Salma, serving as the Restoration & Relics Specialist.",
        "knowledge": "In-universe testimony regarding the incident: رأيت عمر يتفقد موزع طاقة الكاميرات عند 1:30 ص، وتعلمين أن فتح الفاترينة يحتاج شفرة فصل مغناطيسية.",
        "guilty": true
      }
    ],
    "innocentPool": [
      {
        "name": "Khaled",
        "profession": "Archive & Documentation Assistant",
        "publicIdentity": "You are Khaled, serving as the Archive & Documentation Assistant.",
        "knowledge": "In-universe testimony regarding the incident: لاحظت فتح صندوق الأمانات في غرفة الحراسة عند 1:50 ص، وظننت أنه تبديل روتيني للمفاتيح.",
        "guilty": false
      },
      {
        "name": "Fatima",
        "profession": "Exhibition Coordinator",
        "publicIdentity": "You are Fatima, serving as the Exhibition Coordinator.",
        "knowledge": "In-universe testimony regarding the incident: تلقى المتحف استفساراً خاصاً حول تقييم التاج قبل ثلاثة أيام من جهة غير معلنة.",
        "guilty": false
      },
      {
        "name": "Rami",
        "profession": "Electrical & Backup Power Tech",
        "publicIdentity": "You are Rami, serving as the Electrical & Backup Power Tech.",
        "knowledge": "In-universe testimony regarding the incident: انقطاع الكهرباء نجم عن مؤقت حراري مبرمج مسبقاً على القاطع رقم 3 قبل نصف ساعة من الحادثة.",
        "guilty": false
      },
      {
        "name": "Nadia",
        "profession": "Museum Educator & Docent",
        "publicIdentity": "You are Nadia, serving as the Museum Educator & Docent.",
        "knowledge": "In-universe testimony regarding the incident: حاجز الليزر تم تعطيله عبر إدخال شفرة إلغاء من لوحة التحكم الرئيسية دون قطع الأسلاك.",
        "guilty": false
      },
      {
        "name": "Tariq",
        "profession": "EEG Systems Technician",
        "publicIdentity": "You are Tariq, serving as the EEG Systems Technician.",
        "knowledge": "In-universe testimony regarding the incident: لم تدخل أو تخرج أي سيارة من بوابات المتحف الخارجية طوال ساعات الليل.",
        "guilty": false
      },
      {
        "name": "Zeinab",
        "profession": "Gift Shop & Inventory Manager",
        "publicIdentity": "You are Zeinab, serving as the Gift Shop & Inventory Manager.",
        "knowledge": "In-universe testimony regarding the incident: زجاج الفاترينة لم يتعرض لأي خدش أو كسر، وفُتح عبر آلية السحب الهيدروليكية النظيفة.",
        "guilty": false
      },
      {
        "name": "Said",
        "profession": "Loading Dock & Delivery Guard",
        "publicIdentity": "You are Said, serving as the Loading Dock & Delivery Guard.",
        "knowledge": "In-universe testimony regarding the incident: عثرت على عربة تنظيف متروكة مع حافظة قماشية فارغة قرب مصعد الخدمة في القبو.",
        "guilty": false
      },
      {
        "name": "Mona",
        "profession": "Executive Administrative Secretary",
        "publicIdentity": "You are Mona, serving as the Executive Administrative Secretary.",
        "knowledge": "In-universe testimony regarding the incident: شروط بوليصة التأمين كانت تفرض وجود حارسين معاً في غرفة المراقبة بعد منتصف الليل.",
        "guilty": false
      },
      {
        "name": "Ziad",
        "profession": "Display Lighting Tech",
        "publicIdentity": "You are Ziad, serving as the Display Lighting Tech.",
        "knowledge": "In-universe testimony regarding the incident: صناديق نقل المعروضات الخاصة بالمعرض كانت مجهزة قرب منطقة التحميل منذ المساء.",
        "guilty": false
      }
    ],
    "clues": [
      "The vault safe was unlocked cleanly with zero scratches or forced entries.",
      "One full minute of camera footage was wiped between 00:15 and 00:16.",
      "Microscopic velvet fibers were retrieved from the frame mounting brackets."
    ]
  },
  "train": {
    "title": "Midnight Express",
    "description": "A sabotage and theft aboard a luxury non-stop express train. With every coach locked and speed maxed out, the culprit is trapped on board.",
    "introduction": {
      "setting": "Aboard a high-speed express train traversing an isolated snowy mountain pass, with no scheduled stops until sunrise.",
      "situation": "First-class passengers and key train staff are enjoying a luxury night journey across rugged mountain terrain.",
      "incident": "As the train plunged into the Black Peak Tunnel, the emergency brake line was severed, lights flickered out, and confidential diplomatic documents vanished from the cargo safe.",
      "stakes": "The train cannot stop until dawn. The culprit is trapped among the passengers in this sealed locomotive.",
      "objective": "Track passenger movements and crew keys to expose the saboteur before reaching the destination terminal."
    },
    "solution": "Who is the Culprit?\nRami (Dining Car Server), in league with conspirators in the cargo carriage.\n\nWhat did they do?\nTampered with the emergency electrical junction and used a master key to raid the diplomatic safe inside the cargo vault.\n\nWhy did they do it?\nTo blackmail the railway consortium and deliver classified diplomatic papers to an international smuggling cartel.\n\nHow was the crime committed?\nTook advantage of the sudden darkness inside the Black Peak Tunnel while passengers were distracted by the engine stall.\n\nWhich clues pointed to them?\nTraces of specialized railway grease on his uniform cuffs, and the fact that the cargo vault was opened with a conductor master key.",
    "guiltyPool": [
      {
        "name": "Faris",
        "profession": "Assistant Train Engineer",
        "publicIdentity": "You are Faris, serving as the Assistant Train Engineer.",
        "knowledge": "In-universe testimony regarding the incident: تعلم أن بسام دخل في مشادة مع المحقق نبيل في عربة الطعام، وتعرف مكان المفتاح الرئيسي المعلق في مقصورة الطاقم.",
        "guilty": true
      },
      {
        "name": "Bassam",
        "profession": "First-Class Dining Steward",
        "publicIdentity": "You are Bassam, serving as the First-Class Dining Steward.",
        "knowledge": "In-universe testimony regarding the incident: رأيت فارس يتجه نحو ممر المقصورات الأولى قبيل دخول النفق، ولاحظت نبيل يبحث عن الموصل المسؤول عن المفاتيح.",
        "guilty": true
      },
      {
        "name": "Kamal",
        "profession": "Freight Baggage Inspector",
        "publicIdentity": "You are Kamal, serving as the Freight Baggage Inspector.",
        "knowledge": "In-universe testimony regarding the incident: المفتاح الشامل كان مفقوداً من علاقة المفاتيح بين 10:40 و 11:05 م قبل أن يعود لمكانه.",
        "guilty": true
      }
    ],
    "innocentPool": [
      {
        "name": "Nabil",
        "profession": "Chief Train Conductor",
        "publicIdentity": "You are Nabil, serving as the Chief Train Conductor.",
        "knowledge": "In-universe testimony regarding the incident: سمعت صوت إدارة مفتاح طاقم القطار المميز في قفل المقصورة 7 في قلب ظلام النفق قبل صفير فرامل الطوارئ مباشرة.",
        "guilty": false
      },
      {
        "name": "Dorra",
        "profession": "Diplomatic Passenger",
        "publicIdentity": "You are Dorra, serving as the Diplomatic Passenger.",
        "knowledge": "In-universe testimony regarding the incident: رأيت بسام يحمل صندوقاً معدنياً مقفلاً في الممر الرابط عند 10:45 م وبدا مرتبكاً للغاية.",
        "guilty": false
      },
      {
        "name": "Rania",
        "profession": "Investigative Journalist",
        "publicIdentity": "You are Rania, serving as the Investigative Journalist.",
        "knowledge": "In-universe testimony regarding the incident: المبعوث الدبلوماسي رفض توقيع اتفاقية نقل خاصة في وقت سابق من المساء.",
        "guilty": false
      },
      {
        "name": "Youssef",
        "profession": "Locomotive Mechanic",
        "publicIdentity": "You are Youssef, serving as the Locomotive Mechanic.",
        "knowledge": "In-universe testimony regarding the incident: الباب الخارجي لعربة الأمتعة كان محكم الإغلاق بسلاسل الأمان طوال فترة الرحلة.",
        "guilty": false
      },
      {
        "name": "Layla",
        "profession": "Passenger Concert Pianist",
        "publicIdentity": "You are Layla, serving as the Passenger Concert Pianist.",
        "knowledge": "In-universe testimony regarding the incident: فرامل الطوارئ في العربة رقم 3 سُحبت باستخدام مقبض التشغيل الميكانيكي المخصص للطاقم.",
        "guilty": false
      },
      {
        "name": "Majid",
        "profession": "Luggage Porter",
        "publicIdentity": "You are Majid, serving as the Luggage Porter.",
        "knowledge": "In-universe testimony regarding the incident: ضغط الغلايات كان منتظماً بالكامل طوال الرحلة ولم يتطلب أي تدخل يدوي استثنائي.",
        "guilty": false
      },
      {
        "name": "Salwa",
        "profession": "First-Class Cabin Attendant",
        "publicIdentity": "You are Salwa, serving as the First-Class Cabin Attendant.",
        "knowledge": "In-universe testimony regarding the incident: بسام كان ينقل بعض الفضيات الثمينة إلى خزانة التخزين الخاصة به في المطبخ.",
        "guilty": false
      },
      {
        "name": "Hossam",
        "profession": "Railway Mail Courier",
        "publicIdentity": "You are Hossam, serving as the Railway Mail Courier.",
        "knowledge": "In-universe testimony regarding the incident: حزام جلدي لحقيبة دبلوماسية وُجد عالقاً قرب ممر العربة رقم 3.",
        "guilty": false
      },
      {
        "name": "Amina",
        "profession": "Dining Car Executive Chef",
        "publicIdentity": "You are Amina, serving as the Dining Car Executive Chef.",
        "knowledge": "In-universe testimony regarding the incident: إضاءة الممر خُفتت يدوياً من لوحة التوزيع الرئيسية في مقصورة الطاقم عند 10:58 م.",
        "guilty": false
      }
    ],
    "clues": [
      "The brake line was severed from inside the passenger vestibule using insulated tools.",
      "The diplomatic safe was opened with an authorized conductor master key.",
      "A handheld transmitter was activated during the blackout window."
    ]
  },
  "observatory": {
    "title": "Falling Star Observatory",
    "description": "During a rare celestial meteor shower, an irreplaceable cosmic sample is stolen from the telescope dome as the tracking radar goes dark.",
    "introduction": {
      "setting": "Mount Celestia High-Altitude Observatory, perched atop a misty peak isolated from the city.",
      "situation": "Astronomers, technicians, and guest researchers gathered to observe a once-in-a-century meteor storm through the mega-refractor telescope.",
      "incident": "At the exact moment of peak celestial alignment, the tracking radar arrays were jammed for 90 seconds, and the glowing radioactive meteorite sample was lifted from its vacuum pedestal.",
      "stakes": "The specimen is chemically volatile and will degrade into dust if not kept in specialized cryogenic containment.",
      "objective": "Analyze telescope power feeds and security logs to catch the rogue scientist before the specimen is lost."
    },
    "solution": "Who is the Culprit?\nBashar (Tracking Systems Programmer), aided by conspirators.\n\nWhat did they do?\nStole the rare cosmic meteorite sample from the pedestal and replaced it with a painted basalt decoy while the tracking arrays were jammed.\n\nWhy did they do it?\nThe meteorite contains rare extraterrestrial isotopes that he had arranged to sell to an illicit private research institute.\n\nHow was the crime committed?\nExploited knowledge of the backup generator cycle to kill power for 90 seconds and opened the dome hatch manually.\n\nWhich clues pointed to them?\nFingerprints on the manual dome release lever, and thermal sensor readings showing presence inside the telescope chamber during the outage.",
    "guiltyPool": [
      {
        "name": "Eyad",
        "profession": "Telescope Operations Tech",
        "publicIdentity": "You are Eyad, serving as the Telescope Operations Tech.",
        "knowledge": "In-universe testimony regarding the incident: تعلم أن د. رؤوف مكث متأخراً في القبة الرئيسية، ورأيت مايا تسجل إشارات الخطأ على شاشات التحليل.",
        "guilty": true
      },
      {
        "name": "Dr. Raouf",
        "profession": "Senior Astrophysicist",
        "publicIdentity": "You are Dr. Raouf, serving as the Senior Astrophysicist.",
        "knowledge": "In-universe testimony regarding the incident: رأيت إياد يتفقد لوحة التحكم بحجرة الطيف عند 1:00 ص، وسمعت صوت تفريغ الضغط الهيدروليكي أثناء تحويل الكهرباء.",
        "guilty": true
      },
      {
        "name": "Maya",
        "profession": "Optics & Laser Specialist",
        "publicIdentity": "You are Maya, serving as the Optics & Laser Specialist.",
        "knowledge": "In-universe testimony regarding the incident: رأيت د. رؤوف يغادر القبة حاملاً حافظة جلدية سوداء عند 1:10 ص وبدا عليه التكتم الشديد.",
        "guilty": true
      }
    ],
    "innocentPool": [
      {
        "name": "Tariq",
        "profession": "EEG Systems Technician",
        "publicIdentity": "You are Tariq, serving as the EEG Systems Technician.",
        "knowledge": "In-universe testimony regarding the incident: التحويل الكهربائي تم تقديمه 5 دقائق عن موعده المجدول عبر أمر صدر من شاشة القبة الرئيسية.",
        "guilty": false
      },
      {
        "name": "Deema",
        "profession": "Astrophotography Data Logger",
        "publicIdentity": "You are Deema, serving as the Astrophotography Data Logger.",
        "knowledge": "In-universe testimony regarding the incident: العينة النيزكية كانت مبرمجة للنقل إلى مؤسسة أبحاث دولية الأسبوع المقبل مما كان سينهي أبحاث الفريق المحلي.",
        "guilty": false
      },
      {
        "name": "Ziad",
        "profession": "Display Lighting Tech",
        "publicIdentity": "You are Ziad, serving as the Display Lighting Tech.",
        "knowledge": "In-universe testimony regarding the incident: ستار القبة العلوي تم إغلاقه يدوي لحجب الرؤية عن ممر الصيانة عند 1:05 ص.",
        "guilty": false
      },
      {
        "name": "Samer",
        "profession": "Mountain Supply Driver",
        "publicIdentity": "You are Samer, serving as the Mountain Supply Driver.",
        "knowledge": "In-universe testimony regarding the incident: الضباب الكثيف حجب ممر السير الخارجي المؤدي لكوخ المولد بين 1:00 و 1:30 ص.",
        "guilty": false
      },
      {
        "name": "Hanan",
        "profession": "Graduate Research Assistant",
        "publicIdentity": "You are Hanan, serving as the Graduate Research Assistant.",
        "knowledge": "In-universe testimony regarding the incident: إدارة المرصد أعلنت تقليصاً وشيكاً في ميزانية الصيانة للموسم القادم.",
        "guilty": false
      },
      {
        "name": "فراس",
        "profession": "مهندس اتصالات الأقمار الصناعية",
        "publicIdentity": "You are فراس, serving as the مهندس اتصالات الأقمار الصناعية.",
        "knowledge": "In-universe testimony regarding the incident: رابط الإرسال الفضائي تم إيقافه مؤقتاً قبل التحويل الكهربائي بدقائق.",
        "guilty": false
      },
      {
        "name": "Wafaa",
        "profession": "Communications & Telemetry Officer",
        "publicIdentity": "You are Wafaa, serving as the Communications & Telemetry Officer.",
        "knowledge": "In-universe testimony regarding the incident: فتح حجرة التفريغ يتطلب استخدام مفتاح التنفيس الميكانيكي المعلق في ورشة الصيانة المشتركة.",
        "guilty": false
      },
      {
        "name": "Assem",
        "profession": "Observatory Caretaker",
        "publicIdentity": "You are Assem, serving as the Observatory Caretaker.",
        "knowledge": "In-universe testimony regarding the incident: الثلوج سدت الطريق تماماً ولم تقترب أي مركبة من محيط المرصد طوال الليل.",
        "guilty": false
      },
      {
        "name": "Mona",
        "profession": "Executive Administrative Secretary",
        "publicIdentity": "You are Mona, serving as the Executive Administrative Secretary.",
        "knowledge": "In-universe testimony regarding the incident: شعاع الليزر أُطفئ يدوياً قبل موعد التحويل بدقيقتين من لوحة المراقبة.",
        "guilty": false
      }
    ],
    "clues": [
      "The 90-second blackout was triggered by a manual override lever inside the primary dome control booth.",
      "A painted basalt decoy was left in place of the glowing cosmic meteorite.",
      "A cryogenic transport cooler was moved toward the parking area during the blackout."
    ]
  },
  "desert_archive": {
    "title": "Desert Archive",
    "description": "An ancient parchment detailing the coordinates of a buried desert civilization disappears from an archaeological tent before dawn.",
    "introduction": {
      "setting": "An isolated expedition basecamp surrounded by vast desert dunes, miles away from civilization.",
      "situation": "An elite archaeological mission is preparing to depart into uncharted sand dunes at sunrise to locate a lost oasis city.",
      "incident": "Before the expedition caravan could load supplies, the ancient papyrus map was stolen from the locked iron expedition trunk.",
      "stakes": "Without the coordinates, the expedition cannot navigate the shifting sands and the lost city will be lost to grave robbers.",
      "objective": "Interrogate the archaeologists, navigators, and camp crew to uncover the traitor before sunrise."
    },
    "solution": "Who is the Culprit?\nSultan (Epigrapher & Inscription Expert), aided by conspirators.\n\nWhat did they do?\nTook the ancient parchment map from the iron chest and swapped it with blank parchment before sunrise.\n\nWhy did they do it?\nTo guide a rival black-market excavation team to the buried ruins and claim a fifty-percent bounty on all discovered relics.",
    "guiltyPool": [
      {
        "name": "Azzam",
        "profession": "Expedition Scout & Desert Navigator",
        "publicIdentity": "You are Azzam, serving as the Expedition Scout & Desert Navigator.",
        "knowledge": "In-universe testimony regarding the incident: تعلم أن د. ليلى تركت خيمة الأرشيف مفتوحة عند 3:00 ص، ورأيت منصور يتفقد معدات الإمداد قرب الخيمة.",
        "guilty": true
      },
      {
        "name": "Dr. Layla",
        "profession": "Lead Epigrapher & Historian",
        "publicIdentity": "You are Dr. Layla, serving as the Lead Epigrapher & Historian.",
        "knowledge": "In-universe testimony regarding the incident: رأيت عزام يبري أقلام الحبر التخطيطي قرب خيمة الأرشيف عند 2:45 ص، وشيفرة الخزنة كانت مدونة في سجل المخيم.",
        "guilty": true
      },
      {
        "name": "Rashed",
        "profession": "Archive Vault Custodian",
        "publicIdentity": "You are Rashed, serving as the Archive Vault Custodian.",
        "knowledge": "In-universe testimony regarding the incident: آثار الأقدام حول خيمة الأرشيف دارت حول حظيرة الجمال قبل أن تعود لوسط المخيم.",
        "guilty": true
      }
    ],
    "innocentPool": [
      {
        "name": "Mansour",
        "profession": "Night Security Supervisor",
        "publicIdentity": "You are Mansour, serving as the Night Security Supervisor.",
        "knowledge": "In-universe testimony regarding the incident: رأيت طارق يحمل أنبوب خرائط جلدي قرب مولد الكهرباء عند 3:20 ص وبدا متوجساً.",
        "guilty": false
      },
      {
        "name": "Tariq",
        "profession": "EEG Systems Technician",
        "publicIdentity": "You are Tariq, serving as the EEG Systems Technician.",
        "knowledge": "In-universe testimony regarding the incident: لاحظت تصاعد دخان كثيف من موقد الحطب قرب خيمة الأرشيف عند 3:30 ص حجب الرؤية في المخيم.",
        "guilty": false
      },
      {
        "name": "Salma",
        "profession": "Restoration & Relics Specialist",
        "publicIdentity": "You are Salma, serving as the Restoration & Relics Specialist.",
        "knowledge": "In-universe testimony regarding the incident: النسخة المقلدة التي وُضعت في الخزنة كُتبت بحبر كربوني حديث على ورق مصبوغ بالشاي.",
        "guilty": false
      },
      {
        "name": "Khadija",
        "profession": "Expedition Field Photographer",
        "publicIdentity": "You are Khadija, serving as the Expedition Field Photographer.",
        "knowledge": "In-universe testimony regarding the incident: عثرت على آثار صمغ شمعي يستخدم في تثبيت الجلود على حافة خيمة الأرشيف.",
        "guilty": false
      },
      {
        "name": "Bilal",
        "profession": "Water Supply Coordinator",
        "publicIdentity": "You are Bilal, serving as the Water Supply Coordinator.",
        "knowledge": "In-universe testimony regarding the incident: كشاف الإنارة الرئيسي المسلط على خيمة الأرشيف أُطفئ يدوياً عند 3:15 ص.",
        "guilty": false
      },
      {
        "name": "Amina",
        "profession": "Dining Car Executive Chef",
        "publicIdentity": "You are Amina, serving as the Dining Car Executive Chef.",
        "knowledge": "In-universe testimony regarding the incident: الصور الفوتوغرافية الأصلية للمخطوطة تم التقاطها وحفظها في الصندوق المحكم بعد الظهر.",
        "guilty": false
      },
      {
        "name": "Salem",
        "profession": "Caravan Security Guard",
        "publicIdentity": "You are Salem, serving as the Caravan Security Guard.",
        "knowledge": "In-universe testimony regarding the incident: قرب المياه في حظيرة الجمال كانت فارغة ومربوطة ولم تُمس طوال ساعات الفجر.",
        "guilty": false
      },
      {
        "name": "Nadia",
        "profession": "Museum Educator & Docent",
        "publicIdentity": "You are Nadia, serving as the Museum Educator & Docent.",
        "knowledge": "In-universe testimony regarding the incident: النص المكتوب على المخطوطة المزيفة يحوي أخطاء لغوية حديثة لا يقع فيها كاتب قديم.",
        "guilty": false
      },
      {
        "name": "Faisal",
        "profession": "Excavation Foreman",
        "publicIdentity": "You are Faisal, serving as the Excavation Foreman.",
        "knowledge": "In-universe testimony regarding the incident: تم إرسال برقية لاسلكية مشفرة من جهاز المخيم عند منتصف الليل.",
        "guilty": false
      }
    ],
    "clues": [
      "The iron chest lock was picked with a precision wire tool before dawn.",
      "Boot prints coated in clay mud lead from the archive tent to the supply convoy.",
      "An unauthorized shortwave radio transmission was logged at 04:15 AM."
    ]
  },
  "drowned_village": {
    "title": "The Drowned Village",
    "description": "During a deep dive into an ancient village submerged by a dam reservoir, a priceless antique chime chest is looted from the sunken bell tower.",
    "introduction": {
      "setting": "Lake Al-Wadi Reservoir - Sunken Medieval Ruins, deep below murky waters.",
      "situation": "A team of underwater archaeologists is completing a high-depth survey of a centuries-old village flooded fifty years ago.",
      "incident": "While exploring the submerged bell tower, the team’s underwater communication buoy was cut and the ornate bronze chime chest was looted.",
      "stakes": "The water pressure is rising and oxygen tanks are limited. The chest must be found before the dive team ascends to the boat.",
      "objective": "Inspect dive logs, oxygen gauges, and decompression records to identify the diver who concealed the artifact."
    },
    "solution": "Who is the Culprit?\nRamez (Rescue Diver), aided by conspirators.\n\nWhat did they do?\nRetrieved the antique bronze chime chest from the sunken schoolhouse and stashed it inside a spare ballast tank on the dive boat.\n\nWhy did they do it?\nTo evade reporting the find to the antiquities ministry and smuggle it through maritime black-market channels.",
    "guiltyPool": [
      {
        "name": "Fouad",
        "profession": "Lead Deep-Sea Diver",
        "publicIdentity": "You are Fouad, serving as the Lead Deep-Sea Diver.",
        "knowledge": "In-universe testimony regarding the incident: تعلم أن د. زياد كان يراقب كاميرات المسبار الآلي، ورأيت سارة تجهز كاميرات الأعماق في المقصورة.",
        "guilty": true
      },
      {
        "name": "Dr. Ziad",
        "profession": "Marine Archaeologist",
        "publicIdentity": "You are Dr. Ziad, serving as the Marine Archaeologist.",
        "knowledge": "In-universe testimony regarding the incident: رأيت سارة تغادر منصة الغوص حاملة حقيبة مضادة للماء ثقيلة عند 6:15 ص وبدت متوترة للغاية.",
        "guilty": true
      },
      {
        "name": "Majid",
        "profession": "Luggage Porter",
        "publicIdentity": "You are Majid, serving as the Luggage Porter.",
        "knowledge": "In-universe testimony regarding the incident: سمعت صوت ارتداد سلم الغوص المائي عند 5:55 ص قبل موعد النزول المجدول بنصف ساعة.",
        "guilty": true
      }
    ],
    "innocentPool": [
      {
        "name": "Sarah",
        "profession": "Marine Biologist",
        "publicIdentity": "You are Sarah, serving as the Marine Biologist.",
        "knowledge": "In-universe testimony regarding the incident: رأيت فؤاد ينقل أسطوانة غاز تريمكس ثلاثية الخليط نحو منصة الإنزال الخلفية عند 5:50 ص.",
        "guilty": false
      },
      {
        "name": "Rima",
        "profession": "Sonar & Depth Profiler",
        "publicIdentity": "You are Rima, serving as the Sonar & Depth Profiler.",
        "knowledge": "In-universe testimony regarding the incident: صندوق الأجراس يحتاج لمحلول تحييد مائي خاص فور رفعه لتجنب تآكل نقوشه بالهواء الجوي.",
        "guilty": false
      },
      {
        "name": "Sami",
        "profession": "Volunteer Coordinator",
        "publicIdentity": "You are Sami, serving as the Volunteer Coordinator.",
        "knowledge": "In-universe testimony regarding the incident: فؤاد و د. زياد هما الوحيدان المصرح لهما بالغطس المنفرد إلى أعماق تتجاوز 35 متراً.",
        "guilty": false
      },
      {
        "name": "Mona",
        "profession": "Executive Administrative Secretary",
        "publicIdentity": "You are Mona, serving as the Executive Administrative Secretary.",
        "knowledge": "In-universe testimony regarding the incident: كاميرا الروبوت الغاطس تم توجيهها يدوياً نحو القاع الرملي لحجب الرؤية عن برج الكاتدرائية.",
        "guilty": false
      },
      {
        "name": "Tariq",
        "profession": "EEG Systems Technician",
        "publicIdentity": "You are Tariq, serving as the EEG Systems Technician.",
        "knowledge": "In-universe testimony regarding the incident: محركات التثبيت الآلي حافظت على موقع السفينة بدقة دون أي انحراف عن موقع الغرق.",
        "guilty": false
      },
      {
        "name": "Nada",
        "profession": "Research Vessel Captain",
        "publicIdentity": "You are Nada, serving as the Research Vessel Captain.",
        "knowledge": "In-universe testimony regarding the incident: حساسات الإزاحة رصدت اضطراباً مائياً مفاجئاً قرب فوهة البرج عند 6:05 ص.",
        "guilty": false
      },
      {
        "name": "Omar",
        "profession": "Equipment & Vault Custodian",
        "publicIdentity": "You are Omar, serving as the Equipment & Vault Custodian.",
        "knowledge": "In-universe testimony regarding the incident: دراجة الدفع المائي السريعة كانت مفصولة من شاحنها على المنصة السفلية في الصباح الباكر.",
        "guilty": false
      },
      {
        "name": "Layla",
        "profession": "Passenger Concert Pianist",
        "publicIdentity": "You are Layla, serving as the Passenger Concert Pianist.",
        "knowledge": "In-universe testimony regarding the incident: صندوق الأجراس تم تثبيته وتوثيق موقعه في البرج عصر الأمس بدقة متناهية.",
        "guilty": false
      },
      {
        "name": "Khaled",
        "profession": "Archive & Documentation Assistant",
        "publicIdentity": "You are Khaled, serving as the Archive & Documentation Assistant.",
        "knowledge": "In-universe testimony regarding the incident: لم تصدر أي نداءات لاسلكية استثنائية من السفينة قبل بدء حالة الاستنفار.",
        "guilty": false
      }
    ],
    "clues": [
      "The bronze chime chest was detached using heavy underwater hydraulic shears.",
      "Dive computer telemetry proves one diver consumed twice as much oxygen during a 10-minute sprint.",
      "A nylon lifting strap was found snagged on the support boat’s lower ballast keel."
    ]
  },
  "arctic_station": {
    "title": "Last Ice Station",
    "description": "At an isolated polar research outpost during a raging blizzard, an ancient ice core containing a prehistoric biological agent disappears.",
    "introduction": {
      "setting": "Aurora Borealis Polar Research Outpost, completely isolated on a vast ice shelf.",
      "situation": "The polar research team is completely isolated by a Category 5 Arctic blizzard with no rescue possible for 48 hours.",
      "incident": "The cryogenic freezer door was forced open, the backup power tripped, and a prehistoric 10,000-year-old ice cylinder went missing.",
      "stakes": "If the core melts at room temperature, ancient pathogens could be released into the station air vents.",
      "objective": "Examine cryo-storage telemetry and blizzard gear to expose the researcher who took the core."
    },
    "solution": "Who is the Culprit?\nBjorn (Vehicle & Sled Mechanic), in league with conspirators.\n\nWhat did they do?\nSmuggled the ancient ice cylinder out of the vault and sabotaged the backup coolant line to fake an accidental thermal loss.\n\nWhy did they do it?\nThe core contains a unique enzyme sequence that would grant him a multimillion-dollar payout from a private biotech firm.",
    "guiltyPool": [
      {
        "name": "Dr. Marwan",
        "profession": "Chief Paleoclimatologist",
        "publicIdentity": "You are Dr. Marwan, serving as the Chief Paleoclimatologist.",
        "knowledge": "In-universe testimony regarding the incident: تعلم أن د. إيلينا بقيت في قبو العينات لفحص الترسبات، ورأيت بوريس يتفقد خطوط مولد التدفئة الرئيسي.",
        "guilty": true
      },
      {
        "name": "Dimitri",
        "profession": "Cold-Storage & Power Engineer",
        "publicIdentity": "You are Dimitri, serving as the Cold-Storage & Power Engineer.",
        "knowledge": "In-universe testimony regarding the incident: طائرة الإجلاء القطبية مجدولة للوصول خلال 48 ساعة فور هدوء الرياح العاتية.",
        "guilty": true
      },
      {
        "name": "Katia",
        "profession": "Communications & Radar Officer",
        "publicIdentity": "You are Katia, serving as the Communications & Radar Officer.",
        "knowledge": "In-universe testimony regarding the incident: النتائج الأولية للتحليل أثبتت وجود تراكيز كربونية تدحض النظرية الشهيرة التي نشرها د. مروان.",
        "guilty": true
      }
    ],
    "innocentPool": [
      {
        "name": "Dr. Elena",
        "profession": "Microbiologist",
        "publicIdentity": "You are Dr. Elena, serving as the Microbiologist.",
        "knowledge": "In-universe testimony regarding the incident: رأيت د. مروان يتجه نحو جناح القبو التجميدي عند 1:10 ص وبدا عليه التكتم والانزعاج من نتائج الفحص الأخير.",
        "guilty": false
      },
      {
        "name": "Boris",
        "profession": "Station Commander",
        "publicIdentity": "You are Boris, serving as the Station Commander.",
        "knowledge": "In-universe testimony regarding the incident: سمعت صفارة إنذار ضغط القبو عند 1:32 ص، ورأيت د. إيلينا تهرع من ممر العزل نحو القبو فور انطلاق الجرس.",
        "guilty": false
      },
      {
        "name": "Nadia",
        "profession": "Museum Educator & Docent",
        "publicIdentity": "You are Nadia, serving as the Museum Educator & Docent.",
        "knowledge": "In-universe testimony regarding the incident: رأيت بوريس يحمل مفتاح أنابيب معدنياً في الممر قرب مجاري التبريد عند 1:25 ص وبدا متجهاً للمضخات.",
        "guilty": false
      },
      {
        "name": "Samer",
        "profession": "Mountain Supply Driver",
        "publicIdentity": "You are Samer, serving as the Mountain Supply Driver.",
        "knowledge": "In-universe testimony regarding the incident: العاصفة أغلقت فتحات التهوية الخارجية بإحكام، واستحالت مغادرة أي شخص لمحيط المبنى المغلق.",
        "guilty": false
      },
      {
        "name": "Lina",
        "profession": "Field Medic",
        "publicIdentity": "You are Lina, serving as the Field Medic.",
        "knowledge": "In-universe testimony regarding the incident: مقبض باب قبو العينات كان يحمل آثار صقيع تدل على فتحه وإغلاقه بشكل متكرر وسريع.",
        "guilty": false
      },
      {
        "name": "Andrei",
        "profession": "Diesel Systems Mechanic",
        "publicIdentity": "You are Andrei, serving as the Diesel Systems Mechanic.",
        "knowledge": "In-universe testimony regarding the incident: القطع في خرطوم التبريد نُفذ بمبضع تشريح جراحي حاد ودقيق، وليس بمفتاح صيانة سباكة ثقيل.",
        "guilty": false
      },
      {
        "name": "Sarah",
        "profession": "Marine Biologist",
        "publicIdentity": "You are Sarah, serving as the Marine Biologist.",
        "knowledge": "In-universe testimony regarding the incident: سخانات الطوارئ في المختبر رُفعت يدوياً لأقصى درجة تسخين عند 1:28 ص لتسريع ذوبان الجليد.",
        "guilty": false
      },
      {
        "name": "Tariq",
        "profession": "EEG Systems Technician",
        "publicIdentity": "You are Tariq, serving as the EEG Systems Technician.",
        "knowledge": "In-universe testimony regarding the incident: حافظات المياه الساخنة التابعة للمطبخ كانت قد استُخدمت قبل منتصف الليل لتدفئة ممرات الخدمة.",
        "guilty": false
      },
      {
        "name": "Michel",
        "profession": "Chef & Provisions Keeper",
        "publicIdentity": "You are Michel, serving as the Chef & Provisions Keeper.",
        "knowledge": "In-universe testimony regarding the incident: سجلات حساسات حرارة القبو حُفظت محلياً على القرص الصلب الاحتياطي قبل انقطاع الشبكة.",
        "guilty": false
      }
    ],
    "clues": [
      "The coolant pipe was sliced cleanly with an insulated utility blade.",
      "Fresh snow boot tracks led from the specimen freezer to the exterior vehicle hangar.",
      "A portable insulated cryo-flask was missing from the mobile survey kit."
    ]
  },
  "film_set": {
    "title": "The Final Scene",
    "description": "On the glamorous set of a classic historical movie, the genuine royal antique ring vanishes from the prop table right before the final climax scene is shot.",
    "introduction": {
      "setting": "CineStar Studios - Soundstage 7, adorned with lavish period decor.",
      "situation": "The cast and crew are filming the high-stakes final scene of a multimillion-dollar period drama.",
      "incident": "Just before the director shouted \"Action!\", the real heirloom diamond ring was replaced with a cheap brass prop on the velvet cushion.",
      "stakes": "The authentic ring is on loan from a private museum under heavy insurance liability. No one leaves the soundstage until it is recovered.",
      "objective": "Interrogate the director, actors, prop master, and costumers to identify the thief."
    },
    "solution": "Who is the Culprit?\nKarim (Master of Props), in league with conspirators.\n\nWhat did they do?\nSwapped the authentic diamond heirloom ring with a polished brass replica right before the cameras started rolling.\n\nWhy did they do it?\nThe ring originally belonged to his ancestral estate and was sold at an unauthorized auction decades ago; he vowed to reclaim it.",
    "guiltyPool": [
      {
        "name": "Jalal",
        "profession": "Master Prop Decorator",
        "publicIdentity": "You are Jalal, serving as the Master Prop Decorator.",
        "knowledge": "In-universe testimony regarding the incident: تعلم أن ميا كانت تجهز فساتين الممثلة في غرفة الملابس، ورأيت المخرج كريم يراجع اللقطات السابقة مع المنتج سامر.",
        "guilty": true
      },
      {
        "name": "Karim",
        "profession": "Systems & Network Engineer",
        "publicIdentity": "You are Karim, serving as the Systems & Network Engineer.",
        "knowledge": "In-universe testimony regarding the incident: رأيت المنتج سامر يتجه نحو طاولة الإكسسوارات حاملاً حافظة مخملية صغيرة عند 10:20 م وبدا عليه القلق.",
        "guilty": true
      },
      {
        "name": "Rita",
        "profession": "Costume & Wardrobe Supervisor",
        "publicIdentity": "You are Rita, serving as the Costume & Wardrobe Supervisor.",
        "knowledge": "In-universe testimony regarding the incident: الخاتم وُضع على أصبعها عند 10:35 م ولاحظت فوراً خفة وزنه مقارنة بالخاتم الأصلي الثقيل.",
        "guilty": true
      }
    ],
    "innocentPool": [
      {
        "name": "Mia",
        "profession": "Lead Actress",
        "publicIdentity": "You are Mia, serving as the Lead Actress.",
        "knowledge": "In-universe testimony regarding the incident: رأيت جلال يفحص خزانة الإكسسوارات بعدسة مكبرة عند 10:00 م، ورأيت كريم يقف قرب طاولة المجوهرات قبل البروفة.",
        "guilty": false
      },
      {
        "name": "Samer",
        "profession": "Mountain Supply Driver",
        "publicIdentity": "You are Samer, serving as the Mountain Supply Driver.",
        "knowledge": "In-universe testimony regarding the incident: لاحظت أن خزانة الإكسسوارات كانت غير موصدة تماماً بالمزلاج السري بين 10:15 و 10:35 م.",
        "guilty": false
      },
      {
        "name": "Youssef",
        "profession": "Locomotive Mechanic",
        "publicIdentity": "You are Youssef, serving as the Locomotive Mechanic.",
        "knowledge": "In-universe testimony regarding the incident: إضاءة طاولة الإكسسوارات تم إطفاؤها لمدة 5 دقائق لتبديل مرشحات الألوان قبل الحادثة.",
        "guilty": false
      },
      {
        "name": "Nadine",
        "profession": "Script Supervisor",
        "publicIdentity": "You are Nadine, serving as the Script Supervisor.",
        "knowledge": "In-universe testimony regarding the incident: صورة فوتوغرافية التُقطت للخاتم الحقيقي داخل الخزانة عند 10:10 م تؤكد وجوده الأصلي حينها.",
        "guilty": false
      },
      {
        "name": "Tariq",
        "profession": "EEG Systems Technician",
        "publicIdentity": "You are Tariq, serving as the EEG Systems Technician.",
        "knowledge": "In-universe testimony regarding the incident: لاقطات الصوت سجلت صوت إغلاق علبة مخملية بمزلاج معدني عند 10:22 م قرب طاولة الإكسسوارات.",
        "guilty": false
      },
      {
        "name": "Hani",
        "profession": "Production Key Grip",
        "publicIdentity": "You are Hani, serving as the Production Key Grip.",
        "knowledge": "In-universe testimony regarding the incident: الباب الخشبي المكسور في الورشة تم إصلاحه وطلاؤه بالكامل قبل الساعة 9:00 مساءً.",
        "guilty": false
      },
      {
        "name": "Layla",
        "profession": "Passenger Concert Pianist",
        "publicIdentity": "You are Layla, serving as the Passenger Concert Pianist.",
        "knowledge": "In-universe testimony regarding the incident: عثرت على آثار ملمع نحاسي خاص بالإكسسوارات المقلدة على طاولة التجهيز المجاورة.",
        "guilty": false
      },
      {
        "name": "Ziad",
        "profession": "Display Lighting Tech",
        "publicIdentity": "You are Ziad, serving as the Display Lighting Tech.",
        "knowledge": "In-universe testimony regarding the incident: ورشة النجارة كانت مغلقة بالمفتاح الخارجي أثناء تناول العمال لطعام العشاء.",
        "guilty": false
      },
      {
        "name": "Mona",
        "profession": "Executive Administrative Secretary",
        "publicIdentity": "You are Mona, serving as the Executive Administrative Secretary.",
        "knowledge": "In-universe testimony regarding the incident: رمز فتح قفل الخزانة كان مدوناً بخط اليد على ظهر جدول مواعيد المشاهد المعلق.",
        "guilty": false
      }
    ],
    "clues": [
      "The velvet prop cushion retained traces of jeweler’s buffing compound.",
      "The brass ring replica was placed on the cushion during the 5-minute smoke haze.",
      "The authentic diamond ring was concealed inside a hollow stage spotlight casing."
    ]
  },
  "submarine": {
    "title": "Call of the Depths",
    "description": "Aboard a deep-sea research submarine descending into an abyss trench, the navigation data chip is extracted to redirect the sub toward uncharted coordinates.",
    "introduction": {
      "setting": "Deep Ocean Submersible \"Nautilus-X\", deep within an oceanic trench.",
      "situation": "The crew is descending past 3,000 meters into an unexplored ocean trench under immense hydraulic pressure.",
      "incident": "The encrypted navigation chip vanished from the bridge console, causing guidance systems to deviate toward classified coordinates.",
      "stakes": "If the navigation chip is not re-inserted within thirty minutes, the sub will enter dangerous hydrothermal vent zones.",
      "objective": "Question the bridge officers, sonar technicians, and oceanographers to find the saboteur."
    },
    "solution": "Who is the Culprit?\nTariq (Navigation Officer), in league with conspirators.\n\nWhat did they do?\nExtracted the encrypted navigation memory chip to force the submarine toward the hidden coordinates of a secret historic shipwreck.\n\nWhy did they do it?\nTo locate and document a sunken treasure galleon before salvage rights expired.",
    "guiltyPool": [
      {
        "name": "Mohanad",
        "profession": "Sonar & Navigation Officer",
        "publicIdentity": "You are Mohanad, serving as the Sonar & Navigation Officer.",
        "knowledge": "In-universe testimony regarding the incident: تعلم أن القائد طارق غادر الجسر لتناول القهوة، ورأيت المهندس رامز يتفقد مضخات التوازن في العنبر الخلفي.",
        "guilty": true
      },
      {
        "name": "Ramez",
        "profession": "Chief Propulsion Engineer",
        "publicIdentity": "You are Ramez, serving as the Chief Propulsion Engineer.",
        "knowledge": "In-universe testimony regarding the incident: رأيت د. دانية تدخل جسر القيادة حاملة لوحاً رقمياً عند 3:55 ص وبدت تبحث في سجلات التوجيه.",
        "guilty": true
      },
      {
        "name": "Dania",
        "profession": "Oceanographic Data Specialist",
        "publicIdentity": "You are Dania, serving as the Oceanographic Data Specialist.",
        "knowledge": "In-universe testimony regarding the incident: لاحظت أن سجل النبضات الصوتية للسونار كان صامتاً تماماً ولم يصدر أي مسح صوتي خلال النصف ساعة الحرجة.",
        "guilty": true
      }
    ],
    "innocentPool": [
      {
        "name": "Tariq",
        "profession": "EEG Systems Technician",
        "publicIdentity": "You are Tariq, serving as the EEG Systems Technician.",
        "knowledge": "In-universe testimony regarding the incident: رأيت مهند يقف قرب كونسول التوجيه يحمل أداة الفك الكهرومغناطيسية عند 3:40 ص، ونزع الشريحة يتطلب مفتاحاً معزولاً.",
        "guilty": false
      },
      {
        "name": "Sami",
        "profession": "Volunteer Coordinator",
        "publicIdentity": "You are Sami, serving as the Volunteer Coordinator.",
        "knowledge": "In-universe testimony regarding the incident: ضغط الهواء ونسب الأكسجين ظلت في حدود الأمان التام في جميع الحجرات دون أي تسريب.",
        "guilty": false
      },
      {
        "name": "Rima",
        "profession": "Sonar & Depth Profiler",
        "publicIdentity": "You are Rima, serving as the Sonar & Depth Profiler.",
        "knowledge": "In-universe testimony regarding the incident: منفذ شريحة الملاحة فُصل بنظافة باستخدام أداة سحب الشرائح دون إتلاف المقبس الحساس.",
        "guilty": false
      },
      {
        "name": "Khaled",
        "profession": "Archive & Documentation Assistant",
        "publicIdentity": "You are Khaled, serving as the Archive & Documentation Assistant.",
        "knowledge": "In-universe testimony regarding the incident: الدفة الميكانيكية كانت موجهة بزاوية انحراف متعمدة قدرها 15 درجة نحو إحداثيات محددة.",
        "guilty": false
      },
      {
        "name": "Nour",
        "profession": "Marine Geologist",
        "publicIdentity": "You are Nour, serving as the Marine Geologist.",
        "knowledge": "In-universe testimony regarding the incident: إحداثيات الانحراف المبرمجة تتطابق مع موقع حطام سفينة تاريخية غارقة لم يتم توثيقها رسمياً.",
        "guilty": false
      },
      {
        "name": "Bassem",
        "profession": "Night Reception & Gate Guard",
        "publicIdentity": "You are Bassem, serving as the Night Reception & Gate Guard.",
        "knowledge": "In-universe testimony regarding the incident: كشافات الغوص المغناطيسية الفردية كانت مسحوبة من خزانة الطوارئ على الجسر.",
        "guilty": false
      },
      {
        "name": "Layla",
        "profession": "Passenger Concert Pianist",
        "publicIdentity": "You are Layla, serving as the Passenger Concert Pianist.",
        "knowledge": "In-universe testimony regarding the incident: جهاز الإرسال الصوتي المائي تم تحويله لوضع الاستقبال الصامت قبل نصف ساعة من الإنذار.",
        "guilty": false
      },
      {
        "name": "Hossam",
        "profession": "Railway Mail Courier",
        "publicIdentity": "You are Hossam, serving as the Railway Mail Courier.",
        "knowledge": "In-universe testimony regarding the incident: أداة سحب الشرائح المعزولة كانت معلقة في حاملها المعتاد عند محطة الملاحة.",
        "guilty": false
      },
      {
        "name": "Mona",
        "profession": "Executive Administrative Secretary",
        "publicIdentity": "You are Mona, serving as the Executive Administrative Secretary.",
        "knowledge": "In-universe testimony regarding the incident: الخرائط الاحتياطية في الذاكرة المساعدة تم تعطيل استدعائها التلقائي بأمر يدوي مباشر.",
        "guilty": false
      }
    ],
    "clues": [
      "The navigation chip was extracted using the helm station’s anti-static magnetic key.",
      "The sub’s heading was manually locked toward uncharted coordinates harboring a sunken wreck.",
      "The stolen memory chip was hidden inside the bridge air intake filter."
    ]
  },
  "court": {
    "title": "The Silent Case",
    "description": "Moments before the final verdict in a historic courthouse, the single piece of decisive written evidence vanishes from the locked evidence vault.",
    "introduction": {
      "setting": "High Court of Justice - Evidence Archive, a historic neoclassical hall of law.",
      "situation": "A landmark corporate corruption trial is reaching its climax as the jury prepares to deliver the final verdict.",
      "incident": "The locked steel safe inside the evidence vault was found empty—the original signed confession document was swapped with blank paper.",
      "stakes": "If the original document is destroyed, the guilty oligarch will walk free without possibility of appeal.",
      "objective": "Interrogate court clerks, security bailiffs, and legal counsels to unmask the corrupt insider."
    },
    "solution": "Who is the Culprit?\nAdli (Courthouse Security Guard), in league with conspirators.\n\nWhat did they do?\nUnlocked the evidence vault with a duplicate key, took the signed confession, and destroyed it in the basement furnace.\n\nWhy did they do it?\nTo secure a massive bribe from the defendant’s syndicate to guarantee an acquittal.",
    "guiltyPool": [
      {
        "name": "Adel",
        "profession": "Court Records Clerk",
        "publicIdentity": "You are Adel, serving as the Court Records Clerk.",
        "knowledge": "In-universe testimony regarding the incident: تعلم أن القاضي منصور غادر غرفته عند 8:20 م، ورأيت المدعية سلمى تراجع سجلات الأحراز في المكتب.",
        "guilty": true
      },
      {
        "name": "Counselor Mansour",
        "profession": "Senior Judicial Assistant",
        "publicIdentity": "You are Counselor Mansour, serving as the Senior Judicial Assistant.",
        "knowledge": "In-universe testimony regarding the incident: رأيت عادل يقف قرب ممر غرفة الأحراز يحمل أضابير قضائية عند 8:25 م، ومفتاح الخزانة كان مودعاً في درج قلم الكتاب.",
        "guilty": true
      },
      {
        "name": "Salma",
        "profession": "Restoration & Relics Specialist",
        "publicIdentity": "You are Salma, serving as the Restoration & Relics Specialist.",
        "knowledge": "In-universe testimony regarding the incident: رأيت محامي الدفاع نادر يخرج من مكتب قلم الكتاب حاملاً حقيبة جلدية منتفخة عند 8:28 م وبدا متوتراً.",
        "guilty": true
      }
    ],
    "innocentPool": [
      {
        "name": "Nader",
        "profession": "HVAC & Climate Tech",
        "publicIdentity": "You are Nader, serving as the HVAC & Climate Tech.",
        "knowledge": "In-universe testimony regarding the incident: لاحظت أن الآلة الكاتبة في غرفة الأرشيف كانت صامتة تماماً ولم يصدر منها أي صوت نقر بين 8:15 و 8:45 م.",
        "guilty": false
      },
      {
        "name": "Huda",
        "profession": "Defense Attorney",
        "publicIdentity": "You are Huda, serving as the Defense Attorney.",
        "knowledge": "In-universe testimony regarding the incident: أوراق الاستبدال المائية البيضاء مطابقة للورق القضائي المودع في خزانة قرطاسية أمين السر عادل.",
        "guilty": false
      },
      {
        "name": "Faris",
        "profession": "Assistant Train Engineer",
        "publicIdentity": "You are Faris, serving as the Assistant Train Engineer.",
        "knowledge": "In-universe testimony regarding the incident: أجهزة التفتيش أكدت عدم خروج أي شخص أو تهريب أي مستند خارج المبنى طوال فترة المساء.",
        "guilty": false
      },
      {
        "name": "Reem",
        "profession": "Court Stenographer",
        "publicIdentity": "You are Reem, serving as the Court Stenographer.",
        "knowledge": "In-universe testimony regarding the incident: قفل خزانة الأحراز لم تظهر عليه أي آثار كسر أو خدوش، وفُتح بالمفتاح الأصلي المحفوظ لدى قلم الكتاب.",
        "guilty": false
      },
      {
        "name": "Tariq",
        "profession": "EEG Systems Technician",
        "publicIdentity": "You are Tariq, serving as the EEG Systems Technician.",
        "knowledge": "In-universe testimony regarding the incident: دفتر الحسابات الأصلي المفقود كان يضم أسماء شخصيات نافذة غير واردة في أوراق الاتهام المبدئية.",
        "guilty": false
      },
      {
        "name": "Lama",
        "profession": "Medical Data Analyst",
        "publicIdentity": "You are Lama, serving as the Medical Data Analyst.",
        "knowledge": "In-universe testimony regarding the incident: الصفحات المنتزعة هي التي كانت تحمل التوقيعات الحية والمطابقات البنكية غير القابلة للطعن.",
        "guilty": false
      },
      {
        "name": "Youssef",
        "profession": "Locomotive Mechanic",
        "publicIdentity": "You are Youssef, serving as the Locomotive Mechanic.",
        "knowledge": "In-universe testimony regarding the incident: باب مكتب أمين السر عادل كان مفتوحاً جزئياً أثناء فترة الاستراحة.",
        "guilty": false
      },
      {
        "name": "Samir",
        "profession": "Courthouse Facilities Manager",
        "publicIdentity": "You are Samir, serving as the Courthouse Facilities Manager.",
        "knowledge": "In-universe testimony regarding the incident: ساعة الحائط في غرفة الأرشيف تدق رناتها كل ربع ساعة بدقة مسموعة لمن يتواجد بداخلها.",
        "guilty": false
      },
      {
        "name": "Mona",
        "profession": "Executive Administrative Secretary",
        "publicIdentity": "You are Mona, serving as the Executive Administrative Secretary.",
        "knowledge": "In-universe testimony regarding the incident: نسخ الإحراز المصورة الموزعة كانت تحمل أرقام الصفحات الأصلية التي تم انتزاعها.",
        "guilty": false
      }
    ],
    "clues": [
      "The evidence safe was opened cleanly using the daily master code and a duplicate key.",
      "Burnt fragments of embossed legal paper were found in the courthouse basement incinerator.",
      "The logbook entry for the evidence safe was intentionally redacted with black ink."
    ]
  },
  "greenhouse": {
    "title": "Night in the Greenhouse",
    "description": "A miraculous medicinal plant species is stolen from an airtight Victorian glass conservatory on the eve of its global announcement.",
    "introduction": {
      "setting": "Royal Botanical Conservatory - Specimen Pavilion, an airtight Victorian glass greenhouse.",
      "situation": "Botanists, pharmaceutical researchers, and benefactors gathered to celebrate the blooming of a rare synthetic orchid.",
      "incident": "Under cover of a severe rainstorm, the climate-controlled glass terrarium was breached and the unique specimen was uprooted.",
      "stakes": "The orchid will wilt and die if not placed in high-humidity nutrient soil within two hours.",
      "objective": "Question the botanists, caretakers, and researchers to locate the stolen specimen before it perishes."
    },
    "solution": "Who is the Culprit?\nDani (Irrigation Systems Technician), in league with conspirators.\n\nWhat did they do?\nCut the terrarium glass with a diamond-tip scribe, uprooted the orchid, and stashed it in an insulated humidified flask.\n\nWhy did they do it?\nTo deliver the live plant to an international agro-chemical conglomerate for a massive bounty.",
    "guiltyPool": [
      {
        "name": "Dr. Souhail",
        "profession": "Lead Genetic Botanist",
        "publicIdentity": "You are Dr. Souhail, serving as the Lead Genetic Botanist.",
        "knowledge": "In-universe testimony regarding the incident: تعلم أن د. ليلى كانت تسقي الشتلات في القطاع أ، ورأيت باسم يفحص فوهات الرذاذ في الممر الرئيسي.",
        "guilty": true
      },
      {
        "name": "Bassem",
        "profession": "Night Reception & Gate Guard",
        "publicIdentity": "You are Bassem, serving as the Night Reception & Gate Guard.",
        "knowledge": "In-universe testimony regarding the incident: رأيت طارق يحمل قارورة حرارية معزولة قرب المخرج الخلفي عند 11:35 م وبدا يتلفت بحذر.",
        "guilty": true
      },
      {
        "name": "Deema",
        "profession": "Astrophotography Data Logger",
        "publicIdentity": "You are Deema, serving as the Astrophotography Data Logger.",
        "knowledge": "In-universe testimony regarding the incident: قاعدة البيانات الجينية تم تسجيل الدخول إليها من شاشة الدفيئة الطرفية المشتركة.",
        "guilty": true
      }
    ],
    "innocentPool": [
      {
        "name": "Dr. Layla",
        "profession": "Lead Epigrapher & Historian",
        "publicIdentity": "You are Dr. Layla, serving as the Lead Epigrapher & Historian.",
        "knowledge": "In-universe testimony regarding the incident: رأيت د. سهيل يقف قرب حاضنة الأوركيد يحمل مقص التقليم عند 11:10 م، وتعلمين أن حفظ النبتة يحتاج هلاماً مغذياً خاصاً.",
        "guilty": false
      },
      {
        "name": "Tariq",
        "profession": "EEG Systems Technician",
        "publicIdentity": "You are Tariq, serving as the EEG Systems Technician.",
        "knowledge": "In-universe testimony regarding the incident: لاحظت أن خزان الخلط في عنبر التربة كان جافاً تماماً ونظيفاً دون أي آثار خلط أسمدة.",
        "guilty": false
      },
      {
        "name": "Rami",
        "profession": "Electrical & Backup Power Tech",
        "publicIdentity": "You are Rami, serving as the Electrical & Backup Power Tech.",
        "knowledge": "In-universe testimony regarding the incident: السياج الكهربائي الخارجي للمزرعة ظل موصولاً بالكامل دون أي اختراق من الخارج.",
        "guilty": false
      },
      {
        "name": "Salma",
        "profession": "Restoration & Relics Specialist",
        "publicIdentity": "You are Salma, serving as the Restoration & Relics Specialist.",
        "knowledge": "In-universe testimony regarding the incident: إنزيمات زهرة الأوركيد تتلف في غضون 20 دقيقة ما لم تُحفظ في وسط غذائي هلامي مبرد.",
        "guilty": false
      },
      {
        "name": "Faris",
        "profession": "Assistant Train Engineer",
        "publicIdentity": "You are Faris, serving as the Assistant Train Engineer.",
        "knowledge": "In-universe testimony regarding the incident: مقص التقليم الجراحي أعيد إلى خزانة الأدوات المشتركة وعليه آثار عصارة نباتية حديثة.",
        "guilty": false
      },
      {
        "name": "Nadia",
        "profession": "Museum Educator & Docent",
        "publicIdentity": "You are Nadia, serving as the Museum Educator & Docent.",
        "knowledge": "In-universe testimony regarding the incident: أنابيب الهلام المغذي المبردة كانت قد صُرفت صباحاً لـ د. سهيل لغايات التجربة الجينية.",
        "guilty": false
      },
      {
        "name": "Hassan",
        "profession": "Dome Glass Maintenance Tech",
        "publicIdentity": "You are Hassan, serving as the Dome Glass Maintenance Tech.",
        "knowledge": "In-universe testimony regarding the incident: رطوبة الحاضنة المركزية انخفضت بنسبة 15% فور فتح الغطاء الزجاجي عند 11:25 م.",
        "guilty": false
      },
      {
        "name": "Mona",
        "profession": "Executive Administrative Secretary",
        "publicIdentity": "You are Mona, serving as the Executive Administrative Secretary.",
        "knowledge": "In-universe testimony regarding the incident: شركة أدوية دولية قدمت عرض تمويل ضخم مشترطة إثبات التفوق الجيني للعينة قبل نهاية الشهر.",
        "guilty": false
      },
      {
        "name": "Omar",
        "profession": "Equipment & Vault Custodian",
        "publicIdentity": "You are Omar, serving as the Equipment & Vault Custodian.",
        "knowledge": "In-universe testimony regarding the incident: إضاءة عنبر التربة والخلط كانت مطفأة تماماً طوال فترة المساء حتى انطلاق الإنذار.",
        "guilty": false
      }
    ],
    "clues": [
      "The terrarium glass was incised cleanly with a diamond-tip glass cutter.",
      "Luminous yellow orchid pollen residue was detected on a pair of rubber work gloves.",
      "A portable humidified flask was prepared in the potting shed before the storm."
    ]
  },
  "royal_kitchen": {
    "title": "The Royal Feast",
    "description": "During an opulent banquet in a historic palace, a sealed royal decree is stolen from the dessert serving tray before reaching the king.",
    "introduction": {
      "setting": "Palace Banquet Hall & Royal Kitchens, alive with bustling servants and glittering aristocrats.",
      "situation": "High-ranking dignitaries and courtiers are attending a grand state dinner in the golden dining hall.",
      "incident": "As the dessert cart passed through the dim service corridor, the sealed royal letter was snatched from the silver cloche.",
      "stakes": "The decree contains orders affecting royal succession. If revealed to the public, civil unrest will follow.",
      "objective": "Interrogate the royal butler, palace chefs, and tasters to identify the thief."
    },
    "solution": "Who is the Culprit?\nFaris (Executive Royal Chef), in league with conspirators.\n\nWhat did they do?\nSnatched the royal decree from the cloche while inspecting the dessert cart in the pantry and concealed it inside a hollow bread loaf.\n\nWhy did they do it?\nTo sell the royal succession secrets to a rival noble faction for an immense bounty and royal title.",
    "guiltyPool": [
      {
        "name": "Shadi",
        "profession": "Royal Head Butler",
        "publicIdentity": "You are Shadi, serving as the Royal Head Butler.",
        "knowledge": "In-universe testimony regarding the incident: تعلم أن كبير الطهاة مروان كان يشرف على اللمسات الأخيرة للمأدبة، ورأيت مساعدة التشريفات هند تفحص الفضيات في الممر.",
        "guilty": true
      },
      {
        "name": "Marwan",
        "profession": "Executive Pastry Chef",
        "publicIdentity": "You are Marwan, serving as the Executive Pastry Chef.",
        "knowledge": "In-universe testimony regarding the incident: رأيت شادي يهمس بارتباك في ممر التجهيز قرب صينية المرسوم عند 9:35 م، والصينية كانت مغطاة بغطاء مخملي ثقيل.",
        "guilty": true
      },
      {
        "name": "Hind",
        "profession": "Legal & Intellectual Property Director",
        "publicIdentity": "You are Hind, serving as the Legal & Intellectual Property Director.",
        "knowledge": "In-universe testimony regarding the incident: رأيت ساقي القصر نبيل يمر مسرعاً عبر ممر المؤن حاملاً مجلداً جلدياً عند 9:42 م وبدا قلقاً.",
        "guilty": true
      }
    ],
    "innocentPool": [
      {
        "name": "Nabil",
        "profession": "Chief Train Conductor",
        "publicIdentity": "You are Nabil, serving as the Chief Train Conductor.",
        "knowledge": "In-universe testimony regarding the incident: لاحظت أن سجل القبو المكتوب لم يُفتح ولم تُسجل فيه أي حركة استلام زجاجات طوال فترة العشاء.",
        "guilty": false
      },
      {
        "name": "Faris",
        "profession": "Assistant Train Engineer",
        "publicIdentity": "You are Faris, serving as the Assistant Train Engineer.",
        "knowledge": "In-universe testimony regarding the incident: إزالة الشمع الملكي البنفسجي دون تمزيق الرق يتطلب تسخيناً لطيفاً بسكين دافئ.",
        "guilty": false
      },
      {
        "name": "Jamila",
        "profession": "Royal Food Taster & Quality Inspector",
        "publicIdentity": "You are Jamila, serving as the Royal Food Taster & Quality Inspector.",
        "knowledge": "In-universe testimony regarding the incident: الغطاء المخملي لصينية المرسوم لم تظهر عليه أي بقع دهنية أو آثار زيوت طهي.",
        "guilty": false
      },
      {
        "name": "Samer",
        "profession": "Mountain Supply Driver",
        "publicIdentity": "You are Samer, serving as the Mountain Supply Driver.",
        "knowledge": "In-universe testimony regarding the incident: لم يمر عبر بوابة الممر أي شخص من خارج طاقم الخدمة المصرح لهم بحمل الأطباق.",
        "guilty": false
      },
      {
        "name": "Lubna",
        "profession": "Lab Safety & Security Officer",
        "publicIdentity": "You are Lubna, serving as the Lab Safety & Security Officer.",
        "knowledge": "In-universe testimony regarding the incident: عثرت على شظايا شمع بنفسجي مكسورة ملقاة في سلة مهملات ممر التجهيز.",
        "guilty": false
      },
      {
        "name": "Tariq",
        "profession": "EEG Systems Technician",
        "publicIdentity": "You are Tariq, serving as the EEG Systems Technician.",
        "knowledge": "In-universe testimony regarding the incident: المرسوم الملكي كان يحسم عزلاً إدارياً لأقدم عائلات التشريفات في القصر.",
        "guilty": false
      },
      {
        "name": "Rima",
        "profession": "Sonar & Depth Profiler",
        "publicIdentity": "You are Rima, serving as the Sonar & Depth Profiler.",
        "knowledge": "In-universe testimony regarding the incident: الملك طلب استعراض المرسوم فور انتهاء طبق الحلوى مباشرة.",
        "guilty": false
      },
      {
        "name": "Hossam",
        "profession": "Railway Mail Courier",
        "publicIdentity": "You are Hossam, serving as the Railway Mail Courier.",
        "knowledge": "In-universe testimony regarding the incident: زجاجات الحلوى المعتقة تم إحضارها إلى حجرة الخدمة منذ الساعة 8:30 مساءً قبل بدء العشاء.",
        "guilty": false
      },
      {
        "name": "Mona",
        "profession": "Executive Administrative Secretary",
        "publicIdentity": "You are Mona, serving as the Executive Administrative Secretary.",
        "knowledge": "In-universe testimony regarding the incident: المرسوم كان مختوماً بخاتم الشمع البنفسجي البيضاوي الخاص بالديوان الملكي.",
        "guilty": false
      }
    ],
    "clues": [
      "The silver dessert cloche was opened in the corridor between the kitchen and ballroom.",
      "Red wax fragments matching the royal seal were found on the chef’s pantry bread rack.",
      "The royal decree was rolled and baked inside a hollow artisanal loaf of sourdough."
    ]
  },
  "gala_toast": {
    "title": "A Final Toast",
    "description": "During an aristocratic gala celebrating a new family testament, the wealthy host is poisoned by a spiked champagne flute. Everyone has a motive, but only one spiked the glass.",
    "introduction": {
      "setting": "Ashford Manor - Grand Banquet Ballroom, surrounded by sparkling chandeliers and private estate grounds.",
      "situation": "Billionaire patriarch Murad Al-Sayed has gathered family, business partners, and legal counsel to announce major changes to his estate testament.",
      "incident": "Moments after raising his crystal champagne flute for the honorary toast, Murad collapses in agony from a lethal chemical neurotoxin.",
      "stakes": "The manor gates are sealed by private security. The murderer is in this room and must be caught before evidence is destroyed.",
      "objective": "Interrogate the banquet guests and staff to expose who poisoned Murad’s toast."
    },
    "solution": "Who is the Culprit?\nSamia (Family Estate Attorney).\n\nWhat did she do?\nSwapped Murad's cardiovascular medication with a concentrated lethal dose and stirred it into his champagne flute while it sat unattended.\n\nWhy did she do it?\nShe discovered Murad planned to disinherit her and revoke her lucrative estate management rights in the updated testament.\n\nHow was the crime committed?\nShe used the five minutes while Murad was greeting benefactors near the garden doors to slip the poison into his glass on the side table.\n\nWhich clues pointed to her?\nThe heated confrontation witnessed in the back hall, her privileged access to Murad's medical dossier, and an empty prescription vial found in her evening clutch.",
    "guiltyPool": [
      {
        "name": "Samia",
        "profession": "Family Estate Lawyer",
        "publicIdentity": "You are Samia, serving as the Family Estate Lawyer.",
        "knowledge": "In-universe testimony regarding the incident: تعلم أن د. كريم كان يتحدث مع هند قرب شرفة الحديقة، ورأيت الشريك التجاري فارس يتجادل مع مراد حول أسهم الشركة.",
        "guilty": true
      },
      {
        "name": "Dr. Kareem",
        "profession": "Personal Physician",
        "publicIdentity": "You are Dr. Kareem, serving as the Personal Physician.",
        "knowledge": "In-universe testimony regarding the incident: رأيت سامية تقف قرب طاولة المشروبات الخاصة في ممر المكتبة عند 10:20 م، وقطرات القلب عديمة اللون والرائحة تماماً.",
        "guilty": true
      },
      {
        "name": "Faris",
        "profession": "Assistant Train Engineer",
        "publicIdentity": "You are Faris, serving as the Assistant Train Engineer.",
        "knowledge": "In-universe testimony regarding the incident: رأيت مديرة القصر هند تحمل علبة دواء مراد في الممر عند 10:10 م وبدت في عجلة من أمرها.",
        "guilty": true
      }
    ],
    "innocentPool": [
      {
        "name": "Hind",
        "profession": "Legal & Intellectual Property Director",
        "publicIdentity": "You are Hind, serving as the Legal & Intellectual Property Director.",
        "knowledge": "In-universe testimony regarding the incident: كأس مراد الخاص بالكريستال بقي على طاولة الخدمة الجانبية بالمكتبة دون مراقبة لمدة 10 دقائق.",
        "guilty": false
      },
      {
        "name": "Mona",
        "profession": "Executive Administrative Secretary",
        "publicIdentity": "You are Mona, serving as the Executive Administrative Secretary.",
        "knowledge": "In-universe testimony regarding the incident: مراد أعلن نيته حرمان جميع الورثة التقليديين من العائدات المباشرة قبل الحفل بساعة.",
        "guilty": false
      },
      {
        "name": "Tariq",
        "profession": "EEG Systems Technician",
        "publicIdentity": "You are Tariq, serving as the EEG Systems Technician.",
        "knowledge": "In-universe testimony regarding the incident: طاولة المشروبات الخاصة في ممر المكتبة كانت مخصصة لمراد وضيوفه المقربين فقط.",
        "guilty": false
      },
      {
        "name": "Layla",
        "profession": "Passenger Concert Pianist",
        "publicIdentity": "You are Layla, serving as the Passenger Concert Pianist.",
        "knowledge": "In-universe testimony regarding the incident: مراد رفض تمويل صفقة اللوحات الجديدة وأنهى النقاش بحدة قبل بدء حفل العشاء.",
        "guilty": false
      },
      {
        "name": "Omar",
        "profession": "Equipment & Vault Custodian",
        "publicIdentity": "You are Omar, serving as the Equipment & Vault Custodian.",
        "knowledge": "In-universe testimony regarding the incident: البوابات الإلكترونية الخارجية أغلقت عند التاسعة مساءً ولم يدخل أي شخص غريب.",
        "guilty": false
      },
      {
        "name": "Rania",
        "profession": "Investigative Journalist",
        "publicIdentity": "You are Rania, serving as the Investigative Journalist.",
        "knowledge": "In-universe testimony regarding the incident: حقيبة د. كريم الطبية كانت متروكة في غرفة المعاطف المشتركة بجوار المدخل.",
        "guilty": false
      },
      {
        "name": "Youssef",
        "profession": "Locomotive Mechanic",
        "publicIdentity": "You are Youssef, serving as the Locomotive Mechanic.",
        "knowledge": "In-universe testimony regarding the incident: سامية طلبت لقاءً منفرداً مع مراد في مكتبه قبل العشاء وخرجت منه غاضبة.",
        "guilty": false
      },
      {
        "name": "Salma",
        "profession": "Restoration & Relics Specialist",
        "publicIdentity": "You are Salma, serving as the Restoration & Relics Specialist.",
        "knowledge": "In-universe testimony regarding the incident: حسابات الشركة كانت تخضع لتدقيق خارجي كشف عن استقطاعات غير مبررة في الرسوم القانونية.",
        "guilty": false
      },
      {
        "name": "Khaled",
        "profession": "Archive & Documentation Assistant",
        "publicIdentity": "You are Khaled, serving as the Archive & Documentation Assistant.",
        "knowledge": "In-universe testimony regarding the incident: مراد كان ينوي توقيع استبدال محامي العائلة رسمياً صباح يوم الاثنين.",
        "guilty": false
      }
    ],
    "clues": [
      "The champagne in Murad’s glass contained a fatal overdose of his own prescribed cardiac medication.",
      "Murad’s glass was left unattended on the credenza between 20:15 and 20:25.",
      "An empty prescription dropper vial was discovered discarded near the private library."
    ]
  }
};
