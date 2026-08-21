import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, type ReactElement } from 'react';
import { useForm } from 'react-hook-form';

import { ApiError } from '@/api/api-error';
import { AdminFormSectionCard } from '@/components/layout/admin-form-section-card';
import { AdminMediaUploadField } from '@/components/media/admin-media-upload-field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HomeCmsSectionNav } from '@/features/home-admin/components/home-cms-section-nav';
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
    whyEyebrow: homePage?.whyEyebrow ?? 'Our identity',
    whyReason1Title: homePage?.whyReason1Title ?? '',
    whyReason1Description: homePage?.whyReason1Description ?? '',
    whyReason2Title: homePage?.whyReason2Title ?? '',
    whyReason2Description: homePage?.whyReason2Description ?? '',
    whyReason3Title: homePage?.whyReason3Title ?? '',
    whyReason3Description: homePage?.whyReason3Description ?? '',
    whyReason4Title: homePage?.whyReason4Title ?? '',
    whyReason4Description: homePage?.whyReason4Description ?? '',
    whyImageMediaId: homePage?.whyImageMediaId?.toString() ?? '',
    heroEyebrow: homePage?.heroEyebrow ?? 'FORMULATION / 01 — SYRIA',
    aboutEyebrow: homePage?.aboutEyebrow ?? 'About us',
    aboutMetric1Value: homePage?.aboutMetric1Value ?? '',
    aboutMetric1Label: homePage?.aboutMetric1Label ?? '',
    aboutMetric2Value: homePage?.aboutMetric2Value ?? '',
    aboutMetric2Label: homePage?.aboutMetric2Label ?? '',
    aboutMetric3Value: homePage?.aboutMetric3Value ?? '',
    aboutMetric3Label: homePage?.aboutMetric3Label ?? '',
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
    <form className="flex flex-col gap-6" noValidate onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        <aside className="w-full shrink-0 lg:sticky lg:top-6 lg:w-56">
          <HomeCmsSectionNav />
        </aside>
        <div className="flex min-w-0 flex-1 flex-col gap-6 lg:max-w-3xl">
      <AdminFormSectionCard
        description="Top-of-page headline, supporting copy, image, and call-to-action buttons."
        id="home-cms-hero"
        title="Hero"
        tone="muted"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="heroEyebrow">
            Eyebrow label <span aria-hidden="true">*</span>
          </Label>
          <Input
            aria-invalid={Boolean(form.formState.errors.heroEyebrow)}
            aria-required="true"
            disabled={isPending}
            id="heroEyebrow"
            {...form.register('heroEyebrow')}
          />
          {form.formState.errors.heroEyebrow ? (
            <p className="text-sm text-destructive" role="alert">
              {form.formState.errors.heroEyebrow.message}
            </p>
          ) : null}
        </div>
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
              aria-invalid={Boolean(form.formState.errors.primaryCtaText)}
              aria-required="true"
              disabled={isPending}
              id="primaryCtaText"
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
              aria-invalid={Boolean(form.formState.errors.primaryCtaUrl)}
              aria-required="true"
              disabled={isPending}
              id="primaryCtaUrl"
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
              aria-invalid={Boolean(form.formState.errors.secondaryCtaText)}
              aria-required="true"
              disabled={isPending}
              id="secondaryCtaText"
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
              aria-invalid={Boolean(form.formState.errors.secondaryCtaUrl)}
              aria-required="true"
              disabled={isPending}
              id="secondaryCtaUrl"
              {...form.register('secondaryCtaUrl')}
            />
            {form.formState.errors.secondaryCtaUrl ? (
              <p className="text-sm text-destructive" role="alert">
                {form.formState.errors.secondaryCtaUrl.message}
              </p>
            ) : null}
          </div>
        </div>
      </AdminFormSectionCard>
      <AdminFormSectionCard
        description="Short about teaser shown below the hero on the public home page."
        id="home-cms-about"
        title="About preview"
        tone="secondary"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="aboutEyebrow">
            Eyebrow label <span aria-hidden="true">*</span>
          </Label>
          <Input
            aria-invalid={Boolean(form.formState.errors.aboutEyebrow)}
            aria-required="true"
            disabled={isPending}
            id="aboutEyebrow"
            {...form.register('aboutEyebrow')}
          />
          {form.formState.errors.aboutEyebrow ? (
            <p className="text-sm text-destructive" role="alert">
              {form.formState.errors.aboutEyebrow.message}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="aboutPreviewTitle">
            Title <span aria-hidden="true">*</span>
          </Label>
          <Input
            aria-invalid={Boolean(form.formState.errors.aboutPreviewTitle)}
            aria-required="true"
            disabled={isPending}
            id="aboutPreviewTitle"
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
            aria-invalid={Boolean(form.formState.errors.aboutPreviewDescription)}
            aria-required="true"
            className={textareaClassName}
            disabled={isPending}
            id="aboutPreviewDescription"
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
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium">Brand metrics (3 stat items)</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {([
              { n: 1 as const, valuePlaceholder: '40+',  labelPlaceholder: 'Years in healthcare' },
              { n: 2 as const, valuePlaceholder: '300+', labelPlaceholder: 'Products & equipment' },
              { n: 3 as const, valuePlaceholder: '100%', labelPlaceholder: 'Syria coverage' },
            ]).map(({ n, valuePlaceholder, labelPlaceholder }) => (
              <div className="flex flex-col gap-2 rounded-lg border border-border/70 bg-background/60 p-3" key={n}>
                <p className="text-xs font-medium text-muted-foreground">Metric {n}</p>
                <Input
                  aria-label={`Metric ${n} value`}
                  disabled={isPending}
                  placeholder={valuePlaceholder}
                  {...form.register(`aboutMetric${n}Value` as const)}
                />
                <Input
                  aria-label={`Metric ${n} label`}
                  disabled={isPending}
                  placeholder={labelPlaceholder}
                  {...form.register(`aboutMetric${n}Label` as const)}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="aboutPreviewCtaText">
              CTA text <span aria-hidden="true">*</span>
            </Label>
            <Input
              aria-invalid={Boolean(form.formState.errors.aboutPreviewCtaText)}
              aria-required="true"
              disabled={isPending}
              id="aboutPreviewCtaText"
              {...form.register('aboutPreviewCtaText')}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="aboutPreviewCtaUrl">
              CTA URL <span aria-hidden="true">*</span>
            </Label>
            <Input
              aria-invalid={Boolean(form.formState.errors.aboutPreviewCtaUrl)}
              aria-required="true"
              disabled={isPending}
              id="aboutPreviewCtaUrl"
              {...form.register('aboutPreviewCtaUrl')}
            />
          </div>
        </div>
      </AdminFormSectionCard>
      <AdminFormSectionCard
        description="Titles and descriptions for catalog previews. Partner, product, and service rows still come from Catalog visibility."
        id="home-cms-catalog"
        title="Catalog section titles"
        tone="accent"
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="flex flex-col gap-4 rounded-lg border border-border/70 bg-background/80 p-4">
            <h3 className="text-sm font-medium">Partners</h3>
            <div className="flex flex-col gap-2">
              <Label htmlFor="partnersSectionTitle">
                Title <span aria-hidden="true">*</span>
              </Label>
              <Input
                aria-invalid={Boolean(form.formState.errors.partnersSectionTitle)}
                aria-required="true"
                disabled={isPending}
                id="partnersSectionTitle"
                {...form.register('partnersSectionTitle')}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="partnersSectionDescription">Description</Label>
              <textarea
                aria-invalid={Boolean(form.formState.errors.partnersSectionDescription)}
                className={textareaClassName}
                disabled={isPending}
                id="partnersSectionDescription"
                {...form.register('partnersSectionDescription')}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 rounded-lg border border-border/70 bg-background/80 p-4">
            <h3 className="text-sm font-medium">Products</h3>
            <div className="flex flex-col gap-2">
              <Label htmlFor="productsSectionTitle">
                Title <span aria-hidden="true">*</span>
              </Label>
              <Input
                aria-invalid={Boolean(form.formState.errors.productsSectionTitle)}
                aria-required="true"
                disabled={isPending}
                id="productsSectionTitle"
                {...form.register('productsSectionTitle')}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="productsSectionDescription">Description</Label>
              <textarea
                aria-invalid={Boolean(form.formState.errors.productsSectionDescription)}
                className={textareaClassName}
                disabled={isPending}
                id="productsSectionDescription"
                {...form.register('productsSectionDescription')}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 rounded-lg border border-border/70 bg-background/80 p-4">
            <h3 className="text-sm font-medium">Services</h3>
            <div className="flex flex-col gap-2">
              <Label htmlFor="servicesSectionTitle">
                Title <span aria-hidden="true">*</span>
              </Label>
              <Input
                aria-invalid={Boolean(form.formState.errors.servicesSectionTitle)}
                aria-required="true"
                disabled={isPending}
                id="servicesSectionTitle"
                {...form.register('servicesSectionTitle')}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="servicesSectionDescription">Description</Label>
              <textarea
                aria-invalid={Boolean(form.formState.errors.servicesSectionDescription)}
                className={textareaClassName}
                disabled={isPending}
                id="servicesSectionDescription"
                {...form.register('servicesSectionDescription')}
              />
            </div>
          </div>
        </div>
      </AdminFormSectionCard>
      <AdminFormSectionCard
        description="Reasons-to-choose section with optional supporting image."
        id="home-cms-why"
        title="Why Shammed Group"
        tone="muted"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="whyEyebrow">
            Eyebrow label <span aria-hidden="true">*</span>
          </Label>
          <Input
            aria-invalid={Boolean(form.formState.errors.whyEyebrow)}
            aria-required="true"
            disabled={isPending}
            id="whyEyebrow"
            {...form.register('whyEyebrow')}
          />
          {form.formState.errors.whyEyebrow ? (
            <p className="text-sm text-destructive" role="alert">
              {form.formState.errors.whyEyebrow.message}
            </p>
          ) : null}
        </div>
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
            aria-invalid={Boolean(form.formState.errors.whyDescription)}
            aria-required="true"
            className={textareaClassName}
            disabled={isPending}
            id="whyDescription"
            {...form.register('whyDescription')}
          />
          {form.formState.errors.whyDescription ? (
            <p className="text-sm text-destructive" role="alert">
              {form.formState.errors.whyDescription.message}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium">Reasons (4 items)</p>
          <div className="flex flex-col gap-3">
            {([
              {
                n: 1 as const,
                titlePlaceholder: 'Quality-Certified Portfolio',
                descPlaceholder:
                  'Every product meets rigorous international pharmaceutical and healthcare quality standards.',
              },
              {
                n: 2 as const,
                titlePlaceholder: 'Trusted Global Partnerships',
                descPlaceholder:
                  'Direct distribution agreements with leading European and international manufacturers.',
              },
              {
                n: 3 as const,
                titlePlaceholder: 'Decades of Regional Expertise',
                descPlaceholder:
                  'Established networks and deep market knowledge across the MENA region since our founding.',
              },
              {
                n: 4 as const,
                titlePlaceholder: 'Reliable Supply Chain',
                descPlaceholder:
                  'Consistent product availability backed by efficient logistics and responsive service.',
              },
            ]).map(({ n, titlePlaceholder, descPlaceholder }) => (
              <div className="flex flex-col gap-2 rounded-lg border border-border/70 bg-background/60 p-3" key={n}>
                <p className="text-xs font-medium text-muted-foreground">Reason {n}</p>
                <Input
                  aria-label={`Reason ${n} title`}
                  disabled={isPending}
                  placeholder={titlePlaceholder}
                  {...form.register(`whyReason${n}Title` as const)}
                />
                <textarea
                  aria-label={`Reason ${n} description`}
                  className={textareaClassName}
                  disabled={isPending}
                  placeholder={descPlaceholder}
                  {...form.register(`whyReason${n}Description` as const)}
                />
              </div>
            ))}
          </div>
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
      </AdminFormSectionCard>
      <AdminFormSectionCard
        description="Closing contact prompt shown on the public home page."
        id="home-cms-contact"
        title="Contact section"
        tone="secondary"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="contactSectionTitle">
            Title <span aria-hidden="true">*</span>
          </Label>
          <Input
            aria-invalid={Boolean(form.formState.errors.contactSectionTitle)}
            aria-required="true"
            disabled={isPending}
            id="contactSectionTitle"
            {...form.register('contactSectionTitle')}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="contactSectionDescription">Description</Label>
          <textarea
            aria-invalid={Boolean(form.formState.errors.contactSectionDescription)}
            className={textareaClassName}
            disabled={isPending}
            id="contactSectionDescription"
            {...form.register('contactSectionDescription')}
          />
        </div>
      </AdminFormSectionCard>
      <div className="sticky bottom-0 z-10 border-t border-border/80 bg-background/95 py-4 backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-h-5">
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
          </div>
          <Button disabled={isPending} type="submit">
            {isPending ? 'Saving…' : homePage ? 'Save home page' : 'Create home page'}
          </Button>
        </div>
      </div>
        </div>
      </div>
    </form>
  );
}
