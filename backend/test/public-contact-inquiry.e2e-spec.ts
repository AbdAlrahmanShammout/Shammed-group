import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { EmailDeliveryStatus } from '@/modules/contact-inquiry/enum/general.enum';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { SmtpSendFailedException } from '@/providers/smtp/exceptions/smtp-send-failed.exception';
import { SmtpManagerService } from '@/providers/smtp/smtp-manager.service';

function buildCreateInquiryBody(email: string): Record<string, string> {
  return {
    fullName: 'Ada Lovelace',
    email,
    phone: '+963 11 000 0000',
    subject: 'Product availability',
    message: 'Do you stock this product in Damascus?',
  };
}

describe('Public contact inquiry (e2e)', () => {
  let app: INestApplication;
  let prismaProviderService: PrismaProviderService;
  const smtpManager = {
    sendMail: jest.fn().mockResolvedValue(undefined),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(SmtpManagerService)
      .useValue(smtpManager)
      .compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prismaProviderService = app.get(PrismaProviderService);
    await prismaProviderService.contactInquiry.deleteMany();
  });

  afterAll(async () => {
    await prismaProviderService.contactInquiry.deleteMany();
    await app.close();
  });

  beforeEach(() => {
    smtpManager.sendMail.mockReset();
    smtpManager.sendMail.mockResolvedValue(undefined);
  });

  it('rejects an invalid email', async () => {
    const actual = await request(app.getHttpServer())
      .post('/contact-inquiry')
      .send(buildCreateInquiryBody('not-an-email'));
    expect(actual.status).toBe(422);
    expect(actual.body).toEqual(
      expect.objectContaining({
        code: 'BAD_USER_INPUT',
        statusCode: 422,
      }),
    );
    expect(smtpManager.sendMail).not.toHaveBeenCalled();
  });

  it('persists a valid inquiry and returns success without exposing delivery status', async () => {
    const inputEmail = 'ada.success@example.com';
    const actual = await request(app.getHttpServer())
      .post('/contact-inquiry')
      .send(buildCreateInquiryBody(inputEmail));
    expect(actual.status).toBe(201);
    expect(actual.body).toEqual({
      message: 'Inquiry submitted',
      status: 'ok',
    });
    expect(actual.body.emailDeliveryStatus).toBeUndefined();
    const stored = await prismaProviderService.contactInquiry.findFirst({
      where: { email: inputEmail },
    });
    expect(stored).toEqual(
      expect.objectContaining({
        fullName: 'Ada Lovelace',
        email: inputEmail,
        phone: '+963 11 000 0000',
        emailDeliveryStatus: EmailDeliveryStatus.SENT,
      }),
    );
    expect(smtpManager.sendMail).toHaveBeenCalled();
  });

  it('still persists the inquiry when SMTP send fails', async () => {
    smtpManager.sendMail.mockRejectedValue(new SmtpSendFailedException());
    const inputEmail = 'ada.failed@example.com';
    const actual = await request(app.getHttpServer())
      .post('/contact-inquiry')
      .send(buildCreateInquiryBody(inputEmail));
    expect(actual.status).toBe(201);
    expect(actual.body).toEqual({
      message: 'Inquiry submitted',
      status: 'ok',
    });
    const stored = await prismaProviderService.contactInquiry.findFirst({
      where: { email: inputEmail },
    });
    expect(stored).toEqual(
      expect.objectContaining({
        email: inputEmail,
        emailDeliveryStatus: EmailDeliveryStatus.FAILED,
      }),
    );
  });
});

describe('Public contact inquiry rate limit (e2e)', () => {
  let app: INestApplication;
  let prismaProviderService: PrismaProviderService;
  const smtpManager = {
    sendMail: jest.fn().mockResolvedValue(undefined),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(SmtpManagerService)
      .useValue(smtpManager)
      .compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prismaProviderService = app.get(PrismaProviderService);
  });

  afterAll(async () => {
    await prismaProviderService.contactInquiry.deleteMany({
      where: { email: { startsWith: 'ada.throttle+' } },
    });
    await app.close();
  });

  it('rejects the sixth submit in the throttle window', async () => {
    for (let i = 0; i < 5; i += 1) {
      const actualAllowed = await request(app.getHttpServer())
        .post('/contact-inquiry')
        .send(buildCreateInquiryBody(`ada.throttle+${i}@example.com`));
      expect(actualAllowed.status).toBe(201);
    }
    const actual = await request(app.getHttpServer())
      .post('/contact-inquiry')
      .send(buildCreateInquiryBody('ada.throttle+6@example.com'));
    expect(actual.status).toBe(429);
  });
});
