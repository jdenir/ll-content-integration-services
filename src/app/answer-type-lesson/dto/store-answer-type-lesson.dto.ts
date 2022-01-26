import { IsNotEmpty, IsUUID, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StoreAnswerTypeLessonDto {
  @ApiProperty({ description: 'The lesson id', nullable: false })
  @IsNotEmpty()
  lessonId: string;

  @ApiProperty({ description: 'The resource id', nullable: false })
  @IsNotEmpty()
  resourceId: string;

  @IsArray()
  @ApiProperty({ description: 'The list of answer type ids', nullable: false })
  @IsNotEmpty()
  answerTypeIds: string[];

  @IsUUID('4')
  @ApiProperty({ description: 'The edu module id', nullable: false })
  @IsNotEmpty()
  eduModuleId: string;
}
