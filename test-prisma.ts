import { prisma } from './src/lib/db';
async function test() {
  try {
    const user = await prisma.student.findFirst();
    console.log(user);
  } catch (e) {
    console.error(e);
  } finally {
    prisma.$disconnect();
  }
}
test();
