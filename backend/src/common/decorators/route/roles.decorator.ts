import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

export const Roles = <TRole extends string>(
  ...roles: TRole[]
): ReturnType<typeof SetMetadata> => SetMetadata(ROLES_KEY, roles);
