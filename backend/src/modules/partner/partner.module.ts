import { Module } from '@nestjs/common';

import { MediaModule } from '@/modules/media/media.module';
import { PartnerService } from '@/modules/partner/partner.service';
import { PartnerPrismaRepository } from '@/modules/partner/repository/partner-prisma.repository';
import { PartnerRepository } from '@/modules/partner/repository/partner.repository';
import { DatabaseProviderModule } from '@/providers/database/database-provider.module';

@Module({
  imports: [DatabaseProviderModule, MediaModule],
  providers: [PartnerService, { provide: PartnerRepository, useClass: PartnerPrismaRepository }],
  exports: [PartnerService],
})
export class PartnerModule {}
