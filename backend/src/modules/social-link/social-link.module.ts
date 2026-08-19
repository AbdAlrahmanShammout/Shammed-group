import { Module } from '@nestjs/common';

import { SocialLinkPrismaRepository } from '@/modules/social-link/repository/social-link-prisma.repository';
import { SocialLinkRepository } from '@/modules/social-link/repository/social-link.repository';
import { SocialLinkService } from '@/modules/social-link/social-link.service';
import { DatabaseProviderModule } from '@/providers/database/database-provider.module';

@Module({
  imports: [DatabaseProviderModule],
  providers: [
    SocialLinkService,
    { provide: SocialLinkRepository, useClass: SocialLinkPrismaRepository },
  ],
  exports: [SocialLinkService],
})
export class SocialLinkModule {}
