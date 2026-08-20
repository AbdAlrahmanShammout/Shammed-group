import { Body, Controller, Get, HttpStatus, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Role } from '@/authentication/enum/role.enum';
import { Roles } from '@/common/decorators/route/roles.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { CreateAboutPageRequestDto } from '@/modules/about-page/dto/request/create-about-page-request.dto';
import { UpdateAboutPageRequestDto } from '@/modules/about-page/dto/request/update-about-page-request.dto';
import { AboutPageResponseDto } from '@/modules/about-page/dto/response/about-page-response.dto';
import { AboutPageService } from '@/modules/about-page/about-page.service';

@ApiTags('Admin - About Page')
@Controller('admin/about-page')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class AboutPageAdminController {
  constructor(private readonly aboutPageService: AboutPageService) {}

  @Post()
  @ApiOperation({ summary: 'Create the singleton about page record' })
  @ApiBody({ type: CreateAboutPageRequestDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: AboutPageResponseDto })
  async createAboutPage(
    @Body() requestDto: CreateAboutPageRequestDto,
  ): Promise<AboutPageResponseDto> {
    const aboutPage = await this.aboutPageService.createAboutPage({
      overview: requestDto.overview,
      overviewImageMediaId: requestDto.overviewImageMediaId,
      vision: requestDto.vision,
      mission: requestDto.mission,
      values: requestDto.values,
      capabilities: requestDto.capabilities,
    });
    return new AboutPageResponseDto(aboutPage);
  }

  @Get()
  @ApiOperation({ summary: 'Get the singleton about page CMS record' })
  @ApiResponse({ status: HttpStatus.OK, type: AboutPageResponseDto })
  async getAboutPage(): Promise<AboutPageResponseDto> {
    const aboutPage = await this.aboutPageService.getAboutPage();
    return new AboutPageResponseDto(aboutPage);
  }

  @Patch()
  @ApiOperation({ summary: 'Update the singleton about page record' })
  @ApiBody({ type: UpdateAboutPageRequestDto })
  @ApiResponse({ status: HttpStatus.OK, type: AboutPageResponseDto })
  async updateAboutPage(
    @Body() requestDto: UpdateAboutPageRequestDto,
  ): Promise<AboutPageResponseDto> {
    const aboutPage = await this.aboutPageService.updateAboutPage({
      overview: requestDto.overview,
      overviewImageMediaId: requestDto.overviewImageMediaId,
      vision: requestDto.vision,
      mission: requestDto.mission,
      values: requestDto.values,
      capabilities: requestDto.capabilities,
    });
    return new AboutPageResponseDto(aboutPage);
  }
}
