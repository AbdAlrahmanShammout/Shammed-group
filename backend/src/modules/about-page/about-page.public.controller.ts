import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AboutPageResponseDto } from '@/modules/about-page/dto/response/about-page-response.dto';
import { AboutPageService } from '@/modules/about-page/about-page.service';

@ApiTags('Public - About Page')
@Controller('about-page')
export class AboutPagePublicController {
  constructor(private readonly aboutPageService: AboutPageService) {}

  @Get()
  @ApiOperation({ summary: 'Get public about page CMS fields' })
  @ApiResponse({ status: HttpStatus.OK, type: AboutPageResponseDto })
  async getAboutPage(): Promise<AboutPageResponseDto> {
    const aboutPage = await this.aboutPageService.getAboutPage();
    return new AboutPageResponseDto(aboutPage);
  }
}
