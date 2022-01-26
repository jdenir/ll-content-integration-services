export class ConfigConst {
  static readonly API_VERSION = '0.0.1';
  static readonly MSG_HEALTH = 'Api is Ok!';

  // URLs
  static readonly ANSWERS_URL = '/answers/';
  static readonly ANSWER_TYPES_URL = '/answer-types/';
  static readonly ANSWER_TYPE_LESSONS_URL = '/answer-type-lessons/';
  static readonly EDU_MODULE_URL = '/edu-modules/';

  // Redis Keys
  static readonly ANSWER_REDIS_KEY = 'cis-answers';
  static readonly ANSWER_TYPES_REDIS_KEY = 'cis-answer-types';
  static readonly ANSWER_TYPE_LESSONS_REDIS_KEY = 'cis-answer-type-lessons';
  static readonly LESSON_REDIS_KEY = 'cis-lessons';
}
