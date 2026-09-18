/**
 * Grades Taxonomy Engine & Curriculum Configuration
 * Qadoumi Cultural Center Platform (مركز القدومي الثقافي)
 *
 * Single Source of Truth for the 13 canonical school grades partitioned into 3 stages:
 * 1. الصفوف الأساسية (Primary / Elementary: 1 - 4)
 * 2. الصفوف العليا (Middle / Upper Basic: 5 - 10)
 * 3. المرحلة الثانوية (Secondary / Tawjihi & BTEC: 11 - 12)
 */

export type StageId = 'primary' | 'middle' | 'secondary';

export interface GradeSubject {
  id: string;
  name: string;
  code: string;
  icon: string;
  description: string;
  branch?: string;
}

export interface StageConfig {
  id: StageId;
  name: string;
  subtitle: string;
  description: string;
  badge: string;
  badgeBg: string;
  gradient: string;
  bgLight: string;
  accentColor: string;
  borderAccent: string;
}

export interface GradeConfig {
  id: number;
  slug: string;
  name: string;
  shortName: string;
  stage: StageId;
  stageName: string;
  numeral: string; // Eastern Arabic numeral e.g. ١, ٢, ١٢ or BTEC
  order: number;
  aliases: string[];
  teacherKeywords: string[];
  materialKeywords: string[];
  description: string;
  gradient: string;
  cardBg: string;
  borderAccent: string;
  glowColor: string;
  textAccent: string;
  badgeText: string;
  subjects: GradeSubject[];
}

export const STAGES: Record<StageId, StageConfig> = {
  primary: {
    id: 'primary',
    name: 'الصفوف الأساسية',
    subtitle: 'المرحلة التأسيسية (من الصف الأول حتى الرابع)',
    description: 'بناء الأسس المتينة في القراءة والكتابة والرياضيات والعلوم وغرس الشغف المعرفي لدى الطلبة منذ الصغر.',
    badge: 'تأسيس وبناء',
    badgeBg: 'bg-emerald-500/10 text-emerald-700 border-emerald-300 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
    bgLight: 'bg-emerald-50/50',
    accentColor: '#059669',
    borderAccent: 'border-emerald-200 hover:border-emerald-400',
  },
  middle: {
    id: 'middle',
    name: 'الصفوف العليا',
    subtitle: 'المرحلة المتوسطة (من الصف الخامس حتى العاشر)',
    description: 'تمكين التفكير التحليلي، وتطوير المهارات العلمية والاستكشافية، والاستعداد للانتقال للثانوية والتوجيهي.',
    badge: 'تمكين ومتابعة',
    badgeBg: 'bg-indigo-500/10 text-indigo-700 border-indigo-300 dark:bg-indigo-950/30 dark:text-indigo-300 dark:border-indigo-800',
    gradient: 'from-indigo-600 via-purple-600 to-violet-600',
    bgLight: 'bg-indigo-50/50',
    accentColor: '#4f46e5',
    borderAccent: 'border-indigo-200 hover:border-indigo-400',
  },
  secondary: {
    id: 'secondary',
    name: 'المرحلة الثانوية',
    subtitle: 'مرحلة الحسم والتفوق (الأول ثانوي والتوجيهي)',
    description: 'إعداد استراتيجي مكثف للثانوية العامة والتوجيهي الأكاديمي والمهني BTEC مع نخبة أساتذة المملكة.',
    badge: 'توجيهي وتفوق',
    badgeBg: 'bg-amber-500/10 text-amber-800 border-amber-300 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-700',
    gradient: 'from-navy-900 via-amber-600 to-gold-500',
    bgLight: 'bg-amber-50/40',
    accentColor: '#d97706',
    borderAccent: 'border-amber-300 hover:border-amber-500',
  },
};

