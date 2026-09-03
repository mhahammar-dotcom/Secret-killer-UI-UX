// Comprehensive English & Arabic Translations for Secret Killer
// Realistic natural English localization for all stories, characters, clues, solutions, and game UI.

export type Language = 'ar' | 'en';

export interface UIStrings {
  // App General
  appName: string;
  gameTagline: string;
  premiumEdition: string;
  settings: string;
  saveAndClose: string;
  back: string;
  home: string;
  cancel: string;
  confirm: string;
  next: string;
  close: string;
  start: string;
  delete: string;
  edit: string;

  // Home Screen
  startGame: string;
  storyArchive: string;
  howToPlay: string;
  gameRules: string;
  achievements: string;
  onlinePartyMode: string;
  comingSoon: string;
  rateGame: string;
  totalStoriesCount: string;
  customCasesCount: string;

  // Settings Modal
  gameSettings: string;
  languageSelect: string;
  arabicLang: string;
  englishLang: string;
  soundEffects: string;
  soundEffectsDesc: string;
  ambientMusic: string;
  ambientMusicDesc: string;
  discussionTimer: string;
  minutes: string;
  minShort: string;
  secretBallot: string;
  secretBallotDesc: string;
  fastVoting: string;
  fastVotingDesc: string;
  fastVotingActiveBadge: string;
  fastVoteOneTapHint: string;
  adsAndMonetization: string;
  adsAndMonetizationDesc: string;
  adMobStatus: string;
  testAdPreview: string;
  interstitialAdBadge: string;
  bannerAdBadge: string;

  // Story Select Screen
  caseArchive: string;
  selectStoryTitle: string;
  selectStorySubtitle: string;
  selectCaseDesc: string;
  filterStories: string;
  filter: string;
  allStories: string;
  allCases: string;
  easy: string;
  medium: string;
  hard: string;
  easyDifficulty: string;
  mediumDifficulty: string;
  hardDifficulty: string;
  customStories: string;
  customCases: string;
  createCustomCase: string;
  randomPick: string;
  randomStory: string;
  randomStorySubtitle: string;
  players: string;
  playersRange: string;
  difficulty: string;
  newBadge: string;
  badgeNew: string;
  badgeCustom: string;
  badgeFixed: string;
  noStoriesMatch: string;
  noCasesMatch: string;

  // Case Briefing / Intro Screen
  caseFile: string;
  primaryObjective: string;
  setupPlayers: string;
  caseDossier: string;
  caseSetting: string;
  currentSituation: string;
  theIncident: string;
  investigationStakes: string;
  detectiveObjective: string;
  investigatorsRequired: string;
  difficultyLabel: string;
  proceedToSetup: string;

  // Player Setup Screen
  playerSetupTitle: string;
  playerRoster: string;
  playerRosterDesc: string;
  playerCountLabel: string;
  enterPlayerName: string;
  addPlayer: string;
  quickFill: string;
  startInvestigation: string;
  startSecretRoleAssignment: string;
  minPlayersWarning: string;
  maxPlayersWarning: string;
  playerNumLabel: string;

  // Role Pass Screen
  characterCard: string;
  storyRolesDistribution: string;
  passDeviceTo: string;
  ensureNoOneLookingCard: string;
  revealRole: string;
  knownIdentityToAll: string;
  testimonyAndKnowledge: string;
  secretRoleWarning: string;
  youAreTheCulprit: string;
  youAreTheOnlyKiller: string;
  yourKillerPartner: string;
  yourKillerPartners: string;
  killerAllianceGuidance: string;
  keepDetailsGuidance: string;
  finishPassingStartDiscussion: string;
  iMemorizedPassDevice: string;
  handDeviceTo: string;
  passToPlayerWarning: string;
  revealRoleSecretly: string;
  tapToReveal: string;
  keepScreenHidden: string;
  iAmReady: string;

  // Secret Role Reveal Screen
  confidentialDossier: string;
  assignedCharacter: string;
  profession: string;
  publicPersona: string;
  classifiedKnowledge: string;
  youAreGuilty: string;
  youAreGuiltyTitle: string;
  youAreGuiltyDesc: string;
  youAreInnocent: string;
  youAreInnocentTitle: string;
  youAreInnocentDesc: string;
  hideAndPassPhone: string;
  startInvestigationRound: string;

  // Discussion & Evidence Screen
  discussionInvestigation: string;
  evidenceTab: string;
  suspectsTab: string;
  caseBriefingTab: string;
  discussionPromptsTab: string;
  proceedToVoting: string;
  investigationPhase: string;
  roundNumber: string;
  publicClueRevealed: string;
  discussionPrompt: string;
  timeRemaining: string;
  timerPaused: string;
  resumeTimer: string;
  pauseTimer: string;
  addMinute: string;
  revealNextClue: string;
  cluesDossier: string;
  suspectRoster: string;
  proceedToVote: string;
  allCluesDiscovered: string;
  newEvidenceBadge: string;
  newEvidenceDiscovered: string;
  previouslyRevealedBadge: string;
  cluesDiscoveredSummary: string;
  remainingCluesLabel: string;
  clueLimitReachedThisRound: string;
  nextClueNextRoundHint: string;
  requestNewClueAction: string;
  allEvidenceRevealedBanner: string;
  noEvidenceRevealedYet: string;
  noEvidenceRevealedYetDesc: string;

