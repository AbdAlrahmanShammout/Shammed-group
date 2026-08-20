import type { ReactElement } from 'react';

import { Button } from '@/components/ui/button';
import type { ProductCategoryResponse } from '@/generated/public-product.contract';
import { cn } from '@/lib/utils';

type ProductCategoryFilterProps = {
  readonly categories: readonly ProductCategoryResponse[];
  readonly selectedCategoryId?: number;
  readonly onSelectCategoryId: (categoryId: number | undefined) => void;
};

export function ProductCategoryFilter({
  categories,
  selectedCategoryId,
  onSelectCategoryId,
}: ProductCategoryFilterProps): ReactElement {
  return (
    <nav aria-label="Product categories">
      <ul className="flex flex-wrap gap-2">
        <li>
          <Button
            aria-pressed={selectedCategoryId === undefined}
            className={cn(selectedCategoryId === undefined && 'bg-accent')}
            onClick={() => onSelectCategoryId(undefined)}
            type="button"
            variant="outline"
          >
            All
          </Button>
        </li>
        {categories.map((category) => (
          <li key={category.id}>
            <Button
              aria-pressed={selectedCategoryId === category.id}
              className={cn(selectedCategoryId === category.id && 'bg-accent')}
              onClick={() => onSelectCategoryId(category.id)}
              type="button"
              variant="outline"
            >
              {category.name}
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
