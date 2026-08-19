import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GetPublicHomePageResponseDto } from '@/modules/home-page/dto/response/get-public-home-page-response.dto';
import { HomePageService } from '@/modules/home-page/home-page.service';

@ApiTags('Public - Home Page')
@Controller('home-page')
export class HomePagePublicController {
  constructor(private readonly homePageService: HomePageService) {}

  @Get()
  @ApiOperation({ summary: 'Get public home CMS fields with visible catalog previews' })
  @ApiResponse({ status: HttpStatus.OK, type: GetPublicHomePageResponseDto })
  async getHomePage(): Promise<GetPublicHomePageResponseDto> {
    const readModel = await this.homePageService.getPublicHomePage();
    return new GetPublicHomePageResponseDto(readModel);
  }
}
