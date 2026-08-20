import { useState, type ReactElement } from 'react';

import { ConfirmActionDialog } from '@/components/layout/confirm-action-dialog';
import { Button } from '@/components/ui/button';
import { SocialLinkForm } from '@/features/social-links/components/social-link-form';
import { useAdminSocialLinksQuery } from '@/features/social-links/hooks/use-admin-social-links-query';
import { useDeleteAdminSocialLinkMutation } from '@/features/social-links/hooks/use-delete-admin-social-link-mutation';
import type { SocialLinkResponse } from '@/generated/admin-social-link.contract';

export function AdminSocialLinksPage(): ReactElement {
  const socialLinksQuery = useAdminSocialLinksQuery();
  const deleteMutation = useDeleteAdminSocialLinkMutation();
  const [editingSocialLink, setEditingSocialLink] = useState<SocialLinkResponse | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [socialLinkPendingDelete, setSocialLinkPendingDelete] = useState<SocialLinkResponse | null>(
    null,
  );
  if (socialLinksQuery.isPending) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-medium">Social Media</h1>
        <p role="status">Loading social links…</p>
      </div>
    );
  }
  if (socialLinksQuery.isError || !socialLinksQuery.data) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-medium">Social Media</h1>
        <p className="text-destructive" role="alert">
          Unable to load social links.
        </p>
      </div>
    );
  }
  const { socialLinks } = socialLinksQuery.data;
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-medium">Social Media</h1>
        <p className="text-muted-foreground">Manage platform URLs and visibility.</p>
      </div>
      {editingSocialLink || isCreating ? (
        <SocialLinkForm
          onCancel={() => {
            setEditingSocialLink(null);
            setIsCreating(false);
          }}
          onSaved={() => {
            setEditingSocialLink(null);
            setIsCreating(false);
          }}
          socialLink={editingSocialLink ?? undefined}
        />
      ) : (
        <>
          <div>
            <Button
              onClick={() => {
                setIsCreating(true);
                setEditingSocialLink(null);
              }}
              type="button"
            >
              Add social link
            </Button>
          </div>
          {socialLinks.length === 0 ? (
            <p role="status">No social links yet. Add the first platform URL.</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {socialLinks.map((socialLink) => (
                <li className="flex flex-col gap-2 border-t pt-4" key={socialLink.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <p className="font-medium">{socialLink.platform}</p>
                      <p className="text-sm break-all text-muted-foreground">{socialLink.url}</p>
                      <p className="text-sm text-muted-foreground">
                        {socialLink.isVisible ? 'Visible' : 'Hidden'} · order{' '}
                        {socialLink.displayOrder}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        aria-label={`Edit ${socialLink.platform} link`}
                        onClick={() => {
                          setEditingSocialLink(socialLink);
                          setIsCreating(false);
                        }}
                        type="button"
                        variant="outline"
                      >
                        Edit
                      </Button>
                      <Button
                        aria-label={`Delete ${socialLink.platform} link`}
                        onClick={() => setSocialLinkPendingDelete(socialLink)}
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
          socialLinkPendingDelete
            ? `This permanently deletes the ${socialLinkPendingDelete.platform} link.`
            : ''
        }
        isPending={deleteMutation.isPending}
        onCancel={() => setSocialLinkPendingDelete(null)}
        onConfirm={() => {
          if (!socialLinkPendingDelete) {
            return;
          }
          void deleteMutation.mutateAsync(socialLinkPendingDelete.id).then(() => {
            setSocialLinkPendingDelete(null);
          });
        }}
        open={socialLinkPendingDelete !== null}
        title="Delete social link?"
      />
    </div>
  );
}
