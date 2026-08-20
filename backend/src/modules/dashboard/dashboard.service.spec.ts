import { Test, TestingModule } from '@nestjs/testing';

import { DashboardService } from '@/modules/dashboard/dashboard.service';
import { DashboardStatistics } from '@/modules/dashboard/defs/dashboard-read-model.defs';
import { DashboardReadModelRepository } from '@/modules/dashboard/repository/dashboard-read-model.repository';

describe('DashboardService', () => {
  const expectedStatistics: DashboardStatistics = {
    products: { total: 3, visible: 2, hidden: 1 },
    categories: { total: 2, visible: 1, hidden: 1 },
    partners: { total: 4, visible: 3, hidden: 1 },
    services: { total: 5, visible: 4, hidden: 1 },
  };
  let dashboardService: DashboardService;
  let dashboardReadModelRepository: {
    getCatalogCounts: jest.Mock;
  };

  beforeEach(async () => {
    dashboardReadModelRepository = {
      getCatalogCounts: jest.fn().mockResolvedValue(expectedStatistics),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: DashboardReadModelRepository, useValue: dashboardReadModelRepository },
      ],
    }).compile();
    dashboardService = module.get(DashboardService);
  });

  it('returns named catalog count projections from the read-model repository', async () => {
    const actual = await dashboardService.getDashboardStatistics();
    expect(actual).toBe(expectedStatistics);
    expect(dashboardReadModelRepository.getCatalogCounts).toHaveBeenCalledTimes(1);
  });
});
