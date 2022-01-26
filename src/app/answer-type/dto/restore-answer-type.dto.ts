import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RestoreAnswerTypeDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ description: 'The id of a answer type' })
  id: string;
}
