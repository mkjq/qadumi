'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Calculator, Atom, FlaskConical, Dna, Globe, Landmark, Compass, FileText, Star, ArrowLeft, CheckCircle2, Award, ExternalLink, GraduationCap, Layers,  } from 'lucide-react';

export interface EnrolledGradeItem {
  id: number;
  grade: string;
  subject?: string | null;
  enrolledAt?: string;
}

export interface SubmissionSummary {
  id?: number;
  quizTitle?: string;
  subject?: string;
  score?: number;
}

export interface EnrolledCoursesSectionProps {
  grade: string;
  enrolledGrades?: EnrolledGradeItem[];
  submissions?: SubmissionSummary[];
}

interface SubjectCardConfig {
  id: string;
  name: string;
  querySubject: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  badgeBg: string;
  borderHover: string;
  iconBg: string;
  iconColor: string;
}

// Subject definitions by grade category
const CURRICULUM_MAP: Record<string, SubjectCardConfig[]> = {
  'توجيهي علمي': [
    {
      id: 'math-sci',
      name: 'الرياضيات العلمي',
      querySubject: 'الرياضيات',
      description: 'التفاضل والتكامل، المتجهات، والتطبيقات الهندسية والفيزيائية وفق المنهاج الوزاري.',
      icon: Calculator,
      gradient: 'from-cyan-500/10 via-cyan-500/5 to-transparent',
      badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      borderHover: 'hover:border-cyan-400 hover:shadow-cyan-500/10',
      iconBg: 'bg-cyan-500/15 text-cyan-600',
      iconColor: 'text-cyan-500',
    },
    {
      id: 'physics',
      name: 'الفيزياء',
      querySubject: 'الفيزياء',
      description: 'المجال والجهد الكهربائي، المواسعات، التيارات، والمغناطيسية والفيزياء الذرية.',
      icon: Atom,
      gradient: 'from-purple-500/10 via-purple-500/5 to-transparent',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
      borderHover: 'hover:border-purple-400 hover:shadow-purple-500/10',
      iconBg: 'bg-purple-500/15 text-purple-600',
      iconColor: 'text-purple-500',
    },
    {
      id: 'chemistry',
      name: 'الكيمياء',
      querySubject: 'الكيمياء',
      description: 'الحموض والقواعد، سرعة التفاعلات والاتزان الكيميائي، والكيمياء العضوية الشاملة.',
      icon: FlaskConical,
      gradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      borderHover: 'hover:border-amber-400 hover:shadow-amber-500/10',
      iconBg: 'bg-amber-500/15 text-amber-600',
      iconColor: 'text-amber-500',
    },
    {
      id: 'biology',
      name: 'العلوم الحياتية (الأحياء)',
      querySubject: 'الأحياء',
      description: 'الوراثة الجزيئية والمندلية، التعبير الجيني، التكنولوجيا الحيوية، وتدفق الطاقة.',
      icon: Dna,
      gradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      borderHover: 'hover:border-emerald-400 hover:shadow-emerald-500/10',
      iconBg: 'bg-emerald-500/15 text-emerald-600',
      iconColor: 'text-emerald-500',
    },
    {
      id: 'arabic',
      name: 'اللغة العربية المشتركة',
      querySubject: 'اللغة العربية',
      description: 'النحو والصرف، البلاغة والعروض، ونصوص المهارات والقراءة التحليلية.',
      icon: BookOpen,
      gradient: 'from-blue-500/10 via-blue-500/5 to-transparent',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      borderHover: 'hover:border-blue-400 hover:shadow-blue-500/10',
      iconBg: 'bg-blue-500/15 text-blue-600',
      iconColor: 'text-blue-500',
    },
    {
      id: 'english',
      name: 'اللغة الإنجليزية',
      querySubject: 'اللغة الإنجليزية',
      description: 'Tenses, Passive Voice, Reported Speech, Vocabulary, and Writing Skills.',
      icon: Globe,
      gradient: 'from-rose-500/10 via-rose-500/5 to-transparent',
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
      borderHover: 'hover:border-rose-400 hover:shadow-rose-500/10',
      iconBg: 'bg-rose-500/15 text-rose-600',
      iconColor: 'text-rose-500',
    },
  ],

  'توجيهي أدبي': [
    {
      id: 'math-lit',
      name: 'الرياضيات الأدبي',
      querySubject: 'الرياضيات',
      description: 'التكامل وتطبيقاته، المصفوفات والمحددات، والإحصاء والاحتمالات.',
      icon: Calculator,
      gradient: 'from-cyan-500/10 via-cyan-500/5 to-transparent',
      badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      borderHover: 'hover:border-cyan-400 hover:shadow-cyan-500/10',
      iconBg: 'bg-cyan-500/15 text-cyan-600',
      iconColor: 'text-cyan-500',
    },
    {
      id: 'arabic-spec',
      name: 'اللغة العربية (تخصص)',
      querySubject: 'اللغة العربية',
      description: 'النحو والصرف التخصصي، قضايا أدبية تاريخية، ونقد أدبي وبلاغة معاصرة.',
      icon: BookOpen,
      gradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      borderHover: 'hover:border-emerald-400 hover:shadow-emerald-500/10',
      iconBg: 'bg-emerald-500/15 text-emerald-600',
      iconColor: 'text-emerald-500',
    },
    {
      id: 'history',
      name: 'تاريخ الأردن والعرب',
      querySubject: 'التاريخ',
      description: 'محطات الاستقلال، الثورة العربية الكبرى، والنهضة الأردنية الحديثة والمعاصرة.',
      icon: Landmark,
      gradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      borderHover: 'hover:border-amber-400 hover:shadow-amber-500/10',
      iconBg: 'bg-amber-500/15 text-amber-600',
      iconColor: 'text-amber-500',
    },
    {
      id: 'geography',
      name: 'الجغرافيا ودراسات البيئة',
      querySubject: 'الجغرافيا',
      description: 'الجغرافيا الطبيعية، الخرائط والاستشعار عن بعد، السكان والأنشطة الاقتصادية.',
      icon: Compass,
      gradient: 'from-teal-500/10 via-teal-500/5 to-transparent',
      badgeBg: 'bg-teal-50 text-teal-700 border-teal-200',
      borderHover: 'hover:border-teal-400 hover:shadow-teal-500/10',
      iconBg: 'bg-teal-500/15 text-teal-600',
      iconColor: 'text-teal-500',
    },
    {
      id: 'arabic-lit-common',
      name: 'اللغة العربية المشتركة',
      querySubject: 'اللغة العربية',
      description: 'مهارات الاتصال، النحو والإملاء، والنصوص الشعرية والنثرية المقررة.',
      icon: BookOpen,
      gradient: 'from-blue-500/10 via-blue-500/5 to-transparent',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      borderHover: 'hover:border-blue-400 hover:shadow-blue-500/10',
      iconBg: 'bg-blue-500/15 text-blue-600',
      iconColor: 'text-blue-500',
    },
    {
      id: 'english-lit',
      name: 'اللغة الإنجليزية',
      querySubject: 'اللغة الإنجليزية',
      description: 'English for Humanities: Reading texts, Language structures, and Composition.',
      icon: Globe,
      gradient: 'from-rose-500/10 via-rose-500/5 to-transparent',
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
      borderHover: 'hover:border-rose-400 hover:shadow-rose-500/10',
      iconBg: 'bg-rose-500/15 text-rose-600',
      iconColor: 'text-rose-500',
    },
  ],

  'أول ثانوي علمي': [
    {
      id: 'math-11',
      name: 'الرياضيات',
      querySubject: 'الرياضيات',
      description: 'الاقترانات واللوغاريتمات، المتطابقات المثلثية، والنهايات والاتصال التمهيدي.',
      icon: Calculator,
      gradient: 'from-cyan-500/10 via-cyan-500/5 to-transparent',
      badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      borderHover: 'hover:border-cyan-400 hover:shadow-cyan-500/10',
      iconBg: 'bg-cyan-500/15 text-cyan-600',
      iconColor: 'text-cyan-500',
    },
    {
      id: 'phys-11',
      name: 'الفيزياء',
      querySubject: 'الفيزياء',
      description: 'الميكانيكا الكلاسيكية، المتجهات وقوانين نيوتن، والديناميكا الحرارية.',
      icon: Atom,
      gradient: 'from-purple-500/10 via-purple-500/5 to-transparent',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
      borderHover: 'hover:border-purple-400 hover:shadow-purple-500/10',
      iconBg: 'bg-purple-500/15 text-purple-600',
      iconColor: 'text-purple-500',
    },
    {
      id: 'chem-11',
      name: 'الكيمياء',
      querySubject: 'الكيمياء',
      description: 'البنية الذرية، الروابط الكيميائية، وتفاعلات التأكسد والاختزال والمحاليل.',
      icon: FlaskConical,
      gradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      borderHover: 'hover:border-amber-400 hover:shadow-amber-500/10',
      iconBg: 'bg-amber-500/15 text-amber-600',
      iconColor: 'text-amber-500',
    },
    {
      id: 'bio-11',
      name: 'العلوم الحياتية',
      querySubject: 'الأحياء',
      description: 'بيولوجيا الخلية، التنفس الخلوي والبناء الضوئي، والأنظمة البيئية.',
      icon: Dna,
      gradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      borderHover: 'hover:border-emerald-400 hover:shadow-emerald-500/10',
      iconBg: 'bg-emerald-500/15 text-emerald-600',
      iconColor: 'text-emerald-500',
    },
    {
      id: 'ar-11',
      name: 'اللغة العربية',
      querySubject: 'اللغة العربية',
      description: 'التطبيقات النحوية والصرفية المتقدمة ونصوص الأدب والبلاغة.',
      icon: BookOpen,
      gradient: 'from-blue-500/10 via-blue-500/5 to-transparent',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      borderHover: 'hover:border-blue-400 hover:shadow-blue-500/10',
      iconBg: 'bg-blue-500/15 text-blue-600',
      iconColor: 'text-blue-500',
    },
    {
      id: 'en-11',
      name: 'اللغة الإنجليزية',
      querySubject: 'اللغة الإنجليزية',
      description: 'Academic English: Structure, Reading comprehension, and writing tasks.',
      icon: Globe,
      gradient: 'from-rose-500/10 via-rose-500/5 to-transparent',
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
      borderHover: 'hover:border-rose-400 hover:shadow-rose-500/10',
      iconBg: 'bg-rose-500/15 text-rose-600',
      iconColor: 'text-rose-500',
    },
  ],

  'الصف العاشر': [
    {
      id: 'math-10',
      name: 'الرياضيات',
      querySubject: 'الرياضيات',
      description: 'الاقترانات التربيعية والتكعيبية، الدوائر، الهندسة التحليلية والمثلثات.',
      icon: Calculator,
      gradient: 'from-cyan-500/10 via-cyan-500/5 to-transparent',
      badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      borderHover: 'hover:border-cyan-400 hover:shadow-cyan-500/10',
      iconBg: 'bg-cyan-500/15 text-cyan-600',
      iconColor: 'text-cyan-500',
    },
    {
      id: 'phys-10',
      name: 'الفيزياء',
      querySubject: 'الفيزياء',
      description: 'المتجهات، الحركة في خط مستقيم وفي بعدين، والحرارة والموجات.',
      icon: Atom,
      gradient: 'from-purple-500/10 via-purple-500/5 to-transparent',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
      borderHover: 'hover:border-purple-400 hover:shadow-purple-500/10',
      iconBg: 'bg-purple-500/15 text-purple-600',
      iconColor: 'text-purple-500',
    },
    {
      id: 'chem-10',
      name: 'الكيمياء',
      querySubject: 'الكيمياء',
      description: 'التوزيع الإلكتروني، الجدول الدوري، والروابط والتفاعلات الكيميائية.',
      icon: FlaskConical,
      gradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      borderHover: 'hover:border-amber-400 hover:shadow-amber-500/10',
      iconBg: 'bg-amber-500/15 text-amber-600',
      iconColor: 'text-amber-500',
    },
    {
      id: 'bio-10',
      name: 'الأحياء والعلوم الحياتية',
      querySubject: 'الأحياء',
      description: 'تنوع الكائنات الحية، البكتيريا والفيروسات، والبيئة والتوازن الحيوي.',
      icon: Dna,
      gradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      borderHover: 'hover:border-emerald-400 hover:shadow-emerald-500/10',
      iconBg: 'bg-emerald-500/15 text-emerald-600',
      iconColor: 'text-emerald-500',
    },
    {
      id: 'ar-10',
      name: 'اللغة العربية',
      querySubject: 'اللغة العربية',
      description: 'المشتقات وأوزانها، البلاغة التأسيسية، وفنون الكتابة والتعبير الأدبي.',
      icon: BookOpen,
      gradient: 'from-blue-500/10 via-blue-500/5 to-transparent',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      borderHover: 'hover:border-blue-400 hover:shadow-blue-500/10',
      iconBg: 'bg-blue-500/15 text-blue-600',
      iconColor: 'text-blue-500',
    },
    {
      id: 'en-10',
      name: 'اللغة الإنجليزية',
      querySubject: 'اللغة الإنجليزية',
      description: 'Action Pack 10: Grammar exercises, critical reading, and vocabulary building.',
      icon: Globe,
      gradient: 'from-rose-500/10 via-rose-500/5 to-transparent',
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
      borderHover: 'hover:border-rose-400 hover:shadow-rose-500/10',
      iconBg: 'bg-rose-500/15 text-rose-600',
      iconColor: 'text-rose-500',
    },
  ],
};

