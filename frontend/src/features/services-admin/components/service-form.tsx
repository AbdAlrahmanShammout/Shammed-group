import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, type ReactElement } from 'react';
import { useForm } from 'react-hook-form';

import { ApiError } from '@/api/api-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MediaUploadField } from '@/features/services-admin/components/media-upload-field';
import { useCreateAdminServiceMutation } from '@/features/services-admin/hooks/use-create-admin-service-mutation';
import { useUpdateAdminServiceMutation } from '@/features/services-admin/hooks/use-update-admin-service-mutation';
import { toCreateServiceRequest } from '@/features/services-admin/lib/to-create-service-request';
import { toUpdateServiceRequest } from '@/features/services-admin/lib/to-update-service-request';
import {
  serviceFormSchema,
  type ServiceFormValues,
} from '@/features/services-admin/schemas/service-form.schema';
import type { ServiceResponse } from '@/generated/admin-service.contract';
import { cn } from '@/lib/utils';

const textareaClassName = cn(
  'min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs outline-none md:text-sm',
  'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
  'aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20',
);

type ServiceFormProps = {
  readonly onCancel?: () => void;
  readonly onSaved?: () => void;
  readonly service?: ServiceResponse;
};

function createDefaultValues(service?: ServiceResponse): ServiceFormValues {
  return {
    title: service?.title ?? '',
    description: service?.description ?? '',
    isVisible: service?.isVisible ?? true,
    displayOrder: service?.displayOrder?.toString() ?? '0',
    imageMediaId: service?.imageMediaId?.toString() ?? '',
  };
}

export function ServiceForm({ onCancel, onSaved, service }: ServiceFormProps): ReactElement {
  const [isSuccess, setIsSuccess] = useState(false);
  const [imageFileName, setImageFileName] = useState(service?.image?.originalFileName ?? '');
  const createMutation = useCreateAdminServiceMutation();
  const updateMutation = useUpdateAdminServiceMutation();
  const isPending = createMutation.isPending || updateMutation.isPending;
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: createDefaultValues(service),
  });
  useEffect(() => {
    form.reset(createDefaultValues(service));
    setImageFileName(service?.image?.originalFileName ?? '');
  }, [form, service]);
  const serverError =
    createMutation.error instanceof ApiError
      ? createMutation.error.message
      : updateMutation.error instanceof ApiError
        ? updateMutation.error.message
        : null;
  async function onSubmit(values: ServiceFormValues): Promise<void> {
    setIsSuccess(false);
    try {
      if (service) {
        await updateMutation.mutateAsync({
          serviceId: service.id,
          body: toUpdateServiceRequest(values),
        });
      } else {
        await createMutation.mutateAsync(toCreateServiceRequest(values));
        form.reset(createDefaultValues());
        setImageFileName('');
      }
      setIsSuccess(true);
      onSaved?.();
    } catch (error) {
      if (error instanceof ApiError) {
        for (const validationError of error.validationErrorObjects) {
          const fieldName = validationError.property as keyof ServiceFormValues;
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
        <Label htmlFor="serviceTitle">
          Title <span aria-hidden="true">*</span>
        </Label>
        <Input
          aria-invalid={Boolean(form.formState.errors.title)}
          aria-required="true"
          disabled={isPending}
          id="serviceTitle"
          {...form.register('title')}
        />
        {form.formState.errors.title ? (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.title.message}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="serviceDescription">
          Description <span aria-hidden="true">*</span>
        </Label>
        <textarea
          aria-invalid={Boolean(form.formState.errors.description)}
          aria-required="true"
          className={textareaClassName}
          disabled={isPending}
          id="serviceDescription"
          {...form.register('description')}
        />
        {form.formState.errors.description ? (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.description.message}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="serviceDisplayOrder">Display order</Label>
        <Input
          disabled={isPending}
          id="serviceDisplayOrder"
          inputMode="numeric"
          {...form.register('displayOrder')}
        />
        {form.formState.errors.displayOrder ? (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.displayOrder.message}
          </p>
        ) : null}
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input disabled={isPending} type="checkbox" {...form.register('isVisible')} />
        Visible on the public site
      </label>
      <MediaUploadField
        disabled={isPending}
        fileName={imageFileName}
        inputId="serviceImageUpload"
        label="Service image"
        mediaId={form.watch('imageMediaId')}
        onClear={() => {
          form.setValue('imageMediaId', '');
          setImageFileName('');
        }}
        onUploaded={({ mediaId, fileName }) => {
          form.setValue('imageMediaId', mediaId);
          setImageFileName(fileName);
        }}
      />
      {serverError ? (
        <p className="text-sm text-destructive" role="alert">
          {serverError}
        </p>
      ) : null}
      {isSuccess ? (
        <p className="text-sm text-muted-foreground" role="status">
          Service saved successfully.
        </p>
      ) : null}
      <div className="flex gap-3">
        <Button disabled={isPending} type="submit">
          {isPending ? 'Saving…' : service ? 'Save service' : 'Add service'}
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
