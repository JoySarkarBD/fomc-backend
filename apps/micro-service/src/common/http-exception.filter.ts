import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ServiceResponse } from './response.interface';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Request failed';
    let data: Record<string, unknown> | null = null;

    if (exception instanceof HttpException) {
      const responseBody = exception.getResponse();
      if (typeof responseBody === 'string') {
        message = responseBody;
      } else if (responseBody && typeof responseBody === 'object') {
        const body = responseBody as {
          message?: string | string[];
          error?: string;
        };
        if (Array.isArray(body.message)) {
          message = 'Validation failed';
          data = { errors: body.message };
        } else if (body.message) {
          message = body.message;
        }
        if (body.error) {
          data = { ...(data ?? {}), error: body.error };
        }
      }
    }

    const payload: ServiceResponse = {
      success: false,
      message,
      method: request?.method,
      endpoint: request?.originalUrl || request?.url || '',
      statusCode: status,
      timestamp: new Date().toISOString(),
      data: data ?? undefined,
    };

    response.status(status).json(payload);
  }
}
