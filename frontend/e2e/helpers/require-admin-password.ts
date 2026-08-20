export function requireAdminPassword(): string {
  const password = process.env.E2E_ADMIN_PASSWORD;
  if (!password) {
    throw new Error(
      'E2E_ADMIN_PASSWORD (or ADMIN_PASSWORD in backend/.env) is required for admin e2e journeys.',
    );
  }
  return password;
}
