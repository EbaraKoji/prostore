// import { PrismaClient } from '@prisma/client';
import { PrismaClient } from '@/lib/generated/prisma';
import { sampleData } from './sample-data';

export const main = async () => {
  const prisma = new PrismaClient();
  await prisma.product.deleteMany();

  await prisma.product.createMany({ data: sampleData.products });
  console.log('Successfuly seeded the Database!');
};

main();
