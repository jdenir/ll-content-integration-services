import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RestoreAnswerTypeLessonDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ description: 'The id of a answer type lesson' })
  id: string;
}