  // Voting Screen
  votingChamber: string;
  votingAccusation: string;
  votingPrompt: string;
  castVoteForSuspect: string;
  passDeviceToVoter: string;
  ensureNoOneLooking: string;
  readyToVote: string;
  selectedSuspect: string;
  voteLockWarning: string;
  confirmVoteFinal: string;
  changeSelection: string;
  secretVoteIndicator: string;
  publicVoteIndicator: string;
  secretBallotActiveBadge: string;
  publicBallotActiveBadge: string;
  votedBy: string;
  noVotesForSuspect: string;
  revealVoterIdentities: string;
  hideVoterIdentities: string;
  proceedToConfirm: string;
  voterTurn: string;
  selectSuspectToAccuse: string;
  confirmAccusation: string;
  areYouSureVote: string;
  voteSubmitted: string;
  nextVoter: string;

  // Vote Result Screen
  verdictAnnounced: string;
  voteResults: string;
  voteTie: string;
  voteInconclusive: string;
  voteTieDescription: string;
  voteDistribution: string;
  suspectEliminatedNotice: string;
  tallyResults: string;
  sessionEndedReveal: string;
  noConsensusTitle: string;
  noConsensusDesc: string;
  suspectArrested: string;
  wrongAccusationTitle: string;
  wrongAccusationDesc: string;
  strikesLeft: string;
  continueToNextRound: string;
  gameOverGuiltyWins: string;
  seeFinalOutcome: string;
  guiltyCaughtTitle: string;
  guiltyCaughtDesc: string;

  // Killer Reveal Screen
  killerReveal: string;
  theTruthRevealed: string;
  thePerpetratorIs: string;
  killerRole: string;
  innocentsWon: string;
  killerWon: string;
  innocentsTriumph: string;
  innocentsTriumphDesc: string;
  killerEscaped: string;
  killerEscapedDesc: string;
  revealFullStory: string;
  howCrimeCommitted: string;

  // Crime Explanation Screen
  crimeExplanation: string;
  revealTruthFullResults: string;
  motive: string;
  plan: string;
  execution: string;
  concealment: string;
  investigationReport: string;
  howItHappened: string;
  evidenceBreakdown: string;
  fullCaseSolution: string;
  completeDebrief: string;
  viewFinalResults: string;

  // Reveal Truth Screen
  theFullTruth: string;
  investigationSummaryConfessions: string;
  realPlayerIdentities: string;
  viewFinalStats: string;

  // Game Results & Debrief Screen
  finalResults: string;
  gameOverHowDidYouDo: string;
  innocentsWonDesc: string;
  killerWonDesc: string;
  theCulpritWas: string;
  theCulpritsWere: string;
  correctVotes: string;
  playNewCase: string;
  returnToMainMenu: string;
  caseClosed: string;
  investigationDebrief: string;
  detectiveRating: string;
  roundsTaken: string;
  wrongAccusations: string;
  playAgain: string;
  returnToArchive: string;

  // Rules & Modals
  rulesTitle: string;
  gameplayGuide: string;
  rule1Title: string;
  rule1Desc: string;
  rule2Title: string;
  rule2Desc: string;
  rule3Title: string;
  rule3Desc: string;
  rule4Title: string;
  rule4Desc: string;

  // Custom Story Modal
  caseTitleLabel: string;
  crimeDescriptionLabel: string;
  solutionAndConfessionLabel: string;
  caseCharacters: string;
  selectCulpritHint: string;
  saveCustomCaseAndPlay: string;
}

