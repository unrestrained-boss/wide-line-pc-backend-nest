import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    let message = exception.message;
    if (typeof message !== 'string') {
      message = exception.message.message || exception.message.error;
    }
    this._send(host, message, 400);
  }
  _send(host: ArgumentsHost, message: string, statusCode: number) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    response
      .status(statusCode)
      .json({
        message,
        timestamp: Date.now(),
        pathname: request.url,
      });
  }
}
