import { Injectable } from '@nestjs/common';
import { TokenDecryptHelper } from './token-decrypt.helper';

@Injectable()
export class AuthService {
  constructor(private readonly tokenDecryptHeler: TokenDecryptHelper) {}

  getUserIdAndRoles(token: string): { userId: string; clientId: string; role: string | string[] } {
    return this.tokenDecryptHeler.getUserIdAndRoles(token);
  }
}
