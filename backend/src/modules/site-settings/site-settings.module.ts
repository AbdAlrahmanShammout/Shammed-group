import { Module } from '@nestjs/common';

import { MediaModule } from '@/modules/media/media.module';
import { SiteSettingsPrismaRepository } from '@/modules/site-settings/repository/site-settings-prisma.repository';
import { SiteSettingsRepository } from '@/modules/site-settings/repository/site-settings.repository';
import { SiteSettingsService } from '@/modules/site-settings/site-settings.service';
import { DatabaseProviderModule } from '@/providers/database/database-provider.module';

@Module({
  imports: [DatabaseProviderModule, MediaModule],
  providers: [
    SiteSettingsService,
    { provide: SiteSettingsRepository, useClass: SiteSettingsPrismaRepository },
  ],
  exports: [SiteSettingsService],
})
export class SiteSettingsModule {}