// Default fallback subjects
const DEFAULT_SUBJECTS: SubjectCardConfig[] = [
  {
    id: 'def-math',
    name: 'الرياضيات',
    querySubject: 'الرياضيات',
    description: 'تمارين تفاعلية، اختبارات تشخيصية، ومراجعات شاملة في الرياضيات.',
    icon: Calculator,
    gradient: 'from-cyan-500/10 via-cyan-500/5 to-transparent',
    badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    borderHover: 'hover:border-cyan-400 hover:shadow-cyan-500/10',
    iconBg: 'bg-cyan-500/15 text-cyan-600',
    iconColor: 'text-cyan-500',
  },
  {
    id: 'def-phys',
    name: 'الفيزياء',
    querySubject: 'الفيزياء',
    description: 'مفاهيم وقوانين الفيزياء النظرية والتطبيقية مع بنك أسئلة متدرج الصعوبة.',
    icon: Atom,
    gradient: 'from-purple-500/10 via-purple-500/5 to-transparent',
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
    borderHover: 'hover:border-purple-400 hover:shadow-purple-500/10',
    iconBg: 'bg-purple-500/15 text-purple-600',
    iconColor: 'text-purple-500',
  },
  {
    id: 'def-chem',
    name: 'الكيمياء',
    querySubject: 'الكيمياء',
    description: 'معادلات، تفاعلات، وتطبيقات كيميائية مع شروحات وأسئلة تقويمية.',
    icon: FlaskConical,
    gradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    borderHover: 'hover:border-amber-400 hover:shadow-amber-500/10',
    iconBg: 'bg-amber-500/15 text-amber-600',
    iconColor: 'text-amber-500',
  },
  {
    id: 'def-bio',
    name: 'العلوم والأحياء',
    querySubject: 'الأحياء',
    description: 'مفاهيم الأحياء والبيئة والعلوم العامة مع اختبارات تدريبية سريعة.',
    icon: Dna,
    gradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    borderHover: 'hover:border-emerald-400 hover:shadow-emerald-500/10',
    iconBg: 'bg-emerald-500/15 text-emerald-600',
    iconColor: 'text-emerald-500',
  },
  {
    id: 'def-ar',
    name: 'اللغة العربية',
    querySubject: 'اللغة العربية',
    description: 'قواعد النحو والصرف، البلاغة، ونصوص القراءة والتذوق الأدبي.',
    icon: BookOpen,
    gradient: 'from-blue-500/10 via-blue-500/5 to-transparent',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    borderHover: 'hover:border-blue-400 hover:shadow-blue-500/10',
    iconBg: 'bg-blue-500/15 text-blue-600',
    iconColor: 'text-blue-500',
  },
  {
    id: 'def-en',
    name: 'اللغة الإنجليزية',
    querySubject: 'اللغة الإنجليزية',
    description: 'شروحات القواعد، بنك الكلمات، ونماذج قطع الاستيعاب والأسئلة الوزارية.',
    icon: Globe,
    gradient: 'from-rose-500/10 via-rose-500/5 to-transparent',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
    borderHover: 'hover:border-rose-400 hover:shadow-rose-500/10',
    iconBg: 'bg-rose-500/15 text-rose-600',
    iconColor: 'text-rose-500',
  },
];

