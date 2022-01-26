import {
  Controller,
  Get,
  Req,
  Query,
  Request,
  Post,
  Body,
  ParseUUIDPipe,
  Param,
  Put,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { AnswerTypeLessonService } from './answer-type-lesson.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AnswerTypeLessonPaginateResponse, AnswerTypeLessonCommonResponse } from './answer-type.swagger';
import { IndexQueryDto } from './dto/index-query.dto';
import { StoreAnswerTypeLessonDto } from './dto/store-answer-type-lesson.dto';
import { UpdateAnswerTypeLessonDto } from './dto/update-answer-type-lesson.dto';
import { RestoreAnswerTypeLessonDto } from './dto/restore-answer-type-lesson.dto';

@ApiTags('answer-type-lessons')
@Controller('answer-type-lessons')
export class AnswerTypeLessonController {
  constructor(private readonly answerTypeLessonService: AnswerTypeLessonService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Show a answer type lesson list', type: AnswerTypeLessonPaginateResponse })
  @ApiResponse({ status: 400, description: 'Pagination query problem' })
  async index(@Req() req: Request, @Query() query?: IndexQueryDto) {
    const answerTypeLesson = await this.answerTypeLessonService.paginate(query);

    return {
      message: 'Show a answer type lesson list',
      object: 'AnswerTypeLesson',
      url: req.url,
      data: answerTypeLesson,
    };
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Answer type successfully registered',
    type: AnswerTypeLessonPaginateResponse,
  })
  @ApiResponse({ status: 400, description: 'Invalid fields' })
  async store(@Req() req: Request, @Body() body: StoreAnswerTypeLessonDto) {
    const answerTypeLessons = await this.answerTypeLessonService.store(body);

    return {
      message: 'Store a new answer type lesson',
      object: 'AnswerTypeLesson',
      url: req.url,
      data: answerTypeLessons,
    };
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Show a answer type lesson detail', type: AnswerTypeLessonCommonResponse })
  @ApiResponse({ status: 400, description: 'Invalid uuid' })
  @ApiResponse({ status: 404, description: 'Answer type lesson not found' })
  async show(@Req() req: Request, @Param('id', new ParseUUIDPipe()) id: string) {
    const answerTypeLesson = await this.answerTypeLessonService.show(id);

    return {
      message: 'Show answer type lesson data',
      object: 'AnswerTypeLesson',
      url: req.url,
      data: answerTypeLesson,
    };
  }

  @Put()
  @ApiResponse({
    status: 200,
    description: 'Answer type lesson data has been successfully updated',
    type: AnswerTypeLessonCommonResponse,
  })
  @ApiResponse({ status: 400, description: 'Invalid fields' })
  @ApiResponse({ status: 404, description: 'Answer type not found' })
  async update(@Req() req: Request, @Body() body: UpdateAnswerTypeLessonDto) {
    const answerTypeLessons = await this.answerTypeLessonService.update(body);

    return {
      message: 'Update answer type lesson data',
      object: 'AnswerTypeLesson',
      url: req.url,
      data: answerTypeLessons,
    };
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({ status: 204, description: 'The answer type lesson removed' })
  @ApiResponse({ status: 404, description: 'Answer type lesson not found' })
  async destroy(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.answerTypeLessonService.destroy(id);
  }

  @Post('/restore')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Restore a removed answer type lesson',
    type: AnswerTypeLessonCommonResponse,
  })
  @ApiResponse({ status: 400, description: 'Invalid fields' })
  @ApiResponse({ status: 404, description: 'Answer type lesson not found' })
  async restore(@Req() req: Request, @Body() body: RestoreAnswerTypeLessonDto) {
    const answerTypeLesson = await this.answerTypeLessonService.restore(body.id);

    return {
      message: 'Restore a removed answer type lesson',
      object: 'AnswerTypeLesson',
      url: req.url,
      data: answerTypeLesson,
    };
  }
}
