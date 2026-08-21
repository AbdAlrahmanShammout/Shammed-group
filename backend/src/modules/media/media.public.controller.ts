import {
  Controller,
  Get,
  Header,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
  StreamableFile,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { MediaService } from '@/modules/media/media.service';

const MAX_SERVE_WIDTH = 2000;
const MIN_SERVE_WIDTH = 16;

@ApiTags('Public - Media')
@Controller('media')
export class MediaPublicController {
  constructor(private readonly mediaService: MediaService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Download a public media file by id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiQuery({ name: 'w', required: false, type: Number, description: 'Resize to this pixel width' })
  @ApiProduces('image/webp', 'image/jpeg', 'image/png')
  @ApiResponse({ status: HttpStatus.OK, description: 'Binary image content' })
  @Header('Cache-Control', 'public, max-age=31536000, immutable')
  @Header('Cross-Origin-Resource-Policy', 'cross-origin')
  async getMediaFile(
    @Param('id', ParseIntPipe) id: number,
    @Query('w') w?: string,
  ): Promise<StreamableFile> {
    const width = this.parseWidth(w);
    const mediaFile = await this.mediaService.getMediaFileContent(id, width);
    return new StreamableFile(mediaFile.content, {
      type: mediaFile.mimeType,
      disposition: 'inline',
    });
  }

  private parseWidth(w: string | undefined): number | undefined {
    if (w === undefined) return undefined;
    const parsed = parseInt(w, 10);
    if (isNaN(parsed) || parsed < MIN_SERVE_WIDTH || parsed > MAX_SERVE_WIDTH) return undefined;
    return parsed;
  }
}
