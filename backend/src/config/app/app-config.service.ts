import { Injectable } from '@nestjs/common';

import { BaseConfigService } from '@/config/base-config.service';
import { EnvironmentKind } from '@/config/environment';

@Injectable()
export class AppConfigService extends BaseConfigService {
  get env(): EnvironmentKind {
    return this.getValue<EnvironmentKind>('app.env');
  }

  get port(): number {
    return this.getValue<number>('app.port');
  }

  get url(): string {
    return this.getValue<string>('app.url');
  }

  get allowedOrigins(): string[] {
    return this.getValue<string[]>('app.allowedOrigins');
  }

  get isDevelopmentLike(): boolean {
    return this.env === EnvironmentKind.DEVELOPMENT || this.env === EnvironmentKind.TEST;
  }

  get isDocumentationEnabled(): boolean {
    return this.env === EnvironmentKind.DEVELOPMENT || this.env === EnvironmentKind.STAGING;
  }
}
