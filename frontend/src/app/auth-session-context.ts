import { createContext } from 'react';

export type AuthSessionValue = {
  readonly accessToken: string | null;
  signIn: (accessToken: string) => void;
  signOut: () => void;
};

export const AuthSessionContext = createContext<AuthSessionValue | null>(null);
