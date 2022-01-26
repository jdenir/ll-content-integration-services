import { CopyrightInterface } from './copyrights.interface';
import { KeywordInterface } from './keyword.interface';
import { ReferenceInterface } from './references.interface';
import { TypeInterface } from './type.interface';

export interface ResourceInterface {
  id: string;
  audio?: any;
  copyrights?: CopyrightInterface[];
  ePub?: any;
  image?: any;
  keyWords?: KeywordInterface[];
  link?: any;
  question?: any;
  references?: ReferenceInterface[];
  simpleDescription?: string;
  status: number;
  text?: any;
  type?: TypeInterface;
  video?: any;
  answerTypeLessons?: any;
}
