const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  try {
    const admin = await prisma.user.create({
      data: {
        email: 'admin@bookshop.com',
        password: hashedPassword,
        role: 'admin',
      },
    });
    console.log('✅ Адміна створено! Email: admin@bookshop.com, Пароль: admin123');
  } catch (error) {
    console.log('Адмін вже існує або помилка:', error.message);
  }
}

main().finally(() => prisma.$disconnect());