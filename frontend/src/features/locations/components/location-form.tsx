import { zodResolver } from '@hookform/resolvers/zod';
import { Reorder, useDragControls } from 'framer-motion';
import { GripVertical } from 'lucide-react';
import { useEffect, useState, type ReactElement } from 'react';
import { useFieldArray, useForm, type UseFormRegisterReturn } from 'react-hook-form';

import { ApiError } from '@/api/api-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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

type LocationPhoneReorderItemProps = {
  readonly canRemove: boolean;
  readonly field: { readonly id: string };
  readonly index: number;
  readonly isPending: boolean;
  readonly onRemove: () => void;
  readonly phoneError?: string;
  readonly registerPhone: UseFormRegisterReturn;
};
function LocationPhoneReorderItem({
  canRemove,
  field,
  index,
  isPending,
  onRemove,
  phoneError,
  registerPhone,
}: LocationPhoneReorderItemProps): ReactElement {
  const dragControls = useDragControls();
  return (
    <Reorder.Item
      className="list-none"
      dragControls={dragControls}
      dragListener={false}
      value={field}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor={`location-phone-${index}`}>
          Phone {index + 1} <span aria-hidden="true">*</span>
        </Label>
        <div className="flex gap-2">
          <button
            aria-label={`Drag to reorder phone ${index + 1}`}
            className={cn(
              'inline-flex size-9 shrink-0 cursor-grab items-center justify-center rounded-md text-muted-foreground',
              'hover:bg-accent hover:text-accent-foreground active:cursor-grabbing',
              'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
              isPending && 'pointer-events-none opacity-50',
            )}
            disabled={isPending}
            onPointerDown={(event) => {
              if (isPending) {
                return;
              }
              dragControls.start(event);
            }}
            type="button"
          >
            <GripVertical aria-hidden="true" className="size-4" />
          </button>
          <Input
            aria-invalid={Boolean(phoneError)}
            aria-required="true"
            disabled={isPending}
            id={`location-phone-${index}`}
            {...registerPhone}
          />
          <Button disabled={isPending || !canRemove} onClick={onRemove} type="button" variant="outline">
            Remove
          </Button>
        </div>
        {phoneError ? (
          <p className="text-sm text-destructive" role="alert">
            {phoneError}
          </p>
        ) : null}
      </div>
    </Reorder.Item>
  );
}

type LocationFormProps = {
  readonly location?: LocationResponse;
  readonly nextDisplayOrder?: number;
  readonly onCancel?: () => void;
  readonly onSaved?: () => void;
};

function createDefaultValues(
  location?: LocationResponse,
  nextDisplayOrder = 0,
): LocationFormValues {
  return {
    name: location?.name ?? '',
    address: location?.address ?? '',
    googleMapsUrl: location?.googleMapsUrl ?? '',
    latitude: location?.latitude?.toString() ?? '',
    longitude: location?.longitude?.toString() ?? '',
    isVisible: location?.isVisible ?? true,
    isMapVisible: location?.isMapVisible ?? true,
    displayOrder: location?.displayOrder?.toString() ?? String(nextDisplayOrder),
    phones: location?.phones.map((phoneItem) => ({ phone: phoneItem.phone })) ?? [{ phone: '' }],
  };
}

export function LocationForm({
  location,
  nextDisplayOrder = 0,
  onCancel,
  onSaved,
}: LocationFormProps): ReactElement {
  const [isSuccess, setIsSuccess] = useState(false);
  const createMutation = useCreateAdminLocationMutation();
  const updateMutation = useUpdateAdminLocationMutation();
  const isPending = createMutation.isPending || updateMutation.isPending;
  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: createDefaultValues(location, nextDisplayOrder),
  });
  const phonesFieldArray = useFieldArray({ control: form.control, name: 'phones' });
  useEffect(() => {
    form.reset(createDefaultValues(location, nextDisplayOrder));
  }, [form, location, nextDisplayOrder]);
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
        form.reset(createDefaultValues(undefined, nextDisplayOrder));
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

      <div className="flex flex-col gap-3">
        <div className="flex h-9 items-center gap-2 rounded-md border px-2">
          <Switch
            checked={form.watch('isVisible')}
            disabled={isPending}
            id="locationIsVisible"
            onCheckedChange={(isVisible) => {
              form.setValue('isVisible', isVisible, { shouldDirty: true });
            }}
          />
          <Label className="cursor-pointer text-sm font-normal" htmlFor="locationIsVisible">
            Visible on the public site
          </Label>
        </div>
        <div className="flex h-9 items-center gap-2 rounded-md border px-2">
          <Switch
            checked={form.watch('isMapVisible')}
            disabled={isPending}
            id="locationIsMapVisible"
            onCheckedChange={(isMapVisible) => {
              form.setValue('isMapVisible', isMapVisible, { shouldDirty: true });
            }}
          />
          <Label className="cursor-pointer text-sm font-normal" htmlFor="locationIsMapVisible">
            Show Google Map embed in the footer
          </Label>
        </div>
      </div>
      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-medium">Phone numbers</legend>
        <p className="text-sm text-muted-foreground">Drag phones to change their display order.</p>
        <Reorder.Group
          axis="y"
          className="flex flex-col gap-3"
          onReorder={(nextFields) => {
            const currentPhones = form.getValues('phones');
            const phoneByFieldId = new Map(
              phonesFieldArray.fields.map((field, index) => [field.id, currentPhones[index]]),
            );
            phonesFieldArray.replace(
              nextFields.map((field) => phoneByFieldId.get(field.id) ?? { phone: '' }),
            );
          }}
          values={phonesFieldArray.fields}
        >
          {phonesFieldArray.fields.map((field, index) => (
            <LocationPhoneReorderItem
              canRemove={phonesFieldArray.fields.length > 1}
              field={field}
              index={index}
              isPending={isPending}
              key={field.id}
              onRemove={() => phonesFieldArray.remove(index)}
              phoneError={form.formState.errors.phones?.[index]?.phone?.message}
              registerPhone={form.register(`phones.${index}.phone`)}
            />
          ))}
        </Reorder.Group>
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
