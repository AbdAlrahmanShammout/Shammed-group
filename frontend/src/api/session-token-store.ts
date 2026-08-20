import { apiConstants } from '@/api/consts';

export const sessionTokenStore = {
  get(): string | null {
    return window.localStorage.getItem(apiConstants.accessTokenStorageKey);
  },
  set(accessToken: string): void {
    window.localStorage.setItem(apiConstants.accessTokenStorageKey, accessToken);
  },
  clear(): void {
    window.localStorage.removeItem(apiConstants.accessTokenStorageKey);
  },
};
