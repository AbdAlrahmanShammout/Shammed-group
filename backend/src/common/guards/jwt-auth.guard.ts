import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { AuthenticationFailedException } from '@/common/exceptions/authentication-failed.exception';
import { IS_PUBLIC_KEY } from '@/common/decorators/route/public-route.decorator';
import { getRequestFromContext } from '@/common/helpers/request/request-context.helper';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  override getRequest(context: ExecutionContext): Request {
    return getRequestFromContext(context);
  }

  override handleRequest<TUser>(err: unknown, user: TUser): TUser {
    if (err || !user) {
      throw new AuthenticationFailedException();
    }
    return user;
  }

  override async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const result = await super.canActivate(context);
    return Boolean(result);
  }
}
