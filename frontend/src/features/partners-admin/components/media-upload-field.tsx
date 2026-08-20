import { useRef, useState, type ReactElement } from 'react';

import { ApiError } from '@/api/api-error';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useUploadAdminMediaMutation } from '@/features/partners-admin/hooks/use-upload-admin-media-mutation';

type MediaUploadFieldProps = {
  readonly disabled?: boolean;
  readonly fileName?: string;
  readonly inputId: string;
  readonly label: string;
  readonly mediaId: string;
  readonly onClear: () => void;
  readonly onUploaded: (input: { readonly mediaId: string; readonly fileName: string }) => void;
};

export function MediaUploadField({
  disabled = false,
  fileName,
  inputId,
  label,
  mediaId,
  onClear,
  onUploaded,
}: MediaUploadFieldProps): ReactElement {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const uploadMutation = useUploadAdminMediaMutation();
  const isBusy = disabled || uploadMutation.isPending;
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
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={inputId}>{label}</Label>
      <input
        accept="image/jpeg,image/png,image/webp"
        className="block w-full text-sm"
        disabled={isBusy}
        id={inputId}
        onChange={(event) => {
          void onFileChange(event.target.files);
        }}
        ref={fileInputRef}
        type="file"
      />
      {mediaId !== '' ? (
        <p className="text-sm text-muted-foreground">
          Media ID {mediaId}
          {fileName ? ` · ${fileName}` : ''}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">
          Optional. JPEG, PNG, or WebP up to 5 MB. Public image URLs are not available yet.
        </p>
      )}
      {mediaId !== '' ? (
        <Button disabled={isBusy} onClick={onClear} type="button" variant="outline">
          Clear image
        </Button>
      ) : null}
      {uploadMutation.isPending ? <p role="status">Uploading image…</p> : null}
      {localError ? (
        <p className="text-sm text-destructive" role="alert">
          {localError}
        </p>
      ) : null}
    </div>
  );
}
