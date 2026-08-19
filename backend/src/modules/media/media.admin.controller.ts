import {
  Controller,
  HttpStatus,
  Post,
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
import { CreateMediaResponseDto } from '@/modules/media/dto/response/create-media-response.dto';
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
}
