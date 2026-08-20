import { Trash2, Image, RefreshCw } from 'lucide-react';
import { useState, type ReactElement } from 'react';

import { ConfirmActionDialog } from '@/components/layout/confirm-action-dialog';
import { Button } from '@/components/ui/button';
import { useDeleteAdminMediaMutation } from '@/features/media-admin/hooks/use-delete-admin-media-mutation';
import {
  ADMIN_MEDIA_PAGE_SIZE,
  useAdminMediaQuery,
} from '@/features/media-admin/hooks/use-admin-media-query';
import { usePurgeUnreferencedMediaMutation } from '@/features/media-admin/hooks/use-purge-unreferenced-media-mutation';
import type { MediaResponse } from '@/generated/admin-media.contract';
import { createPublicMediaUrl } from '@/lib/create-public-media-url';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AdminMediaPage(): ReactElement {
  const [offset, setOffset] = useState(0);
  const mediaQuery = useAdminMediaQuery(offset);
  const deleteMutation = useDeleteAdminMediaMutation();
  const purgeMutation = usePurgeUnreferencedMediaMutation();
  const [pendingDelete, setPendingDelete] = useState<MediaResponse | null>(null);
  const [showPurgeConfirm, setShowPurgeConfirm] = useState(false);

  const total = mediaQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / ADMIN_MEDIA_PAGE_SIZE));
  const currentPage = Math.floor(offset / ADMIN_MEDIA_PAGE_SIZE) + 1;

  if (mediaQuery.isPending) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-medium">Media Library</h1>
        <p role="status">Loading media…</p>
      </div>
    );
  }
  if (mediaQuery.isError || !mediaQuery.data) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-medium">Media Library</h1>
        <p className="text-destructive" role="alert">
          Unable to load media.
        </p>
      </div>
    );
  }

  const { mediaList } = mediaQuery.data;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-medium">Media Library</h1>
          <p className="text-muted-foreground">
            {total} file{total !== 1 ? 's' : ''} stored on this server.
          </p>
        </div>
        <Button
          onClick={() => setShowPurgeConfirm(true)}
          type="button"
          variant="outline"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Purge orphaned media
        </Button>
      </div>

      {mediaList.length === 0 ? (
        <p role="status">No media files yet.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {mediaList.map((media) => (
            <li
              className="group relative flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm"
              key={media.id}
            >
              <div className="relative aspect-square w-full overflow-hidden bg-muted">
                <img
                  alt={media.originalFileName}
                  className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                  loading="lazy"
                  src={createPublicMediaUrl(media.id)}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                    (e.currentTarget.nextElementSibling as HTMLElement | null)?.removeAttribute(
                      'hidden',
                    );
                  }}
                />
                <div className="hidden h-full w-full items-center justify-center" aria-hidden="true">
                  <Image className="h-8 w-8 text-muted-foreground opacity-40" />
                </div>
              </div>
              <div className="flex flex-col gap-1 p-2">
                <p
                  className="truncate text-xs font-medium leading-snug"
                  title={media.originalFileName}
                >
                  {media.originalFileName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatBytes(media.byteSize)}
                </p>
                <p className="text-xs text-muted-foreground">
                  ID: {media.id}
                </p>
              </div>
              <div className="border-t p-2">
                <Button
                  aria-label={`Delete ${media.originalFileName}`}
                  className="w-full"
                  disabled={deleteMutation.isPending}
                  onClick={() => setPendingDelete(media)}
                  size="sm"
                  type="button"
                  variant="destructive"
                >
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 ? (
        <div className="flex items-center gap-3">
          <Button
            disabled={offset === 0}
            onClick={() => setOffset(Math.max(0, offset - ADMIN_MEDIA_PAGE_SIZE))}
            type="button"
            variant="outline"
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            disabled={offset + ADMIN_MEDIA_PAGE_SIZE >= total}
            onClick={() => setOffset(offset + ADMIN_MEDIA_PAGE_SIZE)}
            type="button"
            variant="outline"
          >
            Next
          </Button>
        </div>
      ) : null}

      <ConfirmActionDialog
        description={
          pendingDelete
            ? `Permanently delete "${pendingDelete.originalFileName}" (${formatBytes(pendingDelete.byteSize)})? Any entity still using this image will lose it.`
            : ''
        }
        isPending={deleteMutation.isPending}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (!pendingDelete) return;
          void deleteMutation.mutateAsync(pendingDelete.id).then(() => {
            setPendingDelete(null);
          });
        }}
        open={pendingDelete !== null}
        title="Delete media file?"
      />

      <ConfirmActionDialog
        description="This permanently deletes every media file that is not currently attached to any page, partner, product, service, or setting. This cannot be undone."
        isPending={purgeMutation.isPending}
        onCancel={() => setShowPurgeConfirm(false)}
        onConfirm={() => {
          void purgeMutation.mutateAsync().then(() => {
            setShowPurgeConfirm(false);
          });
        }}
        open={showPurgeConfirm}
        title="Purge orphaned media?"
      />
    </div>
  );
}
