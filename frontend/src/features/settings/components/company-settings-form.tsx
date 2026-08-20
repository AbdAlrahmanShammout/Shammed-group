import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, type ReactElement } from 'react';
import { useForm } from 'react-hook-form';

import { ApiError } from '@/api/api-error';
import { AdminMediaUploadField } from '@/components/media/admin-media-upload-field';
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
  const [logoFileName, setLogoFileName] = useState('');
  const [faviconFileName, setFaviconFileName] = useState('');
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
    setLogoFileName(siteSettings.logo?.originalFileName ?? '');
    setFaviconFileName(siteSettings.favicon?.originalFileName ?? '');
  }, [form, siteSettings]);
  const serverError =
    createMutation.error instanceof ApiError
      ? createMutation.error.message
      : updateMutation.error instanceof ApiError
        ? updateMutation.error.message
        : null;
  async function persistMediaField(input: {
    readonly field: 'logoMediaId' | 'faviconMediaId';
    readonly mediaId: string;
    readonly fileName: string;
  }): Promise<void> {
    form.setValue(input.field, input.mediaId, { shouldDirty: true });
    if (input.field === 'logoMediaId') {
      setLogoFileName(input.fileName);
    } else {
      setFaviconFileName(input.fileName);
    }
    if (!siteSettings) {
      return;
    }
    setIsSuccess(false);
    try {
      await updateMutation.mutateAsync({
        [input.field]: toOptionalMediaId(input.mediaId),
      });
      setIsSuccess(true);
    } catch {
      // Surface via updateMutation.error / serverError below.
    }
  }
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
      <AdminMediaUploadField
        disabled={isPending}
        fileName={logoFileName}
        inputId="logoImageUpload"
        label="Company logo"
        mediaId={form.watch('logoMediaId')}
        onClear={() => {
          void persistMediaField({
            field: 'logoMediaId',
            mediaId: '',
            fileName: '',
          });
        }}
        onUploaded={({ mediaId, fileName }) => {
          void persistMediaField({
            field: 'logoMediaId',
            mediaId,
            fileName,
          });
        }}
      />
      <AdminMediaUploadField
        disabled={isPending}
        fileName={faviconFileName}
        inputId="faviconImageUpload"
        label="Favicon"
        mediaId={form.watch('faviconMediaId')}
        onClear={() => {
          void persistMediaField({
            field: 'faviconMediaId',
            mediaId: '',
            fileName: '',
          });
        }}
        onUploaded={({ mediaId, fileName }) => {
          void persistMediaField({
            field: 'faviconMediaId',
            mediaId,
            fileName,
          });
        }}
      />
      {siteSettings ? (
        <p className="text-xs text-muted-foreground">
          Logo and favicon apply to the public site as soon as you upload or remove them.
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">
          Create settings first, then logo and favicon uploads apply immediately.
        </p>
      )}
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
