import { useRef, useState, type ReactElement } from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { ProductCategoryResponse } from '@/generated/admin-product-category.contract';
import { useDialogAccessibility } from '@/lib/a11y/use-dialog-accessibility';

type CategoryReplacementDialogProps = {
  readonly category: ProductCategoryResponse;
  readonly isPending?: boolean;
  readonly onCancel: () => void;
  readonly onConfirm: (replacementCategoryId: number) => void;
  readonly replacementOptions: readonly ProductCategoryResponse[];
  readonly serverError?: string | null;
};

export function CategoryReplacementDialog({
  category,
  isPending = false,
  onCancel,
  onConfirm,
  replacementOptions,
  serverError = null,
}: CategoryReplacementDialogProps): ReactElement {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [replacementCategoryId, setReplacementCategoryId] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  useDialogAccessibility({
    containerRef: dialogRef,
    isOpen: true,
    onEscape: onCancel,
  });
  function handleConfirm(): void {
    const parsed = Number(replacementCategoryId);
    if (!Number.isInteger(parsed) || parsed < 1) {
      setLocalError('Select a replacement category.');
      return;
    }
    setLocalError(null);
    onConfirm(parsed);
  }
  return (
    <div
      aria-describedby="category-replacement-description"
      aria-labelledby="category-replacement-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      ref={dialogRef}
      role="alertdialog"
    >
      <div className="w-full max-w-md rounded-md border bg-background p-6 shadow-lg">
        <h2 className="text-lg font-medium" id="category-replacement-title">
          Move products before deleting
        </h2>
        <p className="mt-2 text-sm text-muted-foreground" id="category-replacement-description">
          “{category.name}” still has products. Choose another category to receive them, then
          delete.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <Label htmlFor="replacementCategoryId">Replacement category</Label>
          <select
            className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            disabled={isPending}
            id="replacementCategoryId"
            onChange={(event) => setReplacementCategoryId(event.target.value)}
            value={replacementCategoryId}
          >
            <option value="">Select a category</option>
            {replacementOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
        {localError ? (
          <p className="mt-2 text-sm text-destructive" role="alert">
            {localError}
          </p>
        ) : null}
        {serverError ? (
          <p className="mt-2 text-sm text-destructive" role="alert">
            {serverError}
          </p>
        ) : null}
        <div className="mt-6 flex justify-end gap-3">
          <Button disabled={isPending} onClick={onCancel} type="button" variant="outline">
            Cancel
          </Button>
          <Button disabled={isPending} onClick={handleConfirm} type="button" variant="destructive">
            {isPending ? 'Working…' : 'Reassign and delete'}
          </Button>
        </div>
      </div>
    </div>
  );
}
