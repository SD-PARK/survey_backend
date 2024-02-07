import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Survey } from './survey.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateSurveyInput, UpdateSurveyInput } from './survey.input';

@Injectable()
export class SurveyService {
    constructor(
        @InjectRepository(Survey) private readonly surveyRepository: Repository<Survey>,
    ) {}
    private readonly logger: Logger = new Logger(SurveyService.name);

    // Create
    async createSurvey(surveyInput: CreateSurveyInput): Promise<Survey> {
        try {
            const newSurvey: Survey = this.surveyRepository.create(surveyInput);
            return await this.surveyRepository.save(newSurvey);
        } catch (err) {
            throw new Error(`Unexpected error: ${err.message}`);
        }
    }
    
    // Read
    async getSurvey(id: number): Promise<Survey> {
        try {
            const result: Survey = await this.surveyRepository.findOne({ where: { id: id }});
            
            if (result === null)
                throw new NotFoundException(`ID: ${id}에 해당하는 항목을 찾을 수 없습니다.`);
            else
                return result;
        } catch (err) {
            throw new Error(`Unexpected error: ${err.message}`);
        }
    }

    async getSurveys(): Promise<Survey[]> {
        try {
            const result: Survey[] = await this.surveyRepository.find();
            return result;
        } catch (err) {
            throw new Error(`Unexpected error: ${err.message}`);
        }
    }

    // Update
    async updateSurvey(id: number, surveyInput: UpdateSurveyInput): Promise<Survey> {
        const survey: Survey = await this.getSurvey(id);
        try {
            await this.surveyRepository.update(id, surveyInput);
            const updateSurvey = { ...survey, ...surveyInput };
            return updateSurvey;
        } catch (err) {
            throw new Error(`Unexpected error: ${err.message}`);
        }
    }

    // Delete
    async deleteSurvey(id: number): Promise<number> {
        await this.getSurvey(id);
        try {
            const result: DeleteResult = await this.surveyRepository.delete(id);
            return result.affected;
        } catch (err) {
            throw new Error(`Unexpected error: ${err.message}`);
        }
    }
}
