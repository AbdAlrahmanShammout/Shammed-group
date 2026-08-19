import { Test, TestingModule } from '@nestjs/testing';

import { DependencyFailureException } from '@/common/exceptions/dependency-failure.exception';
import { HealthService } from '@/health/health.service';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

describe('HealthService', () => {
  let healthService: HealthService;
  let prismaProviderService: { $queryRaw: jest.Mock };

  beforeEach(async () => {
    prismaProviderService = {
      $queryRaw: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        { provide: PrismaProviderService, useValue: prismaProviderService },
      ],
    }).compile();
    healthService = module.get(HealthService);
  });

  it('resolves when the database round trip succeeds', async () => {
    await expect(healthService.assertReady()).resolves.toBeUndefined();
  });

  it('throws DependencyFailureException when the database round trip fails', async () => {
    prismaProviderService.$queryRaw.mockRejectedValue(new Error('connection refused'));
    await expect(healthService.assertReady()).rejects.toBeInstanceOf(DependencyFailureException);
  });
});
