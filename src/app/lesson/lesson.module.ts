import { Module, HttpModule } from '@nestjs/common';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';
import { LexContentServiceHelper } from '../../helper/lex-content.helper';
import { TokenDecryptHelper } from '../../auth/token-decrypt.helper';
import { RedisHelper } from '../../helper/redis.helper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswerTypeLessonEntity } from '../answer-type-lesson/answer-type-lesson.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([AnswerTypeLessonEntity])],
  controllers: [LessonController],
  providers: [LessonService, LexContentServiceHelper, TokenDecryptHelper, RedisHelper],
  exports: [LessonService],
})
export class LessonModule {}
