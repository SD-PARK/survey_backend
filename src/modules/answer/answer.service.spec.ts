import { Test, TestingModule } from '@nestjs/testing';
import { AnswerService } from './answer.service';
import { Answer } from './answer.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AnswerService', () => {
  let service: AnswerService;
  let repository: MockRepository<Answer>;

  const mockRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  });

  type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide:  getRepositoryToken(Answer),
          useValue: mockRepository(),
        },
        AnswerService,
      ],
    }).compile();

    service = module.get<AnswerService>(AnswerService);
    repository = module.get<MockRepository<Answer>>(
      getRepositoryToken(Answer),
    );
  });

  beforeEach(() => {
    jest.clearAllMocks(); // mock 함수의 호출 횟수 초기화
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create', () => {
    const createArgs = {
      surveyResponseId: 1,
      choiceId: 1,
    };

    it('Fail: CreateAnswer', async () => {
      repository.save.mockRejectedValue(new Error('save error'));
      await expect(service.createAnswer(createArgs)).rejects.toThrow('Unexpected error: save error');
    });

    it('Pass: CreateAnswer', async () => {
      repository.save.mockResolvedValue(createArgs);
      const result = await service.createAnswer(createArgs);

      expect(repository.create).toHaveBeenCalledTimes(1);
      expect(repository.create).toHaveBeenCalledWith(createArgs);
      expect(repository.save).toHaveBeenCalledTimes(1);

      expect(result).toEqual(createArgs);
    });
  });

  describe('Read', () => {
    const readArgs: number = 1;
    const readResult = {
      id: 1,
      surveyResponseId: 1,
      choiceId: 1,
    }

    it('Fail: GetAnswer', async () => {
      repository.findOne.mockRejectedValue(new Error('findOne error'));
      await expect(service.getAnswer(readArgs)).rejects.toThrow('Unexpected error: findOne error');
    });

    it('Fail: GetAnswers', async () => {
      repository.find.mockRejectedValue(new Error('find error'));
      await expect(service.getAnswers()).rejects.toThrow('Unexpected error: find error');
    });

    it ('Pass: GetAnswer', async () => {
      repository.findOne.mockResolvedValue(readResult);
      const result = await service.getAnswer(readArgs);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: readArgs }});
      expect(repository.findOne).toHaveBeenCalledTimes(1);

      expect(result).toEqual(readResult);
    });

    it ('Pass: GetAnswers', async () => {
      repository.find.mockResolvedValue([readResult]);
      const result = await service.getAnswers();

      expect(repository.find).toHaveBeenCalledTimes(1);

      expect(result).toEqual([readResult]);
    });
  });

  describe('Update', () => {
    const updateArgsId = 1;
    const updateArgs = {
      choiceId: 2
    };
    const originalResult = {
      id: 1,
      surveyResponseId: 1,
      choiceId: 1,
    }
    const updateResult = {
      id: 1,
      surveyResponseId: 1,
      choiceId: 2,
    }

    it('Fail: UpdateAnswer', async () => {
      repository.update.mockRejectedValueOnce(new Error('update error'));
      await expect(service.updateAnswer(updateArgsId, updateArgs)).rejects.toThrow('Unexpected error: update error');
    });

    it('Pass: UpdateAnswer', async () => {
      repository.findOne.mockResolvedValue(originalResult);
      const result = await service.updateAnswer(updateArgsId, updateArgs);

      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: updateArgsId }});
      expect(repository.update).toHaveBeenCalledTimes(1);
      expect(repository.update).toHaveBeenCalledWith(updateArgsId, updateArgs);

      expect(result).toEqual(updateResult);
    });
  });

  describe('Delete', () => {
    const deleteArgs = 1;
    const deleteResult = {
      affected: 1
    };

    it('Fail: DeleteAnswer', async () => {
      repository.delete.mockRejectedValue(new Error('delete error'));
      await expect(service.deleteAnswer(deleteArgs)).rejects.toThrow('Unexpected error: delete error');
    });

    it('Pass: DeleteAnswer', async () => {
      repository.delete.mockResolvedValue(deleteResult);
      const result = await service.deleteAnswer(deleteArgs);

      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: deleteArgs }});
      expect(repository.delete).toHaveBeenCalledTimes(1);
      expect(repository.delete).toHaveBeenCalledWith(deleteArgs);

      expect(result).toEqual(deleteResult.affected);
    });
  });
});