export const GRADES_CONFIG: GradeConfig[] = [
  // ----------------------------------------------------
  // 1. الصفوف الأساسية (Primary / 1 - 4)
  // ----------------------------------------------------
  {
    id: 1,
    slug: 'first-grade',
    name: 'الصف الأول الأساسي',
    shortName: 'الأول الأساسي',
    stage: 'primary',
    stageName: 'الصفوف الأساسية',
    numeral: '١',
    order: 1,
    aliases: ['1', 'first', 'first-grade', 'grade-1', 'الاول', 'الأول', 'الصف الأول', 'أول', 'اول اساسي', 'أول أساسي'],
    teacherKeywords: ['أول أساسي', 'الأول الأساسي', 'أول', 'الاول'],
    materialKeywords: ['الصف الأول', 'أول أساسي', 'الأول الأساسي', 'أول', 'الاول'],
    description: 'مرحلة التأسيس الأولى لغرس المهارات القرائية والحسابية وتطوير النطق السليم والثقة بالنفس.',
    gradient: 'from-emerald-500 to-teal-600',
    cardBg: 'bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/50 dark:from-emerald-950/20 dark:via-gray-900 dark:to-teal-950/20',
    borderAccent: 'border-emerald-200/80 hover:border-emerald-400 group-hover:shadow-emerald-500/15',
    glowColor: 'rgba(16, 185, 129, 0.25)',
    textAccent: 'text-emerald-600 dark:text-emerald-400',
    badgeText: 'تأسيس الحروف والأرقام',
    subjects: [
      { id: 'ar-1', name: 'اللغة العربية', code: 'AR', icon: 'BookOpen', description: 'تأسيس الحروف الهجائية، القراءة التأسيسية، والإملاء البسيط' },
      { id: 'math-1', name: 'الرياضيات', code: 'MATH', icon: 'Calculator', description: 'الأعداد ضمن منزلتين، الجمع والطرح البسيط، والأشكال الهندسية' },
      { id: 'sci-1', name: 'العلوم العامة', code: 'SCI', icon: 'FlaskConical', description: 'استكشاف الكائنات الحية والبيئة المحيطة والحواس الخمس' },
      { id: 'en-1', name: 'اللغة الإنجليزية', code: 'EN', icon: 'Languages', description: 'English Action Pack 1: أصوات الحروف والمفردات البصرية التأسيسية' },
      { id: 'is-1', name: 'التربية الإسلامية', code: 'IS', icon: 'Moon', description: 'قصار السور الكريمة، الآداب الإسلامية، وأركان الإسلام' },
    ],
  },
  {
    id: 2,
    slug: 'second-grade',
    name: 'الصف الثاني الأساسي',
    shortName: 'الثاني الأساسي',
    stage: 'primary',
    stageName: 'الصفوف الأساسية',
    numeral: '٢',
    order: 2,
    aliases: ['2', 'second', 'second-grade', 'grade-2', 'الثاني', 'الصف الثاني', 'ثاني', 'ثاني اساسي', 'الثاني أساسي'],
    teacherKeywords: ['ثاني أساسي', 'الثاني الأساسي', 'ثاني', 'الثاني'],
    materialKeywords: ['الصف الثاني', 'ثاني أساسي', 'الثاني الأساسي', 'ثاني', 'الثاني'],
    description: 'تعزيز الطلاقة القرائية والعمليات الحسابية الذهنية وبناء حصيلة لغوية ومعرفية متقدمة.',
    gradient: 'from-teal-500 to-emerald-600',
    cardBg: 'bg-gradient-to-br from-teal-50/80 via-white to-emerald-50/50 dark:from-teal-950/20 dark:via-gray-900 dark:to-emerald-950/20',
    borderAccent: 'border-teal-200/80 hover:border-teal-400 group-hover:shadow-teal-500/15',
    glowColor: 'rgba(20, 184, 166, 0.25)',
    textAccent: 'text-teal-600 dark:text-teal-400',
    badgeText: 'تطوير الطلاقة المعرفية',
    subjects: [
      { id: 'ar-2', name: 'اللغة العربية', code: 'AR', icon: 'BookOpen', description: 'تراكيب الجمل، القراءة المسترسلة، والتدريبات الإملائية والقواعد' },
      { id: 'math-2', name: 'الرياضيات', code: 'MATH', icon: 'Calculator', description: 'الأعداد ضمن ثلاث منازل، الجمع والطرح بإعادة التجميع، ومقدمة الضرب' },
      { id: 'sci-2', name: 'العلوم العامة', code: 'SCI', icon: 'FlaskConical', description: 'دورات حياة الكائنات الحية، حالات المادة، والموارد الطبيعية' },
      { id: 'en-2', name: 'اللغة الإنجليزية', code: 'EN', icon: 'Languages', description: 'Action Pack 2: المحادثات اليومية والقراءة الجهرية والكتابة' },
      { id: 'is-2', name: 'التربية الإسلامية', code: 'IS', icon: 'Moon', description: 'القرآن الكريم والتجويد البسيط، سيرة الرسول ﷺ، والأخلاق الفاضلة' },
    ],
  },
  {
    id: 3,
    slug: 'third-grade',
    name: 'الصف الثالث الأساسي',
    shortName: 'الثالث الأساسي',
    stage: 'primary',
    stageName: 'الصفوف الأساسية',
    numeral: '٣',
    order: 3,
    aliases: ['3', 'third', 'third-grade', 'grade-3', 'الثالث', 'الصف الثالث', 'ثالث', 'ثالث اساسي', 'الثالث أساسي'],
    teacherKeywords: ['ثالث أساسي', 'الثالث الأساسي', 'ثالث', 'الثالث'],
    materialKeywords: ['الصف الثالث', 'ثالث أساسي', 'الثالث الأساسي', 'ثالث', 'الثالث'],
    description: 'ترسيخ مفاهيم الضرب والقسمة، وتنمية الاستيعاب القرائي والتعبير الإبداعي المستقل.',
    gradient: 'from-emerald-600 to-cyan-600',
    cardBg: 'bg-gradient-to-br from-emerald-50/70 via-white to-cyan-50/50 dark:from-emerald-950/20 dark:via-gray-900 dark:to-cyan-950/20',
    borderAccent: 'border-emerald-200/80 hover:border-emerald-400 group-hover:shadow-emerald-500/15',
    glowColor: 'rgba(5, 150, 105, 0.25)',
    textAccent: 'text-emerald-700 dark:text-emerald-400',
    badgeText: 'ترسيخ الحساب واللغة',
    subjects: [
      { id: 'ar-3', name: 'اللغة العربية', code: 'AR', icon: 'BookOpen', description: 'الفهم والاستيعاب، الأساليب اللغوية، كتابة الفقرات الإنشائية' },
      { id: 'math-3', name: 'الرياضيات', code: 'MATH', icon: 'Calculator', description: 'جداول الضرب الشاملة، القسمة، الكسور العادية، وقياس الوقت والكتلة' },
      { id: 'sci-3', name: 'العلوم العامة', code: 'SCI', icon: 'FlaskConical', description: 'القوى والحركة، الصوت والضوء، التكيف في الكائنات الحية' },
      { id: 'en-3', name: 'اللغة الإنجليزية', code: 'EN', icon: 'Languages', description: 'Action Pack 3: القواعد النحوية الأساسية وتطوير الاستماع والكتابة' },
      { id: 'is-3', name: 'التربية الإسلامية', code: 'IS', icon: 'Moon', description: 'أحكام الصلاة والطهارة، حفظ وتدبر الآيات الكريمة، والأمانة' },
    ],
  },
  {
    id: 4,
    slug: 'fourth-grade',
    name: 'الصف الرابع الأساسي',
    shortName: 'الرابع الأساسي',
    stage: 'primary',
    stageName: 'الصفوف الأساسية',
    numeral: '٤',
    order: 4,
    aliases: ['4', 'fourth', 'fourth-grade', 'grade-4', 'الرابع', 'الصف الرابع', 'رابع', 'رابع اساسي', 'الرابع أساسي'],
    teacherKeywords: ['رابع أساسي', 'الرابع الأساسي', 'رابع', 'الرابع'],
    materialKeywords: ['الصف الرابع', 'رابع أساسي', 'الرابع الأساسي', 'رابع', 'الرابع'],
    description: 'جسر الانتقال نحو التفكير المجرد، دراسة الجغرافيا والاجتماعيات والعلوم التجريبية الموسعة.',
    gradient: 'from-teal-600 to-cyan-700',
    cardBg: 'bg-gradient-to-br from-teal-50/70 via-white to-cyan-50/50 dark:from-teal-950/20 dark:via-gray-900 dark:to-cyan-950/20',
    borderAccent: 'border-teal-300/80 hover:border-teal-500 group-hover:shadow-teal-500/15',
    glowColor: 'rgba(13, 148, 136, 0.25)',
    textAccent: 'text-teal-700 dark:text-teal-300',
    badgeText: 'مدخل التفكير المجرد',
    subjects: [
      { id: 'ar-4', name: 'اللغة العربية', code: 'AR', icon: 'BookOpen', description: 'أقسام الكلام، الجملة الاسمية والفعلية، مهارات التعبير والإملاء المتقدم' },
      { id: 'math-4', name: 'الرياضيات', code: 'MATH', icon: 'Calculator', description: 'العمليات الحسابية للأعداد الكبيرة، الكسور العشرية، المحيط والمساحة' },
      { id: 'sci-4', name: 'العلوم العامة', code: 'SCI', icon: 'FlaskConical', description: 'أجهزة جسم الإنسان، النظم البيئية، الدارات الكهربائية البسيطة' },
      { id: 'en-4', name: 'اللغة الإنجليزية', code: 'EN', icon: 'Languages', description: 'Action Pack 4: الحوارات، الأزمنة البسيطة، واستيعاب المقروء' },
      { id: 'soc-4', name: 'الدراسات الاجتماعية', code: 'SOC', icon: 'Compass', description: 'جغرافية وتاريخ الأردن، الهوية الوطنية، ومعالم الوطن' },
      { id: 'is-4', name: 'التربية الإسلامية', code: 'IS', icon: 'Moon', description: 'أحكام التلاوة والتجويد، السيرة النبوية، وحقوق الوالدين والجار' },
    ],
  },

  // ----------------------------------------------------
  // 2. الصفوف العليا (Middle / 5 - 10)
  // ----------------------------------------------------
  {
    id: 5,
    slug: 'fifth-grade',
    name: 'الصف الخامس الأساسي',
    shortName: 'الخامس الأساسي',
    stage: 'middle',
    stageName: 'الصفوف العليا',
    numeral: '٥',
    order: 5,
    aliases: ['5', 'fifth', 'fifth-grade', 'grade-5', 'الخامس', 'الصف الخامس', 'خامس', 'خامس اساسي'],
    teacherKeywords: ['خامس أساسي', 'الخامس الأساسي', 'خامس', 'الخامس'],
    materialKeywords: ['الصف الخامس', 'خامس أساسي', 'الخامس الأساسي', 'خامس', 'الخامس'],
    description: 'انطلاقة المرحلة العليا وتطوير المهارات النقدية، الإعراب النحوي، ومفاهيم الهندسة والكسور.',
    gradient: 'from-indigo-500 to-purple-600',
    cardBg: 'bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/50 dark:from-indigo-950/20 dark:via-gray-900 dark:to-purple-950/20',
    borderAccent: 'border-indigo-200/80 hover:border-indigo-400 group-hover:shadow-indigo-500/15',
    glowColor: 'rgba(99, 102, 241, 0.25)',
    textAccent: 'text-indigo-600 dark:text-indigo-400',
    badgeText: 'توسيع المدارك العلمية',
    subjects: [
      { id: 'ar-5', name: 'اللغة العربية', code: 'AR', icon: 'BookOpen', description: 'الإعراب، المفعول به والفاعل، القراءة التحليلية والنصوص الشعرية' },
      { id: 'math-5', name: 'الرياضيات', code: 'MATH', icon: 'Calculator', description: 'ضرب وقسمة الكسور والكسور العشرية، النسب المئوية، والهندسة' },
      { id: 'sci-5', name: 'العلوم العامة', code: 'SCI', icon: 'FlaskConical', description: 'تصنيف النباتات والحيوانات، سرعة الصوت والضوء، الغلاف الجوي' },
      { id: 'en-5', name: 'اللغة الإنجليزية', code: 'EN', icon: 'Languages', description: 'Action Pack 5: كتابة الفقرات الإنشائية، الماضي والمستقبل، والمحادثة' },
      { id: 'soc-5', name: 'التاريخ والجغرافيا', code: 'SOC', icon: 'Compass', description: 'تاريخ الحضارات القديمة، جغرافية الوطن العربي، والموارد المائية' },
      { id: 'tech-5', name: 'المهارات الرقمية', code: 'TECH', icon: 'Laptop', description: 'أساسيات استخدام الحاسوب والبرمجيات المكتبية والأمان الإلكتروني' },
    ],
  },
  {
    id: 6,
    slug: 'sixth-grade',
    name: 'الصف السادس الأساسي',
    shortName: 'السادس الأساسي',
    stage: 'middle',
    stageName: 'الصفوف العليا',
    numeral: '٦',
    order: 6,
    aliases: ['6', 'sixth', 'sixth-grade', 'grade-6', 'السادس', 'الصف السادس', 'سادس', 'سادس اساسي'],
    teacherKeywords: ['سادس أساسي', 'السادس الأساسي', 'سادس', 'السادس'],
    materialKeywords: ['الصف السادس', 'سادس أساسي', 'السادس الأساسي', 'سادس', 'السادس'],
    description: 'تعميق التحليل المنهجي وحل المسائل المركبة والمعادلات الرياضية والتجارب المخبرية.',
    gradient: 'from-purple-500 to-indigo-600',
    cardBg: 'bg-gradient-to-br from-purple-50/70 via-white to-indigo-50/50 dark:from-purple-950/20 dark:via-gray-900 dark:to-indigo-950/20',
    borderAccent: 'border-purple-200/80 hover:border-purple-400 group-hover:shadow-purple-500/15',
    glowColor: 'rgba(168, 85, 247, 0.25)',
    textAccent: 'text-purple-600 dark:text-purple-400',
    badgeText: 'تعميق التحليل المنهجي',
    subjects: [
      { id: 'ar-6', name: 'اللغة العربية', code: 'AR', icon: 'BookOpen', description: 'إن وأخواتها وكان وأخواتها، المشتقات، والتحليل البلاغي للنصوص' },
      { id: 'math-6', name: 'الرياضيات', code: 'MATH', icon: 'Calculator', description: 'الأعداد الصحيحة، المعادلات الخطية البسيطة، الإحصاء والاحتمالات' },
      { id: 'sci-6', name: 'العلوم العامة', code: 'SCI', icon: 'FlaskConical', description: 'الجدول الدوري، العناصر والمركبات، الطاقة والحرارة، والنظام الشمسي' },
      { id: 'en-6', name: 'اللغة الإنجليزية', code: 'EN', icon: 'Languages', description: 'Action Pack 6: قواعد المقارنة والتفضيل، التعبير الكتابي، والاستماع' },
      { id: 'is-6', name: 'التربية الإسلامية', code: 'IS', icon: 'Moon', description: 'فقه المعاملات، السيرة النبوية في العهد المدني، وتلاوة القرآن' },
      { id: 'soc-6', name: 'التاريخ والجغرافيا', code: 'SOC', icon: 'Compass', description: 'حضارات بلاد الشام والرافدين، التضاريس والمناخ العالمي' },
    ],
  },
  {
    id: 7,
    slug: 'seventh-grade',
    name: 'الصف السابع الأساسي',
    shortName: 'السابع الأساسي',
    stage: 'middle',
    stageName: 'الصفوف العليا',
    numeral: '٧',
    order: 7,
    aliases: ['7', 'seventh', 'seventh-grade', 'grade-7', 'السابع', 'الصف السابع', 'سابع', 'سابع اساسي'],
    teacherKeywords: ['سابع أساسي', 'السابع الأساسي', 'سابع', 'السابع'],
    materialKeywords: ['الصف السابع', 'سابع أساسي', 'السابع الأساسي', 'سابع', 'السابع'],
    description: 'بناء التفكير الاستدلالي الرياضي والمفاهيم الكيميائية والفيزيائية الأولية.',
    gradient: 'from-indigo-600 to-violet-700',
    cardBg: 'bg-gradient-to-br from-indigo-50/70 via-white to-violet-50/50 dark:from-indigo-950/20 dark:via-gray-900 dark:to-violet-950/20',
    borderAccent: 'border-indigo-300/80 hover:border-indigo-500 group-hover:shadow-indigo-500/15',
    glowColor: 'rgba(79, 70, 229, 0.25)',
    textAccent: 'text-indigo-700 dark:text-indigo-400',
    badgeText: 'بناء التفكير الاستدلالي',
    subjects: [
      { id: 'ar-7', name: 'اللغة العربية', code: 'AR', icon: 'BookOpen', description: 'الأفعال الخمسة، الأسماء الخمسة، النعت والتوكيد، وفنون المقالة' },
      { id: 'math-7', name: 'الرياضيات', code: 'MATH', icon: 'Calculator', description: 'النسبة والتناسب، المقادير الجبرية، الزوايا والمضلعات، والمجسمات' },
      { id: 'sci-7', name: 'العلوم العامة', code: 'SCI', icon: 'FlaskConical', description: 'المحاليل والروابط الكيميائية، الحركة والقوى، والطبقات الجيولوجية' },
      { id: 'en-7', name: 'اللغة الإنجليزية', code: 'EN', icon: 'Languages', description: 'Action Pack 7: الأزمنة التامة، قراءة المقالات المعرفية، والتعبير' },
      { id: 'soc-7', name: 'الاجتماعيات والوطنية', code: 'SOC', icon: 'Compass', description: 'تاريخ الدولة الأموية والعباسية، التغير المناخي، والمواطنة الفاعلة' },
      { id: 'is-7', name: 'التربية الإسلامية', code: 'IS', icon: 'Moon', description: 'علوم القرآن الكريم، أحكام الصيام والزكاة، والعدل في الإسلام' },
    ],
  },
  {
    id: 8,
    slug: 'eighth-grade',
    name: 'الصف الثامن الأساسي',
    shortName: 'الثامن الأساسي',
    stage: 'middle',
    stageName: 'الصفوف العليا',
    numeral: '٨',
    order: 8,
    aliases: ['8', 'eighth', 'eighth-grade', 'grade-8', 'الثامن', 'الصف الثامن', 'ثامن', 'ثامن اساسي'],
    teacherKeywords: ['ثامن أساسي', 'الثامن الأساسي', 'ثامن', 'الثامن'],
    materialKeywords: ['الصف الثامن', 'ثامن أساسي', 'الثامن الأساسي', 'ثامن', 'الثامن'],
    description: 'توسيع المدارك الأكاديمية والتمهيد للعلوم التخصصية: الفيزياء، الكيمياء، والأحياء.',
    gradient: 'from-violet-600 to-purple-700',
    cardBg: 'bg-gradient-to-br from-violet-50/70 via-white to-purple-50/50 dark:from-violet-950/20 dark:via-gray-900 dark:to-purple-950/20',
    borderAccent: 'border-violet-300/80 hover:border-violet-500 group-hover:shadow-violet-500/15',
    glowColor: 'rgba(124, 58, 237, 0.25)',
    textAccent: 'text-violet-700 dark:text-violet-400',
    badgeText: 'التمهيد للعلوم التخصصية',
    subjects: [
      { id: 'ar-8', name: 'اللغة العربية', code: 'AR', icon: 'BookOpen', description: 'الميزان الصرفي، الفعل اللازم والمتعدي، البلاغة النثرية والشعرية' },
      { id: 'math-8', name: 'الرياضيات', code: 'MATH', icon: 'Calculator', description: 'نظام المعادلات الخطية، نظرية فيثاغورس، التحويلات الهندسية، والإحصاء' },
      { id: 'sci-8', name: 'العلوم العامة', code: 'SCI', icon: 'FlaskConical', description: 'الفيزياء الحركية، الكيمياء التفاعلية، علم الوراثة، والكهرباء المتحركة' },
      { id: 'en-8', name: 'اللغة الإنجليزية', code: 'EN', icon: 'Languages', description: 'Action Pack 8: المناظرات، الكتابة الأكاديمية المنظمة، وقواعد الشرط' },
      { id: 'soc-8', name: 'الاجتماعيات والوطنية', code: 'SOC', icon: 'Compass', description: 'تاريخ الأردن المعاصر، الثورة العربية الكبرى، والديمقراطية وحقوق الإنسان' },
      { id: 'tech-8', name: 'الحاسوب وتكنولوجيا المعلومات', code: 'TECH', icon: 'Laptop', description: 'مبادئ البرمجة، لغة HTML، وتصميم المواقع الإلكترونية' },
    ],
  },
  {
    id: 9,
    slug: 'ninth-grade',
    name: 'الصف التاسع الأساسي',
    shortName: 'التاسع الأساسي',
    stage: 'middle',
    stageName: 'الصفوف العليا',
    numeral: '٩',
    order: 9,
    aliases: ['9', 'ninth', 'ninth-grade', 'grade-9', 'التاسع', 'الصف التاسع', 'تاسع', 'تاسع اساسي'],
    teacherKeywords: ['تاسع', 'التاسع', 'الصف التاسع', 'تاسع أساسي'],
    materialKeywords: ['تاسع', 'التاسع', 'الصف التاسع', 'تاسع أساسي'],
    description: 'المرحلة التمهيدية الحاسمة لتأسيس المفاهيم العلمية التخصصية والرياضيات المتقدمة.',
    gradient: 'from-purple-600 to-indigo-800',
    cardBg: 'bg-gradient-to-br from-purple-50/70 via-white to-indigo-50/50 dark:from-purple-950/20 dark:via-gray-900 dark:to-indigo-950/20',
    borderAccent: 'border-purple-300/80 hover:border-purple-500 group-hover:shadow-purple-500/15',
    glowColor: 'rgba(147, 51, 234, 0.25)',
    textAccent: 'text-purple-700 dark:text-purple-300',
    badgeText: 'تأسيس العلوم التخصصية',
    subjects: [
      { id: 'ar-9', name: 'اللغة العربية', code: 'AR', icon: 'BookOpen', description: 'النحو والصرف، بحور العروض، البلاغة، وقواعد الإملاء المتقدم' },
      { id: 'math-9', name: 'الرياضيات', code: 'MATH', icon: 'Calculator', description: 'المتباينات الخطية، الدوال والاقترانات، المثلثات، والهندسة الإحداثية' },
      { id: 'phys-9', name: 'الفيزياء', code: 'PHYS', icon: 'Atom', description: 'الميكانيكا الكلاسيكية، الحركة في خط مستقيم، الشغل والقدرة والطاقة' },
      { id: 'chem-9', name: 'الكيمياء', code: 'CHEM', icon: 'FlaskConical', description: 'بنية الذرة والتوزيع الإلكتروني، الروابط الكيميائية، وتفاعلات الفلزات' },
      { id: 'bio-9', name: 'العلوم الحياتية', code: 'BIO', icon: 'Dna', description: 'تركيب الخلية المتقدم، الأنسجة، وعمليات الأيض والتنفس الخلوي' },
      { id: 'en-9', name: 'اللغة الإنجليزية', code: 'EN', icon: 'Languages', description: 'Action Pack 9: مهارات التفكير النقدي، القواعد المتقدمة، والمقال الموسع' },
    ],
  },
  {
    id: 10,
    slug: 'tenth-grade',
    name: 'الصف العاشر الأساسي',
    shortName: 'العاشر الأساسي',
    stage: 'middle',
    stageName: 'الصفوف العليا',
    numeral: '١٠',
    order: 10,
    aliases: ['10', 'tenth', 'tenth-grade', 'grade-10', 'العاشر', 'الصف العاشر', 'عاشر', 'عاشر اساسي'],
    teacherKeywords: ['عاشر', 'العاشر', 'الصف العاشر', 'عاشر أساسي'],
    materialKeywords: ['عاشر', 'العاشر', 'الصف العاشر', 'عاشر أساسي'],
    description: 'بوابة الثانوية وتحديد المسار الأكاديمي والمهني مع مناهج كولينز المتطورة في العلوم والرياضيات.',
    gradient: 'from-indigo-700 via-violet-700 to-purple-800',
    cardBg: 'bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/60 dark:from-indigo-950/30 dark:via-gray-900 dark:to-violet-950/30',
    borderAccent: 'border-indigo-400/80 hover:border-indigo-600 group-hover:shadow-indigo-500/20',
    glowColor: 'rgba(67, 56, 202, 0.3)',
    textAccent: 'text-indigo-800 dark:text-indigo-300',
    badgeText: 'بوابة الثانوية والمسارات',
    subjects: [
      { id: 'ar-10', name: 'اللغة العربية', code: 'AR', icon: 'BookOpen', description: 'مهارات الاتصال، المشتقات المتقدمة، التحليل الأدبي والنقدي الموسع' },
      { id: 'math-10', name: 'الرياضيات', code: 'MATH', icon: 'Calculator', description: 'حساب المثلثات المتقدم، المتجهات، الدوال الأسية، والإحصاء والاحتمالات' },
      { id: 'phys-10', name: 'الفيزياء', code: 'PHYS', icon: 'Atom', description: 'قوانين نيوتن في الحركة، الحركة التوافقية البسيطة، الموائع السكونية والمتحركة' },
      { id: 'chem-10', name: 'الكيمياء', code: 'CHEM', icon: 'FlaskConical', description: 'الحسابات الكيميائية، المول والكتلة المولية، سرعة التفاعل والاتزان' },
      { id: 'bio-10', name: 'العلوم الحياتية', code: 'BIO', icon: 'Dna', description: 'الوراثة المندلية، التقانة الحيوية، وتصنيف الكائنات الحية والبيئة' },
      { id: 'earth-10', name: 'علوم الأرض والبيئة', code: 'EARTH', icon: 'Globe', description: 'حركات الصفائح التكتونية، الصخور النارية والرسوبية، والمياه الجوفية' },
      { id: 'en-10', name: 'اللغة الإنجليزية', code: 'EN', icon: 'Languages', description: 'Action Pack 10: الإعداد المتقدم لمستويات الثانوية وكتابة التقارير' },
    ],
  },

  // ----------------------------------------------------
  // 3. المرحلة الثانوية (Secondary / 11 - 12 & BTEC)
  // ----------------------------------------------------
  {
    id: 11,
    slug: 'first-secondary',
    name: 'الأول الثانوي (حادي عشر)',
    shortName: 'الأول ثانوي',
    stage: 'secondary',
    stageName: 'المرحلة الثانوية',
    numeral: '١١',
    order: 11,
    aliases: ['11', 'first-secondary', 'grade-11', 'أول ثانوي', 'الأول ثانوي', 'حادي عشر', 'أول-ثانوي', 'اول ثانوي', 'الاول ثانوي'],
    teacherKeywords: ['أول ثانوي', 'الأول ثانوي', 'حادي عشر', 'اول ثانوي'],
    materialKeywords: ['أول ثانوي', 'الأول ثانوي', 'حادي عشر', 'اول ثانوي'],
    description: 'سنة البناء والتمهيد الاستراتيجي للتوجيهي مع دراسة معمقة لمواد الفرعين العلمي والأدبي.',
    gradient: 'from-navy-900 via-indigo-900 to-amber-600',
    cardBg: 'bg-gradient-to-br from-blue-50/70 via-white to-amber-50/60 dark:from-blue-950/20 dark:via-gray-900 dark:to-amber-950/20',
    borderAccent: 'border-amber-300/80 hover:border-amber-500 group-hover:shadow-amber-500/20',
    glowColor: 'rgba(217, 119, 6, 0.25)',
    textAccent: 'text-amber-700 dark:text-amber-400',
    badgeText: 'تمهيد التوجيهي الاستراتيجي',
    subjects: [
      { id: 'math-11-sci', name: 'الرياضيات العلمي', code: 'MATH-SCI', icon: 'Calculator', branch: 'علمي', description: 'النهايات والاتصال، حساب المثلثات المتقدم، المتتاليات والمتسلسلات' },
      { id: 'math-11-lit', name: 'الرياضيات الأدبي', code: 'MATH-LIT', icon: 'Calculator', branch: 'أدبي', description: 'الاقترانات الخطية والتربيعية، التباديل والتوافيق، والبرمجة الخطية' },
      { id: 'ar-11', name: 'اللغة العربية (مشترك وتخصص)', code: 'AR', icon: 'BookOpen', branch: 'مشترك / أدبي', description: 'مهارات الاتصال المشتركة ومقدمة النحو والصرف وتاريخ الأدب' },
      { id: 'en-11', name: 'اللغة الإنجليزية', code: 'EN', icon: 'Languages', branch: 'مشترك', description: 'Action Pack 11: القواعد التوجيهية التحضيرية والتحليل الأدبي' },
      { id: 'phys-11', name: 'الفيزياء', code: 'PHYS', icon: 'Atom', branch: 'علمي', description: 'المجال الكهربائي، الجهد الكهربائي، المواسعة، والدوائر والتيار المستمر' },
      { id: 'chem-11', name: 'الكيمياء', code: 'CHEM', icon: 'FlaskConical', branch: 'علمي', description: 'الكيمياء العضوية، الهيدروكربونات، الكيمياء الحرارية، والغازات المثالية' },
      { id: 'bio-11', name: 'العلوم الحياتية', code: 'BIO', icon: 'Dna', branch: 'علمي', description: 'البيولوجيا الجزيئية، تصنيع البروتينات، الجهاز العصبي والهرموني' },
      { id: 'jor-11', name: 'تاريخ الأردن والتربية الإسلامية', code: 'JOR', icon: 'Compass', branch: 'مشترك', description: 'تأسيس إمارة شرق الأردن، الدستور الأردني، وأصول الفقه الإسلامي' },
    ],
  },
  {
    id: 12,
    slug: 'tawjihi-academic',
    name: 'التوجيهي الأكاديمي (العلمي والأدبي)',
    shortName: 'التوجيهي الأكاديمي',
    stage: 'secondary',
    stageName: 'المرحلة الثانوية',
    numeral: '١٢',
    order: 12,
    aliases: ['tawjihi-academic', 'tawjihi', '12', 'grade-12', 'توجيهي', 'التوجيهي', 'ثاني ثانوي', 'الثاني ثانوي', 'توجيهي أكاديمي', 'توجيهي-اكاديمي', 'توجيهي علمي', 'توجيهي أدبي'],
    teacherKeywords: ['ثاني ثانوي', 'التوجيهي', 'توجيهي', 'توجيهي أكاديمي', 'ثانوي عام', 'توجيهي علمي', 'توجيهي أدبي'],
    materialKeywords: ['ثاني ثانوي', 'التوجيهي', 'توجيهي', 'توجيهي أكاديمي', 'توجيهي علمي', 'توجيهي أدبي'],
    description: 'سنة الحصاد والتفوق لتحقيق أعلى المعدلات في امتحان شهادة الدراسة الثانوية العامة والالتحاق بالجامعة.',
    gradient: 'from-navy-950 via-[#0B1D3A] to-[#FFB800]',
    cardBg: 'bg-gradient-to-br from-amber-50/80 via-white to-navy-50/50 dark:from-navy-950/50 dark:via-gray-900 dark:to-amber-950/30',
    borderAccent: 'border-amber-400/90 hover:border-gold-500 group-hover:shadow-amber-500/30',
    glowColor: 'rgba(255, 184, 0, 0.35)',
    textAccent: 'text-amber-600 dark:text-gold-400',
    badgeText: 'سنة التفوق والمعدل الذهبي',
    subjects: [
      { id: 'math-tw-sci', name: 'الرياضيات - الفرع العلمي', code: 'MATH-SCI', icon: 'Calculator', branch: 'علمي', description: 'التفاضل وتطبيقاته الهندسية والفيزيائية، التكامل المتقدم وتطبيقاته، والمتجهات' },
      { id: 'math-tw-lit', name: 'الرياضيات - الفرع الأدبي', code: 'MATH-LIT', icon: 'Calculator', branch: 'أدبي', description: 'النهايات والاتصال، التفاضل وتطبيقاته الاقتصادية، والتكامل المحدود وغير المحدود' },
      { id: 'ar-tw-com', name: 'اللغة العربية (مشترك - مهارات)', code: 'AR-COM', icon: 'BookOpen', branch: 'مشترك', description: 'نصوص القراءة والشعر، قواعد النحو والصرف، الإملاء والعروض والقافية' },
      { id: 'ar-tw-spec', name: 'اللغة العربية تخصص', code: 'AR-SPEC', icon: 'BookOpen', branch: 'أدبي', description: 'النحو والصرف المتخصص، علم البلاغة والنقد الأدبي، وقضايا لغوية تاريخية' },
      { id: 'en-tw', name: 'اللغة الإنجليزية المشتركة', code: 'EN', icon: 'Languages', branch: 'مشترك', description: 'Action Pack 12: جميع قواعد المنهاج، المفردات، الاشتقاق، والتعبير المقالي' },
      { id: 'phys-tw', name: 'الفيزياء التوجيهي', code: 'PHYS', icon: 'Atom', branch: 'علمي', description: 'الزخم الخطي والدفع، الحركة الدورانية، التيارات المتناوبة، والفيزياء النووية والكم' },
      { id: 'chem-tw', name: 'الكيمياء التوجيهي', code: 'CHEM', icon: 'FlaskConical', branch: 'علمي', description: 'الحموض والقواعد والاتزان الأيوني، التأكسد والاختزال، والكيمياء العضوية الشاملة' },
      { id: 'bio-tw', name: 'العلوم الحياتية التوجيهي', code: 'BIO', icon: 'Dna', branch: 'علمي', description: 'كيمياء الحياة وتصنيع البروتينات، تضاعف DNA، الوراثة الجينية، والتنظيم الهرموني' },
      { id: 'jor-tw', name: 'تاريخ الأردن المشترك', code: 'JOR', icon: 'Compass', branch: 'مشترك', description: 'تاريخ المملكة عبر العصور، إنجازات الملوك الهاشميين، والنهضة الأردنية الحديثة' },
      { id: 'is-tw', name: 'التربية الإسلامية التوجيهي', code: 'IS', icon: 'Moon', branch: 'مشترك', description: 'الأحكام الشرعية، النظام الاقتصادي والاجتماعي في الإسلام، وأصول الفكر الإسلامي' },
    ],
  },
  {
    id: 13,
    slug: 'tawjihi-btec',
    name: 'التوجيهي المهني BTEC',
    shortName: 'التوجيهي المهني BTEC',
    stage: 'secondary',
    stageName: 'المرحلة الثانوية',
    numeral: 'BTEC',
    order: 13,
    aliases: ['tawjihi-btec', 'btec', 'betc', 'مهني', 'المهني', 'توجيهي مهني', 'توجيهي-مهني', 'btec-tawjihi'],
    teacherKeywords: ['BETC', 'BTEC', 'مهني', 'المهني', 'توجيهي مهني'],
    materialKeywords: ['BETC', 'BTEC', 'مهني', 'المهني', 'توجيهي مهني', 'مهني / BTEC'],
    description: 'التعليم المهني والتقني المتطور وفق المعايير الدولية لشركة بيرسون البريطانية BTEC.',
    gradient: 'from-rose-600 via-amber-600 to-gold-500',
    cardBg: 'bg-gradient-to-br from-rose-50/70 via-white to-amber-50/60 dark:from-rose-950/30 dark:via-gray-900 dark:to-amber-950/30',
    borderAccent: 'border-rose-300/80 hover:border-rose-500 group-hover:shadow-rose-500/25',
    glowColor: 'rgba(225, 29, 72, 0.3)',
    textAccent: 'text-rose-600 dark:text-rose-400',
    badgeText: 'تعليم تطبيقي ومعايير عالمية',
    subjects: [
      { id: 'btec-it', name: 'BTEC تكنولوجيا المعلومات (IT)', code: 'BTEC-IT', icon: 'Laptop', branch: 'مهني BTEC', description: 'تطوير البرمجيات وتصميم المواقع، شبكات الحاسوب، والأمن السيبراني وقواعد البيانات' },
      { id: 'btec-biz', name: 'BTEC إدارة الأعمال', code: 'BTEC-BIZ', icon: 'TrendingUp', branch: 'مهني BTEC', description: 'إدارة العمليات والتسويق الرقمي والمبيعات، المحاسبة المالية، وإدارة الموارد' },
      { id: 'btec-eng', name: 'BTEC الهندسة والتصنيع', code: 'BTEC-ENG', icon: 'Cpu', branch: 'مهني BTEC', description: 'مبادئ الهندسة الكهربائية والميكانيكية، الرسم الهندسي CAD، وتقنيات التصنيع' },
      { id: 'btec-art', name: 'BTEC الفن والتصميم الإبداعي', code: 'BTEC-ART', icon: 'Palette', branch: 'مهني BTEC', description: 'التصميم الجرافيكي والوسائط المتعددة، التصوير الفوتوغرافي، والإنتاج الفني' },
      { id: 'btec-en', name: 'اللغة الإنجليزية المهنية للأعمال', code: 'BTEC-EN', icon: 'Languages', branch: 'مشترك مهني', description: 'English for Work: الاتصال المهني، كتابة التقارير الإدارية، ومصطلحات الأعمال' },
      { id: 'btec-math', name: 'الرياضيات التطبيقية المهنية', code: 'BTEC-MATH', icon: 'Calculator', branch: 'مشترك مهني', description: 'الرياضيات الحسابية والإحصائية وحل المشكلات الهندسية والتجارية' },
    ],
  },
];

