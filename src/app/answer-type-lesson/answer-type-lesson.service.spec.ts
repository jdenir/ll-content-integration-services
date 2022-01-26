import { Test, TestingModule } from '@nestjs/testing';
import { AnswerTypeLessonService } from './answer-type-lesson.service';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AnswerTypeLessonEntity } from './answer-type-lesson.entity';
import { RedisHelper } from '../../helper/redis.helper';
import { Repository, Connection, QueryRunner } from 'typeorm';
import { AnswerTypeService } from '../answer-type/answer-type.service';
import { LessonService } from '../lesson/lesson.service';
import { HttpService, NotFoundException, InternalServerErrorException } from '@nestjs/common';

function answerTypeLessonMapping(partial: Partial<AnswerTypeLessonEntity>) {
  const answerTypeLesson = new AnswerTypeLessonEntity();
  answerTypeLesson.id = partial.id;
  answerTypeLesson.answerTypeId = partial.answerTypeId;
  answerTypeLesson.lessonId = partial.lessonId;
  answerTypeLesson.resourceId = partial.resourceId;
  answerTypeLesson.eduModuleId = partial.eduModuleId;
  answerTypeLesson.createdAt = partial.createdAt;
  answerTypeLesson.updatedAt = partial.updatedAt;
  answerTypeLesson.deletedAt = partial.deletedAt;

  return answerTypeLesson;
}

