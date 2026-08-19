import { Body, Controller, Get, HttpStatus, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Role } from '@/authentication/enum/role.enum';
import { Roles } from '@/common/decorators/route/roles.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { CreateHomePageRequestDto } from '@/modules/home-page/dto/request/create-home-page-request.dto';
import { UpdateHomePageRequestDto } from '@/modules/home-page/dto/request/update-home-page-request.dto';
import { HomePageResponseDto } from '@/modules/home-page/dto/response/home-page-response.dto';
import { HomePageService } from '@/modules/home-page/home-page.service';

@ApiTags('Admin - Home Page')
@Controller('admin/home-page')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class HomePageAdminController {
  constructor(private readonly homePageService: HomePageService) {}

  @Post()
  @ApiOperation({ summary: 'Create the singleton home page record' })
  @ApiBody({ type: CreateHomePageRequestDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: HomePageResponseDto })
  async createHomePage(@Body() requestDto: CreateHomePageRequestDto): Promise<HomePageResponseDto> {
    const homePage = await this.homePageService.createHomePage({
      heroTitle: requestDto.heroTitle,
      heroDescription: requestDto.heroDescription,
      heroImageMediaId: requestDto.heroImageMediaId,
      primaryCtaText: requestDto.primaryCtaText,
      primaryCtaUrl: requestDto.primaryCtaUrl,
      secondaryCtaText: requestDto.secondaryCtaText,
      secondaryCtaUrl: requestDto.secondaryCtaUrl,
      aboutPreviewTitle: requestDto.aboutPreviewTitle,
      aboutPreviewDescription: requestDto.aboutPreviewDescription,
      aboutPreviewImageMediaId: requestDto.aboutPreviewImageMediaId,
      aboutPreviewCtaText: requestDto.aboutPreviewCtaText,
      aboutPreviewCtaUrl: requestDto.aboutPreviewCtaUrl,
      partnersSectionTitle: requestDto.partnersSectionTitle,
      partnersSectionDescription: requestDto.partnersSectionDescription,
      productsSectionTitle: requestDto.productsSectionTitle,
      productsSectionDescription: requestDto.productsSectionDescription,
      servicesSectionTitle: requestDto.servicesSectionTitle,
      servicesSectionDescription: requestDto.servicesSectionDescription,
      whyTitle: requestDto.whyTitle,
      whyDescription: requestDto.whyDescription,
      whyImageMediaId: requestDto.whyImageMediaId,
      contactSectionTitle: requestDto.contactSectionTitle,
      contactSectionDescription: requestDto.contactSectionDescription,
    });
    return new HomePageResponseDto(homePage);
  }

  @Get()
  @ApiOperation({ summary: 'Get the singleton home page CMS record' })
  @ApiResponse({ status: HttpStatus.OK, type: HomePageResponseDto })
  async getHomePage(): Promise<HomePageResponseDto> {
    const homePage = await this.homePageService.getHomePage();
    return new HomePageResponseDto(homePage);
  }

  @Patch()
  @ApiOperation({ summary: 'Update the singleton home page record' })
  @ApiBody({ type: UpdateHomePageRequestDto })
  @ApiResponse({ status: HttpStatus.OK, type: HomePageResponseDto })
  async updateHomePage(@Body() requestDto: UpdateHomePageRequestDto): Promise<HomePageResponseDto> {
    const homePage = await this.homePageService.updateHomePage({
      heroTitle: requestDto.heroTitle,
      heroDescription: requestDto.heroDescription,
      heroImageMediaId: requestDto.heroImageMediaId,
      primaryCtaText: requestDto.primaryCtaText,
      primaryCtaUrl: requestDto.primaryCtaUrl,
      secondaryCtaText: requestDto.secondaryCtaText,
      secondaryCtaUrl: requestDto.secondaryCtaUrl,
      aboutPreviewTitle: requestDto.aboutPreviewTitle,
      aboutPreviewDescription: requestDto.aboutPreviewDescription,
      aboutPreviewImageMediaId: requestDto.aboutPreviewImageMediaId,
      aboutPreviewCtaText: requestDto.aboutPreviewCtaText,
      aboutPreviewCtaUrl: requestDto.aboutPreviewCtaUrl,
      partnersSectionTitle: requestDto.partnersSectionTitle,
      partnersSectionDescription: requestDto.partnersSectionDescription,
      productsSectionTitle: requestDto.productsSectionTitle,
      productsSectionDescription: requestDto.productsSectionDescription,
      servicesSectionTitle: requestDto.servicesSectionTitle,
      servicesSectionDescription: requestDto.servicesSectionDescription,
      whyTitle: requestDto.whyTitle,
      whyDescription: requestDto.whyDescription,
      whyImageMediaId: requestDto.whyImageMediaId,
      contactSectionTitle: requestDto.contactSectionTitle,
      contactSectionDescription: requestDto.contactSectionDescription,
    });
    return new HomePageResponseDto(homePage);
  }
}
