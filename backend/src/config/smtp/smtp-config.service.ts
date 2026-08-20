import { Injectable } from '@nestjs/common';

import { BaseConfigService } from '@/config/base-config.service';

@Injectable()
export class SmtpConfigService extends BaseConfigService {
  get host(): string {
    return this.getValue<string>('smtp.host');
  }

  get port(): number {
    return this.getValue<number>('smtp.port');
  }

  get user(): string {
    return this.getValue<string>('smtp.user');
  }

  get password(): string {
    return this.getValue<string>('smtp.password');
  }

  get secure(): boolean {
    return this.getValue<boolean>('smtp.secure');
  }

  get from(): string {
    return this.getValue<string>('smtp.from');
  }

  get contactEmail(): string {
    return this.getValue<string>('smtp.contactEmail');
  }
}