export const AR_STRINGS: UIStrings = {
  appName: 'سيكرت كيلر',
  gameTagline: 'اكتشف الحقيقة قبل فوات الأوان',
  premiumEdition: 'النسخة المميزة',
  settings: 'الإعدادات',
  saveAndClose: 'حفظ وإغلاق',
  back: 'رجوع',
  home: 'الرئيسية',
  cancel: 'إلغاء',
  confirm: 'تأكيد',
  next: 'التالي',
  close: 'إغلاق',
  start: 'ابدأ',
  delete: 'حذف',
  edit: 'تعديل',

  startGame: 'ابدأ اللعبة',
  storyArchive: 'أرشيف القضايا',
  howToPlay: 'طريقة اللعب',
  gameRules: 'قواعد التحقيق',
  achievements: 'الإنجازات',
  onlinePartyMode: 'اللعب الجماعي أونلاين',
  comingSoon: 'قريباً',
  rateGame: 'تقييم اللعبة',
  totalStoriesCount: 'قصة كاملة',
  customCasesCount: 'قضية مخصصة',

  gameSettings: 'إعدادات اللعبة',
  languageSelect: 'لغة اللعبة (Language)',
  arabicLang: 'العربية (Arabic)',
  englishLang: 'English (الإنجليزية)',
  soundEffects: 'المؤثرات الصوتية',
  soundEffectsDesc: 'أصوات الكشف، الختم، والتصويت',
  ambientMusic: 'موسيقى الغموض الحية',
  ambientMusicDesc: 'أجواء سينمائية غامضة أثناء اللعب',
  discussionTimer: 'مؤقت جولة النقاش',
  minutes: 'دقائق',
  minShort: 'د',
  secretBallot: 'نمط الاقتراع السري',
  secretBallotDesc: 'إخفاء هوية المصوتين أثناء فرز الأصوات',
  fastVoting: 'نمط التصويت السريع',
  fastVotingDesc: 'تخطي نافذة تأكيد الاتهام للتصويت المباشر بلمسة واحدة وتسريع الجولة',
  fastVotingActiveBadge: '⚡ تصويت سريع (مباشر بلمسة واحدة)',
  fastVoteOneTapHint: 'انقر على المشتبه به لتسجيل صوتك فوراً دون تأكيد',
  adsAndMonetization: 'إعلانات Google AdMob',
  adsAndMonetizationDesc: 'تفعيل وحدات إعلانات البانر والإعلانات البينية بين الجولات',
  adMobStatus: 'حالة AdMob: متصل وجاهز',
  testAdPreview: 'معاينة إعلان تجريبي',
  interstitialAdBadge: 'إعلان بيني',
  bannerAdBadge: 'إعلان بانر',

  caseArchive: 'أرشيف القضايا الجنائية',
  selectStoryTitle: 'أرشيف القضايا',
  selectStorySubtitle: 'اختر ملف القضية لبدء التحقيق وتوزيع الأدوار',
  selectCaseDesc: 'اختر ملف القضية لبدء التحقيق وتوزيع الأدوار السرية',
  filterStories: 'تصفية القضايا',
  filter: 'تصفية',
  allStories: 'الكل',
  allCases: 'الكل',
  easy: 'سهل',
  medium: 'متوسط',
  hard: 'صعب',
  easyDifficulty: 'سهل',
  mediumDifficulty: 'متوسط',
  hardDifficulty: 'صعب',
  customStories: 'مخصصة',
  customCases: 'قضايا مخصصة',
  createCustomCase: 'إنشاء قضية جديدة',
  randomPick: 'اختيار عشوائي',
  randomStory: 'قضية عشوائية',
  randomStorySubtitle: 'دع النظام يختار لك قضية مثيرة',
  players: 'لاعبين',
  playersRange: 'لاعبين',
  difficulty: 'الصعوبة',
  newBadge: 'جديد',
  badgeNew: 'جديد',
  badgeCustom: 'مخصصة',
  badgeFixed: 'محبوكة',
  noStoriesMatch: 'لا توجد قضايا تطابق هذا التصنيف',
  noCasesMatch: 'لا توجد قضايا تطابق هذا التصنيف',

  caseFile: 'ملف القضية',
  primaryObjective: 'الهدف والمهمة الرئيسية:',
  setupPlayers: 'الانتقال لتحديد اللاعبين',
  caseDossier: 'ملف القضية',
  caseSetting: 'مسرح الأحداث',
  currentSituation: 'الوضع الراهن',
  theIncident: 'الحادثة الغامضة',
  investigationStakes: 'الرهان والمخاطر',
  detectiveObjective: 'مهمة المحققين',
  investigatorsRequired: 'المحققون المطلوبون',
  difficultyLabel: 'مستوى الصعوبة',
  proceedToSetup: 'الانتقال لاختيار اللاعبين',

  playerSetupTitle: 'إعداد وتحديد اللاعبين',
  playerRoster: 'قائمة اللاعبين والمشتبه بهم',
  playerRosterDesc: 'أدخل أسماء اللاعبين المشاركين في هذه الجلسة',
  playerCountLabel: 'عدد اللاعبين',
  enterPlayerName: 'اكتب اسم اللاعب...',
  addPlayer: 'إضافة لاعب',
  quickFill: 'تعبئة أسماء سريعة',
  startInvestigation: 'بدء توزيع الأدوار السرية',
  startSecretRoleAssignment: 'بدء توزيع الأدوار السرية',
  minPlayersWarning: 'الحد الأدنى لعدد اللاعبين في هذه القضية هو',
  maxPlayersWarning: 'الحد الأقصى لعدد اللاعبين في هذه القضية هو',
  playerNumLabel: 'لاعب',

  characterCard: 'بطاقة الشخصية',
  storyRolesDistribution: 'توزيع أدوار القصة 🔒',
  passDeviceTo: 'مرر الهاتف إلى:',
  ensureNoOneLookingCard: '⚠️ تأكد من عدم وجود أي شخص بجانبك لرؤية الشاشة. اضغط على الزر أدناه لمعرفة هويتك في القصة.',
  revealRole: 'كشف شخصيتي',
  knownIdentityToAll: 'هويتك المعروفة للحاضرين:',
  testimonyAndKnowledge: 'شهادتك ومعلوماتك حول الحادثة:',
  secretRoleWarning: '⚠️ دورك السري في اللعبة (خاص بك فقط):',
  youAreTheCulprit: 'أنت المذنب في هذه الجريمة. لا تكشف هذه المعلومة لأي لاعب آخر.',
  youAreTheOnlyKiller: 'أنت القاتل الوحيد في هذه الجريمة.',
  yourKillerPartner: 'شريكك في الجريمة:',
  yourKillerPartners: 'شركاؤك في الجريمة:',
  killerAllianceGuidance: 'تعاون بذكاء لتشتيت انتباه المحققين وتجنب توجيه أصابع الاتهام إليكما.',
  keepDetailsGuidance: '💡 احتفظ بهذه التفاصيل واستخدمها بذكاء أثناء جولات النقاش والتحقيق مع بقية الحاضرين.',
  finishPassingStartDiscussion: 'إنهاء التوزيع وبدء النقاش',
  iMemorizedPassDevice: 'حفظت دوري - إخفاء وتمرير',
  handDeviceTo: 'مرر الهاتف إلى',
  passToPlayerWarning: 'تأكد من عدم وجود أي شخص بجانبك لرؤية الشاشة أثناء كشف دورك السري',
  revealRoleSecretly: 'الاطلاع على الملف السري',
  tapToReveal: 'اضغط لعرض دورك السري',
  keepScreenHidden: 'احفظ سرية هويتك ولا تدع أحداً يرى شاشتك!',
  iAmReady: 'أنا جاهز، اكشف دوري',

  confidentialDossier: 'الملف السري للشخصية',
  assignedCharacter: 'الشخصية المسندة إليك',
  profession: 'المهنة / الصفة',
  publicPersona: 'إفادتك العلنية للجميع',
  classifiedKnowledge: 'معلوماتك السرية وأسرارك الخاصة',
  youAreGuilty: 'أنت الجاني في هذه القضية',
  youAreGuiltyTitle: 'مهمتك: التمويه، التضليل، والنجاة من التصويت!',
  youAreGuiltyDesc: 'اختلق أعذاراً مقنعة، وجّه الشبهات للمشتبه بهم الآخرين، واستغل الأدلة المشتركة دون إثارة الريبة.',
  youAreInnocent: 'أنت محقق بريء في هذه القضية',
  youAreInnocentTitle: 'مهمتك: كشف التناقضات وتحديد الفاعل الحقيقي!',
  youAreInnocentDesc: 'شارك معلوماتك السرية بذكاء، دقق في شهادات الآخرين، وتعاون مع زملائك للإيقاع بالجاني.',
  hideAndPassPhone: 'حفظت دوري! مرر الهاتف للاعب التالي',
  startInvestigationRound: 'اكتمل التوزيع - بدء جولة التحقيق الأولى',

  discussionInvestigation: 'جلسة التحقيق والنقاش',
  evidenceTab: 'الأدلة',
  suspectsTab: 'المشتبه بهم',
  caseBriefingTab: 'ملخص القضية',
  discussionPromptsTab: 'محاور النقاش',
  proceedToVoting: 'الانتقال للتصويت النهائي',
  investigationPhase: 'جولة النقاش والتحقيق',
  roundNumber: 'الجولة',
  publicClueRevealed: 'تم اكتشاف قرينة جديدة في مسرح الجريمة',
  discussionPrompt: 'السؤال المحوري للتحقيق',
  timeRemaining: 'الوقت المتبقي للنقاش',
  timerPaused: 'المؤقت متوقف مؤقتاً',
  resumeTimer: 'استئناف الوقت',
  pauseTimer: 'إيقاف مؤقت',
  addMinute: '+1 دقيقة',
  revealNextClue: 'فحص القرينة التالية',
  cluesDossier: 'سجل أدلة القضية',
  suspectRoster: 'المشتبه بهم الحاضرون',
  proceedToVote: 'إنهاء النقاش والبدء بالتصويت',
  allCluesDiscovered: 'تم الكشف عن جميع الأدلة المتاحة في مسرح الجريمة',
  newEvidenceBadge: 'قرينة جديدة',
  newEvidenceDiscovered: 'اكتشاف قرينة جديدة',
  previouslyRevealedBadge: 'قرينة سابقة',
  cluesDiscoveredSummary: 'أدلة تم كشفها',
  remainingCluesLabel: 'المتبقي',
  clueLimitReachedThisRound: 'تم كشف دليل هذه الجولة بالفعل (دليل واحد كحد أقصى لكل جولة)',
  nextClueNextRoundHint: 'الدليل التالي متاح في الجولة القادمة',
  requestNewClueAction: 'طلب فحص دليل جديد',
  allEvidenceRevealedBanner: 'تم الكشف عن جميع الأدلة المتاحة في القضية',
  noEvidenceRevealedYet: 'لم يتم فحص أي دليل حتى الآن',
  noEvidenceRevealedYetDesc: 'افحصوا مسرح الجريمة لاستخراج القرائن والشهادات المتوفرة لهذه الجولة.',

  votingChamber: 'غرفة توجيه الاتهام والتصويت',
  votingAccusation: 'جلسة توجيه الاتهام',
  votingPrompt: 'استندوا إلى القرائن والشهادات وحددوا المشتبه به الأقرب لارتكاب الجريمة',
  castVoteForSuspect: 'اختر المشتبه به الذي تعتقد أنه الجاني',
  passDeviceToVoter: 'مرر الجهاز إلى:',
  ensureNoOneLooking: 'تأكد من عدم نظر الآخرين أثناء تسجيل صوتك',
  readyToVote: 'أنا جاهز للتصويت',
  selectedSuspect: 'المشتبه به المختار:',
  voteLockWarning: 'لا يمكن التراجع عن الصوت بعد التأكيد',
  confirmVoteFinal: 'تأكيد التصويت النهائي',
  changeSelection: 'تغيير الاختيار',
  secretVoteIndicator: 'تصويت سري • مرر الهاتف بين اللاعبين',
  publicVoteIndicator: 'تصويت علني • ستُعلن هوية المصوتين عند فرز النتائج',
  secretBallotActiveBadge: '🔒 اقتراع سري (الهويات محجوبة)',
  publicBallotActiveBadge: '📢 اقتراع علني (كشف هوية المصوتين)',
  votedBy: 'صوّت له:',
  noVotesForSuspect: 'لم يتلقَّ أصواتاً',
  revealVoterIdentities: 'كشف هوية المصوتين',
  hideVoterIdentities: 'إخفاء هوية المصوتين',
  proceedToConfirm: 'متابعة وتأكيد الصوت',
  voterTurn: 'دور اللاعب في التصويت:',
  selectSuspectToAccuse: 'توجيه الاتهام إلى:',
  confirmAccusation: 'تأكيد الاتهام',
  areYouSureVote: 'هل أنت واثق من توجيه أصابع الاتهام لهذا المشتبه به؟',
  voteSubmitted: 'تم تسجيل صوتك بنجاح',
  nextVoter: 'المصوت التالي',

  verdictAnnounced: 'نتائج التصويت والقرار النهائي',
  voteResults: 'نتائج التصويت',
  voteTie: 'تعادل الأصوات!',
  voteInconclusive: 'لم يتم حسم الاتهام',
  voteTieDescription: 'تساوت الأصوات بين عدة مشتبه بهم دون أغلبية قاطعة. تستمر جلسة التحقيق للجولة القادمة.',
  voteDistribution: 'توزيع الأصوات بين المشتبه بهم:',
  suspectEliminatedNotice: 'تم توجيه الاتهام بالأغلبية، والمشتبه به الرئيسي هو:',
  tallyResults: 'فرز وتفاصيل أصوات الجولة:',
  sessionEndedReveal: 'انتهت المحاولات المتاحة! كشف هوية الجاني الحقيقي:',
  noConsensusTitle: 'لم يتم التوصل لأغلبية!',
  noConsensusDesc: 'توزعت الأصوات دون حسم أغلبية على متهم واحد. يستمر التحقيق في الجولة التالية.',
  suspectArrested: 'بناءً على أغلبية الأصوات، المتهم الذي تم توجيه الاتهام إليه هو',
  wrongAccusationTitle: 'اتهام خاطئ! تم اتهام شخص بريء',
  wrongAccusationDesc: 'الشخص المتهم بريء تماماً! الجاني الحقيقي ما زال متخفياً بينكم.',
  strikesLeft: 'الفرص المتبقية للاتهامات الخاطئة:',
  continueToNextRound: 'متابعة التحقيق في الجولة القادمة',
  gameOverGuiltyWins: 'نفدت الفرص! تمكن الجاني من الإفلات',
  seeFinalOutcome: 'عرض الحل وملابسات الجريمة',
  guiltyCaughtTitle: 'تم القبض على الجاني بنجاح!',
  guiltyCaughtDesc: 'استطاع المحققون كشف الفاعل الحقيقي وتحقيق العدالة.',

  killerReveal: 'كشف هوية الجاني',
  theTruthRevealed: 'كشف الحقيقة الكاملة',
  thePerpetratorIs: 'الجاني الحقيقي وراء هذه الجريمة هو:',
  killerRole: 'القاتل',
  innocentsWon: 'فاز الأبرياء',
  killerWon: 'فاز القاتل',
  innocentsTriumph: 'انتصار المحققين والأبرياء! 🔍',
  innocentsTriumphDesc: 'انتصرت العدالة! تم ربط خيوط الجريمة بدقة وكشف الفاعل الحقيقي.',
  killerEscaped: 'إفلات ونجاة القاتل! 💀',
  killerEscapedDesc: 'نجح الجاني في نسج الأكاذيب وتضليل التحقيق والإفلات من العقاب.',
  revealFullStory: 'قراءة ملابسات الجريمة والاعتراف الكامل',
  howCrimeCommitted: 'كيف تم التخطيط وارتكاب الجريمة؟',

  crimeExplanation: 'شرح الجريمة',
  revealTruthFullResults: 'عرض الحقيقة الكاملة والنتائج',
  motive: 'الدافع',
  plan: 'الخطة',
  execution: 'تنفيذ الجريمة',
  concealment: 'إخفاء الأدلة',
  investigationReport: 'التقرير الجنائي وتحليل الجريمة',
  howItHappened: 'كيف حدثت الجريمة بالتفصيل؟',
  evidenceBreakdown: 'تحليل القرائن والأدلة الميدانية',
  fullCaseSolution: 'مخطط الجريمة والاعترافات الرسمية',
  completeDebrief: 'اكتمال جلسة التحقيق',
  viewFinalResults: 'عرض تقييم المحققين والنتائج',

  theFullTruth: 'الحقيقة الكاملة',
  investigationSummaryConfessions: 'ملخص التحقيق والاعترافات الرسمية',
  realPlayerIdentities: 'هويات اللاعبين الحقيقية في هذه الجلسة:',
  viewFinalStats: 'عرض النتائج النهائية وإحصائيات اللعبة',

  finalResults: 'النتائج النهائية',
  gameOverHowDidYouDo: 'انتهت اللعبة! كيف كان أداؤكم؟',
  innocentsWonDesc: 'تم كشف هوية الجاني بنجاح وتحقيق العدالة.',
  killerWonDesc: 'تمكن القاتل من تضليل الجميع والإفلات من العقاب!',
  theCulpritWas: 'الجاني كان',
  theCulpritsWere: 'الجناة كانوا',
  correctVotes: 'أصوات صحيحة',
  playNewCase: 'لعب قضية جديدة',
  returnToMainMenu: 'العودة للقائمة الرئيسية',
  caseClosed: 'تم إغلاق ملف القضية',
  investigationDebrief: 'تقرير أداء الجلسة',
  detectiveRating: 'مستوى كفاءة المحققين',
  roundsTaken: 'الجولات المستغرقة',
  wrongAccusations: 'الاتهامات الخاطئة',
  playAgain: 'بدء تحقيق في قضية جديدة',
  returnToArchive: 'العودة لأرشيف القضايا',

  rulesTitle: 'قواعد ودليل اللعبة',
  gameplayGuide: 'دليل وقواعد اللعبة',
  rule1Title: '1. توزيع الأدوار السرية',
  rule1Desc: 'يمرر الهاتف بين اللاعبين ليشاهد كل شخص هويته ومعلوماته السرية وما إذا كان بريئاً أو الجاني.',
  rule2Title: '2. جولات النقاش وكشف الأدلة',
  rule2Desc: 'تتوالى الجولات ويكشف النظام أدلة وقرائن جديدة. ناقشوا الأحداث وحاولوا رصد التناقضات.',
  rule3Title: '3. التمويه وتوجيه الشبهات',
  rule3Desc: 'إذا كنت الجاني، عليك اختلاق مبررات وتوجيه أصابع الاتهام للآخرين دون إثارة الريبة.',
  rule4Title: '4. التصويت الحاسم والعدالة',
  rule4Desc: 'يصوّت الجميع لتحديد المتهم. إذا أصبتم الفاعل تفوزون، وإذا أخطأتم تنفد فرصكم ويفوز الجاني.',

  caseTitleLabel: 'عنوان القضية *',
  crimeDescriptionLabel: 'وصف وملابسات الجريمة *',
  solutionAndConfessionLabel: 'الحل والاعتراف الكامل (يُعرض في النهاية)',
  caseCharacters: 'شخصيات القضية',
  selectCulpritHint: 'حدد القاتل بالنقر على زر المذنب',
  saveCustomCaseAndPlay: 'حفظ القضية والبدء باللعب',
};

