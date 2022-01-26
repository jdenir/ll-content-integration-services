import { IsNotEmpty, MaxLength, MinLength, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAnswerTypeDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @ApiProperty({ description: 'The name of a answer type', nullable: false, minLength: 1, maxLength: 255 })
  name: string;
}
