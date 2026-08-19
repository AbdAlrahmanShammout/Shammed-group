import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function executeSeed(): Promise<void> {
  try {
    await seedPlaceholder();
  } finally {
    await prisma.$disconnect();
  }
}

async function seedPlaceholder(): Promise<void> {
  return;
}

void executeSeed();