// Helper: Arabic and query normalization
export function normalizeGradeToken(raw: string): string {
  if (!raw) return '';
  return raw
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[\u064B-\u065F]/g, '') // remove tashkeel
    .replace(/^الصف\s+/g, '')
    .replace(/\s+الاساسي$/g, '')
    .replace(/\s+أساسي$/g, '')
    .trim();
}

/**
 * Resolves any grade identifier (canonical slug, numeric alias, or Arabic name/token)
 * to its corresponding GradeConfig.
 */
export function resolveGradeToken(token: string): GradeConfig | null {
  if (!token) return null;
  const rawDecoded = decodeURIComponent(token).trim().toLowerCase();
  const norm = normalizeGradeToken(rawDecoded);

  // 1. Direct canonical slug match
  const directSlug = GRADES_CONFIG.find((g) => g.slug.toLowerCase() === rawDecoded);
  if (directSlug) return directSlug;

  // 2. Direct alias match
  const directAlias = GRADES_CONFIG.find((g) =>
    g.aliases.some((a) => a.toLowerCase() === rawDecoded || normalizeGradeToken(a) === norm)
  );
  if (directAlias) return directAlias;

  // 3. Domain rule checks based on keyword semantics
  // Check BTEC / المهني first
  if (norm.includes('btec') || norm.includes('betc') || norm.includes('مهني')) {
    return GRADES_CONFIG.find((g) => g.slug === 'tawjihi-btec') || null;
  }

  // Check Tawjihi / ثاني ثانوي
  if (
    norm.includes('توجيهي') ||
    norm.includes('ثاني ثانوي') ||
    norm.includes('ثانوي عام') ||
    norm === '12'
  ) {
    return GRADES_CONFIG.find((g) => g.slug === 'tawjihi-academic') || null;
  }

  // Check الأول ثانوي / 11
  if (
    norm.includes('اول ثانوي') ||
    norm.includes('حادي عشر') ||
    norm === '11'
  ) {
    return GRADES_CONFIG.find((g) => g.slug === 'first-secondary') || null;
  }

  // Check العاشرة / 10
  if (norm.includes('عاشر') || norm === '10') {
    return GRADES_CONFIG.find((g) => g.slug === 'tenth-grade') || null;
  }

  // Check التاسع / 9
  if (norm.includes('تاسع') || norm === '9') {
    return GRADES_CONFIG.find((g) => g.slug === 'ninth-grade') || null;
  }

  // Check الثامن / 8
  if (norm.includes('ثامن') || norm === '8') {
    return GRADES_CONFIG.find((g) => g.slug === 'eighth-grade') || null;
  }

  // Check السابع / 7
  if (norm.includes('سابع') || norm === '7') {
    return GRADES_CONFIG.find((g) => g.slug === 'seventh-grade') || null;
  }

  // Check السادس / 6
  if (norm.includes('سادس') || norm === '6') {
    return GRADES_CONFIG.find((g) => g.slug === 'sixth-grade') || null;
  }

  // Check الخامس / 5
  if (norm.includes('خامس') || norm === '5') {
    return GRADES_CONFIG.find((g) => g.slug === 'fifth-grade') || null;
  }

  // Check الرابع / 4
  if (norm.includes('رابع') || norm === '4') {
    return GRADES_CONFIG.find((g) => g.slug === 'fourth-grade') || null;
  }

  // Check الثالث / 3
  if (norm.includes('ثالث') || norm === '3') {
    return GRADES_CONFIG.find((g) => g.slug === 'third-grade') || null;
  }

  // Check الثاني / 2 (after ensuring not 'ثاني ثانوي')
  if ((norm.includes('ثاني') || norm === '2') && !norm.includes('ثانوي')) {
    return GRADES_CONFIG.find((g) => g.slug === 'second-grade') || null;
  }

  // Check الأول / 1 (after ensuring not 'اول ثانوي')
  if ((norm.includes('اول') || norm === '1') && !norm.includes('ثانوي')) {
    return GRADES_CONFIG.find((g) => g.slug === 'first-grade') || null;
  }

  return null;
}

