import { ApiProperty } from '@nestjs/swagger';

import { BaseModelResponseDto } from '@/common/base/base-model-response.dto';
import { MediaEntity } from '@/modules/media/entity/media.entity';

export class MediaResponse extends BaseModelResponseDto {
  @ApiProperty({ description: 'Original uploaded file name', example: 'logo.png' })
  originalFileName: string;

  @ApiProperty({ description: 'Image MIME type', example: 'image/png' })
  mimeType: string;

  @ApiProperty({ description: 'File size in bytes', example: 2048 })
  byteSize: number;

  constructor(data: MediaEntity) {
    super(data);
    this.originalFileName = data.originalFileName;
    this.mimeType = data.mimeType;
    this.byteSize = data.byteSize;
  }
}
