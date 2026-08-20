import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, type ReactElement } from 'react';
import { useForm } from 'react-hook-form';

import { ApiError } from '@/api/api-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MediaUploadField } from '@/features/products-admin/components/media-upload-field';
import { useAdminPartnersForSelectQuery } from '@/features/products-admin/hooks/use-admin-partners-for-select-query';
import { useAdminProductCategoriesForSelectQuery } from '@/features/products-admin/hooks/use-admin-product-categories-for-select-query';
import { useCreateAdminProductMutation } from '@/features/products-admin/hooks/use-create-admin-product-mutation';
import { useUpdateAdminProductMutation } from '@/features/products-admin/hooks/use-update-admin-product-mutation';
import { toCreateProductRequest } from '@/features/products-admin/lib/to-create-product-request';
import { toUpdateProductRequest } from '@/features/products-admin/lib/to-update-product-request';
import {
  productFormSchema,
  type ProductFormValues,
} from '@/features/products-admin/schemas/product-form.schema';
import type { ProductResponse } from '@/generated/admin-product.contract';
import { cn } from '@/lib/utils';

const textareaClassName = cn(
  'min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs outline-none md:text-sm',
  'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
  'aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20',
);

const selectClassName =
  'h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50';

type ProductFormProps = {
  readonly onCancel?: () => void;
  readonly onSaved?: () => void;
  readonly product?: ProductResponse;
};

function createDefaultValues(product?: ProductResponse): ProductFormValues {
  return {
    name: product?.name ?? '',
    shortDescription: product?.shortDescription ?? '',
    detailedDescription: product?.detailedDescription ?? '',
    manufacturer: product?.manufacturer ?? '',
    categoryId: product?.categoryId?.toString() ?? '',
    partnerId: product?.partnerId?.toString() ?? '',
    isVisible: product?.isVisible ?? true,
    displayOrder: product?.displayOrder?.toString() ?? '0',
    imageMediaId: product?.imageMediaId?.toString() ?? '',
  };
}

export function ProductForm({ onCancel, onSaved, product }: ProductFormProps): ReactElement {
  const [isSuccess, setIsSuccess] = useState(false);
  const [imageFileName, setImageFileName] = useState(product?.image?.originalFileName ?? '');
  const categoriesQuery = useAdminProductCategoriesForSelectQuery();
  const partnersQuery = useAdminPartnersForSelectQuery();
  const createMutation = useCreateAdminProductMutation();
  const updateMutation = useUpdateAdminProductMutation();
  const isPending = createMutation.isPending || updateMutation.isPending;
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: createDefaultValues(product),
  });
  useEffect(() => {
    form.reset(createDefaultValues(product));
    setImageFileName(product?.image?.originalFileName ?? '');
  }, [form, product]);
  const serverError =
    createMutation.error instanceof ApiError
      ? createMutation.error.message
      : updateMutation.error instanceof ApiError
        ? updateMutation.error.message
        : null;
  async function onSubmit(values: ProductFormValues): Promise<void> {
    setIsSuccess(false);
    try {
      if (product) {
        await updateMutation.mutateAsync({
          productId: product.id,
          body: toUpdateProductRequest(values),
        });
      } else {
        await createMutation.mutateAsync(toCreateProductRequest(values));
        form.reset(createDefaultValues());
        setImageFileName('');
      }
      setIsSuccess(true);
      onSaved?.();
    } catch (error) {
      if (error instanceof ApiError) {
        for (const validationError of error.validationErrorObjects) {
          const fieldName = validationError.property as keyof ProductFormValues;
          const message = Object.values(validationError.constraints)[0];
          if (message) {
            form.setError(fieldName, { message });
          }
        }
      }
    }
  }
  const categories = categoriesQuery.data?.productCategories ?? [];
  const partners = partnersQuery.data?.partners ?? [];
  return (
    <form className="flex max-w-xl flex-col gap-4" noValidate onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="productName">
          Name <span aria-hidden="true">*</span>
        </Label>
        <Input
          aria-invalid={Boolean(form.formState.errors.name)}
          aria-required="true"
          disabled={isPending}
          id="productName"
          {...form.register('name')}
        />
        {form.formState.errors.name ? (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.name.message}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="productShortDescription">
          Short description <span aria-hidden="true">*</span>
        </Label>
        <textarea
          aria-invalid={Boolean(form.formState.errors.shortDescription)}
          aria-required="true"
          className={textareaClassName}
          disabled={isPending}
          id="productShortDescription"
          {...form.register('shortDescription')}
        />
        {form.formState.errors.shortDescription ? (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.shortDescription.message}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="productDetailedDescription">Detailed description</Label>
        <textarea
          className={textareaClassName}
          disabled={isPending}
          id="productDetailedDescription"
          {...form.register('detailedDescription')}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="manufacturer">Manufacturer</Label>
        <Input disabled={isPending} id="manufacturer" {...form.register('manufacturer')} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="categoryId">
          Category <span aria-hidden="true">*</span>
        </Label>
        <select
          aria-invalid={Boolean(form.formState.errors.categoryId)}
          aria-required="true"
          className={selectClassName}
          disabled={isPending || categoriesQuery.isPending}
          id="categoryId"
          {...form.register('categoryId')}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {form.formState.errors.categoryId ? (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.categoryId.message}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="partnerId">Partner</Label>
        <select
          className={selectClassName}
          disabled={isPending || partnersQuery.isPending}
          id="partnerId"
          {...form.register('partnerId')}
        >
          <option value="">No partner</option>
          {partners.map((partner) => (
            <option key={partner.id} value={partner.id}>
              {partner.name}
            </option>
          ))}
        </select>
        <p className="text-sm text-muted-foreground">Optional. Lists partners from the admin API.</p>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="productDisplayOrder">Display order</Label>
        <Input
          disabled={isPending}
          id="productDisplayOrder"
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
        inputId="productImageUpload"
        label="Product image"
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
          Product saved successfully.
        </p>
      ) : null}
      <div className="flex gap-3">
        <Button disabled={isPending} type="submit">
          {isPending ? 'Saving…' : product ? 'Save product' : 'Add product'}
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
