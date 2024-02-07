import { Test, TestingModule } from '@nestjs/testing';
import { SurveyService } from './survey.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Survey } from './survey.entity';
import { Repository } from 'typeorm';

describe('SurveyService', () => {
  let service: SurveyService;
  let repository: MockRepository<Survey>;

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
          provide:  getRepositoryToken(Survey),
          useValue: mockRepository(),
        },
        SurveyService,
      ],
    }).compile();

    service = module.get<SurveyService>(SurveyService);
    repository = module.get<MockRepository<Survey>>(
      getRepositoryToken(Survey),
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
      title: '제목',
      describe: '설명',
    };

    it('Fail: CreateSurvey', async () => {
      repository.save.mockRejectedValue(new Error('save error'));
      await expect(service.createSurvey(createArgs)).rejects.toThrow('Unexpected error: save error');
    });

    it('Pass: CreateSurvey', async () => {
      repository.save.mockResolvedValue(createArgs);
      const result = await service.createSurvey(createArgs);

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
      title: '제목',
      describe: '설명',
    }

    it('Fail: GetSurvey', async () => {
      repository.findOne.mockRejectedValue(new Error('findOne error'));
      await expect(service.getSurvey(readArgs)).rejects.toThrow('Unexpected error: findOne error');
    });

    it('Fail: GetSurveys', async () => {
      repository.find.mockRejectedValue(new Error('find error'));
      await expect(service.getSurveys()).rejects.toThrow('Unexpected error: find error');
    });

    it ('Pass: GetSurvey', async () => {
      repository.findOne.mockResolvedValue(readResult);
      const result = await service.getSurvey(readArgs);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: readArgs }});
      expect(repository.findOne).toHaveBeenCalledTimes(1);

      expect(result).toEqual(readResult);
    });

    it ('Pass: GetSurveys', async () => {
      repository.find.mockResolvedValue([readResult]);
      const result = await service.getSurveys();

      expect(repository.find).toHaveBeenCalledTimes(1);

      expect(result).toEqual([readResult]);
    });
  });

  describe('Update', () => {
    const updateArgsId = 1;
    const updateArgs = {
      title: '변경된 제목'
    };
    const originalResult = {
      id: 1,
      title: '기존 제목',
      describe: '설명',
    }
    const updateResult = {
      id: 1,
      title: '변경된 제목',
      describe: '설명',
    }

    it('Fail: UpdateSurvey', async () => {
      repository.update.mockRejectedValueOnce(new Error('update error'));
      await expect(service.updateSurvey(updateArgsId, updateArgs)).rejects.toThrow('Unexpected error: update error');
    });

    it('Pass: UpdateSurvey', async () => {
      repository.findOne.mockResolvedValue(originalResult);
      const result = await service.updateSurvey(updateArgsId, updateArgs);

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

    it('Fail: DeleteSurvey', async () => {
      repository.delete.mockRejectedValue(new Error('delete error'));
      await expect(service.deleteSurvey(deleteArgs)).rejects.toThrow('Unexpected error: delete error');
    });

    it('Pass: DeleteSurvey', async () => {
      repository.delete.mockResolvedValue(deleteResult);
      const result = await service.deleteSurvey(deleteArgs);

      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: deleteArgs }});
      expect(repository.delete).toHaveBeenCalledTimes(1);
      expect(repository.delete).toHaveBeenCalledWith(deleteArgs);

      expect(result).toEqual(deleteResult.affected);
    });
  });
});
