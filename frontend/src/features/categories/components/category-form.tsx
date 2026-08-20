import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, type ReactElement } from 'react';
import { useForm } from 'react-hook-form';

import { ApiError } from '@/api/api-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateAdminProductCategoryMutation } from '@/features/categories/hooks/use-create-admin-product-category-mutation';
import { useUpdateAdminProductCategoryMutation } from '@/features/categories/hooks/use-update-admin-product-category-mutation';
import { toCreateCategoryRequest } from '@/features/categories/lib/to-create-category-request';
import { toUpdateCategoryRequest } from '@/features/categories/lib/to-update-category-request';
import {
  categoryFormSchema,
  type CategoryFormValues,
} from '@/features/categories/schemas/category-form.schema';
import type { ProductCategoryResponse } from '@/generated/admin-product-category.contract';
import { cn } from '@/lib/utils';

const textareaClassName = cn(
  'min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs outline-none md:text-sm',
  'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
  'aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20',
);

type CategoryFormProps = {
  readonly category?: ProductCategoryResponse;
  readonly onCancel?: () => void;
  readonly onSaved?: () => void;
};

function createDefaultValues(category?: ProductCategoryResponse): CategoryFormValues {
  return {
    name: category?.name ?? '',
    description: category?.description ?? '',
    isVisible: category?.isVisible ?? true,
    displayOrder: category?.displayOrder?.toString() ?? '0',
  };
}

export function CategoryForm({ category, onCancel, onSaved }: CategoryFormProps): ReactElement {
  const [isSuccess, setIsSuccess] = useState(false);
  const createMutation = useCreateAdminProductCategoryMutation();
  const updateMutation = useUpdateAdminProductCategoryMutation();
  const isPending = createMutation.isPending || updateMutation.isPending;
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: createDefaultValues(category),
  });
  useEffect(() => {
    form.reset(createDefaultValues(category));
  }, [category, form]);
  const serverError =
    createMutation.error instanceof ApiError
      ? createMutation.error.message
      : updateMutation.error instanceof ApiError
        ? updateMutation.error.message
        : null;
  async function onSubmit(values: CategoryFormValues): Promise<void> {
    setIsSuccess(false);
    try {
      if (category) {
        await updateMutation.mutateAsync({
          categoryId: category.id,
          body: toUpdateCategoryRequest(values),
        });
      } else {
        await createMutation.mutateAsync(toCreateCategoryRequest(values));
        form.reset(createDefaultValues());
      }
      setIsSuccess(true);
      onSaved?.();
    } catch (error) {
      if (error instanceof ApiError) {
        for (const validationError of error.validationErrorObjects) {
          const fieldName = validationError.property as keyof CategoryFormValues;
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
        <Label htmlFor="categoryName">
          Name <span aria-hidden="true">*</span>
        </Label>
        <Input
          aria-invalid={Boolean(form.formState.errors.name)}
          aria-required="true"
          disabled={isPending}
          id="categoryName"
          {...form.register('name')}
        />
        {form.formState.errors.name ? (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.name.message}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="categoryDescription">Description</Label>
        <textarea
          className={textareaClassName}
          disabled={isPending}
          id="categoryDescription"
          {...form.register('description')}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="categoryDisplayOrder">Display order</Label>
        <Input
          disabled={isPending}
          id="categoryDisplayOrder"
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
      {serverError ? (
        <p className="text-sm text-destructive" role="alert">
          {serverError}
        </p>
      ) : null}
      {isSuccess ? (
        <p className="text-sm text-muted-foreground" role="status">
          Category saved successfully.
        </p>
      ) : null}
      <div className="flex gap-3">
        <Button disabled={isPending} type="submit">
          {isPending ? 'Saving…' : category ? 'Save category' : 'Add category'}
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