/**
 * Retrieves a grade by its canonical slug or recognized alias.
 */
export function getGradeBySlug(slug: string): GradeConfig | null {
  return resolveGradeToken(slug);
}

/**
 * Returns all 13 canonical grade slugs.
 */
export function getAllGradeSlugs(): string[] {
  return GRADES_CONFIG.map((g) => g.slug);
}

/**
 * Returns all grades belonging to a specific educational stage.
 */
export function getGradesByStage(stage: StageId): GradeConfig[] {
  return GRADES_CONFIG.filter((g) => g.stage === stage);
}

/**
 * Determines whether a teacher (with a comma-separated `grades` string) teaches a given grade.
 */
export function isTeacherInGrade(teacherGrades: string, gradeSlug: string): boolean {
  if (!teacherGrades || !gradeSlug) return false;
  const targetGrade = getGradeBySlug(gradeSlug);
  if (!targetGrade) return false;

  const tokens = teacherGrades.split(',').map((t) => t.trim()).filter(Boolean);
  for (const token of tokens) {
    const resolved = resolveGradeToken(token);
    if (resolved && resolved.slug === targetGrade.slug) {
      return true;
    }
  }
  return false;
}

/**
 * Determines whether a material item's `grade` string belongs to a given grade.
 */
export function isMaterialInGrade(materialGrade: string, gradeSlug: string): boolean {
  if (!materialGrade || !gradeSlug) return false;
  const targetGrade = getGradeBySlug(gradeSlug);
  if (!targetGrade) return false;

  const resolved = resolveGradeToken(materialGrade);
  return resolved?.slug === targetGrade.slug;
}

export interface ParsedTaughtGrade {
  name: string;
  slug: string;
  stage: StageId;
  stageName: string;
  numeral: string;
}

/**
 * Parses a comma-separated grades string from a teacher record and returns structured grade objects.
 */
export function parseTaughtGrades(gradesStr: string): ParsedTaughtGrade[] {
  if (!gradesStr) return [];
  const tokens = gradesStr.split(',').map((t) => t.trim()).filter(Boolean);
  const seenSlugs = new Set<string>();
  const result: ParsedTaughtGrade[] = [];

  for (const token of tokens) {
    const grade = resolveGradeToken(token);
    if (grade && !seenSlugs.has(grade.slug)) {
      seenSlugs.add(grade.slug);
      result.push({
        name: grade.name,
        slug: grade.slug,
        stage: grade.stage,
        stageName: STAGES[grade.stage].name,
        numeral: grade.numeral,
      });
    }
  }

  // Sort by canonical grade order
  return result.sort((a, b) => {
    const gradeA = getGradeBySlug(a.slug);
    const gradeB = getGradeBySlug(b.slug);
    return (gradeA?.order || 0) - (gradeB?.order || 0);
  });
}
