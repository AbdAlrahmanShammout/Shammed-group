import { useState, type ReactElement } from 'react';

import { AdminReorderableList } from '@/components/layout/admin-reorderable-list';
import { ConfirmActionDialog } from '@/components/layout/confirm-action-dialog';
import { useOrderedAdminList } from '@/components/layout/use-ordered-admin-list';
import { Button } from '@/components/ui/button';
import { ServiceForm } from '@/features/services-admin/components/service-form';
import { useAdminServicesQuery } from '@/features/services-admin/hooks/use-admin-services-query';
import { useDeleteAdminServiceMutation } from '@/features/services-admin/hooks/use-delete-admin-service-mutation';
import { useUpdateAdminServiceMutation } from '@/features/services-admin/hooks/use-update-admin-service-mutation';
import type { ServiceResponse } from '@/generated/admin-service.contract';
import { getNextDisplayOrder } from '@/lib/get-next-display-order';

export function AdminServicesPage(): ReactElement {
  const servicesQuery = useAdminServicesQuery();
  const deleteMutation = useDeleteAdminServiceMutation();
  const updateMutation = useUpdateAdminServiceMutation();
  const [editingService, setEditingService] = useState<ServiceResponse | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [servicePendingDelete, setServicePendingDelete] = useState<ServiceResponse | null>(null);
  const orderedList = useOrderedAdminList({
    items: servicesQuery.data?.services,
    onPersist: async (patches) => {
      await Promise.all(
        patches.map((patch) =>
          updateMutation.mutateAsync({
            serviceId: patch.id,
            body: { displayOrder: patch.displayOrder },
          }),
        ),
      );
    },
  });
  if (servicesQuery.isPending) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-medium">Services</h1>
        <p role="status">Loading services…</p>
      </div>
    );
  }
  if (servicesQuery.isError || !servicesQuery.data) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-medium">Services</h1>
        <p className="text-destructive" role="alert">
          Unable to load services.
        </p>
      </div>
    );
  }
  const { services } = servicesQuery.data;
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-medium">Services</h1>
        <p className="text-muted-foreground">
          Manage company services as free-form CMS entries with visibility and images. Drag the list
          to set display order.
        </p>
      </div>
      {editingService || isCreating ? (
        <ServiceForm
          nextDisplayOrder={getNextDisplayOrder(services)}
          onCancel={() => {
            setEditingService(null);
            setIsCreating(false);
          }}
          onSaved={() => {
            setEditingService(null);
            setIsCreating(false);
          }}
          service={editingService ?? undefined}
        />
      ) : (
        <>
          <div>
            <Button
              onClick={() => {
                setIsCreating(true);
                setEditingService(null);
              }}
              type="button"
            >
              Add service
            </Button>
          </div>
          {services.length === 0 ? (
            <p role="status">No services yet. Add the first service offering.</p>
          ) : (
            <>
              <AdminReorderableList
                disabled={orderedList.isSaving}
                getItemLabel={(service) => service.title}
                items={orderedList.orderedItems}
                onReorder={(nextItems) => {
                  void orderedList.reorder(nextItems);
                }}
                renderItem={(service) => (
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <p className="font-medium">{service.title}</p>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {service.isVisible ? 'Visible' : 'Hidden'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        aria-label={`Edit ${service.title}`}
                        onClick={() => {
                          setEditingService(service);
                          setIsCreating(false);
                        }}
                        type="button"
                        variant="outline"
                      >
                        Edit
                      </Button>
                      <Button
                        aria-label={`Delete ${service.title}`}
                        onClick={() => setServicePendingDelete(service)}
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
          servicePendingDelete
            ? `This permanently deletes “${servicePendingDelete.title}”.`
            : ''
        }
        isPending={deleteMutation.isPending}
        onCancel={() => setServicePendingDelete(null)}
        onConfirm={() => {
          if (!servicePendingDelete) {
            return;
          }
          void deleteMutation.mutateAsync(servicePendingDelete.id).then(() => {
            setServicePendingDelete(null);
          });
        }}
        open={servicePendingDelete !== null}
        title="Delete service?"
      />
    </div>
  );
}
