import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, type ReactElement } from 'react';
import { useForm } from 'react-hook-form';

import { ApiError } from '@/api/api-error';
import { AdminMediaUploadField } from '@/components/media/admin-media-upload-field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateAdminHomePageMutation } from '@/features/home-admin/hooks/use-create-admin-home-page-mutation';
import { useUpdateAdminHomePageMutation } from '@/features/home-admin/hooks/use-update-admin-home-page-mutation';
import { toCreateHomePageRequest } from '@/features/home-admin/lib/to-create-home-page-request';
import { toUpdateHomePageRequest } from '@/features/home-admin/lib/to-update-home-page-request';
import {
  homePageFormSchema,
  type HomePageFormValues,
} from '@/features/home-admin/schemas/home-page-form.schema';
import type { HomePageResponse } from '@/generated/admin-home.contract';
import { cn } from '@/lib/utils';

const textareaClassName = cn(
  'min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs outline-none md:text-sm',
  'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
  'aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20',
);

type HomePageFormProps = {
  readonly homePage?: HomePageResponse;
};

function createDefaultValues(homePage?: HomePageResponse): HomePageFormValues {
  return {
    heroTitle: homePage?.heroTitle ?? '',
    heroDescription: homePage?.heroDescription ?? '',
    heroImageMediaId: homePage?.heroImageMediaId?.toString() ?? '',
    primaryCtaText: homePage?.primaryCtaText ?? '',
    primaryCtaUrl: homePage?.primaryCtaUrl ?? '',
    secondaryCtaText: homePage?.secondaryCtaText ?? '',
    secondaryCtaUrl: homePage?.secondaryCtaUrl ?? '',
    aboutPreviewTitle: homePage?.aboutPreviewTitle ?? '',
    aboutPreviewDescription: homePage?.aboutPreviewDescription ?? '',
    aboutPreviewImageMediaId: homePage?.aboutPreviewImageMediaId?.toString() ?? '',
    aboutPreviewCtaText: homePage?.aboutPreviewCtaText ?? '',
    aboutPreviewCtaUrl: homePage?.aboutPreviewCtaUrl ?? '',
    partnersSectionTitle: homePage?.partnersSectionTitle ?? '',
    partnersSectionDescription: homePage?.partnersSectionDescription ?? '',
    productsSectionTitle: homePage?.productsSectionTitle ?? '',
    productsSectionDescription: homePage?.productsSectionDescription ?? '',
    servicesSectionTitle: homePage?.servicesSectionTitle ?? '',
    servicesSectionDescription: homePage?.servicesSectionDescription ?? '',
    whyTitle: homePage?.whyTitle ?? '',
    whyDescription: homePage?.whyDescription ?? '',
    whyImageMediaId: homePage?.whyImageMediaId?.toString() ?? '',
    contactSectionTitle: homePage?.contactSectionTitle ?? '',
    contactSectionDescription: homePage?.contactSectionDescription ?? '',
  };
}

