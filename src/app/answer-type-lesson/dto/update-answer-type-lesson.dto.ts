import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAnswerTypeLessonDto {
  @ApiProperty({ description: 'The lesson id', nullable: false })
  @IsNotEmpty()
  lessonId: string;

  @ApiProperty({ description: 'The resource id', nullable: false })
  @IsNotEmpty()
  resourceId: string;

  @ApiProperty({ description: 'The list of answer type ids', nullable: false })
  @IsNotEmpty()
  answerTypeIds: string[];

  @IsUUID('4')
  @ApiProperty({ description: 'The edu module id', nullable: false })
  @IsNotEmpty()
  eduModuleId: string;
}
