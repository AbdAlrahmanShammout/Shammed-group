import { useState, type ReactElement } from 'react';

import { AdminReorderableList } from '@/components/layout/admin-reorderable-list';
import { AdminVisibilitySwitch } from '@/components/layout/admin-visibility-switch';
import { ConfirmActionDialog } from '@/components/layout/confirm-action-dialog';
import { useOrderedAdminList } from '@/components/layout/use-ordered-admin-list';
import { AdminListMediaThumb } from '@/components/media/admin-list-media-thumb';
import { Button } from '@/components/ui/button';
import { PartnerForm } from '@/features/partners-admin/components/partner-form';
import { useAdminPartnersQuery } from '@/features/partners-admin/hooks/use-admin-partners-query';
import { useDeleteAdminPartnerMutation } from '@/features/partners-admin/hooks/use-delete-admin-partner-mutation';
import { useUpdateAdminPartnerMutation } from '@/features/partners-admin/hooks/use-update-admin-partner-mutation';
import type { PartnerResponse } from '@/generated/admin-partner.contract';
import { getNextDisplayOrder } from '@/lib/get-next-display-order';

export function AdminPartnersPage(): ReactElement {
  const partnersQuery = useAdminPartnersQuery();
  const deleteMutation = useDeleteAdminPartnerMutation();
  const updateMutation = useUpdateAdminPartnerMutation();
  const [editingPartner, setEditingPartner] = useState<PartnerResponse | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [partnerPendingDelete, setPartnerPendingDelete] = useState<PartnerResponse | null>(null);
  const [visibilityPendingId, setVisibilityPendingId] = useState<number | null>(null);
  const orderedList = useOrderedAdminList({
    items: partnersQuery.data?.partners,
    onPersist: async (patches) => {
      await Promise.all(
        patches.map((patch) =>
          updateMutation.mutateAsync({
            partnerId: patch.id,
            body: { displayOrder: patch.displayOrder },
          }),
        ),
      );
    },
  });
  async function onVisibilityChange(partner: PartnerResponse, isVisible: boolean): Promise<void> {
    setVisibilityPendingId(partner.id);
    try {
      await updateMutation.mutateAsync({
        partnerId: partner.id,
        body: { isVisible },
      });
    } finally {
      setVisibilityPendingId(null);
    }
  }
  if (partnersQuery.isPending) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-medium">Partners</h1>
        <p role="status">Loading partners…</p>
      </div>
    );
  }
  if (partnersQuery.isError || !partnersQuery.data) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-medium">Partners</h1>
        <p className="text-destructive" role="alert">
          Unable to load partners.
        </p>
      </div>
    );
  }
  const { partners } = partnersQuery.data;
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-medium">Partners</h1>
        <p className="text-muted-foreground">
          Manage partner profiles, visibility, and logos. Drag the list to set display order.
        </p>
      </div>
      {editingPartner || isCreating ? (
        <PartnerForm
          nextDisplayOrder={getNextDisplayOrder(partners)}
          onCancel={() => {
            setEditingPartner(null);
            setIsCreating(false);
          }}
          onSaved={() => {
            setEditingPartner(null);
            setIsCreating(false);
          }}
          partner={editingPartner ?? undefined}
        />
      ) : (
        <>
          <div>
            <Button
              onClick={() => {
                setIsCreating(true);
                setEditingPartner(null);
              }}
              type="button"
            >
              Add partner
            </Button>
          </div>
          {partners.length === 0 ? (
            <p role="status">No partners yet. Add the first partner profile.</p>
          ) : (
            <>
              <AdminReorderableList
                disabled={orderedList.isSaving}
                getItemLabel={(partner) => partner.name}
                items={orderedList.orderedItems}
                onReorder={(nextItems) => {
                  void orderedList.reorder(nextItems);
                }}
                renderItem={(partner) => (
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <AdminListMediaThumb
                        alt={`${partner.name} logo`}
                        mediaId={partner.logoMediaId}
                        objectFit="contain"
                      />
                      <div className="flex min-w-0 flex-col gap-1">
                        <p className="font-medium">{partner.name}</p>
                        <p className="text-sm text-muted-foreground">{partner.shortDescription}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <AdminVisibilitySwitch
                        checked={partner.isVisible}
                        disabled={visibilityPendingId === partner.id || orderedList.isSaving}
                        entityLabel={partner.name}
                        itemId={partner.id}
                        onCheckedChange={(isVisible) => {
                          void onVisibilityChange(partner, isVisible);
                        }}
                      />
                      <Button
                        aria-label={`Edit ${partner.name}`}
                        onClick={() => {
                          setEditingPartner(partner);
                          setIsCreating(false);
                        }}
                        type="button"
                        variant="outline"
                      >
                        Edit
                      </Button>
                      <Button
                        aria-label={`Delete ${partner.name}`}
                        onClick={() => setPartnerPendingDelete(partner)}
                        type="button"
                        variant="destructive"
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
          partnerPendingDelete
            ? `This permanently deletes “${partnerPendingDelete.name}”.`
            : ''
        }
        isPending={deleteMutation.isPending}
        onCancel={() => setPartnerPendingDelete(null)}
        onConfirm={() => {
          if (!partnerPendingDelete) {
            return;
          }
          void deleteMutation.mutateAsync(partnerPendingDelete.id).then(() => {
            setPartnerPendingDelete(null);
          });
        }}
        open={partnerPendingDelete !== null}
        title="Delete partner?"
      />
    </div>
  );
}
