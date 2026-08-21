import { Injectable } from '@nestjs/common';
import sharp from 'sharp';

import { DependencyFailureException } from '@/common/exceptions/dependency-failure.exception';
import { OUTPUT_IMAGE_MIME_TYPE } from '@/providers/storage/consts';

const MAX_UPLOAD_DIMENSION = 2000;
const WEBP_UPLOAD_QUALITY = 85;
const WEBP_RESIZE_QUALITY = 82;

export type ProcessedImage = {
  readonly buffer: Buffer;
  readonly mimeType: typeof OUTPUT_IMAGE_MIME_TYPE;
};

/**
 * Handles image transformations: resize, compress, and convert to WebP.
 * All uploaded images are normalised to WebP at 85 % quality, capped at
 * 2000 × 2000 px (preserving aspect ratio, never upscaling).
 * On-demand resize for serving also outputs WebP.
 */
@Injectable()
export class ImageProcessorService {
  /**
   * Convert an uploaded image buffer to an optimised WebP, resized to fit
   * within MAX_UPLOAD_DIMENSION in both dimensions.
   */
  async processUpload(buffer: Buffer): Promise<ProcessedImage> {
    try {
      const processed = await sharp(buffer)
        .rotate()
        .resize(MAX_UPLOAD_DIMENSION, MAX_UPLOAD_DIMENSION, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: WEBP_UPLOAD_QUALITY })
        .toBuffer();
      return { buffer: processed, mimeType: OUTPUT_IMAGE_MIME_TYPE };
    } catch {
      throw new DependencyFailureException({
        message: 'Failed to process the uploaded image',
        code: 'IMAGE_PROCESSING_FAILED',
        userFriendly: true,
      });
    }
  }

  /**
   * Resize a stored image buffer to the requested pixel width.
   * Height is adjusted proportionally. Never upscales.
   * Output is always WebP for optimal delivery.
   */
  async resizeToWidth(buffer: Buffer, width: number): Promise<Buffer> {
    try {
      return await sharp(buffer)
        .resize(width, undefined, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: WEBP_RESIZE_QUALITY })
        .toBuffer();
    } catch {
      throw new DependencyFailureException({
        message: 'Failed to resize the image',
        code: 'IMAGE_RESIZE_FAILED',
        userFriendly: true,
      });
    }
  }
}
