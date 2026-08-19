import type { ReactElement } from 'react';

import { AppProviders } from '@/app/app-providers';
import { AppRouter } from '@/app/app-router';

export function App(): ReactElement {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}
