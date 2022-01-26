import { Tedis } from 'tedis';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisHelper {
  private keyPrefix: string;
  private connection: Tedis;

  constructor(private readonly configService: ConfigService) {
    const prefix = this.configService.get<string>('NODE_ENV');

    const connection = new Tedis({
      port: this.configService.get<number>('REDIS_PORT'),
      host: this.configService.get<string>('REDIS_HOST'),
    });

    this.setConnection(connection);
    this.setKeyPrefix(prefix);
  }

  private getConnection(): Tedis {
    return this.connection;
  }

  private setConnection(connection: Tedis): RedisHelper {
    this.connection = connection;
    return this;
  }

  private getKeyPrefix(): string {
    return this.keyPrefix;
  }

  private setKeyPrefix(keyPrefix: string): RedisHelper {
    this.keyPrefix = keyPrefix;
    return this;
  }

  private getCompleteKey(key: string): string {
    return this.keyPrefix + '_' + key;
  }

  async get<T>(key: string): Promise<T> {
    try {
      const data = await this.connection.get(this.getCompleteKey(key));
      return JSON.parse(String(data));
    } catch (e) {
      console.error(e);
    }
  }

  async set(key: string, value: any): Promise<boolean> {
    try {
      const affectedRows = await this.connection.set(this.getCompleteKey(key), JSON.stringify(value));
      return affectedRows === 'OK';
    } catch (e) {
      console.error(e);
    }
  }

  async setex(key: string, seconds: number, value: any): Promise<boolean> {
    try {
      const affectedRows = await this.connection.setex(this.getCompleteKey(key), seconds, JSON.stringify(value));
      return affectedRows === 'OK';
    } catch (e) {
      console.error(e);
    }
  }

  async del(key: string, wildcard = false): Promise<boolean> {
    try {
      const completeKey = this.getCompleteKey(key);

      let keys: string[] = [];
      if (wildcard) {
        keys = await this.connection.keys(completeKey + '*');
      }

      const affectedRows = await this.connection.del(completeKey, ...keys);
      return affectedRows > 0;
    } catch (error) {
      console.error(error);
    }

    return false;
  }

  buildCacheIndex(key: string, options: any): string {
    const objectIndex = Object.entries(options).reduce((acc, [key, value]) => `${acc}-${key}-${value}`, '');

    return `${key}${objectIndex}`;
  }
}
