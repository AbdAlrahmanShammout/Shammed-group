import { Module } from '@nestjs/common';

import { SmtpManagerService } from '@/providers/smtp/smtp-manager.service';

@Module({
  providers: [SmtpManagerService],
  exports: [SmtpManagerService],
})
export class SmtpProviderModule {}
