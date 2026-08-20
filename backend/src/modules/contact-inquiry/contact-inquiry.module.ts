import { Module } from '@nestjs/common';

import { ContactInquiryAdminController } from '@/modules/contact-inquiry/contact-inquiry.admin.controller';
import { ContactInquiryService } from '@/modules/contact-inquiry/contact-inquiry.service';
import { ContactInquiryPrismaRepository } from '@/modules/contact-inquiry/repository/contact-inquiry-prisma.repository';
import { ContactInquiryRepository } from '@/modules/contact-inquiry/repository/contact-inquiry.repository';
import { DatabaseProviderModule } from '@/providers/database/database-provider.module';
import { SmtpProviderModule } from '@/providers/smtp/smtp-provider.module';

@Module({
  imports: [DatabaseProviderModule, SmtpProviderModule],
  controllers: [ContactInquiryAdminController],
  providers: [
    ContactInquiryService,
    { provide: ContactInquiryRepository, useClass: ContactInquiryPrismaRepository },
  ],
  exports: [ContactInquiryService],
})
export class ContactInquiryModule {}
