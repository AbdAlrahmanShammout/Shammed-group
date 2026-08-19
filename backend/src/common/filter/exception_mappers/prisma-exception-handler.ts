import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { HttpStatus } from '@nestjs/common';

import { GeneralTypeException } from '@/common/filter/exception_return_handler/type/general-type.exception';

export function mapPrismaException(exception: unknown): GeneralTypeException | null {
  if (exception instanceof PrismaClientKnownRequestError) {
    return mapKnownPrismaRequestError(exception);
  }
  if (exception instanceof PrismaClientUnknownRequestError) {
    return new GeneralTypeException({
      message: `${new Date().toISOString()} Prisma unknown request error`,
      code: 'PRISMA_UNKNOWN_REQUEST',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      userFriendly: false,
      stack: exception.stack,
    });
  }
  if (exception instanceof PrismaClientValidationError) {
    return new GeneralTypeException({
      message: 'Invalid data for persistence',
      code: 'PRISMA_VALIDATION',
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      userFriendly: true,
      stack: exception.stack,
    });
  }
  if (exception instanceof PrismaClientInitializationError) {
    return new GeneralTypeException({
      message: `${new Date().toISOString()} Prisma initialization error`,
      code: 'PRISMA_INITIALIZATION',
      statusCode: HttpStatus.SERVICE_UNAVAILABLE,
      userFriendly: false,
      stack: exception.stack,
    });
  }
  return null;
}

function mapKnownPrismaRequestError(exception: PrismaClientKnownRequestError): GeneralTypeException {
  switch (exception.code) {
    case 'P2002':
      return new GeneralTypeException({
        message: 'A unique constraint was violated',
        code: 'UNIQUE_CONSTRAINT_VIOLATION',
        statusCode: HttpStatus.CONFLICT,
        userFriendly: true,
        stack: exception.stack,
      });
    case 'P2025':
      return new GeneralTypeException({
        message: 'The requested record was not found',
        code: 'RECORD_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND,
        userFriendly: true,
        stack: exception.stack,
      });
    case 'P2003':
    case 'P2014':
      return new GeneralTypeException({
        message: 'A relation constraint was violated',
        code: 'RELATION_CONSTRAINT_VIOLATION',
        statusCode: HttpStatus.BAD_REQUEST,
        userFriendly: true,
        stack: exception.stack,
      });
    case 'P2024':
      return new GeneralTypeException({
        message: `${new Date().toISOString()} Prisma timeout ${exception.code}`,
        code: 'PRISMA_TIMEOUT',
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        userFriendly: false,
        stack: exception.stack,
      });
    default:
      return new GeneralTypeException({
        message: `${new Date().toISOString()} Prisma request error ${exception.code}`,
        code: 'PRISMA_REQUEST_ERROR',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        userFriendly: false,
        stack: exception.stack,
      });
  }
}
