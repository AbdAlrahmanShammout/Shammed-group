import { Injectable } from '@nestjs/common';

import { TransactionRunner } from '@/common/base/transaction-runner';
import { TransactionContext } from '@/common/base/transaction-context';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { PrismaTransactionContext } from '@/providers/database/prisma/prisma-transaction-context';

@Injectable()
export class PrismaTransactionRunner implements TransactionRunner {
  constructor(private readonly prismaProviderService: PrismaProviderService) {}

  async run<T>(work: (context: TransactionContext) => Promise<T>): Promise<T> {
    return this.prismaProviderService.$transaction(async (tx) => {
      return work(new PrismaTransactionContext(tx));
    });
  }
}
