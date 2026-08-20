import type { ReactElement } from 'react';

import { Button } from '@/components/ui/button';

type ConfirmActionDialogProps = {
  readonly confirmLabel?: string;
  readonly description: string;
  readonly isPending?: boolean;
  readonly onCancel: () => void;
  readonly onConfirm: () => void;
  readonly open: boolean;
  readonly title: string;
};

export function ConfirmActionDialog({
  confirmLabel = 'Delete',
  description,
  isPending = false,
  onCancel,
  onConfirm,
  open,
  title,
}: ConfirmActionDialogProps): ReactElement | null {
  if (!open) {
    return null;
  }
  return (
    <div
      aria-describedby="confirm-action-description"
      aria-labelledby="confirm-action-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="alertdialog"
    >
      <div className="w-full max-w-md rounded-md border bg-background p-6 shadow-lg">
        <h2 className="text-lg font-medium" id="confirm-action-title">
          {title}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground" id="confirm-action-description">
          {description}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button disabled={isPending} onClick={onCancel} type="button" variant="outline">
            Cancel
          </Button>
          <Button disabled={isPending} onClick={onConfirm} type="button" variant="destructive">
            {isPending ? 'Working…' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
