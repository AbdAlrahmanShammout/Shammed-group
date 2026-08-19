import { UnauthenticatedException } from '@/common/exceptions/unauthenticated.exception';

export class AuthenticationFailedException extends UnauthenticatedException {
  constructor() {
    super('Authentication failed');
  }
}
