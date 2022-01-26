import { Injectable, InternalServerErrorException, NotFoundException, HttpService } from '@nestjs/common';
import { AnswerTypeLessonEntity } from './answer-type-lesson.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection, QueryRunner } from 'typeorm';
import { RedisHelper } from '../../helper/redis.helper';
import { ConfigService } from '@nestjs/config';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { ConfigConst } from '../../constant/config.const';
import { AnswerTypeLessonInterface } from './interface/answer-type-lesson.interface';
import { LessonService } from '../lesson/lesson.service';
import { ErrorMessages } from '../../constant/error.types';
import { LessonResourceInterface } from '../lesson/interface/lesson-resource.interface';
import { AnswerTypeService } from '../answer-type/answer-type.service';

@Injectable()
export class AnswerTypeLessonService {
  constructor(
    @InjectRepository(AnswerTypeLessonEntity)
    private readonly answerTypeLessonRepository: Repository<AnswerTypeLessonEntity>,
    private readonly answerTypeService: AnswerTypeService,
    private readonly redis: RedisHelper,
    private readonly configService: ConfigService,
    private readonly lessonService: LessonService,
    private readonly httpService: HttpService,
    private readonly connection: Connection,
  ) {}

  async paginate(options: IPaginationOptions = { page: 1, limit: 10 }): Promise<Pagination<AnswerTypeLessonEntity>> {
    if (!options.route) {
      options.route = this.configService.get('LL_CIS_URL') + ConfigConst.ANSWER_TYPE_LESSONS_URL;
    }

    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 10;
    const cacheIndex = `${ConfigConst.ANSWER_TYPE_LESSONS_REDIS_KEY}_page_${page}_limit_${limit}`;

    const cachedList = await this.redis.get<Pagination<AnswerTypeLessonEntity>>(cacheIndex);
    if (cachedList) {
      return cachedList;
    }

    const answerTypeLessonsList = await paginate<AnswerTypeLessonEntity>(this.answerTypeLessonRepository, options);
    this.redis.set(cacheIndex, answerTypeLessonsList);

    return answerTypeLessonsList;
  }

  async store(data: AnswerTypeLessonInterface): Promise<AnswerTypeLessonEntity[]> {
    await this.validateProperties(data);
    const queryRunner = await this.getConnection();

    try {
      const answerTypeLessons = await this.insertAnswerTypeLessons(data, queryRunner);

      await this.redis.del(ConfigConst.ANSWER_TYPE_LESSONS_REDIS_KEY, true);

      await queryRunner.commitTransaction();
      return answerTypeLessons;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(e);
    } finally {
      await queryRunner.release();
    }
  }

  async show(id: string): Promise<AnswerTypeLessonEntity> {
    try {
      const cacheIndex = `${ConfigConst.ANSWER_TYPE_LESSONS_REDIS_KEY}-${id}`;
      const answerTypeLessonCached = await this.redis.get<AnswerTypeLessonEntity>(cacheIndex);
      if (answerTypeLessonCached) return answerTypeLessonCached;

      const answerTypeLesson = await this.answerTypeLessonRepository.findOneOrFail(id);

      await this.redis.set(cacheIndex, answerTypeLesson);

      return answerTypeLesson;
    } catch (e) {
      throw new NotFoundException(e);
    }
  }

  async update(data: AnswerTypeLessonInterface): Promise<AnswerTypeLessonEntity[]> {
    await this.validateProperties(data);
    const queryRunner = await this.getConnection();

    try {
      await queryRunner.manager.delete(AnswerTypeLessonEntity, {
        lessonId: data.lessonId,
        eduModuleId: data.eduModuleId,
        resourceId: data.resourceId,
      });

      const answerTypeLessons = await this.insertAnswerTypeLessons(data, queryRunner);

      await this.redis.del(ConfigConst.ANSWER_TYPE_LESSONS_REDIS_KEY, true);

      await queryRunner.commitTransaction();
      return answerTypeLessons;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(e);
    } finally {
      await queryRunner.release();
    }
  }

  async destroy(id: string): Promise<boolean> {
    try {
      const isDeleted = await this.answerTypeLessonRepository.softDelete(id);

      await this.redis.del(ConfigConst.ANSWER_TYPE_LESSONS_REDIS_KEY, true);

      return isDeleted.raw.affectedRows > 0;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async restore(id: string): Promise<AnswerTypeLessonEntity> {
    try {
      await this.answerTypeLessonRepository.restore(id);

      await this.redis.del(ConfigConst.ANSWER_TYPE_LESSONS_REDIS_KEY, true);

      return await this.show(id);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  private async validateProperties(data: AnswerTypeLessonInterface) {
    try {
      const lesson = await this.lessonService.show(data.lessonId);
      this.validateResources(lesson.lessonResources, data.resourceId);
      await this.httpService.get(process.env.LL_CMS_URL + ConfigConst.EDU_MODULE_URL + data.eduModuleId).toPromise();
      await Promise.all(
        data.answerTypeIds.map(async answerTypeId => {
          await this.answerTypeService.show(answerTypeId);
        }),
      );
    } catch (e) {
      throw new NotFoundException(e);
    }
  }

  private validateResources(lessonResources: LessonResourceInterface[], resourceId: string) {
    const resourceIds = lessonResources.map(lessonResource => lessonResource.resource.id);
    if (!resourceIds.includes(resourceId)) {
      throw new NotFoundException(ErrorMessages.RESOURCE_ID_NOT_FOUND);
    }
  }

  private async insertAnswerTypeLessons(
    data: AnswerTypeLessonInterface,
    queryRunner: QueryRunner,
  ): Promise<AnswerTypeLessonEntity[]> {
    const { lessonId, resourceId, answerTypeIds, eduModuleId } = data;
    const answerTypeLessons = [];

    await Promise.all(
      answerTypeIds.map(async answerTypeId => {
        const answerTypeLesson = await queryRunner.manager.save(
          queryRunner.manager.create(AnswerTypeLessonEntity, { lessonId, resourceId, answerTypeId, eduModuleId }),
        );
        answerTypeLessons.push(answerTypeLesson);
      }),
    );

    return answerTypeLessons;
  }

  private async getConnection() {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    return queryRunner;
  }
}