export function HomePageForm({ homePage }: HomePageFormProps): ReactElement {
  const [isSuccess, setIsSuccess] = useState(false);
  const [heroFileName, setHeroFileName] = useState(homePage?.heroImage?.originalFileName ?? '');
  const [aboutFileName, setAboutFileName] = useState(
    homePage?.aboutPreviewImage?.originalFileName ?? '',
  );
  const [whyFileName, setWhyFileName] = useState(homePage?.whyImage?.originalFileName ?? '');
  const createMutation = useCreateAdminHomePageMutation();
  const updateMutation = useUpdateAdminHomePageMutation();
  const isPending = createMutation.isPending || updateMutation.isPending;
  const form = useForm<HomePageFormValues>({
    resolver: zodResolver(homePageFormSchema),
    defaultValues: createDefaultValues(homePage),
  });
  useEffect(() => {
    form.reset(createDefaultValues(homePage));
    setHeroFileName(homePage?.heroImage?.originalFileName ?? '');
    setAboutFileName(homePage?.aboutPreviewImage?.originalFileName ?? '');
    setWhyFileName(homePage?.whyImage?.originalFileName ?? '');
  }, [form, homePage]);
  const serverError =
    createMutation.error instanceof ApiError
      ? createMutation.error.message
      : updateMutation.error instanceof ApiError
        ? updateMutation.error.message
        : null;
  async function onSubmit(values: HomePageFormValues): Promise<void> {
    setIsSuccess(false);
    try {
      if (homePage) {
        await updateMutation.mutateAsync(toUpdateHomePageRequest(values));
      } else {
        await createMutation.mutateAsync(toCreateHomePageRequest(values));
      }
      setIsSuccess(true);
    } catch (error) {
      if (error instanceof ApiError) {
        for (const validationError of error.validationErrorObjects) {
          const fieldName = validationError.property as keyof HomePageFormValues;
          const message = Object.values(validationError.constraints)[0];
          if (message) {
            form.setError(fieldName, { message });
          }
        }
      }
    }
  }
  return (
    <form className="flex max-w-2xl flex-col gap-8" noValidate onSubmit={form.handleSubmit(onSubmit)}>
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-medium">Hero</h2>
        <div className="flex flex-col gap-2">
          <Label htmlFor="heroTitle">
            Title <span aria-hidden="true">*</span>
          </Label>
          <Input
            aria-invalid={Boolean(form.formState.errors.heroTitle)}
            aria-required="true"
            disabled={isPending}
            id="heroTitle"
            {...form.register('heroTitle')}
          />
          {form.formState.errors.heroTitle ? (
            <p className="text-sm text-destructive" role="alert">
              {form.formState.errors.heroTitle.message}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="heroDescription">
            Description <span aria-hidden="true">*</span>
          </Label>
          <textarea
            aria-invalid={Boolean(form.formState.errors.heroDescription)}
            aria-required="true"
            className={textareaClassName}
            disabled={isPending}
            id="heroDescription"
            {...form.register('heroDescription')}
          />
          {form.formState.errors.heroDescription ? (
            <p className="text-sm text-destructive" role="alert">
              {form.formState.errors.heroDescription.message}
            </p>
          ) : null}
        </div>
        <AdminMediaUploadField
          disabled={isPending}
          fileName={heroFileName}
          inputId="heroImageUpload"
          label="Hero image"
          mediaId={form.watch('heroImageMediaId')}
          onClear={() => {
            form.setValue('heroImageMediaId', '');
            setHeroFileName('');
          }}
          onUploaded={({ mediaId, fileName }) => {
            form.setValue('heroImageMediaId', mediaId);
            setHeroFileName(fileName);
          }}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="primaryCtaText">
              Primary CTA text <span aria-hidden="true">*</span>
            </Label>
            <Input
              aria-required="true"
              disabled={isPending}
              id="primaryCtaText"
              aria-invalid={Boolean(form.formState.errors.primaryCtaText)}
              {...form.register('primaryCtaText')}
            />
            {form.formState.errors.primaryCtaText ? (
              <p className="text-sm text-destructive" role="alert">
                {form.formState.errors.primaryCtaText.message}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="primaryCtaUrl">
              Primary CTA URL <span aria-hidden="true">*</span>
            </Label>
            <Input
              aria-required="true"
              disabled={isPending}
              id="primaryCtaUrl"
              aria-invalid={Boolean(form.formState.errors.primaryCtaUrl)}
              {...form.register('primaryCtaUrl')}
            />
            {form.formState.errors.primaryCtaUrl ? (
              <p className="text-sm text-destructive" role="alert">
                {form.formState.errors.primaryCtaUrl.message}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="secondaryCtaText">
              Secondary CTA text <span aria-hidden="true">*</span>
            </Label>
            <Input
              aria-required="true"
              disabled={isPending}
              id="secondaryCtaText"
              aria-invalid={Boolean(form.formState.errors.secondaryCtaText)}
              {...form.register('secondaryCtaText')}
            />
            {form.formState.errors.secondaryCtaText ? (
              <p className="text-sm text-destructive" role="alert">
                {form.formState.errors.secondaryCtaText.message}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="secondaryCtaUrl">
              Secondary CTA URL <span aria-hidden="true">*</span>
            </Label>
            <Input
              aria-required="true"
              disabled={isPending}
              id="secondaryCtaUrl"
              aria-invalid={Boolean(form.formState.errors.secondaryCtaUrl)}
              {...form.register('secondaryCtaUrl')}
            />
            {form.formState.errors.secondaryCtaUrl ? (
              <p className="text-sm text-destructive" role="alert">
                {form.formState.errors.secondaryCtaUrl.message}
              </p>
            ) : null}
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-4 border-t pt-6">
        <h2 className="text-lg font-medium">About preview</h2>
        <div className="flex flex-col gap-2">
          <Label htmlFor="aboutPreviewTitle">
            Title <span aria-hidden="true">*</span>
          </Label>
          <Input
            aria-required="true"
            disabled={isPending}
            id="aboutPreviewTitle"
            aria-invalid={Boolean(form.formState.errors.aboutPreviewTitle)}
            {...form.register('aboutPreviewTitle')}
          />
          {form.formState.errors.aboutPreviewTitle ? (
            <p className="text-sm text-destructive" role="alert">
              {form.formState.errors.aboutPreviewTitle.message}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="aboutPreviewDescription">
            Description <span aria-hidden="true">*</span>
          </Label>
          <textarea
            aria-required="true"
            className={textareaClassName}
            disabled={isPending}
            id="aboutPreviewDescription"
            aria-invalid={Boolean(form.formState.errors.aboutPreviewDescription)}
            {...form.register('aboutPreviewDescription')}
          />
          {form.formState.errors.aboutPreviewDescription ? (
            <p className="text-sm text-destructive" role="alert">
              {form.formState.errors.aboutPreviewDescription.message}
            </p>
          ) : null}
        </div>
        <AdminMediaUploadField
          disabled={isPending}
          fileName={aboutFileName}
          inputId="aboutPreviewImageUpload"
          label="About preview image"
          mediaId={form.watch('aboutPreviewImageMediaId')}
          onClear={() => {
            form.setValue('aboutPreviewImageMediaId', '');
            setAboutFileName('');
          }}
          onUploaded={({ mediaId, fileName }) => {
            form.setValue('aboutPreviewImageMediaId', mediaId);
            setAboutFileName(fileName);
          }}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="aboutPreviewCtaText">
              CTA text <span aria-hidden="true">*</span>
            </Label>
            <Input
              aria-required="true"
              disabled={isPending}
              id="aboutPreviewCtaText"
              aria-invalid={Boolean(form.formState.errors.aboutPreviewCtaText)}
              {...form.register('aboutPreviewCtaText')}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="aboutPreviewCtaUrl">
              CTA URL <span aria-hidden="true">*</span>
            </Label>
            <Input
              aria-required="true"
              disabled={isPending}
              id="aboutPreviewCtaUrl"
              aria-invalid={Boolean(form.formState.errors.aboutPreviewCtaUrl)}
              {...form.register('aboutPreviewCtaUrl')}
            />
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-4 border-t pt-6">
        <h2 className="text-lg font-medium">Catalog section titles</h2>
        <p className="text-sm text-muted-foreground">
          Partner, product, and service lists come from catalog visibility. Edit entities in Catalog
          and Company — not here.
        </p>
        <div className="flex flex-col gap-2">
          <Label htmlFor="partnersSectionTitle">
            Partners title <span aria-hidden="true">*</span>
          </Label>
          <Input
            aria-required="true"
            disabled={isPending}
            id="partnersSectionTitle"
            aria-invalid={Boolean(form.formState.errors.partnersSectionTitle)}
            {...form.register('partnersSectionTitle')}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="partnersSectionDescription">Partners description</Label>
          <textarea
            className={textareaClassName}
            disabled={isPending}
            id="partnersSectionDescription"
            aria-invalid={Boolean(form.formState.errors.partnersSectionDescription)}
            {...form.register('partnersSectionDescription')}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="productsSectionTitle">
            Products title <span aria-hidden="true">*</span>
          </Label>
          <Input
            aria-required="true"
            disabled={isPending}
            id="productsSectionTitle"
            aria-invalid={Boolean(form.formState.errors.productsSectionTitle)}
            {...form.register('productsSectionTitle')}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="productsSectionDescription">Products description</Label>
          <textarea
            className={textareaClassName}
            disabled={isPending}
            id="productsSectionDescription"
            aria-invalid={Boolean(form.formState.errors.productsSectionDescription)}
            {...form.register('productsSectionDescription')}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="servicesSectionTitle">
            Services title <span aria-hidden="true">*</span>
          </Label>
          <Input
            aria-required="true"
            disabled={isPending}
            id="servicesSectionTitle"
            aria-invalid={Boolean(form.formState.errors.servicesSectionTitle)}
            {...form.register('servicesSectionTitle')}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="servicesSectionDescription">Services description</Label>
          <textarea
            className={textareaClassName}
            disabled={isPending}
            id="servicesSectionDescription"
            aria-invalid={Boolean(form.formState.errors.servicesSectionDescription)}
            {...form.register('servicesSectionDescription')}
          />
        </div>
      </section>
      <section className="flex flex-col gap-4 border-t pt-6">
        <h2 className="text-lg font-medium">Why Shammed Group</h2>
        <div className="flex flex-col gap-2">
          <Label htmlFor="whyTitle">
            Title <span aria-hidden="true">*</span>
          </Label>
          <Input
            aria-invalid={Boolean(form.formState.errors.whyTitle)}
            aria-required="true"
            disabled={isPending}
            id="whyTitle"
            {...form.register('whyTitle')}
          />
          {form.formState.errors.whyTitle ? (
            <p className="text-sm text-destructive" role="alert">
              {form.formState.errors.whyTitle.message}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="whyDescription">
            Description <span aria-hidden="true">*</span>
          </Label>
          <textarea
            aria-required="true"
            className={textareaClassName}
            disabled={isPending}
            id="whyDescription"
            aria-invalid={Boolean(form.formState.errors.whyDescription)}
            {...form.register('whyDescription')}
          />
          {form.formState.errors.whyDescription ? (
            <p className="text-sm text-destructive" role="alert">
              {form.formState.errors.whyDescription.message}
            </p>
          ) : null}
        </div>
        <AdminMediaUploadField
          disabled={isPending}
          fileName={whyFileName}
          inputId="whyImageUpload"
          label="Why section image"
          mediaId={form.watch('whyImageMediaId')}
          onClear={() => {
            form.setValue('whyImageMediaId', '');
            setWhyFileName('');
          }}
          onUploaded={({ mediaId, fileName }) => {
            form.setValue('whyImageMediaId', mediaId);
            setWhyFileName(fileName);
          }}
        />
      </section>
      <section className="flex flex-col gap-4 border-t pt-6">
        <h2 className="text-lg font-medium">Contact section</h2>
        <div className="flex flex-col gap-2">
          <Label htmlFor="contactSectionTitle">
            Title <span aria-hidden="true">*</span>
          </Label>
          <Input
            aria-required="true"
            disabled={isPending}
            id="contactSectionTitle"
            aria-invalid={Boolean(form.formState.errors.contactSectionTitle)}
            {...form.register('contactSectionTitle')}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="contactSectionDescription">Description</Label>
          <textarea
            className={textareaClassName}
            disabled={isPending}
            id="contactSectionDescription"
            aria-invalid={Boolean(form.formState.errors.contactSectionDescription)}
            {...form.register('contactSectionDescription')}
          />
        </div>
      </section>
      {serverError ? (
        <p className="text-sm text-destructive" role="alert">
          {serverError}
        </p>
      ) : null}
      {isSuccess ? (
        <p className="text-sm text-muted-foreground" role="status">
          Home page saved successfully.
        </p>
      ) : null}
      <Button disabled={isPending} type="submit">
        {isPending ? 'Saving…' : homePage ? 'Save home page' : 'Create home page'}
      </Button>
    </form>
  );
}
