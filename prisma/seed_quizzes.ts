import { PrismaClient } from '@prisma/client';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'prisma', 'dev.db');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `file:${dbPath}`,
    },
  },
});

async function main() {
  console.log('🚀 بدء زراعة بيانات الاختبارات والمكافآت (Milestone 2)...');

  // 1. Seed Rewards
  const rewardsData = [
    {
      title: 'خصم 20% على بطاقة أي مادة',
      description: 'كوبون خصم 20% يمكن استخدامه فوراً عند شراء بطاقة أي مادة في المركز.',
      pointsCost: 150,
      icon: 'Tag',
      isActive: true,
    },
    {
      title: 'دوسية الأسئلة الوزارية الشاملة مجاناً',
      description: 'نسخة ورقية فاخرة تحتوي على بنك أسئلة الوزارة لجميع السنوات السابقة.',
      pointsCost: 100,
      icon: 'BookOpen',
      isActive: true,
    },
    {
      title: 'جلسة مراجعة وتوجيه فردية مع أستاذ المادة',
      description: 'لقاء تفاعلي مدته 45 دقيقة لمراجعة النقاط الصعبة وحل التمارين المتقدمة.',
      pointsCost: 300,
      icon: 'Users',
      isActive: true,
    },
    {
      title: 'حقيبة مركز القدومي وقرطاسية التفوق',
      description: 'حقيبة مدرسية أنيقة مع دفتر ملاحظات جامعي وأقلام فاخرة بشعار المركز.',
      pointsCost: 80,
      icon: 'Gift',
      isActive: true,
    },
    {
      title: 'بطاقة فصل دراسي مجانية كاملة',
      description: 'الجائزة الكبرى: بطاقة فصلية مجانية للمادة التي تختارها تكريماً لاجتهادك.',
      pointsCost: 500,
      icon: 'Award',
      isActive: true,
    },
  ];

  for (const reward of rewardsData) {
    const existing = await prisma.reward.findFirst({
      where: { title: reward.title },
    });
    if (!existing) {
      await prisma.reward.create({ data: reward });
      console.log(`  ➕ تم إضافة مكافأة: ${reward.title}`);
    } else {
      await prisma.reward.update({
        where: { id: existing.id },
        data: reward,
      });
      console.log(`  🔄 تم تحديث مكافأة: ${reward.title}`);
    }
  }

  // 2. Seed Quizzes
  const quizzesData = [
    {
      title: 'اختبار الرياضيات - التوجيهي العلمي: قواعد الاشتقاق والتفاضل',
      description: 'اختبار شامل ومكثف لمهارات الاشتقاق، مشتقات الاقترانات المثلثية، وقاعدة السلسلة للتوجيهي العلمي.',
      subject: 'الرياضيات',
      grade: 'توجيهي علمي',
      durationMinutes: 20,
      pointsPerCorrect: 10,
      bonusPoints: 20,
      passingScore: 60,
      isActive: true,
      questions: [
        {
          question: 'إذا كان ق(س) = س³ - 5س² + 7س - 9، فإن ق\'(2) تساوي:',
          order: 1,
          points: 10,
          explanation: 'المشتقة الأولى: ق\'(س) = 3س² - 10س + 7. بالتعويض س = 2: ق\'(2) = 3(4) - 10(2) + 7 = 12 - 20 + 7 = -1.',
          options: [
            { text: '-1', isCorrect: true, order: 1 },
            { text: '1', isCorrect: false, order: 2 },
            { text: '-3', isCorrect: false, order: 3 },
            { text: '5', isCorrect: false, order: 4 },
          ],
        },
        {
          question: 'ما هي مشتقة الاقتران هـ(س) = جا(3س) بالنسبة إلى س؟',
          order: 2,
          points: 10,
          explanation: 'باستخدام قاعدة السلسلة: مشتقة جا(3س) = جتا(3س) × مشتقة الزاوية (3) = 3 جتا(3س).',
          options: [
            { text: '3 جتا(3س)', isCorrect: true, order: 1 },
            { text: '-3 جتا(3س)', isCorrect: false, order: 2 },
            { text: 'جتا(3س)', isCorrect: false, order: 3 },
            { text: '3 جا(3س)', isCorrect: false, order: 4 },
          ],
        },
        {
          question: 'إذا كان ص = (2س + 1)⁴، فإن المشتقة الثانية عند س = 0 تساوي:',
          order: 3,
          points: 10,
          explanation: 'المشتقة الأولى ص\' = 4(2س + 1)³ × 2 = 8(2س + 1)³. المشتقة الثانية ص\'\' = 24(2س + 1)² × 2 = 48(2س + 1)². عند س = 0: ص\'\'(0) = 48(1) = 48.',
          options: [
            { text: '48', isCorrect: true, order: 1 },
            { text: '24', isCorrect: false, order: 2 },
            { text: '16', isCorrect: false, order: 3 },
            { text: '96', isCorrect: false, order: 4 },
          ],
        },
        {
          question: 'إذا كان المماس لمنحنى الاقتران ق(س) عند النقطة (1، 3) يوازي محور السينات، فإن ق\'(1) تساوي:',
          order: 4,
          points: 10,
          explanation: 'المستقيم الموازي لمحور السينات ميله يساوي صفراً، وبما أن ميل المماس هو قيمة المشتقة الأولى فإن ق\'(1) = 0.',
          options: [
            { text: '0', isCorrect: true, order: 1 },
            { text: '1', isCorrect: false, order: 2 },
            { text: '3', isCorrect: false, order: 3 },
            { text: 'غير معرفة', isCorrect: false, order: 4 },
          ],
        },
        {
          question: 'تتحرك نقطة مادية وفق العلاقة ف(ن) = 2ن² + 3ن + 1، فإن السرعة اللحظية للجسم بعد ثانيتين (ن = 2) بوحدة م/ث هي:',
          order: 5,
          points: 10,
          explanation: 'السرعة ع(ن) = ف\'(ن) = 4ن + 3. عند ن = 2: ع(2) = 4(2) + 3 = 11 م/ث.',
          options: [
            { text: '11 م/ث', isCorrect: true, order: 1 },
            { text: '8 م/ث', isCorrect: false, order: 2 },
            { text: '15 م/ث', isCorrect: false, order: 3 },
            { text: '14 م/ث', isCorrect: false, order: 4 },
          ],
        },
      ],
    },
    {
      title: 'اختبار الفيزياء - التوجيهي العلمي: المجال والجهد الكهربائي',
      description: 'تقييم مفاهيمي وحسابي معمق في قانون كولوم، خطوط المجال، والجهد الكهربائي للثانوية العامة.',
      subject: 'الفيزياء',
      grade: 'توجيهي علمي',
      durationMinutes: 20,
      pointsPerCorrect: 10,
      bonusPoints: 20,
      passingScore: 60,
      isActive: true,
      questions: [
        {
          question: 'إذا تضاعفت المسافة بين شحنتين نقطيتين إلى مثلي ما كانت عليه، فإن القوة المتبادلة بينهما تصبح:',
          order: 1,
          points: 10,
          explanation: 'وفق قانون كولوم، القوة تتناسب عكسياً مع مربع المسافة (ق ∝ 1 / ف²). عند مضاعفة المسافة (2ف)، تصبح القوة 1 / (2)² = ربع قيمتها الأصلية.',
          options: [
            { text: 'ربع ما كانت عليه', isCorrect: true, order: 1 },
            { text: 'نصف ما كانت عليه', isCorrect: false, order: 2 },
            { text: 'ضعفي ما كانت عليه', isCorrect: false, order: 3 },
            { text: 'أربعة أضعاف ما كانت عليه', isCorrect: false, order: 4 },
          ],
        },
        {
          question: 'وحدة قياس المجال الكهربائي في النظام الدولي للوحدات هي:',
          order: 2,
          points: 10,
          explanation: 'المجال الكهربائي م = ق / ش (نيوتن/كولوم)، كما يكافئ أيضاً فولت/متر.',
          options: [
            { text: 'نيوتن / كولوم', isCorrect: true, order: 1 },
            { text: 'جول / كولوم', isCorrect: false, order: 2 },
            { text: 'أمبير / متر', isCorrect: false, order: 3 },
            { text: 'تسلا . متر', isCorrect: false, order: 4 },
          ],
        },
        {
          question: 'جميع العبارات الآتية صحيحة بخصوص خطوط المجال الكهربائي ما عدا:',
          order: 3,
          points: 10,
          explanation: 'خطوط المجال الكهربائي لا تتقاطع أبداً؛ لأنه لو تقاطعت لأصبح للمجال عند نقطة التقاطع أكثر من اتجاه وهو مستحيل فيزيائياً.',
          options: [
            { text: 'قد تتقاطع عند النقاط عالية الشحنة', isCorrect: true, order: 1 },
            { text: 'تبدأ من الشحنة الموجبة وتنتهي بالسالبة', isCorrect: false, order: 2 },
            { text: 'كثافة الخطوط تدل على مقدار المجال', isCorrect: false, order: 3 },
            { text: 'المماس لخط المجال يحدد اتجاه المجال عند تلك النقطة', isCorrect: false, order: 4 },
          ],
        },
        {
          question: 'عند نقل شحنة كهربائية عبر سطح متساوي الجهد، فإن الشغل المبذول بواسطة القوة الكهربائية يساوي:',
          order: 4,
          points: 10,
          explanation: 'الشغل ش = - ش_نقطية × Δجـ. وبما أن فرق الجهد عبر السطح متساوي الجهد يساوي صفراً (Δجـ = 0)، فإن الشغل المبذول يساوي صفراً.',
          options: [
            { text: 'صفراً', isCorrect: true, order: 1 },
            { text: 'طاقة الوضع الابتدائية', isCorrect: false, order: 2 },
            { text: 'مقدار الشحنة مقسوماً على الجهد', isCorrect: false, order: 3 },
            { text: 'قيمة موجبة دائماً', isCorrect: false, order: 4 },
          ],
        },
        {
          question: 'مواسع كهربائي ذو لوحين متوازيين سعته س، إذا وضع لوح عازل ثابت عزله (ك = 3) بدلاً من الهواء بين لوحيه، فإن سعته تصبح:',
          order: 5,
          points: 10,
          explanation: 'سعة المواسع بوجود العازل س_ع = ك × س. مع ك = 3، تصبح السعة 3 أضعاف سعتها في الهواء.',
          options: [
            { text: '3 س', isCorrect: true, order: 1 },
            { text: 'س / 3', isCorrect: false, order: 2 },
            { text: '9 س', isCorrect: false, order: 3 },
            { text: 'تبقى ثابتة دون تغيير', isCorrect: false, order: 4 },
          ],
        },
      ],
    },
    {
      title: 'اختبار اللغة العربية المشتركة - مهارات وقواعد التوجيهي',
      description: 'اختبار تجريبي وزاري يغطي قواعد الإعلال والإبدال، المصادر، وأسماء الفاعل والمفعول وأسلوب التعجب.',
      subject: 'اللغة العربية',
      grade: 'توجيهي (مشترك)',
      durationMinutes: 15,
      pointsPerCorrect: 10,
      bonusPoints: 15,
      passingScore: 60,
      isActive: true,
      questions: [
        {
          question: 'اسم الفاعل من الفعل غير الثلاثي (أتقَنَ) هو:',
          order: 1,
          points: 10,
          explanation: 'يُصاغ اسم الفاعل من غير الثلاثي على وزن مضارعه بإبدال حرف المضارعة ميماً مضمومة وكسر ما قبل الآخر: أتقن -> يُتقن -> مُتقِن.',
          options: [
            { text: 'مُتقِن', isCorrect: true, order: 1 },
            { text: 'مُتقَن', isCorrect: false, order: 2 },
            { text: 'تَقِن', isCorrect: false, order: 3 },
            { text: 'تَقْنان', isCorrect: false, order: 4 },
          ],
        },
        {
          question: 'الكلمة التي حدث فيها إبدال في الكلمات الآتية هي:',
          order: 2,
          points: 10,
          explanation: 'كلمة (اصطبر) أصلها (اصتبر) من الفعل (صبر)، وقعت تاء الافتعال بعد الصاد فأُبدلت طاءً ليتحقق التجانس الصوتي.',
          options: [
            { text: 'اصطبر', isCorrect: true, order: 1 },
            { text: 'استمع', isCorrect: false, order: 2 },
            { text: 'انطلق', isCorrect: false, order: 3 },
            { text: 'تعلّم', isCorrect: false, order: 4 },
          ],
        },
        {
          question: 'ما هو إعراب كلمة (السماءَ) في جملة: "ما أجملَ السماءَ!"؟',
          order: 3,
          points: 10,
          explanation: 'في صيغة التعجب القياسي (ما أفعلَ + المتعجب منه)، يُعرب المتعجب منه دائماً مفعولاً به منصوباً بالفتحة الظاهرة.',
          options: [
            { text: 'مفعول به منصوب وعلامة نصبه الفتحة', isCorrect: true, order: 1 },
            { text: 'فاعل مرفوع وعلامة رفعه الضمة', isCorrect: false, order: 2 },
            { text: 'خبر ما التعجبية مرفوع', isCorrect: false, order: 3 },
            { text: 'تمييز منصوب وعلامة نصبه الفتحة', isCorrect: false, order: 4 },
          ],
        },
        {
          question: 'المصدر الصريح للفعل الخماسي (تقدَّمَ) هو:',
          order: 4,
          points: 10,
          explanation: 'الفعل الخماسي المبدوء بتاء زائدة على وزن (تَفَعَّلَ) يكون مصدره بضم ما قبل الآخر (تَفَعُّل): تقدَّمَ -> تقدُّم.',
          options: [
            { text: 'تقدُّم', isCorrect: true, order: 1 },
            { text: 'إقدام', isCorrect: false, order: 2 },
            { text: 'مُقدّمة', isCorrect: false, order: 3 },
            { text: 'تقاديم', isCorrect: false, order: 4 },
          ],
        },
        {
          question: 'المعنى المستفاد من الزيادة في الفعل (استغفرَ) هو:',
          order: 5,
          points: 10,
          explanation: 'صيغة (استفعل) تفيد غالباً معنى الطلب، فمعنى استغفر: طلب المغفرة والعفو من الله تعالى.',
          options: [
            { text: 'الطلب', isCorrect: true, order: 1 },
            { text: 'الصيرورة', isCorrect: false, order: 2 },
            { text: 'التكثير', isCorrect: false, order: 3 },
            { text: 'المشاركة', isCorrect: false, order: 4 },
          ],
        },
      ],
    },
  ];

  for (const quizItem of quizzesData) {
    const existingQuiz = await prisma.quiz.findFirst({
      where: { title: quizItem.title },
    });

    if (existingQuiz) {
      // Delete existing questions & options to refresh cleanly
      await prisma.quizQuestion.deleteMany({
        where: { quizId: existingQuiz.id },
      });
      await prisma.quiz.delete({
        where: { id: existingQuiz.id },
      });
      console.log(`  🔄 إزالة النسخة السابقة من الاختبار: ${quizItem.title}`);
    }

    const { questions, ...quizData } = quizItem;
    const createdQuiz = await prisma.quiz.create({
      data: quizData,
    });

    for (const q of questions) {
      const { options, ...questionData } = q;
      const createdQuestion = await prisma.quizQuestion.create({
        data: {
          ...questionData,
          quizId: createdQuiz.id,
        },
      });

      for (const opt of options) {
        await prisma.quizOption.create({
          data: {
            ...opt,
            questionId: createdQuestion.id,
          },
        });
      }
    }

    console.log(`  ✅ تم إنشاء الاختبار: ${createdQuiz.title} مع ${questions.length} أسئلة.`);
  }

  console.log('🎉 تم زراعة جميع الاختبارات والمكافآت بنجاح!');
}

main()
  .catch((e) => {
    console.error('❌ خطأ أثناء زراعة البيانات:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
