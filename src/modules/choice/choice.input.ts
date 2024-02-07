import { Field, InputType, Int, PartialType } from "@nestjs/graphql";

@InputType()
export class CreateChoiceInput {
    @Field(() => Int, { nullable: true })
    questionId?: number;

    @Field(() => String)
    content: string;

    @Field(() => Int)
    score: number;
}

@InputType()
export class UpdateChoiceInput extends PartialType(CreateChoiceInput) {}