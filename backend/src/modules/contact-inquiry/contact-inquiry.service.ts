import { Injectable, Logger } from '@nestjs/common';

import { SmtpConfigService } from '@/config/smtp/smtp-config.service';
import { CONTACT_INQUIRY_EMAIL_SUBJECT_PREFIX } from '@/modules/contact-inquiry/consts';
import { CreateContactInquiryServiceInput } from '@/modules/contact-inquiry/defs/contact-inquiry-service.defs';
import { ContactInquiryEntity } from '@/modules/contact-inquiry/entity/contact-inquiry.entity';
import { EmailDeliveryStatus } from '@/modules/contact-inquiry/enum/general.enum';
import { ContactInquiryRepository } from '@/modules/contact-inquiry/repository/contact-inquiry.repository';
import { SmtpManagerService } from '@/providers/smtp/smtp-manager.service';

@Injectable()
export class ContactInquiryService {
  private readonly logger = new Logger(ContactInquiryService.name);

  constructor(
    private readonly contactInquiryRepository: ContactInquiryRepository,
    private readonly smtpManagerService: SmtpManagerService,
    private readonly smtpConfigService: SmtpConfigService,
  ) {}

  async createContactInquiry(
    input: CreateContactInquiryServiceInput,
  ): Promise<ContactInquiryEntity> {
    const inquiry = await this.contactInquiryRepository.create({
      fullName: input.fullName,
      email: input.email,
      phone: input.phone ?? null,
      subject: input.subject,
      message: input.message,
      emailDeliveryStatus: EmailDeliveryStatus.PENDING,
    });
    try {
      await this.smtpManagerService.sendMail({
        to: this.smtpConfigService.contactEmail,
        from: this.smtpConfigService.from,
        replyTo: input.email,
        subject: `${CONTACT_INQUIRY_EMAIL_SUBJECT_PREFIX}${input.subject}`,
        text: this.composeNotificationText(input, inquiry.createdAt),
      });
    } catch (error) {
      this.logger.error(
        `Failed to deliver contact inquiry ${inquiry.id}`,
        error instanceof Error ? error.stack : undefined,
      );
      return this.contactInquiryRepository.update({
        id: inquiry.id,
        emailDeliveryStatus: EmailDeliveryStatus.FAILED,
      });
    }
    return this.contactInquiryRepository.update({
      id: inquiry.id,
      emailDeliveryStatus: EmailDeliveryStatus.SENT,
      emailDeliveredAt: new Date(),
    });
  }

  private composeNotificationText(
    input: CreateContactInquiryServiceInput,
    submittedAt: Date,
  ): string {
    const lines: string[] = [`Name: ${input.fullName}`, `Email: ${input.email}`];
    if (input.phone) {
      lines.push(`Phone: ${input.phone}`);
    }
    lines.push(`Subject: ${input.subject}`);
    lines.push(`Submitted at: ${submittedAt.toISOString()}`);
    lines.push('');
    lines.push(input.message);
    return lines.join('\n');
  }
}
