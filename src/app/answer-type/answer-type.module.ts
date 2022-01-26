import { Module } from '@nestjs/common';
import { AnswerTypeService } from './answer-type.service';
import { AnswerTypeController } from './answer-type.controller';
import { AnswerTypeEntity } from './answer-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisHelper } from '../../helper/redis.helper';

@Module({
  imports: [TypeOrmModule.forFeature([AnswerTypeEntity])],
  providers: [AnswerTypeService, RedisHelper],
  controllers: [AnswerTypeController],
  exports: [AnswerTypeService],
})
export class AnswerTypeModule {}
