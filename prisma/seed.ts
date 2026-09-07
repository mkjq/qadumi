import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 بدء إدخال البيانات الأولية...');

  // Admin
  const passwordHash = await bcrypt.hash('qadoumi2025', 12);
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash,
    },
  });
  console.log('✅ تم إنشاء حساب المدير');

  // Center Info
  const centerInfoData = [
    { key: 'name', value: 'مركز القدومي الثقافي' },
    { key: 'slogan', value: 'يدًا بيد لبناء جيل متعلم ومفكر' },
    { key: 'founded', value: '2000' },
    { key: 'graduates', value: '50000' },
    { key: 'successRate', value: '99' },
    { key: 'phone_admin', value: '0791586891' },
    { key: 'facebook', value: 'https://www.facebook.com/share/1HvqSPwcCK/?mibextid=wwXIfr' },
    { key: 'mapsUrl', value: 'https://maps.app.goo.gl/P37KjSNqQ7U3j16e8?g_st=ii' },
    { key: 'mapsEmbed', value: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3383.2!2d35.88!3d31.97!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDU4JzEyLjAiTiAzNcKwNTInNDguMCJF!5e0!3m2!1sar!2sjo!4v1234567890' },
    { key: 'workingHours', value: 'من 2:00 ظهرًا حتى 9:00 مساءً' },
    { key: 'grades', value: 'من الصف الأول الأساسي حتى الثانوي العام (التوجيهي)' },
    { key: 'about', value: 'مركز القدومي الثقافي من أعرق المراكز في المنطقة وذو شهرة واسعة في مناطق ضاحية الأمير حسن وجبل النزهة وضاحية الأقصى وطبربور وما حولها. تأسس المركز عام 2000م ويستمر العطاء والإخلاص والتميز، هدفنا دعم طلبتنا بالعلم والفكر وجعلهم باحثين وناجحين في حياتهم، محققين جميع أهدافهم، وتنمية شخصياتهم وتحسين مستواهم التعليمي، ونسعى لتطوير قدراتهم في مختلف مجالات الحياة.' },
    { key: 'mission', value: 'يقدم مركزنا دورات تعليمية من الصف الأول إلى التوجيهي بجميع المواد.' },
    { key: 'discounts', value: 'أسعار مناسبة جدًا | خصومات للمجموعات | خصومات للإخوة' },
    { key: 'areas', value: 'ضاحية الأمير حسن، جبل النزهة، ضاحية الأقصى، طبربور وما حولها' },
  ];

  for (const info of centerInfoData) {
    await prisma.centerInfo.upsert({
      where: { key: info.key },
      update: { value: info.value },
      create: info,
    });
  }
  console.log('✅ تم إدخال معلومات المركز');

  // Teachers
  const teachers = [
    {
      name: 'يوسف الحوراني',
      subject: 'اللغة العربية',
      grades: 'عاشر,أول ثانوي,ثاني ثانوي',
      phone: '0796268289',
      whatsapp: '0796268289',
      facebook: 'https://www.facebook.com/share/14qU5URmhp1/?mibextid=wwXIfr',
      instagram: 'https://www.instagram.com/youssef_alhorani',
      bio: 'خبرة في التدريس 6 سنوات لمرحلة الثانوية العامة، نسبة نجاح طلبته 99٪ طوال مسيرته بالمعهد لله الفضل. الأستاذ يشرح المادة بطريقة سهلة وواضحة ولديه دوسيات للمادة مصممة بشكل احترافي وجميل تحتوي جميع أفكار المادة وأسئلتها، وجهّز لكم الأستاذ بنك أسئلة يحتوي جميع الصيغ الوزارية ساعيًا لإيصالكم لأعلى العلامات.',
      image: '/images/teachers/youssef.jpeg',
      order: 1,
    },
    {
      name: 'ليث أبو الشيخ',
      subject: 'الرياضيات',
      grades: 'أول ثانوي,ثاني ثانوي',
      phone: '0779253953',
      whatsapp: '0779253953',
      facebook: 'https://www.facebook.com/share/1Dem4F7yoq/?mibextid=wwXIfr',
      instagram: 'https://www.instagram.com/laith_dawoud',
      bio: 'الأستاذ ليث ملك الأرقام والحسابات يتمتع بقدرة ومهارة في إيصال الفكرة وشرحها بشكل سلس وواضح وسهل ويؤسس طلبته جيدًا قبل الدخول في المادة، ويدرب طلبته على حل المسائل الصعبة ويتابعهم أول بأول، لديه دوسيات شاملة جميع أفكار وأمثلة المادة بشكل احترافي ويسعى جاهدًا لإيصال طلبته لأعلى العلامات.',
      image: '/images/teachers/laith.jpeg',
      order: 2,
    },
    {
      name: 'أحمد زياد',
      subject: 'اللغة الإنجليزية',
      grades: 'تاسع,عاشر,أول ثانوي,BETC',
      phone: '0789442487',
      whatsapp: '0789442487',
      facebook: 'https://www.facebook.com/share/1C5778APH6/?mibextid=wwXIfr',
      instagram: 'https://www.instagram.com/ahmadabudbaa',
      bio: 'يتمتع الأستاذ أحمد بخبرة طويلة ومهارة في إيصال المعلومات بطرق سهلة وواضحة، ويسهل المعلومة لطلبته ويتابعهم أول بأول بامتحانات وأوراق عمل مستمرة، ويسعى لجعل طلبته متفوقين وأصحاب خبرات ومهارات كبيرة.',
      image: '/images/teachers/ahmad.jpeg',
      order: 3,
    },
  ];

  for (const teacher of teachers) {
    const existing = await prisma.teacher.findFirst({ where: { name: teacher.name } });
    if (!existing) {
      await prisma.teacher.create({ data: teacher });
    }
  }
  console.log('✅ تم إدخال بيانات الأساتذة');

  console.log('🎉 انتهى إدخال البيانات بنجاح!');
  console.log('🔑 بيانات تسجيل الدخول: admin / qadoumi2025');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
