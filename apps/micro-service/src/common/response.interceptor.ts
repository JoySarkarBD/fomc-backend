import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServiceResponse } from './response.interface';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const httpRes = context.switchToHttp().getResponse();

    const method = req?.method;
    const url: string = req?.originalUrl || req?.url || '';

    if (url === '/api' || url === '/api/') {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        if (data?.success !== undefined && data?.timestamp) {
          return data;
        }

        const statusCode = httpRes?.statusCode ?? 200;

        let message = 'Request successful';
        let responseData = data ?? null;

        if (data && typeof data === 'object') {
          if ('message' in data) {
            message = data.message;
            const { message: _, ...rest } = data as { message: string };
            responseData = Object.keys(rest).length ? rest : null;
          }

          if ('error' in data) {
            message = data.error;
            const { error: _, ...rest } = data as { error: string };
            responseData = Object.keys(rest).length ? rest : null;
          }
        }

        const response: ServiceResponse = {
          success: statusCode >= 200 && statusCode < 300,
          message,
          method,
          endpoint: url,
          statusCode,
          timestamp: new Date().toISOString(),
          data: responseData,
        };

        return response;
      }),
    );
  }
}
