import { ApiProperty } from '@nestjs/swagger';

export class DefaultResponse {
  @ApiProperty({ type: 'string', description: 'A description of what the route is responsibility' })
  message: string;

  @ApiProperty({ type: 'string', description: 'The name of the entity' })
  object: string;

  @ApiProperty({ type: 'string', description: 'The url of the entity' })
  url: string;
}

export class PaginationResponse {
  @ApiProperty({ type: 'number', description: 'Total items on the page' })
  itemCount: number;

  @ApiProperty({ type: 'number', description: 'Total items' })
  totalItems: number;

  @ApiProperty({ type: 'number', description: 'Number of pages' })
  pageCount: number;

  @ApiProperty({ type: 'string', description: 'Next page link' })
  next: string;

  @ApiProperty({ type: 'string', description: 'Previous page link' })
  previous: string;
}
