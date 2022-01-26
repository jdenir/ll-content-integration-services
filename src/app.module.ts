import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LessonModule } from './app/lesson/lesson.module';
import { AnswerTypeModule } from './app/answer-type/answer-type.module';
import { AnswerTypeLessonModule } from './app/answer-type-lesson/answer-type-lesson.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(),
    LessonModule,
    AnswerTypeModule,
    AnswerTypeLessonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
