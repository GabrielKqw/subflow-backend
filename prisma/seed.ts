import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

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

  console.log('Admin user created:', admin.email);

  const plans = await Promise.all([
    prisma.plan.upsert({
      where: { id: '1' },
      update: {},
      create: {
        id: '1',
        name: 'Basic',
        description: 'Basic monthly plan',
        price: 29.90,
        durationDays: 30,
        features: ['Basic access', 'Email support', '10 GB storage'],
        isActive: true,
      },
    }),
    prisma.plan.upsert({
      where: { id: '2' },
      update: {},
      create: {
        id: '2',
        name: 'Premium',
        description: 'Premium monthly plan',
        price: 59.90,
        durationDays: 30,
        features: [
          'Full access',
          'Priority support',
          '100 GB storage',
          'Advanced features',
        ],
        isActive: true,
      },
    }),
    prisma.plan.upsert({
      where: { id: '3' },
      update: {},
      create: {
        id: '3',
        name: 'Enterprise',
        description: 'Enterprise annual plan',
        price: 599.90,
        durationDays: 365,
        features: [
          'Unlimited access',
          '24/7 support',
          'Unlimited storage',
          'Enterprise features',
          'Dedicated API',
        ],
        isActive: true,
      },
    }),
  ]);

  console.log('Plans created:', plans.length);

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

