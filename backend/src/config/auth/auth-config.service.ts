import { Injectable } from '@nestjs/common';

import { BaseConfigService } from '@/config/base-config.service';

@Injectable()
export class AuthConfigService extends BaseConfigService {
  get adminPassword(): string {
    return this.getValue<string>('auth.adminPassword');
  }
}
