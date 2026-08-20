import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, type ReactElement } from 'react';
import { useForm } from 'react-hook-form';

import { ApiError } from '@/api/api-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateAdminSiteSettingsMutation } from '@/features/settings/hooks/use-create-admin-site-settings-mutation';
import { useUpdateAdminSiteSettingsMutation } from '@/features/settings/hooks/use-update-admin-site-settings-mutation';
import { toOptionalMediaId } from '@/features/settings/lib/to-optional-media-id';
import {
  companySettingsFormSchema,
  type CompanySettingsFormValues,
} from '@/features/settings/schemas/company-settings-form.schema';
import type { SiteSettingsResponse } from '@/generated/admin-site-settings.contract';

type CompanySettingsFormProps = {
  readonly siteSettings?: SiteSettingsResponse;
};

export function CompanySettingsForm({ siteSettings }: CompanySettingsFormProps): ReactElement {
  const [isSuccess, setIsSuccess] = useState(false);
  const createMutation = useCreateAdminSiteSettingsMutation();
  const updateMutation = useUpdateAdminSiteSettingsMutation();
  const isPending = createMutation.isPending || updateMutation.isPending;
  const form = useForm<CompanySettingsFormValues>({
    resolver: zodResolver(companySettingsFormSchema),
    defaultValues: {
      companyName: siteSettings?.companyName ?? '',
      companyNameEnglish: siteSettings?.companyNameEnglish ?? '',
      companyNameArabic: siteSettings?.companyNameArabic ?? '',
      phone: siteSettings?.phone ?? '',
      logoMediaId: siteSettings?.logoMediaId?.toString() ?? '',
      faviconMediaId: siteSettings?.faviconMediaId?.toString() ?? '',
    },
  });
  useEffect(() => {
    if (!siteSettings) {
      return;
    }
    form.reset({
      companyName: siteSettings.companyName,
      companyNameEnglish: siteSettings.companyNameEnglish,
      companyNameArabic: siteSettings.companyNameArabic ?? '',
      phone: siteSettings.phone,
      logoMediaId: siteSettings.logoMediaId?.toString() ?? '',
      faviconMediaId: siteSettings.faviconMediaId?.toString() ?? '',
    });
  }, [form, siteSettings]);
  const serverError =
    createMutation.error instanceof ApiError
      ? createMutation.error.message
      : updateMutation.error instanceof ApiError
        ? updateMutation.error.message
        : null;
  async function onSubmit(values: CompanySettingsFormValues): Promise<void> {
    setIsSuccess(false);
    const logoMediaId = toOptionalMediaId(values.logoMediaId);
    const faviconMediaId = toOptionalMediaId(values.faviconMediaId);
    try {
      if (siteSettings) {
        await updateMutation.mutateAsync({
          companyName: values.companyName,
          companyNameEnglish: values.companyNameEnglish,
          companyNameArabic: values.companyNameArabic === '' ? null : values.companyNameArabic,
          phone: values.phone,
          logoMediaId,
          faviconMediaId,
        });
      } else {
        await createMutation.mutateAsync({
          companyName: values.companyName,
          companyNameEnglish: values.companyNameEnglish,
          companyNameArabic:
            values.companyNameArabic === '' ? undefined : values.companyNameArabic,
          phone: values.phone,
          logoMediaId: logoMediaId ?? undefined,
          faviconMediaId: faviconMediaId ?? undefined,
        });
      }
      setIsSuccess(true);
    } catch (error) {
      if (error instanceof ApiError) {
        for (const validationError of error.validationErrorObjects) {
          const fieldName = validationError.property as keyof CompanySettingsFormValues;
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
        <Label htmlFor="companyName">
          Company name <span aria-hidden="true">*</span>
        </Label>
        <Input
          aria-invalid={Boolean(form.formState.errors.companyName)}
          aria-required="true"
          disabled={isPending}
          id="companyName"
          {...form.register('companyName')}
        />
        {form.formState.errors.companyName ? (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.companyName.message}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="companyNameEnglish">
          English company name <span aria-hidden="true">*</span>
        </Label>
        <Input
          aria-invalid={Boolean(form.formState.errors.companyNameEnglish)}
          aria-required="true"
          disabled={isPending}
          id="companyNameEnglish"
          {...form.register('companyNameEnglish')}
        />
        {form.formState.errors.companyNameEnglish ? (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.companyNameEnglish.message}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="companyNameArabic">Arabic company name</Label>
        <Input disabled={isPending} id="companyNameArabic" {...form.register('companyNameArabic')} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="settingsPhone">
          Main phone <span aria-hidden="true">*</span>
        </Label>
        <Input
          aria-invalid={Boolean(form.formState.errors.phone)}
          aria-required="true"
          disabled={isPending}
          id="settingsPhone"
          {...form.register('phone')}
        />
        {form.formState.errors.phone ? (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.phone.message}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="logoMediaId">Logo media ID</Label>
        <Input disabled={isPending} id="logoMediaId" inputMode="numeric" {...form.register('logoMediaId')} />
        <p className="text-sm text-muted-foreground">
          Optional. Upload media first, then enter the media ID. Public image URLs are not available yet.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="faviconMediaId">Favicon media ID</Label>
        <Input
          disabled={isPending}
          id="faviconMediaId"
          inputMode="numeric"
          {...form.register('faviconMediaId')}
        />
      </div>
      {serverError ? (
        <p className="text-sm text-destructive" role="alert">
          {serverError}
        </p>
      ) : null}
      {isSuccess ? (
        <p className="text-sm text-muted-foreground" role="status">
          Settings saved successfully.
        </p>
      ) : null}
      <Button disabled={isPending} type="submit">
        {isPending ? 'Saving…' : siteSettings ? 'Save settings' : 'Create settings'}
      </Button>
    </form>
  );
}
