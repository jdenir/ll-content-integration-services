import { Injectable, HttpService, NotFoundException } from '@nestjs/common';

@Injectable()
export class StorageServiceHelper {
  constructor(private httpService: HttpService) {}

  async signUrl(filePath): Promise<string> {
    const response = await this.httpService
      .get(`${process.env.STORAGE_SERVICE_API}/get-signed-url/get-object?filePath=${filePath}`)
      .toPromise();

    const {
      data: { data },
      status,
    } = response;

    if (status !== 200) throw new NotFoundException();

    return data.url;
  }
}
