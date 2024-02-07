import { Query, Mutation, Resolver, Args } from '@nestjs/graphql';
import { ChoiceService } from './choice.service';
import { Choice } from './choice.entity';
import { CreateChoiceInput, UpdateChoiceInput } from './choice.input';

@Resolver()
export class ChoiceResolver {
    constructor(private readonly choiceService: ChoiceService) {}
    // Create
    @Mutation(() => Choice)
    async createChoice(@Args('ChoiceInput') choiceInput: CreateChoiceInput): Promise<Choice> {
        return this.choiceService.createChoice(choiceInput);
    }
    
    // Read
    @Query(() => Choice)
    async getChoice(@Args('id') id: number): Promise<Choice> {
        return this.choiceService.getChoice(id);
    }
    
    @Query(() => [Choice])
    async getChoices(): Promise<Choice[]> {
        return this.choiceService.getChoices();
    }

    // Update
    @Mutation(() => Choice)
    async updateChoice(
        @Args('id') id: number,
        @Args('ChoiceInput') choiceInput: UpdateChoiceInput
    ): Promise<Choice> {
        return this.choiceService.updateChoice(id, choiceInput);
    }

    // Delete
    @Mutation(() => Number)
    async deleteChoice(@Args('id') id: number): Promise<number> {
        return this.choiceService.deleteChoice(id);
    }
}