export const EN_STRINGS: UIStrings = {
  appName: 'Secret Killer',
  gameTagline: 'Unmask the truth before time runs out',
  premiumEdition: 'Premium Edition',
  settings: 'Settings',
  saveAndClose: 'Save & Close',
  back: 'Back',
  home: 'Home',
  cancel: 'Cancel',
  confirm: 'Confirm',
  next: 'Next',
  close: 'Close',
  start: 'Start',
  delete: 'Delete',
  edit: 'Edit',

  startGame: 'Start Game',
  storyArchive: 'Case Files',
  howToPlay: 'How to Play',
  gameRules: 'Investigation Rules',
  achievements: 'Achievements',
  onlinePartyMode: 'Online Multiplayer',
  comingSoon: 'Coming Soon',
  rateGame: 'Rate Game',
  totalStoriesCount: 'Cases Available',
  customCasesCount: 'Custom Cases',

  gameSettings: 'Game Settings',
  languageSelect: 'Game Language / اللغة',
  arabicLang: 'العربية (Arabic)',
  englishLang: 'English (الإنجليزية)',
  soundEffects: 'Sound Effects',
  soundEffectsDesc: 'Investigation audio cues, dramatic reveal & vote sounds',
  ambientMusic: 'Noir Ambient Soundtrack',
  ambientMusicDesc: 'Immersive suspense atmosphere during discussions',
  discussionTimer: 'Discussion Round Timer',
  minutes: 'minutes',
  minShort: 'm',
  secretBallot: 'Secret Ballot Mode',
  secretBallotDesc: 'Hide voter identities when tallying accusations',
  fastVoting: 'Fast Voting Mode',
  fastVotingDesc: 'Skip confirmation modal to cast your accusation with a single tap and speed up the round',
  fastVotingActiveBadge: '⚡ Fast Vote (Single Tap)',
  fastVoteOneTapHint: 'Tap a suspect to cast your vote instantly without confirmation',
  adsAndMonetization: 'Google AdMob Monetization',
  adsAndMonetizationDesc: 'Enable Banner ads and Interstitial transitions between rounds',
  adMobStatus: 'AdMob Status: Configured & Active',
  testAdPreview: 'Preview Test Ad',
  interstitialAdBadge: 'Interstitial Ad',
  bannerAdBadge: 'Banner Ad',

  caseArchive: 'Criminal Case Archive',
  selectStoryTitle: 'Criminal Cases Archive',
  selectStorySubtitle: 'Select an investigation file to begin casting secret roles',
  selectCaseDesc: 'Select an investigation file to begin casting secret roles and examining forensic clues',
  filterStories: 'Filter Cases',
  filter: 'Filter',
  allStories: 'All',
  allCases: 'All',
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  easyDifficulty: 'Easy',
  mediumDifficulty: 'Medium',
  hardDifficulty: 'Hard',
  customStories: 'Custom',
  customCases: 'Custom',
  createCustomCase: 'Create New Case',
  randomPick: 'Random Pick',
  randomStory: 'Random Case',
  randomStorySubtitle: 'Let the system pick an exciting case for you',
  players: 'Players',
  playersRange: 'players',
  difficulty: 'Difficulty',
  newBadge: 'New',
  badgeNew: 'New',
  badgeCustom: 'Custom',
  badgeFixed: 'Story Mode',
  noStoriesMatch: 'No cases found matching this filter',
  noCasesMatch: 'No cases found matching this filter',

  caseFile: 'Case File',
  primaryObjective: 'Primary Mission & Objective:',
  setupPlayers: 'Proceed to Suspect Setup',
  caseDossier: 'Case Briefing Dossier',
  caseSetting: 'Crime Scene Setting',
  currentSituation: 'Current Situation',
  theIncident: 'The Incident',
  investigationStakes: 'Stakes & Risks',
  detectiveObjective: 'Detective Objective',
  investigatorsRequired: 'Investigators Needed',
  difficultyLabel: 'Difficulty Level',
  proceedToSetup: 'Proceed to Suspect Setup',

  playerSetupTitle: 'Suspect & Investigator Setup',
  playerRoster: 'Suspect & Investigator Roster',
  playerRosterDesc: 'Enter the names of all players participating in this pass-and-play session',
  playerCountLabel: 'Player Count',
  enterPlayerName: 'Enter player name...',
  addPlayer: 'Add Player',
  quickFill: 'Quick Fill Names',
  startInvestigation: 'Deal Secret Roles & Begin',
  startSecretRoleAssignment: 'Deal Secret Roles & Begin',
  minPlayersWarning: 'The minimum number of players for this case is',
  maxPlayersWarning: 'The maximum number of players for this case is',
  playerNumLabel: 'Player',

  characterCard: 'Character Dossier Card',
  storyRolesDistribution: 'Secret Role Assignment 🔒',
  passDeviceTo: 'Pass the device to:',
  ensureNoOneLookingCard: '⚠️ Ensure no one else is looking at the screen. Tap below to view your secret identity.',
  revealRole: 'Reveal My Character',
  knownIdentityToAll: 'Your public persona known to everyone:',
  testimonyAndKnowledge: 'Your secret testimony & clues regarding the crime:',
  secretRoleWarning: '⚠️ Your Confidential Role (Strictly Private):',
  youAreTheCulprit: 'You are the guilty culprit. Do NOT disclose this to any other player.',
  youAreTheOnlyKiller: 'You are the only killer in this game.',
  yourKillerPartner: 'YOUR KILLER PARTNER:',
  yourKillerPartners: 'YOUR KILLER PARTNERS:',
  killerAllianceGuidance: 'Coordinate your strategy carefully during discussion to protect each other and avoid suspicion.',
  keepDetailsGuidance: '💡 Keep these details in mind and use them strategically during open discussion and interrogation.',
  finishPassingStartDiscussion: 'Finish Passing & Begin Discussion',
  iMemorizedPassDevice: 'Memorized! Hide & Pass Phone',
  handDeviceTo: 'Pass the device to',
  passToPlayerWarning: 'Ensure no other player can see the screen while revealing your secret role dossier',
  revealRoleSecretly: 'Inspect Classified File',
  tapToReveal: 'Tap to view your classified role',
  keepScreenHidden: 'Keep your secret identity safe and do not show your screen!',
  iAmReady: 'I Am Ready, Reveal My Role',

  confidentialDossier: 'Classified Character Dossier',
  assignedCharacter: 'Assigned Identity',
  profession: 'Profession / Title',
  publicPersona: 'Public Statement to Everyone',
  classifiedKnowledge: 'Your Private Secret Clues',
  youAreGuilty: 'YOU ARE THE GUILTY PERPETRATOR',
  youAreGuiltyTitle: 'Mission: Deceive, deflect, and survive the vote!',
  youAreGuiltyDesc: 'Bluff your alibi, frame innocent suspects, and exploit shared evidence to avoid unanimous suspicion.',
  youAreInnocent: 'YOU ARE AN INNOCENT DETECTIVE',
  youAreInnocentTitle: 'Mission: Interrogate suspects and expose the real culprit!',
  youAreInnocentDesc: 'Share your private clues strategically, look for contradictions, and uncover who is lying.',
  hideAndPassPhone: 'Memorized! Pass phone to next player',
  startInvestigationRound: 'All Roles Dealt - Begin Investigation Round 1',

  discussionInvestigation: 'Interrogation & Open Discussion',
  evidenceTab: 'Evidence',
  suspectsTab: 'Suspects',
  caseBriefingTab: 'Briefing',
  discussionPromptsTab: 'Key Questions',
  proceedToVoting: 'Proceed to Voting Chamber',
  investigationPhase: 'Interrogation & Open Discussion',
  roundNumber: 'Round',
  publicClueRevealed: 'New Forensic Clue Discovered',
  discussionPrompt: 'Key Investigation Question',
  timeRemaining: 'Discussion Time Left',
  timerPaused: 'Timer Paused',
  resumeTimer: 'Resume Timer',
  pauseTimer: 'Pause',
  addMinute: '+1 Min',
  revealNextClue: 'Examine Next Clue',
  cluesDossier: 'Case Evidence Log',
  suspectRoster: 'Suspects Present',
  proceedToVote: 'Conclude Discussion & Cast Votes',
  allCluesDiscovered: 'All available crime scene evidence has been revealed',
  newEvidenceBadge: 'New Evidence',
  newEvidenceDiscovered: 'New Evidence Discovered',
  previouslyRevealedBadge: 'Previously Revealed',
  cluesDiscoveredSummary: 'Clues Discovered',
  remainingCluesLabel: 'Remaining',
  clueLimitReachedThisRound: 'Clue revealed for this round (1 clue max per round)',
  nextClueNextRoundHint: 'Next clue available in the next round',
  requestNewClueAction: 'Request New Clue',
  allEvidenceRevealedBanner: 'All available evidence has been discovered',
  noEvidenceRevealedYet: 'No evidence has been revealed yet',
  noEvidenceRevealedYetDesc: 'Investigate the crime scene to uncover clues and testimonies for this round.',

  votingChamber: 'Accusation & Voting Chamber',
  votingAccusation: 'Accusation Chamber',
  votingPrompt: 'Review the clues and testimony to cast your vote for the primary suspect',
  castVoteForSuspect: 'Select the suspect you believe is guilty',
  passDeviceToVoter: 'Pass the device to:',
  ensureNoOneLooking: 'Make sure no one is looking while you cast your vote',
  readyToVote: 'I Am Ready to Vote',
  selectedSuspect: 'Selected Suspect:',
  voteLockWarning: 'Votes cannot be changed once confirmed',
  confirmVoteFinal: 'Confirm Final Accusation',
  changeSelection: 'Change Selection',
  secretVoteIndicator: 'Secret Ballot • Pass device between players',
  publicVoteIndicator: 'Public Ballot • Voter identities will be announced in tally',
  secretBallotActiveBadge: '🔒 Secret Ballot (Identities hidden)',
  publicBallotActiveBadge: '📢 Public Ballot (Identities revealed)',
  votedBy: 'Voted by:',
  noVotesForSuspect: 'No votes received',
  revealVoterIdentities: 'Reveal Voter Identities',
  hideVoterIdentities: 'Hide Voter Identities',
  proceedToConfirm: 'Proceed to Confirm Vote',
  voterTurn: 'Current Voter:',
  selectSuspectToAccuse: 'Accuse Suspect:',
  confirmAccusation: 'Confirm Accusation',
  areYouSureVote: 'Are you certain you want to cast your accusation against this suspect?',
  voteSubmitted: 'Accusation ballot recorded',
  nextVoter: 'Next Voter',

  verdictAnnounced: 'Deliberation & Vote Tally',
  voteResults: 'Vote Results',
  voteTie: 'Tie Vote!',
  voteInconclusive: 'Inconclusive Accusation',
  voteTieDescription: 'Votes were evenly split with no clear majority. Investigation continues to the next round.',
  voteDistribution: 'Vote distribution among suspects:',
  suspectEliminatedNotice: 'By majority vote, the prime suspect accused is:',
  tallyResults: 'Round vote tally and breakdown:',
  sessionEndedReveal: 'Out of strikes! Revealing the true culprit identity:',
  noConsensusTitle: 'No Majority Reached!',
  noConsensusDesc: 'The votes were split and no single suspect received the required majority. Investigation proceeds to the next round.',
  suspectArrested: 'By majority vote, the prime suspect accused is',
  wrongAccusationTitle: 'Wrong Accusation! An innocent was framed',
  wrongAccusationDesc: 'The accused person is completely innocent! The true perpetrator remains hidden among you.',
  strikesLeft: 'Remaining Wrong Accusation Strikes:',
  continueToNextRound: 'Continue Investigation in Next Round',
  gameOverGuiltyWins: 'Out of Strikes! The Perpetrator Escapes',
  seeFinalOutcome: 'View Case Debrief & Outcome',
  guiltyCaughtTitle: 'Culprit Apprehended!',
  guiltyCaughtDesc: 'The detectives deduced correctly and brought the true criminal to justice.',

  killerReveal: 'Culprit Revealed',
  theTruthRevealed: 'The Truth Unveiled',
  thePerpetratorIs: 'The true perpetrator behind this case is:',
  killerRole: 'The Culprit',
  innocentsWon: 'Innocents Won',
  killerWon: 'Culprit Won',
  innocentsTriumph: 'Detectives Triumph! 🔍',
  innocentsTriumphDesc: 'Justice prevails! The evidence pieced together flawlessly.',
  killerEscaped: 'The Perpetrator Escaped! 💀',
  killerEscapedDesc: 'The criminal successfully outmaneuvered the investigation and left no trace behind.',
  revealFullStory: 'Read Full Forensic Case Report',
  howCrimeCommitted: 'How Was the Crime Committed?',

  crimeExplanation: 'Crime Explanation',
  revealTruthFullResults: 'Reveal Full Truth & Results',
  motive: 'Motive',
  plan: 'The Plan',
  execution: 'Execution',
  concealment: 'Concealing Evidence',
  investigationReport: 'Forensic Case Summary & Breakdown',
  howItHappened: 'How Did the Crime Happen?',
  evidenceBreakdown: 'Forensic Evidence Analysis',
  fullCaseSolution: 'Mastermind Scheme & Motive',
  completeDebrief: 'Debrief Finished',
  viewFinalResults: 'View Detective Performance Rating',

  theFullTruth: 'The Full Truth',
  investigationSummaryConfessions: 'Investigation Summary & Official Confessions',
  realPlayerIdentities: 'Actual player identities in this session:',
  viewFinalStats: 'View Final Results & Game Stats',

  finalResults: 'Final Results',
  gameOverHowDidYouDo: 'Game Over! How did your team perform?',
  innocentsWonDesc: 'The perpetrator was successfully unmasked and justice was served.',
  killerWonDesc: 'The culprit successfully deceived everyone and escaped justice!',
  theCulpritWas: 'The culprit was',
  theCulpritsWere: 'The culprits were',
  correctVotes: 'Correct Votes',
  playNewCase: 'Play a New Case',
  returnToMainMenu: 'Return to Main Menu',
  caseClosed: 'Case File Closed',
  investigationDebrief: 'Session Performance Summary',
  detectiveRating: 'Deduction Competence Rating',
  roundsTaken: 'Rounds Elapsed',
  wrongAccusations: 'Wrong Accusations Made',
  playAgain: 'Investigate Another Case',
  returnToArchive: 'Back to Case Archive',

  rulesTitle: 'How to Play & Game Rules',
  gameplayGuide: 'How to Play & Game Rules',
  rule1Title: '1. Secret Role Assignment',
  rule1Desc: 'Pass the device around. Each player secretly checks their character dossier to learn whether they are innocent or the guilty culprit.',
  rule2Title: '2. Evidence Rounds & Open Discussion',
  rule2Desc: 'Across multiple rounds, new forensic clues are uncovered. Interrogate suspects, share intel, and look for discrepancies.',
  rule3Title: '3. Deception & Deflection',
  rule3Desc: 'If you are the guilty culprit, fabricate alibis, exploit ambiguous clues, and shift suspicion onto innocent players.',
  rule4Title: '4. Voting & Final Verdict',
  rule4Desc: 'Vote together to accuse the culprit. Detectives win if they catch the killer before running out of accusation strikes.',

  caseTitleLabel: 'Case Title *',
  crimeDescriptionLabel: 'Crime Description & Background *',
  solutionAndConfessionLabel: 'Full Solution & Confession (Revealed at the end)',
  caseCharacters: 'Case Characters',
  selectCulpritHint: 'Mark the culprit by toggling the guilty button',
  saveCustomCaseAndPlay: 'Save Case & Start Playing',
};
