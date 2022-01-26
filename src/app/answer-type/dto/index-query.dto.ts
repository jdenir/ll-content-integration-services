import { Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class IndexQueryDto {
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @ApiProperty({
    description: 'The current page of pagination',
    default: 1,
  })
  readonly page: number;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @ApiProperty({
    description: 'Number of items per page',
    default: 10,
  })
  readonly limit: number;
}
