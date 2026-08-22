import type { ReactElement } from 'react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type ProductSearchFieldProps = {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly className?: string;
  readonly inputClassName?: string;
};

export function ProductSearchField({
  value,
  onChange,
  className,
  inputClassName,
}: ProductSearchFieldProps): ReactElement {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label className="text-sm font-medium" htmlFor="product-search">
        Search products
      </label>
      <Input
        aria-describedby="product-search-description"
        className={inputClassName}
        id="product-search"
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by name, manufacturer, or description"
        type="search"
        value={value}
      />
      <p className="sr-only" id="product-search-description">
        Filters products by name, manufacturer, or description.
      </p>
    </div>
  );
}
