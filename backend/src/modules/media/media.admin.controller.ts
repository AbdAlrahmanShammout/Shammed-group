import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Role } from '@/authentication/enum/role.enum';
import { Roles } from '@/common/decorators/route/roles.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { GetMediaListRequestDto } from '@/modules/media/dto/request/get-media-list-request.dto';
import { CreateMediaResponseDto } from '@/modules/media/dto/response/create-media-response.dto';
import { GetMediaListResponseDto } from '@/modules/media/dto/response/get-media-list-response.dto';
import { MediaFileRequiredException } from '@/modules/media/exceptions/media-file-required.exception';
import { MediaService } from '@/modules/media/media.service';
import type { UploadedMediaFile } from '@/modules/media/types/uploaded-media-file.type';

@ApiTags('Admin - Media')
@Controller('admin/media')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class MediaAdminController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  @ApiOperation({ summary: 'List all media records, newest first' })
  @ApiResponse({ status: HttpStatus.OK, type: GetMediaListResponseDto })
  async getMediaList(@Query() query: GetMediaListRequestDto): Promise<GetMediaListResponseDto> {
    const limit = query.limit ?? 50;
    const offset = query.offset ?? 0;
    const page = await this.mediaService.getMediaList(limit, offset);
    return new GetMediaListResponseDto(page.entities, page.total);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload an image for CMS and catalog use' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.CREATED, type: CreateMediaResponseDto })
  async createMedia(
    @UploadedFile() file: UploadedMediaFile | undefined,
  ): Promise<CreateMediaResponseDto> {
    if (!file) {
      throw new MediaFileRequiredException();
    }
    const media = await this.mediaService.createMedia({
      originalFileName: file.originalname,
      mimeType: file.mimetype,
      content: file.buffer,
    });
    return new CreateMediaResponseDto(media);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a media record and its stored file' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Deleted' })
  async deleteMedia(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.mediaService.deleteMedia(id);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete all unreferenced (orphaned) media records and their files' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Orphaned media purged' })
  async deleteUnreferencedMedia(): Promise<void> {
    await this.mediaService.deleteUnreferencedMedia();
  }
}
