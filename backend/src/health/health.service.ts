import { Injectable, Logger } from '@nestjs/common';

import { READY_CHECK_TIMEOUT_MS } from '@/common/constants/policy.constants';
import { DependencyFailureException } from '@/common/exceptions/dependency-failure.exception';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(private readonly prismaProviderService: PrismaProviderService) {}

  async assertReady(): Promise<void> {
    try {
      await this.withTimeout(
        this.prismaProviderService.$queryRaw`SELECT 1`,
        READY_CHECK_TIMEOUT_MS,
      );
    } catch (error: unknown) {
      this.logger.error('Readiness check failed', error instanceof Error ? error.stack : undefined);
      throw new DependencyFailureException({
        message: 'A required dependency is unavailable',
        code: 'DEPENDENCY_UNAVAILABLE',
        userFriendly: false,
      });
    }
  }

  private async withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    let timeoutHandle: NodeJS.Timeout | undefined;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutHandle = setTimeout(() => {
        reject(new Error('Readiness check timed out'));
      }, timeoutMs);
    });
    try {
      return await Promise.race([promise, timeoutPromise]);
    } finally {
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }
    }
  }
}