describe('AnswerTypeLessonService', () => {
  let service: AnswerTypeLessonService;
  let repository: Repository<AnswerTypeLessonEntity>;
  let queryRunner: QueryRunner;
  let connection: Connection;

  const mockLesson = {
    description:
      'Curiosidade para aprender (Abertura ao novo), Respeito (Amabilidade), Iniciativa social, Assertividade (Engajamento com os outros), Autoconfiança (Resiliência emocional).',
    id: 'bb6b7adf-bcb4-4614-b265-fe39f144c44e',
    lessonResources: [
      {
        id: '00979115-b4f3-4b78-9e2e-b5eaedb79784',
        resource: {
          audio: null,
          copyrights: [
            {
              copyright: 'Direto Autoral 1',
              endDateCopyright: '2022-01-01T00:00:00',
              id: 1,
              startDateCopyright: '2013-01-01T00:00:00',
            },
          ],
          ePub: null,
          id: 'f51ec986-11a8-4a11-8218-10ab8182e216',
          image: null,
          keyWords: [
            {
              id: 1,
              keyWord: 'Palavra chave 1',
            },
            {
              id: 1,
              keyWord: 'Palavra chave 2',
            },
          ],
          link: null,
          references: [
            {
              id: 1,
              referenceText: 'Referência 1',
            },
          ],
          simpleDescription: 'Título do recurso de texto',
          status: 0,
          question: {
            answers: [
              {
                answerText: 'Resposta da questao aberta',
                id: '7379edb5-e0e1-4e51-b069-10d62bdd3ef0',
                isCorrect: true,
                option: null,
                viewOrder: 1,
              },
            ],
          },
          type: {
            description: 'text',
            id: 5,
          },
          video: null,
        },
        slideNumber: 1,
        viewOrder: 1,
      },
    ],
    moments: [
      {
        id: '3477be75-2e00-49dc-874a-716d0c5fd9ca',
        momentTime: 10,
        name: 'ACOLHIDA DA TURMA',
        topics: [
          {
            content:
              'Apresente-se para a turma e escreva no quadro o termo My Life.Deixe que os alunos especulem e reflitam sobre as palavras escritas na lousa. Explore a ideia de conexão e como ela se encaixa em seu contexto de vida.\nA partir da discussão sobre o termo, incentive os alunos a se expressarem com liberdade e sem medo de errar, compartilhando com a turma as ideias que surgirem. Aqueça a conversa a partir de questões como:\n• O que o termo “My Life” sugere para vocês? Que sentidos ele pode ter?\n• O que vocês imaginam de um conteúdo chamado My Life? Será que ele é semelhante às outras aulas? O que ele pode trazer de novidade?\nAcolha com entusiasmo e respeito todas as falas, mesmo aquelas que se distanciam do que, de fato, é o My Life - Educação Socioemocional. Para tornar essa dinâmica mais participativa, peça a alguns estudantes que registrem no quadro aqueles termos mais recorrentes na fala dos colegas, que representem bem a pluralidade de opiniões e sugestões sobre o que pode ser o My Life, formando, assim, um mapa de palavras.',
            id: 'f27de457-273a-4a57-af22-2230f514e484',
            name: 'Síntese: Apresentação à turma e discussão sobre o termo My Life',
            topicTime: 10,
            viewOrder: 1,
          },
        ],
        viewOrder: 1,
      },
    ],
    status: 0,
    subject: 'Aula 1',
  };

  const mockAnswerTypeLessonData = {
    answerTypeIds: ['5'],
    lessonId: 'bb6b7adf-bcb4-4614-b265-fe39f144c44e',
    resourceId: 'f51ec986-11a8-4a11-8218-10ab8182e216',
    eduModuleId: '5',
  };

  const mockAnswerTypeLessonDataInsert = {
    answerTypeId: '5',
    lessonId: 'bb6b7adf-bcb4-4614-b265-fe39f144c44e',
    resourceId: 'f51ec986-11a8-4a11-8218-10ab8182e216',
    eduModuleId: '5',
  };

  const answerTypeLesson1 = answerTypeLessonMapping({
    answerTypeId: '1',
    lessonId: 'bb6b7adf-bcb4-4614-b265-fe39f144c44e',
    resourceId: 'f51ec986-11a8-4a11-8218-10ab8182e216',
    eduModuleId: '1',
  });
  const answerTypeLesson2 = answerTypeLessonMapping({
    answerTypeId: '2',
    lessonId: 'bb6b7adf-bcb4-4614-b265-fe39f144c44e',
    resourceId: 'f51ec986-11a8-4a11-8218-10ab8182e216',
    eduModuleId: '1',
  });
  const answerTypeLesson3 = answerTypeLessonMapping({
    answerTypeId: '3',
    lessonId: 'bb6b7adf-bcb4-4614-b265-fe39f144c44e',
    resourceId: 'f51ec986-11a8-4a11-8218-10ab8182e216',
    eduModuleId: '1',
  });

  const mockAnswerTypeLessonList = [answerTypeLesson1, answerTypeLesson2, answerTypeLesson3];

  const mockAnswerTypeLessonEntity = answerTypeLessonMapping({
    answerTypeId: '4',
    lessonId: 'bb6b7adf-bcb4-4614-b265-fe39f144c44e',
    resourceId: 'f51ec986-11a8-4a11-8218-10ab8182e216',
    eduModuleId: '4',
  });

  const mockAnswerTypeLessonUpdateAndInsert = [mockAnswerTypeLessonEntity];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnswerTypeLessonService,
        {
          provide: getRepositoryToken(AnswerTypeLessonEntity),
          useValue: {
            find: jest.fn().mockResolvedValue(mockAnswerTypeLessonList),
            findOneOrFail: jest.fn().mockResolvedValue(mockAnswerTypeLessonEntity),
            create: jest.fn().mockResolvedValue(mockAnswerTypeLessonEntity),
            save: jest.fn().mockResolvedValue(mockAnswerTypeLessonEntity),
            softDelete: jest.fn().mockResolvedValue({ raw: { affectedRows: 1 } }),
            restore: jest.fn().mockResolvedValue(mockAnswerTypeLessonEntity),
            limit: jest.fn().mockReturnThis(),
            offset: jest.fn().mockReturnThis(),
            getManyAndCount: jest.fn().mockResolvedValue([mockAnswerTypeLessonList, mockAnswerTypeLessonList.length]),
            createQueryBuilder: jest.fn().mockReturnThis(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation(name => {
              const _config = {
                LL_HS_URL: 'http://localhost:3000',
                LL_CMS_URL: 'http://localhost:3001',
              };

              return _config[name];
            }),
          },
        },
        {
          provide: RedisHelper,
          useValue: {
            get: jest.fn().mockResolvedValue(null),
            set: jest.fn().mockResolvedValue(null),
            del: jest.fn().mockResolvedValue(null),
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn().mockReturnThis(),
            toPromise: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: AnswerTypeService,
          useValue: {
            show: jest.fn().mockResolvedValue(null),
          },
        },
        {
          provide: LessonService,
          useValue: {
            show: jest.fn().mockResolvedValue(mockLesson),
          },
        },
        {
          provide: Connection,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue({
              connect: jest.fn().mockReturnThis(),
              startTransaction: jest.fn().mockReturnThis(),
              commitTransaction: jest.fn().mockReturnThis(),
              rollbackTransaction: jest.fn().mockReturnThis(),
              release: jest.fn().mockReturnThis(),
              manager: {
                merge: jest.fn().mockReturnValue(mockAnswerTypeLessonEntity),
                create: jest.fn().mockReturnValue(mockAnswerTypeLessonEntity),
                save: jest.fn().mockResolvedValue(mockAnswerTypeLessonEntity),
                delete: jest.fn().mockResolvedValue({ affected: true }),
                softDelete: jest.fn().mockResolvedValue({ affected: true }),
                restore: jest.fn().mockReturnValue(mockAnswerTypeLessonEntity),
              },
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AnswerTypeLessonService>(AnswerTypeLessonService);
    repository = module.get<Repository<AnswerTypeLessonEntity>>(getRepositoryToken(AnswerTypeLessonEntity));
    connection = module.get<Connection>(Connection);
    queryRunner = connection.createQueryRunner();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('paginate', () => {
    it('should return a paginate list of answer type lessons', async () => {
      const result = await service.paginate({ page: 1, limit: 10, route: '/answer-type-lessons' });

      expect(result).toEqual({
        items: mockAnswerTypeLessonList,
        itemCount: 3,
        totalItems: 3,
        pageCount: 1,
        next: '',
        previous: '',
      });
    });
  });

  describe('show', () => {
    it('should return a single answer type lesson', async () => {
      const id = '1';
      const result = await service.show(id);

      expect(result).toEqual(mockAnswerTypeLessonEntity);
      expect(repository.findOneOrFail).toBeCalledTimes(1);
      expect(repository.findOneOrFail).toBeCalledWith(id);
    });

    it('should throw a not found exception when entering with non-existent id', async () => {
      jest.spyOn(repository, 'findOneOrFail').mockImplementationOnce(() => {
        throw new NotFoundException();
      });

      await expect(service.show('5')).rejects.toThrowError(NotFoundException);
    });
  });

  describe('destroy', () => {
    it('should successfully delete an answer type lesson', async () => {
      const id = '1';
      const result = await service.destroy(id);

      expect(result).toEqual(true);
      expect(repository.softDelete).toBeCalledTimes(1);
    });

    it('should throw an internal server error exception when TypeORM cannot soft delete', async () => {
      jest.spyOn(repository, 'softDelete').mockImplementationOnce(() => {
        throw new InternalServerErrorException();
      });

      expect(service.destroy('1')).rejects.toThrowError(InternalServerErrorException);
    });
  });

  describe('restore', () => {
    it('should successfully restore an answer type lesson', async () => {
      const id = '1';
      const result = await service.restore(id);

      expect(result).toEqual(mockAnswerTypeLessonEntity);
      expect(repository.restore).toBeCalledTimes(1);
    });

    it('should throw an internal server error exception when TypeORM cannot restore', async () => {
      jest.spyOn(repository, 'restore').mockImplementationOnce(() => {
        throw new InternalServerErrorException();
      });

      expect(service.restore('1')).rejects.toThrowError(InternalServerErrorException);
    });
  });

  describe('store', () => {
    it('should successfully insert a new answer type lesson', async () => {
      const result = await service.store(mockAnswerTypeLessonData);

      expect(result).toEqual(mockAnswerTypeLessonUpdateAndInsert);
      expect(queryRunner.manager.create).toBeCalledTimes(1);
      expect(queryRunner.manager.create).toBeCalledWith(AnswerTypeLessonEntity, mockAnswerTypeLessonDataInsert);
      expect(queryRunner.manager.save).toBeCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should successfully update an answer type lesson', async () => {
      const result = await service.update(mockAnswerTypeLessonData);

      expect(result).toEqual(mockAnswerTypeLessonUpdateAndInsert);
      expect(queryRunner.manager.create).toBeCalledTimes(1);
      expect(queryRunner.manager.create).toBeCalledWith(AnswerTypeLessonEntity, mockAnswerTypeLessonDataInsert);
      expect(queryRunner.manager.save).toBeCalledTimes(1);
    });
  });
});
