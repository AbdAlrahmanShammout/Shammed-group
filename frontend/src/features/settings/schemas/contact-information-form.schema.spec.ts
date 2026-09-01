import { describe, expect, it } from 'vitest';

import { contactInformationFormSchema } from '@/features/settings/schemas/contact-information-form.schema';

describe('contactInformationFormSchema', () => {
  it('requires a label and value for each email and phone', () => {
    const actual = contactInformationFormSchema.safeParse({
      emails: [{ label: '', email: 'not-an-email' }],
      whatsApp: '',
      address: '',
      phones: [{ label: '', phone: '' }],
    });
    expect(actual.success).toBe(false);
    if (actual.success) {
      return;
    }
    expect(actual.error.issues.some((issue) => issue.path.join('.') === 'emails.0.label')).toBe(
      true,
    );
    expect(actual.error.issues.some((issue) => issue.path.join('.') === 'emails.0.email')).toBe(
      true,
    );
    expect(actual.error.issues.some((issue) => issue.path.join('.') === 'phones.0.label')).toBe(
      true,
    );
    expect(actual.error.issues.some((issue) => issue.path.join('.') === 'phones.0.phone')).toBe(
      true,
    );
  });

  it('accepts labeled contact emails and phones', () => {
    const actual = contactInformationFormSchema.parse({
      emails: [
        { label: 'Primary', email: 'info@example.com' },
        { label: 'Sales', email: 'sales@example.com' },
      ],
      whatsApp: '',
      address: 'Damascus',
      phones: [
        { label: 'Primary', phone: '0911111111' },
        { label: 'Sales', phone: '0922222222' },
      ],
    });
    expect(actual.emails).toEqual([
      { label: 'Primary', email: 'info@example.com' },
      { label: 'Sales', email: 'sales@example.com' },
    ]);
    expect(actual.phones).toEqual([
      { label: 'Primary', phone: '0911111111' },
      { label: 'Sales', phone: '0922222222' },
    ]);
  });
});
