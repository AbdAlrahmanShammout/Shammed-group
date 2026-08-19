import { Injectable } from '@nestjs/common';

import { BaseConfigService } from '@/config/base-config.service';

@Injectable()
export class StorageConfigService extends BaseConfigService {
  get rootPath(): string {
    return this.getValue<string>('storage.rootPath');
  }

  get maxFileBytes(): number {
    return this.getValue<number>('storage.maxFileBytes');
  }
}
