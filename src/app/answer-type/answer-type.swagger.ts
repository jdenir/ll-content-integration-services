import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponse, DefaultResponse } from '../../helper/swagger-response.helper';
import { AnswerTypeEntity } from './answer-type.entity';

export class PaginationAnswerTypeResponse extends PaginationResponse {
  @ApiProperty({ type: AnswerTypeEntity, isArray: true })
  items: AnswerTypeEntity[];
}

export class AnswerTypePaginateResponse extends DefaultResponse {
  @ApiProperty({ type: PaginationAnswerTypeResponse })
  data: PaginationAnswerTypeResponse;
}

export class AnswerTypeCommonResponse extends DefaultResponse {
  @ApiProperty({ type: AnswerTypeEntity })
  data: AnswerTypeEntity;
}
