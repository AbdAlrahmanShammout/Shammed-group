import { Controller, Get } from '@nestjs/common';

import { PublicRoute } from '@/common/decorators/route/public-route.decorator';
import { HealthService } from '@/health/health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('live')
  @PublicRoute()
  getLive(): { status: 'ok' } {
    return { status: 'ok' };
  }

  @Get('ready')
  @PublicRoute()
  async getReady(): Promise<{ status: 'ok' }> {
    await this.healthService.assertReady();
    return { status: 'ok' };
  }
}
