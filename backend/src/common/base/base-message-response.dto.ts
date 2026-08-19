import { ApiProperty } from '@nestjs/swagger';

export class BaseMessageResponse {
  @ApiProperty({ description: 'Human-readable outcome', example: 'Location deleted' })
  message: string;

  @ApiProperty({ description: 'Machine-readable outcome', example: 'ok' })
  status: string;

  constructor(data: { message: string; status: string }) {
    this.message = data.message;
    this.status = data.status;
  }
}
