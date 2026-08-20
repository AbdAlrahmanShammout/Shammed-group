import type { LocationFormValues } from '@/features/locations/schemas/location-form.schema';
import type { CreateLocationRequestDto } from '@/generated/admin-location.contract';

export function toLocationRequestBody(values: LocationFormValues): CreateLocationRequestDto {
  const hasCoordinates = values.latitude !== '' && values.longitude !== '';
  return {
    name: values.name,
    address: values.address,
    googleMapsUrl: values.googleMapsUrl === '' ? undefined : values.googleMapsUrl,
    latitude: hasCoordinates ? Number(values.latitude) : null,
    longitude: hasCoordinates ? Number(values.longitude) : null,
    isVisible: values.isVisible,
    displayOrder: values.displayOrder === '' ? 0 : Number(values.displayOrder),
    phones: values.phones.map((phoneItem, index) => ({
      phone: phoneItem.phone,
      displayOrder: index,
    })),
  };
}
