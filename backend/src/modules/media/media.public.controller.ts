import { Controller, Get, Header, HttpStatus, Param, ParseIntPipe, StreamableFile } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';

import { MediaService } from '@/modules/media/media.service';

@ApiTags('Public - Media')
@Controller('media')
export class MediaPublicController {
  constructor(private readonly mediaService: MediaService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Download a public media file by id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiProduces('image/jpeg', 'image/png', 'image/webp')
  @ApiResponse({ status: HttpStatus.OK, description: 'Binary image content' })
  @Header('Cache-Control', 'public, max-age=86400')
  @Header('Cross-Origin-Resource-Policy', 'cross-origin')
  async getMediaFile(@Param('id', ParseIntPipe) id: number): Promise<StreamableFile> {
    const mediaFile = await this.mediaService.getMediaFileContent(id);
    return new StreamableFile(mediaFile.content, {
      type: mediaFile.mimeType,
      disposition: 'inline',
    });
  }
}
