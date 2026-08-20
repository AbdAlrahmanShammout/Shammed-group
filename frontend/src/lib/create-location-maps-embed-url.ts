type LocationMapsEmbedInput = {
  readonly googleMapsUrl?: string;
  readonly latitude?: number;
  readonly longitude?: number;
};

/**
 * Builds a Google Maps iframe `src` from coordinates or an existing maps URL.
 */
export function createLocationMapsEmbedUrl(
  location: LocationMapsEmbedInput,
): string | undefined {
  if (location.latitude !== undefined && location.longitude !== undefined) {
    return `https://maps.google.com/maps?q=${location.latitude},${location.longitude}&z=15&output=embed`;
  }
  if (!location.googleMapsUrl) {
    return undefined;
  }
  if (location.googleMapsUrl.includes('output=embed')) {
    return location.googleMapsUrl;
  }
  const separator = location.googleMapsUrl.includes('?') ? '&' : '?';
  return `${location.googleMapsUrl}${separator}output=embed`;
}
