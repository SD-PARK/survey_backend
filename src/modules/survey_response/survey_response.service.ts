import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SurveyResponse } from './survey_response.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateSurveyResponseInput, UpdateSurveyResponseInput } from './survey_response.input';
import { Answer } from '../answer/answer.entity';

@Injectable()
export class SurveyResponseService {
    constructor(
        @InjectRepository(SurveyResponse) private readonly surveyResponseRepository: Repository<SurveyResponse>,
        @InjectRepository(Answer) private readonly answerRepository: Repository<Answer>,
    ) {}
    private readonly logger: Logger = new Logger(SurveyResponseService.name);

    // Create
    async createSurveyResponse(surveyResponseInput: CreateSurveyResponseInput): Promise<SurveyResponse> {
        try {
            const newSurveyResponse: SurveyResponse = this.surveyResponseRepository.create(surveyResponseInput);
            return await this.surveyResponseRepository.save(newSurveyResponse);
        } catch (err) {
            throw new Error(`Unexpected error: ${err.message}`);
        }
    }
    
    // Read
    async getSurveyResponse(id: number): Promise<SurveyResponse> {
        try {
            const result: SurveyResponse = await this.surveyResponseRepository.createQueryBuilder('sr')
                                    .select([
                                        `sr.id as "id"`,
                                        `sr.survey_id as "surveyId"`,
                                        `sr.user_id as "userId"`,
                                        `sr.completion_date as "completionDate"`,
                                        `COALESCE(SUM(c.score), 0) as "score"`
                                    ])
                                    .leftJoin('answers', 'a', 'sr.id = a.survey_response_id')
                                    .leftJoin('choices', 'c', 'a.choice_id = c.id')
                                    .where('sr.id = :surveyResponseId', { surveyResponseId: id })
                                    .groupBy('sr.id')
                                    .getRawOne();
            
            if (result === undefined)
                throw new NotFoundException(`ID: ${id}에 해당하는 항목을 찾을 수 없습니다.`);
            else
                return result;
        } catch (err) {
            throw new Error(`Unexpected error: ${err.message}`);
        }
    }

    async getSurveyResponses(): Promise<SurveyResponse[]> {
        try {
            const result: SurveyResponse[] = await this.surveyResponseRepository.createQueryBuilder('sr')
                                    .select([
                                        `sr.id as "id"`,
                                        `sr.survey_id as "surveyId"`,
                                        `sr.user_id as "userId"`,
                                        `sr.completion_date as "completionDate"`,
                                        `COALESCE(SUM(c.score), 0) as "score"`
                                    ])
                                    .leftJoin('answers', 'a', 'sr.id = a.survey_response_id')
                                    .leftJoin('choices', 'c', 'a.choice_id = c.id')
                                    .groupBy('sr.id')
                                    .getRawMany();
            return result;
        } catch (err) {
            throw new Error(`Unexpected error: ${err.message}`);
        }
    }

    async getCompletedSurveys(): Promise<SurveyResponse[]> {
        try {
            const result: SurveyResponse[] = await this.surveyResponseRepository.createQueryBuilder('sr')
                                    .select([
                                        `sr.id as "id"`,
                                        `sr.survey_id as "surveyId"`,
                                        `sr.user_id as "userId"`,
                                        `sr.completion_date as "completionDate"`,
                                        `COALESCE(SUM(c.score), 0) as "score"`
                                    ])
                                    .leftJoin('answers', 'a', 'sr.id = a.survey_response_id')
                                    .leftJoin('choices', 'c', 'a.choice_id = c.id')
                                    .where('sr.completion_date IS NOT NULL')
                                    .groupBy('sr.id')
                                    .getRawMany();
            return result;
        } catch (err) {
            throw new Error(`Unexpected error: ${err.message}`);
        }
    }

    // Update
    async updateSurveyResponse(id: number, surveyResponseInput: UpdateSurveyResponseInput): Promise<SurveyResponse> {
        const surveyResponse: SurveyResponse = await this.getSurveyResponse(id);
        try {
            await this.surveyResponseRepository.update(id, surveyResponseInput);
            const updateSurveyResponse = { ...surveyResponse, ...surveyResponseInput };
            return updateSurveyResponse;
        } catch (err) {
            throw new Error(`Unexpected error: ${err.message}`);
        }
    }

    async completeSurvey(id: number): Promise<SurveyResponse> {
        const surveyResponse: SurveyResponse = await this.getSurveyResponse(id);
        try {
            const now = new Date();
            await this.surveyResponseRepository.update(id, { completionDate: now });
            const completeSurveyResponse = { ...surveyResponse, completionDate: now };
            return completeSurveyResponse;
        } catch (err) {
            throw new Error(`Unexpected error: ${err.message}`);
        }
    }

    // Delete
    async deleteSurveyResponse(id: number): Promise<number> {
        await this.getSurveyResponse(id);
        try {
            await this.answerRepository.delete({ surveyResponseId: id });
            const result: DeleteResult = await this.surveyResponseRepository.delete(id);
            return result.affected;
        } catch (err) {
            throw new Error(`Unexpected error: ${err.message}`);
        }
    }
}