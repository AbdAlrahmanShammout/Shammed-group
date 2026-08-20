export type AdminNavItem = {
  readonly label: string;
  readonly path: string;
};

export type AdminNavGroup = {
  readonly label: string;
  readonly items: readonly AdminNavItem[];
};
