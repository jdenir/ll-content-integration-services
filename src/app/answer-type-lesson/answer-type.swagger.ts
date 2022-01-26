import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponse, DefaultResponse } from '../../helper/swagger-response.helper';
import { AnswerTypeLessonEntity } from './answer-type-lesson.entity';

export class PaginationAnswerTypeLessonResponse extends PaginationResponse {
  @ApiProperty({ type: AnswerTypeLessonEntity, isArray: true })
  items: AnswerTypeLessonEntity[];
}

export class AnswerTypeLessonPaginateResponse extends DefaultResponse {
  @ApiProperty({ type: PaginationAnswerTypeLessonResponse })
  data: PaginationAnswerTypeLessonResponse;
}

export class AnswerTypeLessonCommonResponse extends DefaultResponse {
  @ApiProperty({ type: AnswerTypeLessonEntity })
  data: AnswerTypeLessonEntity;
}
