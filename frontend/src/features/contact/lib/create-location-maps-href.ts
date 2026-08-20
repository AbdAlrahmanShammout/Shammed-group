import type { LocationResponse } from '@/generated/public-contact.contract';

export function createLocationMapsHref(location: LocationResponse): string | undefined {
  if (location.googleMapsUrl) {
    return location.googleMapsUrl;
  }
  if (location.latitude !== undefined && location.longitude !== undefined) {
    return `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
  }
  return undefined;
}
