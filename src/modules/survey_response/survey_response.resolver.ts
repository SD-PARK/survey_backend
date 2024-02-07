import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SurveyResponseService } from './survey_response.service';
import { SurveyResponse } from './survey_response.entity';
import { CreateSurveyResponseInput, UpdateSurveyResponseInput } from './survey_response.input';

@Resolver()
export class SurveyResponseResolver {
    constructor(private readonly surveyResponseService: SurveyResponseService) {}
    // Create
    @Mutation(() => SurveyResponse)
    async createSurveyResponse(@Args('surveyResponseInput') surveyResponseInput: CreateSurveyResponseInput): Promise<SurveyResponse> {
        return this.surveyResponseService.createSurveyResponse(surveyResponseInput);
    }
    
    // Read
    @Query(() => SurveyResponse)
    async getSurveyResponse(@Args('id') id: number): Promise<SurveyResponse> {
        return this.surveyResponseService.getSurveyResponse(id);
    }
    
    @Query(() => [SurveyResponse])
    async getSurveyResponses(): Promise<SurveyResponse[]> {
        return this.surveyResponseService.getSurveyResponses();
    }

    @Query(() => [SurveyResponse])
    async getCompletedSurveys(): Promise<SurveyResponse[]> {
        return this.surveyResponseService.getCompletedSurveys();
    }

    // Update
    @Mutation(() => SurveyResponse)
    async updateSurveyResponse(
        @Args('id') id: number,
        @Args('surveyResponseInput') surveyResponseInput: UpdateSurveyResponseInput
    ): Promise<SurveyResponse> {
        return this.surveyResponseService.updateSurveyResponse(id, surveyResponseInput);
    }

    @Mutation(() => SurveyResponse)
    async completeSurvey(
        @Args('id') id: number
    ): Promise<SurveyResponse> {
        return this.surveyResponseService.completeSurvey(id);
    }

    // Delete
    @Mutation(() => Number)
    async deleteSurveyResponse(@Args('id') id: number): Promise<number> {
        return this.surveyResponseService.deleteSurveyResponse(id);
    }
}
