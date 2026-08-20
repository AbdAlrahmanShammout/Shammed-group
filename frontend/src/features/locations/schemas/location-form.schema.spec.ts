import { describe, expect, it } from 'vitest';

import { locationFormSchema } from '@/features/locations/schemas/location-form.schema';

describe('locationFormSchema', () => {
  it('rejects coordinates when only latitude is provided', () => {
    const actual = locationFormSchema.safeParse({
      name: 'Damascus',
      address: 'Mazzeh',
      googleMapsUrl: '',
      latitude: '33.5',
      longitude: '',
      isVisible: true,
      displayOrder: '0',
      phones: [{ phone: '+963' }],
    });
    expect(actual.success).toBe(false);
    if (actual.success) {
      return;
    }
    expect(actual.error.issues[0]?.message).toBe(
      'Latitude and longitude must both be provided or both omitted',
    );
  });

  it('accepts a complete location payload', () => {
    const actual = locationFormSchema.safeParse({
      name: 'Damascus',
      address: 'Mazzeh',
      googleMapsUrl: 'https://maps.google.com/?q=33.5,36.2',
      latitude: '33.5',
      longitude: '36.2',
      isVisible: true,
      displayOrder: '0',
      phones: [{ phone: '+963' }],
    });
    expect(actual.success).toBe(true);
  });
});
