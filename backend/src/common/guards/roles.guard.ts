import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Principal } from '@/common/auth/principal.interface';
import { AccessDeniedException } from '@/common/exceptions/access-denied.exception';
import { ROLES_KEY } from '@/common/decorators/route/roles.decorator';
import { getUserFromRequestUseContext } from '@/common/helpers/request/request-context.helper';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    const principal: Principal | undefined = getUserFromRequestUseContext(context);
    if (!principal || !requiredRoles.includes(principal.role)) {
      throw new AccessDeniedException();
    }
    return true;
  }
}
