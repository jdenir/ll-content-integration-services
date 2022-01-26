import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AnswerTypeEntity } from './answer-type.entity';
import { Repository } from 'typeorm';
import { RedisHelper } from '../../helper/redis.helper';
import { ConfigConst } from '../../constant/config.const';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { ConfigService } from '@nestjs/config';
import { AnswerTypeInterface } from './interface/answer-type.interface';

@Injectable()
export class AnswerTypeService {
  constructor(
    @InjectRepository(AnswerTypeEntity)
    private readonly answerTypeRepository: Repository<AnswerTypeEntity>,
    private readonly redis: RedisHelper,
    private readonly configService: ConfigService,
  ) {}

  async paginate(options: IPaginationOptions = { page: 1, limit: 10 }): Promise<Pagination<AnswerTypeEntity>> {
    if (!options.route) {
      options.route = this.configService.get('LL_CIS_URL') + ConfigConst.ANSWER_TYPES_URL;
    }

    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 10;
    const cacheIndex = `${ConfigConst.ANSWER_TYPES_REDIS_KEY}_page_${page}_limit_${limit}`;

    const cachedList = await this.redis.get<Pagination<AnswerTypeEntity>>(cacheIndex);
    if (cachedList) {
      return cachedList;
    }

    const answerTypeList = await paginate<AnswerTypeEntity>(this.answerTypeRepository, options);
    this.redis.set(cacheIndex, answerTypeList);

    return answerTypeList;
  }

  async store(data: AnswerTypeInterface): Promise<AnswerTypeEntity> {
    try {
      const answerType = await this.answerTypeRepository.save(this.answerTypeRepository.create(data));

      await this.redis.del(ConfigConst.ANSWER_TYPES_REDIS_KEY, true);

      return answerType;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async show(id: string): Promise<AnswerTypeEntity> {
    try {
      const cacheIndex = `${ConfigConst.ANSWER_TYPES_REDIS_KEY}-${id}`;
      const answerTypeCached = await this.redis.get<AnswerTypeEntity>(cacheIndex);
      if (answerTypeCached) return answerTypeCached;

      const answerType = await this.answerTypeRepository.findOneOrFail(id);

      await this.redis.set(cacheIndex, answerType);

      return answerType;
    } catch (e) {
      throw new NotFoundException(e);
    }
  }

  async update(id: string, data: Partial<AnswerTypeInterface>): Promise<AnswerTypeEntity> {
    const answerType = await this.show(id);

    try {
      const updatedAnswerType = await this.answerTypeRepository.save(this.answerTypeRepository.merge(answerType, data));

      await this.redis.del(ConfigConst.ANSWER_TYPES_REDIS_KEY, true);

      return updatedAnswerType;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async destroy(id: string): Promise<boolean> {
    try {
      const isDeleted = await this.answerTypeRepository.softDelete(id);

      await this.redis.del(ConfigConst.ANSWER_TYPES_REDIS_KEY, true);

      return isDeleted.raw.affectedRows > 0;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async restore(id: string): Promise<AnswerTypeEntity> {
    try {
      await this.answerTypeRepository.restore(id);

      await this.redis.del(ConfigConst.ANSWER_TYPES_REDIS_KEY, true);

      return await this.show(id);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
