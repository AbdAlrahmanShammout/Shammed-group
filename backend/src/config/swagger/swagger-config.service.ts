import { Injectable } from '@nestjs/common';

import { BaseConfigService } from '@/config/base-config.service';

@Injectable()
export class SwaggerConfigService extends BaseConfigService {
  get path(): string {
    return this.getValue<string>('swagger.path');
  }
}
