import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  const hashedPassword = await bcrypt.hash('Admin@123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created:', admin.email);

  const plans = await Promise.all([
    prisma.plan.upsert({
      where: { id: '1' },
      update: {},
      create: {
        id: '1',
        name: 'Básico',
        description: 'Plano básico mensal',
        price: 29.90,
        durationDays: 30,
        features: ['Acesso básico', 'Suporte por email', '10 GB de armazenamento'],
        isActive: true,
      },
    }),
    prisma.plan.upsert({
      where: { id: '2' },
      update: {},
      create: {
        id: '2',
        name: 'Premium',
        description: 'Plano premium mensal',
        price: 59.90,
        durationDays: 30,
        features: [
          'Acesso completo',
          'Suporte prioritário',
          '100 GB de armazenamento',
          'Recursos avançados',
        ],
        isActive: true,
      },
    }),
    prisma.plan.upsert({
      where: { id: '3' },
      update: {},
      create: {
        id: '3',
        name: 'Empresarial',
        description: 'Plano empresarial anual',
        price: 599.90,
        durationDays: 365,
        features: [
          'Acesso ilimitado',
          'Suporte 24/7',
          'Armazenamento ilimitado',
          'Recursos empresariais',
          'API dedicada',
        ],
        isActive: true,
      },
    }),
  ]);

  console.log('✅ Plans created:', plans.length);

  console.log('🎉 Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

