import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, type ReactElement } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import { ApiError } from '@/api/api-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateAdminLocationMutation } from '@/features/locations/hooks/use-create-admin-location-mutation';
import { useUpdateAdminLocationMutation } from '@/features/locations/hooks/use-update-admin-location-mutation';
import { toLocationRequestBody } from '@/features/locations/lib/to-location-request-body';
import {
  locationFormSchema,
  type LocationFormValues,
} from '@/features/locations/schemas/location-form.schema';
import type { LocationResponse } from '@/generated/admin-location.contract';
import { cn } from '@/lib/utils';

const textareaClassName = cn(
  'min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs outline-none md:text-sm',
  'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
  'aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20',
);

type LocationFormProps = {
  readonly location?: LocationResponse;
  readonly onCancel?: () => void;
  readonly onSaved?: () => void;
};

function createDefaultValues(location?: LocationResponse): LocationFormValues {
  return {
    name: location?.name ?? '',
    address: location?.address ?? '',
    googleMapsUrl: location?.googleMapsUrl ?? '',
    latitude: location?.latitude?.toString() ?? '',
    longitude: location?.longitude?.toString() ?? '',
    isVisible: location?.isVisible ?? true,
    displayOrder: location?.displayOrder?.toString() ?? '0',
    phones: location?.phones.map((phoneItem) => ({ phone: phoneItem.phone })) ?? [{ phone: '' }],
  };
}

export function LocationForm({ location, onCancel, onSaved }: LocationFormProps): ReactElement {
  const [isSuccess, setIsSuccess] = useState(false);
  const createMutation = useCreateAdminLocationMutation();
  const updateMutation = useUpdateAdminLocationMutation();
  const isPending = createMutation.isPending || updateMutation.isPending;
  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: createDefaultValues(location),
  });
  const phonesFieldArray = useFieldArray({ control: form.control, name: 'phones' });
  useEffect(() => {
    form.reset(createDefaultValues(location));
  }, [form, location]);
  const serverError =
    createMutation.error instanceof ApiError
      ? createMutation.error.message
      : updateMutation.error instanceof ApiError
        ? updateMutation.error.message
        : null;
  async function onSubmit(values: LocationFormValues): Promise<void> {
    setIsSuccess(false);
    const body = toLocationRequestBody(values);
    try {
      if (location) {
        await updateMutation.mutateAsync({
          locationId: location.id,
          body: {
            ...body,
            googleMapsUrl: values.googleMapsUrl === '' ? null : values.googleMapsUrl,
          },
        });
      } else {
        await createMutation.mutateAsync(body);
        form.reset(createDefaultValues());
      }
      setIsSuccess(true);
      onSaved?.();
    } catch (error) {
      if (error instanceof ApiError) {
        for (const validationError of error.validationErrorObjects) {
          const fieldName = validationError.property as keyof LocationFormValues;
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
        <Label htmlFor="locationName">
          Location name <span aria-hidden="true">*</span>
        </Label>
        <Input
          aria-invalid={Boolean(form.formState.errors.name)}
          aria-required="true"
          disabled={isPending}
          id="locationName"
          {...form.register('name')}
        />
        {form.formState.errors.name ? (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.name.message}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="locationAddress">
          Address <span aria-hidden="true">*</span>
        </Label>
        <textarea
          aria-invalid={Boolean(form.formState.errors.address)}
          aria-required="true"
          className={textareaClassName}
          disabled={isPending}
          id="locationAddress"
          {...form.register('address')}
        />
        {form.formState.errors.address ? (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.address.message}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="googleMapsUrl">Google Maps URL</Label>
        <Input disabled={isPending} id="googleMapsUrl" type="url" {...form.register('googleMapsUrl')} />
        {form.formState.errors.googleMapsUrl ? (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.googleMapsUrl.message}
          </p>
        ) : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="latitude">Latitude</Label>
          <Input disabled={isPending} id="latitude" inputMode="decimal" {...form.register('latitude')} />
          {form.formState.errors.latitude ? (
            <p className="text-sm text-destructive" role="alert">
              {form.formState.errors.latitude.message}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            disabled={isPending}
            id="longitude"
            inputMode="decimal"
            {...form.register('longitude')}
          />
          {form.formState.errors.longitude ? (
            <p className="text-sm text-destructive" role="alert">
              {form.formState.errors.longitude.message}
            </p>
          ) : null}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="locationDisplayOrder">Display order</Label>
        <Input
          disabled={isPending}
          id="locationDisplayOrder"
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
      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-medium">Phone numbers</legend>
        {phonesFieldArray.fields.map((field, index) => (
          <div className="flex flex-col gap-2" key={field.id}>
            <Label htmlFor={`location-phone-${index}`}>
              Phone {index + 1} <span aria-hidden="true">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                aria-invalid={Boolean(form.formState.errors.phones?.[index]?.phone)}
                aria-required="true"
                disabled={isPending}
                id={`location-phone-${index}`}
                {...form.register(`phones.${index}.phone`)}
              />
              <Button
                disabled={isPending || phonesFieldArray.fields.length <= 1}
                onClick={() => phonesFieldArray.remove(index)}
                type="button"
                variant="outline"
              >
                Remove
              </Button>
            </div>
            {form.formState.errors.phones?.[index]?.phone ? (
              <p className="text-sm text-destructive" role="alert">
                {form.formState.errors.phones[index]?.phone?.message}
              </p>
            ) : null}
          </div>
        ))}
        {form.formState.errors.phones?.root ? (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.phones.root.message}
          </p>
        ) : null}
        <Button
          disabled={isPending}
          onClick={() => phonesFieldArray.append({ phone: '' })}
          type="button"
          variant="outline"
        >
          Add phone
        </Button>
      </fieldset>
      {serverError ? (
        <p className="text-sm text-destructive" role="alert">
          {serverError}
        </p>
      ) : null}
      {isSuccess ? (
        <p className="text-sm text-muted-foreground" role="status">
          Location saved successfully.
        </p>
      ) : null}
      <div className="flex gap-3">
        <Button disabled={isPending} type="submit">
          {isPending ? 'Saving…' : location ? 'Save location' : 'Add location'}
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
