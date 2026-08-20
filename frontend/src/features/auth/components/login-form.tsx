import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { ReactElement } from 'react';

import { ApiError } from '@/api/api-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLoginMutation } from '@/features/auth/hooks/use-login-mutation';
import {
  loginFormSchema,
  type LoginFormValues,
} from '@/features/auth/schemas/login-form.schema';

type LoginFormProps = {
  readonly onSignedIn: (accessToken: string) => void;
};

export function LoginForm({ onSignedIn }: LoginFormProps): ReactElement {
  const loginMutation = useLoginMutation();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { password: '' },
  });
  const serverError = loginMutation.error instanceof ApiError ? loginMutation.error.message : null;
  async function onSubmit(values: LoginFormValues): Promise<void> {
    try {
      const result = await loginMutation.mutateAsync({ password: values.password });
      onSignedIn(result.accessToken);
    } catch {
      return;
    }
  }
  return (
    <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={Boolean(form.formState.errors.password)}
          disabled={loginMutation.isPending}
          {...form.register('password')}
        />
        {form.formState.errors.password ? (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.password.message}
          </p>
        ) : null}
      </div>
      {serverError ? (
        <p className="text-sm text-destructive" role="alert">
          {serverError}
        </p>
      ) : null}
      <Button disabled={loginMutation.isPending} type="submit">
        {loginMutation.isPending ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  );
}
