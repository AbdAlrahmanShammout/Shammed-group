import { zodResolver } from '@hookform/resolvers/zod';
import { Reorder, useDragControls } from 'framer-motion';
import { GripVertical } from 'lucide-react';
import { useEffect, useState, type ReactElement } from 'react';
import { useFieldArray, useForm, type UseFormRegisterReturn } from 'react-hook-form';

import { ApiError } from '@/api/api-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateAdminSiteSettingsMutation } from '@/features/settings/hooks/use-update-admin-site-settings-mutation';
import { toContactInformationRequest } from '@/features/settings/lib/to-contact-information-request';
import {
  contactInformationFormSchema,
  type ContactInformationFormValues,
} from '@/features/settings/schemas/contact-information-form.schema';
import type { SiteSettingsResponse } from '@/generated/admin-site-settings.contract';
import { cn } from '@/lib/utils';

const textareaClassName = cn(
  'min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs outline-none md:text-sm',
  'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
  'aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20',
);

type ContactLabeledReorderItemProps = {
  readonly canRemove: boolean;
  readonly field: { readonly id: string };
  readonly index: number;
  readonly isPending: boolean;
  readonly itemName: string;
  readonly labelError?: string;
  readonly onRemove: () => void;
  readonly placeholder: string;
  readonly registerLabel: UseFormRegisterReturn;
  readonly registerValue: UseFormRegisterReturn;
  readonly valueError?: string;
  readonly valueInputType?: string;
  readonly valueLabel: string;
};

