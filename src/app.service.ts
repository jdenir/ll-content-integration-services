import { Injectable } from '@nestjs/common';
import { ConfigConst } from './constant/config.const';

@Injectable()
export class AppService {
  healthCheck() {
    return {
      message: ConfigConst.MSG_HEALTH,
      version: ConfigConst.API_VERSION,
    };
  }
}
