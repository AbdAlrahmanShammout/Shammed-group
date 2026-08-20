export type SendMailInput = {
  readonly to: string;
  readonly from: string;
  readonly replyTo?: string;
  readonly subject: string;
  readonly text: string;
};
