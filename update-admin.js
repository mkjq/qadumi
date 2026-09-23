const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function updateAdmin() {
  const passwordHash = await bcrypt.hash('AISAQ)&*%^TGHA', 12);
  
  // Try to find the existing admin
  const admin = await prisma.admin.findFirst();
  if (admin) {
    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        username: 'yousef',
        passwordHash: passwordHash
      }
    });
    console.log('Updated existing admin user.');
  } else {
    await prisma.admin.create({
      data: {
        username: 'yousef',
        passwordHash: passwordHash
      }
    });
    console.log('Created new admin user.');
  }
}

updateAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
