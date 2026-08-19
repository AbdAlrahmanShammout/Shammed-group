import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Role } from '@/authentication/enum/role.enum';
import { BaseMessageResponse } from '@/common/base/base-message-response.dto';
import { Roles } from '@/common/decorators/route/roles.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { CreateSocialLinkRequestDto } from '@/modules/social-link/dto/request/create-social-link-request.dto';
import { GetSocialLinksRequestDto } from '@/modules/social-link/dto/request/get-social-links-request.dto';
import { UpdateSocialLinkRequestDto } from '@/modules/social-link/dto/request/update-social-link-request.dto';
import { GetSocialLinksResponseDto } from '@/modules/social-link/dto/response/get-social-links-response.dto';
import { SocialLinkResponseDto } from '@/modules/social-link/dto/response/social-link-response.dto';
import { SocialLinkService } from '@/modules/social-link/social-link.service';

@ApiTags('Admin - Social Link')
@Controller('admin/social-link')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class SocialLinkAdminController {
  constructor(private readonly socialLinkService: SocialLinkService) {}

  @Post()
  @ApiOperation({ summary: 'Create a social link' })
  @ApiBody({ type: CreateSocialLinkRequestDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: SocialLinkResponseDto })
  async createSocialLink(
    @Body() requestDto: CreateSocialLinkRequestDto,
  ): Promise<SocialLinkResponseDto> {
    const socialLink = await this.socialLinkService.createSocialLink({
      platform: requestDto.platform,
      url: requestDto.url,
      isVisible: requestDto.isVisible,
      displayOrder: requestDto.displayOrder,
    });
    return new SocialLinkResponseDto(socialLink);
  }

  @Get()
  @ApiOperation({ summary: 'List all social links' })
  @ApiResponse({ status: HttpStatus.OK, type: GetSocialLinksResponseDto })
  async getSocialLinks(
    @Query() query: GetSocialLinksRequestDto,
  ): Promise<GetSocialLinksResponseDto> {
    const page = await this.socialLinkService.findSocialLinks({
      limit: query.limit,
      offset: query.offset,
    });
    return new GetSocialLinksResponseDto(page);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a social link' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: HttpStatus.OK, type: SocialLinkResponseDto })
  async getSocialLink(@Param('id', ParseIntPipe) id: number): Promise<SocialLinkResponseDto> {
    const socialLink = await this.socialLinkService.getSocialLinkById(id);
    return new SocialLinkResponseDto(socialLink);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a social link' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateSocialLinkRequestDto })
  @ApiResponse({ status: HttpStatus.OK, type: SocialLinkResponseDto })
  async updateSocialLink(
    @Param('id', ParseIntPipe) id: number,
    @Body() requestDto: UpdateSocialLinkRequestDto,
  ): Promise<SocialLinkResponseDto> {
    const socialLink = await this.socialLinkService.updateSocialLink({
      id,
      platform: requestDto.platform,
      url: requestDto.url,
      isVisible: requestDto.isVisible,
      displayOrder: requestDto.displayOrder,
    });
    return new SocialLinkResponseDto(socialLink);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a social link' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: HttpStatus.OK, type: BaseMessageResponse })
  async deleteSocialLink(@Param('id', ParseIntPipe) id: number): Promise<BaseMessageResponse> {
    await this.socialLinkService.deleteSocialLink(id);
    return new BaseMessageResponse({ message: 'Social link deleted', status: 'ok' });
  }
}
