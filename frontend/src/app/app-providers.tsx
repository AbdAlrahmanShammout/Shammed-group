import { QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactElement, type ReactNode } from 'react';

import { createQueryClient } from '@/config/query-client';

type AppProvidersProps = {
  readonly children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps): ReactElement {
  const [queryClient] = useState(createQueryClient);
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
