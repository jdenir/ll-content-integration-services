import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TokenDecryptHelper } from './token-decrypt.helper';

@Module({
  imports: [],
  controllers: [],
  providers: [AuthService, TokenDecryptHelper],
  exports: [AuthService],
})
export class AuthModule {}
