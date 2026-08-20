import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, type ReactElement } from 'react';
import { useForm } from 'react-hook-form';

import { ApiError } from '@/api/api-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AdminMediaUploadField } from '@/components/media/admin-media-upload-field';
import { useCreateAdminPartnerMutation } from '@/features/partners-admin/hooks/use-create-admin-partner-mutation';
import { useUpdateAdminPartnerMutation } from '@/features/partners-admin/hooks/use-update-admin-partner-mutation';
import { toCreatePartnerRequest } from '@/features/partners-admin/lib/to-create-partner-request';
import { toUpdatePartnerRequest } from '@/features/partners-admin/lib/to-update-partner-request';
import {
  partnerFormSchema,
  type PartnerFormValues,
} from '@/features/partners-admin/schemas/partner-form.schema';
import type { PartnerResponse } from '@/generated/admin-partner.contract';
import { cn } from '@/lib/utils';

const textareaClassName = cn(
  'min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs outline-none md:text-sm',
  'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
  'aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20',
);

type PartnerFormProps = {
  readonly nextDisplayOrder?: number;
  readonly onCancel?: () => void;
  readonly onSaved?: () => void;
  readonly partner?: PartnerResponse;
};

function createDefaultValues(
  partner?: PartnerResponse,
  nextDisplayOrder = 0,
): PartnerFormValues {
  return {
    name: partner?.name ?? '',
    shortDescription: partner?.shortDescription ?? '',
    fullDescription: partner?.fullDescription ?? '',
    specialization: partner?.specialization ?? '',
    websiteUrl: partner?.websiteUrl ?? '',
    country: partner?.country ?? '',
    isVisible: partner?.isVisible ?? true,
    displayOrder: partner?.displayOrder?.toString() ?? String(nextDisplayOrder),
    logoMediaId: partner?.logoMediaId?.toString() ?? '',
  };
}

export function PartnerForm({
  nextDisplayOrder = 0,
  onCancel,
  onSaved,
  partner,
}: PartnerFormProps): ReactElement {
  const [isSuccess, setIsSuccess] = useState(false);
  const [logoFileName, setLogoFileName] = useState(partner?.logo?.originalFileName ?? '');
  const createMutation = useCreateAdminPartnerMutation();
  const updateMutation = useUpdateAdminPartnerMutation();
  const isPending = createMutation.isPending || updateMutation.isPending;
  const form = useForm<PartnerFormValues>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: createDefaultValues(partner, nextDisplayOrder),
  });
  useEffect(() => {
    form.reset(createDefaultValues(partner, nextDisplayOrder));
    setLogoFileName(partner?.logo?.originalFileName ?? '');
  }, [form, nextDisplayOrder, partner]);
  const serverError =
    createMutation.error instanceof ApiError
      ? createMutation.error.message
      : updateMutation.error instanceof ApiError
        ? updateMutation.error.message
        : null;
  async function onSubmit(values: PartnerFormValues): Promise<void> {
    setIsSuccess(false);
    try {
      if (partner) {
        await updateMutation.mutateAsync({
          partnerId: partner.id,
          body: toUpdatePartnerRequest(values),
        });
      } else {
        await createMutation.mutateAsync(toCreatePartnerRequest(values));
        form.reset(createDefaultValues());
        setLogoFileName('');
      }
      setIsSuccess(true);
      onSaved?.();
    } catch (error) {
      if (error instanceof ApiError) {
        for (const validationError of error.validationErrorObjects) {
          const fieldName = validationError.property as keyof PartnerFormValues;
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
        <Label htmlFor="partnerName">
          Name <span aria-hidden="true">*</span>
        </Label>
        <Input
          aria-invalid={Boolean(form.formState.errors.name)}
          aria-required="true"
          disabled={isPending}
          id="partnerName"
          {...form.register('name')}
        />
        {form.formState.errors.name ? (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.name.message}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="shortDescription">
          Short description <span aria-hidden="true">*</span>
        </Label>
        <textarea
          aria-invalid={Boolean(form.formState.errors.shortDescription)}
          aria-required="true"
          className={textareaClassName}
          disabled={isPending}
          id="shortDescription"
          {...form.register('shortDescription')}
        />
        {form.formState.errors.shortDescription ? (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.shortDescription.message}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="fullDescription">Full description</Label>
        <textarea
          className={textareaClassName}
          disabled={isPending}
          id="fullDescription"
          {...form.register('fullDescription')}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="specialization">Specialization</Label>
        <Input disabled={isPending} id="specialization" {...form.register('specialization')} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="websiteUrl">Website URL</Label>
        <Input disabled={isPending} id="websiteUrl" type="url" {...form.register('websiteUrl')} />
        {form.formState.errors.websiteUrl ? (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.websiteUrl.message}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="country">Country</Label>
        <Input disabled={isPending} id="country" {...form.register('country')} />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input disabled={isPending} type="checkbox" {...form.register('isVisible')} />
        Visible on the public site
      </label>
      <AdminMediaUploadField
        disabled={isPending}
        fileName={logoFileName}
        inputId="partnerLogoUpload"
        label="Logo"
        mediaId={form.watch('logoMediaId')}
        onClear={() => {
          form.setValue('logoMediaId', '');
          setLogoFileName('');
        }}
        onUploaded={({ mediaId, fileName }) => {
          form.setValue('logoMediaId', mediaId);
          setLogoFileName(fileName);
        }}
      />
      {serverError ? (
        <p className="text-sm text-destructive" role="alert">
          {serverError}
        </p>
      ) : null}
      {isSuccess ? (
        <p className="text-sm text-muted-foreground" role="status">
          Partner saved successfully.
        </p>
      ) : null}
      <div className="flex gap-3">
        <Button disabled={isPending} type="submit">
          {isPending ? 'Saving…' : partner ? 'Save partner' : 'Add partner'}
        </Button>
        {onCancel ? (
          <Button disabled={isPending} onClick={onCancel} type="button" variant="outline">
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}
