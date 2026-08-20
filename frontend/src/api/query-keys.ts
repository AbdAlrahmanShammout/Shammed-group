export const queryKeys = {
  admin: {
    auth: {
      session: () => ['admin', 'auth', 'session'] as const,
    },
  },
};
