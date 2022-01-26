import { Module, HttpModule } from '@nestjs/common';
import { AnswerTypeLessonService } from './answer-type-lesson.service';
import { AnswerTypeLessonController } from './answer-type-lesson.controller';
import { AnswerTypeLessonEntity } from './answer-type-lesson.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisHelper } from '../../helper/redis.helper';
import { AnswerTypeEntity } from '../answer-type/answer-type.entity';
import { LessonModule } from '../lesson/lesson.module';
import { AnswerTypeModule } from '../answer-type/answer-type.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AnswerTypeLessonEntity, AnswerTypeEntity]),
    HttpModule,
    LessonModule,
    AnswerTypeModule,
  ],
  providers: [AnswerTypeLessonService, RedisHelper],
  controllers: [AnswerTypeLessonController],
})
export class AnswerTypeLessonModule {}
