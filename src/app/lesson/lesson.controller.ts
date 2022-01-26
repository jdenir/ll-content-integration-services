import { Controller, Get, UseGuards, Param, ParseUUIDPipe, Req } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LlRequest } from '../../auth/ll-request.interface';
import { LexGuard } from '../../auth/lex.guard';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('lessons')
@ApiTags('lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Get(':id')
  @UseGuards(LexGuard)
  @ApiResponse({ status: 200, description: 'Show a lesson' })
  @ApiResponse({ status: 400, description: 'Could not show a lesson' })
  @ApiParam({ name: 'id', description: 'The id of lesson' })
  async show(@Req() req: LlRequest, @Param('id', new ParseUUIDPipe()) id: string) {
    const lesson = await this.lessonService.show(id);

    return {
      message: 'Show a lesson',
      object: 'lesson',
      url: req.url,
      data: lesson,
    };
  }
}
