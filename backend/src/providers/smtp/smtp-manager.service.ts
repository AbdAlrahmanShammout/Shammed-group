import { Injectable, Logger } from '@nestjs/common';
import nodemailer, { Transporter } from 'nodemailer';

import { SmtpConfigService } from '@/config/smtp/smtp-config.service';
import { SendMailInput } from '@/providers/smtp/defs/smtp-manager.defs';
import { SmtpSendFailedException } from '@/providers/smtp/exceptions/smtp-send-failed.exception';

@Injectable()
export class SmtpManagerService {
  private readonly logger = new Logger(SmtpManagerService.name);
  private readonly transporter: Transporter;

  constructor(private readonly smtpConfigService: SmtpConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.smtpConfigService.host,
      port: this.smtpConfigService.port,
      secure: this.smtpConfigService.secure,
      auth: {
        user: this.smtpConfigService.user,
        pass: this.smtpConfigService.password,
      },
    });
  }

  async sendMail(input: SendMailInput): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.sanitizeHeaderValue(input.from),
        to: this.sanitizeHeaderValue(input.to),
        replyTo: input.replyTo ? this.sanitizeHeaderValue(input.replyTo) : undefined,
        subject: this.sanitizeHeaderValue(input.subject),
        text: input.text,
      });
    } catch (error) {
      this.logger.error('SMTP send failed', error instanceof Error ? error.stack : undefined);
      throw new SmtpSendFailedException();
    }
  }

  private sanitizeHeaderValue(value: string): string {
    return value.replace(/[\r\n]+/g, ' ').trim();
  }
}
