import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

import { Principal } from '@/common/auth/principal.interface';

export function getRequestFromContext(context: ExecutionContext): Request {
  return context.switchToHttp().getRequest<Request>();
}

export function getUserFromRequestUseContext(context: ExecutionContext): Principal | undefined {
  const request = getRequestFromContext(context) as Request & { user?: Principal };
  return request.user;
}
