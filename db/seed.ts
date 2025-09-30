import { PrismaClient } from '@/lib/generated/prisma';
import { sampleData } from './sample-data';

export const main = async () => {
  const prisma = new PrismaClient();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();

  await prisma.product.createMany({ data: sampleData.products });
  await prisma.user.createMany({ data: sampleData.users });
  console.log('Successfuly seeded the Database!');
};

main();
