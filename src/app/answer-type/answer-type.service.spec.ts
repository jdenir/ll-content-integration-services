import { Test, TestingModule } from '@nestjs/testing';
import { AnswerTypeService } from './answer-type.service';
import { ConfigService } from '@nestjs/config';
import { RedisHelper } from '../../helper/redis.helper';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AnswerTypeEntity } from './answer-type.entity';
import { Repository } from 'typeorm';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';

function answerTypeMapping(partial: Partial<AnswerTypeEntity>) {
  const answerType = new AnswerTypeEntity();
  answerType.id = partial.id;
  answerType.name = partial.name;
  answerType.createdAt = partial.createdAt;
  answerType.updatedAt = partial.updatedAt;
  answerType.deletedAt = partial.deletedAt;

  return answerType;
}

describe('AnswerTypeService', () => {
  let service: AnswerTypeService;
  let repository: Repository<AnswerTypeEntity>;

  const mockAnswerTypeData = { name: 'answer type 1' };

  const answerType1 = answerTypeMapping({ name: 'answer1' });
  const answerType2 = answerTypeMapping({ name: 'answer2' });
  const answerType3 = answerTypeMapping({ name: 'answer3' });

  const mockAnswerTypeList = [answerType1, answerType2, answerType3];

  const mockAnswerTypeEntity = answerTypeMapping({
    name: 'answer type 1',
  });

  const mockUpdatedAnswerTypeEntity = answerTypeMapping({
    name: 'answer type 1.1',
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnswerTypeService,
        {
          provide: getRepositoryToken(AnswerTypeEntity),
          useValue: {
            find: jest.fn().mockResolvedValue(mockAnswerTypeList),
            findOneOrFail: jest.fn().mockResolvedValue(mockAnswerTypeEntity),
            create: jest.fn().mockResolvedValue(mockAnswerTypeEntity),
            save: jest.fn().mockResolvedValue(mockAnswerTypeEntity),
            merge: jest.fn().mockResolvedValue(mockUpdatedAnswerTypeEntity),
            update: jest.fn().mockResolvedValue(mockUpdatedAnswerTypeEntity),
            softDelete: jest.fn().mockResolvedValue({ raw: { affectedRows: 1 } }),
            restore: jest.fn().mockResolvedValue(mockAnswerTypeEntity),
            limit: jest.fn().mockReturnThis(),
            offset: jest.fn().mockReturnThis(),
            getManyAndCount: jest.fn().mockResolvedValue([mockAnswerTypeList, mockAnswerTypeList.length]),
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
      ],
    }).compile();

    service = module.get<AnswerTypeService>(AnswerTypeService);
    repository = module.get<Repository<AnswerTypeEntity>>(getRepositoryToken(AnswerTypeEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('paginate', () => {
    it('should return a paginate list of answer types', async () => {
      const result = await service.paginate({ page: 1, limit: 10, route: '/answer-types' });

      expect(result).toEqual({
        items: mockAnswerTypeList,
        itemCount: 3,
        totalItems: 3,
        pageCount: 1,
        next: '',
        previous: '',
      });
    });
  });

  describe('store', () => {
    it('should successfully insert a new answer type', async () => {
      const result = await service.store(mockAnswerTypeData);

      expect(result).toEqual(mockAnswerTypeEntity);
      expect(repository.create).toBeCalledTimes(1);
      expect(repository.create).toBeCalledWith(mockAnswerTypeData);
      expect(repository.save).toBeCalledTimes(1);
    });

    it('should throw an internal server error exception when TypeOrm cannot save', async () => {
      jest.spyOn(repository, 'save').mockImplementationOnce(() => {
        throw new InternalServerErrorException();
      });

      expect(service.store(mockAnswerTypeData)).rejects.toThrowError(InternalServerErrorException);
    });
  });

  describe('show', () => {
    it('should return a single answer type', async () => {
      const id = '1';
      const result = await service.show(id);

      expect(result).toEqual(mockAnswerTypeEntity);
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

  describe('update', () => {
    it('should successfully update an answer type', async () => {
      jest.spyOn(repository, 'save').mockResolvedValueOnce(mockAnswerTypeEntity);

      const result = await service.update('1', mockAnswerTypeData);

      expect(result).toEqual(mockAnswerTypeEntity);
      expect(repository.merge).toBeCalledTimes(1);
      expect(repository.merge).toBeCalledWith(mockAnswerTypeEntity, mockAnswerTypeData);
      expect(repository.save).toBeCalledTimes(1);
    });

    it('should throw a not found exception when entering with non-existent id', async () => {
      jest.spyOn(repository, 'findOneOrFail').mockImplementationOnce(() => {
        throw new NotFoundException();
      });

      await expect(service.update('5', mockAnswerTypeData)).rejects.toThrowError(NotFoundException);
    });

    it('should throw an internal server error exception when TypeORM cannot save', async () => {
      jest.spyOn(repository, 'save').mockImplementationOnce(() => {
        throw new InternalServerErrorException();
      });

      expect(service.update('1', mockAnswerTypeData)).rejects.toThrowError(InternalServerErrorException);
    });
  });

  describe('destroy', () => {
    it('should successfully delete an answer type', async () => {
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
    it('should successfully restore an answer type', async () => {
      const id = '1';
      const result = await service.restore(id);

      expect(result).toEqual(mockAnswerTypeEntity);
      expect(repository.restore).toBeCalledTimes(1);
    });

    it('should throw an internal server error exception when TypeORM cannot restore', async () => {
      jest.spyOn(repository, 'restore').mockImplementationOnce(() => {
        throw new InternalServerErrorException();
      });

      expect(service.restore('1')).rejects.toThrowError(InternalServerErrorException);
    });
  });
});
