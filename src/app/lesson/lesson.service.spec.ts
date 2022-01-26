import { Test, TestingModule } from '@nestjs/testing';
import { LessonService } from './lesson.service';
import { LexContentServiceHelper } from '../../helper/lex-content.helper';
import { RedisHelper } from '../../helper/redis.helper';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AnswerTypeLessonEntity } from '../answer-type-lesson/answer-type-lesson.entity';

describe('LessonService', () => {
  let lessonService: LessonService;
  let lexContentService: LexContentServiceHelper;

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

  const mockAnswersLesson = {
    id: '2a074162-c811-4031-bb98-17d966c2ac42',
    lessonId: 'bb6b7adf-bcb4-4614-b265-fe39f144c44e',
    resourceId: '2a074162-c811-4031-bb98-17d966c2ac4a',
    answerTypeId: '2a074162-c811-4031-bb98-17d966c2ac45',
    eduModuleId: 'bb6b7adf-bcb4-4614-b265-fe39f144c448',
    createdAt: '2020-06-09T15:33:14.120Z',
    updatedAt: '2020-06-09T15:33:14.120Z',
    deletedAt: null,
    answerType: {
      id: '2a074162-c811-4031-bb98-17d966c2ac45',
      name: 'imagem',
      createdAt: '2020-06-09T15:31:45.540Z',
      updatedAt: '2020-06-09T15:31:45.540Z',
      deletedAt: null,
    },
  };

  const mockResultShowLesson = {
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
          answerTypeLessons: [mockAnswersLesson],
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LessonService,
        {
          provide: RedisHelper,
          useValue: {
            get: jest.fn().mockResolvedValue(null),
            set: jest.fn().mockResolvedValue(null),
            del: jest.fn().mockResolvedValue(null),
            setex: jest.fn().mockResolvedValue(null),
            buildCacheIndex: jest.fn().mockResolvedValue(null),
          },
        },
        {
          provide: LexContentServiceHelper,
          useValue: {
            showLesson: jest.fn().mockResolvedValue(mockLesson),
          },
        },
        {
          provide: getRepositoryToken(AnswerTypeLessonEntity),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnThis(),
            getMany: jest.fn().mockResolvedValue([mockAnswersLesson]),
            innerJoinAndSelect: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
          },
        },
      ],
    }).compile();

    lessonService = module.get<LessonService>(LessonService);
    lexContentService = module.get<LexContentServiceHelper>(LexContentServiceHelper);
  });

  it('should be defined', () => {
    expect(lessonService).toBeDefined();
  });

  describe('show', () => {
    it('should return a single lesson', async () => {
      const id = 'bb6b7adf-bcb4-4614-b265-fe39f144c44e';
      const result = await lessonService.show(id);

      expect(result).toEqual(mockResultShowLesson);
    });

    it('should not return a single lesson', async () => {
      jest.spyOn(lexContentService, 'showLesson').mockImplementation(() => {
        throw new NotFoundException();
      });
      const id = 'bb6b7adf-bcb4-4614-b265-fe39f144c44e';

      expect(lessonService.show(id)).rejects.toThrowError(NotFoundException);
    });
  });
});
