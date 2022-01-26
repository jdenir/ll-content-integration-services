import { Injectable, CanActivate, ExecutionContext, Request } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenDecryptHelper } from './token-decrypt.helper';

@Injectable()
export class LexGuard implements CanActivate {
  constructor(private reflector: Reflector, private tokenDecript: TokenDecryptHelper) {}

  canActivate(context: ExecutionContext): boolean {
    const [request, token] = [
      context.switchToHttp().getRequest(),
      context.switchToHttp().getRequest().headers['authorization'],
    ];
    if (!token) {
      return false;
    }

    const user = this.tokenDecript.getUserIdAndRoles(token);
    request.user = user;

    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    return this.matchRoles(roles, user.role);
  }

  matchRoles(rolesAllowed: string[], userRoles: string | string[]): boolean {
    const roles = Array.isArray(userRoles) ? userRoles : [userRoles];

    return rolesAllowed.findIndex(roleAllowed => roles.includes(roleAllowed)) >= 0;
  }
}
