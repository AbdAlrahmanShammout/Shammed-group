export const queryKeys = {
  admin: {
    auth: {
      session: () => ['admin', 'auth', 'session'] as const,
    },
  },
  public: {
    siteSettings: () => ['public', 'site-settings'] as const,
    socialLinks: () => ['public', 'social-links'] as const,
    homePage: () => ['public', 'home-page'] as const,
    aboutPage: () => ['public', 'about-page'] as const,
    partners: () => ['public', 'partners'] as const,
  },
};
