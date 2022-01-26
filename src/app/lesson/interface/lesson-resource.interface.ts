import { ResourceInterface } from './resource.interface';

export interface LessonResourceInterface {
  id: string;
  resource: ResourceInterface;
  slideNumber: number;
  viewOrder: number;
}
