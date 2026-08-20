import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

import {
  CONTACT_INQUIRY_EMAIL_MAX_LENGTH,
  CONTACT_INQUIRY_FULL_NAME_MAX_LENGTH,
  CONTACT_INQUIRY_MESSAGE_MAX_LENGTH,
  CONTACT_INQUIRY_PHONE_MAX_LENGTH,
  CONTACT_INQUIRY_SUBJECT_MAX_LENGTH,
} from '@/modules/contact-inquiry/consts';

export class CreateContactInquiryRequestDto {
  @ApiProperty({ description: 'Submitter full name', example: 'Ada Lovelace' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(CONTACT_INQUIRY_FULL_NAME_MAX_LENGTH)
  fullName!: string;

  @ApiProperty({ description: 'Submitter email', example: 'ada@example.com' })
  @IsEmail()
  @MaxLength(CONTACT_INQUIRY_EMAIL_MAX_LENGTH)
  email!: string;

  @ApiPropertyOptional({ description: 'Submitter phone', example: '+963 11 000 0000' })
  @IsOptional()
  @IsString()
  @MaxLength(CONTACT_INQUIRY_PHONE_MAX_LENGTH)
  phone?: string;

  @ApiProperty({ description: 'Inquiry subject', example: 'Product availability' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(CONTACT_INQUIRY_SUBJECT_MAX_LENGTH)
  subject!: string;

  @ApiProperty({
    description: 'Inquiry message',
    example: 'Do you stock this product in Damascus?',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(CONTACT_INQUIRY_MESSAGE_MAX_LENGTH)
  message!: string;
}
