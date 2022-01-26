import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class QueueServiceGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const secretKey = context.switchToHttp().getRequest().headers['authorization'];

    if (!secretKey) return false;

    return secretKey === process.env.QUEUE_SERVICE_KEY;
  }
}
