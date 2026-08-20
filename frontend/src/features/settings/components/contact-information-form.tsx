import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, type ReactElement } from 'react';
import { useForm } from 'react-hook-form';

import { ApiError } from '@/api/api-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateAdminSiteSettingsMutation } from '@/features/settings/hooks/use-update-admin-site-settings-mutation';
import {
  contactInformationFormSchema,
  type ContactInformationFormValues,
} from '@/features/settings/schemas/contact-information-form.schema';
import type { SiteSettingsResponse } from '@/generated/admin-site-settings.contract';
import { cn } from '@/lib/utils';

const textareaClassName = cn(
  'min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs outline-none md:text-sm',
  'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
  'aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20',
);

type ContactInformationFormProps = {
  readonly siteSettings: SiteSettingsResponse;
};

export function ContactInformationForm({
  siteSettings,
}: ContactInformationFormProps): ReactElement {
  const [isSuccess, setIsSuccess] = useState(false);
  const updateMutation = useUpdateAdminSiteSettingsMutation();
  const form = useForm<ContactInformationFormValues>({
    resolver: zodResolver(contactInformationFormSchema),
    defaultValues: {
      email: siteSettings.email,
      phone: siteSettings.phone,
      whatsApp: siteSettings.whatsApp ?? '',
      address: siteSettings.address ?? '',
    },
  });
  useEffect(() => {
    form.reset({
      email: siteSettings.email,
      phone: siteSettings.phone,
      whatsApp: siteSettings.whatsApp ?? '',
      address: siteSettings.address ?? '',
    });
  }, [form, siteSettings]);
  const serverError =
    updateMutation.error instanceof ApiError ? updateMutation.error.message : null;
  async function onSubmit(values: ContactInformationFormValues): Promise<void> {
    setIsSuccess(false);
    try {
      await updateMutation.mutateAsync({
        email: values.email,
        phone: values.phone,
        whatsApp: values.whatsApp === '' ? null : values.whatsApp,
        address: values.address === '' ? null : values.address,
      });
      setIsSuccess(true);
    } catch (error) {
      if (error instanceof ApiError) {
        for (const validationError of error.validationErrorObjects) {
          const fieldName = validationError.property as keyof ContactInformationFormValues;
          const message = Object.values(validationError.constraints)[0];
          if (message) {
            form.setError(fieldName, { message });
          }
        }
      }
    }
  }
  return (
    <form className="flex max-w-xl flex-col gap-4" noValidate onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="contactEmail">
          Email <span aria-hidden="true">*</span>
        </Label>
        <Input
          aria-invalid={Boolean(form.formState.errors.email)}
          aria-required="true"
          disabled={updateMutation.isPending}
          id="contactEmail"
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
        <Label htmlFor="contactPhone">
          Phone <span aria-hidden="true">*</span>
        </Label>
        <Input
          aria-invalid={Boolean(form.formState.errors.phone)}
          aria-required="true"
          disabled={updateMutation.isPending}
          id="contactPhone"
          {...form.register('phone')}
        />
        {form.formState.errors.phone ? (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.phone.message}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="whatsApp">WhatsApp</Label>
        <Input disabled={updateMutation.isPending} id="whatsApp" {...form.register('whatsApp')} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="address">Address</Label>
        <textarea
          className={textareaClassName}
          disabled={updateMutation.isPending}
          id="address"
          {...form.register('address')}
        />
      </div>
      {serverError ? (
        <p className="text-sm text-destructive" role="alert">
          {serverError}
        </p>
      ) : null}
      {isSuccess ? (
        <p className="text-sm text-muted-foreground" role="status">
          Contact information saved successfully.
        </p>
      ) : null}
      <Button disabled={updateMutation.isPending} type="submit">
        {updateMutation.isPending ? 'Saving…' : 'Save contact information'}
      </Button>
    </form>
  );
}
