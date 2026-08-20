import { Reorder, useDragControls } from 'framer-motion';
import { GripVertical } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';

import { cn } from '@/lib/utils';

type AdminReorderableListProps<T extends { readonly id: number }> = {
  readonly disabled?: boolean;
  readonly getItemLabel: (item: T) => string;
  readonly items: readonly T[];
  readonly onReorder: (items: T[]) => void;
  readonly renderItem: (item: T) => ReactNode;
};

type AdminReorderableItemProps<T extends { readonly id: number }> = {
  readonly disabled?: boolean;
  readonly item: T;
  readonly label: string;
  readonly renderItem: (item: T) => ReactNode;
};

function AdminReorderableItem<T extends { readonly id: number }>({
  disabled = false,
  item,
  label,
  renderItem,
}: AdminReorderableItemProps<T>): ReactElement {
  const dragControls = useDragControls();
  return (
    <Reorder.Item
      className="list-none border-t bg-background pt-4"
      dragListener={false}
      dragControls={dragControls}
      value={item}
    >
      <div className="flex items-start gap-3">
        <button
          aria-label={`Drag to reorder ${label}`}
          className={cn(
            'mt-1 inline-flex size-9 shrink-0 cursor-grab items-center justify-center rounded-md text-muted-foreground',
            'hover:bg-accent hover:text-accent-foreground active:cursor-grabbing',
            'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
            disabled && 'pointer-events-none opacity-50',
          )}
          disabled={disabled}
          onPointerDown={(event) => {
            if (disabled) {
              return;
            }
            dragControls.start(event);
          }}
          type="button"
        >
          <GripVertical aria-hidden="true" className="size-4" />
        </button>
        <div className="min-w-0 flex-1">{renderItem(item)}</div>
      </div>
    </Reorder.Item>
  );
}

/**
 * Drag-and-drop list for admin display-order management.
 */
export function AdminReorderableList<T extends { readonly id: number }>({
  disabled = false,
  getItemLabel,
  items,
  onReorder,
  renderItem,
}: AdminReorderableListProps<T>): ReactElement {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground">Drag items to change display order.</p>
      <Reorder.Group
        axis="y"
        className="flex flex-col gap-4"
        onReorder={onReorder}
        values={[...items]}
      >
        {items.map((item) => (
          <AdminReorderableItem
            disabled={disabled}
            item={item}
            key={item.id}
            label={getItemLabel(item)}
            renderItem={renderItem}
          />
        ))}
      </Reorder.Group>
    </div>
  );
}
