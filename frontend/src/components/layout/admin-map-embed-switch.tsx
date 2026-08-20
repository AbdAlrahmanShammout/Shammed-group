import type { ReactElement } from 'react';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

type AdminMapEmbedSwitchProps = {
  readonly checked: boolean;
  readonly disabled?: boolean;
  readonly entityLabel: string;
  readonly itemId: number;
  readonly onCheckedChange: (isMapVisible: boolean) => void;
};

/**
 * List-row toggle for whether a location's Google Map embed is shown publicly.
 */
export function AdminMapEmbedSwitch({
  checked,
  disabled = false,
  entityLabel,
  itemId,
  onCheckedChange,
}: AdminMapEmbedSwitchProps): ReactElement {
  const switchId = `map-embed-switch-${itemId}`;
  return (
    <div className="flex h-9 items-center gap-2 rounded-md border px-2">
      <Switch
        aria-label={`${checked ? 'Hide' : 'Show'} Google Map for ${entityLabel}`}
        checked={checked}
        disabled={disabled}
        id={switchId}
        onCheckedChange={onCheckedChange}
      />
      <Label className="cursor-pointer text-sm font-normal" htmlFor={switchId}>
        {checked ? 'Map on' : 'Map off'}
      </Label>
    </div>
  );
}
