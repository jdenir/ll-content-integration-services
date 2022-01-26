import { Injectable, HttpService, NotFoundException } from '@nestjs/common';
import { LessonInterface } from '../app/lesson/interface/lesson.interface';

@Injectable()
export class LexContentServiceHelper {
  constructor(private httpService: HttpService) {}

  async showLesson(id: string): Promise<LessonInterface> {
    try {
      const response = await this.httpService.get(`${process.env.LEX_CONTENT_API}/lesson/${id}`).toPromise();

      const { data } = response;

      return data;
    } catch (e) {
      throw new NotFoundException(e);
    }
  }
}
