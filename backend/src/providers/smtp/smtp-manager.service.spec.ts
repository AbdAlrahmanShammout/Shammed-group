import { SmtpConfigService } from '@/config/smtp/smtp-config.service';
import { SendMailInput } from '@/providers/smtp/defs/smtp-manager.defs';
import { SmtpSendFailedException } from '@/providers/smtp/exceptions/smtp-send-failed.exception';
import { SmtpManagerService } from '@/providers/smtp/smtp-manager.service';

const mockSendMail = jest.fn();

jest.mock('nodemailer', () => ({
  __esModule: true,
  default: {
    createTransport: jest.fn(() => ({
      sendMail: (options: unknown) => mockSendMail(options),
    })),
  },
}));

describe('SmtpManagerService', () => {
  const inputMail: SendMailInput = {
    to: 'info@shammed-group.com',
    from: 'noreply@shammed-group.com',
    replyTo: 'ada@example.com',
    subject: 'Contact form: Product availability',
    text: 'Do you stock this product in Damascus?',
  };
  let smtpManagerService: SmtpManagerService;

  beforeEach(() => {
    mockSendMail.mockReset();
    mockSendMail.mockResolvedValue({});
    const smtpConfigService = {
      host: 'localhost',
      port: 1025,
      user: 'test',
      password: 'test',
      secure: false,
    } as SmtpConfigService;
    smtpManagerService = new SmtpManagerService(smtpConfigService);
  });

  it('strips CR and LF characters from mail headers', async () => {
    await smtpManagerService.sendMail({
      ...inputMail,
      subject: 'Hello\r\nBcc: evil@example.com',
    });
    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: 'Hello Bcc: evil@example.com',
        replyTo: 'ada@example.com',
      }),
    );
  });

  it('wraps transport failures as SmtpSendFailedException', async () => {
    mockSendMail.mockRejectedValue(new Error('connect ECONNREFUSED'));
    await expect(smtpManagerService.sendMail(inputMail)).rejects.toBeInstanceOf(
      SmtpSendFailedException,
    );
  });
});
