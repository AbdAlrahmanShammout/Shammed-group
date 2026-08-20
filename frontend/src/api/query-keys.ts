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
    productCategories: () => ['public', 'product-categories'] as const,
    products: (filters: { readonly categoryId?: number } = {}) =>
      ['public', 'products', filters] as const,
    product: (productId: number) => ['public', 'product', productId] as const,
  },
};
