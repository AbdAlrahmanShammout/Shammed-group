import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Role } from '@/authentication/enum/role.enum';
import { Roles } from '@/common/decorators/route/roles.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { DashboardService } from '@/modules/dashboard/dashboard.service';
import { DashboardStatisticsResponseDto } from '@/modules/dashboard/dto/response/dashboard-statistics-response.dto';

@ApiTags('Admin - Dashboard')
@Controller('admin/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class DashboardAdminController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({ summary: 'Get catalog content statistics for the admin dashboard' })
  @ApiResponse({ status: HttpStatus.OK, type: DashboardStatisticsResponseDto })
  async getDashboardStatistics(): Promise<DashboardStatisticsResponseDto> {
    const statistics = await this.dashboardService.getDashboardStatistics();
    return new DashboardStatisticsResponseDto(statistics);
  }
}
