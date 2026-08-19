import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

import { getRequestFromContext } from '@/common/helpers/request/request-context.helper';

export type RequestInfo = {
  readonly ip: string | undefined;
  readonly userAgent: string | undefined;
};

export const GetRequestInfo = createParamDecorator(
  (_data: unknown, context: ExecutionContext): RequestInfo => {
    const request: Request = getRequestFromContext(context);
    return {
      ip: request.ip,
      userAgent: request.header('user-agent'),
    };
  },
);
