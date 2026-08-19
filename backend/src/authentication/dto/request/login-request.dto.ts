import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({ description: 'Admin password', example: 'replace-me' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