function ContactLabeledReorderItem({
  canRemove,
  field,
  index,
  isPending,
  itemName,
  labelError,
  onRemove,
  placeholder,
  registerLabel,
  registerValue,
  valueError,
  valueInputType = 'text',
  valueLabel,
}: ContactLabeledReorderItemProps): ReactElement {
  const dragControls = useDragControls();
  const itemNumber = index + 1;
  return (
    <Reorder.Item
      className="list-none"
      dragControls={dragControls}
      dragListener={false}
      value={field}
    >
      <div className="flex flex-col gap-2 rounded-md border p-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium">
            {itemName} {itemNumber}
          </p>
          <button
            aria-label={`Drag to reorder ${itemName.toLowerCase()} ${itemNumber}`}
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
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor={`contact-${itemName.toLowerCase()}-label-${index}`}>
            Label <span aria-hidden="true">*</span>
          </Label>
          <Input
            aria-invalid={Boolean(labelError)}
            aria-required="true"
            disabled={isPending}
            id={`contact-${itemName.toLowerCase()}-label-${index}`}
            placeholder={placeholder}
            {...registerLabel}
          />
          {labelError ? (
            <p className="text-sm text-destructive" role="alert">
              {labelError}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor={`contact-${itemName.toLowerCase()}-value-${index}`}>
            {valueLabel} <span aria-hidden="true">*</span>
          </Label>
          <div className="flex gap-2">
            <Input
              aria-invalid={Boolean(valueError)}
              aria-required="true"
              disabled={isPending}
              id={`contact-${itemName.toLowerCase()}-value-${index}`}
              type={valueInputType}
              {...registerValue}
            />
            <Button disabled={isPending || !canRemove} onClick={onRemove} type="button" variant="outline">
              Remove
            </Button>
          </div>
          {valueError ? (
            <p className="text-sm text-destructive" role="alert">
              {valueError}
            </p>
          ) : null}
        </div>
      </div>
    </Reorder.Item>
  );
}

type ContactInformationFormProps = {
  readonly siteSettings: SiteSettingsResponse;
};

function createDefaultValues(siteSettings: SiteSettingsResponse): ContactInformationFormValues {
  return {
    emails:
      siteSettings.emails && siteSettings.emails.length > 0
        ? siteSettings.emails.map((emailItem) => ({
            label: emailItem.label,
            email: emailItem.email,
          }))
        : [{ label: 'Primary', email: siteSettings.email }],
    whatsApp: siteSettings.whatsApp ?? '',
    address: siteSettings.address ?? '',
    phones:
      siteSettings.phones && siteSettings.phones.length > 0
        ? siteSettings.phones.map((phoneItem) => ({
            label: phoneItem.label,
            phone: phoneItem.phone,
          }))
        : [{ label: 'Primary', phone: siteSettings.phone }],
  };
}

export function ContactInformationForm({
  siteSettings,
}: ContactInformationFormProps): ReactElement {
  const [isSuccess, setIsSuccess] = useState(false);
  const updateMutation = useUpdateAdminSiteSettingsMutation();
  const form = useForm<ContactInformationFormValues>({
    resolver: zodResolver(contactInformationFormSchema),
    defaultValues: createDefaultValues(siteSettings),
  });
  const emailsFieldArray = useFieldArray({ control: form.control, name: 'emails' });
  const phonesFieldArray = useFieldArray({ control: form.control, name: 'phones' });
  useEffect(() => {
    form.reset(createDefaultValues(siteSettings));
  }, [form, siteSettings]);
  const serverError =
    updateMutation.error instanceof ApiError ? updateMutation.error.message : null;
  async function onSubmit(values: ContactInformationFormValues): Promise<void> {
    setIsSuccess(false);
    try {
      await updateMutation.mutateAsync(toContactInformationRequest(values));
      setIsSuccess(true);
    } catch (error) {
      if (error instanceof ApiError) {
        for (const validationError of error.validationErrorObjects) {
          const fieldName = validationError.property as keyof ContactInformationFormValues;
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
      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-medium">Email addresses</legend>
        <p className="text-sm text-muted-foreground">
          Add a label such as Primary, Sales, or Accounting, then the address. Drag to change
          display order. The first address is also used as the main company email.
        </p>
        <Reorder.Group
          axis="y"
          className="flex flex-col gap-3"
          onReorder={(nextFields) => {
            const currentEmails = form.getValues('emails');
            const emailByFieldId = new Map(
              emailsFieldArray.fields.map((field, index) => [field.id, currentEmails[index]]),
            );
            emailsFieldArray.replace(
              nextFields.map((field) => emailByFieldId.get(field.id) ?? { label: '', email: '' }),
            );
          }}
          values={emailsFieldArray.fields}
        >
          {emailsFieldArray.fields.map((field, index) => (
            <ContactLabeledReorderItem
              canRemove={emailsFieldArray.fields.length > 1}
              field={field}
              index={index}
              isPending={updateMutation.isPending}
              itemName="Email"
              key={field.id}
              labelError={form.formState.errors.emails?.[index]?.label?.message}
              onRemove={() => emailsFieldArray.remove(index)}
              placeholder="Primary, Sales, Accounting…"
              registerLabel={form.register(`emails.${index}.label`)}
              registerValue={form.register(`emails.${index}.email`)}
              valueError={form.formState.errors.emails?.[index]?.email?.message}
              valueInputType="email"
              valueLabel="Email address"
            />
          ))}
        </Reorder.Group>
        {form.formState.errors.emails?.root ? (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.emails.root.message}
          </p>
        ) : null}
        <Button
          disabled={updateMutation.isPending}
          onClick={() => emailsFieldArray.append({ label: '', email: '' })}
          type="button"
          variant="outline"
        >
          Add email
        </Button>
      </fieldset>
      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-medium">Phone numbers</legend>
        <p className="text-sm text-muted-foreground">
          Add a label such as Primary, Sales, or Accounting, then the number. Drag to change display
          order. The first number is also used as the main company phone.
        </p>
        <Reorder.Group
          axis="y"
          className="flex flex-col gap-3"
          onReorder={(nextFields) => {
            const currentPhones = form.getValues('phones');
            const phoneByFieldId = new Map(
              phonesFieldArray.fields.map((field, index) => [field.id, currentPhones[index]]),
            );
            phonesFieldArray.replace(
              nextFields.map((field) => phoneByFieldId.get(field.id) ?? { label: '', phone: '' }),
            );
          }}
          values={phonesFieldArray.fields}
        >
          {phonesFieldArray.fields.map((field, index) => (
            <ContactLabeledReorderItem
              canRemove={phonesFieldArray.fields.length > 1}
              field={field}
              index={index}
              isPending={updateMutation.isPending}
              itemName="Phone"
              key={field.id}
              labelError={form.formState.errors.phones?.[index]?.label?.message}
              onRemove={() => phonesFieldArray.remove(index)}
              placeholder="Primary, Sales, Accounting…"
              registerLabel={form.register(`phones.${index}.label`)}
              registerValue={form.register(`phones.${index}.phone`)}
              valueError={form.formState.errors.phones?.[index]?.phone?.message}
              valueLabel="Phone number"
            />
          ))}
        </Reorder.Group>
        {form.formState.errors.phones?.root ? (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.phones.root.message}
          </p>
        ) : null}
        <Button
          disabled={updateMutation.isPending}
          onClick={() => phonesFieldArray.append({ label: '', phone: '' })}
          type="button"
          variant="outline"
        >
          Add phone
        </Button>
      </fieldset>
      <div className="flex flex-col gap-2">
        <Label htmlFor="whatsApp">WhatsApp</Label>
        <Input disabled={updateMutation.isPending} id="whatsApp" {...form.register('whatsApp')} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="address">Address</Label>
        <textarea
          className={textareaClassName}
          disabled={updateMutation.isPending}
          id="address"
          {...form.register('address')}
        />
      </div>
      {serverError ? (
        <p className="text-sm text-destructive" role="alert">
          {serverError}
        </p>
      ) : null}
      {isSuccess ? (
        <p className="text-sm text-muted-foreground" role="status">
          Contact information saved successfully.
        </p>
      ) : null}
      <Button disabled={updateMutation.isPending} type="submit">
        {updateMutation.isPending ? 'Saving…' : 'Save contact information'}
      </Button>
    </form>
  );
}
