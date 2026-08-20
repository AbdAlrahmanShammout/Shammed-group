import { useState, type ReactElement } from 'react';

import { ConfirmActionDialog } from '@/components/layout/confirm-action-dialog';
import { Button } from '@/components/ui/button';
import { PartnerForm } from '@/features/partners-admin/components/partner-form';
import { useAdminPartnersQuery } from '@/features/partners-admin/hooks/use-admin-partners-query';
import { useDeleteAdminPartnerMutation } from '@/features/partners-admin/hooks/use-delete-admin-partner-mutation';
import type { PartnerResponse } from '@/generated/admin-partner.contract';

export function AdminPartnersPage(): ReactElement {
  const partnersQuery = useAdminPartnersQuery();
  const deleteMutation = useDeleteAdminPartnerMutation();
  const [editingPartner, setEditingPartner] = useState<PartnerResponse | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [partnerPendingDelete, setPartnerPendingDelete] = useState<PartnerResponse | null>(null);
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
          Manage partner profiles, visibility, display order, and logos.
        </p>
      </div>
      {editingPartner || isCreating ? (
        <PartnerForm
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
            <ul className="flex flex-col gap-4">
              {partners.map((partner) => (
                <li className="flex flex-col gap-2 border-t pt-4" key={partner.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <p className="font-medium">{partner.name}</p>
                      <p className="text-sm text-muted-foreground">{partner.shortDescription}</p>
                      <p className="text-sm text-muted-foreground">
                        {partner.isVisible ? 'Visible' : 'Hidden'} · order {partner.displayOrder}
                      </p>
                    </div>
                    <div className="flex gap-2">
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
