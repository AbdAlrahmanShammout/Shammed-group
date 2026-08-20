import { describe, expect, it } from 'vitest';

import { socialLinkFormSchema } from '@/features/social-links/schemas/social-link-form.schema';

describe('socialLinkFormSchema', () => {
  it('rejects a URL without a protocol', () => {
    const actual = socialLinkFormSchema.safeParse({
      platform: 'LinkedIn',
      url: 'linkedin.com/company/example',
      isVisible: true,
      displayOrder: '0',
    });
    expect(actual.success).toBe(false);
    if (actual.success) {
      return;
    }
    expect(actual.error.issues[0]?.message).toBe(
      'Enter a valid URL including http:// or https://',
    );
  });

  it('accepts an https URL', () => {
    const actual = socialLinkFormSchema.safeParse({
      platform: 'LinkedIn',
      url: 'https://linkedin.com/company/example',
      isVisible: true,
      displayOrder: '0',
    });
    expect(actual.success).toBe(true);
  });
});
