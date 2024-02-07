import { Test, TestingModule } from '@nestjs/testing';
import { QuestionService } from './question.service';
import { Question } from './question.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('QuestionService', () => {
  let service: QuestionService;
  let repository: MockRepository<Question>;

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
          provide:  getRepositoryToken(Question),
          useValue: mockRepository(),
        },
        QuestionService,
      ],
    }).compile();

    service = module.get<QuestionService>(QuestionService);
    repository = module.get<MockRepository<Question>>(
      getRepositoryToken(Question),
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
      surveyId: 1,
      content: '문제',
    };

    it('Fail: CreateQuestion', async () => {
      repository.save.mockRejectedValue(new Error('save error'));
      await expect(service.createQuestion(createArgs)).rejects.toThrow('Unexpected error: save error');
    });

    it('Pass: CreateQuestion', async () => {
      repository.save.mockResolvedValue(createArgs);
      const result = await service.createQuestion(createArgs);

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
      surveyId: 1,
      content: '문제',
    }

    it('Fail: GetQuestion', async () => {
      repository.findOne.mockRejectedValue(new Error('findOne error'));
      await expect(service.getQuestion(readArgs)).rejects.toThrow('Unexpected error: findOne error');
    });

    it('Fail: GetQuestions', async () => {
      repository.find.mockRejectedValue(new Error('find error'));
      await expect(service.getQuestions()).rejects.toThrow('Unexpected error: find error');
    });

    it ('Pass: GetQuestion', async () => {
      repository.findOne.mockResolvedValue(readResult);
      const result = await service.getQuestion(readArgs);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: readArgs }});
      expect(repository.findOne).toHaveBeenCalledTimes(1);

      expect(result).toEqual(readResult);
    });

    it ('Pass: GetQuestions', async () => {
      repository.find.mockResolvedValue([readResult]);
      const result = await service.getQuestions();

      expect(repository.find).toHaveBeenCalledTimes(1);

      expect(result).toEqual([readResult]);
    });
  });

  describe('Update', () => {
    const updateArgsId = 1;
    const updateArgs = {
      surveyId: 2,
    };
    const originalResult = {
      id: 1,
      surveyId: 1,
      content: '문제',
    }
    const updateResult = {
      id: 1,
      surveyId: 2,
      content: '문제',
    }

    it('Fail: UpdateQuestion', async () => {
      repository.update.mockRejectedValueOnce(new Error('update error'));
      await expect(service.updateQuestion(updateArgsId, updateArgs)).rejects.toThrow('Unexpected error: update error');
    });

    it('Pass: UpdateQuestion', async () => {
      repository.findOne.mockResolvedValue(originalResult);
      const result = await service.updateQuestion(updateArgsId, updateArgs);

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

    it('Fail: DeleteQuestion', async () => {
      repository.delete.mockRejectedValue(new Error('delete error'));
      await expect(service.deleteQuestion(deleteArgs)).rejects.toThrow('Unexpected error: delete error');
    });

    it('Pass: DeleteQuestion', async () => {
      repository.delete.mockResolvedValue(deleteResult);
      const result = await service.deleteQuestion(deleteArgs);

      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: deleteArgs }});
      expect(repository.delete).toHaveBeenCalledTimes(1);
      expect(repository.delete).toHaveBeenCalledWith(deleteArgs);

      expect(result).toEqual(deleteResult.affected);
    });
  });
});
