import { Injectable } from '@nestjs/common';
import { LexContentServiceHelper } from '../../helper/lex-content.helper';
import { LessonInterface } from './interface/lesson.interface';
import { RedisHelper } from '../../helper/redis.helper';
import { ConfigConst } from '../../constant/config.const';
import { AnswerTypeLessonEntity } from '../../app/answer-type-lesson/answer-type-lesson.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LessonService {
  constructor(
    private readonly lexContentService: LexContentServiceHelper,
    private readonly redis: RedisHelper,
    @InjectRepository(AnswerTypeLessonEntity)
    private readonly answerTypeLessonRepository: Repository<AnswerTypeLessonEntity>,
  ) {}

  async show(id: string): Promise<LessonInterface> {
    // const cacheIndex = `${ConfigConst.LESSON_REDIS_KEY}-${id}`;
    // const lessonCached = await this.redis.get<LessonInterface>(cacheIndex);
    // if (lessonCached) return lessonCached;

    const lesson = await this.lexContentService.showLesson(id);

    lesson.lessonResources = await Promise.all(
      lesson.lessonResources.map(async lessonResource => {
        if (!lessonResource.resource.question) return lessonResource;

        const answerType = await this.answerTypeLessonRepository
          .createQueryBuilder('answerTypeLesson')
          .innerJoinAndSelect('answerTypeLesson.answerType', 'answerType')
          .where('answerTypeLesson.lessonId = :lessonId', { lessonId: lesson.id })
          .where('answerTypeLesson.resourceId = :resourceId', { resourceId: lessonResource.resource.id })
          .getMany();

        return {
          ...lessonResource,
          resource: { ...lessonResource.resource, answerTypeLessons: answerType },
        };
      }),
    );

    // await this.redis.setex(cacheIndex, Number(process.env.LESSON_TIME_EXPIRATION) || 30, lesson);

    return lesson;
  }
}
