import {
  Controller,
  Get,
  Delete,
  HttpCode,
  ParseUUIDPipe,
  Param,
  Request,
  Req,
  Post,
  Body,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { AnswerTypeService } from './answer-type.service';
import { RestoreAnswerTypeDto } from './dto/restore-answer-type.dto';
import { StoreAnswerTypeDto } from './dto/store-answer-type.dto';
import { AnswerTypePaginateResponse, AnswerTypeCommonResponse } from './answer-type.swagger';
import { UpdateAnswerTypeDto } from './dto/update-answer-type.dto';
import { IndexQueryDto } from './dto/index-query.dto';

@Controller('answer-types')
@ApiTags('answer-types')
export class AnswerTypeController {
  constructor(private readonly answerTypeService: AnswerTypeService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Show a answer type list', type: AnswerTypePaginateResponse })
  @ApiResponse({ status: 400, description: 'Pagination query problem' })
  async index(@Req() req: Request, @Query() query?: IndexQueryDto) {
    const answerType = await this.answerTypeService.paginate(query);

    return {
      message: 'Show a answer type list',
      object: 'AnswerType',
      url: req.url,
      data: answerType,
    };
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Answer type successfully registered', type: AnswerTypeCommonResponse })
  @ApiResponse({ status: 400, description: 'Invalid fields' })
  async store(@Req() req: Request, @Body() body: StoreAnswerTypeDto) {
    const answerType = await this.answerTypeService.store(body);

    return {
      message: 'Store a new answer type',
      object: 'AnswerType',
      url: req.url,
      data: answerType,
    };
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Show a answer type detail', type: AnswerTypeCommonResponse })
  @ApiResponse({ status: 400, description: 'Invalid uuid' })
  @ApiResponse({ status: 404, description: 'Answer type not found' })
  async show(@Req() req: Request, @Param('id', new ParseUUIDPipe()) id: string) {
    const answerType = await this.answerTypeService.show(id);

    return {
      message: 'Show answerType data',
      object: 'AnswerType',
      url: req.url,
      data: answerType,
    };
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'Answer type data has been successfully updated',
    type: AnswerTypeCommonResponse,
  })
  @ApiResponse({ status: 400, description: 'Invalid fields' })
  @ApiResponse({ status: 404, description: 'Answer type not found' })
  async update(@Req() req: Request, @Param('id', new ParseUUIDPipe()) id: string, @Body() body: UpdateAnswerTypeDto) {
    const answerType = await this.answerTypeService.update(id, body);

    return {
      message: 'Update answer type data',
      object: 'AnswerType',
      url: req.url,
      data: answerType,
    };
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({ status: 204, description: 'The answer type removed' })
  @ApiResponse({ status: 404, description: 'Answer type not found' })
  async destroy(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.answerTypeService.destroy(id);
  }

  @Post('/restore')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Restore a removed answer type', type: AnswerTypeCommonResponse })
  @ApiResponse({ status: 400, description: 'Invalid fields' })
  @ApiResponse({ status: 404, description: 'Answer type not found' })
  async restore(@Req() req: Request, @Body() body: RestoreAnswerTypeDto) {
    const answerType = await this.answerTypeService.restore(body.id);

    return {
      message: 'Restore a removed answer type',
      object: 'AnswerType',
      url: req.url,
      data: answerType,
    };
  }
}