export default function EnrolledCoursesSection({
  grade,
  enrolledGrades = [],
  submissions = [],
}: EnrolledCoursesSectionProps) {
  // Resolve curriculum subjects based on grade
  const subjects = useMemo(() => {
    if (!grade) return DEFAULT_SUBJECTS;
    if (grade.includes('علمي') && grade.includes('توجيهي')) return CURRICULUM_MAP['توجيهي علمي'];
    if (grade.includes('أدبي') && grade.includes('توجيهي')) return CURRICULUM_MAP['توجيهي أدبي'];
    if (grade.includes('علمي') && grade.includes('أول')) return CURRICULUM_MAP['أول ثانوي علمي'];
    if (grade.includes('عاشر')) return CURRICULUM_MAP['الصف العاشر'];
    return CURRICULUM_MAP[grade] || DEFAULT_SUBJECTS;
  }, [grade]);

  // Compute stats per subject
  const subjectStats = useMemo(() => {
    const stats: Record<string, { completedCount: number; avgScore: number | null }> = {};

    subjects.forEach((subj) => {
      const matched = submissions.filter((sub) => {
        if (!sub) return false;
        const subTitle = (sub.quizTitle || '').toLowerCase();
        const subSubject = (sub.subject || '').toLowerCase();
        const query = subj.querySubject.toLowerCase();
        const name = subj.name.toLowerCase();

        return (
          subSubject.includes(query) ||
          subSubject.includes(name) ||
          subTitle.includes(query) ||
          subTitle.includes(name)
        );
      });

      const count = matched.length;
      const avg =
        count > 0
          ? Math.round(
              matched.reduce((acc, curr) => acc + (typeof curr.score === 'number' ? curr.score : 0), 0) /
                count
            )
          : null;

      stats[subj.id] = { completedCount: count, avgScore: avg };
    });

    return stats;
  }, [subjects, submissions]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <div className="mb-12">
      {/* Header section with badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 text-xs font-bold mb-2">
            <GraduationCap className="w-4 h-4 text-cyan-600" />
            <span>المواد والمساقات المسجلة لصفك</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-navy-900 flex items-center gap-2">
            <span>منهاج {grade || 'دراستك'}</span>
            <span className="text-xs font-bold text-slate-500">({subjects.length} مواد مقررة)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            اختر أي مادة لبدء حل الاختبارات التشخيصية والوزارية وتجميع النقاط والمكافآت
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/materials"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-gradient-to-b from-slate-50 to-slate-100 hover:border-slate-300 backdrop-blur-sm"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-600" />
            <span>بنك الدوسيات والملخصات</span>
          </Link>
          <Link
            href="/quizzes"
            className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-600-white shadow-sm transition hover:bg-cyan-700"
          >
            <Star className="w-3.5 h-3.5" />
            <span>جميع الاختبارات</span>
          </Link>
        </div>
      </div>

      {/* Grid of Subject Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {subjects.map((subject) => {
          const stats = subjectStats[subject.id] || { completedCount: 0, avgScore: null };
          const Icon = subject.icon;
          const quizzesUrl = `/quizzes?subject=${encodeURIComponent(subject.querySubject)}&grade=${encodeURIComponent(grade || '')}`;

          return (
            <motion.div
              key={subject.id}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className={`group relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:shadow-xl ${subject.borderHover}`}
            >
              {/* Subtle top ambient gradient */}
              <div
                className={`absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br ${subject.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none`}
              />

              <div>
                {/* Top Row: Icon & Status */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${subject.iconBg} shadow-sm transition-transform duration-300 group-hover:scale-105`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-navy-900 group-hover:text-navy-800 transition-colors">
                        {subject.name}
                      </h3>
                      <span className="text-xs text-slate-500 font-medium">
                        {grade || 'المنهاج الأردني'}
                      </span>
                    </div>
                  </div>

                  {stats.completedCount > 0 ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 text-xs font-bold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{stats.completedCount} منجز</span>
                    </span>
                  ) : (
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${subject.badgeBg}`}>
                      <span>متاح الآن</span>
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed line-clamp-2">
                  {subject.description}
                </p>

                {/* Performance or Completion indicator */}
                <div className="mb-5 rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/80 border border-slate-200 p-3">
                  {stats.completedCount > 0 ? (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">معدل تحصيلك في المادة:</span>
                      <span className="font-black text-emerald-600 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        <span>{stats.avgScore}%</span>
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-amber-500" />
                        <span>اختبارات تفاعلية مكافئة بنقاط</span>
                      </span>
                      <span className="font-bold text-cyan-700">جاهز للبدء</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                <Link
                  href={quizzesUrl}
                  className="group/btn inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-navy-700 to-cyan-700-white shadow-sm transition hover:from-cyan-600 hover:to-navy-800 active:scale-95 text-center"
                >
                  <span>حل الاختبارات</span>
                  <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:-translate-x-0.5" />
                </Link>

                <Link
                  href="/materials"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-gradient-to-b from-slate-50 to-slate-100 hover:border-slate-300 text-center"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>الدوسيات</span>
                </Link>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
