import type { ReactElement } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from '@/features/auth/components/login-form';

type AdminLoginPageProps = {
  readonly onSignedIn: (accessToken: string) => void;
};

export function AdminLoginPage({ onSignedIn }: AdminLoginPageProps): ReactElement {
  return (
    <main className="flex min-h-svh items-center justify-center p-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>
            <h1 className="text-xl font-semibold">Admin sign in</h1>
          </CardTitle>
          <CardDescription>Enter the administrator password to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm onSignedIn={onSignedIn} />
        </CardContent>
      </Card>
    </main>
  );
}
