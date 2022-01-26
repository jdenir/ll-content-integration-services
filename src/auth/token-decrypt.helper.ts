import { InternalServerErrorException, Injectable } from '@nestjs/common';

@Injectable()
export class TokenDecryptHelper {
  decrypt(token: string) {
    try {
      // ToDo validar o token no lex
      const payload = token.split('.')[1];
      return JSON.parse(Buffer.from(payload, 'base64').toString());
    } catch (e) {
      throw new InternalServerErrorException('Invalid token specified: ' + e.message);
    }
  }

  getUserIdAndRoles(token: string): { userId: string; clientId: string; role: string | string[] } {
    const decoded = this.decrypt(token);

    return {
      userId: decoded.sub,
      clientId: decoded.client_id,
      role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
    };
  }
}
