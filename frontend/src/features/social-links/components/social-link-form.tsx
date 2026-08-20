import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, type ReactElement } from 'react';
import { useForm } from 'react-hook-form';

import { ApiError } from '@/api/api-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateAdminSocialLinkMutation } from '@/features/social-links/hooks/use-create-admin-social-link-mutation';
import { useUpdateAdminSocialLinkMutation } from '@/features/social-links/hooks/use-update-admin-social-link-mutation';
import {
  socialLinkFormSchema,
  type SocialLinkFormValues,
} from '@/features/social-links/schemas/social-link-form.schema';
import type { SocialLinkResponse } from '@/generated/admin-social-link.contract';

type SocialLinkFormProps = {
  readonly nextDisplayOrder?: number;
  readonly onCancel?: () => void;
  readonly onSaved?: () => void;
  readonly socialLink?: SocialLinkResponse;
};

function createDefaultValues(
  socialLink?: SocialLinkResponse,
  nextDisplayOrder = 0,
): SocialLinkFormValues {
  return {
    platform: socialLink?.platform ?? '',
    url: socialLink?.url ?? '',
    isVisible: socialLink?.isVisible ?? true,
    displayOrder: socialLink?.displayOrder?.toString() ?? String(nextDisplayOrder),
  };
}

export function SocialLinkForm({
  nextDisplayOrder = 0,
  onCancel,
  onSaved,
  socialLink,
}: SocialLinkFormProps): ReactElement {
  const [isSuccess, setIsSuccess] = useState(false);
  const createMutation = useCreateAdminSocialLinkMutation();
  const updateMutation = useUpdateAdminSocialLinkMutation();
  const isPending = createMutation.isPending || updateMutation.isPending;
  const form = useForm<SocialLinkFormValues>({
    resolver: zodResolver(socialLinkFormSchema),
    defaultValues: createDefaultValues(socialLink, nextDisplayOrder),
  });
  useEffect(() => {
    form.reset(createDefaultValues(socialLink, nextDisplayOrder));
  }, [form, nextDisplayOrder, socialLink]);
  const serverError =
    createMutation.error instanceof ApiError
      ? createMutation.error.message
      : updateMutation.error instanceof ApiError
        ? updateMutation.error.message
        : null;
  async function onSubmit(values: SocialLinkFormValues): Promise<void> {
    setIsSuccess(false);
    const body = {
      platform: values.platform,
      url: values.url,
      isVisible: values.isVisible,
      displayOrder: values.displayOrder === '' ? 0 : Number(values.displayOrder),
    };
    try {
      if (socialLink) {
        await updateMutation.mutateAsync({ socialLinkId: socialLink.id, body });
      } else {
        await createMutation.mutateAsync(body);
        form.reset(createDefaultValues(undefined, nextDisplayOrder));
      }
      setIsSuccess(true);
      onSaved?.();
    } catch (error) {
      if (error instanceof ApiError) {
        for (const validationError of error.validationErrorObjects) {
          const fieldName = validationError.property as keyof SocialLinkFormValues;
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
        <Label htmlFor="platform">
          Platform <span aria-hidden="true">*</span>
        </Label>
        <Input
          aria-invalid={Boolean(form.formState.errors.platform)}
          aria-required="true"
          disabled={isPending}
          id="platform"
          {...form.register('platform')}
        />
        {form.formState.errors.platform ? (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.platform.message}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="socialUrl">
          URL <span aria-hidden="true">*</span>
        </Label>
        <Input
          aria-invalid={Boolean(form.formState.errors.url)}
          aria-required="true"
          disabled={isPending}
          id="socialUrl"
          type="url"
          {...form.register('url')}
        />
        {form.formState.errors.url ? (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.url.message}
          </p>
        ) : null}
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input disabled={isPending} type="checkbox" {...form.register('isVisible')} />
        Visible on the public site
      </label>
      {serverError ? (
        <p className="text-sm text-destructive" role="alert">
          {serverError}
        </p>
      ) : null}
      {isSuccess ? (
        <p className="text-sm text-muted-foreground" role="status">
          Social link saved successfully.
        </p>
      ) : null}
      <div className="flex gap-3">
        <Button disabled={isPending} type="submit">
          {isPending ? 'Saving…' : socialLink ? 'Save social link' : 'Add social link'}
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
