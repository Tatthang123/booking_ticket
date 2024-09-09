import type {
    CallHandler,
    ExecutionContext,
    NestInterceptor,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        const statusCode = context.switchToHttp().getResponse().statusCode;
        return next.handle().pipe(
            map((data) => {
                // Format the response data
                const formattedData = {
                    status: 'success',
                    statusCode,
                    data: data
                };
                return formattedData;
            }),
        );
    }
}