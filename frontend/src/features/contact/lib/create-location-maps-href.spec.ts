import { describe, expect, it } from 'vitest';

import { createLocationMapsHref } from '@/features/contact/lib/create-location-maps-href';
import type { LocationResponse } from '@/generated/public-contact.contract';

const baseLocation: LocationResponse = {
  id: 1,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  name: 'Damascus office',
  address: 'Mazzeh, Damascus',
  isVisible: true,
  isMapVisible: true,
  displayOrder: 0,
  phones: [],
};

describe('createLocationMapsHref', () => {
  it('prefers the Google Maps URL when present', () => {
    const actual = createLocationMapsHref({
      ...baseLocation,
      googleMapsUrl: 'https://maps.google.com/?q=damascus',
      latitude: 33.5,
      longitude: 36.2,
    });
    expect(actual).toBe('https://maps.google.com/?q=damascus');
  });
  it('builds a maps query from coordinates when no URL exists', () => {
    const actual = createLocationMapsHref({
      ...baseLocation,
      latitude: 33.5138,
      longitude: 36.2765,
    });
    expect(actual).toBe('https://www.google.com/maps?q=33.5138,36.2765');
  });
  it('returns undefined when neither URL nor coordinates exist', () => {
    expect(createLocationMapsHref(baseLocation)).toBeUndefined();
  });
});
