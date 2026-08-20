export const queryKeys = {
  admin: {
    auth: {
      session: () => ['admin', 'auth', 'session'] as const,
    },
  },
  public: {
    siteSettings: () => ['public', 'site-settings'] as const,
    socialLinks: () => ['public', 'social-links'] as const,
  },
};
