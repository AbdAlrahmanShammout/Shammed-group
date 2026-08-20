import { useMutation } from '@tanstack/react-query';
import { ImagePlus, Replace, Trash2 } from 'lucide-react';
import { useRef, useState, type ReactElement } from 'react';

import { uploadAdminMedia } from '@/api/admin-media.api';
import { ApiError } from '@/api/api-error';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { createPublicMediaUrl } from '@/lib/create-public-media-url';
import { cn } from '@/lib/utils';

type AdminMediaUploadFieldProps = {
  readonly disabled?: boolean;
  readonly fileName?: string;
  readonly inputId: string;
  readonly label: string;
  readonly mediaId: string;
  readonly onClear: () => void;
  readonly onUploaded: (input: { readonly mediaId: string; readonly fileName: string }) => void;
};

function parseMediaId(mediaId: string): number | null {
  if (mediaId.trim() === '') {
    return null;
  }
  const parsedMediaId = Number(mediaId);
  if (!Number.isInteger(parsedMediaId) || parsedMediaId <= 0) {
    return null;
  }
  return parsedMediaId;
}

/**
 * Admin image picker with a small preview and add / replace / remove actions.
 */
export function AdminMediaUploadField({
  disabled = false,
  fileName,
  inputId,
  label,
  mediaId,
  onClear,
  onUploaded,
}: AdminMediaUploadFieldProps): ReactElement {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadAdminMedia(file),
  });
  const isBusy = disabled || uploadMutation.isPending;
  const parsedMediaId = parseMediaId(mediaId);
  const hasMedia = parsedMediaId !== null;
  const previewLabel = fileName && fileName.trim() !== '' ? fileName : label;
  async function onFileChange(fileList: FileList | null): Promise<void> {
    const file = fileList?.[0];
    if (!file) {
      return;
    }
    setLocalError(null);
    try {
      const response = await uploadMutation.mutateAsync(file);
      onUploaded({
        mediaId: String(response.media.id),
        fileName: response.media.originalFileName,
      });
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Unable to upload the selected image.';
      setLocalError(message);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }
  function openFilePicker(): void {
    fileInputRef.current?.click();
  }
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={inputId}>{label}</Label>
      <input
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        disabled={isBusy}
        id={inputId}
        onChange={(event) => {
          void onFileChange(event.target.files);
        }}
        ref={fileInputRef}
        type="file"
      />
      <div
        className={cn(
          'flex flex-col gap-3 rounded-md border border-dashed border-border bg-muted/20 p-3 sm:flex-row sm:items-center',
          hasMedia && 'border-solid bg-background',
        )}
      >
        {hasMedia ? (
          <>
            <div className="size-20 shrink-0 overflow-hidden rounded-md border bg-muted">
              <img
                alt={previewLabel}
                className="size-full object-cover"
                decoding="async"
                src={createPublicMediaUrl(parsedMediaId)}
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{previewLabel}</p>
                <p className="text-xs text-muted-foreground">JPEG, PNG, or WebP · max 5 MB</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  disabled={isBusy}
                  onClick={openFilePicker}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  <Replace aria-hidden="true" />
                  Replace
                </Button>
                <Button
                  disabled={isBusy}
                  onClick={onClear}
                  size="sm"
                  type="button"
                  variant="ghost"
                >
                  <Trash2 aria-hidden="true" />
                  Remove
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex w-full flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-md border border-dashed bg-background text-muted-foreground">
                <ImagePlus aria-hidden="true" className="size-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">No image selected</p>
                <p className="text-xs text-muted-foreground">JPEG, PNG, or WebP · max 5 MB</p>
              </div>
            </div>
            <Button disabled={isBusy} onClick={openFilePicker} size="sm" type="button">
              <ImagePlus aria-hidden="true" />
              Add image
            </Button>
          </div>
        )}
      </div>
      {uploadMutation.isPending ? (
        <p className="text-sm text-muted-foreground" role="status">
          Uploading image…
        </p>
      ) : null}
      {localError ? (
        <p className="text-sm text-destructive" role="alert">
          {localError}
        </p>
      ) : null}
    </div>
  );
}
