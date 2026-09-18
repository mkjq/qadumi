import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateQuestion(text: string, correctAns: string, wrong1: string, wrong2: string, wrong3: string) {
  // Shuffle options
  const options = [
    { text: correctAns, isCorrect: true },
    { text: wrong1, isCorrect: false },
    { text: wrong2, isCorrect: false },
    { text: wrong3, isCorrect: false },
  ];
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return { question: text, options };
}

const subjects = [
  { grade: 'توجيهي علمي', subject: 'رياضيات', topics: ['التفاضل', 'تطبيقات التفاضل', 'التكامل', 'تطبيقات التكامل', 'الأعداد المركبة', 'القطوع المخروطية'] },
  { grade: 'توجيهي علمي', subject: 'فيزياء', topics: ['الميكانيكا', 'الكهرباء', 'المغناطيسية', 'الفيزياء الحديثة', 'الفيزياء النووية'] },
  { grade: 'توجيهي علمي', subject: 'كيمياء', topics: ['سرعة التفاعل', 'الكيمياء العضوية', 'الكيمياء الكهربائية', 'الحموض والقواعد', 'الاتزان الكيميائي'] },
  { grade: 'توجيهي علمي', subject: 'أحياء', topics: ['الوراثة', 'الخلية', 'أجهزة الجسم', 'البيئة', 'التطور'] },
  { grade: 'عاشر', subject: 'رياضيات', topics: ['المعادلات الخطية', 'المعادلات التربيعية', 'الهندسة الإحداثية', 'الاحتمالات'] },
  { grade: 'عاشر', subject: 'فيزياء', topics: ['الحركة', 'القوى', 'الشغل والطاقة'] },
  { grade: 'أول ثانوي', subject: 'تاريخ الأردن', topics: ['تاريخ الأردن القديم', 'الثورة العربية الكبرى', 'إمارة شرق الأردن'] },
  { grade: 'أول ثانوي', subject: 'عربي', topics: ['النحو والصرف', 'البلاغة', 'قضايا أدبية', 'العروض'] }
];

const quizzesData: any[] = [];

subjects.forEach(subj => {
  subj.topics.forEach((topic, idx) => {
    const questions = [];
    for (let i = 1; i <= 5; i++) {
      questions.push(
        generateQuestion(
          `سؤال ${i} في موضوع ${topic} - ${subj.subject} (${subj.grade})`,
          `الإجابة الصحيحة للسؤال ${i}`,
          `إجابة خاطئة أ`,
          `إجابة خاطئة ب`,
          `إجابة خاطئة ج`
        )
      );
    }
    
    quizzesData.push({
      title: `اختبار ${topic}`,
      description: `اختبار شامل وتفاعلي في موضوع ${topic} لطلاب ${subj.grade}`,
      subject: subj.subject,
      grade: subj.grade,
      durationMinutes: 5 + (idx % 3), // 5-7 minutes
      pointsPerCorrect: 10,
      bonusPoints: 20,
      passingScore: 60,
      questions
    });
  });
});

async function main() {
  console.log("Seeding 30+ quizzes...");
  let count = 0;
  for (const q of quizzesData) {
    const quiz = await prisma.quiz.create({
      data: {
        title: q.title,
        description: q.description,
        subject: q.subject,
        grade: q.grade,
        durationMinutes: q.durationMinutes,
        pointsPerCorrect: q.pointsPerCorrect,
        bonusPoints: q.bonusPoints,
        passingScore: q.passingScore,
        questions: {
          create: q.questions.map((question: any, qIdx: number) => ({
            question: question.question,
            order: qIdx,
            points: q.pointsPerCorrect,
            options: {
              create: question.options.map((opt: any, oIdx: number) => ({
                text: opt.text,
                isCorrect: opt.isCorrect,
                order: oIdx
              }))
            }
          }))
        }
      }
    });
    console.log(`Created quiz ${++count}: ${quiz.title}`);
  }
  console.log("Seeding complete! Total quizzes inserted:", count);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
