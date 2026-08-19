import { Injectable } from '@nestjs/common';

import { BaseConfigService } from '@/config/base-config.service';

@Injectable()
export class JwtConfigService extends BaseConfigService {
  get secretKey(): string {
    return this.getValue<string>('token.access.secretKey');
  }

  get expiresIn(): string {
    return this.getValue<string>('token.access.expiresIn');
  }
}
