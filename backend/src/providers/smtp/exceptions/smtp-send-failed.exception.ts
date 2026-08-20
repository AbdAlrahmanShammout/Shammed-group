import { DependencyFailureException } from '@/common/exceptions/dependency-failure.exception';

export class SmtpSendFailedException extends DependencyFailureException {
  constructor() {
    super({
      message: 'Failed to send email',
      code: 'SMTP_SEND_FAILED',
      userFriendly: true,
    });
  }
}
