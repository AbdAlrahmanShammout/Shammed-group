import { HttpException, HttpStatus } from '@nestjs/common';

import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import { normalizeException } from '@/common/filter/exception_mappers/exception-mapper';

describe('normalizeException', () => {
  it('maps AppException kind onto an HTTP status', () => {
    const actual = normalizeException(new ResourceNotFoundException('Widget', 12));
    expect(actual.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(actual.code).toBe('RESOURCE_NOT_FOUND');
    expect(actual.userFriendly).toBe(true);
  });

  it('maps framework HttpException without treating it as a defect', () => {
    const actual = normalizeException(
      new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS),
    );
    expect(actual.statusCode).toBe(HttpStatus.TOO_MANY_REQUESTS);
    expect(actual.code).toBe('HTTP_EXCEPTION');
  });

  it('maps unrecognized runtime errors to an internal failure', () => {
    const actual = normalizeException(new TypeError('Cannot read properties of undefined'));
    expect(actual.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(actual.code).toBe('INTERNAL_SERVER_ERROR');
    expect(actual.userFriendly).toBe(false);
  });
});
