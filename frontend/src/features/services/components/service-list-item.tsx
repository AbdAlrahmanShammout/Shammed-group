import type { ReactElement } from 'react';

import type { ServiceResponse } from '@/generated/public-service.contract';

type ServiceListItemProps = {
  readonly service: ServiceResponse;
};

export function ServiceListItem({ service }: ServiceListItemProps): ReactElement {
  return (
    <li className="flex flex-col gap-2 border-b py-8 last:border-b-0">
      <h2 className="text-2xl font-medium">{service.title}</h2>
      <p className="max-w-3xl whitespace-pre-wrap text-muted-foreground">{service.description}</p>
    </li>
  );
}
