import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Answer } from './answer.entity';
import { AnswerService } from './answer.service';
import { CreateAnswerInput, UpdateAnswerInput } from './answer.input';

@Resolver()
export class AnswerResolver {
    constructor(private readonly answerService: AnswerService) {}
    // Create
    @Mutation(() => Answer)
    async createAnswer(@Args('answerInput') answerInput: CreateAnswerInput): Promise<Answer> {
        return this.answerService.createAnswer(answerInput);
    }
    
    // Read
    @Query(() => Answer)
    async getAnswer(@Args('id') id: number): Promise<Answer> {
        return this.answerService.getAnswer(id);
    }
    
    @Query(() => [Answer])
    async getAnswers(): Promise<Answer[]> {
        return this.answerService.getAnswers();
    }

    // Update
    @Mutation(() => Answer)
    async updateAnswer(
        @Args('id') id: number,
        @Args('answerInput') answerInput: UpdateAnswerInput
    ): Promise<Answer> {
        return this.answerService.updateAnswer(id, answerInput);
    }

    // Delete
    @Mutation(() => Number)
    async deleteAnswer(@Args('id') id: number): Promise<number> {
        return this.answerService.deleteAnswer(id);
    }
}
