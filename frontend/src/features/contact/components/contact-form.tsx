import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState, type ReactElement } from 'react';

import { ApiError } from '@/api/api-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateContactInquiryMutation } from '@/features/contact/hooks/use-create-contact-inquiry-mutation';
import {
  contactFormSchema,
  type ContactFormValues,
} from '@/features/contact/schemas/contact-form.schema';
import { cn } from '@/lib/utils';

const textareaClassName = cn(
  'min-h-28 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs outline-none md:text-sm',
  'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
  'aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20',
);

type ContactFormProps = {
  readonly className?: string;
  readonly fieldIdPrefix?: string;
};

export function ContactForm({ className, fieldIdPrefix = '' }: ContactFormProps): ReactElement {
  const [isSuccess, setIsSuccess] = useState(false);
  const createInquiryMutation = useCreateContactInquiryMutation();
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  });
  const serverError =
    createInquiryMutation.error instanceof ApiError ? createInquiryMutation.error.message : null;
  function createFieldId(fieldName: string): string {
    return `${fieldIdPrefix}${fieldName}`;
  }
  async function onSubmit(values: ContactFormValues): Promise<void> {
    setIsSuccess(false);
    try {
      await createInquiryMutation.mutateAsync({
        fullName: values.fullName,
        email: values.email,
        phone: values.phone === '' ? undefined : values.phone,
        subject: values.subject,
        message: values.message,
      });
      form.reset();
      setIsSuccess(true);
    } catch (error) {
      if (error instanceof ApiError) {
        for (const validationError of error.validationErrorObjects) {
          const fieldName = validationError.property as keyof ContactFormValues;
          const message = Object.values(validationError.constraints)[0];
          if (message) {
            form.setError(fieldName, { message });
          }
        }
      }
    }
  }
  return (
    <form
      className={cn('flex w-full max-w-xl flex-col gap-4', className)}
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor={createFieldId('fullName')}>
          Full Name <span aria-hidden="true">*</span>
        </Label>
        <Input
          aria-invalid={Boolean(form.formState.errors.fullName)}
          aria-required="true"
          autoComplete="name"
          disabled={createInquiryMutation.isPending}
          id={createFieldId('fullName')}
          {...form.register('fullName')}
        />
        {form.formState.errors.fullName ? (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.fullName.message}
          </p>
        ) : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor={createFieldId('email')}>
            Email <span aria-hidden="true">*</span>
          </Label>
          <Input
            aria-invalid={Boolean(form.formState.errors.email)}
            aria-required="true"
            autoComplete="email"
            disabled={createInquiryMutation.isPending}
            id={createFieldId('email')}
            type="email"
            {...form.register('email')}
          />
          {form.formState.errors.email ? (
            <p className="text-sm text-destructive" role="alert">
              {form.formState.errors.email.message}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor={createFieldId('phone')}>Phone Number</Label>
          <Input
            aria-invalid={Boolean(form.formState.errors.phone)}
            autoComplete="tel"
            disabled={createInquiryMutation.isPending}
            id={createFieldId('phone')}
            type="tel"
            {...form.register('phone')}
          />
          {form.formState.errors.phone ? (
            <p className="text-sm text-destructive" role="alert">
              {form.formState.errors.phone.message}
            </p>
          ) : null}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={createFieldId('subject')}>
          Subject <span aria-hidden="true">*</span>
        </Label>
        <Input
          aria-invalid={Boolean(form.formState.errors.subject)}
          aria-required="true"
          disabled={createInquiryMutation.isPending}
          id={createFieldId('subject')}
          {...form.register('subject')}
        />
        {form.formState.errors.subject ? (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.subject.message}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={createFieldId('message')}>
          Message <span aria-hidden="true">*</span>
        </Label>
        <textarea
          aria-invalid={Boolean(form.formState.errors.message)}
          aria-required="true"
          className={textareaClassName}
          disabled={createInquiryMutation.isPending}
          id={createFieldId('message')}
          {...form.register('message')}
        />
        {form.formState.errors.message ? (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.message.message}
          </p>
        ) : null}
      </div>
      {serverError ? (
        <p className="text-sm text-destructive" role="alert">
          {serverError}
        </p>
      ) : null}
      {isSuccess ? (
        <p className="text-sm text-foreground" role="status">
          Your message was sent successfully.
        </p>
      ) : null}
      <Button disabled={createInquiryMutation.isPending} type="submit">
        {createInquiryMutation.isPending ? 'Sending…' : 'Send message'}
      </Button>
    </form>
  );
}
