import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, type ReactElement } from 'react';
import { useForm } from 'react-hook-form';

import { ApiError } from '@/api/api-error';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AdminMediaUploadField } from '@/components/media/admin-media-upload-field';
import { useCreateAdminAboutPageMutation } from '@/features/about-admin/hooks/use-create-admin-about-page-mutation';
import { useUpdateAdminAboutPageMutation } from '@/features/about-admin/hooks/use-update-admin-about-page-mutation';
import { toCreateAboutPageRequest } from '@/features/about-admin/lib/to-create-about-page-request';
import { toUpdateAboutPageRequest } from '@/features/about-admin/lib/to-update-about-page-request';
import {
  aboutPageFormSchema,
  type AboutPageFormValues,
} from '@/features/about-admin/schemas/about-page-form.schema';
import type { AboutPageResponse } from '@/generated/admin-about.contract';
import { cn } from '@/lib/utils';

const textareaClassName = cn(
  'min-h-28 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs outline-none md:text-sm',
  'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
  'aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20',
);

type AboutPageFormProps = {
  readonly aboutPage?: AboutPageResponse;
};

type TextFieldProps = {
  readonly disabled: boolean;
  readonly errorMessage?: string;
  readonly fieldId: string;
  readonly label: string;
  readonly register: ReturnType<typeof useForm<AboutPageFormValues>>['register'];
  readonly name: keyof AboutPageFormValues;
};

function TextField({
  disabled,
  errorMessage,
  fieldId,
  label,
  name,
  register,
}: TextFieldProps): ReactElement {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={fieldId}>
        {label} <span aria-hidden="true">*</span>
      </Label>
      <textarea
        aria-invalid={Boolean(errorMessage)}
        aria-required="true"
        className={textareaClassName}
        disabled={disabled}
        id={fieldId}
        {...register(name)}
      />
      {errorMessage ? (
        <p className="text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}

function createDefaultValues(aboutPage?: AboutPageResponse): AboutPageFormValues {
  return {
    overview: aboutPage?.overview ?? '',
    overviewImageMediaId: aboutPage?.overviewImageMediaId?.toString() ?? '',
    vision: aboutPage?.vision ?? '',
    mission: aboutPage?.mission ?? '',
    values: aboutPage?.values ?? '',
    capabilities: aboutPage?.capabilities ?? '',
  };
}

export function AboutPageForm({ aboutPage }: AboutPageFormProps): ReactElement {
  const [isSuccess, setIsSuccess] = useState(false);
  const [overviewFileName, setOverviewFileName] = useState(
    aboutPage?.overviewImage?.originalFileName ?? '',
  );
  const createMutation = useCreateAdminAboutPageMutation();
  const updateMutation = useUpdateAdminAboutPageMutation();
  const isPending = createMutation.isPending || updateMutation.isPending;
  const form = useForm<AboutPageFormValues>({
    resolver: zodResolver(aboutPageFormSchema),
    defaultValues: createDefaultValues(aboutPage),
  });
  useEffect(() => {
    form.reset(createDefaultValues(aboutPage));
    setOverviewFileName(aboutPage?.overviewImage?.originalFileName ?? '');
  }, [aboutPage, form]);
  const serverError =
    createMutation.error instanceof ApiError
      ? createMutation.error.message
      : updateMutation.error instanceof ApiError
        ? updateMutation.error.message
        : null;
  async function onSubmit(values: AboutPageFormValues): Promise<void> {
    setIsSuccess(false);
    try {
      if (aboutPage) {
        await updateMutation.mutateAsync(toUpdateAboutPageRequest(values));
      } else {
        await createMutation.mutateAsync(toCreateAboutPageRequest(values));
      }
      setIsSuccess(true);
    } catch (error) {
      if (error instanceof ApiError) {
        for (const validationError of error.validationErrorObjects) {
          const fieldName = validationError.property as keyof AboutPageFormValues;
          const message = Object.values(validationError.constraints)[0];
          if (message) {
            form.setError(fieldName, { message });
          }
        }
      }
    }
  }
  return (
    <form className="flex max-w-2xl flex-col gap-6" noValidate onSubmit={form.handleSubmit(onSubmit)}>
      <p className="text-sm text-muted-foreground">
        Each section is free-form text. Values is a single content field, not a list of separate
        records.
      </p>
      <TextField
        disabled={isPending}
        errorMessage={form.formState.errors.overview?.message}
        fieldId="overview"
        label="Overview"
        name="overview"
        register={form.register}
      />
      <AdminMediaUploadField
        disabled={isPending}
        fileName={overviewFileName}
        inputId="overviewImageUpload"
        label="Overview image"
        mediaId={form.watch('overviewImageMediaId')}
        onClear={() => {
          form.setValue('overviewImageMediaId', '');
          setOverviewFileName('');
        }}
        onUploaded={({ mediaId, fileName }) => {
          form.setValue('overviewImageMediaId', mediaId);
          setOverviewFileName(fileName);
        }}
      />
      <TextField
        disabled={isPending}
        errorMessage={form.formState.errors.vision?.message}
        fieldId="vision"
        label="Vision"
        name="vision"
        register={form.register}
      />
      <TextField
        disabled={isPending}
        errorMessage={form.formState.errors.mission?.message}
        fieldId="mission"
        label="Mission"
        name="mission"
        register={form.register}
      />
      <TextField
        disabled={isPending}
        errorMessage={form.formState.errors.values?.message}
        fieldId="values"
        label="Values"
        name="values"
        register={form.register}
      />
      <TextField
        disabled={isPending}
        errorMessage={form.formState.errors.capabilities?.message}
        fieldId="capabilities"
        label="Capabilities"
        name="capabilities"
        register={form.register}
      />
      {serverError ? (
        <p className="text-sm text-destructive" role="alert">
          {serverError}
        </p>
      ) : null}
      {isSuccess ? (
        <p className="text-sm text-muted-foreground" role="status">
          About page saved successfully.
        </p>
      ) : null}
      <Button disabled={isPending} type="submit">
        {isPending ? 'Saving…' : aboutPage ? 'Save about page' : 'Create about page'}
      </Button>
    </form>
  );
}
