import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { Principal } from '@/common/auth/principal.interface';
import { getUserFromRequestUseContext } from '@/common/helpers/request/request-context.helper';

export const LoggedInUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): Principal | undefined =>
    getUserFromRequestUseContext(context),
);
