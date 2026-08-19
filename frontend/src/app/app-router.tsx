import type { ReactElement } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { RootPage } from '@/pages/root-page';

export function AppRouter(): ReactElement {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootPage />} path="/" />
      </Routes>
    </BrowserRouter>
  );
}
