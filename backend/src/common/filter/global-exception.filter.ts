import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Injectable, Logger } from '@nestjs/common';

import { AppConfigService } from '@/config/app/app-config.service';
import { normalizeException } from '@/common/filter/exception_mappers/exception-mapper';
import { handleGraphqlException } from '@/common/filter/exception_return_handler/graphql_exception.handler';
import { handleHttpException } from '@/common/filter/exception_return_handler/http_exception.handler';
import { GeneralTypeException } from '@/common/filter/exception_return_handler/type/general-type.exception';

@Catch()
@Injectable()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(private readonly appConfigService: AppConfigService) {}

  catch(exception: unknown, host: ArgumentsHost): unknown {
    let normalized = normalizeException(exception);
    this.logError(normalized);
    this.reportErrorToMonitoring(normalized);
    if (!normalized.userFriendly && this.shouldHideErrorDetails()) {
      normalized = this.createSafeProductionError(normalized);
    }
    return this.formatErrorResponse(normalized, host);
  }

  private logError(normalized: GeneralTypeException): void {
    this.logger.error(normalized.message, normalized.stack);
  }

  private reportErrorToMonitoring(normalized: GeneralTypeException): void {
    if (normalized.userFriendly || this.appConfigService.isDevelopmentLike) {
      return;
    }
  }

  private shouldHideErrorDetails(): boolean {
    return !this.appConfigService.isDevelopmentLike;
  }

  private createSafeProductionError(normalized: GeneralTypeException): GeneralTypeException {
    const isClientError =
      normalized.statusCode >= HttpStatus.BAD_REQUEST &&
      normalized.statusCode < HttpStatus.INTERNAL_SERVER_ERROR;
    if (isClientError) {
      return new GeneralTypeException({
        message: 'The requested resource was not found',
        code: 'RESOURCE_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND,
        userFriendly: true,
      });
    }
    return new GeneralTypeException({
      message: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      userFriendly: false,
    });
  }

  private formatErrorResponse(normalized: GeneralTypeException, host: ArgumentsHost): unknown {
    if (host.getType() === 'graphql') {
      return handleGraphqlException(normalized, host);
    }
    handleHttpException(normalized, host);
    return undefined;
  }
}
