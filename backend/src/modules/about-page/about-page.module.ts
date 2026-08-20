import { Module } from '@nestjs/common';

import { AboutPageService } from '@/modules/about-page/about-page.service';
import { AboutPagePrismaRepository } from '@/modules/about-page/repository/about-page-prisma.repository';
import { AboutPageRepository } from '@/modules/about-page/repository/about-page.repository';
import { MediaModule } from '@/modules/media/media.module';
import { DatabaseProviderModule } from '@/providers/database/database-provider.module';

@Module({
  imports: [DatabaseProviderModule, MediaModule],
  providers: [
    AboutPageService,
    { provide: AboutPageRepository, useClass: AboutPagePrismaRepository },
  ],
  exports: [AboutPageService],
})
export class AboutPageModule {}
