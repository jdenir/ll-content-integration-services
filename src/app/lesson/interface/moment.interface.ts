import { TopicInterface } from './topic.interface';

export interface MomentInterface {
  id?: string;
  momentTime?: number;
  name?: string;
  viewOrder: number;
  topics?: TopicInterface[];
}
