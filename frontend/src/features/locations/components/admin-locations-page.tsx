import { useState, type ReactElement } from 'react';

import { ConfirmActionDialog } from '@/components/layout/confirm-action-dialog';
import { Button } from '@/components/ui/button';
import { LocationForm } from '@/features/locations/components/location-form';
import { useAdminLocationsQuery } from '@/features/locations/hooks/use-admin-locations-query';
import { useDeleteAdminLocationMutation } from '@/features/locations/hooks/use-delete-admin-location-mutation';
import type { LocationResponse } from '@/generated/admin-location.contract';

export function AdminLocationsPage(): ReactElement {
  const locationsQuery = useAdminLocationsQuery();
  const deleteMutation = useDeleteAdminLocationMutation();
  const [editingLocation, setEditingLocation] = useState<LocationResponse | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [locationPendingDelete, setLocationPendingDelete] = useState<LocationResponse | null>(null);
  if (locationsQuery.isPending) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-medium">Locations</h1>
        <p role="status">Loading locations…</p>
      </div>
    );
  }
  if (locationsQuery.isError || !locationsQuery.data) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-medium">Locations</h1>
        <p className="text-destructive" role="alert">
          Unable to load locations.
        </p>
      </div>
    );
  }
  const { locations } = locationsQuery.data;
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-medium">Locations</h1>
        <p className="text-muted-foreground">Manage branch addresses, phones, and map details.</p>
      </div>
      {editingLocation || isCreating ? (
        <LocationForm
          location={editingLocation ?? undefined}
          onCancel={() => {
            setEditingLocation(null);
            setIsCreating(false);
          }}
          onSaved={() => {
            setEditingLocation(null);
            setIsCreating(false);
          }}
        />
      ) : (
        <>
          <div>
            <Button
              onClick={() => {
                setIsCreating(true);
                setEditingLocation(null);
              }}
              type="button"
            >
              Add location
            </Button>
          </div>
          {locations.length === 0 ? (
            <p role="status">No locations yet. Add the first branch location.</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {locations.map((location) => (
                <li className="flex flex-col gap-2 border-t pt-4" key={location.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <p className="font-medium">{location.name}</p>
                      <p className="text-sm text-muted-foreground">{location.address}</p>
                      <p className="text-sm text-muted-foreground">
                        {location.isVisible ? 'Visible' : 'Hidden'} · order {location.displayOrder}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          setEditingLocation(location);
                          setIsCreating(false);
                        }}
                        type="button"
                        variant="outline"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => setLocationPendingDelete(location)}
                        type="button"
                        variant="outline"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
      <ConfirmActionDialog
        description={
          locationPendingDelete
            ? `This permanently deletes “${locationPendingDelete.name}” and its phone numbers.`
            : ''
        }
        isPending={deleteMutation.isPending}
        onCancel={() => setLocationPendingDelete(null)}
        onConfirm={() => {
          if (!locationPendingDelete) {
            return;
          }
          void deleteMutation.mutateAsync(locationPendingDelete.id).then(() => {
            setLocationPendingDelete(null);
          });
        }}
        open={locationPendingDelete !== null}
        title="Delete location?"
      />
    </div>
  );
}
