import { Test, TestingModule } from '@nestjs/testing';
import { ChoiceService } from './choice.service';
import { Choice } from './choice.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ChoiceService', () => {
  let service: ChoiceService;
  let repository: MockRepository<Choice>;

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
          provide:  getRepositoryToken(Choice),
          useValue: mockRepository(),
        },
        ChoiceService,
      ],
    }).compile();

    service = module.get<ChoiceService>(ChoiceService);
    repository = module.get<MockRepository<Choice>>(
      getRepositoryToken(Choice),
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
      questionId: 1,
      content: '선택지',
      score: 1,
    };

    it('Fail: CreateChoice', async () => {
      repository.save.mockRejectedValue(new Error('save error'));
      await expect(service.createChoice(createArgs)).rejects.toThrow('Unexpected error: save error');
    });

    it('Pass: CreateChoice', async () => {
      repository.save.mockResolvedValue(createArgs);
      const result = await service.createChoice(createArgs);

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
      questionId: 1,
      content: '선택지',
      score: 1,
    }

    it('Fail: GetChoice', async () => {
      repository.findOne.mockRejectedValue(new Error('findOne error'));
      await expect(service.getChoice(readArgs)).rejects.toThrow('Unexpected error: findOne error');
    });

    it('Fail: GetChoices', async () => {
      repository.find.mockRejectedValue(new Error('find error'));
      await expect(service.getChoices()).rejects.toThrow('Unexpected error: find error');
    });

    it ('Pass: GetChoice', async () => {
      repository.findOne.mockResolvedValue(readResult);
      const result = await service.getChoice(readArgs);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: readArgs }});
      expect(repository.findOne).toHaveBeenCalledTimes(1);

      expect(result).toEqual(readResult);
    });

    it ('Pass: GetChoices', async () => {
      repository.find.mockResolvedValue([readResult]);
      const result = await service.getChoices();

      expect(repository.find).toHaveBeenCalledTimes(1);

      expect(result).toEqual([readResult]);
    });
  });

  describe('Update', () => {
    const updateArgsId = 1;
    const updateArgs = {
      questionId: 2,
    };
    const originalResult = {
      id: 1,
      questionId: 1,
      content: '선택지',
      score: 1,
    }
    const updateResult = {
      id: 1,
      questionId: 2,
      content: '선택지',
      score: 1,
    }

    it('Fail: UpdateChoice', async () => {
      repository.update.mockRejectedValueOnce(new Error('update error'));
      await expect(service.updateChoice(updateArgsId, updateArgs)).rejects.toThrow('Unexpected error: update error');
    });

    it('Pass: UpdateChoice', async () => {
      repository.findOne.mockResolvedValue(originalResult);
      const result = await service.updateChoice(updateArgsId, updateArgs);

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

    it('Fail: DeleteChoice', async () => {
      repository.delete.mockRejectedValue(new Error('delete error'));
      await expect(service.deleteChoice(deleteArgs)).rejects.toThrow('Unexpected error: delete error');
    });

    it('Pass: DeleteChoice', async () => {
      repository.delete.mockResolvedValue(deleteResult);
      const result = await service.deleteChoice(deleteArgs);

      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: deleteArgs }});
      expect(repository.delete).toHaveBeenCalledTimes(1);
      expect(repository.delete).toHaveBeenCalledWith(deleteArgs);

      expect(result).toEqual(deleteResult.affected);
    });
  });
});
