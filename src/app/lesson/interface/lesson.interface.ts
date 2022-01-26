import { MomentInterface } from './moment.interface';
import { LessonResourceInterface } from './lesson-resource.interface';

export interface LessonInterface {
  description?: string;
  id: string;
  status: number;
  subject: string;
  lessonResources: LessonResourceInterface[];
  moments: MomentInterface[];
}
