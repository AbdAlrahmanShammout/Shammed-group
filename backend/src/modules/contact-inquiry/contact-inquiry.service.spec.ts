import { Test, TestingModule } from '@nestjs/testing';

import { SmtpConfigService } from '@/config/smtp/smtp-config.service';
import { CONTACT_INQUIRY_EMAIL_SUBJECT_PREFIX } from '@/modules/contact-inquiry/consts';
import { ContactInquiryService } from '@/modules/contact-inquiry/contact-inquiry.service';
import { ContactInquiryEntity } from '@/modules/contact-inquiry/entity/contact-inquiry.entity';
import { EmailDeliveryStatus } from '@/modules/contact-inquiry/enum/general.enum';
import { ContactInquiryRepository } from '@/modules/contact-inquiry/repository/contact-inquiry.repository';
import { SmtpSendFailedException } from '@/providers/smtp/exceptions/smtp-send-failed.exception';
import { SmtpManagerService } from '@/providers/smtp/smtp-manager.service';

describe('ContactInquiryService', () => {
  const expectedPendingInquiry = new ContactInquiryEntity({
    id: 1,
    createdAt: new Date('2026-08-20T00:00:00.000Z'),
    updatedAt: new Date('2026-08-20T00:00:00.000Z'),
    fullName: 'Ada Lovelace',
    email: 'ada@example.com',
    phone: '+963 11 000 0000',
    subject: 'Product availability',
    message: 'Do you stock this product in Damascus?',
    emailDeliveryStatus: EmailDeliveryStatus.PENDING,
    emailDeliveredAt: null,
  });
  const expectedSentInquiry = new ContactInquiryEntity({
    ...expectedPendingInquiry,
    emailDeliveryStatus: EmailDeliveryStatus.SENT,
    emailDeliveredAt: new Date('2026-08-20T00:00:01.000Z'),
  });
  const expectedFailedInquiry = new ContactInquiryEntity({
    ...expectedPendingInquiry,
    emailDeliveryStatus: EmailDeliveryStatus.FAILED,
    emailDeliveredAt: null,
  });
  const inputInquiry = {
    fullName: 'Ada Lovelace',
    email: 'ada@example.com',
    phone: '+963 11 000 0000',
    subject: 'Product availability',
    message: 'Do you stock this product in Damascus?',
  };
  let contactInquiryService: ContactInquiryService;
  let contactInquiryRepository: {
    create: jest.Mock;
    findById: jest.Mock;
    update: jest.Mock;
  };
  let smtpManagerService: {
    sendMail: jest.Mock;
  };

  beforeEach(async () => {
    contactInquiryRepository = {
      create: jest.fn().mockResolvedValue(expectedPendingInquiry),
      findById: jest.fn(),
      update: jest.fn().mockResolvedValue(expectedSentInquiry),
    };
    smtpManagerService = {
      sendMail: jest.fn().mockResolvedValue(undefined),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactInquiryService,
        { provide: ContactInquiryRepository, useValue: contactInquiryRepository },
        { provide: SmtpManagerService, useValue: smtpManagerService },
        {
          provide: SmtpConfigService,
          useValue: {
            from: 'noreply@shammed-group.com',
            contactEmail: 'info@shammed-group.com',
          },
        },
      ],
    }).compile();
    contactInquiryService = module.get(ContactInquiryService);
  });

  it('persists the inquiry before sending mail and marks delivery as sent', async () => {
    const actual = await contactInquiryService.createContactInquiry(inputInquiry);
    expect(contactInquiryRepository.create).toHaveBeenCalledWith({
      fullName: inputInquiry.fullName,
      email: inputInquiry.email,
      phone: inputInquiry.phone,
      subject: inputInquiry.subject,
      message: inputInquiry.message,
      emailDeliveryStatus: EmailDeliveryStatus.PENDING,
    });
    expect(smtpManagerService.sendMail).toHaveBeenCalledWith({
      to: 'info@shammed-group.com',
      from: 'noreply@shammed-group.com',
      replyTo: inputInquiry.email,
      subject: `${CONTACT_INQUIRY_EMAIL_SUBJECT_PREFIX}${inputInquiry.subject}`,
      text: expect.stringContaining(inputInquiry.message),
    });
    expect(contactInquiryRepository.update).toHaveBeenCalledWith({
      id: expectedPendingInquiry.id,
      emailDeliveryStatus: EmailDeliveryStatus.SENT,
      emailDeliveredAt: expect.any(Date),
    });
    expect(actual).toBe(expectedSentInquiry);
  });

  it('persists a failed delivery status and does not throw when SMTP fails', async () => {
    smtpManagerService.sendMail.mockRejectedValue(new SmtpSendFailedException());
    contactInquiryRepository.update.mockResolvedValue(expectedFailedInquiry);
    const actual = await contactInquiryService.createContactInquiry(inputInquiry);
    expect(actual).toBe(expectedFailedInquiry);
    expect(contactInquiryRepository.update).toHaveBeenCalledWith({
      id: expectedPendingInquiry.id,
      emailDeliveryStatus: EmailDeliveryStatus.FAILED,
    });
  });

  it('stores a missing phone as null', async () => {
    await contactInquiryService.createContactInquiry({
      fullName: inputInquiry.fullName,
      email: inputInquiry.email,
      subject: inputInquiry.subject,
      message: inputInquiry.message,
    });
    expect(contactInquiryRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ phone: null }),
    );
  });
});
