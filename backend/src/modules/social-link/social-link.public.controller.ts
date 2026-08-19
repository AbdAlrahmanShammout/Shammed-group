import { Controller, Get, HttpStatus, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GetSocialLinksRequestDto } from '@/modules/social-link/dto/request/get-social-links-request.dto';
import { GetSocialLinksResponseDto } from '@/modules/social-link/dto/response/get-social-links-response.dto';
import { SocialLinkResponseDto } from '@/modules/social-link/dto/response/social-link-response.dto';
import { SocialLinkService } from '@/modules/social-link/social-link.service';

@ApiTags('Public - Social Link')
@Controller('social-link')
export class SocialLinkPublicController {
  constructor(private readonly socialLinkService: SocialLinkService) {}

  @Get()
  @ApiOperation({ summary: 'List visible social links' })
  @ApiResponse({ status: HttpStatus.OK, type: GetSocialLinksResponseDto })
  async getSocialLinks(
    @Query() query: GetSocialLinksRequestDto,
  ): Promise<GetSocialLinksResponseDto> {
    const page = await this.socialLinkService.findPublicSocialLinks({
      limit: query.limit,
      offset: query.offset,
    });
    return new GetSocialLinksResponseDto(page);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a visible social link' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: HttpStatus.OK, type: SocialLinkResponseDto })
  async getSocialLink(@Param('id', ParseIntPipe) id: number): Promise<SocialLinkResponseDto> {
    const socialLink = await this.socialLinkService.getPublicSocialLinkById(id);
    return new SocialLinkResponseDto(socialLink);
  }
}
