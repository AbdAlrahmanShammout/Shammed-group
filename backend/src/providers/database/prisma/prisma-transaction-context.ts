import { Prisma } from '@prisma/client';

import { TransactionContext } from '@/common/base/transaction-context';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

export class PrismaTransactionContext extends TransactionContext {
  constructor(readonly client: Prisma.TransactionClient) {
    super();
  }
}

export function resolvePrismaClient(
  prismaProviderService: PrismaProviderService,
  context?: TransactionContext,
): PrismaProviderService | Prisma.TransactionClient {
  if (!context) {
    return prismaProviderService;
  }
  if (context instanceof PrismaTransactionContext) {
    return context.client;
  }
  throw new Error('Unsupported transaction context');
}
