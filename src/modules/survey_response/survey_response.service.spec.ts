import { Test, TestingModule } from '@nestjs/testing';
import { SurveyResponseService } from './survey_response.service';
import { SurveyResponse } from './survey_response.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Answer } from '../answer/answer.entity';

describe('SurveyResponseService', () => {
  let service: SurveyResponseService;
  let repository: MockRepository<SurveyResponse>;
  let answerRepository: MockRepository<Answer>;

  const mockRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(),
  });
  const queryBuilderMock = {
    select: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
  };

  type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide:  getRepositoryToken(SurveyResponse),
          useValue: mockRepository(),
        },
        {
          provide:  getRepositoryToken(Answer),
          useValue: mockRepository(),
        },
        SurveyResponseService,
      ],
    }).compile();

    service = module.get<SurveyResponseService>(SurveyResponseService);
    repository = module.get<MockRepository<SurveyResponse>>(
      getRepositoryToken(SurveyResponse),
    );
    answerRepository = module.get<MockRepository<Answer>>(
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
      surveyId: 1,
      userId: 1,
      completionDate: new Date(),
    };

    it('Fail: CreateSurveyResponse', async () => {
      repository.save.mockRejectedValue(new Error('save error'));
      await expect(service.createSurveyResponse(createArgs)).rejects.toThrow('Unexpected error: save error');
    });

    it('Pass: CreateSurveyResponse', async () => {
      repository.save.mockResolvedValue(createArgs);
      const result = await service.createSurveyResponse(createArgs);

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
      userId: 1,
      completionDate: new Date(),
    };
    const failMock = {
      getRawOne: jest.fn().mockRejectedValue(new Error('findOne error')),
      getRawMany: jest.fn().mockRejectedValue(new Error('find error')),
    };
    const passMock = {
      getRawOne: jest.fn().mockResolvedValue(readResult),
      getRawMany: jest.fn().mockResolvedValue([readResult]),
    }

    it('Fail: GetSurveyResponse', async () => {
      repository.createQueryBuilder.mockReturnValue({ ...queryBuilderMock, ...failMock });
      await expect(service.getSurveyResponse(readArgs)).rejects.toThrow('Unexpected error: findOne error');
    });

    it('Fail: GetSurveyResponses', async () => {
      repository.createQueryBuilder.mockReturnValue({ ...queryBuilderMock, ...failMock });
      await expect(service.getSurveyResponses()).rejects.toThrow('Unexpected error: find error');
    });

    it('Fail: GetCompletedSurveys', async () => {
      repository.createQueryBuilder.mockReturnValue({ ...queryBuilderMock, ...failMock });
      await expect(service.getCompletedSurveys()).rejects.toThrow('Unexpected error: find error');
    });

    it ('Pass: GetSurveyResponse', async () => {
      repository.createQueryBuilder.mockReturnValue({ ...queryBuilderMock, ...passMock });
      const result = await service.getSurveyResponse(readArgs);

      expect(repository.createQueryBuilder).toHaveBeenCalledTimes(1);

      expect(result).toEqual(readResult);
    });

    it ('Pass: GetSurveyResponses', async () => {
      repository.createQueryBuilder.mockReturnValue({ ...queryBuilderMock, ...passMock });
      const result = await service.getSurveyResponses();

      expect(repository.createQueryBuilder).toHaveBeenCalledTimes(1);

      expect(result).toEqual([readResult]);
    });

    it ('Pass: GetCompletedSurveys', async () => {
      repository.createQueryBuilder.mockReturnValue({ ...queryBuilderMock, ...passMock });
      const result = await service.getCompletedSurveys();

      expect(repository.createQueryBuilder).toHaveBeenCalledTimes(1);

      expect(result).toEqual([readResult]);
    });
  });

  describe('Update', () => {
    const updateArgsId = 1;
    const updateArgs = {
      userId: 2
    };
    const originalResult = {
      id: 1,
      surveyId: 1,
      userId: 1,
      completionDate: null,
    }
    const updateResult = {
      id: 1,
      surveyId: 1,
      userId: 2,
      completionDate: null,
    }
    const passMock = {
      getRawOne: jest.fn().mockResolvedValue(originalResult),
    };

    it('Fail: UpdateSurveyResponse', async () => {
      repository.update.mockRejectedValueOnce(new Error('update error'));
      await expect(service.updateSurveyResponse(updateArgsId, updateArgs)).rejects.toThrow('Unexpected error: update error');
    });

    it('Fail: CompleteSurvey', async () => {
      repository.update.mockRejectedValueOnce(new Error('update error'));
      await expect(service.completeSurvey(updateArgsId)).rejects.toThrow('Unexpected error: update error');
    });

    it('Pass: UpdateSurveyResponse', async () => {
      repository.createQueryBuilder.mockReturnValue({ ...queryBuilderMock, ...passMock });
      const result = await service.updateSurveyResponse(updateArgsId, updateArgs);

      expect(repository.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(repository.update).toHaveBeenCalledTimes(1);
      expect(repository.update).toHaveBeenCalledWith(updateArgsId, updateArgs);

      expect(result).toEqual(updateResult);
    });

    it('Pass: CompleteSurvey', async () => {
      repository.createQueryBuilder.mockReturnValue({ ...queryBuilderMock, ...passMock });
      const result = await service.completeSurvey(updateArgsId);

      expect(repository.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(repository.update).toHaveBeenCalledTimes(1);
      expect(repository.update).toHaveBeenCalledWith(updateArgsId, { completionDate: expect.any(Date) });

      expect(result.completionDate).toEqual(expect.any(Date));
      expect(result).toEqual({
        ...originalResult,
        completionDate: expect.any(Date),
      });
    });
  });

  describe('Delete', () => {
    const deleteArgs = 1;
    const deleteResult = {
      affected: 1
    };

    it('Fail: DeleteSurveyResponse', async () => {
      repository.delete.mockRejectedValue(new Error('delete error'));
      await expect(service.deleteSurveyResponse(deleteArgs)).rejects.toThrow('Unexpected error: delete error');
    });

    it('Pass: DeleteSurveyResponse', async () => {
      repository.delete.mockResolvedValue(deleteResult);
      const result = await service.deleteSurveyResponse(deleteArgs);

      expect(answerRepository.delete).toHaveBeenCalledTimes(1);
      expect(answerRepository.delete).toHaveBeenCalledWith({ surveyResponseId: deleteArgs });
      expect(repository.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(repository.delete).toHaveBeenCalledTimes(1);
      expect(repository.delete).toHaveBeenCalledWith(deleteArgs);

      expect(result).toEqual(deleteResult.affected);
    });
  });
});
