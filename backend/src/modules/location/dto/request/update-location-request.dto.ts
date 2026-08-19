import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class UpdateLocationPhoneItemDto {
  @ApiProperty({ description: 'Branch phone number', example: '+963 11 123 4567' })
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @ApiPropertyOptional({ description: 'Sort order among phones', example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;
}

export class UpdateLocationRequestDto {
  @ApiPropertyOptional({ description: 'Branch name', example: 'Damascus office' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({ description: 'Street address', example: 'Mazzeh, Damascus' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  address?: string;

  @ApiPropertyOptional({
    description: 'Google Maps URL',
    example: 'https://maps.google.com/?q=33.5138,36.2765',
    nullable: true,
  })
  @IsOptional()
  @IsUrl({ require_protocol: true })
  googleMapsUrl?: string | null;

  @ApiPropertyOptional({ description: 'Geographic latitude', example: 33.5138, nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number | null;

  @ApiPropertyOptional({ description: 'Geographic longitude', example: 36.2765, nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number | null;

  @ApiPropertyOptional({ description: 'Whether the location is public', example: true })
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @ApiPropertyOptional({ description: 'Sort order among locations', example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;

  @ApiPropertyOptional({ type: () => [UpdateLocationPhoneItemDto] })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UpdateLocationPhoneItemDto)
  phones?: UpdateLocationPhoneItemDto[];
}
