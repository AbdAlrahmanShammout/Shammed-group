import { describe, expect, it } from 'vitest';

import { createLocationMapsEmbedUrl } from '@/lib/create-location-maps-embed-url';

describe('createLocationMapsEmbedUrl', () => {
  it('builds an embed URL from coordinates', () => {
    const actual = createLocationMapsEmbedUrl({
      latitude: 33.52353,
      longitude: 36.29287,
      googleMapsUrl: 'https://www.google.com/maps?q=33.52353,36.29287',
    });
    expect(actual).toBe(
      'https://maps.google.com/maps?q=33.52353,36.29287&z=15&output=embed',
    );
  });
  it('appends output=embed to an existing maps URL when coordinates are missing', () => {
    const actual = createLocationMapsEmbedUrl({
      googleMapsUrl: 'https://www.google.com/maps?q=Damascus',
    });
    expect(actual).toBe('https://www.google.com/maps?q=Damascus&output=embed');
  });
  it('returns undefined when neither URL nor coordinates exist', () => {
    expect(createLocationMapsEmbedUrl({})).toBeUndefined();
  });
});
