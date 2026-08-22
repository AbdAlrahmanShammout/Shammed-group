import type { ReactElement } from 'react';

import type { PartnerResponse } from '@/generated/public-partner.contract';
import { cn } from '@/lib/utils';

const selectClassName =
  'h-9 w-full min-w-[12rem] rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&_option]:bg-background [&_option]:text-foreground';

type ProductPartnerFilterProps = {
  readonly partners: readonly PartnerResponse[];
  readonly selectedPartnerId?: number;
  readonly onSelectPartnerId: (partnerId: number | undefined) => void;
  readonly className?: string;
  readonly selectClassName?: string;
};

export function ProductPartnerFilter({
  partners,
  selectedPartnerId,
  onSelectPartnerId,
  className,
  selectClassName: selectClassNameOverride,
}: ProductPartnerFilterProps): ReactElement {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label className="text-sm font-medium" htmlFor="product-partner-filter">
        Partner
      </label>
      <select
        className={cn(selectClassName, selectClassNameOverride)}
        id="product-partner-filter"
        onChange={(event) => {
          const value = event.target.value;
          if (value === '') {
            onSelectPartnerId(undefined);
            return;
          }
          onSelectPartnerId(Number.parseInt(value, 10));
        }}
        value={selectedPartnerId === undefined ? '' : String(selectedPartnerId)}
      >
        <option value="">All partners</option>
        {partners.map((partner) => (
          <option key={partner.id} value={partner.id}>
            {partner.name}
          </option>
        ))}
      </select>
    </div>
  );
}
