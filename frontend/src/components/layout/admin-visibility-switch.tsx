import type { ReactElement } from 'react';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

type AdminVisibilitySwitchProps = {
  readonly checked: boolean;
  readonly disabled?: boolean;
  readonly entityLabel: string;
  readonly itemId: number;
  readonly onCheckedChange: (isVisible: boolean) => void;
};

/**
 * List-row visibility toggle placed beside Edit / Delete actions.
 */
export function AdminVisibilitySwitch({
  checked,
  disabled = false,
  entityLabel,
  itemId,
  onCheckedChange,
}: AdminVisibilitySwitchProps): ReactElement {
  const switchId = `visibility-switch-${itemId}`;
  return (
    <div className="flex h-9 items-center gap-2 rounded-md border px-2">
      <Switch
        aria-label={`${checked ? 'Hide' : 'Show'} ${entityLabel} on the public site`}
        checked={checked}
        disabled={disabled}
        id={switchId}
        onCheckedChange={onCheckedChange}
      />
      <Label className="cursor-pointer text-sm font-normal" htmlFor={switchId}>
        {checked ? 'Visible' : 'Hidden'}
      </Label>
    </div>
  );
}
