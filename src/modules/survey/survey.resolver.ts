import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Survey } from './survey.entity';
import { SurveyService } from './survey.service';
import { CreateSurveyInput, UpdateSurveyInput } from './survey.input';

@Resolver((of) => Survey)
export class SurveyResolver {
    constructor(private readonly surveyService: SurveyService) {}
    // Create
    @Mutation(() => Survey)
    async createSurvey(@Args('surveyInput') surveyInput: CreateSurveyInput): Promise<Survey> {
        return this.surveyService.createSurvey(surveyInput);
    }
    
    // Read
    @Query(() => Survey)
    async getSurvey(@Args('id') id: number): Promise<Survey> {
        return this.surveyService.getSurvey(id);
    }
    
    @Query(() => [Survey])
    async getSurveys(): Promise<Survey[]> {
        return this.surveyService.getSurveys();
    }

    // Update
    @Mutation(() => Survey)
    async updateSurvey(
        @Args('id') id: number,
        @Args('surveyInput') surveyInput: UpdateSurveyInput
    ): Promise<Survey> {
        return this.surveyService.updateSurvey(id, surveyInput);
    }

    // Delete
    @Mutation(() => Number)
    async deleteSurvey(@Args('id') id: number): Promise<number> {
        return this.surveyService.deleteSurvey(id);
    }
}