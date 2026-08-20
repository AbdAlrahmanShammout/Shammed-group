import { useState, type ReactElement } from 'react';

import { AdminReorderableList } from '@/components/layout/admin-reorderable-list';
import { ConfirmActionDialog } from '@/components/layout/confirm-action-dialog';
import { useOrderedAdminList } from '@/components/layout/use-ordered-admin-list';
import { Button } from '@/components/ui/button';
import { LocationForm } from '@/features/locations/components/location-form';
import { useAdminLocationsQuery } from '@/features/locations/hooks/use-admin-locations-query';
import { useDeleteAdminLocationMutation } from '@/features/locations/hooks/use-delete-admin-location-mutation';
import { useUpdateAdminLocationMutation } from '@/features/locations/hooks/use-update-admin-location-mutation';
import type { LocationResponse } from '@/generated/admin-location.contract';
import { getNextDisplayOrder } from '@/lib/get-next-display-order';

export function AdminLocationsPage(): ReactElement {
  const locationsQuery = useAdminLocationsQuery();
  const deleteMutation = useDeleteAdminLocationMutation();
  const updateMutation = useUpdateAdminLocationMutation();
  const [editingLocation, setEditingLocation] = useState<LocationResponse | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [locationPendingDelete, setLocationPendingDelete] = useState<LocationResponse | null>(null);
  const orderedList = useOrderedAdminList({
    items: locationsQuery.data?.locations,
    onPersist: async (patches) => {
      await Promise.all(
        patches.map((patch) =>
          updateMutation.mutateAsync({
            locationId: patch.id,
            body: { displayOrder: patch.displayOrder },
          }),
        ),
      );
    },
  });
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
        <p className="text-muted-foreground">
          Manage branch addresses, phones, and map details. Drag the list to set display order.
        </p>
      </div>
      {editingLocation || isCreating ? (
        <LocationForm
          location={editingLocation ?? undefined}
          nextDisplayOrder={getNextDisplayOrder(locations)}
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
            <>
              <AdminReorderableList
                disabled={orderedList.isSaving}
                getItemLabel={(location) => location.name}
                items={orderedList.orderedItems}
                onReorder={(nextItems) => {
                  void orderedList.reorder(nextItems);
                }}
                renderItem={(location) => (
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <p className="font-medium">{location.name}</p>
                      <p className="text-sm text-muted-foreground">{location.address}</p>
                      <p className="text-sm text-muted-foreground">
                        {location.isVisible ? 'Visible' : 'Hidden'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        aria-label={`Edit ${location.name}`}
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
                        aria-label={`Delete ${location.name}`}
                        onClick={() => setLocationPendingDelete(location)}
                        type="button"
                        variant="outline"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              />
              {orderedList.isSaving ? (
                <p className="text-sm text-muted-foreground" role="status">
                  Saving order…
                </p>
              ) : null}
              {orderedList.error ? (
                <p className="text-sm text-destructive" role="alert">
                  {orderedList.error}
                </p>
              ) : null}
            </>
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
